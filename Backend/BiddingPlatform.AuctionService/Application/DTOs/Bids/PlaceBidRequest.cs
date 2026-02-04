using System.ComponentModel.DataAnnotations;

namespace BiddingPlatform.AuctionService.Application.DTOs.Bids;

public class PlaceBidRequest
{
    [Required]
    public long AuctionId { get; set; }

    [Required]
    [Range(1, double.MaxValue)]
    public decimal Amount { get; set; }
}
