namespace TekusProviders.Domain.Interfaces;

using TekusProviders.Domain.Entities;

public interface IServiceRepository
{
    Task<Service?> GetByIdAsync(Guid id);
    Task<IEnumerable<Service>> GetAllAsync(int pageNumber, int pageSize, string? searchTerm = null);
    Task<int> GetTotalCountAsync(string? searchTerm = null);
    Task<Service> AddAsync(Service service);
    Task UpdateAsync(Service service);
    Task DeleteAsync(Guid id);
}