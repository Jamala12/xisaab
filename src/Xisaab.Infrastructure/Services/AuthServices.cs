using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Xisaab.Application.DTOs;
using Xisaab.Domain.Entities;
using Xisaab.Domain.Enums;
using Xisaab.Infrastructure.Persistence;

namespace Xisaab.Infrastructure.Services;

public class AuthServices
{
    private readonly AppDbContext _db;
    private readonly IConfiguration _configuration;
    public AuthServices(AppDbContext db, IConfiguration configuration)
    {
        _db = db;
        _configuration = configuration;
    }

    private string GenerateToken(User user)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
        new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
        new Claim(ClaimTypes.Email, user.Email),
        new Claim("BusinessId", user.BusinessId.ToString())
    };

        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"],
            audience: _configuration["Jwt:Issuer"],
            claims: claims,
            expires: DateTime.UtcNow.AddHours(8),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    public async Task<AuthResponseDto> RegisterAsync(RegisterDto dto)
    {
        if (_db.Users.Any(u => u.Email == dto.Email))
        {
            throw new Exception("Email already exists");
        }
        var newBusiness = new Business
        {
            Id = Guid.NewGuid(),
            Name = dto.BusinessName,
            Email = dto.Email,
            CreatedAt = DateTime.UtcNow,
            Tier = BusinessTier.Free
        };

        await _db.Businesses.AddAsync(newBusiness);
        await _db.SaveChangesAsync();

        var passwordHasher = new PasswordHasher<User>();
        var user = new User
        {
            Id = Guid.NewGuid(),
            BusinessId = newBusiness.Id,
            Email = dto.Email,
            PasswordHash = passwordHasher.HashPassword(new User(), dto.Password),
            CreatedAt = DateTime.UtcNow
        };
        await _db.Users.AddAsync(user);
        await _db.SaveChangesAsync();

        return new AuthResponseDto
        {
            Token = GenerateToken(user),
            Email = user.Email
        };
    }

    public async Task<AuthResponseDto> LoginAsync(LoginDto dto)
    {
        var user = _db.Users.FirstOrDefault(u => u.Email == dto.Email);
        if (user == null)
        {
            throw new Exception("Invalid email or password");
        }
        var passwordHasher = new PasswordHasher<User>();
        var result = passwordHasher.VerifyHashedPassword(user, user.PasswordHash, dto.Password);
        if (result == PasswordVerificationResult.Failed)
        {
            throw new Exception("Invalid email or password");
        }
        return new AuthResponseDto
        {
            Token = GenerateToken(user),
            Email = user.Email
        };
    }
}