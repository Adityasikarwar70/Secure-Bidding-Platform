using BiddingPlatform.AuctionService.Application.Interfaces.Repositories;
using BiddingPlatform.AuctionService.Application.Interfaces.Services;
using BiddingPlatform.AuctionService.Domain.Entities;
using BiddingPlatform.AuctionService.Domain.Enums;

namespace BiddingPlatform.AuctionService.Application.Services;

public class BidService : IBidService
{
    private readonly IBidRepository _bidRepository;
    private readonly IAuctionRepository _auctionRepository;

    public BidService(
        IBidRepository bidRepository,
        IAuctionRepository auctionRepository)
    {
        _bidRepository = bidRepository;
        _auctionRepository = auctionRepository;
    }

    public async Task PlaceBidAsync(long auctionId, long bidderUserId, decimal amount)
    {
        var auction = await _auctionRepository.GetByIdAsync(auctionId)
            ?? throw new InvalidOperationException("Auction not found.");

        if (auction.AuctionStatus != AuctionStatus.Live)
            throw new InvalidOperationException("Auction is not live.");

        var bid = new Bid
        {
            AuctionId = auctionId,
            BidderUserId = bidderUserId,
            BidAmount = amount,
            CreatedAt = DateTime.UtcNow
        };

        await _bidRepository.AddAsync(bid);
    }

    public async Task<(List<Bid> bids, long productId)> GetBidsWithProductAsync(
        Func<Task<List<Bid>>> bidFetcher,
        long auctionId)
    {
        var auction = await _auctionRepository.GetByIdAsync(auctionId)
            ?? throw new InvalidOperationException("Auction not found.");

        var bids = await bidFetcher();

        return (bids, auction.ProductId);
    }

    public Task<Bid?> GetHighestBidAsync(long auctionId)
        => _bidRepository.GetHighestBidAsync(auctionId);

    public Task<List<Bid>> GetBidsByAuctionAsync(long auctionId)
        => _bidRepository.GetByAuctionIdAsync(auctionId);

    public Task<List<Bid>> GetTopBidsByAuctionAsync(long auctionId, int limit)
        => _bidRepository.GetTopBidsByAuctionAsync(auctionId, limit);

    public Task<List<Bid>> GetBidsByUserAsync(long bidderUserId)
        => _bidRepository.GetByBidderUserIdAsync(bidderUserId);
}

