using BiddingPlatform.AuctionService.Domain.Entities;

namespace BiddingPlatform.AuctionService.Application.Interfaces.Services;

public interface ICategoryService
{
    Task<List<Category>> GetAllAsync();

    Task<Category?> GetByIdAsync(long categoryId);

    Task CreateAsync(Category category);

    Task UpdateAsync(Category category);

    Task DeleteAsync(long categoryId);
}
