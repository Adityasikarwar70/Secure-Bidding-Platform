namespace BiddingPlatform.AuctionService.Domain.Entities;

public class ProductImage
{
    public long ImageId { get; set; }

    public long ProductId { get; set; }

    public string ImageUrl { get; set; } = null!;
    public Product Product { get; set; } = null!;
    public DateTime CreatedAt { get; set; }
}
