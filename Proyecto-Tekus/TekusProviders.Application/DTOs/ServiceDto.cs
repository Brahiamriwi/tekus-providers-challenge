namespace TekusProviders.Application.DTOs;

public class ServiceDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public decimal HourlyRateUsd { get; set; }
    public List<CountryDto> Countries { get; set; } = new();
}

public class CreateServiceDto
{
    public string Name { get; set; } = string.Empty;
    public decimal HourlyRateUsd { get; set; }
}

public class UpdateServiceDto
{
    public string Name { get; set; } = string.Empty;
    public decimal HourlyRateUsd { get; set; }
}