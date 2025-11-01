namespace TekusProviders.Infrastructure.Data;

using Microsoft.EntityFrameworkCore;
using TekusProviders.Domain.Entities;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
    }

    public DbSet<Provider> Providers { get; set; }
    public DbSet<Service> Services { get; set; }
    public DbSet<ProviderService> ProviderServices { get; set; }
    public DbSet<ServiceCountry> ServiceCountries { get; set; }
    public DbSet<CustomField> CustomFields { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configuración de Provider
        modelBuilder.Entity<Provider>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Nit).IsRequired().HasMaxLength(50);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Email).IsRequired().HasMaxLength(100);
            entity.HasIndex(e => e.Nit).IsUnique();
            
            entity.HasMany(e => e.ProviderServices)
                .WithOne(e => e.Provider)
                .HasForeignKey(e => e.ProviderId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasMany(e => e.CustomFields)
                .WithOne(e => e.Provider)
                .HasForeignKey(e => e.ProviderId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // Configuración de Service
        modelBuilder.Entity<Service>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(200);
            entity.Property(e => e.HourlyRateUsd).HasColumnType("decimal(18,2)");
            
            entity.HasMany(e => e.ProviderServices)
                .WithOne(e => e.Service)
                .HasForeignKey(e => e.ServiceId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // Configuración de ProviderService (tabla intermedia)
        modelBuilder.Entity<ProviderService>(entity =>
        {
            entity.HasKey(e => new { e.ProviderId, e.ServiceId });

            entity.HasMany(e => e.ServiceCountries)
                .WithOne(e => e.ProviderService)
                .HasForeignKey(e => new { e.ProviderId, e.ServiceId })
                .OnDelete(DeleteBehavior.Cascade);
        });

        // Configuración de ServiceCountry
        modelBuilder.Entity<ServiceCountry>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.CountryCode).IsRequired().HasMaxLength(10);
            entity.Property(e => e.CountryName).IsRequired().HasMaxLength(100);
        });

        // Configuración de CustomField
        modelBuilder.Entity<CustomField>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.FieldName).IsRequired().HasMaxLength(100);
            entity.Property(e => e.FieldValue).IsRequired().HasMaxLength(500);
        });
    }
}