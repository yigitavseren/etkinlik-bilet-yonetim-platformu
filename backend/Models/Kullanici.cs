namespace BiletBulAPI.Models;
using System.Collections.Generic;

public class Kullanici
{
    public int Id { get; set; }
    public string Ad { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string SifreHash { get; set; } = string.Empty;
    public string Rol { get; set; } = "kullanici";
    public DateTime OlusturmaTarihi { get; set; } = DateTime.Now;
    public ICollection<Bilet> Biletler { get; set; } = new List<Bilet>();
}