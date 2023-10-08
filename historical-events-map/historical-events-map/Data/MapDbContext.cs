using HistoricalEventsMap.Models;
using Microsoft.EntityFrameworkCore;

namespace HistoricalEventsMap.Data
{
    public class MapDbContext : DbContext
    {
        public MapDbContext(DbContextOptions<MapDbContext> options) : base(options) { }

        public DbSet<HistoricalEvent> HistoricalEvents { get; set; }
    }
}
