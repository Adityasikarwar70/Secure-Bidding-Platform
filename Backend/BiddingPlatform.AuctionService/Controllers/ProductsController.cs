using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using BiddingPlatform.AuctionService.Application.Interfaces.Services;
using BiddingPlatform.AuctionService.Application.DTOs.Products;
using BiddingPlatform.AuctionService.Domain.Enums;

namespace BiddingPlatform.AuctionService.Controllers;

[ApiController]
[Route("api/products")]
public class ProductsController : ControllerBase
{
    private readonly IProductService _productService;

    public ProductsController(IProductService productService)
    {
        _productService = productService;
    }

    // GET api/products/{id}
    [AllowAnonymous]
    [HttpGet("{id:long}")]
    public async Task<IActionResult> GetById(long id)
    {
        var product = await _productService.GetByIdWithImagesAsync(id);
        if (product == null)
            return NotFound();

        return Ok(product);
    }

    // GET api/products/seller/{sellerId}
    [Authorize(Roles = "ADMIN,SELLER")]
    [HttpGet("seller/{sellerId:long}")]
    public async Task<IActionResult> GetBySeller(long sellerId)
    {
        long loggedInUserId = long.Parse(
            User.FindFirst("userId")!.Value
        );

        bool isAdmin = User.IsInRole("ADMIN");

        // Seller can only view own products
        if (!isAdmin && sellerId != loggedInUserId)
            return Forbid();

        var products = await _productService.GetBySellerWithImagesAsync(sellerId);

        return Ok(new
        {
            success = true,
            count = products.Count,
            data = products
        });
    }

    // GET api/products
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var products = await _productService.GetAllWithImagesAsync();
        return Ok(products);
    }

    // GET api/products/status/{status}
    [HttpGet("status/{status}")]
    public async Task<IActionResult> GetByStatus(ApprovalStatus status)
    {
        var products = await _productService.GetByStatusWithImagesAsync(status);
        return Ok(products);
    }

    // GET api/products/category/{categoryId}
    [HttpGet("category/{categoryId:long}")]
    public async Task<IActionResult> GetByCategory(long categoryId)
    {
        var products = await _productService.GetByCategoryWithImagesAsync(categoryId);
        return Ok(products);
    }

    // POST api/products
    [Authorize(Roles = "SELLER")]
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateProductRequest request)
    {
        long sellerUserId = long.Parse(
            User.FindFirst("userId")!.Value
        );

        var product = new Domain.Entities.Product
        {
            SellerUserId = sellerUserId,
            Title = request.Title,
            Description = request.Description,
            ExpectedPrice = request.ExpectedPrice,
            CategoryId = request.CategoryId,
            DurationDays = request.DurationDays,
            ApprovalStatus = ApprovalStatus.Pending,
            CreatedAt = DateTime.UtcNow
        };

        await _productService.CreateAsync(product, request.ImageUrls);

        return CreatedAtAction(
            nameof(GetById),
            new { id = product.ProductId },
            null);
    }

    // PUT api/products/{id}/category
    [Authorize(Roles = "ADMIN")]
    [HttpPut("{id:long}/category")]
    public async Task<IActionResult> UpdateCategory(
        long id,
        [FromBody] UpdateProductCategoryRequest request)
    {
        await _productService.UpdateCategoryAsync(id, request.CategoryId);

        return Ok(new
        {
            success = true,
            message = "Product category updated successfully."
        });
    }

    // PUT api/products/{id}/status
    [Authorize(Roles = "ADMIN")]
    [HttpPut("{id:long}/status")]
    public async Task<IActionResult> UpdateStatus(
        long id,
        [FromBody] UpdateProductStatusRequest request)
    {
        await _productService.UpdateStatusAsync(
            id,
            request.Status,
            request.BasePrice,
            request.Remark);

        return Ok(new
        {
            success = true,
            message = "Product status updated successfully."
        });
    }
}
