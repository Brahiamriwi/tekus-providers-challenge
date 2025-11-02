# Tekus Providers Challenge

[![es](https://img.shields.io/badge/lang-es-yellow.svg)](README.es.md)

Provider and service management system developed with .NET 8 and DDD (Domain-Driven Design) architecture.

## 🏗️ Architecture

The project follows Domain-Driven Design and SOLID principles, organized in the following layers:
```
├── Proyecto-Tekus/
│   ├── TekusProviders.Domain/          # Entities and business logic
│   ├── TekusProviders.Application/     # Use cases and DTOs
│   ├── TekusProviders.Infrastructure/  # Data access and external services
│   └── TekusProviders.API/             # Controllers and API configuration
├── tests/
│   └── TekusProviders.Tests/           # Unit tests
└── database/                            # SQL scripts
```

## 🚀 Technologies

- **.NET 8** - Main framework
- **ASP.NET Core** - REST API
- **Entity Framework Core** - ORM
- **SQL Server 2022** - Database
- **JWT Bearer** - Authentication
- **Swagger/OpenAPI** - API documentation
- **xUnit** - Unit testing
- **Moq** - Mocking framework
- **FluentAssertions** - Readable assertions

## 📋 Prerequisites

- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [SQL Server 2022](https://www.microsoft.com/sql-server/sql-server-downloads) or Docker
- [Git](https://git-scm.com/)

## ⚙️ Setup and Installation

### 1. Clone the repository
```bash
git clone https://github.com/Brahiamriwi/tekus-providers-challenge.git
cd tekus-providers-challenge
```

### 2. Setup SQL Server

**Option A: SQL Server with Docker (Recommended)**
```bash
docker run -e "ACCEPT_EULA=Y" \
  -e "MSSQL_SA_PASSWORD=TekusTest2024!" \
  -p 1433:1433 \
  --name sqlserver-tekus \
  -d mcr.microsoft.com/mssql/server:2022-latest
```

**Option B: Local SQL Server**

If you already have SQL Server installed, adjust the connection string in step 3.

### 3. Configure connection string

Edit `Proyecto-Tekus/TekusProviders.API/appsettings.json`:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost,1433;Database=TekusProvidersDb;User Id=sa;Password=YOUR_PASSWORD;TrustServerCertificate=True;"
  }
}
```

### 4. Create database and seed data

Execute the SQL scripts in order using your preferred tool (SSMS, Azure Data Studio, DBeaver):

1. `database/01_CreateDatabase.sql` - Creates database and tables
2. `database/02_SeedData.sql` - Inserts test data

### 5. Run the application
```bash
dotnet run --project Proyecto-Tekus/TekusProviders.API/TekusProviders.API.csproj
```

The API will be available at: `http://localhost:5130`

### 6. Access Swagger

Open your browser at: `http://localhost:5130/swagger`

## 🔐 Authentication

To use protected endpoints:

1. **Login**: `POST /api/Auth/login`
```json
   {
     "username": "admin",
     "password": "Tekus2024!"
   }
```

2. **Copy the token** from the response

3. **Authorize in Swagger**:
    - Click the "Authorize" button 🔒
    - Enter: `Bearer YOUR_TOKEN_HERE`
    - Click "Authorize"

## 🧪 Run Tests
```bash
# All tests
dotnet test

# With more details
dotnet test --verbosity normal

# Domain tests only
dotnet test --filter ProviderTests
```

## 📊 Data Model

### Main Entities

- **Providers**: Providers with NIT, name, email, and custom fields
- **Services**: Services with name and hourly rate in USD
- **ProviderServices**: Many-to-many relationship between providers and services
- **ServiceCountries**: Countries where each service is offered
- **CustomFields**: Dynamic custom fields for providers

## 🔗 Main Endpoints

### Providers
- `GET /api/Providers` - List providers (with pagination and search)
- `GET /api/Providers/{id}` - Get provider by ID
- `POST /api/Providers` - Create provider
- `PUT /api/Providers/{id}` - Update provider
- `DELETE /api/Providers/{id}` - Delete provider
- `POST /api/Providers/{id}/custom-fields` - Add custom field
- `POST /api/Providers/{providerId}/services/{serviceId}` - Assign service

### Services
- `GET /api/Services` - List services
- `GET /api/Services/{id}` - Get service by ID
- `POST /api/Services` - Create service
- `PUT /api/Services/{id}` - Update service
- `DELETE /api/Services/{id}` - Delete service

### Countries
- `GET /api/Countries` - List countries (from external API)
- `GET /api/Countries/{code}` - Get country by code

### Dashboard
- `GET /api/Dashboard` - Get indicators (providers and services by country)

## 🛠️ Applied Principles

### SOLID
- **Single Responsibility**: Each class has a single responsibility
- **Open/Closed**: Entities open for extension, closed for modification
- **Liskov Substitution**: Well-defined interfaces
- **Interface Segregation**: Context-specific interfaces
- **Dependency Inversion**: Dependency on abstractions, not implementations

### DDD (Domain-Driven Design)
- **Aggregates**: Provider as aggregate root
- **Value Objects**: Use of immutable types where applicable
- **Repository Pattern**: Data access abstraction
- **Domain Services**: Business logic in application services

### Clean Architecture
- Clear layer separation
- Dependencies pointing toward the domain
- Framework independence in the domain

## 📝 Technical Notes

- SQL scripts use `GO` commands for batch execution (SQL Server standard)
- External countries API is [REST Countries](https://restcountries.com/)
- All IDs are GUIDs for better distribution
- Dates are stored in UTC
- Pagination is used in all listings

## 👤 Author

**Brahiam Riwi**

- GitHub: [@Brahiamriwi](https://github.com/Brahiamriwi)
- Reviewer: jaime.marin@tekus.co

## 📄 License

This project was developed as a technical test for Tekus S.A.S.