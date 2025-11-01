namespace TekusProviders.Domain.Entities;

public class ServiceCountry
{
    public Guid Id { get; private set; }
    public Guid ProviderId { get; private set; }
    public Guid ServiceId { get; private set; }
    public string CountryCode { get; private set; } // ISO 3166-1 alpha-2 (ej: "CO", "PE", "MX")
    public string CountryName { get; private set; }
    public DateTime AssignedAt { get; private set; }
    
    // Navegación
    public ProviderService ProviderService { get; private set; }

    private ServiceCountry() { }

    public ServiceCountry(Guid providerId, Guid serviceId, string countryCode, string countryName)
    {
        Id = Guid.NewGuid();
        ProviderId = providerId;
        ServiceId = serviceId;
        CountryCode = countryCode ?? throw new ArgumentNullException(nameof(countryCode));
        CountryName = countryName ?? throw new ArgumentNullException(nameof(countryName));
        AssignedAt = DateTime.UtcNow;
    }
}