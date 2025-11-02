namespace TekusProviders.Application.Services;

using System.Text.Json;
using System.Text.Json.Serialization;
using TekusProviders.Application.DTOs;
using TekusProviders.Application.Interfaces;

public class CountryService : ICountryService
{
    private readonly HttpClient _httpClient;
    private const string RestCountriesApiUrl = "https://restcountries.com/v3.1";
    private readonly JsonSerializerOptions _jsonOptions;

    public CountryService(HttpClient httpClient)
    {
        _httpClient = httpClient;
        _jsonOptions = new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true
        };
    }

    public async Task<IEnumerable<CountryDto>> GetAllCountriesAsync()
    {
        try
        {
            var response = await _httpClient.GetAsync($"{RestCountriesApiUrl}/all?fields=cca2,name");
            response.EnsureSuccessStatusCode();

            var content = await response.Content.ReadAsStringAsync();
            var countries = JsonSerializer.Deserialize<List<CountryApiResponse>>(content, _jsonOptions);

            return countries?.Select(c => new CountryDto
            {
                Code = c.Cca2 ?? string.Empty,
                Name = c.Name?.Common ?? string.Empty
            }).OrderBy(c => c.Name) ?? Enumerable.Empty<CountryDto>();
        }
        catch (Exception ex)
        {
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
            // Deserializar como objeto único, NO como lista
            var country = JsonSerializer.Deserialize<CountryApiResponse>(content, _jsonOptions);

            return country == null ? null : new CountryDto
            {
                Code = country.Cca2 ?? string.Empty,
                Name = country.Name?.Common ?? string.Empty
            };
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error fetching country {code}: {ex.Message}");
            return null;
        }
    }

    private class CountryApiResponse
    {
        [JsonPropertyName("cca2")]
        public string? Cca2 { get; set; }
        
        [JsonPropertyName("name")]
        public CountryName? Name { get; set; }
    }

    private class CountryName
    {
        [JsonPropertyName("common")]
        public string? Common { get; set; }
    }
}