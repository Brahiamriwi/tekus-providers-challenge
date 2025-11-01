namespace TekusProviders.Application.Services;

using System.Text.Json;
using TekusProviders.Application.DTOs;
using TekusProviders.Application.Interfaces;

public class CountryService : ICountryService
{
    private readonly HttpClient _httpClient;
    private const string RestCountriesApiUrl = "https://restcountries.com/v3.1";

    public CountryService(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task<IEnumerable<CountryDto>> GetAllCountriesAsync()
    {
        try
        {
            var response = await _httpClient.GetAsync($"{RestCountriesApiUrl}/all?fields=cca2,name");
            response.EnsureSuccessStatusCode();

            var content = await response.Content.ReadAsStringAsync();
            var countries = JsonSerializer.Deserialize<List<CountryApiResponse>>(content);

            return countries?.Select(c => new CountryDto
            {
                Code = c.Cca2,
                Name = c.Name?.Common ?? string.Empty
            }) ?? Enumerable.Empty<CountryDto>();
        }
        catch (Exception ex)
        {
            // Log error y retornar lista vacía
            Console.WriteLine($"Error fetching countries: {ex.Message}");
            return Enumerable.Empty<CountryDto>();
        }
    }

    public async Task<CountryDto?> GetCountryByCodeAsync(string code)
    {
        try
        {
            var response = await _httpClient.GetAsync($"{RestCountriesApiUrl}/alpha/{code}?fields=cca2,name");
            response.EnsureSuccessStatusCode();

            var content = await response.Content.ReadAsStringAsync();
            var countries = JsonSerializer.Deserialize<List<CountryApiResponse>>(content);
            var country = countries?.FirstOrDefault();

            return country == null ? null : new CountryDto
            {
                Code = country.Cca2,
                Name = country.Name?.Common ?? string.Empty
            };
        }
        catch (Exception ex)
        {
            // Log error
            Console.WriteLine($"Error fetching country {code}: {ex.Message}");
            return null;
        }
    }

    // Clase privada para deserializar la respuesta de la API
    private class CountryApiResponse
    {
        public string Cca2 { get; set; } = string.Empty;
        public CountryName? Name { get; set; }
    }

    private class CountryName
    {
        public string Common { get; set; } = string.Empty;
    }
}