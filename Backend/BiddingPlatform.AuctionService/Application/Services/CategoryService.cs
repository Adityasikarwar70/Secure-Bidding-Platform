using BiddingPlatform.AuctionService.Application.Interfaces.Repositories;
using BiddingPlatform.AuctionService.Application.Interfaces.Services;
using BiddingPlatform.AuctionService.Domain.Entities;

namespace BiddingPlatform.AuctionService.Application.Services;

public class CategoryService : ICategoryService
{
    private readonly ICategoryRepository _categoryRepository;

    public CategoryService(ICategoryRepository categoryRepository)
    {
        _categoryRepository = categoryRepository;
    }

    public Task<List<Category>> GetAllAsync()
        => _categoryRepository.GetAllAsync();

    public Task<Category?> GetByIdAsync(long categoryId)
        => _categoryRepository.GetByIdAsync(categoryId);

    public Task CreateAsync(Category category)
        => _categoryRepository.AddAsync(category);

    public Task UpdateAsync(Category category)
        => _categoryRepository.UpdateAsync(category);

    public Task DeleteAsync(long categoryId)
        => _categoryRepository.DeleteAsync(categoryId);


}
