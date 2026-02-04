using Microsoft.EntityFrameworkCore;
using BiddingPlatform.AuctionService.Application.Interfaces.Repositories;
using BiddingPlatform.AuctionService.Infrastructure.Persistence;

namespace BiddingPlatform.AuctionService.Infrastructure.Repositories;

public class PaymentRepository : IPaymentRepository
{
    private readonly AuctionDbContext _db;

    public PaymentRepository(AuctionDbContext db)
    {
        _db = db;
    }

    public async Task AddAsync(Payment payment)
    {
        _db.Payments.Add(payment);
        await _db.SaveChangesAsync();
    }

    public async Task<Payment?> GetByRazorpayOrderIdAsync(string razorpayOrderId)
    {
        return await _db.Payments
            .Include(p => p.Order)
            .FirstOrDefaultAsync(p => p.RazorpayOrderId == razorpayOrderId);
    }

    public async Task<Payment?> GetByOrderIdAsync(long orderId)
    {
        return await _db.Payments
            .FirstOrDefaultAsync(p => p.OrderId == orderId);
    }

    public async Task UpdateAsync(Payment payment)
    {
        _db.Payments.Update(payment);
        await _db.SaveChangesAsync();
    }
}
