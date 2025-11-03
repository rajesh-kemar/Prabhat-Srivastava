using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebApplication1.Models
{
    public class Trip
    {
        public int Id { get; set; }

        public int DriverId { get; set; }
        public Driver? Driver { get; set; }

        public int VehicleId { get; set; }
        public Vehicle? Vehicle { get; set; }

        public DateTime StartTime { get; set; }
        public DateTime? EndTime { get; set; }

        public string Source { get; set; }
        public string Destination { get; set; }

        [NotMapped]
        public string Status => EndTime.HasValue ? "Completed" : "InProgress";
    }
}
