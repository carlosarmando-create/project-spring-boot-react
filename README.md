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

- Java 25
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

Para desarrollo con tu archivo `.env.dev`:

```bash
docker compose --env-file .env.dev up --build
```

Para producción usando la composición de producción y `.env.prod`:

```bash
docker compose -f docker-compose.prod.yml --env-file .env.prod up --build -d
```

Nota: `NEXT_PUBLIC_API_ASSET_URL` siempre debe apuntar a una URL pública accesible desde el navegador, por ejemplo `http://localhost:8080` en local o `https://tu-api.com` en producción. No uses `http://backend:8080` en variables `NEXT_PUBLIC_*` porque ese hostname solo existe dentro de Docker.

Servicios:

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:8080`
- PostgreSQL: `localhost:5432`
