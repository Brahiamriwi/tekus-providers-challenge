namespace TekusProviders.Application.Services;

using TekusProviders.Application.DTOs;
using TekusProviders.Application.Interfaces;
using TekusProviders.Domain.Entities;
using TekusProviders.Domain.Interfaces;

public class ProviderService : IProviderService
{
    private readonly IProviderRepository _providerRepository;
    private readonly IProviderServiceRepository _providerServiceRepository;
    private readonly ICountryService _countryService;

    public ProviderService(
        IProviderRepository providerRepository,
        IProviderServiceRepository providerServiceRepository,
        ICountryService countryService)
    {
        _providerRepository = providerRepository;
        _providerServiceRepository = providerServiceRepository;
        _countryService = countryService;
    }

    public async Task<ProviderDto?> GetByIdAsync(Guid id)
    {
        var provider = await _providerRepository.GetByIdAsync(id);
        return provider == null ? null : MapToDto(provider);
    }

    public async Task<PaginatedResultDto<ProviderDto>> GetAllAsync(int pageNumber, int pageSize, string? searchTerm = null)
    {
        var providers = await _providerRepository.GetAllAsync(pageNumber, pageSize, searchTerm);
        var totalCount = await _providerRepository.GetTotalCountAsync(searchTerm);
        var totalPages = (int)Math.Ceiling(totalCount / (double)pageSize);

        return new PaginatedResultDto<ProviderDto>
        {
            Items = providers.Select(MapToDto),
            PageNumber = pageNumber,
            PageSize = pageSize,
            TotalPages = totalPages,
            TotalCount = totalCount
        };
    }

    public async Task<ProviderDto> CreateAsync(CreateProviderDto dto)
    {
        // Validar que el NIT no exista
        if (await _providerRepository.ExistsByNitAsync(dto.Nit))
        {
            throw new InvalidOperationException($"Provider with NIT {dto.Nit} already exists");
        }

        var provider = new Provider(dto.Nit, dto.Name, dto.Email);
        await _providerRepository.AddAsync(provider);
        
        return MapToDto(provider);
    }

    public async Task<ProviderDto> UpdateAsync(Guid id, UpdateProviderDto dto)
    {
        var provider = await _providerRepository.GetByIdAsync(id);
        if (provider == null)
        {
            throw new KeyNotFoundException($"Provider with ID {id} not found");
        }

        provider.UpdateInfo(dto.Name, dto.Email);
        await _providerRepository.UpdateAsync(provider);
        
        return MapToDto(provider);
    }

    public async Task DeleteAsync(Guid id)
    {
        var provider = await _providerRepository.GetByIdAsync(id);
        if (provider == null)
        {
            throw new KeyNotFoundException($"Provider with ID {id} not found");
        }

        await _providerRepository.DeleteAsync(id);
    }

    public async Task AddCustomFieldAsync(Guid providerId, CreateCustomFieldDto dto)
    {
        var provider = await _providerRepository.GetByIdAsync(providerId);
        if (provider == null)
        {
            throw new KeyNotFoundException($"Provider with ID {providerId} not found");
        }

        await _providerRepository.AddCustomFieldAsync(providerId, dto.FieldName, dto.FieldValue);
    }

public async Task AssignServiceAsync(Guid providerId, Guid serviceId, List<string> countryCodes)
{
    var provider = await _providerRepository.GetByIdAsync(providerId);
    if (provider == null)
    {
        throw new KeyNotFoundException($"Provider with ID {providerId} not found");
    }

    // Intentar crear la relación (si ya existe, no hace nada)
    var providerService = new Domain.Entities.ProviderService(providerId, serviceId);
    await _providerServiceRepository.AddAsync(providerService);

    // Obtener países ya asignados
    var existingCountries = await _providerServiceRepository
        .GetCountriesByProviderServiceAsync(providerId, serviceId);
    var existingCountryCodes = existingCountries.Select(sc => sc.CountryCode).ToHashSet();

    // Agregar solo los países nuevos
    foreach (var countryCode in countryCodes)
    {
        // Evitar duplicados
        if (!existingCountryCodes.Contains(countryCode))
        {
            var country = await _countryService.GetCountryByCodeAsync(countryCode);
            if (country != null)
            {
                var serviceCountry = new Domain.Entities.ServiceCountry(
                    providerId, 
                    serviceId, 
                    country.Code, 
                    country.Name
                );
                await _providerServiceRepository.AddCountryToServiceAsync(serviceCountry);
            }
        }
    }
}
    private static ProviderDto MapToDto(Provider provider)
    {
    return new ProviderDto
    {
        Id = provider.Id,
        Nit = provider.Nit,
        Name = provider.Name,
        Email = provider.Email,
        CreatedAt = provider.CreatedAt,
        CustomFields = provider.CustomFields.Select(cf => new CustomFieldDto
        {
            Id = cf.Id,
            FieldName = cf.FieldName,
            FieldValue = cf.FieldValue
        }).ToList(),
        // Agregar los servicios asignados
        Services = provider.ProviderServices.Select(ps => new ServiceDto
        {
            Id = ps.Service.Id,
            Name = ps.Service.Name,
            HourlyRateUsd = ps.Service.HourlyRateUsd,
            Countries = ps.ServiceCountries.Select(sc => new CountryDto
            {
                Code = sc.CountryCode,
                Name = sc.CountryName
            }).ToList()
        }).ToList()
    };
}
}