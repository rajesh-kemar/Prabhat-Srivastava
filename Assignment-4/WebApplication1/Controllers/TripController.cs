using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using WebApplication1.Models;

namespace WebApplication1.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TripsController : ControllerBase
    {
        // In-memory dummy trip data (7 trips)
        private static readonly List<Trip> Trips = new List<Trip>
        {
            new Trip { TripId = 1, VehicleId = 101, DriverId = 1, Source = "Los Angeles", Destination = "San Francisco", StartTime = new DateTime(2025, 10, 1, 8, 0, 0), EndTime = null, Status = TripStatus.Scheduled },
            new Trip { TripId = 2, VehicleId = 102, DriverId = 2, Source = "New York", Destination = "Boston", StartTime = new DateTime(2025, 10, 3, 9, 0, 0), EndTime = null, Status = TripStatus.Ongoing },
            new Trip { TripId = 3, VehicleId = 103, DriverId = 3, Source = "Chicago", Destination = "Detroit", StartTime = new DateTime(2025, 9, 30, 7, 0, 0), EndTime = new DateTime(2025, 10, 1, 19, 0, 0), Status = TripStatus.Completed },
            new Trip { TripId = 4, VehicleId = 104, DriverId = 4, Source = "Miami", Destination = "Orlando", StartTime = new DateTime(2025, 10, 5, 6, 0, 0), EndTime = null, Status = TripStatus.Scheduled },
            new Trip { TripId = 5, VehicleId = 105, DriverId = 5, Source = "Houston", Destination = "Dallas", StartTime = new DateTime(2025, 10, 6, 10, 0, 0), EndTime = null, Status = TripStatus.Cancelled },
            new Trip { TripId = 6, VehicleId = 106, DriverId = 1, Source = "Seattle", Destination = "Portland", StartTime = new DateTime(2025, 10, 7, 11, 0, 0), EndTime = null, Status = TripStatus.Scheduled },
            new Trip { TripId = 7, VehicleId = 107, DriverId = 6, Source = "Denver", Destination = "Salt Lake City", StartTime = new DateTime(2025, 10, 8, 12, 0, 0), EndTime = null, Status = TripStatus.Scheduled }
        };

        // GET /api/trips
        [HttpGet]
        public ActionResult<List<Trip>> GetAllTrips()
        {
            return Ok(Trips);
        }

        // POST /api/trips
        [HttpPost]
        public ActionResult<Trip> CreateTrip([FromBody] Trip trip)
        {
            // Simple validation: check driver exists
            var driverExists = DriversController.Drivers.Any(d => d.DriverId == trip.DriverId);
            if (!driverExists)
            {
                return BadRequest($"Driver with ID {trip.DriverId} does not exist.");
            }

            // Assign new TripId
            trip.TripId = Trips.Any() ? Trips.Max(t => t.TripId) + 1 : 1;

            // Default status if not set
            if (!Enum.IsDefined(typeof(TripStatus), trip.Status))
            {
                trip.Status = TripStatus.Scheduled;
            }

            Trips.Add(trip);

            return CreatedAtAction(nameof(GetTripById), new { id = trip.TripId }, trip);
        }

        // GET /api/trips/{id}
        [HttpGet("{id}")]
        public ActionResult<Trip> GetTripById(int id)
        {
            var trip = Trips.FirstOrDefault(t => t.TripId == id);
            if (trip == null) return NotFound($"Trip with ID {id} not found.");
            return Ok(trip);
        }

        // PUT /api/trips/{id}/complete
        [HttpPut("{id}/complete")]
        public IActionResult CompleteTrip(int id)
        {
            var trip = Trips.FirstOrDefault(t => t.TripId == id);
            if (trip == null) return NotFound($"Trip with ID {id} not found.");

            trip.Status = TripStatus.Completed;
            trip.EndTime = DateTime.UtcNow;

            return NoContent();
        }

        // GET /api/drivers/{id}/trips
        // Since this route is driver-related, let's support it here for simplicity
        [HttpGet("/api/drivers/{driverId}/trips")]
        public ActionResult<List<Trip>> GetTripsForDriver(int driverId)
        {
            var driverExists = DriversController.Drivers.Any(d => d.DriverId == driverId);
            if (!driverExists)
            {
                return NotFound($"Driver with ID {driverId} not found.");
            }

            var driverTrips = Trips.Where(t => t.DriverId == driverId).ToList();
            return Ok(driverTrips);
        }
    }
}
