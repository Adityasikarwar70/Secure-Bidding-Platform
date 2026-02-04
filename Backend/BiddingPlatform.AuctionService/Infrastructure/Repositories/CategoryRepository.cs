using Microsoft.EntityFrameworkCore;
using BiddingPlatform.AuctionService.Application.Interfaces.Repositories;
using BiddingPlatform.AuctionService.Domain.Entities;
using BiddingPlatform.AuctionService.Infrastructure.Persistence;

namespace BiddingPlatform.AuctionService.Infrastructure.Repositories;

public class CategoryRepository : ICategoryRepository
{
    private readonly AuctionDbContext _db;

    public CategoryRepository(AuctionDbContext db)
    {
        _db = db;
    }

    public async Task<List<Category>> GetAllAsync()
    {
        return await _db.Categories
            .OrderBy(c => c.Name)
            .ToListAsync();
    }

    public async Task<Category?> GetByIdAsync(long categoryId)
    {
        return await _db.Categories.FindAsync(categoryId);
    }

    public async Task AddAsync(Category category)
    {
        _db.Categories.Add(category);
        await _db.SaveChangesAsync();
    }

    public async Task UpdateAsync(Category category)
    {
        _db.Categories.Update(category);
        await _db.SaveChangesAsync();
    }

    public async Task DeleteAsync(long categoryId)
    {
        var category = await _db.Categories.FindAsync(categoryId);
        if (category == null)
            return;

        _db.Categories.Remove(category);
        await _db.SaveChangesAsync();
    }
}
