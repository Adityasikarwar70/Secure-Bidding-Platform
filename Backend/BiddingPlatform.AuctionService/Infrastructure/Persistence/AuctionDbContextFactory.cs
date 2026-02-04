using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;

namespace BiddingPlatform.AuctionService.Infrastructure.Persistence;

public class AuctionDbContextFactory
    : IDesignTimeDbContextFactory<AuctionDbContext>
{
    public AuctionDbContext CreateDbContext(string[] args)
    {
        var configuration = new ConfigurationBuilder()
            .SetBasePath(Directory.GetCurrentDirectory())
            .AddJsonFile("appsettings.json")
            .Build();

        var optionsBuilder = new DbContextOptionsBuilder<AuctionDbContext>();

        var connectionString = configuration.GetConnectionString("DefaultConnection");

        optionsBuilder.UseMySql(
            connectionString,
            ServerVersion.AutoDetect(connectionString));

        return new AuctionDbContext(optionsBuilder.Options);
    }
}
