namespace TekusProviders.Infrastructure.Repositories;

using Microsoft.EntityFrameworkCore;
using TekusProviders.Domain.Entities;
using TekusProviders.Domain.Interfaces;
using TekusProviders.Infrastructure.Data;

public class ProviderRepository : IProviderRepository
{
    private readonly ApplicationDbContext _context;

    public ProviderRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Provider?> GetByIdAsync(Guid id)
    {
        return await _context.Providers
            .Include(p => p.CustomFields)
            .Include(p => p.ProviderServices)
                .ThenInclude(ps => ps.Service)
            .Include(p => p.ProviderServices)
                .ThenInclude(ps => ps.ServiceCountries)
            .FirstOrDefaultAsync(p => p.Id == id);
    }

    public async Task<IEnumerable<Provider>> GetAllAsync(int pageNumber, int pageSize, string? searchTerm = null)
    {
        var query = _context.Providers
            .Include(p => p.CustomFields)
            .Include(p => p.ProviderServices)
                .ThenInclude(ps => ps.Service)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(searchTerm))
        {
            query = query.Where(p => 
                p.Name.Contains(searchTerm) || 
                p.Nit.Contains(searchTerm) ||
                p.Email.Contains(searchTerm));
        }

        return await query
            .OrderBy(p => p.Name)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();
    }

    public async Task<int> GetTotalCountAsync(string? searchTerm = null)
    {
        var query = _context.Providers.AsQueryable();

        if (!string.IsNullOrWhiteSpace(searchTerm))
        {
            query = query.Where(p => 
                p.Name.Contains(searchTerm) || 
                p.Nit.Contains(searchTerm) ||
                p.Email.Contains(searchTerm));
        }

        return await query.CountAsync();
    }

    public async Task<Provider> AddAsync(Provider provider)
    {
        await _context.Providers.AddAsync(provider);
        await _context.SaveChangesAsync();
        return provider;
    }

    public async Task UpdateAsync(Provider provider)
    {
        _context.Providers.Update(provider);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(Guid id)
    {
        var provider = await _context.Providers.FindAsync(id);
        if (provider != null)
        {
            _context.Providers.Remove(provider);
            await _context.SaveChangesAsync();
        }
    }

    public async Task<bool> ExistsByNitAsync(string nit)
    {
        return await _context.Providers.AnyAsync(p => p.Nit == nit);
    }
}