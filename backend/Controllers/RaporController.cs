using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BiletBulAPI.Data;

namespace BiletBulAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RaporController : ControllerBase
{
    private readonly AppDbContext _context;

    public RaporController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet("etkinlik-satis")]
    public async Task<IActionResult> EtkinlikSatis()
    {
        var rapor = await _context.Etkinlikler
            .Select(e => new
            {
                e.Id,
                e.Ad,
                e.Mekan,
                e.Tarih,
                e.Durum,
                e.ToplamKoltuk,
                e.SatilanKoltuk,
                SatisOrani = e.ToplamKoltuk > 0
                    ? (double)e.SatilanKoltuk / e.ToplamKoltuk * 100
                    : 0,
                ToplamGelir = e.Biletler
                    .Where(b => b.Durum == "aktif")
                    .Sum(b => b.Fiyat)
            })
            .ToListAsync();

        return Ok(rapor);
    }

    [HttpGet("iptal-etkinlikler")]
    public async Task<IActionResult> IptalEtkinlikler()
    {
        var iptal = await _context.Etkinlikler
            .Where(e => e.Durum == "iptal")
            .Select(e => new
            {
                e.Id,
                e.Ad,
                e.Mekan,
                e.Tarih,
                IptalBiletSayisi = e.Biletler.Count,
                ToplamKayip = e.Biletler.Sum(b => b.Fiyat)
            })
            .ToListAsync();

        return Ok(iptal);
    }

    [HttpGet("organizator-ozet")]
public async Task<IActionResult> OrganizatorOzet([FromQuery] int? orgId)
{
    if (orgId == null)
    {
        var kullaniciId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (kullaniciId != null)
            orgId = int.Parse(kullaniciId);
    }

    var etkinlikler = await _context.Etkinlikler
        .Where(e => orgId == null || e.OrganizatorId == orgId)
        .Select(e => new
        {
            e.Id,
            e.Ad,
            e.Mekan,
            e.Tarih,
            e.Durum,
            e.ToplamKoltuk,
            e.SatilanKoltuk,
            SatisOrani = e.ToplamKoltuk > 0
                ? (double)e.SatilanKoltuk / e.ToplamKoltuk * 100
                : 0,
            ToplamGelir = e.Biletler
                .Where(b => b.Durum == "aktif")
                .Sum(b => b.Fiyat)
        })
        .ToListAsync();

    var ozet = new
    {
        ToplamBilet = await _context.Biletler
            .Where(b => b.Durum == "aktif" && 
                   _context.Etkinlikler
                       .Where(e => orgId == null || e.OrganizatorId == orgId)
                       .Select(e => e.Id)
                       .Contains(b.EtkinlikId))
            .CountAsync(),
        IadeBilet = await _context.Biletler
            .Where(b => b.Durum == "iade" && 
                   _context.Etkinlikler
                       .Where(e => orgId == null || e.OrganizatorId == orgId)
                       .Select(e => e.Id)
                       .Contains(b.EtkinlikId))
            .CountAsync(),
        ToplamGelir = etkinlikler.Sum(e => e.ToplamGelir),
        AktifEtkinlik = etkinlikler.Count(e => e.Durum == "aktif"),
        Etkinlikler = etkinlikler
    };

    return Ok(ozet);
}

    [HttpGet("genel-ozet")]
    public async Task<IActionResult> GenelOzet()
    {
        var ozet = new
        {
            ToplamEtkinlik = await _context.Etkinlikler.CountAsync(),
            AktifEtkinlik = await _context.Etkinlikler.CountAsync(e => e.Durum == "aktif"),
            IptalEtkinlik = await _context.Etkinlikler.CountAsync(e => e.Durum == "iptal"),
            ToplamBilet = await _context.Biletler.CountAsync(b => b.Durum == "aktif"),
            IadeBilet = await _context.Biletler.CountAsync(b => b.Durum == "iade"),
            ToplamGelir = await _context.Biletler
                .Where(b => b.Durum == "aktif")
                .SumAsync(b => b.Fiyat),
            ToplamKullanici = await _context.Kullanicilar.CountAsync()
        };

        return Ok(ozet);
    }
}