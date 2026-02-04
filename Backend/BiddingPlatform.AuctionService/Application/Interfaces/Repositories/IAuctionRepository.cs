using BiddingPlatform.AuctionService.Domain.Entities;
using BiddingPlatform.AuctionService.Domain.Enums;

namespace BiddingPlatform.AuctionService.Application.Interfaces.Repositories;

public interface IAuctionRepository
{
    Task<Auction?> GetByIdAsync(long auctionId);
    Task<Auction?> GetByProductIdAsync(long productId);
    Task<List<Auction>> GetBySellerIdAsync(long sellerUserId);

    Task<List<Auction>> GetAllAsync();
    Task<List<Auction>> GetByStatusAsync(AuctionStatus status);

    Task<List<Auction>> GetByCategoryAndStatusAsync(long categoryId,AuctionStatus status);
    Task AddAsync(Auction auction);
    Task UpdateAsync(Auction auction);
    Task DeleteAsync(Auction auction);
}
