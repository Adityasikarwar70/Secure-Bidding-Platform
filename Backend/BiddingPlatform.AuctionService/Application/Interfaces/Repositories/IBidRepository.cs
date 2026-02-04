using BiddingPlatform.AuctionService.Domain.Entities;

namespace BiddingPlatform.AuctionService.Application.Interfaces.Repositories;

public interface IBidRepository
{
    Task AddAsync(Bid bid);

    Task<Bid?> GetHighestBidAsync(long auctionId);

    Task<List<Bid>> GetByAuctionIdAsync(long auctionId);

    Task<List<Bid>> GetByBidderUserIdAsync(long bidderUserId);
    Task<List<Bid>> GetTopBidsByAuctionAsync(long auctionId, int limit);

}
