namespace TekusProviders.Application.Services;

using TekusProviders.Application.DTOs;
using TekusProviders.Application.Interfaces;
using TekusProviders.Domain.Entities;
using TekusProviders.Domain.Interfaces;

public class ServiceService : IServiceService
{
    private readonly IServiceRepository _serviceRepository;

    public ServiceService(IServiceRepository serviceRepository)
    {
        _serviceRepository = serviceRepository;
    }

    public async Task<ServiceDto?> GetByIdAsync(Guid id)
    {
        var service = await _serviceRepository.GetByIdAsync(id);
        return service == null ? null : MapToDto(service);
    }

    public async Task<PaginatedResultDto<ServiceDto>> GetAllAsync(int pageNumber, int pageSize, string? searchTerm = null)
    {
        var services = await _serviceRepository.GetAllAsync(pageNumber, pageSize, searchTerm);
        var totalCount = await _serviceRepository.GetTotalCountAsync(searchTerm);
        var totalPages = (int)Math.Ceiling(totalCount / (double)pageSize);

        return new PaginatedResultDto<ServiceDto>
        {
            Items = services.Select(MapToDto),
            PageNumber = pageNumber,
            PageSize = pageSize,
            TotalPages = totalPages,
            TotalCount = totalCount
        };
    }

    public async Task<ServiceDto> CreateAsync(CreateServiceDto dto)
    {
        var service = new Service(dto.Name, dto.HourlyRateUsd);
        await _serviceRepository.AddAsync(service);
        
        return MapToDto(service);
    }

    public async Task<ServiceDto> UpdateAsync(Guid id, UpdateServiceDto dto)
    {
        var service = await _serviceRepository.GetByIdAsync(id);
        if (service == null)
        {
            throw new KeyNotFoundException($"Service with ID {id} not found");
        }

        service.UpdateInfo(dto.Name, dto.HourlyRateUsd);
        await _serviceRepository.UpdateAsync(service);
        
        return MapToDto(service);
    }

    public async Task DeleteAsync(Guid id)
    {
        var service = await _serviceRepository.GetByIdAsync(id);
        if (service == null)
        {
            throw new KeyNotFoundException($"Service with ID {id} not found");
        }

        await _serviceRepository.DeleteAsync(id);
    }

    private static ServiceDto MapToDto(Service service)
    {
        return new ServiceDto
        {
            Id = service.Id,
            Name = service.Name,
            HourlyRateUsd = service.HourlyRateUsd
        };
    }
}