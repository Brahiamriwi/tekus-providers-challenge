namespace TekusProviders.Infrastructure.Repositories;

using Microsoft.EntityFrameworkCore;
using TekusProviders.Domain.Entities;
using TekusProviders.Domain.Interfaces;
using TekusProviders.Infrastructure.Data;

public class ProviderServiceRepository : IProviderServiceRepository
{
    private readonly ApplicationDbContext _context;

    public ProviderServiceRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<ProviderService>> GetByProviderIdAsync(Guid providerId)
    {
        return await _context.ProviderServices
            .Include(ps => ps.Service)
            .Include(ps => ps.ServiceCountries)
            .Where(ps => ps.ProviderId == providerId)
            .ToListAsync();
    }

    public async Task<IEnumerable<ProviderService>> GetByServiceIdAsync(Guid serviceId)
    {
        return await _context.ProviderServices
            .Include(ps => ps.Provider)
            .Include(ps => ps.ServiceCountries)
            .Where(ps => ps.ServiceId == serviceId)
            .ToListAsync();
    }

    public async Task AddAsync(ProviderService providerService)
    {
        // Verificar si ya existe
        var exists = await _context.ProviderServices
            .AnyAsync(ps => ps.ProviderId == providerService.ProviderId && 
                            ps.ServiceId == providerService.ServiceId);
    
        if (!exists)
        {
            await _context.ProviderServices.AddAsync(providerService);
            await _context.SaveChangesAsync();
        }
        // Si ya existe, simplemente no hacemos nada (los países se agregan en otro método)
    }

    public async Task AddCountryToServiceAsync(ServiceCountry serviceCountry)
    {
        await _context.ServiceCountries.AddAsync(serviceCountry);
        await _context.SaveChangesAsync();
    }

    public async Task<IEnumerable<ServiceCountry>> GetCountriesByProviderServiceAsync(Guid providerId, Guid serviceId)
    {
        return await _context.ServiceCountries
            .Where(sc => sc.ProviderId == providerId && sc.ServiceId == serviceId)
            .ToListAsync();
    }
}