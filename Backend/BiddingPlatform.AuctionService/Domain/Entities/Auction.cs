using BiddingPlatform.AuctionService.Domain.Enums;

namespace BiddingPlatform.AuctionService.Domain.Entities;

public class Auction
{
    public long AuctionId { get; set; }
    public long ProductId { get; set; }
    public long? CategoryId { get; set; }
    public DateTime StartTime { get; set; }
    public DateTime EndTime { get; set; }
    public AuctionStatus AuctionStatus { get; set; }
    public AuctionResultStatus ResultStatus { get; set; }
    public decimal StartingPrice { get; set; }
    public DateTime CreatedAt { get; set; }
}
