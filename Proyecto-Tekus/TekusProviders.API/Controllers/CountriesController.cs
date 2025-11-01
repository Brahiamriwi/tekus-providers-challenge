namespace TekusProviders.API.Controllers;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TekusProviders.Application.DTOs;
using TekusProviders.Application.Interfaces;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class CountriesController : ControllerBase
{
    private readonly ICountryService _countryService;
    private readonly ILogger<CountriesController> _logger;

    public CountriesController(ICountryService countryService, ILogger<CountriesController> logger)
    {
        _countryService = countryService;
        _logger = logger;
    }

    /// <summary>
    /// Obtiene todos los países desde la API externa
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<CountryDto>>> GetAll()
    {
        try
        {
            var countries = await _countryService.GetAllCountriesAsync();
            return Ok(countries);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving countries");
            return StatusCode(500, "An error occurred while retrieving countries");
        }
    }

    /// <summary>
    /// Obtiene un país por código
    /// </summary>
    [HttpGet("{code}")]
    public async Task<ActionResult<CountryDto>> GetByCode(string code)
    {
        try
        {
            var country = await _countryService.GetCountryByCodeAsync(code);
            if (country == null)
            {
                return NotFound($"Country with code {code} not found");
            }
            return Ok(country);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving country {CountryCode}", code);
            return StatusCode(500, "An error occurred while retrieving the country");
        }
    }
}