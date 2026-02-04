using BiddingPlatform.AuctionService.Application.DTOs.Orders;
using BiddingPlatform.AuctionService.Domain.Entities;

namespace BiddingPlatform.AuctionService.Application.Interfaces.Services;

public interface IOrderService
{
    Task<BuyOrder?> GetByAuctionIdAsync(long auctionId);
    Task<List<OrderResponse>> GetAllWithAuctionAsync();
    Task<List<OrderResponse>> GetByBuyerWithAuctionAsync(long buyerUserId);
    Task<List<OrderResponse>> GetBySellerWithAuctionAsync(long sellerUserId);
    Task CreateAsync(BuyOrder order);

    Task UpdateAsync(BuyOrder order);

    Task DeleteAsync(long orderId);
}
