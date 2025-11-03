# Tekus Providers Challenge

[![en](https://img.shields.io/badge/lang-en-red.svg)](README.md)
[![es](https://img.shields.io/badge/lang-es-yellow.svg)](README.es.md)

Provider and service management system developed with .NET 8 and DDD (Domain-Driven Design) architecture.

## 📖 Project Description

This project is a solution for centralized management of technical service providers for Tekus S.A.S. It allows managing provider information, offered services, rates, country coverage, and custom fields, facilitating decision-making and operational control.

### Problem It Solves

Tekus needed a system that would allow:
- ✅ Centralize information from multiple providers
- ✅ Register services with their rates in USD
- ✅ Manage geographic coverage per service
- ✅ Add custom fields according to specific needs
- ✅ Obtain quick indicators for decision-making
- ✅ Maintain traceability with date auditing

### Implemented Features

#### For the Administrator:
- 🔐 **JWT Authentication** - Secure login with tokens
- 👥 **Provider Management** - Complete CRUD with search and pagination
- 🛠️ **Service Management** - Complete CRUD with search
- 🏷️ **Custom Fields** - Add dynamic information to providers
- 🌍 **Service Assignment** - Link services with providers and countries
- 🔍 **Search and Filters** - Quickly locate information
- 📄 **Pagination** - Efficient handling of large data volumes

#### For Tekus (Business Value):
- 📊 **Dashboard with KPIs** - Visualization of providers and services by country
- 🌐 **External API Integration** - Automatically updated country data
- 📝 **Auditing** - Recording of creation and update dates
- 🎨 **Modern Interface** - React frontend with real-time notifications
- 🔄 **RESTful API** - Documented with Swagger/OpenAPI
- ✅ **Validations** - Prevention of duplicates and inconsistent data

## 🏗️ Architecture

The project follows Domain-Driven Design with layer separation:
```
├── Proyecto-Tekus/
│   ├── TekusProviders.Domain/          # Entities and business logic
│   ├── TekusProviders.Application/     # Use cases and DTOs
│   ├── TekusProviders.Infrastructure/  # Data access and external services
│   └── TekusProviders.API/             # Controllers and API configuration
├── frontend/                            # React application with Tailwind CSS
├── tests/
│   └── TekusProviders.Tests/           # Unit tests
└── database/                            # SQL scripts and ER diagram
```

## 🚀 Technologies

### Backend
- **.NET 8** - Main framework
- **ASP.NET Core** - REST API
- **Entity Framework Core** - ORM
- **SQL Server 2022** - Database
- **JWT Bearer** - Authentication
- **Swagger/OpenAPI** - API documentation
- **xUnit + Moq + FluentAssertions** - Testing

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Axios** - HTTP client
- **React Hot Toast** - Notifications

## 📋 Prerequisites

- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Node.js 18+](https://nodejs.org/) and npm
- [SQL Server 2022](https://www.microsoft.com/sql-server/sql-server-downloads) or Docker
- [Git](https://git-scm.com/)

## 🎯 Quick Start for Reviewers

To quickly evaluate this project, follow these simplified steps:

### Test Credentials

**SQL Server (Docker container):**
- Server: `localhost,1433`
- User: `sa`
- Password: `TekusTest2024!`
- Database: `TekusProvidersDb`

**Application Login:**
- Username: `admin`
- Password: `Tekus2024!`

> **Note**: These are test credentials for local development only. In production environments, use secure credentials and environment variables.

---

## ⚡ Setup in 3 Minutes

Follow these steps to run the project:

**1. Start Database (30 seconds)**
```bash
docker run -e "ACCEPT_EULA=Y" -e "MSSQL_SA_PASSWORD=TekusTest2024!" -p 1433:1433 --name sqlserver-tekus -d mcr.microsoft.com/mssql/server:2022-latest
```

**2. Configure Application (1 minute)**
```bash
# Copy configuration template
cp Proyecto-Tekus/TekusProviders.API/appsettings.Example.json Proyecto-Tekus/TekusProviders.API/appsettings.json

# Edit appsettings.json and replace:
# - YOUR_PASSWORD_HERE → TekusTest2024!
# - CHANGE_THIS_TO... → any-secure-key-with-32-chars-minimum
```

**3. Run Database Scripts (1 minute)**
- Execute `database/01_CreateDatabase.sql`
- Execute `database/02_SeedData.sql`

**4. Start Backend & Frontend (30 seconds)**
```bash
# Terminal 1: Backend
dotnet run --project Proyecto-Tekus/TekusProviders.API/TekusProviders.API.csproj

# Terminal 2: Frontend
cd frontend && npm install && npm run dev
```

**5. Access:**
- Frontend: http://localhost:5173 (login: admin / Tekus2024!)
- Swagger: http://localhost:5130/swagger

✅ **Done! The project is running.**

---


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

**⚠️ IMPORTANT**: The project uses `appsettings.Example.json` as a template. You must create your own `appsettings.json`:

**On Linux/Mac:**
```bash
cp Proyecto-Tekus/TekusProviders.API/appsettings.Example.json Proyecto-Tekus/TekusProviders.API/appsettings.json
```

**On Windows PowerShell:**
```powershell
Copy-Item Proyecto-Tekus/TekusProviders.API/appsettings.Example.json Proyecto-Tekus/TekusProviders.API/appsettings.json
```

Edit `Proyecto-Tekus/TekusProviders.API/appsettings.json` and configure:

1. **Database Connection**: Update with your SQL Server credentials
    - Replace `YOUR_PASSWORD_HERE` with `TekusTest2024!` (if using Docker)
    - Or use your own SQL Server credentials

2. **JWT Secret**: Change to a secure random string (minimum 32 characters)
    - Replace the placeholder with your own secret key
    - For testing, you can use any string with 32+ characters

**🔒 Security Notes**:
- `appsettings.json` is ignored by Git and should NEVER be committed
- Never share your actual production passwords in documentation
- Use different credentials for development and production

### 4. Create database and seed data

Execute the SQL scripts in order using your preferred tool (SSMS, Azure Data Studio, DBeaver):

1. `database/01_CreateDatabase.sql` - Creates database and tables
2. `database/02_SeedData.sql` - Inserts test data

You can view the ER diagram at: `database/DATABASE_DIAGRAM.md`

### 5. Run the Backend
```bash
dotnet run --project Proyecto-Tekus/TekusProviders.API/TekusProviders.API.csproj
```

The API will be available at: `http://localhost:5130`

Access Swagger at: `http://localhost:5130/swagger`

### 6. Run the Frontend
```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at: `http://localhost:5173`

## 🔐 Authentication

To use protected endpoints:

### In Swagger:
1. **Login**: `POST /api/Auth/login`
```json
   {
     "username": "admin",
     "password": "Tekus2024!"
   }
```
2. Copy the token from the response
3. Click "Authorize" 🔒
4. Enter: `Bearer YOUR_TOKEN_HERE`

### In the Frontend:
1. Open `http://localhost:5173`
2. Enter credentials:
    - Username: `admin`
    - Password: `Tekus2024!`
3. The token is automatically saved

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

See complete diagram at: `database/DATABASE_DIAGRAM.md`

## 🔗 Main Endpoints

### Authentication
- `POST /api/Auth/login` - Login

### Providers
- `GET /api/Providers` - List providers (pagination and search)
- `GET /api/Providers/{id}` - Get provider by ID
- `POST /api/Providers` - Create provider
- `PUT /api/Providers/{id}` - Update provider
- `DELETE /api/Providers/{id}` - Delete provider
- `POST /api/Providers/{id}/custom-fields` - Add custom field
- `POST /api/Providers/{providerId}/services/{serviceId}` - Assign service with countries

### Services
- `GET /api/Services` - List services
- `GET /api/Services/{id}` - Get service by ID
- `POST /api/Services` - Create service
- `PUT /api/Services/{id}` - Update service
- `DELETE /api/Services/{id}` - Delete service

### Countries
- `GET /api/Countries` - List countries (external API)
- `GET /api/Countries/{code}` - Get country by code

### Dashboard
- `GET /api/Dashboard` - Get indicators (providers and services by country)

## 🛠️ Applied Principles

### SOLID
- ✅ **Single Responsibility (S)**: Each class has a single well-defined responsibility
    - `ProviderService` handles only provider logic
    - `CountryService` only manages countries
    - Repositories focused on specific data access

### DDD (Domain-Driven Design)
- **Aggregates**: Provider as aggregate root
- **Value Objects**: Use of immutable types where applicable
- **Repository Pattern**: Data access abstraction
- **Domain Services**: Business logic in application services

### Clean Architecture
- Clear layer separation
- Dependencies pointing toward the domain
- Framework independence in the domain

## 🚧 Known Limitations and Future Improvements

### Not Implemented (Future Improvements)
- ❌ **Edit Custom Fields** - Endpoint `PUT /api/Providers/{id}/custom-fields/{fieldId}`
- ❌ **Delete Custom Fields** - Endpoint `DELETE /api/Providers/{id}/custom-fields/{fieldId}`
- ❌ **Edit Assigned Services** - Modify countries of an already assigned service
- ❌ **Delete Assigned Services** - Endpoint `DELETE /api/Providers/{providerId}/services/{serviceId}`
- ❌ **Frontend Pagination** - Previous/Next buttons to navigate between pages
- ❌ **Deployment** - Configuration for Azure/AWS
- ❌ **More SOLID Principles** - Implement O, L, I, D more explicitly
- ❌ **Caching** - To improve performance on frequent queries
- ❌ **Advanced Logging** - Integration with Serilog or Application Insights

### Design Decisions
- **NIT is not editable** as it's a unique tax identifier
- **Custom Fields can be added but not edited/deleted** (MVP)
- **Basic pagination** in backend, not implemented in UI
- **Single user role** (Admin) for simplicity

## 📝 Technical Notes

- SQL scripts use `GO` commands for batch execution (SQL Server standard)
- External countries API: [REST Countries](https://restcountries.com/)
- All IDs are GUIDs for better distribution
- Dates stored in UTC
- Frontend developed after functional backend
- Visual notifications to improve UX

## 👤 Author

**Brahiam Riwi**

- GitHub: [@Brahiamriwi](https://github.com/Brahiamriwi)
- Reviewer: jaime.marin@tekus.co

## 📄 License

This project was developed as a technical test for Tekus S.A.S.

---

## 🎯 Evaluation Guide

To evaluate the project quickly:

1. ✅ Run SQL scripts (01 and 02)
2. ✅ Start backend: `dotnet run`
3. ✅ Test endpoints in Swagger: `http://localhost:5130/swagger`
4. ✅ Start frontend: `npm install && npm run dev`
5. ✅ Login with `admin / Tekus2024!`
6. ✅ Create a provider and assign services
7. ✅ View tests: `dotnet test`
8. ✅ Review code following DDD architecture

**Estimated evaluation time: 20-30 minutes**