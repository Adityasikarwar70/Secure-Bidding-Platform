using BiddingPlatform.AuctionService.Application.DTOs.Auctions;
using BiddingPlatform.AuctionService.Application.DTOs.Products;
using BiddingPlatform.AuctionService.Application.Interfaces.Repositories;
using BiddingPlatform.AuctionService.Application.Interfaces.Services;
using BiddingPlatform.AuctionService.Domain.Entities;
using BiddingPlatform.AuctionService.Domain.Enums;

namespace BiddingPlatform.AuctionService.Application.Services;

public class AuctionService : IAuctionService
{
    private readonly IAuctionRepository _auctionRepository;
    private readonly IProductRepository _productRepository;
    private readonly IProductImageRepository _productImageRepository;
    private readonly IBidRepository _bidRepository;
    private readonly IOrderRepository _orderRepository;

    public AuctionService(
        IAuctionRepository auctionRepository,
        IProductRepository productRepository,
        IProductImageRepository productImageRepository,
        IBidRepository bidRepository,
        IOrderRepository orderRepository)
    {
        _auctionRepository = auctionRepository;
        _productRepository = productRepository;
        _productImageRepository = productImageRepository;
        _bidRepository = bidRepository;
        _orderRepository = orderRepository;
    }

    public async Task<AuctionResponse?> GetByIdAsync(long auctionId)
    {
        var auction = await _auctionRepository.GetByIdAsync(auctionId);
        return auction == null ? null : await MapToResponseAsync(auction);
    }

    public async Task<List<AuctionResponse>> GetAllAsync()
        => await MapListAsync(await _auctionRepository.GetAllAsync());

    public async Task<List<AuctionResponse>> GetByStatusAsync(AuctionStatus status)
        => await MapListAsync(await _auctionRepository.GetByStatusAsync(status));

    public async Task<List<AuctionResponse>> GetLiveByCategoryAsync(long categoryId)
        => await MapListAsync(
            await _auctionRepository.GetByCategoryAndStatusAsync(categoryId, AuctionStatus.Live));

    public async Task<List<AuctionResponse>> GetUpcomingByCategoryAsync(long categoryId)
        => await MapListAsync(
            await _auctionRepository.GetByCategoryAndStatusAsync(categoryId, AuctionStatus.Scheduled));

    public async Task<List<AuctionWithHighestBidResponse>> GetBySellerIdAsync(long sellerUserId)
    {
        var auctions = await _auctionRepository.GetBySellerIdAsync(sellerUserId);
        var result = new List<AuctionWithHighestBidResponse>();

        foreach (var auction in auctions)
        {
            var response = await MapToResponseAsync(auction);
            var highestBid = await _bidRepository.GetHighestBidAsync(auction.AuctionId);

            result.Add(new AuctionWithHighestBidResponse
            {
                Auction = response,
                HighestBid = highestBid?.BidAmount
            });
        }

        return result;
    }
    public async Task DecideAuctionAsync(
    long auctionId,
    long actorUserId,
    bool isAdmin,
    bool approve)
    {
        var auction = await _auctionRepository.GetByIdAsync(auctionId)
            ?? throw new InvalidOperationException("Auction not found.");

        if (auction.ResultStatus != AuctionResultStatus.AwaitingSellerApproval)
            throw new InvalidOperationException("Auction is not awaiting decision.");

        var product = await _productRepository.GetByIdAsync(auction.ProductId)
            ?? throw new InvalidOperationException("Product not found.");

        // Seller ownership check
        if (!isAdmin && product.SellerUserId != actorUserId)
            throw new UnauthorizedAccessException("Not allowed.");

        if (!approve)
        {
            auction.ResultStatus = AuctionResultStatus.NotSold;
            await _auctionRepository.UpdateAsync(auction);
            return;
        }

        // Approve flow
        var highestBid = await _bidRepository.GetHighestBidAsync(auctionId)
            ?? throw new InvalidOperationException("No bids found.");

        var order = new BuyOrder
        {
            AuctionId = auctionId,
            BuyerUserId = highestBid.BidderUserId,
            SellerUserId = product.SellerUserId,
            Amount = highestBid.BidAmount,
            Status = BuyOrderStatus.Pending,
            CreatedAt = DateTime.UtcNow
        };

        auction.ResultStatus = AuctionResultStatus.ManualSold;

        await _orderRepository.AddAsync(order);
        await _auctionRepository.UpdateAsync(auction);
    }


    private async Task<List<AuctionResponse>> MapListAsync(List<Auction> auctions)
    {
        var result = new List<AuctionResponse>();
        foreach (var auction in auctions)
            result.Add(await MapToResponseAsync(auction));
        return result;
    }

    private async Task<AuctionResponse> MapToResponseAsync(Auction auction)
    {
        var product = await _productRepository.GetByIdAsync(auction.ProductId)
            ?? throw new InvalidOperationException("Product not found");

        var images = await _productImageRepository.GetByProductIdAsync(product.ProductId);

        return new AuctionResponse
        {
            AuctionId = auction.AuctionId,
            CategoryId = auction.CategoryId,
            StartingPrice = auction.StartingPrice,
            StartTime = auction.StartTime,
            EndTime = auction.EndTime,
            AuctionStatus = auction.AuctionStatus,
            ResultStatus = auction.ResultStatus,
            Product = new ProductResponse
            {
                ProductId = product.ProductId,
                Title = product.Title,
                Description = product.Description,
                SellerUserId = product.SellerUserId,
                BasePrice = product.BasePrice,
                ExpectedPrice = product.ExpectedPrice,
                CategoryId = product.CategoryId,
                ApprovalStatus = product.ApprovalStatus,
                ImageUrls = images.Select(i => i.ImageUrl).ToList()
            }
        };
    }
}
