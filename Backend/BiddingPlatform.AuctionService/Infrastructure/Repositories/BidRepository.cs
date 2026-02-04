using BiddingPlatform.AuctionService.Application.Interfaces.Repositories;
using BiddingPlatform.AuctionService.Domain.Entities;
using BiddingPlatform.AuctionService.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace BiddingPlatform.AuctionService.Infrastructure.Repositories;

public class BidRepository : IBidRepository
{
    private readonly AuctionDbContext _db;

    public BidRepository(AuctionDbContext db)
    {
        _db = db;
    }

    public async Task AddAsync(Bid bid)
    {
        _db.Bids.Add(bid);
        await _db.SaveChangesAsync();
    }

    public async Task<Bid?> GetHighestBidAsync(long auctionId)
        => await _db.Bids
            .Where(b => b.AuctionId == auctionId)
            .OrderByDescending(b => b.BidAmount)
            .FirstOrDefaultAsync();

    public async Task<List<Bid>> GetByAuctionIdAsync(long auctionId)
        => await _db.Bids
            .Where(b => b.AuctionId == auctionId)
            .ToListAsync();

    public async Task<List<Bid>> GetByBidderUserIdAsync(long bidderUserId)
        => await _db.Bids
            .Where(b => b.BidderUserId == bidderUserId)
            .ToListAsync();
    public async Task<List<Bid>> GetTopBidsByAuctionAsync(long auctionId, int limit)
    {
        return await _db.Bids
            .Where(b => b.AuctionId == auctionId)
            .OrderByDescending(b => b.BidAmount)
            .Take(limit)
            .ToListAsync();
    }

}
