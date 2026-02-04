using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using BiddingPlatform.AuctionService.Application.Interfaces.Services;
using BiddingPlatform.AuctionService.Application.DTOs.Payments;

namespace BiddingPlatform.AuctionService.Controllers;

[ApiController]
[Route("api/payments")]
[Authorize]
public class PaymentsController : ControllerBase
{
    private readonly IPaymentService _paymentService;

    public PaymentsController(IPaymentService paymentService)
    {
        _paymentService = paymentService;
    }

 
    // POST api/payments/order/{orderId}
    [Authorize(Roles = "BUYER")]
    [HttpPost("order/{orderId:long}")]
    public async Task<IActionResult> CreatePayment(long orderId)
    {
        long loggedInUserId = long.Parse(
            User.FindFirst("userId")!.Value
        );

        var result = await _paymentService.CreatePaymentAsync(
            orderId,
            loggedInUserId
        );

        return Ok(result);
    }

    // POST api/payments/verify
    [Authorize(Roles = "BUYER")]
    [HttpPost("verify")]
    public async Task<IActionResult> VerifyPayment(
        [FromBody] VerifyPaymentRequest request)
    {
        long loggedInUserId = long.Parse(
            User.FindFirst("userId")!.Value
        );

        await _paymentService.VerifyPaymentAsync(
            request.OrderId,
            loggedInUserId,
            request.RazorpayOrderId,
            request.RazorpayPaymentId,
            request.RazorpaySignature
        );

        return Ok(new
        {
            success = true,
            message = "Payment verified successfully."
        });
    }
}
