using Razorpay.Api;
using BiddingPlatform.AuctionService.Application.Interfaces.Services;
using BiddingPlatform.AuctionService.Application.Interfaces.Repositories;
using BiddingPlatform.AuctionService.Domain.Enums;

namespace BiddingPlatform.AuctionService.Application.Services;

public class PaymentService : IPaymentService
{
    private readonly IOrderRepository _orderRepository;
    private readonly IPaymentRepository _paymentRepository;

    private readonly string _key;
    private readonly string _secret;

    public PaymentService(
        IOrderRepository orderRepository,
        IPaymentRepository paymentRepository,
        IConfiguration configuration)
    {
        _orderRepository = orderRepository;
        _paymentRepository = paymentRepository;

        _key = configuration["Razorpay:KeyId"]!;
        _secret = configuration["Razorpay:KeySecret"]!;
    }

    public async Task<object> CreatePaymentAsync(long orderId, long loggedInUserId)
    {
        var order = await _orderRepository.GetByIdAsync(orderId)
            ?? throw new InvalidOperationException("Order not found.");

        // 🔐 SECURITY CHECK
        if (order.BuyerUserId != loggedInUserId)
            throw new UnauthorizedAccessException("You are not allowed to pay for this order.");

        if (order.Status != BuyOrderStatus.Pending)
            throw new InvalidOperationException("Order is not payable.");

        // Prevent duplicate payment attempts
        var existingPayment = await _paymentRepository.GetByOrderIdAsync(orderId);
        if (existingPayment != null && existingPayment.Status == PaymentStatus.Paid)
            throw new InvalidOperationException("Order already paid.");

        var client = new RazorpayClient(_key, _secret);

        var options = new Dictionary<string, object>
        {
            { "amount", (int)(order.Amount * 100) }, // paise
            { "currency", "INR" },
            { "receipt", $"order_{order.OrderId}" },
            { "payment_capture", 1 }
        };

        var razorpayOrder = client.Order.Create(options);

        var payment = new Payment
        {
            OrderId = order.OrderId,
            RazorpayOrderId = razorpayOrder["id"].ToString(),
            Amount = order.Amount,
            Status = PaymentStatus.Created,
            CreatedAt = DateTime.UtcNow
        };

        await _paymentRepository.AddAsync(payment);

        return new
        {
            success = true,
            razorpayKey = _key,
            razorpayOrderId = payment.RazorpayOrderId,
            amount = payment.Amount,
            currency = "INR"
        };
    }

    public async Task VerifyPaymentAsync(
        long orderId,
        long loggedInUserId,
        string razorpayOrderId,
        string razorpayPaymentId,
        string razorpaySignature)
    {
        var order = await _orderRepository.GetByIdAsync(orderId)
            ?? throw new InvalidOperationException("Order not found.");

        if (order.BuyerUserId != loggedInUserId)
            throw new UnauthorizedAccessException("Not allowed.");

        var payment = await _paymentRepository.GetByRazorpayOrderIdAsync(razorpayOrderId)
            ?? throw new InvalidOperationException("Payment record not found.");

        if (payment.Status == PaymentStatus.Paid)
            return; 

        var attributes = new Dictionary<string, string>
        {
            { "razorpay_order_id", razorpayOrderId },
            { "razorpay_payment_id", razorpayPaymentId },
            { "razorpay_signature", razorpaySignature },
            { "key_secret", _secret }
        };

        Utils.verifyPaymentSignature(attributes);
        payment.RazorpayPaymentId = razorpayPaymentId;
        payment.RazorpaySignature = razorpaySignature;
        payment.Status = PaymentStatus.Paid;
        payment.PaidAt = DateTime.UtcNow;

        order.Status = BuyOrderStatus.Paid;

        await _paymentRepository.UpdateAsync(payment);
        await _orderRepository.UpdateAsync(order);
    }
}
