# Backend Plant Store

API REST para una tienda online de plantas con Spring Boot 4, PostgreSQL, JWT y subida local de imágenes.

## Requisitos

- Java 25
- Maven 3.9+
- PostgreSQL 15+

## Configuración rápida

1. Crear la base de datos:

```sql
CREATE DATABASE plant_store_db;
```

2. Ajustar credenciales en `src/main/resources/application.yml`.

3. Cambiar `app.jwt.secret` por una clave Base64 propia.

4. Ejecutar:

```bash
./mvnw spring-boot:run
```

En Windows PowerShell:

```powershell
.\mvnw.cmd spring-boot:run
```

## Usuario semilla

- Email: `admin@plantstore.com`
- Password: `Admin123*`

## Documentación

- Modelo relacional: `docs/database-schema.sql`
- Diagramas y permisos: `docs/system-design.md`
