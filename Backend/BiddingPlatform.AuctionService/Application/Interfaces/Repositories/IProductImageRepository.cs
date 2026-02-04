using BiddingPlatform.AuctionService.Domain.Entities;

namespace BiddingPlatform.AuctionService.Application.Interfaces.Repositories;

public interface IProductImageRepository
{
    Task AddRangeAsync(List<ProductImage> images);
    Task<List<ProductImage>> GetByProductIdAsync(long productId);
}
