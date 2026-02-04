using Microsoft.EntityFrameworkCore;
using BiddingPlatform.AuctionService.Application.Interfaces.Repositories;
using BiddingPlatform.AuctionService.Domain.Entities;
using BiddingPlatform.AuctionService.Domain.Enums;
using BiddingPlatform.AuctionService.Infrastructure.Persistence;

namespace BiddingPlatform.AuctionService.Infrastructure.Repositories;

public class ProductRepository : IProductRepository
{
    private readonly AuctionDbContext _db;

    public ProductRepository(AuctionDbContext db)
    {
        _db = db;
    }

    public async Task<Product?> GetByIdAsync(long productId)
        => await _db.Products.FindAsync(productId);

    public async Task<List<Product>> GetAllAsync()
        => await _db.Products.ToListAsync();
    public Task<List<Product>> GetBySellerUserIdAsync(long sellerUserId)
    {
        return _db.Products
            .Where(p => p.SellerUserId == sellerUserId)
            .ToListAsync();
    }

    public async Task<List<Product>> GetByStatusAsync(ApprovalStatus status)
        => await _db.Products
            .Where(p => p.ApprovalStatus == status)
            .ToListAsync();

    public async Task<List<Product>> GetByCategoryAsync(long categoryId)
        => await _db.Products
            .Where(p => p.CategoryId == categoryId)
            .ToListAsync();

    public async Task<List<Product>> GetByCategoryAndStatusAsync(
        long categoryId, ApprovalStatus status)
        => await _db.Products
            .Where(p => p.CategoryId == categoryId &&
                        p.ApprovalStatus == status)
            .ToListAsync();

    public async Task AddAsync(Product product)
    {
        _db.Products.Add(product);
        await _db.SaveChangesAsync();
    }

    public async Task UpdateAsync(Product product)
    {
        _db.Products.Update(product);
        await _db.SaveChangesAsync();
    }

    public async Task UpdateCategoryAsync(long productId, long? categoryId)
    {
        var product = await _db.Products.FindAsync(productId);
        if (product == null) return;

        product.CategoryId = categoryId;
        await _db.SaveChangesAsync();
    }
}
