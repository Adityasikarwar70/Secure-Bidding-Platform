using BiddingPlatform.AuctionService.Application.Interfaces.Repositories;
using BiddingPlatform.AuctionService.Domain.Entities;
using BiddingPlatform.AuctionService.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace BiddingPlatform.AuctionService.Infrastructure.Repositories;

public class ProductImageRepository : IProductImageRepository
{
    private readonly AuctionDbContext _db;

    public ProductImageRepository(AuctionDbContext db)
    {
        _db = db;
    }

    public async Task AddRangeAsync(List<ProductImage> images)
    {
        _db.ProductImages.AddRange(images);
        await _db.SaveChangesAsync();
    }

    public Task<List<ProductImage>> GetByProductIdAsync(long productId)
    {
        return _db.ProductImages
            .Where(i => i.ProductId == productId)
            .ToListAsync();
    }
}
