namespace TekusProviders.Application.Services;

using TekusProviders.Application.DTOs;
using TekusProviders.Application.Interfaces;
using TekusProviders.Domain.Interfaces;

public class DashboardService : IDashboardService
{
    private readonly IProviderServiceRepository _providerServiceRepository;

    public DashboardService(IProviderServiceRepository providerServiceRepository)
    {
        _providerServiceRepository = providerServiceRepository;
    }

    public async Task<DashboardDto> GetDashboardDataAsync()
    {
        // Obtener todos los países de servicios
        var allProviderServices = await _providerServiceRepository.GetByProviderIdAsync(Guid.Empty);
        
        var dashboard = new DashboardDto();

        // Por ahora retornamos vacío, se implementará con queries SQL específicas
        // TODO: Implementar lógica de agrupación por país
        
        return dashboard;
    }
}
