using System.Collections.Generic;

namespace WebApplication1.Models
{
    public class Vehicle
    {
        public int Id { get; set; }
        public string NumberPlate { get; set; }
        public string Type { get; set; }
        public int Capacity { get; set; }
        public string Source { get; set; }
        public string Destination { get; set; }
        public bool IsAvailable { get; set; }

        public virtual ICollection<Trip> Trips { get; set; } = new List<Trip>();
    }
}