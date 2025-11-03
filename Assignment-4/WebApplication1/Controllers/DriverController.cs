using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;
using WebApplication1.Models;

namespace WebApplication1.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DriversController : ControllerBase
    {
        // Make this public static so other controllers can access it
        public static readonly List<Driver> Drivers = new List<Driver>
        {
            new Driver { DriverId = 1, Name = "John Doe", LicenseNumber = "LIC1234", Phone = "1234567890", ExperienceYears = 5 },
            new Driver { DriverId = 2, Name = "Alice Smith", LicenseNumber = "LIC2345", Phone = "2345678901", ExperienceYears = 7 },
            new Driver { DriverId = 3, Name = "Bob Johnson", LicenseNumber = "LIC3456", Phone = "3456789012", ExperienceYears = 3 },
            new Driver { DriverId = 4, Name = "Diana Prince", LicenseNumber = "LIC4567", Phone = "4567890123", ExperienceYears = 10 },
            new Driver { DriverId = 5, Name = "Clark Kent", LicenseNumber = "LIC5678", Phone = "5678901234", ExperienceYears = 6 },
            new Driver { DriverId = 6, Name = "Bruce Wayne", LicenseNumber = "LIC6789", Phone = "6789012345", ExperienceYears = 8 }
        };

        // GET /api/drivers/{id}
        [HttpGet("{id}")]
        public ActionResult<Driver> GetDriverById(int id)
        {
            var driver = Drivers.FirstOrDefault(d => d.DriverId == id);
            if (driver == null) return NotFound($"Driver with ID {id} not found.");
            return Ok(driver);
        }
    }
}
