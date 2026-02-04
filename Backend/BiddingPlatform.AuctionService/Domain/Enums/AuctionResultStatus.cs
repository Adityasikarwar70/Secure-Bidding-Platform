namespace BiddingPlatform.AuctionService.Domain.Enums;

public enum AuctionResultStatus
{
    None = 0,                    
    AutoSold = 1,                
    AwaitingSellerApproval = 2,  
    ManualSold = 3,
    NotSold = 4,
    NoBids = 5
}

