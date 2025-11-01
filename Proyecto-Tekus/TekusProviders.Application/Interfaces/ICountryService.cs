namespace TekusProviders.Application.Interfaces;

using TekusProviders.Application.DTOs;

public interface ICountryService
{
    Task<IEnumerable<CountryDto>> GetAllCountriesAsync();
    Task<CountryDto?> GetCountryByCodeAsync(string code);
}