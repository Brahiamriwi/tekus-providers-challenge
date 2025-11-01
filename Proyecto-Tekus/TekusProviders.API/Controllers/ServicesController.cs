namespace TekusProviders.API.Controllers;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TekusProviders.Application.DTOs;
using TekusProviders.Application.Interfaces;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ServicesController : ControllerBase
{
    private readonly IServiceService _serviceService;
    private readonly ILogger<ServicesController> _logger;

    public ServicesController(IServiceService serviceService, ILogger<ServicesController> logger)
    {
        _serviceService = serviceService;
        _logger = logger;
    }

    /// <summary>
    /// Obtiene todos los servicios con paginación y búsqueda
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<PaginatedResultDto<ServiceDto>>> GetAll(
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] string? searchTerm = null)
    {
        try
        {
            var result = await _serviceService.GetAllAsync(pageNumber, pageSize, searchTerm);
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving services");
            return StatusCode(500, "An error occurred while retrieving services");
        }
    }

    /// <summary>
    /// Obtiene un servicio por ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<ServiceDto>> GetById(Guid id)
    {
        try
        {
            var service = await _serviceService.GetByIdAsync(id);
            if (service == null)
            {
                return NotFound($"Service with ID {id} not found");
            }
            return Ok(service);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving service {ServiceId}", id);
            return StatusCode(500, "An error occurred while retrieving the service");
        }
    }

    /// <summary>
    /// Crea un nuevo servicio
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<ServiceDto>> Create([FromBody] CreateServiceDto dto)
    {
        try
        {
            var service = await _serviceService.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = service.Id }, service);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating service");
            return StatusCode(500, "An error occurred while creating the service");
        }
    }

    /// <summary>
    /// Actualiza un servicio existente
    /// </summary>
    [HttpPut("{id}")]
    public async Task<ActionResult<ServiceDto>> Update(Guid id, [FromBody] UpdateServiceDto dto)
    {
        try
        {
            var service = await _serviceService.UpdateAsync(id, dto);
            return Ok(service);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(ex.Message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating service {ServiceId}", id);
            return StatusCode(500, "An error occurred while updating the service");
        }
    }

    /// <summary>
    /// Elimina un servicio
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(Guid id)
    {
        try
        {
            await _serviceService.DeleteAsync(id);
            return NoContent();
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(ex.Message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting service {ServiceId}", id);
            return StatusCode(500, "An error occurred while deleting the service");
        }
    }
}