namespace BiddingPlatform.AuctionService.Application.Interfaces.Services;

public interface IPaymentService
{
    Task<object> CreatePaymentAsync(long orderId, long loggedInUserId);
    Task VerifyPaymentAsync(
        long orderId,
        long loggedInUserId,
        string razorpayOrderId,
        string razorpayPaymentId,
        string razorpaySignature);
}

