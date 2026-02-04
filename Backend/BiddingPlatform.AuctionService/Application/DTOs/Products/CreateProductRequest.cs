using System.ComponentModel.DataAnnotations;

namespace BiddingPlatform.AuctionService.Application.DTOs.Products;

public class CreateProductRequest
{
    public required string Title { get; set; }
    public string? Description { get; set; }
    public decimal ExpectedPrice { get; set; }
    public long? CategoryId { get; set; }
    public int DurationDays { get; set; }
    public List<string> ImageUrls { get; set; } = [];
}
