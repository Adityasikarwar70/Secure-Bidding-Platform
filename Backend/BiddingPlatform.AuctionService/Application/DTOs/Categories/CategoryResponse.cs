namespace BiddingPlatform.AuctionService.Application.DTOs.Categories;

public class CategoryResponse
{
    public long CategoryId { get; set; }
    public string Name { get; set; } = null!;
    public string ImageUrl { get; set; } = null!;
}

