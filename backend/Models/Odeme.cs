namespace BiletBulAPI.Models;

public class Odeme
{
    public int Id { get; set; }
    public int BiletId { get; set; }
    public decimal Tutar { get; set; }
    public DateTime OdemeTarihi { get; set; } = DateTime.Now;
    public string OdemeDurumu { get; set; } = "basarili";
    public string OdemeYontemi { get; set; } = string.Empty;
    public Bilet Bilet { get; set; } = null!;
}