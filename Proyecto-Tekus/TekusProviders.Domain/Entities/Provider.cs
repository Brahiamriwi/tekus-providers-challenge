namespace TekusProviders.Domain.Entities;

public class Provider
{
    public Guid Id { get; private set; }
    public string Nit { get; private set; }
    public string Name { get; private set; }
    public string Email { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public DateTime? UpdatedAt { get; private set; }
    
    // Relaciones
    public ICollection<ProviderService> ProviderServices { get; private set; }
    public ICollection<CustomField> CustomFields { get; private set; }

    // Constructor privado para EF Core
    private Provider() 
    { 
        ProviderServices = new List<ProviderService>();
        CustomFields = new List<CustomField>();
    }

    // Constructor público para crear instancias
    public Provider(string nit, string name, string email)
    {
        Id = Guid.NewGuid();
        Nit = nit ?? throw new ArgumentNullException(nameof(nit));
        Name = name ?? throw new ArgumentNullException(nameof(name));
        Email = email ?? throw new ArgumentNullException(nameof(email));
        CreatedAt = DateTime.UtcNow;
        ProviderServices = new List<ProviderService>();
        CustomFields = new List<CustomField>();
    }

    // Métodos de dominio (Single Responsibility)
    public void UpdateInfo(string name, string email)
    {
        Name = name ?? throw new ArgumentNullException(nameof(name));
        Email = email ?? throw new ArgumentNullException(nameof(email));
        UpdatedAt = DateTime.UtcNow;
    }

    public void AddCustomField(string fieldName, string fieldValue)
    {
        var customField = new CustomField(Id, fieldName, fieldValue);
        CustomFields.Add(customField);
        UpdatedAt = DateTime.UtcNow;
    }
}