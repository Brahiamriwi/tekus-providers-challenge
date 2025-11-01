namespace TekusProviders.Domain.Interfaces;

using TekusProviders.Domain.Entities;

public interface IProviderServiceRepository
{
    Task<IEnumerable<ProviderService>> GetByProviderIdAsync(Guid providerId);
    Task<IEnumerable<ProviderService>> GetByServiceIdAsync(Guid serviceId);
    Task AddAsync(ProviderService providerService);
    Task AddCountryToServiceAsync(ServiceCountry serviceCountry);
    Task<IEnumerable<ServiceCountry>> GetCountriesByProviderServiceAsync(Guid providerId, Guid serviceId);
}