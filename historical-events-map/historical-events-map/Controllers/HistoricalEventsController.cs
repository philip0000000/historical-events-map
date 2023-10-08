using HistoricalEventsMap.Models;
using HistoricalEventsMap.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HistoricalEventsMap.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HistoricalEventsController : ControllerBase
    {
        private readonly MapDbContext _context;

        public HistoricalEventsController(MapDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<HistoricalEvent>>> GetHistoricalEvents([FromQuery] string topics)
        {
            if (string.IsNullOrEmpty(topics))
            {
                return BadRequest("Topic is required.");
            }

            var validTopics = topics.Split(',').Select(t => t.Trim().ToLower());

            var filteredEvents = _context.HistoricalEvents
                                        .Where(e => validTopics.Contains(e.Topic.ToLower()));

            return await filteredEvents
                    .Select(e => new HistoricalEvent
                    {
                        EventID = e.EventID,
                        EventName = e.EventName ?? "N/A",  // If null, set to "N/A"
                        Topic = e.Topic ?? "N/A",
                        Description = e.Description ?? "No Description Available",
                        StartYear = e.StartYear ?? 0,
                        EndYear = e.EndYear ?? 0,
                        Coordinates = e.Coordinates ?? "N/A",
                        PolygonData = e.PolygonData ?? "N/A"
                    })
                    .ToListAsync();
        }
    }
}
