using BiddingPlatform.AuctionService.Domain.Entities;

namespace BiddingPlatform.AuctionService.Application.Interfaces.Repositories;

public interface IOrderRepository
{
    Task<BuyOrder?> GetByAuctionIdAsync(long auctionId);

    Task<List<BuyOrder>> GetAllAsync();

    Task<List<BuyOrder>> GetBySellerUserIdAsync(long sellerUserId);

    Task<List<BuyOrder>> GetByBuyerUserIdAsync(long buyerUserId);
    Task<BuyOrder?> GetByIdAsync(long orderId);
    Task AddAsync(BuyOrder order);

    Task UpdateAsync(BuyOrder order);

    Task DeleteAsync(long orderId);
}
