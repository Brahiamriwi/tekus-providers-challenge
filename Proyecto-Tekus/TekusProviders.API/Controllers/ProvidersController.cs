namespace TekusProviders.API.Controllers;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TekusProviders.Application.DTOs;
using TekusProviders.Application.Interfaces;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ProvidersController : ControllerBase
{
    private readonly IProviderService _providerService;
    private readonly ILogger<ProvidersController> _logger;

    public ProvidersController(IProviderService providerService, ILogger<ProvidersController> logger)
    {
        _providerService = providerService;
        _logger = logger;
    }

    /// <summary>
    /// Obtiene todos los proveedores con paginación y búsqueda
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<PaginatedResultDto<ProviderDto>>> GetAll(
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] string? searchTerm = null)
    {
        try
        {
            var result = await _providerService.GetAllAsync(pageNumber, pageSize, searchTerm);
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving providers");
            return StatusCode(500, "An error occurred while retrieving providers");
        }
    }

    /// <summary>
    /// Obtiene un proveedor por ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<ProviderDto>> GetById(Guid id)
    {
        try
        {
            var provider = await _providerService.GetByIdAsync(id);
            if (provider == null)
            {
                return NotFound($"Provider with ID {id} not found");
            }
            return Ok(provider);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving provider {ProviderId}", id);
            return StatusCode(500, "An error occurred while retrieving the provider");
        }
    }

    /// <summary>
    /// Crea un nuevo proveedor
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<ProviderDto>> Create([FromBody] CreateProviderDto dto)
    {
        try
        {
            var provider = await _providerService.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = provider.Id }, provider);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating provider");
            return StatusCode(500, "An error occurred while creating the provider");
        }
    }

    /// <summary>
    /// Actualiza un proveedor existente
    /// </summary>
    [HttpPut("{id}")]
    public async Task<ActionResult<ProviderDto>> Update(Guid id, [FromBody] UpdateProviderDto dto)
    {
        try
        {
            var provider = await _providerService.UpdateAsync(id, dto);
            return Ok(provider);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(ex.Message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating provider {ProviderId}", id);
            return StatusCode(500, "An error occurred while updating the provider");
        }
    }

    /// <summary>
    /// Elimina un proveedor
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(Guid id)
    {
        try
        {
            await _providerService.DeleteAsync(id);
            return NoContent();
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(ex.Message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting provider {ProviderId}", id);
            return StatusCode(500, "An error occurred while deleting the provider");
        }
    }

    /// <summary>
    /// Agrega un campo personalizado al proveedor
    /// </summary>
    [HttpPost("{id}/custom-fields")]
    public async Task<ActionResult> AddCustomField(Guid id, [FromBody] CreateCustomFieldDto dto)
    {
        try
        {
            await _providerService.AddCustomFieldAsync(id, dto);
            return NoContent();
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(ex.Message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error adding custom field to provider {ProviderId}", id);
            return StatusCode(500, "An error occurred while adding the custom field");
        }
    }

    /// <summary>
    /// Asigna un servicio al proveedor en países específicos
    /// </summary>
    [HttpPost("{providerId}/services/{serviceId}")]
    public async Task<ActionResult> AssignService(
        Guid providerId, 
        Guid serviceId, 
        [FromBody] List<string> countryCodes)
    {
        try
        {
            await _providerService.AssignServiceAsync(providerId, serviceId, countryCodes);
            return NoContent();
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(ex.Message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error assigning service {ServiceId} to provider {ProviderId}", serviceId, providerId);
            return StatusCode(500, "An error occurred while assigning the service");
        }
    }
}