using Microsoft.EntityFrameworkCore;
using BiddingPlatform.AuctionService.Application.Interfaces.Repositories;
using BiddingPlatform.AuctionService.Domain.Entities;
using BiddingPlatform.AuctionService.Domain.Enums;
using BiddingPlatform.AuctionService.Infrastructure.Persistence;

namespace BiddingPlatform.AuctionService.Infrastructure.Repositories;

public class AuctionRepository : IAuctionRepository
{
    private readonly AuctionDbContext _db;

    public AuctionRepository(AuctionDbContext db)
    {
        _db = db;
    }

    public Task<Auction?> GetByIdAsync(long auctionId)
        => _db.Auctions.FindAsync(auctionId).AsTask();
    public async Task<List<Auction>> GetBySellerIdAsync(long sellerUserId)
    {
        return await _db.Auctions
            .Join(
                _db.Products,
                auction => auction.ProductId,
                product => product.ProductId,
                (auction, product) => new { auction, product }
            )
            .Where(x => x.product.SellerUserId == sellerUserId)
            .Select(x => x.auction)
            .ToListAsync();
    }

    public Task<List<Auction>> GetByCategoryAndStatusAsync(
    long categoryId,
    AuctionStatus status)
    {
        return _db.Auctions
            .Where(a =>
                a.CategoryId == categoryId &&
                a.AuctionStatus == status)
            .ToListAsync();
    }

    public Task<Auction?> GetByProductIdAsync(long productId)
        => _db.Auctions.FirstOrDefaultAsync(a => a.ProductId == productId);

    public Task<List<Auction>> GetAllAsync()
        => _db.Auctions.ToListAsync();

    public Task<List<Auction>> GetByStatusAsync(AuctionStatus status)
        => _db.Auctions
              .Where(a => a.AuctionStatus == status)
              .ToListAsync();
    public async Task UpdateAsync(Auction auction)
    {
        _db.Auctions.Attach(auction);
        _db.Entry(auction).State = EntityState.Modified;

        await _db.SaveChangesAsync();
    }


    public async Task AddAsync(Auction auction)
    {
        _db.Auctions.Add(auction);
        await _db.SaveChangesAsync();
    }

    public async Task DeleteAsync(Auction auction)
    {
        _db.Auctions.Remove(auction);
        await _db.SaveChangesAsync();
    }
}
