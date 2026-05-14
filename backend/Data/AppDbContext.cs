using Microsoft.EntityFrameworkCore;
using BiletBulAPI.Models;

namespace BiletBulAPI.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Kullanici> Kullanicilar { get; set; }
    public DbSet<Etkinlik> Etkinlikler { get; set; }
    public DbSet<Bilet> Biletler { get; set; }
    public DbSet<Odeme> Odemeler { get; set; }
    public DbSet<BiletTuru> BiletTurleri { get; set; }   // YENİ

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Kullanici>().ToTable("Kullanici");
        modelBuilder.Entity<Etkinlik>().ToTable("Etkinlik");
        modelBuilder.Entity<Bilet>().ToTable("Bilet");
        modelBuilder.Entity<Odeme>().ToTable("Odeme");
        modelBuilder.Entity<BiletTuru>().ToTable("BiletTuru");  // YENİ

        // Avantajlar listesini JSON olarak sakla
        modelBuilder.Entity<BiletTuru>()
            .Property(b => b.Avantajlar)
            .HasConversion(
                v => System.Text.Json.JsonSerializer.Serialize(v, (System.Text.Json.JsonSerializerOptions?)null),
                v => System.Text.Json.JsonSerializer.Deserialize<List<string>>(v, (System.Text.Json.JsonSerializerOptions?)null)
            );

        // Bilet → BiletTuru ilişkisi
        modelBuilder.Entity<Bilet>()
            .HasOne(b => b.BiletTuru)
            .WithMany(bt => bt.Biletler)
            .HasForeignKey(b => b.BiletTuruId)
            .OnDelete(DeleteBehavior.SetNull);
    }
}