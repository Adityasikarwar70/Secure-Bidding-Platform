namespace BiddingPlatform.AuctionService.Domain.Entities;

public class Category
{
    public long CategoryId { get; set; }

    public string Name { get; set; } = null!;

    public string ImageUrl { get; set; } = null!;
}
