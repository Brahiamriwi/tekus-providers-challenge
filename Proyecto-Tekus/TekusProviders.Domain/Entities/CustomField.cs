namespace TekusProviders.Domain.Entities;

public class CustomField
{
    public Guid Id { get; private set; }
    public Guid ProviderId { get; private set; }
    public string FieldName { get; private set; }
    public string FieldValue { get; private set; }
    public DateTime CreatedAt { get; private set; }
    
    // Navegación
    public Provider Provider { get; private set; }

    private CustomField() { }

    public CustomField(Guid providerId, string fieldName, string fieldValue)
    {
        Id = Guid.NewGuid();
        ProviderId = providerId;
        FieldName = fieldName ?? throw new ArgumentNullException(nameof(fieldName));
        FieldValue = fieldValue ?? throw new ArgumentNullException(nameof(fieldValue));
        CreatedAt = DateTime.UtcNow;
    }

    public void UpdateValue(string fieldValue)
    {
        FieldValue = fieldValue ?? throw new ArgumentNullException(nameof(fieldValue));
    }
}