using BiddingPlatform.AuctionService.Domain.Entities;
using BiddingPlatform.AuctionService.Domain.Enums;

public class Payment
{
    public long PaymentId { get; set; }

    public long OrderId { get; set; }
    public BuyOrder Order { get; set; } = null!;

    public string RazorpayOrderId { get; set; } = null!;
    public string? RazorpayPaymentId { get; set; }
    public string? RazorpaySignature { get; set; }

    public decimal Amount { get; set; }
    public PaymentStatus Status { get; set; }

    public DateTime CreatedAt { get; set; }
    public DateTime? PaidAt { get; set; }
}
