using API.DTOs;
using API.Entities;
using API.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AccountController : ControllerBase
{
    private readonly UserManager<AppUser> _userManager;
    private readonly TokenService _tokenService;

    public AccountController(UserManager<AppUser> userManager, TokenService tokenService)
    {
        _userManager = userManager;
        _tokenService = tokenService;
    }
    
    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginDto loginDto)
    {
        var user = await _userManager.FindByNameAsync(loginDto.UserName);
        if (user == null)
        {
            return BadRequest(new { message = "Invalid username or password" });
        }
        var isPasswordValid = await _userManager.CheckPasswordAsync(user, loginDto.Password);
        if (!isPasswordValid)
        {
            return Unauthorized(new { message = "Username or password is incorrect" });
        }
        return Ok(new { token = await _tokenService.GenerateToken(user) , roles = await _userManager.GetRolesAsync(user) });
    }
    
    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterDTO registerDto)
    {
        if(ModelState.IsValid == false)
        {
            return BadRequest(ModelState);
        }
        var user = new AppUser
        {
            UserName = registerDto.UserName,
            Email = registerDto.Email,
            Name = registerDto.Name,
        };
        var result = await _userManager.CreateAsync(user, registerDto.Password);
        if (!result.Succeeded)
        {
            return BadRequest(result.Errors);
        }
        await _userManager.AddToRoleAsync(user, "Customer");
        return Ok(new { message = "User registered successfully" });
    }
}