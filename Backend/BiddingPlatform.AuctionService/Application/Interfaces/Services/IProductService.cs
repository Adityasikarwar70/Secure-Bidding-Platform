using BiddingPlatform.AuctionService.Domain.Entities;
using BiddingPlatform.AuctionService.Domain.Enums;
using BiddingPlatform.AuctionService.Application.DTOs.Products;

namespace BiddingPlatform.AuctionService.Application.Interfaces.Services;

public interface IProductService
{
    Task<Product?> GetByIdAsync(long productId);
    Task<List<Product>> GetAllAsync();
    Task<List<Product>> GetByStatusAsync(ApprovalStatus status);
    Task<List<Product>> GetByCategoryAsync(long categoryId);
    Task<List<Product>> GetByCategoryAndStatusAsync(long categoryId,ApprovalStatus status);
    Task UpdateAsync(Product product);
    Task UpdateCategoryAsync(long productId, long? categoryId);
    Task UpdateStatusAsync(long productId, ApprovalStatus status, decimal basePrice, string? remark);
    Task<List<ProductResponse>> GetBySellerWithImagesAsync(long sellerUserId);
    Task<ProductResponse?> GetByIdWithImagesAsync(long productId);

    Task<List<ProductResponse>> GetAllWithImagesAsync();

    Task<List<ProductResponse>> GetByStatusWithImagesAsync(ApprovalStatus status);

    Task<List<ProductResponse>> GetByCategoryWithImagesAsync(long categoryId);
    
    Task CreateAsync(Product product, List<string> imageUrls);
}
