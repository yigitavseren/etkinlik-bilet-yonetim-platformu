using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using BiletBulAPI.Data;
using BiletBulAPI.Models;

namespace BiletBulAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EtkinlikController : ControllerBase
{
    private readonly AppDbContext _context;

    public EtkinlikController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> Listele()
    {
        var etkinlikler = await _context.Etkinlikler.ToListAsync();
        return Ok(etkinlikler);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> Getir(int id)
    {
        var etkinlik = await _context.Etkinlikler.FindAsync(id);
        if (etkinlik == null) return NotFound();
        return Ok(etkinlik);
    }

    [Authorize]
    [HttpPost]
    public async Task<IActionResult> Ekle([FromBody] Etkinlik etkinlik)
    {
        var kullaniciId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (kullaniciId != null)
            etkinlik.OrganizatorId = int.Parse(kullaniciId);

        _context.Etkinlikler.Add(etkinlik);
        await _context.SaveChangesAsync();
        return Ok(etkinlik);
    }

    [Authorize]
    [HttpPut("{id}")]
    public async Task<IActionResult> Guncelle(int id, [FromBody] Etkinlik etkinlik)
    {
        var mevcut = await _context.Etkinlikler.FindAsync(id);
        if (mevcut == null) return NotFound();

        mevcut.Ad = etkinlik.Ad;
        mevcut.Mekan = etkinlik.Mekan;
        mevcut.Tarih = etkinlik.Tarih;
        mevcut.Fiyat = etkinlik.Fiyat;
        mevcut.Durum = etkinlik.Durum;

        await _context.SaveChangesAsync();
        return Ok(mevcut);
    }

    [Authorize]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Sil(int id)
    {
        var etkinlik = await _context.Etkinlikler.FindAsync(id);
        if (etkinlik == null) return NotFound();

        _context.Etkinlikler.Remove(etkinlik);
        await _context.SaveChangesAsync();
        return Ok("Silindi.");
    }
}