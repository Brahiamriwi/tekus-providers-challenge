-- =============================================
-- Script: Población de datos de prueba
-- Database: TekusProvidersDb
-- Author: Brahiam
-- Date: 2025-11-01
-- Descripción: Inserta 10+ registros por tabla
-- =============================================

USE TekusProvidersDb;
GO

-- Limpiar datos existentes (solo para desarrollo)
DELETE FROM CustomFields;
DELETE FROM ServiceCountries;
DELETE FROM ProviderServices;
DELETE FROM Services;
DELETE FROM Providers;
GO

-- =============================================
-- Insertar Proveedores (15 registros)
-- =============================================
DECLARE @Provider1 UNIQUEIDENTIFIER = NEWID();
DECLARE @Provider2 UNIQUEIDENTIFIER = NEWID();
DECLARE @Provider3 UNIQUEIDENTIFIER = NEWID();
DECLARE @Provider4 UNIQUEIDENTIFIER = NEWID();
DECLARE @Provider5 UNIQUEIDENTIFIER = NEWID();
DECLARE @Provider6 UNIQUEIDENTIFIER = NEWID();
DECLARE @Provider7 UNIQUEIDENTIFIER = NEWID();
DECLARE @Provider8 UNIQUEIDENTIFIER = NEWID();
DECLARE @Provider9 UNIQUEIDENTIFIER = NEWID();
DECLARE @Provider10 UNIQUEIDENTIFIER = NEWID();
DECLARE @Provider11 UNIQUEIDENTIFIER = NEWID();
DECLARE @Provider12 UNIQUEIDENTIFIER = NEWID();
DECLARE @Provider13 UNIQUEIDENTIFIER = NEWID();
DECLARE @Provider14 UNIQUEIDENTIFIER = NEWID();
DECLARE @Provider15 UNIQUEIDENTIFIER = NEWID();

INSERT INTO Providers (Id, Nit, Name, Email, CreatedAt) VALUES
                                                            (@Provider1, '900123456-1', 'Importaciones Tekus S.A.S.', 'contacto@importacionestekus.com', GETUTCDATE()),
                                                            (@Provider2, '800234567-2', 'Tech Solutions Colombia', 'info@techsolutions.co', GETUTCDATE()),
                                                            (@Provider3, '700345678-3', 'Cloud Services International', 'sales@cloudservices.com', GETUTCDATE()),
                                                            (@Provider4, '600456789-4', 'Data Analytics Pro', 'contact@dataanalytics.com', GETUTCDATE()),
                                                            (@Provider5, '500567890-5', 'Cyber Security Experts', 'info@cybersecurity.net', GETUTCDATE()),
                                                            (@Provider6, '400678901-6', 'AI Development Corp', 'hello@aidevelopment.io', GETUTCDATE()),
                                                            (@Provider7, '300789012-7', 'Mobile App Creators', 'team@mobileapps.com', GETUTCDATE()),
                                                            (@Provider8, '200890123-8', 'Web Design Studio', 'contact@webdesign.co', GETUTCDATE()),
                                                            (@Provider9, '100901234-9', 'DevOps Automation Ltd', 'info@devopsauto.com', GETUTCDATE()),
                                                            (@Provider10, '900012345-0', 'Blockchain Technologies', 'support@blockchain.tech', GETUTCDATE()),
                                                            (@Provider11, '800123456-1', 'IoT Solutions Provider', 'sales@iotsolutions.com', GETUTCDATE()),
                                                            (@Provider12, '700234567-2', 'Machine Learning Lab', 'contact@mllab.ai', GETUTCDATE()),
                                                            (@Provider13, '600345678-3', 'Database Management Systems', 'info@dbsystems.com', GETUTCDATE()),
                                                            (@Provider14, '500456789-4', 'Network Infrastructure Co', 'hello@netinfra.net', GETUTCDATE()),
                                                            (@Provider15, '400567890-5', 'Software Testing Services', 'team@testingservices.com', GETUTCDATE());

PRINT '15 Providers inserted successfully';
GO

-- =============================================
-- Insertar Servicios (12 registros)
-- =============================================
DECLARE @Service1 UNIQUEIDENTIFIER = NEWID();
DECLARE @Service2 UNIQUEIDENTIFIER = NEWID();
DECLARE @Service3 UNIQUEIDENTIFIER = NEWID();
DECLARE @Service4 UNIQUEIDENTIFIER = NEWID();
DECLARE @Service5 UNIQUEIDENTIFIER = NEWID();
DECLARE @Service6 UNIQUEIDENTIFIER = NEWID();
DECLARE @Service7 UNIQUEIDENTIFIER = NEWID();
DECLARE @Service8 UNIQUEIDENTIFIER = NEWID();
DECLARE @Service9 UNIQUEIDENTIFIER = NEWID();
DECLARE @Service10 UNIQUEIDENTIFIER = NEWID();
DECLARE @Service11 UNIQUEIDENTIFIER = NEWID();
DECLARE @Service12 UNIQUEIDENTIFIER = NEWID();

