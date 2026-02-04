namespace BiddingPlatform.AuctionService.Application.DTOs.Bids;

public class BidResponse
{
    public long BidId { get; set; }

    public long AuctionId { get; set; }

    public long ProductId { get; set; }

    public long BidderUserId { get; set; }

    public decimal BidAmount { get; set; }

    public DateTime CreatedAt { get; set; }
}
