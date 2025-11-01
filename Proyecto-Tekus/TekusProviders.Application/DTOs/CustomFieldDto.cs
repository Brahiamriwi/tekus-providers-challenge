namespace TekusProviders.Application.DTOs;

public class CustomFieldDto
{
    public Guid Id { get; set; }
    public string FieldName { get; set; } = string.Empty;
    public string FieldValue { get; set; } = string.Empty;
}

public class CreateCustomFieldDto
{
    public string FieldName { get; set; } = string.Empty;
    public string FieldValue { get; set; } = string.Empty;
}