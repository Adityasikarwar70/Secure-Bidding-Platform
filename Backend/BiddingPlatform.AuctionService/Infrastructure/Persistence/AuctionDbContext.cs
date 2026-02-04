using Microsoft.EntityFrameworkCore;
using BiddingPlatform.AuctionService.Domain.Entities;

namespace BiddingPlatform.AuctionService.Infrastructure.Persistence;

public class AuctionDbContext : DbContext
{
    public AuctionDbContext(DbContextOptions<AuctionDbContext> options)
        : base(options)
    {
    }

    public DbSet<Product> Products => Set<Product>();
    public DbSet<ProductImage> ProductImages => Set<ProductImage>();
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<Auction> Auctions => Set<Auction>();
    public DbSet<Bid> Bids => Set<Bid>();
    public DbSet<BuyOrder> BuyOrders => Set<BuyOrder>();
    public DbSet<Payment> Payments => Set<Payment>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        ConfigureCategory(modelBuilder);
        ConfigureProduct(modelBuilder);
        ConfigureProductImage(modelBuilder);
        ConfigureAuction(modelBuilder);
        ConfigureBid(modelBuilder);
        ConfigureBuyOrder(modelBuilder);
        ConfigurePayment(modelBuilder); // ✅ ADDED
    }

    // -------------------- CATEGORY --------------------
    private static void ConfigureCategory(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Category>(entity =>
        {
            entity.ToTable("categories");

            entity.HasKey(e => e.CategoryId);

            entity.Property(e => e.CategoryId)
                  .ValueGeneratedOnAdd();

            entity.Property(e => e.Name)
                  .IsRequired()
                  .HasMaxLength(100);

            entity.Property(e => e.ImageUrl)
                  .IsRequired()
                  .HasMaxLength(500);

            entity.HasIndex(e => e.Name)
                  .IsUnique();
        });
    }

    // -------------------- PRODUCT --------------------
    private static void ConfigureProduct(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Product>(entity =>
        {
            entity.ToTable("products");

            entity.HasKey(e => e.ProductId);

            entity.Property(e => e.ProductId)
                  .ValueGeneratedOnAdd();

            entity.Property(e => e.Title)
                  .IsRequired()
                  .HasMaxLength(200);

            entity.Property(e => e.BasePrice)
                  .HasPrecision(10, 2)
                  .IsRequired();

            entity.Property(e => e.ExpectedPrice)
                  .HasPrecision(10, 2)
                  .IsRequired();

            entity.Property(e => e.Remark)
                  .IsRequired()
                  .HasMaxLength(1000);

            entity.Property(e => e.DurationDays)
                  .IsRequired();

            entity.Property(e => e.ApprovalStatus)
                  .HasConversion<int>()
                  .IsRequired();

            entity.Property(e => e.CreatedAt)
                  .IsRequired();

            entity.Property(e => e.CategoryId)
                  .IsRequired(false);

            entity.HasOne<Category>()
                  .WithMany()
                  .HasForeignKey(e => e.CategoryId)
                  .OnDelete(DeleteBehavior.SetNull);
        });
    }

    // -------------------- PRODUCT IMAGE --------------------
    private static void ConfigureProductImage(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<ProductImage>(entity =>
        {
            entity.ToTable("product_images");

            entity.HasKey(e => e.ImageId);

            entity.Property(e => e.ImageId)
                  .ValueGeneratedOnAdd();

            entity.Property(e => e.ImageUrl)
                  .IsRequired()
                  .HasMaxLength(500);

            entity.Property(e => e.CreatedAt)
                  .IsRequired();

            entity.HasOne(e => e.Product)
                  .WithMany(p => p.Images)
                  .HasForeignKey(e => e.ProductId)
                  .IsRequired()
                  .OnDelete(DeleteBehavior.Cascade);
        });
    }

    // -------------------- AUCTION --------------------
    private static void ConfigureAuction(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Auction>(entity =>
        {
            entity.ToTable("auctions");

            entity.HasKey(e => e.AuctionId);

            entity.Property(e => e.AuctionId)
                  .ValueGeneratedOnAdd();

            entity.Property(e => e.AuctionStatus)
                  .HasConversion<int>()
                  .IsRequired();

            entity.Property(e => e.ResultStatus)
                  .HasConversion<int>()
                  .IsRequired();

            entity.Property(e => e.StartingPrice)
                  .HasPrecision(10, 2)
                  .IsRequired();

            entity.Property(e => e.StartTime)
                  .IsRequired();

            entity.Property(e => e.EndTime)
                  .IsRequired();

            entity.HasIndex(e => new { e.AuctionStatus, e.StartTime });
            entity.HasIndex(e => new { e.AuctionStatus, e.EndTime });

            entity.HasOne<Category>()
                  .WithMany()
                  .HasForeignKey(e => e.CategoryId)
                  .OnDelete(DeleteBehavior.SetNull);

            entity.HasOne<Product>()
                  .WithMany()
                  .HasForeignKey(e => e.ProductId)
                  .OnDelete(DeleteBehavior.Restrict);
        });
    }

    // -------------------- BID --------------------
    private static void ConfigureBid(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Bid>(entity =>
        {
            entity.ToTable("bids");

            entity.HasKey(e => e.BidId);

            entity.Property(e => e.BidId)
                  .ValueGeneratedOnAdd();

            entity.Property(e => e.BidAmount)
                  .HasPrecision(10, 2)
                  .IsRequired();

            entity.Property(e => e.CreatedAt)
                  .IsRequired();

            entity.HasIndex(e => new { e.AuctionId, e.BidAmount });

            entity.HasOne<Auction>()
                  .WithMany()
                  .HasForeignKey(e => e.AuctionId)
                  .OnDelete(DeleteBehavior.Cascade);
        });
    }

    // -------------------- BUY ORDER --------------------
    private static void ConfigureBuyOrder(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<BuyOrder>(entity =>
        {
            entity.ToTable("buy_orders");

            entity.HasKey(e => e.OrderId);

            entity.Property(e => e.OrderId)
                  .ValueGeneratedOnAdd();

            entity.Property(e => e.Amount)
                  .HasPrecision(10, 2)
                  .IsRequired();

            entity.Property(e => e.Status)
                  .HasConversion<int>()
                  .IsRequired();

            entity.Property(e => e.CreatedAt)
                  .IsRequired();

            entity.HasOne<Auction>()
                  .WithMany()
                  .HasForeignKey(e => e.AuctionId)
                  .OnDelete(DeleteBehavior.Restrict);
        });
    }

    // -------------------- PAYMENT --------------------
    private static void ConfigurePayment(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Payment>(entity =>
        {
            entity.ToTable("payments");

            entity.HasKey(e => e.PaymentId);

            entity.Property(e => e.PaymentId)
                  .ValueGeneratedOnAdd();

            entity.Property(e => e.RazorpayOrderId)
                  .IsRequired()
                  .HasMaxLength(100);

            entity.Property(e => e.RazorpayPaymentId)
                  .HasMaxLength(100);

            entity.Property(e => e.RazorpaySignature)
                  .HasMaxLength(500);

            entity.Property(e => e.Amount)
                  .HasPrecision(10, 2)
                  .IsRequired();

            entity.Property(e => e.Status)
                  .HasConversion<int>()
                  .IsRequired();

            entity.Property(e => e.CreatedAt)
                  .IsRequired();

            entity.Property(e => e.PaidAt)
                  .IsRequired(false);

            entity.HasIndex(e => e.RazorpayOrderId)
                  .IsUnique();

            entity.HasOne(e => e.Order)
                  .WithMany(o => o.Payments)
                  .HasForeignKey(e => e.OrderId)
                  .OnDelete(DeleteBehavior.Restrict);
        });
    }
}
