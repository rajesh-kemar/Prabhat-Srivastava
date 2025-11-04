using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using WebApplication1.Data;
using WebApplication1.Models;

namespace WebApplication1.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly AppDbContext _context;

        public AuthController(IConfiguration config, AppDbContext context)
        {
            _config = config;
            _context = context;
        }

        // ✅ LOGIN endpoint — Generates JWT token
        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] User loginRequest)
        {
            if (loginRequest == null ||
                string.IsNullOrEmpty(loginRequest.Username) ||
                string.IsNullOrEmpty(loginRequest.Password))
                return BadRequest("Username and password are required");

            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Username == loginRequest.Username && u.Password == loginRequest.Password);

            if (user == null)
                return Unauthorized("Invalid username or password");

            // ✅ Determine driverId if role = Driver
            int? driverId = null;
            if (user.Role == "Driver")
            {
                var driver = await _context.Drivers.FirstOrDefaultAsync(d => d.Name == user.Username);
                if (driver != null)
                    driverId = driver.Id;
            }

            // ✅ Generate JWT including driverId (if applicable)
            var token = GenerateJwtToken(user, driverId);

            return Ok(new
            {
                token,
                username = user.Username,
                role = user.Role,
                id = driverId ?? user.Id
            });
        }

        // ✅ REGISTER endpoint
        [AllowAnonymous]
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] User newUser)
        {
            if (newUser == null ||
                string.IsNullOrEmpty(newUser.Username) ||
                string.IsNullOrEmpty(newUser.Password))
                return BadRequest("Username and password are required");

            if (await _context.Users.AnyAsync(u => u.Username == newUser.Username))
                return BadRequest("Username already exists");

            // Default role = Driver if not provided
            if (string.IsNullOrEmpty(newUser.Role))
                newUser.Role = "Driver";

            _context.Users.Add(newUser);
            await _context.SaveChangesAsync();

            // ✅ Ensure driver record exists
            if (newUser.Role == "Driver")
            {
                var existingDriver = await _context.Drivers.FirstOrDefaultAsync(d => d.Name == newUser.Username);
                if (existingDriver == null)
                {
                    _context.Drivers.Add(new Driver
                    {
                        Name = newUser.Username,
                        DrivingLicense = "Not Assigned",
                        Phone = "Not Available",
                        ExperienceYears = 0,
                        IsAvailable = true
                    });
                    await _context.SaveChangesAsync();
                }
            }

            return Ok(new { message = "User registered successfully and driver added if applicable." });
        }

        // ✅ JWT Token Generator — includes DriverId claim
        private string GenerateJwtToken(User user, int? driverId)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Role, user.Role),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            // ✅ Add DriverId for drivers
            if (user.Role == "Driver" && driverId.HasValue)
                claims.Add(new Claim("DriverId", driverId.Value.ToString()));

            // ✅ Add generic identifier for others
            claims.Add(new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()));

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddMinutes(double.Parse(_config["Jwt:ExpiresInMinutes"] ?? "120")),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