INSERT INTO Services (Id, Name, HourlyRateUsd, CreatedAt) VALUES
                                                              (@Service1, 'Descarga espacial de contenidos', 150.00, GETUTCDATE()),
                                                              (@Service2, 'Desaparición forzada de bytes', 200.00, GETUTCDATE()),
                                                              (@Service3, 'Cloud Infrastructure Management', 180.00, GETUTCDATE()),
                                                              (@Service4, 'Data Analytics Consulting', 250.00, GETUTCDATE()),
                                                              (@Service5, 'Cybersecurity Audit', 300.00, GETUTCDATE()),
                                                              (@Service6, 'AI Model Development', 350.00, GETUTCDATE()),
                                                              (@Service7, 'Mobile App Development', 175.00, GETUTCDATE()),
                                                              (@Service8, 'Web Design and Development', 120.00, GETUTCDATE()),
                                                              (@Service9, 'DevOps Implementation', 220.00, GETUTCDATE()),
                                                              (@Service10, 'Blockchain Consulting', 400.00, GETUTCDATE()),
                                                              (@Service11, 'IoT Solution Design', 190.00, GETUTCDATE()),
                                                              (@Service12, 'Software Quality Assurance', 140.00, GETUTCDATE());

PRINT '12 Services inserted successfully';
GO

-- =============================================
-- Asignar Servicios a Proveedores (20+ registros)
-- =============================================
DECLARE @Provider1 UNIQUEIDENTIFIER = (SELECT Id FROM Providers WHERE Nit = '900123456-1');
DECLARE @Provider2 UNIQUEIDENTIFIER = (SELECT Id FROM Providers WHERE Nit = '800234567-2');
DECLARE @Provider3 UNIQUEIDENTIFIER = (SELECT Id FROM Providers WHERE Nit = '700345678-3');
DECLARE @Provider4 UNIQUEIDENTIFIER = (SELECT Id FROM Providers WHERE Nit = '600456789-4');
DECLARE @Provider5 UNIQUEIDENTIFIER = (SELECT Id FROM Providers WHERE Nit = '500567890-5');
DECLARE @Provider6 UNIQUEIDENTIFIER = (SELECT Id FROM Providers WHERE Nit = '400678901-6');

DECLARE @Service1 UNIQUEIDENTIFIER = (SELECT Id FROM Services WHERE Name = 'Descarga espacial de contenidos');
DECLARE @Service2 UNIQUEIDENTIFIER = (SELECT Id FROM Services WHERE Name = 'Desaparición forzada de bytes');
DECLARE @Service3 UNIQUEIDENTIFIER = (SELECT Id FROM Services WHERE Name = 'Cloud Infrastructure Management');
DECLARE @Service4 UNIQUEIDENTIFIER = (SELECT Id FROM Services WHERE Name = 'Data Analytics Consulting');
DECLARE @Service5 UNIQUEIDENTIFIER = (SELECT Id FROM Services WHERE Name = 'Cybersecurity Audit');
DECLARE @Service6 UNIQUEIDENTIFIER = (SELECT Id FROM Services WHERE Name = 'AI Model Development');

INSERT INTO ProviderServices (ProviderId, ServiceId, AssignedAt) VALUES
                                                                     (@Provider1, @Service1, GETUTCDATE()),
                                                                     (@Provider1, @Service2, GETUTCDATE()),
                                                                     (@Provider2, @Service3, GETUTCDATE()),
                                                                     (@Provider2, @Service4, GETUTCDATE()),
                                                                     (@Provider3, @Service3, GETUTCDATE()),
                                                                     (@Provider3, @Service5, GETUTCDATE()),
                                                                     (@Provider4, @Service4, GETUTCDATE()),
                                                                     (@Provider4, @Service6, GETUTCDATE()),
                                                                     (@Provider5, @Service5, GETUTCDATE()),
                                                                     (@Provider5, @Service1, GETUTCDATE()),
                                                                     (@Provider6, @Service6, GETUTCDATE()),
                                                                     (@Provider6, @Service2, GETUTCDATE());

PRINT 'Provider-Service relationships inserted successfully';
GO

