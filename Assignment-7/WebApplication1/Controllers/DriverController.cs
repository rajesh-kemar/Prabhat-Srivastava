using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApplication1.Data;
using WebApplication1.Models;

namespace WebApplication1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DriversController : ControllerBase
    {
        private readonly AppDbContext _context;
        public DriversController(AppDbContext context) => _context = context;

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Driver>>> GetDrivers()
        {
            return await _context.Drivers.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Driver>> GetDriver(int id)
        {
            var driver = await _context.Drivers.FindAsync(id);
            if (driver == null) return NotFound();
            return driver;
        }

        [HttpPost]
        public async Task<ActionResult<Driver>> CreateDriver(Driver driver)
        {
            _context.Drivers.Add(driver);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetDriver), new { id = driver.Id }, driver);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateDriver(int id, Driver driver)
        {
            if (id != driver.Id) return BadRequest();

            var existingDriver = await _context.Drivers.FindAsync(id);
            if (existingDriver == null) return NotFound();

            existingDriver.Name = driver.Name;
            existingDriver.Phone = driver.Phone;
            existingDriver.DrivingLicense = driver.DrivingLicense;
            existingDriver.ExperienceYears = driver.ExperienceYears;
            existingDriver.IsAvailable = driver.IsAvailable;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDriver(int id)
        {
            var driver = await _context.Drivers.FindAsync(id);
            if (driver == null) return NotFound();

            _context.Drivers.Remove(driver);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}