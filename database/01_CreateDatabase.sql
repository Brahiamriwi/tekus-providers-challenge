-- =============================================
-- Script: Creación de base de datos y tablas
-- Database: TekusProvidersDb
-- Author: Brahiam
-- Date: 2025-11-01
-- =============================================

-- Crear base de datos si no existe
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'TekusProvidersDb')
BEGIN
    CREATE DATABASE TekusProvidersDb;
END
GO

USE TekusProvidersDb;
GO

-- =============================================
-- Tabla: Providers (Proveedores)
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Providers')
BEGIN
CREATE TABLE Providers (
                           Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
                           Nit NVARCHAR(50) NOT NULL UNIQUE,
                           Name NVARCHAR(200) NOT NULL,
                           Email NVARCHAR(100) NOT NULL,
                           CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
                           UpdatedAt DATETIME2 NULL,

                           CONSTRAINT CK_Provider_Email CHECK (Email LIKE '%@%')
);

CREATE INDEX IX_Providers_Nit ON Providers(Nit);
CREATE INDEX IX_Providers_Name ON Providers(Name);
END
GO

-- =============================================
-- Tabla: Services (Servicios)
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Services')
BEGIN
CREATE TABLE Services (
                          Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
                          Name NVARCHAR(200) NOT NULL,
                          HourlyRateUsd DECIMAL(18,2) NOT NULL,
                          CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
                          UpdatedAt DATETIME2 NULL,

                          CONSTRAINT CK_Service_HourlyRate CHECK (HourlyRateUsd >= 0)
);

CREATE INDEX IX_Services_Name ON Services(Name);
END
GO

-- =============================================
-- Tabla: ProviderServices (Relación Proveedores-Servicios)
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'ProviderServices')
BEGIN
CREATE TABLE ProviderServices (
                                  ProviderId UNIQUEIDENTIFIER NOT NULL,
                                  ServiceId UNIQUEIDENTIFIER NOT NULL,
                                  AssignedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),

                                  CONSTRAINT PK_ProviderServices PRIMARY KEY (ProviderId, ServiceId),
                                  CONSTRAINT FK_ProviderServices_Provider FOREIGN KEY (ProviderId)
                                      REFERENCES Providers(Id) ON DELETE CASCADE,
                                  CONSTRAINT FK_ProviderServices_Service FOREIGN KEY (ServiceId)
                                      REFERENCES Services(Id) ON DELETE CASCADE
);
END
GO

-- =============================================
-- Tabla: ServiceCountries (Países donde se ofrece el servicio)
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'ServiceCountries')
BEGIN
CREATE TABLE ServiceCountries (
                                  Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
                                  ProviderId UNIQUEIDENTIFIER NOT NULL,
                                  ServiceId UNIQUEIDENTIFIER NOT NULL,
                                  CountryCode NVARCHAR(10) NOT NULL,
                                  CountryName NVARCHAR(100) NOT NULL,
                                  AssignedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),

                                  CONSTRAINT FK_ServiceCountries_ProviderService FOREIGN KEY (ProviderId, ServiceId)
                                      REFERENCES ProviderServices(ProviderId, ServiceId) ON DELETE CASCADE
);

CREATE INDEX IX_ServiceCountries_Country ON ServiceCountries(CountryCode);
END
GO

-- =============================================
-- Tabla: CustomFields (Campos personalizados de proveedores)
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'CustomFields')
BEGIN
CREATE TABLE CustomFields (
                              Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
                              ProviderId UNIQUEIDENTIFIER NOT NULL,
                              FieldName NVARCHAR(100) NOT NULL,
                              FieldValue NVARCHAR(500) NOT NULL,
                              CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),

                              CONSTRAINT FK_CustomFields_Provider FOREIGN KEY (ProviderId)
                                  REFERENCES Providers(Id) ON DELETE CASCADE
);

CREATE INDEX IX_CustomFields_Provider ON CustomFields(ProviderId);
END
GO

PRINT 'Database and tables created successfully!';
GO