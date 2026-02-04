using BiddingPlatform.AuctionService.Application.Interfaces.Repositories;
using BiddingPlatform.AuctionService.Application.Interfaces.Services;
using BiddingPlatform.AuctionService.Application.Services;
using BiddingPlatform.AuctionService.BackgroundJobs;
using BiddingPlatform.AuctionService.Infrastructure.Configuration;
using BiddingPlatform.AuctionService.Infrastructure.Middleware;
using BiddingPlatform.AuctionService.Infrastructure.Persistence;
using BiddingPlatform.AuctionService.Infrastructure.Repositories;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.JsonWebTokens;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Security.Claims;
using System.Text;

JsonWebTokenHandler.DefaultInboundClaimTypeMap.Clear();


var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddHostedService<AuctionScheduler>();
//register services
builder.Services.AddScoped<IProductService, ProductService>();
builder.Services.AddScoped<IAuctionService, AuctionService>();
builder.Services.AddScoped<IBidService, BidService>();
builder.Services.AddScoped<ICategoryService, CategoryService>();
builder.Services.AddScoped<IOrderService, OrderService>();

//for swagger header
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "BIDX Auction API",
        Version = "v1"
    });

    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Enter: Bearer {your JWT token}"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});


//adding dbcontext
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

builder.Services.AddDbContext<AuctionDbContext>(options =>
{
    options.UseMySql(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        ServerVersion.AutoDetect(
            builder.Configuration.GetConnectionString("DefaultConnection")));
});

// Repositories
builder.Services.AddScoped<IProductRepository, ProductRepository>();
builder.Services.AddScoped<IAuctionRepository, AuctionRepository>();
builder.Services.AddScoped<IBidRepository, BidRepository>();
builder.Services.AddScoped<ICategoryRepository, CategoryRepository>();
builder.Services.AddScoped<IOrderRepository, OrderRepository>();
builder.Services.AddScoped<IProductImageRepository, ProductImageRepository>();
builder.Services.AddScoped<IPaymentRepository, PaymentRepository>();
builder.Services.AddScoped<IPaymentService, PaymentService>();



//adding cors
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactLocalhost", policy =>
    {
        policy
            .WithOrigins("http://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});
//Require authentication for ALL APIs by default
builder.Services.AddControllers(options =>
{
    options.Filters.Add(new AuthorizeFilter());
});
//Razorpay Configuration Registration
builder.Services.Configure<RazorpaySettings>(
    builder.Configuration.GetSection("Razorpay"));

//JWT Configuration
var jwtSection = builder.Configuration.GetSection("Jwt");
var jwtSecret = jwtSection["Secret"];

var key = Encoding.UTF8.GetBytes(jwtSecret!);

builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(key),
            ValidateLifetime = true,
            ClockSkew = TimeSpan.Zero,

            NameClaimType = "username"
        };

        options.Events = new JwtBearerEvents
        {
            OnTokenValidated = context =>
            {
                var logger = context.HttpContext
                    .RequestServices
                    .GetRequiredService<ILogger<Program>>();

                var principal = context.Principal;
                if (principal == null)
                    return Task.CompletedTask;

                var identity = principal.Identity as ClaimsIdentity;
                if (identity == null)
                    return Task.CompletedTask;

                var roleClaims = principal.Claims
                    .Where(c => c.Type == "roles")
                    .Select(c => c.Value)
                    .Distinct()
                    .ToList();

                logger.LogInformation(
                    "Raw roles claims from token: {Roles}",
                    string.Join(", ", roleClaims)
                );

                foreach (var role in roleClaims)
                {
                    identity.AddClaim(new Claim(ClaimTypes.Role, role));
                    logger.LogInformation("Mapped role: {Role}", role);
                }

                return Task.CompletedTask;
            }
        };


    });




var app = builder.Build();



// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("AllowReactLocalhost");
app.UseMiddleware<ExceptionHandlingMiddleware>();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
