namespace BiddingPlatform.AuctionService.Application.Interfaces.Repositories;

public interface IPaymentRepository
{
    Task AddAsync(Payment payment);
    Task<Payment?> GetByRazorpayOrderIdAsync(string razorpayOrderId);
    Task<Payment?> GetByOrderIdAsync(long orderId);
    Task UpdateAsync(Payment payment);
}
