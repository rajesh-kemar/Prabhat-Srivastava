using System;

namespace WebApplication1.Models
{
    public enum TripStatus
    {
        Scheduled, 
        Ongoing,
        Completed,
        Cancelled
    }

    public class Trip
    {
        public int TripId { get; set; }
        public int VehicleId { get; set; }
        public int DriverId { get; set; }
        public string Source { get; set; } = string.Empty;
        public string Destination { get; set; } = string.Empty;
        public DateTime StartTime { get; set; }
        public DateTime? EndTime { get; set; }
        public TripStatus Status { get; set; } = TripStatus.Scheduled;
    }
}
