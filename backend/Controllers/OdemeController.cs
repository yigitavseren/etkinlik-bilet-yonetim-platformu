using Microsoft.AspNetCore.Mvc;
using BiletBulAPI.Data;
using BiletBulAPI.Models;

namespace BiletBulAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OdemeController : ControllerBase
{
    private readonly AppDbContext _context;

    public OdemeController(AppDbContext context)
    {
        _context = context;
    }

    [HttpPost]
    public async Task<IActionResult> Ekle([FromBody] OdemeDto dto)
    {
        var odeme = new Odeme
        {
            BiletId = dto.BiletId,
            Tutar = dto.Tutar,
            OdemeDurumu = dto.OdemeDurumu,
            OdemeYontemi = dto.OdemeYontemi
        };
        _context.Odemeler.Add(odeme);
        await _context.SaveChangesAsync();
        return Ok(odeme);
    }
}

public record OdemeDto(int BiletId, decimal Tutar, string OdemeDurumu, string OdemeYontemi);