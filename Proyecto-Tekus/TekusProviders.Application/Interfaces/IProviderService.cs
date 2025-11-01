namespace TekusProviders.Application.Interfaces;

using TekusProviders.Application.DTOs;

public interface IProviderService
{
    Task<ProviderDto?> GetByIdAsync(Guid id);
    Task<PaginatedResultDto<ProviderDto>> GetAllAsync(int pageNumber, int pageSize, string? searchTerm = null);
    Task<ProviderDto> CreateAsync(CreateProviderDto dto);
    Task<ProviderDto> UpdateAsync(Guid id, UpdateProviderDto dto);
    Task DeleteAsync(Guid id);
    Task AddCustomFieldAsync(Guid providerId, CreateCustomFieldDto dto);
    Task AssignServiceAsync(Guid providerId, Guid serviceId, List<string> countryCodes);
}