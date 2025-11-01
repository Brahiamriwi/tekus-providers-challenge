namespace TekusProviders.Application.Interfaces;

using TekusProviders.Application.DTOs;

public interface IServiceService
{
    Task<ServiceDto?> GetByIdAsync(Guid id);
    Task<PaginatedResultDto<ServiceDto>> GetAllAsync(int pageNumber, int pageSize, string? searchTerm = null);
    Task<ServiceDto> CreateAsync(CreateServiceDto dto);
    Task<ServiceDto> UpdateAsync(Guid id, UpdateServiceDto dto);
    Task DeleteAsync(Guid id);
}