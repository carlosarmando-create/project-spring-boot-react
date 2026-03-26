# Project Spring Boot + React

Proyecto full stack para una tienda online de plantas con dos carpetas principales:

- `backend`: API REST en Spring Boot + PostgreSQL + JWT + carga local de imágenes
- `frontend`: interfaz en Next.js + Tailwind CSS con landing pública, catálogo, contacto y dashboards

## Documentación principal

- Backend funcional y diagramas: `backend/README.md`
- Diseño del sistema: `backend/docs/system-design.md`
- Base de datos relacional: `backend/docs/database-schema.sql`
- Frontend y arranque: `frontend/README.md`

## Requisitos recomendados

- Java 21
- Maven 3.9+
- PostgreSQL 15+
- Node.js 20.9+
- npm 10+

## Orden de arranque

1. Levantar PostgreSQL y crear `plant_store_db`
2. Ejecutar el backend en `http://localhost:8080`
3. Ejecutar el frontend en `http://localhost:3000`

## Docker

También puedes levantar todo con Docker:

```bash
docker compose up --build
```

Servicios:

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:8080`
- PostgreSQL: `localhost:5432`
