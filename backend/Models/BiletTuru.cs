namespace BiletBulAPI.Models;

public class BiletTuru
{
    public int Id { get; set; }
    public string Ad { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string? Aciklama { get; set; }
    public List<string>? Avantajlar { get; set; }  // JSON kolonu
    public decimal FiyatCarpani { get; set; } = 1.0m;
    public string RenkHex { get; set; } = "#6366F1";
    public bool AktifMi { get; set; } = true;
    public int SiraNo { get; set; } = 0;

    public ICollection<Bilet> Biletler { get; set; } = new List<Bilet>();
}