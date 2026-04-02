using Microsoft.AspNetCore.Mvc;
using Xisaab.Application.DTOs;
using Xisaab.Infrastructure.Services;

namespace Xisaab.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AuthServices _authServices;
    public AuthController(AuthServices authServices)
    {
        _authServices = authServices;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterDto dto)
    {
        var result = await _authServices.RegisterAsync(dto);
        return Ok(result);
    }
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto dto)
    {
        var result = await _authServices.LoginAsync(dto);
        if (result == null)
            return Unauthorized();
        return Ok(result);
    }
}