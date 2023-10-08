using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;

namespace HistoricalEventsMap.Models
{
    public class HistoricalEvent
    {
        [Key]
        public int EventID { get; set; }
        public string? EventName { get; set; }
        public string? Topic { get; set; }
        [AllowNull]
        public string Description { get; set; }
        public int? StartYear { get; set; }
        public int? EndYear { get; set; }
        public string? Coordinates { get; set; }
        public string? PolygonData { get; set; }
    }
}
