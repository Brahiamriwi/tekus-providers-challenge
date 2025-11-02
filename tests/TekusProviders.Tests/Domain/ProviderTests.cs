namespace TekusProviders.Tests.Domain;

using FluentAssertions;
using TekusProviders.Domain.Entities;
using Xunit;

public class ProviderTests
{
    [Fact]
    public void Constructor_ShouldCreateProvider_WithValidData()
    {
        // Arrange
        var nit = "900123456-1";
        var name = "Test Provider";
        var email = "test@provider.com";

        // Act
        var provider = new Provider(nit, name, email);

        // Assert
        provider.Should().NotBeNull();
        provider.Id.Should().NotBeEmpty();
        provider.Nit.Should().Be(nit);
        provider.Name.Should().Be(name);
        provider.Email.Should().Be(email);
        provider.CreatedAt.Should().BeCloseTo(DateTime.UtcNow, TimeSpan.FromSeconds(1));
        provider.CustomFields.Should().BeEmpty();
    }

    [Fact]
    public void Constructor_ShouldThrowException_WhenNitIsNull()
    {
        // Arrange
        string nit = null!;
        var name = "Test Provider";
        var email = "test@provider.com";

        // Act
        Action act = () => new Provider(nit, name, email);

        // Assert
        act.Should().Throw<ArgumentNullException>()
            .WithParameterName("nit");
    }

    [Fact]
    public void UpdateInfo_ShouldUpdateProviderData()
    {
        // Arrange
        var provider = new Provider("900123456-1", "Original Name", "original@test.com");
        var newName = "Updated Name";
        var newEmail = "updated@test.com";

        // Act
        provider.UpdateInfo(newName, newEmail);

        // Assert
        provider.Name.Should().Be(newName);
        provider.Email.Should().Be(newEmail);
        provider.UpdatedAt.Should().NotBeNull();
        provider.UpdatedAt.Should().BeCloseTo(DateTime.UtcNow, TimeSpan.FromSeconds(1));
    }

    [Fact]
    public void AddCustomField_ShouldAddFieldToProvider()
    {
        // Arrange
        var provider = new Provider("900123456-1", "Test Provider", "test@provider.com");
        var fieldName = "Phone Number";
        var fieldValue = "+57 300 123 4567";

        // Act
        provider.AddCustomField(fieldName, fieldValue);

        // Assert
        provider.CustomFields.Should().HaveCount(1);
        provider.CustomFields.First().FieldName.Should().Be(fieldName);
        provider.CustomFields.First().FieldValue.Should().Be(fieldValue);
        provider.UpdatedAt.Should().NotBeNull();
    }
}