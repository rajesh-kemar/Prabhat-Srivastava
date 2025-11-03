using System;
using System.Collections.Generic;
using System.Linq;

namespace ConsoleApp1
{
    public class Vehicle
    {
        public int VehicleId { get; set; }
        public string NumberPlate { get; set; }
        public int Type { get; set; }
        public string Capacity { get; set; }
        public string Status { get; set; } = "Available";
    }

    public class Truck : Vehicle
    {
        public double MaxLoadTons { get; set; }
    }

    public class Van : Vehicle
    {
        public bool HasAC { get; set; }
    }

    public class Driver
    {
        public int TripId { get; set; }
        public string Name { get; set; }
        public string LicenseNumber { get; set; }
        public string Phone { get; set; }
        public int ExperienceYears { get; set; }
    }

    public class Trip
    {
        public int TripId { get; set; }
        public Vehicle Vehicle { get; private set; }
        public Driver Driver { get; private set; }
        public DateTime StartTime { get; set; }
        public DateTime? EndTime { get; set; }
        public string Source { get; set; }
        public string Destination { get; set; }
        public string Status { get; set; } = "Planned";

        public void AssignDriver(Driver d)
        {
            Driver = d;
        }

        public void AssignVehicle(Vehicle v)
        {
            Vehicle = v;
            v.Status = "Assigned";
        }

        public TimeSpan? Duration => EndTime.HasValue ? EndTime - StartTime : (TimeSpan?)null;
    }

    class Program
    {
        static void Main()
        {
            var drivers = new List<Driver>
            {
                new Driver { TripId = 1, Name = "Michael Anderson", LicenseNumber = "NY-DRV-982345", Phone = "+1-212-555-1234", ExperienceYears = 5 },
                new Driver { TripId = 2, Name = "Sarah Thompson", LicenseNumber = "IL-DRV-652134", Phone = "+1-312-555-5678", ExperienceYears = 8 },
                new Driver { TripId = 3, Name = "Luis Fernandez", LicenseNumber = "CA-DRV-789654", Phone = "+1-213-555-9012", ExperienceYears = 3 },
                new Driver { TripId = 4, Name = "Aisha Mohammed", LicenseNumber = "TX-DRV-345876", Phone = "+1-713-555-3456", ExperienceYears = 10 },
                new Driver { TripId = 5, Name = "Kevin Lee", LicenseNumber = "WA-DRV-987321", Phone = "+1-206-555-7890", ExperienceYears = 6 }
            };

            var vehicles = new List<Vehicle>
            {
                new Truck { VehicleId = 1, NumberPlate = "ABC-123", Type = 1, Capacity = "5000", MaxLoadTons = 10.5 },
                new Van   { VehicleId = 2, NumberPlate = "XYZ-789", Type = 2, Capacity = "1500", HasAC = true },
                new Truck { VehicleId = 3, NumberPlate = "DEF-456", Type = 1, Capacity = "6000", MaxLoadTons = 12.0 },
                new Van   { VehicleId = 4, NumberPlate = "GHI-321", Type = 2, Capacity = "1800", HasAC = false },
                new Truck { VehicleId = 5, NumberPlate = "JKL-654", Type = 1, Capacity = "7000", MaxLoadTons = 15.0 }
            };

            var trips = new List<Trip>
            {
                new Trip
                {
                    TripId = 1,
                    Source = "New York",
                    Destination = "Boston",
                    StartTime = DateTime.Now.AddHours(-4),
                    EndTime = DateTime.Now,
                },
                new Trip
                {
                    TripId = 2,
                    Source = "Chicago",
                    Destination = "Detroit",
                    StartTime = DateTime.Now.AddHours(-6),
                    EndTime = DateTime.Now.AddHours(-2),
                },
                new Trip
                {
                    TripId = 3,
                    Source = "Los Angeles",
                    Destination = "San Diego",
                    StartTime = DateTime.Now.AddHours(-5),
                    EndTime = DateTime.Now.AddHours(-1),
                },
                new Trip
                {
                    TripId = 4,
                    Source = "Houston",
                    Destination = "Dallas",
                    StartTime = DateTime.Now.AddHours(-2),
                    EndTime = null // ongoing
                },
                new Trip
                {
                    TripId = 5,
                    Source = "Seattle",
                    Destination = "Portland",
                    StartTime = DateTime.Now.AddHours(1), // future trip
                    EndTime = null
                }
            };

            for (int i = 0; i < trips.Count; i++)
            {
                trips[i].AssignDriver(drivers[i]);
                trips[i].AssignVehicle(vehicles[i]);
            }

            Console.WriteLine("=== All Trip Details ===\n");
            foreach (var trip in trips)
            {
                Console.WriteLine($"Trip ID       : {trip.TripId}");
                Console.WriteLine($"Driver        : {trip.Driver.Name}");
                Console.WriteLine($"License       : {trip.Driver.LicenseNumber}");
                Console.WriteLine($"Phone         : {trip.Driver.Phone}");
                Console.WriteLine($"Vehicle       : {trip.Vehicle.NumberPlate}");
                Console.WriteLine($"Source        : {trip.Source}");
                Console.WriteLine($"Destination   : {trip.Destination}");
                Console.WriteLine($"Start Time    : {trip.StartTime}");
                Console.WriteLine($"End Time      : {(trip.EndTime.HasValue ? trip.EndTime.ToString() : "Ongoing/Future")}");
                Console.WriteLine($"Duration      : {(trip.Duration.HasValue ? trip.Duration.Value.TotalHours.ToString("0.00") + " hrs" : "Not yet completed")}");
                Console.WriteLine($"Vehicle Status: {trip.Vehicle.Status}");
                Console.WriteLine($"Trip Status   : {trip.Status}");
                Console.WriteLine(new string('-', 40));
            }

            Console.WriteLine("\n=== Filtered Results ===");

            var completedTrips = trips.Where(t => t.EndTime.HasValue);
            Console.WriteLine("\n--- Completed Trips ---");
            foreach (var trip in completedTrips)
            {
                Console.WriteLine($"Trip {trip.TripId}: {trip.Source} to {trip.Destination}, Duration: {trip.Duration.Value.TotalHours} hrs");
            }

            var ongoingTrips = trips.Where(t => !t.EndTime.HasValue && t.StartTime <= DateTime.Now);
            Console.WriteLine("\n--- Ongoing Trips ---");
            foreach (var trip in ongoingTrips)
            {
                Console.WriteLine($"Trip {trip.TripId}: {trip.Source} to {trip.Destination}, Started at: {trip.StartTime}");
            }

            var futureTrips = trips.Where(t => t.StartTime > DateTime.Now);
            Console.WriteLine("\n--- Future Trips ---");
            foreach (var trip in futureTrips)
            {
                Console.WriteLine($"Trip {trip.TripId}: {trip.Source} to {trip.Destination}, Starts at: {trip.StartTime}");
            }

            var longTrips = trips.Where(t => t.Duration.HasValue && t.Duration.Value.TotalHours > 3);
            Console.WriteLine("\n--- Trips Longer Than 3 Hours ---");
            foreach (var trip in longTrips)
            {
                Console.WriteLine($"Trip {trip.TripId}: {trip.Source} to {trip.Destination}, Duration: {trip.Duration.Value.TotalHours} hrs");
            }

            Console.WriteLine("\nPress any key to exit...");
            Console.ReadKey();
        }
    }
}
