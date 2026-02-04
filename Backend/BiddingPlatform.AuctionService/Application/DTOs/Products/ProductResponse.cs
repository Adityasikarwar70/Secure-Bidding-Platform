using BiddingPlatform.AuctionService.Domain.Enums;

namespace BiddingPlatform.AuctionService.Application.DTOs.Products;

public class ProductResponse
{
    public long ProductId { get; set; }
    public string Title { get; set; } = default!;
    public string? Description { get; set; }
    public decimal BasePrice { get; set; }
    public decimal ExpectedPrice { get; set; }
    public long? CategoryId { get; set; }
    public long? SellerUserId { get; set; }
    public ApprovalStatus ApprovalStatus { get; set; }
    public string Remark { get; set; } = string.Empty;
    public List<string> ImageUrls { get; set; } = [];
}
