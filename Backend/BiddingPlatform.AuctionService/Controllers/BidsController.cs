using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using BiddingPlatform.AuctionService.Application.Interfaces.Services;
using BiddingPlatform.AuctionService.Application.DTOs.Bids;
using BiddingPlatform.AuctionService.Application.Interfaces.Repositories;

namespace BiddingPlatform.AuctionService.Controllers;

[ApiController]
[Route("api/bids")]
[Authorize]
public class BidsController : ControllerBase
{
    private readonly IBidService _bidService;
    private readonly IAuctionRepository _auctionRepository;

    public BidsController(
        IBidService bidService,
        IAuctionRepository auctionRepository)
    {
        _bidService = bidService;
        _auctionRepository = auctionRepository;
    }

    // POST api/bids
    [Authorize(Roles = "BUYER")]
    [HttpPost]
    public async Task<IActionResult> PlaceBid([FromBody] PlaceBidRequest request)
    {
        long userId = long.Parse(User.FindFirst("userId")!.Value);

        await _bidService.PlaceBidAsync(
            request.AuctionId,
            userId,
            request.Amount);

        return Ok(new { success = true });
    }

    // GET api/bids/auction/{auctionId}
    [HttpGet("auction/{auctionId:long}")]
    public async Task<IActionResult> GetByAuction(long auctionId)
    {
        var auction = await _auctionRepository.GetByIdAsync(auctionId);
        if (auction == null)
            return NotFound();

        var bids = await _bidService.GetBidsByAuctionAsync(auctionId);

        var response = bids.Select(b => new BidResponse
        {
            BidId = b.BidId,
            AuctionId = b.AuctionId,
            ProductId = auction.ProductId, 
            BidderUserId = b.BidderUserId,
            BidAmount = b.BidAmount,
            CreatedAt = b.CreatedAt
        });

        return Ok(response);
    }

   
    // GET api/bids/auction/{auctionId}/highest
    [HttpGet("auction/{auctionId:long}/highest")]
    public async Task<IActionResult> GetHighestBid(long auctionId)
    {
        var auction = await _auctionRepository.GetByIdAsync(auctionId);
        if (auction == null)
            return NotFound();

        var bid = await _bidService.GetHighestBidAsync(auctionId);
        if (bid == null)
            return NotFound();

        return Ok(new BidResponse
        {
            BidId = bid.BidId,
            AuctionId = bid.AuctionId,
            ProductId = auction.ProductId, 
            BidderUserId = bid.BidderUserId,
            BidAmount = bid.BidAmount,
            CreatedAt = bid.CreatedAt
        });
    }

    // GET api/bids/user/{userId}
    [HttpGet("user/{userId:long}")]
    public async Task<IActionResult> GetByUser(long userId)
    {
        long loggedInUserId = long.Parse(User.FindFirst("userId")!.Value);

        if (userId != loggedInUserId)
            return Forbid();

        var bids = await _bidService.GetBidsByUserAsync(userId);

        var auctionIds = bids.Select(b => b.AuctionId).Distinct();
        var auctionMap = new Dictionary<long, long>();

        foreach (var auctionId in auctionIds)
        {
            var auction = await _auctionRepository.GetByIdAsync(auctionId);
            if (auction != null)
                auctionMap[auctionId] = auction.ProductId;
        }

        var response = bids.Select(b => new BidResponse
        {
            BidId = b.BidId,
            AuctionId = b.AuctionId,
            ProductId = auctionMap[b.AuctionId],
            BidderUserId = b.BidderUserId,
            BidAmount = b.BidAmount,
            CreatedAt = b.CreatedAt
        });

        return Ok(response);
    }

    // GET api/bids/auction/{auctionId}/top
    [HttpGet("auction/{auctionId:long}/top")]
    public async Task<IActionResult> GetTopBids(long auctionId)
    {
        var auction = await _auctionRepository.GetByIdAsync(auctionId);
        if (auction == null)
            return NotFound();

        var bids = await _bidService.GetTopBidsByAuctionAsync(auctionId, 5);

        var response = bids.Select(b => new BidResponse
        {
            BidId = b.BidId,
            AuctionId = b.AuctionId,
            ProductId = auction.ProductId,
            BidderUserId = b.BidderUserId,
            BidAmount = b.BidAmount,
            CreatedAt = b.CreatedAt
        });

        return Ok(response);
    }
}
