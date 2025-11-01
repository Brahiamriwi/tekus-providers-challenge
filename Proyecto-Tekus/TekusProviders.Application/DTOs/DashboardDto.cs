namespace TekusProviders.Application.DTOs;

public class DashboardDto
{
    public List<ProvidersByCountryDto> ProvidersByCountry { get; set; } = new();
    public List<ServicesByCountryDto> ServicesByCountry { get; set; } = new();
}

public class ProvidersByCountryDto
{
    public string CountryCode { get; set; } = string.Empty;
    public string CountryName { get; set; } = string.Empty;
    public int ProvidersCount { get; set; }
}

public class ServicesByCountryDto
{
    public string CountryCode { get; set; } = string.Empty;
    public string CountryName { get; set; } = string.Empty;
    public int ServicesCount { get; set; }
}