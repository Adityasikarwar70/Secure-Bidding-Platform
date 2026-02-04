using BiddingPlatform.AuctionService.Application.DTOs.Products;
using BiddingPlatform.AuctionService.Application.Interfaces.Repositories;
using BiddingPlatform.AuctionService.Application.Interfaces.Services;
using BiddingPlatform.AuctionService.Domain.Entities;
using BiddingPlatform.AuctionService.Domain.Enums;

namespace BiddingPlatform.AuctionService.Application.Services;

public class ProductService : IProductService
{
    private readonly IProductRepository _productRepository;
    private readonly IAuctionRepository _auctionRepository;
    private readonly IProductImageRepository _productImageRepository;

    public ProductService(
        IProductRepository productRepository,
        IAuctionRepository auctionRepository,
        IProductImageRepository productImageRepository)
    {
        _productRepository = productRepository;
        _auctionRepository = auctionRepository;
        _productImageRepository = productImageRepository;
    }

    public Task<Product?> GetByIdAsync(long productId)
        => _productRepository.GetByIdAsync(productId);

    public Task<List<Product>> GetAllAsync()
        => _productRepository.GetAllAsync();

    public Task<List<Product>> GetByStatusAsync(ApprovalStatus status)
        => _productRepository.GetByStatusAsync(status);

    public Task<List<Product>> GetByCategoryAsync(long categoryId)
        => _productRepository.GetByCategoryAsync(categoryId);

    public Task<List<Product>> GetByCategoryAndStatusAsync(
        long categoryId,
        ApprovalStatus status)
        => _productRepository.GetByCategoryAndStatusAsync(categoryId, status);

    public async Task CreateAsync(Product product, List<string> imageUrls)
    {
        await _productRepository.AddAsync(product);

        if (imageUrls == null || imageUrls.Count == 0)
            return;

        var images = imageUrls.Select(url => new ProductImage
        {
            ProductId = product.ProductId,
            ImageUrl = url,
            CreatedAt = DateTime.UtcNow
        }).ToList();

        await _productImageRepository.AddRangeAsync(images);
    }

    public Task UpdateAsync(Product product)
        => _productRepository.UpdateAsync(product);

    public Task UpdateCategoryAsync(long productId, long? categoryId)
        => _productRepository.UpdateCategoryAsync(productId, categoryId);

    public async Task UpdateStatusAsync(
    long productId,
    ApprovalStatus status,
    decimal basePrice,
    string? remark)
    {
        var product = await _productRepository.GetByIdAsync(productId);
        if (product == null)
            throw new InvalidOperationException("Product not found.");

        product.Remark = remark ?? string.Empty;

        if (status == ApprovalStatus.Approved)
        {
            if (basePrice <= 0)
                throw new InvalidOperationException("Base price must be greater than zero.");

            product.BasePrice = basePrice;
            product.ApprovedAt = DateTime.UtcNow;

            var startTime = product.ApprovedAt.Value.AddDays(1);
            var endTime = startTime.AddDays(product.DurationDays);
            //var startTime = product.ApprovedAt.Value.AddMinutes(6);
            //var endTime = startTime.AddMinutes(6);
            var auction = new Auction
            {
                ProductId = product.ProductId,
                CategoryId = product.CategoryId,
                StartingPrice = basePrice,
                StartTime = startTime,
                EndTime = endTime,
                AuctionStatus = AuctionStatus.Scheduled,
                ResultStatus = AuctionResultStatus.None,
                CreatedAt = DateTime.UtcNow
            };

            await _auctionRepository.AddAsync(auction);
        }

        product.ApprovalStatus = status;
        await _productRepository.UpdateAsync(product);
    }


    public async Task<ProductResponse?> GetByIdWithImagesAsync(long productId)
    {
        var product = await _productRepository.GetByIdAsync(productId);
        if (product == null)
            return null;

        var images = await _productImageRepository.GetByProductIdAsync(productId);

        return MapToResponse(product, images);
    }

    public async Task<List<ProductResponse>> GetAllWithImagesAsync()
    {
        var products = await _productRepository.GetAllAsync();
        return await MapProducts(products);
    }

    public async Task<List<ProductResponse>> GetByStatusWithImagesAsync(ApprovalStatus status)
    {
        var products = await _productRepository.GetByStatusAsync(status);
        return await MapProducts(products);
    }

    public async Task<List<ProductResponse>> GetByCategoryWithImagesAsync(long categoryId)
    {
        var products = await _productRepository.GetByCategoryAsync(categoryId);
        return await MapProducts(products);
    }

    private async Task<List<ProductResponse>> MapProducts(List<Product> products)
    {
        var responses = new List<ProductResponse>();

        foreach (var product in products)
        {
            var images = await _productImageRepository
                .GetByProductIdAsync(product.ProductId);

            responses.Add(MapToResponse(product, images));
        }

        return responses;
    }
    public async Task<List<ProductResponse>> GetBySellerWithImagesAsync(long sellerUserId)
    {
        var products = await _productRepository.GetBySellerUserIdAsync(sellerUserId);
        return await MapProducts(products);
    }

    private static ProductResponse MapToResponse(
        Product product,
        List<ProductImage> images)
    {
        return new ProductResponse
        {
            ProductId = product.ProductId,
            Title = product.Title,
            Description = product.Description,
            BasePrice = product.BasePrice,
            ExpectedPrice = product.ExpectedPrice,
            CategoryId = product.CategoryId,
            ApprovalStatus = product.ApprovalStatus,
            Remark = product.Remark,
            SellerUserId= product.SellerUserId,
            ImageUrls = images.Select(i => i.ImageUrl).ToList()
        };
    }
}
