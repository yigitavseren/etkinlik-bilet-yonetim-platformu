using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using BiletBulAPI.Data;
using BiletBulAPI.Models;

namespace BiletBulAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IConfiguration _config;

    public AuthController(AppDbContext context, IConfiguration config)
    {
        _context = context;
        _config = config;
    }

    [HttpPost("kayit")]
    public async Task<IActionResult> Kayit([FromBody] KayitDto dto)
    {
        if (await _context.Kullanicilar.AnyAsync(k => k.Email == dto.Email))
            return BadRequest("Bu email zaten kayıtlı.");

        var kullanici = new Kullanici
        {
            Ad = dto.Ad,
            Email = dto.Email,
            SifreHash = BCrypt.Net.BCrypt.HashPassword(dto.Sifre),
            Rol = dto.Email.Contains("admin") ? "admin" 
                : dto.Email.Contains("org") ? "organizer" 
                : "kullanici"
        };

        _context.Kullanicilar.Add(kullanici);
        await _context.SaveChangesAsync();
        return Ok("Kayıt başarılı.");
    }

    [HttpPost("giris")]
    public async Task<IActionResult> Giris([FromBody] GirisDto dto)
    {
      var kullanici = await _context.Kullanicilar.FirstOrDefaultAsync(k => k.Email == dto.Email);
        if (kullanici == null || !BCrypt.Net.BCrypt.Verify(dto.Sifre, kullanici.SifreHash))
           return Unauthorized("Email veya şifre hatalı.");

            var token = TokenOlustur(kullanici);
           return Ok(new { 
           token, 
            id = kullanici.Id,
            ad = kullanici.Ad, 
            rol = kullanici.Rol 
    });
}

    private string TokenOlustur(Kullanici kullanici)
    {
        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, kullanici.Id.ToString()),
            new Claim(ClaimTypes.Email, kullanici.Email),
            new Claim(ClaimTypes.Role, kullanici.Rol)
        };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: _config["Jwt:Issuer"],
            audience: _config["Jwt:Audience"],
            claims: claims,
            expires: DateTime.Now.AddDays(7),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}

public record KayitDto(string Ad, string Email, string Sifre);
public record GirisDto(string Email, string Sifre);