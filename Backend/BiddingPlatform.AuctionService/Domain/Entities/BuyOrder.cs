using BiddingPlatform.AuctionService.Domain.Enums;

namespace BiddingPlatform.AuctionService.Domain.Entities;

public class BuyOrder
{
    public long OrderId { get; set; }

    public long AuctionId { get; set; }

    public long BuyerUserId { get; set; }
    public long SellerUserId { get; set; }

    public decimal Amount { get; set; }

    public BuyOrderStatus Status { get; set; }

    public DateTime CreatedAt { get; set; }
    public ICollection<Payment> Payments { get; set; } = new List<Payment>();

}
