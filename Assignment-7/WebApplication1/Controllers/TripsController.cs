using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApplication1.Data;
using WebApplication1.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebApplication1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TripsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TripsController(AppDbContext context)
        {
            _context = context;
        }

        // ✅ GET: api/Trips
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Trip>>> GetTrips()
        {
            return await _context.Trips
                .Include(t => t.Driver)
                .Include(t => t.Vehicle)
                .ToListAsync();
        }

        // ✅ GET: api/Trips/{id}
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

        // ✅ POST: api/Trips
        [HttpPost]
        public async Task<ActionResult<Trip>> CreateTrip(Trip trip)
        {
            _context.Trips.Add(trip);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetTrip), new { id = trip.Id }, trip);
        }

        // ✅ PUT: api/Trips/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTrip(int id, Trip trip)
        {
            if (id != trip.Id)
                return BadRequest("Trip ID mismatch");

            var existingTrip = await _context.Trips.FindAsync(id);
            if (existingTrip == null)
                return NotFound();

            existingTrip.DriverId = trip.DriverId;
            existingTrip.VehicleId = trip.VehicleId;
            existingTrip.StartTime = trip.StartTime;
            existingTrip.EndTime = trip.EndTime;
            existingTrip.Source = trip.Source;
            existingTrip.Destination = trip.Destination;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // ✅ DELETE: api/Trips/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTrip(int id)
        {
            var trip = await _context.Trips.FindAsync(id);
            if (trip == null)
                return NotFound();

            _context.Trips.Remove(trip);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        // ✅ NEW ENDPOINT: Trips longer than 8 hours
        // GET: api/Trips/LongTrips
        [HttpGet("LongTrips")]
        public async Task<ActionResult<IEnumerable<Trip>>> GetLongTrips()
        {
            var longTrips = await _context.Trips
                .Include(t => t.Driver)
                .Include(t => t.Vehicle)
                .Where(t => t.EndTime.HasValue &&
                            EF.Functions.DateDiffHour(t.StartTime, t.EndTime.Value) > 8)
                .ToListAsync();

            return longTrips;
        }
    }
}
