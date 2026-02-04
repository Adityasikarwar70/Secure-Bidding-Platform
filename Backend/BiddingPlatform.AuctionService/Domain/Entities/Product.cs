using BiddingPlatform.AuctionService.Domain.Enums;

namespace BiddingPlatform.AuctionService.Domain.Entities;

public class Product
{
    public long ProductId { get; set; }
    public long SellerUserId { get; set; }

    public string Title { get; set; } = null!;
    public string? Description { get; set; }

    public decimal BasePrice { get; set; }
    public decimal ExpectedPrice { get; set; }

    public long? CategoryId { get; set; }

    public int DurationDays { get; set; }

    public string Remark { get; set; } = string.Empty;
    public ApprovalStatus ApprovalStatus { get; set; }
    public DateTime? ApprovedAt { get; set; }
    public DateTime CreatedAt { get; set; }
    public ICollection<ProductImage> Images { get; set; } = new List<ProductImage>();
}
