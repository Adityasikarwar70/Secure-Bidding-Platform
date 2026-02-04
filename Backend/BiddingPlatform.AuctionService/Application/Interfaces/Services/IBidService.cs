using BiddingPlatform.AuctionService.Domain.Entities;

namespace BiddingPlatform.AuctionService.Application.Interfaces.Services;

public interface IBidService
{
    Task PlaceBidAsync(long auctionId, long bidderUserId, decimal amount);

    Task<Bid?> GetHighestBidAsync(long auctionId);

    Task<List<Bid>> GetBidsByAuctionAsync(long auctionId);

    Task<List<Bid>> GetBidsByUserAsync(long bidderUserId);
    Task<List<Bid>> GetTopBidsByAuctionAsync(long auctionId, int limit);

}
