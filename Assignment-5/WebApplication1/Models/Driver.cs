using System.Collections.Generic;

namespace WebApplication1.Models
{
    public class Driver
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Phone { get; set; }
        public string DrivingLicense { get; set; }
        public int ExperienceYears { get; set; }
        public bool IsAvailable { get; set; }

        public virtual ICollection<Trip> Trips { get; set; } = new List<Trip>();
    }
}
