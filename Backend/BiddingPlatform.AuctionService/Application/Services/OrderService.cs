using BiddingPlatform.AuctionService.Application.DTOs.Orders;
using BiddingPlatform.AuctionService.Application.Interfaces.Repositories;
using BiddingPlatform.AuctionService.Application.Interfaces.Services;
using BiddingPlatform.AuctionService.Domain.Entities;

namespace BiddingPlatform.AuctionService.Application.Services;

public class OrderService : IOrderService
{
    private readonly IOrderRepository _orderRepository;
    private readonly IAuctionService _auctionService;

    public OrderService(
        IOrderRepository orderRepository,
        IAuctionService auctionService)
    {
        _orderRepository = orderRepository;
        _auctionService = auctionService;
    }

    public Task<BuyOrder?> GetByAuctionIdAsync(long auctionId)
        => _orderRepository.GetByAuctionIdAsync(auctionId);

    public async Task<List<OrderResponse>> GetAllWithAuctionAsync()
    {
        var orders = await _orderRepository.GetAllAsync();
        return await MapOrdersAsync(orders);
    }

    public async Task<List<OrderResponse>> GetByBuyerWithAuctionAsync(long buyerUserId)
    {
        var orders = await _orderRepository.GetByBuyerUserIdAsync(buyerUserId);
        return await MapOrdersAsync(orders);
    }

    public async Task<List<OrderResponse>> GetBySellerWithAuctionAsync(long sellerUserId)
    {
        var orders = await _orderRepository.GetBySellerUserIdAsync(sellerUserId);
        return await MapOrdersAsync(orders);
    }

    public Task CreateAsync(BuyOrder order)
        => _orderRepository.AddAsync(order);

    public Task UpdateAsync(BuyOrder order)
        => _orderRepository.UpdateAsync(order);

    public Task DeleteAsync(long orderId)
        => _orderRepository.DeleteAsync(orderId);

    private async Task<List<OrderResponse>> MapOrdersAsync(List<BuyOrder> orders)
    {
        var result = new List<OrderResponse>();

        foreach (var order in orders)
        {
            var auction = await _auctionService.GetByIdAsync(order.AuctionId)
                ?? throw new InvalidOperationException("Auction not found");

            result.Add(new OrderResponse
            {
                OrderId = order.OrderId,
                Amount = order.Amount,
                BuyerUserId = order.BuyerUserId,
                SellerUserId = order.SellerUserId,
                Status = order.Status,
                Auction = auction
            });
        }

        return result;
    }
}
