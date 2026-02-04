namespace BiddingPlatform.AuctionService.Application.DTOs.Payments;

public class VerifyPaymentRequest
{
    public long OrderId { get; set; }

    public string RazorpayOrderId { get; set; } = null!;
    public string RazorpayPaymentId { get; set; } = null!;
    public string RazorpaySignature { get; set; } = null!;
}
