using System.Net;
using System.Text.Json;

namespace BiddingPlatform.AuctionService.Infrastructure.Middleware;

public class ExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionHandlingMiddleware> _logger;

    public ExceptionHandlingMiddleware(
        RequestDelegate next,
        ILogger<ExceptionHandlingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task Invoke(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            await HandleException(context, ex);
        }
    }

    private async Task HandleException(HttpContext context, Exception ex)
    {
        _logger.LogError(ex, "Unhandled exception");

        context.Response.ContentType = "application/json";

        var response = ex switch
        {
            InvalidOperationException => CreateResponse(
                HttpStatusCode.BadRequest,
                ex.Message),

            UnauthorizedAccessException => CreateResponse(
                HttpStatusCode.Unauthorized,
                "Unauthorized access"),

            KeyNotFoundException => CreateResponse(
                HttpStatusCode.NotFound,
                "Resource not found"),

            _ => CreateResponse(
                HttpStatusCode.InternalServerError,
                "Something went wrong. Please try again later.")
        };

        context.Response.StatusCode = (int)response.StatusCode;

        await context.Response.WriteAsync(
            JsonSerializer.Serialize(response));
    }

    private static ErrorResponse CreateResponse(
        HttpStatusCode status,
        string message)
    {
        return new ErrorResponse
        {
            StatusCode = (int)status,
            Message = message
        };
    }
}
