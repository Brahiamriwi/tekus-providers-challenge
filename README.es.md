# Tekus Providers Challenge

[![es](https://img.shields.io/badge/lang-es-yellow.svg)](README.es.md)

Sistema de gestión de proveedores y servicios desarrollado con .NET 8 y arquitectura DDD (Domain-Driven Design).

## 📖 Descripción del Proyecto

Este proyecto es una solución para la gestión centralizada de proveedores de servicios técnicos de Tekus S.A.S. Permite administrar información de proveedores, servicios ofrecidos, tarifas, países de cobertura y campos personalizados, facilitando la toma de decisiones y el control operativo.

### Problema que Resuelve

Tekus necesitaba un sistema que permitiera:
- ✅ Centralizar información de múltiples proveedores
- ✅ Registrar servicios con sus tarifas en USD
- ✅ Gestionar cobertura geográfica por servicio
- ✅ Agregar campos personalizados según necesidades específicas
- ✅ Obtener indicadores rápidos para toma de decisiones
- ✅ Mantener trazabilidad con auditoría de fechas

### Funcionalidades Implementadas

#### Para el Administrador:
- 🔐 **Autenticación JWT** - Login seguro con tokens
- 👥 **Gestión de Proveedores** - CRUD completo con búsqueda y paginación
- 🛠️ **Gestión de Servicios** - CRUD completo con búsqueda
- 🏷️ **Campos Personalizados** - Agregar información dinámica a proveedores
- 🌍 **Asignación de Servicios** - Vincular servicios con proveedores y países
- 🔍 **Búsqueda y Filtros** - Localizar información rápidamente
- 📄 **Paginación** - Manejo eficiente de grandes volúmenes de datos

#### Para Tekus (Valor de Negocio):
- 📊 **Dashboard con KPIs** - Visualización de proveedores y servicios por país
- 🌐 **Integración con API Externa** - Datos de países actualizados automáticamente
- 📝 **Auditoría** - Registro de fechas de creación y actualización
- 🎨 **Interfaz Moderna** - Frontend React con notificaciones en tiempo real
- 🔄 **API RESTful** - Documentada con Swagger/OpenAPI
- ✅ **Validaciones** - Prevención de duplicados y datos inconsistentes

## 🏗️ Arquitectura

El proyecto sigue Domain-Driven Design con separación en capas:
```
├── Proyecto-Tekus/
│   ├── TekusProviders.Domain/          # Entidades y lógica de negocio
│   ├── TekusProviders.Application/     # Casos de uso y DTOs
│   ├── TekusProviders.Infrastructure/  # Acceso a datos y servicios externos
│   └── TekusProviders.API/             # Controladores y configuración de API
├── frontend/                            # Aplicación React con Tailwind CSS
├── tests/
│   └── TekusProviders.Tests/           # Pruebas unitarias
└── database/                            # Scripts SQL y diagrama ER
```

## 🚀 Tecnologías

### Backend
- **.NET 8** - Framework principal
- **ASP.NET Core** - API REST
- **Entity Framework Core** - ORM
- **SQL Server 2022** - Base de datos
- **JWT Bearer** - Autenticación
- **Swagger/OpenAPI** - Documentación de API
- **xUnit + Moq + FluentAssertions** - Testing

### Frontend
- **React 18** - Librería UI
- **Vite** - Build tool
- **Tailwind CSS** - Estilos
- **React Router** - Navegación
- **Axios** - Cliente HTTP
- **React Hot Toast** - Notificaciones

## 📋 Requisitos Previos

- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Node.js 18+](https://nodejs.org/) y npm
- [SQL Server 2022](https://www.microsoft.com/sql-server/sql-server-downloads) o Docker
- [Git](https://git-scm.com/)

## ⚙️ Instalación y Configuración

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

**Opción B: SQL Server Local**

Si ya tienes SQL Server instalado, ajusta la cadena de conexión en el paso 3.

### 3. Configurar cadena de conexión

Edita `Proyecto-Tekus/TekusProviders.API/appsettings.json`:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost,1433;Database=TekusProvidersDb;User Id=sa;Password=TU_CONTRASEÑA;TrustServerCertificate=True;"
  }
}
```

### 4. Crear base de datos e insertar datos

Ejecuta los scripts SQL en orden usando tu herramienta preferida (SSMS, Azure Data Studio, DBeaver):

1. `database/01_CreateDatabase.sql` - Crea la base de datos y tablas
2. `database/02_SeedData.sql` - Inserta datos de prueba

Puedes ver el diagrama ER en: `database/DATABASE_DIAGRAM.md`

### 5. Ejecutar el Backend
```bash
dotnet run --project Proyecto-Tekus/TekusProviders.API/TekusProviders.API.csproj
```

La API estará disponible en: `http://localhost:5130`

Accede a Swagger en: `http://localhost:5130/swagger`

### 6. Ejecutar el Frontend
```bash
cd frontend
npm install
npm run dev
```

El frontend estará disponible en: `http://localhost:5173`

## 🔐 Autenticación

Para usar endpoints protegidos:

### En Swagger:
1. **Login**: `POST /api/Auth/login`
```json
   {
     "username": "admin",
     "password": "Tekus2024!"
   }
```
2. Copia el token de la respuesta
3. Click en "Authorize" 🔒
4. Ingresa: `Bearer TU_TOKEN_AQUI`

### En el Frontend:
1. Abre `http://localhost:5173`
2. Ingresa credenciales:
    - Username: `admin`
    - Password: `Tekus2024!`
3. El token se guarda automáticamente

## 🧪 Ejecutar Pruebas
```bash
# Todas las pruebas
dotnet test

# Con mayor detalle
dotnet test --verbosity normal

# Solo pruebas del dominio
dotnet test --filter ProviderTests
```

## 📊 Modelo de Datos

### Entidades Principales

- **Providers**: Proveedores con NIT, nombre, email y campos personalizados
- **Services**: Servicios con nombre y tarifa por hora en USD
- **ProviderServices**: Relación muchos-a-muchos entre proveedores y servicios
- **ServiceCountries**: Países donde se ofrece cada servicio
- **CustomFields**: Campos personalizados dinámicos para proveedores

Ver diagrama completo en: `database/DATABASE_DIAGRAM.md`

## 🔗 Endpoints Principales

### Autenticación
- `POST /api/Auth/login` - Iniciar sesión

### Proveedores
- `GET /api/Providers` - Listar proveedores (paginación y búsqueda)
- `GET /api/Providers/{id}` - Obtener proveedor por ID
- `POST /api/Providers` - Crear proveedor
- `PUT /api/Providers/{id}` - Actualizar proveedor
- `DELETE /api/Providers/{id}` - Eliminar proveedor
- `POST /api/Providers/{id}/custom-fields` - Agregar campo personalizado
- `POST /api/Providers/{providerId}/services/{serviceId}` - Asignar servicio con países

### Servicios
- `GET /api/Services` - Listar servicios
- `GET /api/Services/{id}` - Obtener servicio por ID
- `POST /api/Services` - Crear servicio
- `PUT /api/Services/{id}` - Actualizar servicio
- `DELETE /api/Services/{id}` - Eliminar servicio

### Países
- `GET /api/Countries` - Listar países (API externa)
- `GET /api/Countries/{code}` - Obtener país por código

### Dashboard
- `GET /api/Dashboard` - Obtener indicadores (proveedores y servicios por país)

## 🛠️ Principios Aplicados

### SOLID
- ✅ **Single Responsibility (S)**: Cada clase tiene una única responsabilidad bien definida
    - `ProviderService` maneja solo la lógica de proveedores
    - `CountryService` solo gestiona países
    - Repositorios enfocados en acceso a datos específico

### DDD (Domain-Driven Design)
- **Agregados**: Provider como raíz de agregado
- **Objetos de Valor**: Uso de tipos inmutables donde aplica
- **Patrón Repository**: Abstracción del acceso a datos
- **Servicios de Dominio**: Lógica de negocio en servicios de aplicación

### Clean Architecture
- Separación clara de capas
- Dependencias apuntando hacia el dominio
- Independencia del framework en el dominio

## 🚧 Limitaciones Conocidas y Mejoras Futuras

### No Implementado (Mejoras Futuras)
- ❌ **Editar Custom Fields** - Endpoint `PUT /api/Providers/{id}/custom-fields/{fieldId}`
- ❌ **Eliminar Custom Fields** - Endpoint `DELETE /api/Providers/{id}/custom-fields/{fieldId}`
- ❌ **Editar Servicios Asignados** - Modificar países de un servicio ya asignado
- ❌ **Eliminar Servicios Asignados** - Endpoint `DELETE /api/Providers/{providerId}/services/{serviceId}`
- ❌ **Paginación en Frontend** - Botones Previous/Next para navegar entre páginas
- ❌ **Deployment** - Configuración para Azure/AWS
- ❌ **Más principios SOLID** - Implementar O, L, I, D de forma más explícita
- ❌ **Caché** - Para mejorar rendimiento en consultas frecuentes
- ❌ **Logging avanzado** - Integración con Serilog o Application Insights

### Decisiones de Diseño
- El **NIT no es editable** por ser un identificador tributario único
- Los **Custom Fields se agregan pero no se editan/eliminan** (MVP)
- **Paginación básica** en backend, sin implementar en UI
- **Un solo rol de usuario** (Admin) por simplicidad

## 📝 Notas Técnicas

- Scripts SQL usan comandos `GO` para ejecución por lotes (estándar SQL Server)
- API externa de países: [REST Countries](https://restcountries.com/)
- Todos los IDs son GUIDs para mejor distribución
- Fechas almacenadas en UTC
- Frontend desarrollado después del backend funcional
- Notificaciones visuales para mejorar UX

## 👤 Autor

**Brahiam Riwi**

- GitHub: [@Brahiamriwi](https://github.com/Brahiamriwi)
- Revisor: jaime.marin@tekus.co

## 📄 Licencia

Este proyecto fue desarrollado como prueba técnica para Tekus S.A.S.

---

## 🎯 Guía Rápida de Evaluación

Para evaluar el proyecto rápidamente:

1. ✅ Ejecutar scripts SQL (01 y 02)
2. ✅ Correr backend: `dotnet run`
3. ✅ Probar endpoints en Swagger: `http://localhost:5130/swagger`
4. ✅ Correr frontend: `npm install && npm run dev`
5. ✅ Login con `admin / Tekus2024!`
6. ✅ Crear un proveedor y asignarle servicios
7. ✅ Ver tests: `dotnet test`
8. ✅ Revisar código siguiendo arquitectura DDD

**Tiempo estimado de evaluación: 20-30 minutos**