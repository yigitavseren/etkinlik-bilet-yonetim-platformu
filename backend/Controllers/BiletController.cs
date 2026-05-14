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

    // GET api/bilet/turler — React'ın tür listesini çekeceği endpoint
    [HttpGet("turler")]
    public async Task<IActionResult> BiletTurleri()
    {
        var turler = await _context.BiletTurleri
            .Where(t => t.AktifMi)
            .OrderBy(t => t.SiraNo)
            .Select(t => new {
                t.Id,
                t.Ad,
                t.Slug,
                t.Aciklama,
                t.Avantajlar,
                t.FiyatCarpani,
                t.RenkHex
            })
            .ToListAsync();

        return Ok(turler);
    }

    [HttpPost]
    public async Task<IActionResult> Ekle([FromBody] BiletDto dto)
    {
        decimal carpani = 1.0m;

        if (dto.BiletTuruId.HasValue)
        {
            var tur = await _context.BiletTurleri.FindAsync(dto.BiletTuruId.Value);

            // İndirimli bilet — öğrenci mail kontrolü
            if (tur != null && tur.Slug == "indirimli")
            {
                var kullanici = await _context.Kullanicilar.FindAsync(dto.KullaniciId);
                var mail = kullanici?.Email ?? "";
                if (!mail.EndsWith(".edu.tr") && !mail.EndsWith(".edu"))
                    return BadRequest("İndirimli bilet yalnızca öğrenci e-postası (.edu.tr / .edu) olan kullanıcılara açıktır.");
            }

            if (tur != null) carpani = tur.FiyatCarpani;
        }

        var tabanFiyat = dto.TabanFiyat ?? dto.Fiyat;
        var nihaiFiyat = Math.Round(tabanFiyat * carpani, 2);

        var bilet = new Bilet
        {
            KullaniciId = dto.KullaniciId,
            EtkinlikId  = dto.EtkinlikId,
            BiletTuruId = dto.BiletTuruId,
            KoltukNo    = dto.KoltukNo,
            TabanFiyat  = tabanFiyat,
            Fiyat       = nihaiFiyat,
            Durum       = dto.Durum
        };

        _context.Biletler.Add(bilet);

        var etkinlik = await _context.Etkinlikler.FindAsync(dto.EtkinlikId);
        if (etkinlik != null)
            etkinlik.SatilanKoltuk += 1;

        await _context.SaveChangesAsync();
        return Ok(bilet);
    }

    [HttpPut("{id}/iade")]
    public async Task<IActionResult> Iade(int id)
    {
        var bilet = await _context.Biletler
            .Include(b => b.Etkinlik)
            .FirstOrDefaultAsync(b => b.Id == id);

        if (bilet == null) return NotFound();

        bilet.Durum = "iade";

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
            .Include(b => b.BiletTuru)
            .Where(b => b.KullaniciId == kullaniciId && b.Durum == "aktif")
            .Select(b => new {
                b.Id,
                b.KoltukNo,
                b.SatisTarihi,
                TabanFiyat    = (decimal?)b.TabanFiyat,
                b.Fiyat,
                b.Durum,
                EtkinlikAd    = b.Etkinlik.Ad,
                EtkinlikMekan = b.Etkinlik.Mekan,
                EtkinlikTarih = b.Etkinlik.Tarih,
                BiletTuru     = b.BiletTuru == null ? "Standart" : b.BiletTuru.Ad,
                TurRenk       = b.BiletTuru == null ? "#6366F1"  : b.BiletTuru.RenkHex
            })
            .ToListAsync();

        return Ok(biletler);
    }
}

public record BiletDto(
    int KullaniciId,
    int EtkinlikId,
    int? BiletTuruId,
    string KoltukNo,
    decimal? TabanFiyat,
    decimal Fiyat,
    string Durum
);