namespace WebApplication1.Models
{
    public class Driver
    {
        public int DriverId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string LicenseNumber { get; set; } = string.Empty;
        public string Phone {  get; set; } = string.Empty;
        public int ExperienceYears {  get; set; }
    }
}
