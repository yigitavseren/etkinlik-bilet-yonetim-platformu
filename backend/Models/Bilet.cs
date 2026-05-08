namespace BiletBulAPI.Models;

public class Bilet
{
    public int Id { get; set; }
    public int KullaniciId { get; set; }
    public int EtkinlikId { get; set; }
    public string KoltukNo { get; set; } = string.Empty;
    public DateTime SatisTarihi { get; set; } = DateTime.Now;
    public decimal Fiyat { get; set; }
    public string Durum { get; set; } = "aktif";
    public Kullanici Kullanici { get; set; } = null!;
    public Etkinlik Etkinlik { get; set; } = null!;
    public Odeme? Odeme { get; set; }
}
