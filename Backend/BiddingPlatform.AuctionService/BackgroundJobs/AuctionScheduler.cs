using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using BiddingPlatform.AuctionService.Infrastructure.Persistence;
using BiddingPlatform.AuctionService.Domain.Enums;
using BiddingPlatform.AuctionService.Domain.Entities;

namespace BiddingPlatform.AuctionService.BackgroundJobs;

public class AuctionScheduler : BackgroundService
{
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly ILogger<AuctionScheduler> _logger;

    public AuctionScheduler(
        IServiceScopeFactory scopeFactory,
        ILogger<AuctionScheduler> logger)
    {
        _scopeFactory = scopeFactory;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("AuctionScheduler started.");

        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                await ProcessAuctionsAsync(stoppingToken);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "AuctionScheduler execution failed.");
            }

            await Task.Delay(TimeSpan.FromMinutes(1), stoppingToken);
        }

        _logger.LogInformation("AuctionScheduler stopped.");
    }

    private async Task ProcessAuctionsAsync(CancellationToken token)
    {
        using var scope = _scopeFactory.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AuctionDbContext>();

        var now = DateTime.UtcNow;
        _logger.LogInformation("AuctionScheduler tick at {Time}", now);

        await StartScheduledAuctionsAsync(db, now, token);
        await CloseExpiredAuctionsAsync(db, now, token);
        await ProcessClosedAuctionsAsync(db, token);
    }

    // Scheduled → Live
    private async Task StartScheduledAuctionsAsync(
        AuctionDbContext db,
        DateTime now,
        CancellationToken token)
    {
        var affected = await db.Auctions
            .Where(a =>
                a.AuctionStatus == AuctionStatus.Scheduled &&
                a.StartTime <= now)
            .ExecuteUpdateAsync(
                setters => setters
                    .SetProperty(a => a.AuctionStatus, AuctionStatus.Live),
                token);

        if (affected > 0)
        {
            _logger.LogInformation("Started {Count} auction(s).", affected);
        }
    }

    // Live → Closed
    private async Task CloseExpiredAuctionsAsync(
        AuctionDbContext db,
        DateTime now,
        CancellationToken token)
    {
        var affected = await db.Auctions
            .Where(a =>
                a.AuctionStatus == AuctionStatus.Live &&
                a.EndTime <= now)
            .ExecuteUpdateAsync(
                setters => setters
                    .SetProperty(a => a.AuctionStatus, AuctionStatus.Closed),
                token);

        if (affected > 0)
        {
            _logger.LogInformation("Closed {Count} auction(s).", affected);
        }
    }

    private async Task ProcessClosedAuctionsAsync(
        AuctionDbContext db,
        CancellationToken token)
    {
        var auctionIds = await db.Auctions
            .Where(a =>
                a.AuctionStatus == AuctionStatus.Closed &&
                a.ResultStatus == AuctionResultStatus.None)
            .Select(a => a.AuctionId)
            .ToListAsync(token);

        foreach (var auctionId in auctionIds)
        {
            await ProcessSingleAuctionAsync(db, auctionId, token);
        }
    }

    private async Task ProcessSingleAuctionAsync(
    AuctionDbContext db,
    long auctionId,
    CancellationToken token)
    {
        await using var transaction =
            await db.Database.BeginTransactionAsync(token);

        var highestBid = await db.Bids
            .Where(b => b.AuctionId == auctionId)
            .OrderByDescending(b => b.BidAmount)
            .FirstOrDefaultAsync(token);

        var auction = await db.Auctions
            .FirstAsync(a => a.AuctionId == auctionId, token);

        // No bids
        if (highestBid == null)
        {
            auction.ResultStatus = AuctionResultStatus.NoBids;

            await db.SaveChangesAsync(token);
            await transaction.CommitAsync(token);

            _logger.LogInformation(
                "Auction {AuctionId} closed with no bids.",
                auctionId);

            return;
        }

        // Has bids
        var product = await db.Products
            .FirstAsync(p => p.ProductId == auction.ProductId, token);

        if (highestBid.BidAmount >= product.ExpectedPrice)
        {

            db.BuyOrders.Add(new BuyOrder
            {
                AuctionId = auctionId,
                BuyerUserId = highestBid.BidderUserId,
                SellerUserId = product.SellerUserId,
                Amount = highestBid.BidAmount,
                Status = BuyOrderStatus.Pending,
                CreatedAt = DateTime.UtcNow
            });

            auction.ResultStatus = AuctionResultStatus.AutoSold;

            _logger.LogInformation(
                "Auction {AuctionId} auto-sold at {Amount}.",
                auctionId,
                highestBid.BidAmount);
        }
        else
        {
            // Wait for seller decision
            auction.ResultStatus = AuctionResultStatus.AwaitingSellerApproval;

            _logger.LogInformation(
                "Auction {AuctionId} awaiting seller approval. Highest bid {Amount}.",
                auctionId,
                highestBid.BidAmount);
        }

        await db.SaveChangesAsync(token);
        await transaction.CommitAsync(token);
    }

}
