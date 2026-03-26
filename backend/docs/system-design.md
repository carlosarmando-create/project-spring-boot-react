# Sistema de ventas de plantas online

## Roles y permisos

| Rol | Permisos principales |
| --- | --- |
| `ROLE_CUSTOMER` | Registrarse, iniciar sesión, ver catálogo, enviar mensajes de contacto, crear pedidos, ver sus pedidos y consultar perfil |
| `ROLE_ADMIN` | Todo lo anterior más CRUD de categorías, productos, imágenes, pedidos, usuarios y revisión de contactos |

Un usuario puede ser cliente y administrador al mismo tiempo, por eso `users` y `roles` usan una relación muchos a muchos.

## Diagrama de casos de uso

```mermaid
flowchart LR
    Cliente["Cliente"] --> UC1["Explorar catálogo"]
    Cliente --> UC2["Registrarse / iniciar sesión"]
    Cliente --> UC3["Crear pedido"]
    Cliente --> UC4["Consultar mis pedidos"]
    Cliente --> UC5["Enviar mensaje de contacto"]

    Admin["Administrador"] --> UC6["Gestionar categorías"]
    Admin --> UC7["Gestionar productos"]
    Admin --> UC8["Gestionar pedidos"]
    Admin --> UC9["Gestionar usuarios y roles"]
    Admin --> UC10["Revisar contactos"]

    UsuarioMixto["Usuario con ambos roles"] --> Cliente
    UsuarioMixto --> Admin
```

## Diagrama entidad relación

```mermaid
erDiagram
    USERS ||--o{ ADDRESSES : has
    USERS ||--o{ ORDERS : places
    USERS }o--o{ ROLES : assigned
    CATEGORIES ||--o{ PLANTS : groups
    PLANTS ||--o{ PLANT_IMAGES : contains
    PLANTS ||--o{ ORDER_ITEMS : sold_as
    ORDERS ||--o{ ORDER_ITEMS : contains

    USERS {
        bigint id PK
        string full_name
        string email
        string password
        string phone
        boolean enabled
    }

    ROLES {
        bigint id PK
        string name
        string description
    }

    ADDRESSES {
        bigint id PK
        bigint user_id FK
        string label
        string recipient_name
        string phone
        string line1
        string city
        string state
        string country
        boolean primary_address
    }

    CATEGORIES {
        bigint id PK
        string name
        string slug
        boolean active
    }

    PLANTS {
        bigint id PK
        bigint category_id FK
        string name
        string slug
        decimal price
        int stock
        boolean featured
        boolean active
    }

    PLANT_IMAGES {
        bigint id PK
        bigint plant_id FK
        string file_name
        string file_url
        boolean primary_image
    }

    ORDERS {
        bigint id PK
        bigint user_id FK
        string status
        decimal total_amount
        string payment_method
    }

    ORDER_ITEMS {
        bigint id PK
        bigint order_id FK
        bigint plant_id FK
        int quantity
        decimal unit_price
        decimal subtotal
    }

    CONTACT_MESSAGES {
        bigint id PK
        string full_name
        string email
        string subject
        string status
    }
```

## Endpoints REST principales

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/users/me`
- `GET /api/users`
- `PUT /api/users/{id}/roles`
- `GET /api/categories`
- `POST /api/categories`
- `PUT /api/categories/{id}`
- `DELETE /api/categories/{id}`
- `GET /api/plants`
- `GET /api/plants/admin`
- `GET /api/plants/{id}`
- `POST /api/plants` con `multipart/form-data`
- `PUT /api/plants/{id}` con `multipart/form-data`
- `DELETE /api/plants/{id}`
- `POST /api/orders`
- `GET /api/orders/me`
- `GET /api/orders`
- `PATCH /api/orders/{id}/status`
- `POST /api/contacts`
- `GET /api/contacts`
- `PATCH /api/contacts/{id}/status`
