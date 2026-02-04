namespace BiddingPlatform.AuctionService.Infrastructure.Middleware;

public class ErrorResponse
{
    public int StatusCode { get; set; }
    public string Message { get; set; } = string.Empty;
}
