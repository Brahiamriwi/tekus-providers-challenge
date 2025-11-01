namespace TekusProviders.Infrastructure.Repositories;

using Microsoft.EntityFrameworkCore;
using TekusProviders.Domain.Entities;
using TekusProviders.Domain.Interfaces;
using TekusProviders.Infrastructure.Data;

public class ServiceRepository : IServiceRepository
{
    private readonly ApplicationDbContext _context;

    public ServiceRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Service?> GetByIdAsync(Guid id)
    {
        return await _context.Services
            .Include(s => s.ProviderServices)
                .ThenInclude(ps => ps.ServiceCountries)
            .FirstOrDefaultAsync(s => s.Id == id);
    }

    public async Task<IEnumerable<Service>> GetAllAsync(int pageNumber, int pageSize, string? searchTerm = null)
    {
        var query = _context.Services.AsQueryable();

        if (!string.IsNullOrWhiteSpace(searchTerm))
        {
            query = query.Where(s => s.Name.Contains(searchTerm));
        }

        return await query
            .OrderBy(s => s.Name)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();
    }

    public async Task<int> GetTotalCountAsync(string? searchTerm = null)
    {
        var query = _context.Services.AsQueryable();

        if (!string.IsNullOrWhiteSpace(searchTerm))
        {
            query = query.Where(s => s.Name.Contains(searchTerm));
        }

        return await query.CountAsync();
    }

    public async Task<Service> AddAsync(Service service)
    {
        await _context.Services.AddAsync(service);
        await _context.SaveChangesAsync();
        return service;
    }

    public async Task UpdateAsync(Service service)
    {
        _context.Services.Update(service);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(Guid id)
    {
        var service = await _context.Services.FindAsync(id);
        if (service != null)
        {
            _context.Services.Remove(service);
            await _context.SaveChangesAsync();
        }
    }
}