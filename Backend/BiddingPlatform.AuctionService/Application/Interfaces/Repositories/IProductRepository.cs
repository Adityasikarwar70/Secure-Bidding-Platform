using BiddingPlatform.AuctionService.Domain.Entities;
using BiddingPlatform.AuctionService.Domain.Enums;

namespace BiddingPlatform.AuctionService.Application.Interfaces.Repositories;

public interface IProductRepository
{
    Task<Product?> GetByIdAsync(long productId);

    Task<List<Product>> GetAllAsync();

    Task<List<Product>> GetByStatusAsync(ApprovalStatus status);

    Task<List<Product>> GetByCategoryAsync(long categoryId);

    Task<List<Product>> GetByCategoryAndStatusAsync(long categoryId,ApprovalStatus status);
    Task<List<Product>> GetBySellerUserIdAsync(long sellerUserId);

    Task AddAsync(Product product);

    Task UpdateAsync(Product product);

    Task UpdateCategoryAsync(long productId, long? categoryId);
}
