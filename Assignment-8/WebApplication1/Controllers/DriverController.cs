using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApplication1.Data;
using WebApplication1.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebApplication1.Controllers
{
    [Authorize] // All endpoints require authentication
    [Route("api/[controller]")]
    [ApiController]
    public class DriversController : ControllerBase
    {
        private readonly AppDbContext _context;
        public DriversController(AppDbContext context) => _context = context;

        // ✅ GET: api/Drivers
        // Dispatcher can see all drivers
        [Authorize(Roles = "Dispatcher")]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Driver>>> GetDrivers()
        {
            var drivers = await _context.Drivers.ToListAsync();
            return Ok(drivers);
        }

        // ✅ GET: api/Drivers/{id}
        // Dispatcher can see any driver
        // Driver can only view their own record
        [HttpGet("{id}")]
        public async Task<ActionResult<Driver>> GetDriver(int id)
        {
            var driver = await _context.Drivers.FindAsync(id);
            if (driver == null)
                return NotFound(new { message = "Driver not found" });

            // Restrict driver to view only their own record
            var username = User.Identity?.Name;
            var role = User.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value;

            if (role == "Driver" && username != driver.Name)
                return Forbid("You are not authorized to access this driver’s data");

            return Ok(driver);
        }

        // ✅ POST: api/Drivers
        // Dispatcher only
        [Authorize(Roles = "Dispatcher")]
        [HttpPost]
        public async Task<ActionResult<Driver>> CreateDriver(Driver driver)
        {
            if (driver == null)
                return BadRequest(new { message = "Invalid driver data" });

            _context.Drivers.Add(driver);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetDriver), new { id = driver.Id }, driver);
        }

        // ✅ PUT: api/Drivers/{id}
        // Dispatcher only
        [Authorize(Roles = "Dispatcher")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateDriver(int id, Driver driver)
        {
            if (id != driver.Id)
                return BadRequest(new { message = "Driver ID mismatch" });

            var existingDriver = await _context.Drivers.FindAsync(id);
            if (existingDriver == null)
                return NotFound(new { message = "Driver not found" });

            existingDriver.Name = driver.Name;
            existingDriver.Phone = driver.Phone;
            existingDriver.DrivingLicense = driver.DrivingLicense;
            existingDriver.ExperienceYears = driver.ExperienceYears;
            existingDriver.IsAvailable = driver.IsAvailable;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // ✅ DELETE: api/Drivers/{id}
        // Dispatcher only
        [Authorize(Roles = "Dispatcher")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDriver(int id)
        {
            var driver = await _context.Drivers.FindAsync(id);
            if (driver == null)
                return NotFound(new { message = "Driver not found" });

            _context.Drivers.Remove(driver);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        // ✅ GET: api/Drivers/summary/{driverId}
        // Returns trip summary for the specified driver
        [HttpGet("summary/{driverId}")]
        public async Task<IActionResult> GetDriverTripSummary(int driverId)
        {
            var summary = await _context.Set<DriverTripSummary>()
                .FromSqlRaw("EXEC GetDriverTripSummary @DriverId = {0}", driverId)
                .ToListAsync();

            var result = summary.FirstOrDefault();
            if (result == null)
                return NotFound(new { message = "No trip summary found" });

            return Ok(result);
        }
    }

    // ✅ DTO for stored procedure result
    public class DriverTripSummary
    {
        public int TotalTrips { get; set; }
        public int TotalHours { get; set; }
    }
}
