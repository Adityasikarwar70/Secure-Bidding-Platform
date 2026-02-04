using BiddingPlatform.AuctionService.Application.DTOs.Auctions;

namespace BiddingPlatform.AuctionService.Application.DTOs.Auctions;

public class AuctionWithHighestBidResponse
{
    public AuctionResponse Auction { get; set; } = null!;
    public decimal? HighestBid { get; set; }
}
