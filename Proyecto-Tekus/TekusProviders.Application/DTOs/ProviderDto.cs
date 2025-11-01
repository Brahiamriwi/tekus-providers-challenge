namespace TekusProviders.Application.DTOs;

public class ProviderDto
{
    public Guid Id { get; set; }
    public string Nit { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public List<CustomFieldDto> CustomFields { get; set; } = new();
    public List<ServiceDto> Services { get; set; } = new();
}

public class CreateProviderDto
{
    public string Nit { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
}

public class UpdateProviderDto
{
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
}