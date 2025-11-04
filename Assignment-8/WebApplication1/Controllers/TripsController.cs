using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApplication1.Data;
using WebApplication1.Models;

namespace WebApplication1.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class TripsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TripsController(AppDbContext context)
        {
            _context = context;
        }

        // ✅ Get all trips (Dispatcher or Driver)
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Trip>>> GetTrips()
        {
            if (User.IsInRole("Dispatcher"))
            {
                return await _context.Trips
                    .Include(t => t.Driver)
                    .Include(t => t.Vehicle)
                    .OrderByDescending(t => t.StartTime)
                    .ToListAsync();
            }

            var driverIdClaim = User.FindFirst("DriverId")?.Value;
            if (driverIdClaim == null)
                return Unauthorized("Driver ID not found in token.");

            int driverId = int.Parse(driverIdClaim);

            return await _context.Trips
                .Include(t => t.Driver)
                .Include(t => t.Vehicle)
                .Where(t => t.DriverId == driverId)
                .OrderByDescending(t => t.StartTime)
                .ToListAsync();
        }

        // ✅ Dispatcher creates a new trip
        [Authorize(Roles = "Dispatcher")]
        [HttpPost]
        public async Task<ActionResult<Trip>> CreateTrip([FromBody] Trip trip)
        {
            if (trip.StartTime == default)
                trip.StartTime = DateTime.Now;

            _context.Trips.Add(trip);

            var driver = await _context.Drivers.FindAsync(trip.DriverId);
            var vehicle = await _context.Vehicles.FindAsync(trip.VehicleId);

            if (driver != null) driver.IsAvailable = false;
            if (vehicle != null) vehicle.IsAvailable = false;

            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetTrip), new { id = trip.Id }, trip);
        }

        // ✅ Dispatcher updates an existing trip
        [Authorize(Roles = "Dispatcher")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTrip(int id, [FromBody] Trip trip)
        {
            if (id != trip.Id)
                return BadRequest("Trip ID mismatch.");

            var existing = await _context.Trips.FindAsync(id);
            if (existing == null)
                return NotFound();

            existing.DriverId = trip.DriverId;
            existing.VehicleId = trip.VehicleId;
            existing.Source = trip.Source;
            existing.Destination = trip.Destination;
            existing.StartTime = trip.StartTime;

            await _context.SaveChangesAsync();
            return Ok(new { message = "Trip updated successfully." });
        }

        // ✅ Driver or Dispatcher can complete a trip
        [Authorize(Roles = "Driver,Dispatcher")]
        [HttpPut("complete/{id}")]
        public async Task<IActionResult> CompleteTrip(int id, [FromBody] EndTripRequest request)
        {
            Trip? trip;

            // Dispatcher can complete any trip
            if (User.IsInRole("Dispatcher"))
            {
                trip = await _context.Trips
                    .Include(t => t.Driver)
                    .Include(t => t.Vehicle)
                    .FirstOrDefaultAsync(t => t.Id == id);
            }
            else
            {
                // Driver can only complete their own trips
                var driverIdClaim = User.FindFirst("DriverId")?.Value;
                if (driverIdClaim == null)
                    return Unauthorized("Driver ID not found in token.");

                int driverId = int.Parse(driverIdClaim);
                trip = await _context.Trips
                    .Include(t => t.Driver)
                    .Include(t => t.Vehicle)
                    .FirstOrDefaultAsync(t => t.Id == id && t.DriverId == driverId);
            }

            if (trip == null)
                return NotFound(new { message = "Trip not found or access denied." });

            if (trip.EndTime != null)
                return BadRequest(new { message = "Trip already completed." });

            // ✅ Mark trip completed
            trip.EndTime = request.EndTime ?? DateTime.Now;

            // ✅ Compute duration (for response only)
            double durationHours = 0.00;
            if (trip.StartTime != default && trip.EndTime != null)
            {
                var duration = trip.EndTime.Value - trip.StartTime;
                durationHours = Math.Round(duration.TotalHours / 8.0, 2);
            }

            // ✅ Make driver and vehicle available again
            if (trip.Driver != null)
                trip.Driver.IsAvailable = true;
            if (trip.Vehicle != null)
                trip.Vehicle.IsAvailable = true;

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "✅ Trip completed successfully.",
                trip.Id,
                trip.EndTime,
                DurationHours = durationHours,
                trip.Status
            });
        }

        // ✅ Delete trip (Dispatcher only)
        [Authorize(Roles = "Dispatcher")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTrip(int id)
        {
            var trip = await _context.Trips.FindAsync(id);
            if (trip == null)
                return NotFound();

            _context.Trips.Remove(trip);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Trip deleted successfully." });
        }

        // ✅ Get trips for logged-in driver
        [Authorize(Roles = "Driver")]
        [HttpGet("MyTrips")]
        public async Task<ActionResult<IEnumerable<Trip>>> GetMyTrips()
        {
            var driverIdClaim = User.FindFirst("DriverId")?.Value;
            if (driverIdClaim == null)
                return Unauthorized("Driver ID not found in token.");

            int driverId = int.Parse(driverIdClaim);

            return await _context.Trips
                .Include(t => t.Driver)
                .Include(t => t.Vehicle)
                .Where(t => t.DriverId == driverId)
                .OrderByDescending(t => t.StartTime)
                .ToListAsync();
        }

        // ✅ Get single trip details
        [HttpGet("{id}")]
        public async Task<ActionResult<Trip>> GetTrip(int id)
        {
            var trip = await _context.Trips
                .Include(t => t.Driver)
                .Include(t => t.Vehicle)
                .FirstOrDefaultAsync(t => t.Id == id);

            if (trip == null)
                return NotFound();

            return trip;
        }

        // ✅ DTO for end time
        public class EndTripRequest
        {
            public DateTime? EndTime { get; set; }
        }
    }
}
