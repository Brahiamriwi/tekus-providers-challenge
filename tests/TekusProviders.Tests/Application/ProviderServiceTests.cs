namespace TekusProviders.Tests.Application;

using FluentAssertions;
using Moq;
using TekusProviders.Application.DTOs;
using TekusProviders.Application.Interfaces;
using TekusProviders.Application.Services;
using TekusProviders.Domain.Entities;
using TekusProviders.Domain.Interfaces;
using Xunit;

public class ProviderServiceTests
{
    private readonly Mock<IProviderRepository> _providerRepositoryMock;
    private readonly Mock<IProviderServiceRepository> _providerServiceRepositoryMock;
    private readonly Mock<ICountryService> _countryServiceMock;
    private readonly TekusProviders.Application.Services.ProviderService _providerService;

    public ProviderServiceTests()
    {
        _providerRepositoryMock = new Mock<IProviderRepository>();
        _providerServiceRepositoryMock = new Mock<IProviderServiceRepository>();
        _countryServiceMock = new Mock<ICountryService>();
        
        _providerService = new TekusProviders.Application.Services.ProviderService(
            _providerRepositoryMock.Object,
            _providerServiceRepositoryMock.Object,
            _countryServiceMock.Object
        );
    }

    [Fact]
    public async Task CreateAsync_ShouldCreateProvider_WhenNitIsUnique()
    {
        // Arrange
        var dto = new CreateProviderDto
        {
            Nit = "900123456-1",
            Name = "Test Provider",
            Email = "test@provider.com"
        };

        _providerRepositoryMock
            .Setup(x => x.ExistsByNitAsync(dto.Nit))
            .ReturnsAsync(false);

        _providerRepositoryMock
            .Setup(x => x.AddAsync(It.IsAny<Provider>()))
            .ReturnsAsync((Provider p) => p);

        // Act
        var result = await _providerService.CreateAsync(dto);

        // Assert
        result.Should().NotBeNull();
        result.Nit.Should().Be(dto.Nit);
        result.Name.Should().Be(dto.Name);
        result.Email.Should().Be(dto.Email);
        
        _providerRepositoryMock.Verify(x => x.ExistsByNitAsync(dto.Nit), Times.Once);
        _providerRepositoryMock.Verify(x => x.AddAsync(It.IsAny<Provider>()), Times.Once);
    }

    [Fact]
    public async Task CreateAsync_ShouldThrowException_WhenNitAlreadyExists()
    {
        // Arrange
        var dto = new CreateProviderDto
        {
            Nit = "900123456-1",
            Name = "Test Provider",
            Email = "test@provider.com"
        };

        _providerRepositoryMock
            .Setup(x => x.ExistsByNitAsync(dto.Nit))
            .ReturnsAsync(true);

        // Act
        Func<Task> act = async () => await _providerService.CreateAsync(dto);

        // Assert
        await act.Should().ThrowAsync<InvalidOperationException>()
            .WithMessage("*already exists*");
        
        _providerRepositoryMock.Verify(x => x.AddAsync(It.IsAny<Provider>()), Times.Never);
    }

    [Fact]
    public async Task GetByIdAsync_ShouldReturnProvider_WhenExists()
    {
        // Arrange
        var providerId = Guid.NewGuid();
        var provider = new Provider("900123456-1", "Test Provider", "test@provider.com");
        
        _providerRepositoryMock
            .Setup(x => x.GetByIdAsync(providerId))
            .ReturnsAsync(provider);

        // Act
        var result = await _providerService.GetByIdAsync(providerId);

        // Assert
        result.Should().NotBeNull();
        result!.Nit.Should().Be(provider.Nit);
        result.Name.Should().Be(provider.Name);
    }

    [Fact]
    public async Task GetByIdAsync_ShouldReturnNull_WhenNotExists()
    {
        // Arrange
        var providerId = Guid.NewGuid();
        
        _providerRepositoryMock
            .Setup(x => x.GetByIdAsync(providerId))
            .ReturnsAsync((Provider?)null);

        // Act
        var result = await _providerService.GetByIdAsync(providerId);

        // Assert
        result.Should().BeNull();
    }

    [Fact]
    public async Task UpdateAsync_ShouldUpdateProvider_WhenExists()
    {
        // Arrange
        var providerId = Guid.NewGuid();
        var existingProvider = new Provider("900123456-1", "Old Name", "old@test.com");
        var updateDto = new UpdateProviderDto
        {
            Name = "New Name",
            Email = "new@test.com"
        };

        _providerRepositoryMock
            .Setup(x => x.GetByIdAsync(providerId))
            .ReturnsAsync(existingProvider);

        // Act
        var result = await _providerService.UpdateAsync(providerId, updateDto);

        // Assert
        result.Should().NotBeNull();
        result.Name.Should().Be(updateDto.Name);
        result.Email.Should().Be(updateDto.Email);
        
        _providerRepositoryMock.Verify(x => x.UpdateAsync(It.IsAny<Provider>()), Times.Once);
    }

    [Fact]
    public async Task DeleteAsync_ShouldThrowException_WhenProviderNotFound()
    {
        // Arrange
        var providerId = Guid.NewGuid();
        
        _providerRepositoryMock
            .Setup(x => x.GetByIdAsync(providerId))
            .ReturnsAsync((Provider?)null);

        // Act
        Func<Task> act = async () => await _providerService.DeleteAsync(providerId);

        // Assert
        await act.Should().ThrowAsync<KeyNotFoundException>();
    }
}