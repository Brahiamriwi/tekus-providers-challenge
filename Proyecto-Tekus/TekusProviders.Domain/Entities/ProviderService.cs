namespace TekusProviders.Domain.Entities;

public class ProviderService
{
    public Guid ProviderId { get; private set; }
    public Guid ServiceId { get; private set; }
    public DateTime AssignedAt { get; private set; }
    
    // Navegación
    public Provider Provider { get; private set; }
    public Service Service { get; private set; }
    public ICollection<ServiceCountry> ServiceCountries { get; private set; }

    // Constructor privado para EF Core
    private ProviderService() 
    { 
        ServiceCountries = new List<ServiceCountry>();
    }

    public ProviderService(Guid providerId, Guid serviceId)
    {
        ProviderId = providerId;
        ServiceId = serviceId;
        AssignedAt = DateTime.UtcNow;
        ServiceCountries = new List<ServiceCountry>();
    }
}