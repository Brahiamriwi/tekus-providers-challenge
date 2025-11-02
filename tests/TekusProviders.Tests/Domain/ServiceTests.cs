namespace TekusProviders.Tests.Domain;

using FluentAssertions;
using TekusProviders.Domain.Entities;
using Xunit;

public class ServiceTests
{
    [Fact]
    public void Constructor_ShouldCreateService_WithValidData()
    {
        // Arrange
        var name = "Cloud Infrastructure Management";
        var hourlyRate = 150.00m;

        // Act
        var service = new Service(name, hourlyRate);

        // Assert
        service.Should().NotBeNull();
        service.Id.Should().NotBeEmpty();
        service.Name.Should().Be(name);
        service.HourlyRateUsd.Should().Be(hourlyRate);
        service.CreatedAt.Should().BeCloseTo(DateTime.UtcNow, TimeSpan.FromSeconds(1));
    }

    [Fact]
    public void Constructor_ShouldThrowException_WhenHourlyRateIsNegative()
    {
        // Arrange
        var name = "Test Service";
        var hourlyRate = -10.00m;

        // Act
        Action act = () => new Service(name, hourlyRate);

        // Assert
        act.Should().Throw<ArgumentException>()
            .WithMessage("*must be non-negative*");
    }

    [Fact]
    public void UpdateInfo_ShouldUpdateServiceData()
    {
        // Arrange
        var service = new Service("Original Service", 100.00m);
        var newName = "Updated Service";
        var newRate = 200.00m;

        // Act
        service.UpdateInfo(newName, newRate);

        // Assert
        service.Name.Should().Be(newName);
        service.HourlyRateUsd.Should().Be(newRate);
        service.UpdatedAt.Should().NotBeNull();
    }

    [Theory]
    [InlineData(0)]
    [InlineData(50.5)]
    [InlineData(1000.99)]
    public void Constructor_ShouldAcceptValidHourlyRates(decimal rate)
    {
        // Arrange & Act
        var service = new Service("Test Service", rate);

        // Assert
        service.HourlyRateUsd.Should().Be(rate);
    }
}