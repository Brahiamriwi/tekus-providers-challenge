namespace TekusProviders.Application.Interfaces;

using TekusProviders.Application.DTOs;

public interface IDashboardService
{
    Task<DashboardDto> GetDashboardDataAsync();
}