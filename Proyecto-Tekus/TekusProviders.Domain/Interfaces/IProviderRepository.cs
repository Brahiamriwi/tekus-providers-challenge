namespace TekusProviders.Domain.Interfaces;

using TekusProviders.Domain.Entities;

public interface IProviderRepository
{
    Task<Provider?> GetByIdAsync(Guid id);
    Task<IEnumerable<Provider>> GetAllAsync(int pageNumber, int pageSize, string? searchTerm = null);
    Task<int> GetTotalCountAsync(string? searchTerm = null);
    Task<Provider> AddAsync(Provider provider);
    Task UpdateAsync(Provider provider);
    Task DeleteAsync(Guid id);
    Task<bool> ExistsByNitAsync(string nit);
    Task AddCustomFieldAsync(Guid providerId, string fieldName, string fieldValue);
}