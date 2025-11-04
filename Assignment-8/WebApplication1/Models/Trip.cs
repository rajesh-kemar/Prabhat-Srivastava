using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebApplication1.Models
{
    public class Trip
    {
        public int Id { get; set; }

        // Relationships
        public int DriverId { get; set; }
        public Driver? Driver { get; set; }

        public int VehicleId { get; set; }
        public Vehicle? Vehicle { get; set; }

        // Core Properties
        public DateTime StartTime { get; set; }
        public DateTime? EndTime { get; set; }
        public string Source { get; set; } = string.Empty;
        public string Destination { get; set; } = string.Empty;

        // Computed (not stored in DB)
        [NotMapped]
        public string Status => EndTime.HasValue ? "Completed" : "InProgress";

        // Computed trip duration in hours (optional for convenience)
        [NotMapped]
        public double DurationHours
        {
            get
            {
                if (EndTime.HasValue)
                {
                    var duration = (EndTime.Value - StartTime).TotalHours / 8.0; 
                    return Math.Round(duration, 2);
                }
                return 0.00;
            }
        }
    }
}
