# Tekus Providers Challenge

Sistema de gestión de proveedores y servicios desarrollado con .NET 8 y arquitectura DDD (Domain-Driven Design).

## 🏗️ Arquitectura

El proyecto sigue los principios de Domain-Driven Design y SOLID, organizado en las siguientes capas:
```
├── Proyecto-Tekus/
│   ├── TekusProviders.Domain/          # Entidades y lógica de negocio
│   ├── TekusProviders.Application/     # Casos de uso y DTOs
│   ├── TekusProviders.Infrastructure/  # Acceso a datos y servicios externos
│   └── TekusProviders.API/             # Controllers y configuración API
├── tests/
│   └── TekusProviders.Tests/           # Pruebas unitarias
└── database/                            # Scripts SQL
```

## 🚀 Tecnologías

- **.NET 8** - Framework principal
- **ASP.NET Core** - API REST
- **Entity Framework Core** - ORM
- **SQL Server 2022** - Base de datos
- **JWT Bearer** - Autenticación
- **Swagger/OpenAPI** - Documentación API
- **xUnit** - Pruebas unitarias
- **Moq** - Mocking framework
- **FluentAssertions** - Assertions legibles

## 📋 Prerequisitos

- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [SQL Server 2022](https://www.microsoft.com/sql-server/sql-server-downloads) o Docker
- [Git](https://git-scm.com/)

## ⚙️ Configuración e Instalación

### 1. Clonar el repositorio
```bash
git clone https://github.com/Brahiamriwi/tekus-providers-challenge.git
cd tekus-providers-challenge
```

### 2. Configurar SQL Server

**Opción A: SQL Server con Docker (Recomendado)**
```bash
docker run -e "ACCEPT_EULA=Y" \
  -e "MSSQL_SA_PASSWORD=TekusTest2024!" \
  -p 1433:1433 \
  --name sqlserver-tekus \
  -d mcr.microsoft.com/mssql/server:2022-latest
```

**Opción B: SQL Server local**

Si ya tienes SQL Server instalado, ajusta la cadena de conexión en el paso 3.

### 3. Configurar cadena de conexión

Edita `Proyecto-Tekus/TekusProviders.API/appsettings.json`:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost,1433;Database=TekusProvidersDb;User Id=sa;Password=TU_PASSWORD;TrustServerCertificate=True;"
  }
}
```

### 4. Crear base de datos y datos iniciales

Ejecuta los scripts SQL en orden usando tu herramienta favorita (SSMS, Azure Data Studio, DBeaver):

1. `database/01_CreateDatabase.sql` - Crea la base de datos y tablas
2. `database/02_SeedData.sql` - Inserta datos de prueba

### 5. Ejecutar la aplicación
```bash
dotnet run --project Proyecto-Tekus/TekusProviders.API/TekusProviders.API.csproj
```

La API estará disponible en: `http://localhost:5130`

### 6. Acceder a Swagger

Abre tu navegador en: `http://localhost:5130/swagger`

## 🔐 Autenticación

Para usar los endpoints protegidos:

1. **Login**: `POST /api/Auth/login`
```json
   {
     "username": "admin",
     "password": "Tekus2024!"
   }
```

2. **Copiar el token** de la respuesta

3. **Autorizar en Swagger**:
    - Click en el botón "Authorize" 🔒
    - Ingresa: `Bearer TU_TOKEN_AQUI`
    - Click "Authorize"

## 🧪 Ejecutar Pruebas
```bash
# Todas las pruebas
dotnet test

# Con más detalles
dotnet test --verbosity normal

# Solo pruebas de dominio
dotnet test --filter ProviderTests
```

## 📊 Modelo de Datos

### Entidades Principales

- **Providers**: Proveedores con NIT, nombre, email y campos personalizados
- **Services**: Servicios con nombre y tarifa por hora en USD
- **ProviderServices**: Relación muchos a muchos entre proveedores y servicios
- **ServiceCountries**: Países donde cada servicio es ofrecido
- **CustomFields**: Campos personalizados dinámicos para proveedores

## 🔗 Endpoints Principales

### Providers
- `GET /api/Providers` - Listar proveedores (con paginación y búsqueda)
- `GET /api/Providers/{id}` - Obtener proveedor por ID
- `POST /api/Providers` - Crear proveedor
- `PUT /api/Providers/{id}` - Actualizar proveedor
- `DELETE /api/Providers/{id}` - Eliminar proveedor
- `POST /api/Providers/{id}/custom-fields` - Agregar campo personalizado
- `POST /api/Providers/{providerId}/services/{serviceId}` - Asignar servicio

### Services
- `GET /api/Services` - Listar servicios
- `GET /api/Services/{id}` - Obtener servicio por ID
- `POST /api/Services` - Crear servicio
- `PUT /api/Services/{id}` - Actualizar servicio
- `DELETE /api/Services/{id}` - Eliminar servicio

### Countries
- `GET /api/Countries` - Listar países (desde API externa)
- `GET /api/Countries/{code}` - Obtener país por código

### Dashboard
- `GET /api/Dashboard` - Obtener indicadores (proveedores y servicios por país)

## 🛠️ Principios Aplicados

### SOLID
- **Single Responsibility**: Cada clase tiene una única responsabilidad
- **Open/Closed**: Entidades abiertas para extensión, cerradas para modificación
- **Liskov Substitution**: Interfaces bien definidas
- **Interface Segregation**: Interfaces específicas por contexto
- **Dependency Inversion**: Dependencia de abstracciones, no de implementaciones

### DDD (Domain-Driven Design)
- **Agregados**: Provider como raíz de agregado
- **Value Objects**: Uso de tipos inmutables donde aplica
- **Repository Pattern**: Abstracción del acceso a datos
- **Domain Services**: Lógica de negocio en servicios de aplicación

### Clean Architecture
- Separación clara de capas
- Dependencias apuntando hacia el dominio
- Independencia de frameworks en el dominio

## 📝 Notas Técnicas

- Los scripts SQL usan comandos `GO` para ejecutarse en lotes (estándar SQL Server)
- La API externa de países es [REST Countries](https://restcountries.com/)
- Todos los IDs son GUID para mejor distribución
- Las fechas se almacenan en UTC
- Se usa paginación en todos los listados

## 👤 Autor

**Brahiam Riwi**

- GitHub: [@Brahiamriwi](https://github.com/Brahiamriwi)
- Email: jaime.marin@tekus.co (revisor del proyecto)

## 📄 Licencia

Este proyecto fue desarrollado como prueba técnica para Tekus S.A.S.