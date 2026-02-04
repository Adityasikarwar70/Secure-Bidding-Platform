using BiddingPlatform.AuctionService.Application.DTOs.Auctions;
using BiddingPlatform.AuctionService.Domain.Enums;

public interface IAuctionService
{
    Task<AuctionResponse?> GetByIdAsync(long auctionId);

    Task<List<AuctionResponse>> GetAllAsync();

    Task<List<AuctionResponse>> GetByStatusAsync(AuctionStatus status);

    Task<List<AuctionResponse>> GetLiveByCategoryAsync(long categoryId);

    Task<List<AuctionResponse>> GetUpcomingByCategoryAsync(long categoryId);

    Task<List<AuctionWithHighestBidResponse>> GetBySellerIdAsync(long sellerUserId);
    Task DecideAuctionAsync(
    long auctionId,
    long actorUserId,
    bool isAdmin,
    bool approve);

}
