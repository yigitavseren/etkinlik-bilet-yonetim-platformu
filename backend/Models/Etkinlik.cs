namespace BiletBulAPI.Models;
using System.Collections.Generic;

public class Etkinlik
{
    public int Id { get; set; }
    public string Ad { get; set; } = string.Empty;
    public string Mekan { get; set; } = string.Empty;
    public int? OrganizatorId { get; set; }
    public DateTime Tarih { get; set; }
    public int ToplamKoltuk { get; set; }
    public int SatilanKoltuk { get; set; }
    public string Kategori { get; set; } = "konser";
    public decimal Fiyat { get; set; }
    public string Durum { get; set; } = "aktif";
    public string Aciklama { get; set; } = string.Empty;
    public string ResimUrl { get; set; } = string.Empty;
    public DateTime OlusturmaTarihi { get; set; } = DateTime.Now;
    public ICollection<Bilet> Biletler { get; set; } = new List<Bilet>();
}