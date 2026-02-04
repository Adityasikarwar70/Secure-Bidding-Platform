using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using BiddingPlatform.AuctionService.Application.Interfaces.Services;
using BiddingPlatform.AuctionService.Domain.Enums;

namespace BiddingPlatform.AuctionService.Controllers;

[ApiController]
[Route("api/auctions")]
[Authorize] 
public class AuctionsController : ControllerBase
{
    private readonly IAuctionService _auctionService;

    public AuctionsController(IAuctionService auctionService)
    {
        _auctionService = auctionService;
    }

    // GET api/auctions/{id}
    [AllowAnonymous]
    [HttpGet("{id:long}")]
    public async Task<IActionResult> GetById(long id)
    {
        var auction = await _auctionService.GetByIdAsync(id);
        if (auction == null)
            return NotFound();

        return Ok(auction);
    }

    // GET api/auctions?status=
    [AllowAnonymous]
    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] AuctionStatus? status)
    {
        var auctions = status == null
            ? await _auctionService.GetAllAsync()
            : await _auctionService.GetByStatusAsync(status.Value);

        return Ok(auctions);
    }

    // GET api/auctions/category/{categoryId}/live
    [AllowAnonymous]
    [HttpGet("category/{categoryId:long}/live")]
    public async Task<IActionResult> GetLiveByCategory(long categoryId)
    {
        var auctions = await _auctionService.GetLiveByCategoryAsync(categoryId);
        return Ok(auctions);
    }

    // GET api/auctions/seller/{sellerId}
    [Authorize(Roles = "SELLER,ADMIN")]
    [HttpGet("seller/{sellerId:long}")]
    public async Task<IActionResult> GetBySeller(long sellerId)
    {
        long loggedInUserId = long.Parse(
            User.FindFirst("userId")!.Value
        );

        bool isAdmin = User.IsInRole("ADMIN");
        //prevents a seller from seeing another seller auctions.
        if (!isAdmin && sellerId != loggedInUserId)
            return Forbid();

        var auctions = await _auctionService.GetBySellerIdAsync(sellerId);
        return Ok(auctions);
    }

    // POST api/auctions/{auctionId}/decision
    [Authorize(Roles = "SELLER,ADMIN")]
    [HttpPost("{auctionId:long}/decision")]
    public async Task<IActionResult> DecideAuction(
        long auctionId,
        [FromBody] AuctionDecisionRequest request)
    {
        long actorUserId = long.Parse(User.FindFirst("userId")!.Value);
        bool isAdmin = User.IsInRole("ADMIN");

        await _auctionService.DecideAuctionAsync(
            auctionId,
            actorUserId,
            isAdmin,
            request.Approve);

        return Ok(new
        {
            success = true,
            message = request.Approve
                ? "Auction approved and order created."
                : "Auction marked as not sold."
        });
    }

    // GET api/auctions/category/{categoryId}/upcoming
    [AllowAnonymous]
    [HttpGet("category/{categoryId:long}/upcoming")]
    public async Task<IActionResult> GetUpcomingByCategory(long categoryId)
    {
        var auctions = await _auctionService.GetUpcomingByCategoryAsync(categoryId);
        return Ok(auctions);
    }
}
