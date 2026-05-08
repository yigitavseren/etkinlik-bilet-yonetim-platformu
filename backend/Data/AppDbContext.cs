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

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Kullanici>().ToTable("Kullanici");
        modelBuilder.Entity<Etkinlik>().ToTable("Etkinlik");
        modelBuilder.Entity<Bilet>().ToTable("Bilet");
        modelBuilder.Entity<Odeme>().ToTable("Odeme");
    }
}