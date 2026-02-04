namespace BiddingPlatform.AuctionService.Application.DTOs.Orders;

using BiddingPlatform.AuctionService.Application.DTOs.Auctions;
using BiddingPlatform.AuctionService.Domain.Enums;

public class OrderResponse
{
    public long OrderId { get; set; }
    public decimal Amount { get; set; }

    public long BuyerUserId { get; set; }
    public long SellerUserId { get; set; }
    public BuyOrderStatus Status { get; set; }  
    public AuctionResponse Auction { get; set; } = default!;
}

