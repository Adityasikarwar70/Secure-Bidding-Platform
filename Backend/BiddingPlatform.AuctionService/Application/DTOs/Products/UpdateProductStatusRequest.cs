using System.ComponentModel.DataAnnotations;
using BiddingPlatform.AuctionService.Domain.Enums;

namespace BiddingPlatform.AuctionService.Application.DTOs.Products;

public class UpdateProductStatusRequest
{
    public ApprovalStatus Status { get; set; }

    public string? Remark { get; set; } 
    public decimal BasePrice { get; set; }
}
