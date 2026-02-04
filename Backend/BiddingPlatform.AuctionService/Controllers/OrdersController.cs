using BiddingPlatform.AuctionService.Application.DTOs.Orders;
using BiddingPlatform.AuctionService.Application.Interfaces.Services;
using BiddingPlatform.AuctionService.Domain.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BiddingPlatform.AuctionService.Controllers;

[ApiController]
[Route("api/orders")]
[Authorize]
public class OrdersController : ControllerBase
{
    private readonly IOrderService _orderService;
    private readonly IAuctionService _auctionService;

    public OrdersController(
        IOrderService orderService,
        IAuctionService auctionService)
    {
        _orderService = orderService;
        _auctionService = auctionService;
    }

    // GET api/orders
    [Authorize(Roles = "ADMIN")]
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var orders = await _orderService.GetAllWithAuctionAsync();
        return Ok(orders);
    }

    // GET api/orders/buyer/{buyerId}
    [Authorize(Roles = "BUYER,ADMIN")]
    [HttpGet("buyer/{buyerId:long}")]
    public async Task<IActionResult> GetByBuyer(long buyerId)
    {
        long loggedInUserId = long.Parse(User.FindFirst("userId")!.Value);
        bool isAdmin = User.IsInRole("ADMIN");

        if (!isAdmin && buyerId != loggedInUserId)
            return Forbid();

        var orders = await _orderService.GetByBuyerWithAuctionAsync(buyerId);
        return Ok(orders);
    }

    // GET api/orders/seller/{sellerId}
    [Authorize(Roles = "SELLER,ADMIN")]
    [HttpGet("seller/{sellerId:long}")]
    public async Task<IActionResult> GetBySeller(long sellerId)
    {
        long loggedInUserId = long.Parse(User.FindFirst("userId")!.Value);
        bool isAdmin = User.IsInRole("ADMIN");

        if (!isAdmin && sellerId != loggedInUserId)
            return Forbid();

        var orders = await _orderService.GetBySellerWithAuctionAsync(sellerId);
        return Ok(orders);
    }
}
