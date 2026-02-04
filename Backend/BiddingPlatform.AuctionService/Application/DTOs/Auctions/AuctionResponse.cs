using BiddingPlatform.AuctionService.Application.DTOs.Products;
using BiddingPlatform.AuctionService.Domain.Enums;

namespace BiddingPlatform.AuctionService.Application.DTOs.Auctions;

public class AuctionResponse
{
    public long AuctionId { get; set; }
    public ProductResponse Product { get; set; } = null!;
    public long? CategoryId { get; set; }
    public decimal StartingPrice { get; set; }
    public DateTime StartTime { get; set; }
    public DateTime EndTime { get; set; }
    public AuctionStatus AuctionStatus { get; set; }
    public AuctionResultStatus ResultStatus { get; set; }
}
