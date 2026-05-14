namespace BiletBulAPI.Models;
using System.Collections.Generic;
public class Bilet
{
    public int Id { get; set; }
    public int KullaniciId { get; set; }
    public int EtkinlikId { get; set; }
    public int? BiletTuruId { get; set; }          // YENİ
    public string KoltukNo { get; set; } = string.Empty;
    public DateTime SatisTarihi { get; set; } = DateTime.Now;
    public decimal Fiyat { get; set; }             // nihai fiyat (TabanFiyat × FiyatCarpani)
    public string Durum { get; set; } = "aktif";
    public decimal? TabanFiyat { get; set; }   // decimal → decimal?

    public Kullanici Kullanici { get; set; } = null!;
    public Etkinlik Etkinlik { get; set; } = null!;
    public Odeme? Odeme { get; set; }
    public BiletTuru? BiletTuru { get; set; }      // YENİ — navigation property
}