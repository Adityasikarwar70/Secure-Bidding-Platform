using System.ComponentModel.DataAnnotations;

namespace BiddingPlatform.AuctionService.Application.DTOs.Categories;

public class UpdateCategoryRequest
{
    public string Name { get; set; } = null!;
    public string ImageUrl { get; set; } = null!;
}
