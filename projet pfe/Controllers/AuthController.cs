using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using PayrollManagementBackend.DTOs.Auth;
using PayrollManagementBackend.Models;
using PayrollManagementBackend.Services;
using System.Security.Claims;

namespace PayrollManagementBackend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly UserManager<AppUser> _userManager;
    private readonly SignInManager<AppUser> _signInManager;
    private readonly ITokenService _tokenService;

    public AuthController(
        UserManager<AppUser> userManager,
        SignInManager<AppUser> signInManager,
        ITokenService tokenService)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _tokenService = tokenService;
    }

    [HttpPost("register")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Register(RegisterRequestDto dto)
    {
        var exists = await _userManager.FindByEmailAsync(dto.Email);
        if (exists is not null)
            return BadRequest(new { message = "Email already exists." });

        var user = new AppUser
        {
            FullName = dto.FullName,
            Email = dto.Email,
            UserName = dto.Email,
            EmployeeId = dto.EmployeeId
        };

        var result = await _userManager.CreateAsync(user, dto.Password);
        if (!result.Succeeded)
            return BadRequest(result.Errors);

        await _userManager.AddToRoleAsync(user, dto.Role);

        return Ok(new { message = "User created successfully." });
    }

    [AllowAnonymous]
    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginRequestDto dto)
    {
        var user = await _userManager.FindByEmailAsync(dto.Email);
        if (user is null)
            return Unauthorized(new { message = "Invalid credentials." });

        var result = await _signInManager.CheckPasswordSignInAsync(user, dto.Password, false);
        if (!result.Succeeded)
            return Unauthorized(new { message = "Invalid credentials." });

        var response = await _tokenService.CreateTokenAsync(user);
        return Ok(response);
    }

    [HttpGet("users")]
    [Authorize(Roles = "Admin")]
    public IActionResult GetUsers()
    {
        var users = _userManager.Users.Select(user => new
        {
            user.Id,
            user.FullName,
            user.Email,
            user.UserName,
            user.EmployeeId
        }).ToList();

        return Ok(users);
    }





    [Authorize]
    [HttpGet("me")]
    public async Task<IActionResult> Me()
    {
        var email =
            User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value
            ?? User.Claims.FirstOrDefault(c => c.Type == "email")?.Value
            ?? User.Claims.FirstOrDefault(c => c.Type.Contains("email"))?.Value;

        if (string.IsNullOrWhiteSpace(email))
            return Unauthorized(new { message = "Email claim not found in token." });

        var user = await _userManager.FindByEmailAsync(email);
        if (user is null)
            return NotFound(new { message = "User not found." });

        var roles = await _userManager.GetRolesAsync(user);

        return Ok(new
        {
            user.Id,
            user.FullName,
            user.Email,
            user.EmployeeId,
            Roles = roles
        });
    }
}