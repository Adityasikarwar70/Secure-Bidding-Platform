using BiddingPlatform.AuctionService.Domain.Entities;

namespace BiddingPlatform.AuctionService.Application.Interfaces.Repositories;

public interface ICategoryRepository
{
    Task<List<Category>> GetAllAsync();

    Task<Category?> GetByIdAsync(long categoryId);

    Task AddAsync(Category category);

    Task UpdateAsync(Category category);

    Task DeleteAsync(long categoryId);
}
