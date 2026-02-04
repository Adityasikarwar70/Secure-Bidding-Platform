using Microsoft.EntityFrameworkCore;
using BiddingPlatform.AuctionService.Application.Interfaces.Repositories;
using BiddingPlatform.AuctionService.Domain.Entities;
using BiddingPlatform.AuctionService.Infrastructure.Persistence;

namespace BiddingPlatform.AuctionService.Infrastructure.Repositories;

public class OrderRepository : IOrderRepository
{
    private readonly AuctionDbContext _db;

    public OrderRepository(AuctionDbContext db)
    {
        _db = db;
    }

    public async Task AddAsync(BuyOrder order)
    {
        _db.BuyOrders.Add(order);
        await _db.SaveChangesAsync();
    }

    public async Task UpdateAsync(BuyOrder order)
    {
        _db.BuyOrders.Update(order);
        await _db.SaveChangesAsync();
    }

    public async Task DeleteAsync(long orderId)
    {
        var order = await _db.BuyOrders.FindAsync(orderId);
        if (order == null)
            return;

        _db.BuyOrders.Remove(order);
        await _db.SaveChangesAsync();
    }

    public async Task<List<BuyOrder>> GetAllAsync()
    {
        return await _db.BuyOrders
            .OrderByDescending(o => o.CreatedAt)
            .ToListAsync();
    }

    public async Task<BuyOrder?> GetByAuctionIdAsync(long auctionId)
    {
        return await _db.BuyOrders
            .FirstOrDefaultAsync(o => o.AuctionId == auctionId);
    }

    public async Task<BuyOrder?> GetByIdAsync(long orderId)
    {
        return await _db.BuyOrders.FindAsync(orderId);
    }


    public async Task<List<BuyOrder>> GetByBuyerUserIdAsync(long buyerUserId)
    {
        return await _db.BuyOrders
            .Where(o => o.BuyerUserId == buyerUserId)
            .OrderByDescending(o => o.CreatedAt)
            .ToListAsync();
    }

    public async Task<List<BuyOrder>> GetBySellerUserIdAsync(long sellerUserId)
    {
        return await _db.BuyOrders
            .Where(o => o.SellerUserId == sellerUserId)
            .OrderByDescending(o => o.CreatedAt)
            .ToListAsync();
    }
}
