using Microsoft.AspNetCore.Mvc;
using BiletBulAPI.Data;
using BiletBulAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace BiletBulAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BiletController : ControllerBase
{
    private readonly AppDbContext _context;

    public BiletController(AppDbContext context)
    {
        _context = context;
    }

    [HttpPost]
    public async Task<IActionResult> Ekle([FromBody] BiletDto dto)
    {
        var bilet = new Bilet
        {
            KullaniciId = dto.KullaniciId,
            EtkinlikId = dto.EtkinlikId,
            KoltukNo = dto.KoltukNo,
            Fiyat = dto.Fiyat,
            Durum = dto.Durum
        };
        _context.Biletler.Add(bilet);

        // Satılan koltuk sayısını güncelle
        var etkinlik = await _context.Etkinlikler.FindAsync(dto.EtkinlikId);
        if (etkinlik != null)
        {
            etkinlik.SatilanKoltuk += 1;
        }

        await _context.SaveChangesAsync();
        return Ok(bilet);
    }
    [HttpPut("{id}/iade")]
public async Task<IActionResult> Iade(int id)
{
    var bilet = await _context.Biletler.Include(b => b.Etkinlik).FirstOrDefaultAsync(b => b.Id == id);
    if (bilet == null) return NotFound();

    bilet.Durum = "iade";

    // Satılan koltuk sayısını geri al
    if (bilet.Etkinlik != null)
        bilet.Etkinlik.SatilanKoltuk = Math.Max(0, bilet.Etkinlik.SatilanKoltuk - 1);

    await _context.SaveChangesAsync();
    return Ok("Bilet iade edildi.");
}

    [HttpGet("kullanici/{kullaniciId}")]
    public async Task<IActionResult> KullaniciBiletleri(int kullaniciId)
    {
        var biletler = await _context.Biletler
            .Include(b => b.Etkinlik)
            .Where(b => b.KullaniciId == kullaniciId && b.Durum == "aktif")
            .Select(b => new {
                b.Id,
                b.KoltukNo,
                b.SatisTarihi,
                b.Fiyat,
                b.Durum,
                EtkinlikAd = b.Etkinlik.Ad,
                EtkinlikMekan = b.Etkinlik.Mekan,
                EtkinlikTarih = b.Etkinlik.Tarih,
            })
            .ToListAsync();

        return Ok(biletler);
    }
}

public record BiletDto(int KullaniciId, int EtkinlikId, string KoltukNo, decimal Fiyat, string Durum);