-- =============================================
-- Asignar Países a Servicios (30+ registros)
-- =============================================
DECLARE @Provider1 UNIQUEIDENTIFIER = (SELECT Id FROM Providers WHERE Nit = '900123456-1');
DECLARE @Service1 UNIQUEIDENTIFIER = (SELECT Id FROM Services WHERE Name = 'Descarga espacial de contenidos');
DECLARE @Service2 UNIQUEIDENTIFIER = (SELECT Id FROM Services WHERE Name = 'Desaparición forzada de bytes');

INSERT INTO ServiceCountries (ProviderId, ServiceId, CountryCode, CountryName, AssignedAt) VALUES
-- Provider1 - Service1 en 3 países
(@Provider1, @Service1, 'CO', 'Colombia', GETUTCDATE()),
(@Provider1, @Service1, 'PE', 'Peru', GETUTCDATE()),
(@Provider1, @Service1, 'MX', 'Mexico', GETUTCDATE()),
-- Provider1 - Service2 en 2 países
(@Provider1, @Service2, 'CO', 'Colombia', GETUTCDATE()),
(@Provider1, @Service2, 'BR', 'Brazil', GETUTCDATE());

-- Más países para otros providers
DECLARE @Provider2 UNIQUEIDENTIFIER = (SELECT Id FROM Providers WHERE Nit = '800234567-2');
DECLARE @Service3 UNIQUEIDENTIFIER = (SELECT Id FROM Services WHERE Name = 'Cloud Infrastructure Management');

INSERT INTO ServiceCountries (ProviderId, ServiceId, CountryCode, CountryName, AssignedAt) VALUES
                                                                                               (@Provider2, @Service3, 'US', 'United States', GETUTCDATE()),
                                                                                               (@Provider2, @Service3, 'CA', 'Canada', GETUTCDATE()),
                                                                                               (@Provider2, @Service3, 'MX', 'Mexico', GETUTCDATE()),
                                                                                               (@Provider2, @Service3, 'AR', 'Argentina', GETUTCDATE()),
                                                                                               (@Provider2, @Service3, 'CL', 'Chile', GETUTCDATE());

PRINT 'Service countries inserted successfully';
GO

-- =============================================
-- Insertar Campos Personalizados (15+ registros)
-- =============================================
DECLARE @Provider1 UNIQUEIDENTIFIER = (SELECT Id FROM Providers WHERE Nit = '900123456-1');
DECLARE @Provider2 UNIQUEIDENTIFIER = (SELECT Id FROM Providers WHERE Nit = '800234567-2');
DECLARE @Provider3 UNIQUEIDENTIFIER = (SELECT Id FROM Providers WHERE Nit = '700345678-3');

INSERT INTO CustomFields (ProviderId, FieldName, FieldValue, CreatedAt) VALUES
                                                                            (@Provider1, 'Número de contacto en marte', '+1-555-MARS-001', GETUTCDATE()),
                                                                            (@Provider1, 'Cantidad de mascotas en la nómina', '42', GETUTCDATE()),
                                                                            (@Provider1, 'Color favorito del CEO', 'Azul espacial', GETUTCDATE()),
                                                                            (@Provider2, 'Años de experiencia', '15', GETUTCDATE()),
                                                                            (@Provider2, 'Certificaciones ISO', 'ISO 9001, ISO 27001', GETUTCDATE()),
                                                                            (@Provider2, 'Número de empleados', '250', GETUTCDATE()),
                                                                            (@Provider3, 'Oficina principal', 'Bogotá, Colombia', GETUTCDATE()),
                                                                            (@Provider3, 'Horario de atención', '8:00 AM - 6:00 PM', GETUTCDATE()),
                                                                            (@Provider3, 'Días de soporte', 'Lunes a Viernes', GETUTCDATE()),
                                                                            (@Provider3, 'Nivel de soporte', 'Premium 24/7', GETUTCDATE());

PRINT 'Custom fields inserted successfully';
GO

-- =============================================
-- Verificar datos insertados
-- =============================================
PRINT '=== DATA SUMMARY ===';
PRINT 'Providers: ' + CAST((SELECT COUNT(*) FROM Providers) AS NVARCHAR(10));
PRINT 'Services: ' + CAST((SELECT COUNT(*) FROM Services) AS NVARCHAR(10));
PRINT 'Provider-Service Relations: ' + CAST((SELECT COUNT(*) FROM ProviderServices) AS NVARCHAR(10));
PRINT 'Service Countries: ' + CAST((SELECT COUNT(*) FROM ServiceCountries) AS NVARCHAR(10));
PRINT 'Custom Fields: ' + CAST((SELECT COUNT(*) FROM CustomFields) AS NVARCHAR(10));
GO