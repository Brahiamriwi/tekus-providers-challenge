namespace TekusProviders.Domain.Entities;

public class Service
{
    public Guid Id { get; private set; }
    public string Name { get; private set; }
    public decimal HourlyRateUsd { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public DateTime? UpdatedAt { get; private set; }
    
    // Relaciones
    public ICollection<ProviderService> ProviderServices { get; private set; }

    // Constructor privado para EF Core
    private Service() 
    { 
        ProviderServices = new List<ProviderService>();
    }

    // Constructor público
    public Service(string name, decimal hourlyRateUsd)
    {
        Id = Guid.NewGuid();
        Name = name ?? throw new ArgumentNullException(nameof(name));
        HourlyRateUsd = hourlyRateUsd >= 0 
            ? hourlyRateUsd 
            : throw new ArgumentException("Hourly rate must be non-negative", nameof(hourlyRateUsd));
        CreatedAt = DateTime.UtcNow;
        ProviderServices = new List<ProviderService>();
    }

    public void UpdateInfo(string name, decimal hourlyRateUsd)
    {
        Name = name ?? throw new ArgumentNullException(nameof(name));
        HourlyRateUsd = hourlyRateUsd >= 0 
            ? hourlyRateUsd 
            : throw new ArgumentException("Hourly rate must be non-negative", nameof(hourlyRateUsd));
        UpdatedAt = DateTime.UtcNow;
    }
}