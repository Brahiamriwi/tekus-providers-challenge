# Database Schema - Tekus Providers

## Entity Relationship Diagram

![Entity_Relationship_Diagram](src/images/Entity_Relationship_Diagram.png)

## Tables Description

### Providers
Main entity representing service providers.
- **Id**: Unique identifier (GUID)
- **Nit**: Tax identification number (Unique)
- **Name**: Provider name
- **Email**: Contact email
- **CreatedAt/UpdatedAt**: Timestamps

### Services
Services offered by providers.
- **Id**: Unique identifier (GUID)
- **Name**: Service name
- **HourlyRateUsd**: Hourly rate in USD
- **CreatedAt/UpdatedAt**: Timestamps

### ProviderServices (Junction Table)
Many-to-many relationship between Providers and Services.

### ServiceCountries
Countries where services are offered.

### CustomFields
Dynamic custom fields for providers.

## Relationships

- **Providers → ProviderServices** (1:N)
- **Services → ProviderServices** (1:N)
- **ProviderServices → ServiceCountries** (1:N)
- **Providers → CustomFields** (1:N)