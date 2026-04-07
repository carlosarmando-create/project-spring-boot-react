# Documentación técnica del proyecto `project-spring-boot-react`

## 1. Descripción general

Este repositorio contiene un proyecto full stack para una tienda virtual de plantas llamada **Verdelia**. La solución está dividida en dos aplicaciones principales:

- **Backend**: API REST desarrollada con Spring Boot, PostgreSQL, Spring Security y JWT.
- **Frontend**: interfaz web desarrollada con Next.js, React, TypeScript y Tailwind CSS.

El propósito del sistema es permitir:

- mostrar un catálogo público de plantas y accesorios,
- administrar autenticación y autorización por roles,
- registrar y consultar pedidos,
- enviar mensajes de contacto,
- ofrecer un panel de administración para gestionar productos, categorías, pedidos, mensajes y usuarios.

## 2. Arquitectura general del proyecto

La arquitectura es de tipo cliente-servidor:

1. El **frontend** consume la API REST del backend.
2. El **backend** centraliza la lógica de negocio, seguridad, acceso a datos y manejo de archivos.
3. **PostgreSQL** almacena la información persistente del sistema.
4. Las imágenes de productos se sirven desde rutas estáticas del backend o desde archivos semilla incluidos en `resources/static/seed`.

### Flujo funcional resumido

- El usuario navega por páginas públicas como inicio, catálogo y contacto.
- Si inicia sesión, el frontend guarda una sesión en `localStorage`.
- El backend emite un **token JWT** al autenticarse.
- El frontend envía ese token en el encabezado `Authorization: Bearer ...`.
- Según el rol del usuario, el sistema redirige al panel de cliente o al panel administrativo.

## 3. Estructura raíz del repositorio

La raíz del proyecto agrupa la orquestación general, la documentación principal y la separación entre frontend y backend.

```text
project-spring-boot-react/
├── .vscode/
├── backend/
├── frontend/
├── .env.dev
├── .env.prod
├── .gitignore
├── comandos.txt
├── diagrama-clases.drawio
├── docker-compose.yml
├── docker-compose.prod.yml
├── README.md
└── DOCUMENTACION_TECNICA_PROYECTO.md
```

### Archivos y carpetas de la raíz

#### `.vscode/`

Contiene configuración del editor Visual Studio Code.

- `settings.json`: ajusta opciones para Java, como análisis de nullability y actualización de configuración de build.

#### `backend/`

Contiene toda la aplicación del servidor, incluyendo código Java, configuración Spring, documentación técnica, wrappers de Maven y Dockerfiles.

#### `frontend/`

Contiene la aplicación web en Next.js, con rutas, componentes, estilos, assets públicos y configuración del build.

#### `.env.dev`

Archivo de variables de entorno para desarrollo con Docker Compose. Define:

- base de datos,
- credenciales de PostgreSQL,
- configuración del backend,
- URLs públicas e internas consumidas por el frontend.

Es importante porque diferencia entre:

- la URL que verá el navegador, por ejemplo `http://localhost:8080`,
- y la URL interna dentro de Docker, por ejemplo `http://backend:8080`.

#### `.env.prod`

Archivo equivalente orientado al entorno de producción. Mantiene separadas las variables necesarias para levantar la solución con la composición productiva.

#### `.gitignore`

Define qué archivos o carpetas no deben versionarse. Normalmente excluye salidas de compilación, dependencias, archivos locales y temporales.

#### `comandos.txt`

Archivo auxiliar con comandos rápidos para levantar el proyecto:

- desarrollo con `docker compose --env-file .env.dev up --build`
- producción con `docker compose -f docker-compose.prod.yml --env-file .env.prod up --build -d`

Sirve como recordatorio operativo.

#### `diagrama-clases.drawio`

Archivo del diagrama de clases elaborado en Draw.io. Es un apoyo visual para explicar entidades, relaciones y diseño orientado a objetos del sistema.

#### `docker-compose.yml`

Orquesta el entorno de desarrollo con tres servicios:

- `postgres`
- `backend`
- `frontend`

Puntos importantes:

- PostgreSQL se publica en el puerto `5433` del host.
- El backend se publica en `8080`.
- El frontend se publica en `3000`.
- El backend usa `Dockerfile.dev`.
- El frontend recibe variables `NEXT_PUBLIC_*` y variables internas de red Docker.

#### `docker-compose.prod.yml`

Versión orientada a producción.

Cambios principales respecto al compose de desarrollo:

- PostgreSQL se publica en `5432`.
- El backend usa `Dockerfile` final.
- Los volúmenes están separados como `*_prod`.
- Los contenedores se nombran con sufijo `-prod`.

#### `README.md`

Es el punto de entrada documental del repositorio. Resume:

- tecnologías,
- requisitos,
- orden de arranque,
- comandos Docker,
- puertos usados,
- relación entre frontend y backend.

## 4. Documentación del backend

## 4.1 Rol del backend

El backend implementa la API REST del sistema. Su responsabilidad es:

- autenticar usuarios,
- autorizar operaciones por rol,
- validar entradas,
- ejecutar la lógica de negocio,
- persistir información en PostgreSQL,
- administrar productos, categorías, pedidos, mensajes y usuarios,
- servir imágenes subidas localmente.

## 4.2 Estructura general del backend

```text
backend/
├── .mvn/
├── .vscode/
├── docs/
├── src/
├── target/
├── .dockerignore
├── .gitignore
├── Dockerfile
├── Dockerfile.dev
├── mvnw
├── mvnw.cmd
├── pom.xml
└── README.md
```

### Archivos y carpetas principales del backend

#### `.mvn/`

Carpeta usada por el Maven Wrapper. Permite ejecutar Maven sin instalación global manual.

#### `.vscode/`

Configuración local del editor para soporte Java.

#### `docs/`

Documentación técnica del backend.

- `system-design.md`: explica roles, permisos, casos de uso, entidad-relación y endpoints.
- `database-schema.sql`: contiene el esquema SQL de referencia para la base de datos.

#### `src/`

Código fuente principal de la aplicación.

#### `target/`

Salida generada por Maven al compilar. No forma parte del código fuente manual; contiene clases compiladas y artefactos temporales.

#### `.dockerignore`

Evita copiar archivos innecesarios al contexto Docker.

#### `.gitignore`

Evita versionar builds, archivos temporales y otros artefactos del backend.

#### `Dockerfile`

Construcción del backend para un entorno más cercano a producción.

#### `Dockerfile.dev`

Construcción orientada a desarrollo, usada por `docker-compose.yml`.

#### `mvnw` y `mvnw.cmd`

Wrappers de Maven para Linux/macOS y Windows, respectivamente.

#### `pom.xml`

Archivo central de Maven. Define:

- proyecto `com.plantstore:backend`,
- Spring Boot `4.0.3`,
- Java `25`,
- dependencias de web, validación, JPA, seguridad, PostgreSQL, JWT, Lombok y testing.

#### `README.md`

Explica la configuración rápida del backend, usuario semilla y referencias a documentación adicional.

## 4.3 Estructura interna de `src/main/java`

Ruta base del paquete:

```text
backend/src/main/java/com/plantstore/backend/
├── config/
├── controller/
├── dto/
├── entity/
├── enums/
├── exception/
├── repository/
├── security/
├── service/
└── PlantStoreApplication.java
```

### `PlantStoreApplication.java`

Es la clase principal que arranca Spring Boot. Su única función es iniciar el contexto de la aplicación.

## 4.4 Paquete `config`

Agrupa la configuración transversal del backend.

### `SecurityConfig.java`

Es la pieza clave de seguridad. Define:

- desactivación de CSRF para API stateless,
- habilitación de CORS,
- política de sesión `STATELESS`,
- rutas públicas,
- rutas protegidas,
- proveedor de autenticación,
- encoder de contraseñas con BCrypt,
- filtro JWT antes del filtro estándar de usuario y contraseña.

También define el origen permitido desde `app.cors.allowed-origins`.

### `WebConfig.java`

Su función es complementar la configuración web general del backend. En este proyecto se usa como parte de la configuración transversal del servidor.

### `DataInitializer.java`

Carga datos semilla al iniciar la aplicación. Es importante porque prepara el sistema con contenido inicial:

- roles `ROLE_ADMIN` y `ROLE_CUSTOMER`,
- usuario administrador,
- usuario cliente,
- categorías,
- plantas de ejemplo,
- una orden ficticia para la demo.

Esto facilita pruebas, exposición y demostración del sistema.

## 4.5 Paquete `controller`

Contiene los controladores REST. Cada clase expone endpoints HTTP y delega la lógica al servicio correspondiente.

### `AuthController.java`

Gestiona autenticación:

- `POST /api/auth/register`
- `POST /api/auth/login`

Retorna un `AuthResponse` con token JWT, datos del usuario y roles.

### `CategoryController.java`

Gestiona categorías:

- `GET /api/categories`
- `POST /api/categories`
- `PUT /api/categories/{id}`
- `DELETE /api/categories/{id}`

Las operaciones de escritura están protegidas para administradores.

### `PlantController.java`

Gestiona productos del catálogo:

- listado público,
- listado administrativo,
- búsqueda por `id`,
- búsqueda por `slug`,
- creación,
- actualización,
- eliminación.

Admite `multipart/form-data` para subir imágenes.

### `OrderController.java`

Gestiona pedidos:

- creación de pedidos para cliente o administrador,
- consulta de pedidos propios,
- consulta total para administrador,
- cambio de estado del pedido.

Obtiene el usuario autenticado a partir del `Authentication`.

### `ContactController.java`

Gestiona mensajes de contacto:

- creación pública de mensajes,
- consulta administrativa,
- actualización de estado del mensaje.

### `UserController.java`

Gestiona usuarios:

- `GET /api/users/me`
- `GET /api/users`
- `PUT /api/users/{id}/roles`

Permite que el administrador cambie los roles asignados.

### `GlobalExceptionHandler.java`

Centraliza el manejo de errores y devuelve respuestas uniformes para:

- recurso no encontrado,
- errores de negocio,
- credenciales inválidas,
- errores de validación,
- errores genéricos.

Esto mejora la consistencia entre backend y frontend.

## 4.6 Paquete `dto`

Los DTOs separan el modelo interno de la estructura de entrada y salida expuesta por la API.

### `dto/auth`

- `RegisterRequest.java`: datos de registro.
- `LoginRequest.java`: credenciales de acceso.
- `AuthResponse.java`: token y resumen del usuario autenticado.

### `dto/category`

- `CategoryRequest.java`: estructura de creación/edición.
- `CategoryResponse.java`: estructura de salida de una categoría.

### `dto/contact`

- `ContactRequest.java`: datos enviados por el formulario de contacto.
- `ContactResponse.java`: respuesta del mensaje registrado.
- `ContactStatusRequest.java`: cambio de estado del mensaje.

### `dto/order`

- `OrderRequest.java`: estructura para crear un pedido.
- `OrderResponse.java`: resumen completo del pedido.
- `OrderItemRequest.java`: ítems de entrada del pedido.
- `OrderItemResponse.java`: ítems de salida del pedido.
- `OrderStatusUpdateRequest.java`: actualización del estado del pedido.

### `dto/plant`

- `PlantRequest.java`: creación o edición de producto, incluyendo imagen y categoría.
- `PlantResponse.java`: respuesta que consume el frontend.

### `dto/user`

- `UserSummaryResponse.java`: resumen del usuario.
- `UserRolesUpdateRequest.java`: cambio de roles.

## 4.7 Paquete `entity`

Representa el modelo persistente del dominio.

### `BaseEntity.java`

Clase base para entidades. Normalmente centraliza campos comunes como identificador y timestamps.

### `User.java`

Representa al usuario del sistema:

- nombre,
- correo,
- contraseña,
- teléfono,
- estado habilitado,
- roles asociados.

### `Role.java`

Representa los roles del sistema. Se relaciona muchos a muchos con usuarios.

### `Address.java`

Representa direcciones de envío del usuario.

### `Category.java`

Agrupa productos del catálogo.

### `Plant.java`

Entidad principal del catálogo. Contiene:

- nombre,
- slug,
- descripciones,
- precio,
- stock,
- nombre botánico,
- tamaño,
- destacado,
- activo,
- categoría,
- imágenes.

### `PlantImage.java`

Representa imágenes asociadas a una planta. Permite identificar la imagen principal.

### `Order.java`

Representa un pedido:

- usuario,
- datos del cliente,
- dirección de envío,
- pago,
- notas,
- total,
- estado,
- detalle de ítems.

### `OrderItem.java`

Representa cada línea del pedido: producto, cantidad, precio unitario y subtotal.

### `ContactMessage.java`

Representa los mensajes del formulario de contacto.

## 4.8 Paquete `enums`

Contiene enumeraciones que estandarizan valores.

- `RoleName.java`: roles del sistema.
- `OrderStatus.java`: estados del pedido.
- `ContactStatus.java`: estados del mensaje de contacto.

## 4.9 Paquete `exception`

Define excepciones de negocio explícitas:

- `BadRequestException.java`
- `ResourceNotFoundException.java`

Se usan junto con `GlobalExceptionHandler`.

## 4.10 Paquete `repository`

Contiene interfaces JPA para acceso a datos:

- `UserRepository.java`
- `RoleRepository.java`
- `PlantRepository.java`
- `OrderRepository.java`
- `ContactMessageRepository.java`
- `CategoryRepository.java`
- `AddressRepository.java`

Estas interfaces abstraen consultas a la base de datos y son consumidas por los servicios.

## 4.11 Paquete `security`

Gestiona autenticación y autorización.

### `JwtService.java`

Genera y valida tokens JWT. Incluye:

- usuario como `subject`,
- roles como `claims`,
- expiración configurable,
- firma con clave Base64.

### `JwtAuthenticationFilter.java`

Intercepta solicitudes, lee el encabezado `Authorization`, valida el JWT y carga el usuario autenticado en el contexto de Spring Security.

### `CustomUserDetailsService.java`

Adapta el usuario persistido al modelo de seguridad que Spring necesita para autenticar.

## 4.12 Paquete `service`

Define contratos de negocio:

- `AuthService.java`
- `CategoryService.java`
- `ContactService.java`
- `FileStorageService.java`
- `OrderService.java`
- `PlantService.java`
- `UserService.java`

## 4.13 Paquete `service/impl`

Contiene la implementación real de cada servicio.

### `AuthServiceImpl.java`

Se encarga de:

- registrar usuarios,
- validar duplicidad de correo,
- asignar rol de cliente al registrarse,
- autenticar credenciales,
- generar el token JWT,
- devolver la sesión del usuario.

### `PlantServiceImpl.java`

Gestiona la lógica de productos:

- consulta pública y administrativa,
- lectura por `id` y `slug`,
- creación,
- actualización,
- eliminación,
- asociación de categoría,
- asociación de imagen principal.

### `CategoryServiceImpl.java`

Implementa el CRUD de categorías y sus validaciones.

### `OrderServiceImpl.java`

Implementa la creación y consulta de pedidos, además del cambio de estado.

### `UserServiceImpl.java`

Entrega el perfil del usuario autenticado, el listado global y la actualización de roles.

### `ContactServiceImpl.java`

Registra mensajes de contacto y permite su gestión por el administrador.

### `FileStorageServiceImpl.java`

Gestiona las imágenes subidas:

- crea el directorio `uploads/plants`,
- valida extensiones `jpg`, `jpeg`, `png`, `webp`,
- guarda archivos con nombre UUID,
- devuelve la URL pública `/uploads/plants/...`,
- elimina archivos antiguos cuando corresponde.

## 4.14 Recursos del backend

Ruta principal:

```text
backend/src/main/resources/
├── application.yml
└── static/
    └── seed/
        └── plants/
```

### `application.yml`

Configura:

- nombre de la aplicación,
- datasource de PostgreSQL,
- JPA y `ddl-auto`,
- multipart para imágenes,
- puerto del servidor,
- JWT,
- carpeta de subida,
- CORS.

### `static/seed/plants/`

Contiene imágenes semilla incluidas en el backend:

- `monstera-deliciosa.jpg`
- `ficus-lyrata.jpg`
- `epipremnum-aureum.jpg`
- `zamioculcas-zamiifolia.jpg`

Estas imágenes respaldan los productos iniciales cargados por `DataInitializer`.

## 4.15 Resumen funcional del backend

En conjunto, el backend está organizado por capas y sigue una estructura limpia:

- **controller**: entrada HTTP,
- **service**: reglas de negocio,
- **repository**: acceso a datos,
- **entity**: persistencia,
- **dto**: contrato externo,
- **security**: autenticación y autorización,
- **config**: comportamiento transversal.

## 5. Documentación del frontend

## 5.1 Rol del frontend

El frontend representa la experiencia de usuario de Verdelia. Está diseñado para:

- mostrar el catálogo público,
- presentar fichas de producto,
- permitir contacto,
- ofrecer inicio de sesión por tipo de acceso,
- redirigir al panel correcto según el rol,
- operar paneles de cliente y administrador.

## 5.2 Estructura general del frontend

```text
frontend/
├── .next/
├── app/
├── components/
├── lib/
├── node_modules/
├── public/
├── .dockerignore
├── .env
├── .env.example
├── .env.local
├── .gitignore
├── Dockerfile
├── global.d.ts
├── next-env.d.ts
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── README.md
├── tsconfig.json
└── yarn.lock
```

### Carpetas y archivos principales del frontend

#### `.next/`

Salida de compilación generada por Next.js. No es código fuente manual.

#### `app/`

Contiene el enrutamiento principal del frontend bajo App Router de Next.js.

#### `components/`

Agrupa componentes reutilizables de interfaz.

#### `lib/`

Agrupa utilidades de comunicación con la API, manejo de sesión y definición de tipos.

#### `node_modules/`

Dependencias instaladas del frontend.

#### `public/`

Assets públicos accesibles directamente por el navegador.

#### `.env`, `.env.example`, `.env.local`

Configuran las URLs del backend que consume el frontend. `.env.example` sirve como plantilla.

#### `Dockerfile`

Archivo para construir el frontend dentro de contenedores.

#### `global.d.ts` y `next-env.d.ts`

Archivos de soporte de TypeScript y Next.js.

#### `next.config.ts`

Configura Next.js. En este proyecto:

- usa salida `standalone`,
- habilita imágenes remotas según variables de entorno,
- evita optimización avanzada de imágenes con `unoptimized: true`.

#### `package.json`

Define scripts y dependencias. Tecnologías importantes:

- Next.js `16.0.0`
- React `19.2.0`
- Tailwind CSS `4`
- TypeScript `5`
- `lucide-react`
- `clsx`

#### `postcss.config.mjs`

Configura PostCSS para procesar estilos.

#### `README.md`

Explica la puesta en marcha del frontend y sus variables necesarias.

#### `tsconfig.json`

Configuración del compilador TypeScript.

#### `yarn.lock`

Bloquea versiones exactas de dependencias.

## 5.3 Carpeta `app`

La carpeta `app` define rutas y layouts.

```text
frontend/app/
├── catalogo/
│   └── [slug]/
├── contacto/
├── dashboard/
│   ├── admin/
│   └── cliente/
├── iniciar-sesion/
├── globals.css
├── layout.tsx
└── page.tsx
```

### `layout.tsx`

Es el layout global de la aplicación. Monta:

- `Navbar`
- contenido de la página
- `Footer`

Además define metadata general del sitio.

### `page.tsx`

Es la página principal del sitio. Renderiza la sección `Hero`.

### `globals.css`

Define el estilo global del proyecto:

- variables CSS de color,
- fondos degradados,
- estilo de tarjetas translúcidas tipo glassmorphism,
- contenedor `.shell`,
- utilidades visuales reutilizadas.

### `catalogo/page.tsx`

Página pública del catálogo. Consume `GET /plants` mediante `apiFetch` y renderiza `CatalogGrid`.

Tiene tolerancia a fallos:

- si la API no responde, devuelve una lista vacía en lugar de romper la vista.

### `catalogo/[slug]/page.tsx`

Página dinámica de detalle del producto.

Responsabilidades:

- obtener el `slug`,
- consultar `/plants/slug/{slug}`,
- mostrar imagen, información botánica, stock, precio y descripción,
- devolver `notFound()` si el producto no existe.

### `contacto/page.tsx`

Página del formulario de contacto. Envía datos a `POST /contacts`.

### `iniciar-sesion/page.tsx`

Pantalla de acceso con dos modos:

- cliente,
- administrador.

Su lógica:

- envía credenciales al backend,
- valida que el usuario tenga el rol esperado,
- guarda la sesión en `localStorage`,
- redirige a `/dashboard/admin` o `/dashboard/cliente`.

### `dashboard/page.tsx`

Página intermedia que detecta el rol y redirige automáticamente al panel correcto.

### `dashboard/admin/page.tsx`

Protege el acceso al panel administrativo desde el cliente. Verifica:

- existencia de sesión,
- presencia del rol `ROLE_ADMIN`.

Si falla, redirige a login o al panel de cliente.

### `dashboard/cliente/page.tsx`

Protege el acceso al panel del cliente. Verifica:

- existencia de sesión,
- presencia del rol `ROLE_CUSTOMER`.

## 5.4 Carpeta `components`

Contiene piezas visuales reutilizables.

### `navbar.tsx`

Barra superior del sitio. Cambia según la sesión:

- si no hay sesión, muestra el botón de iniciar sesión,
- si hay sesión, muestra el nombre del usuario, enlace al panel y botón de cerrar sesión.

### `footer.tsx`

Pie de página con información de marca y contacto.

### `catalog-grid.tsx`

Componente para listar plantas en formato de tarjetas:

- imagen,
- categoría,
- precio,
- nombre,
- nombre botánico,
- stock,
- tamaño,
- indicador de destacado,
- acceso a detalle.

### `sections/hero.tsx`

Sección principal de la portada. Presenta el concepto visual de la tienda y un bloque de colección destacada.

### `dashboard/admin-dashboard.tsx`

Es el componente más completo del frontend. Centraliza la vista administrativa.

Funciones principales:

- cargar productos, categorías, pedidos, contactos y usuarios,
- crear productos con imagen vía `FormData`,
- crear categorías,
- actualizar estado de pedidos,
- actualizar estado de mensajes,
- actualizar roles de usuarios,
- mostrar una vista compacta del catálogo visible para clientes.

### `dashboard/customer-dashboard.tsx`

Panel del cliente.

Funciones principales:

- consultar perfil con `/users/me`,
- consultar pedidos propios con `/orders/me`,
- mostrar historial y estado de pedidos.

## 5.5 Carpeta `lib`

Contiene la lógica utilitaria del frontend.

### `api.ts`

Es el puente entre frontend y backend.

Responsabilidades:

- definir la URL pública e interna de la API,
- resolver URLs de imágenes,
- centralizar `fetch`,
- adjuntar `Content-Type`,
- adjuntar token si existe,
- unificar el manejo de errores.

También incluye `loginRequest`.

### `auth.ts`

Gestiona la sesión del usuario en el navegador:

- `saveSession`
- `getSession`
- `clearSession`
- `hasRole`

La sesión se guarda en `localStorage` bajo la clave `plant-store-session`.

### `types.ts`

Declara los tipos TypeScript consumidos por el frontend:

- `Category`
- `Plant`
- `AuthSession`
- `ContactMessage`
- `OrderItem`
- `Order`
- `UserSummary`

Esto mantiene tipada la comunicación con la API.

## 5.6 Carpeta `public`

Contiene assets públicos del frontend.

- `plant-placeholder.svg`: imagen de respaldo cuando un producto no tiene imagen disponible.

## 5.7 Resumen funcional del frontend

El frontend está organizado en cuatro bloques claros:

- **rutas** en `app/`,
- **componentes** en `components/`,
- **utilidades y tipos** en `lib/`,
- **estilos y assets** en `globals.css` y `public/`.

Además, combina:

- páginas públicas de marketing,
- páginas funcionales de operación,
- y dashboards diferenciados por rol.

## 6. Relación entre backend y frontend

La integración entre ambas capas está bien definida:

- el backend expone endpoints REST,
- el frontend los consume desde `lib/api.ts`,
- las imágenes se resuelven con `resolveAssetUrl`,
- la autenticación usa JWT,
- la autorización combina validación en backend y control de navegación en frontend.

### Endpoints más usados por el frontend

- `/auth/login`
- `/plants`
- `/plants/admin`
- `/plants/slug/{slug}`
- `/categories`
- `/contacts`
- `/orders`
- `/orders/me`
- `/users`
- `/users/me`

## 7. Evidencias visuales entregadas por el usuario

Las capturas compartidas muestran correctamente los módulos principales del sistema y pueden usarse como evidencia en un informe o presentación.

### Capturas y significado funcional

1. **Inicio**  
   Muestra la portada del sitio, navegación pública, llamada principal y bloque de colección destacada.

2. **Catálogo**  
   Muestra productos cargados desde el backend, con imagen, precio, categoría, stock y acceso a detalle.

3. **Contacto**  
   Muestra el formulario público para enviar consultas.

4. **Inicio de sesión en modo cliente**  
   Muestra el selector de modo y el formulario de autenticación.

5. **Inicio de sesión en modo administrador**  
   Evidencia que el acceso se divide por perfil.

6. **Dashboard administrativo, cabecera y métricas**  
   Evidencia indicadores de productos, categorías, pedidos y contactos.

7. **Dashboard administrativo, formularios de creación**  
   Evidencia la creación de productos y categorías.

8. **Dashboard administrativo, vista compacta de productos y gestión operativa**  
   Evidencia catálogo interno, pedidos y mensajes de contacto.

9. **Dashboard administrativo, gestión de usuarios y roles**  
   Evidencia la edición de permisos y la coexistencia de roles.

## 8. Observaciones técnicas importantes

### Fortalezas del proyecto

- Separación clara entre frontend y backend.
- Organización por capas en el backend.
- Uso de DTOs para desacoplar la API del modelo persistente.
- Seguridad basada en JWT y roles.
- Frontend moderno con App Router y TypeScript.
- Panel administrativo funcional para una demo completa.
- Datos semilla útiles para exposición y pruebas.

### Aspectos a tener presentes

- El proyecto depende de PostgreSQL para el backend.
- No se observan pruebas automatizadas en `src/test`.
- Existen carpetas generadas como `backend/target`, `frontend/.next` y `frontend/node_modules` que no forman parte del código manual.
- La sesión del frontend se guarda en `localStorage`, por lo que depende del navegador del usuario.
- La protección real de seguridad está en el backend; el frontend solo complementa la experiencia con redirecciones.

## 9. Conclusión

Este proyecto está bien planteado como una solución full stack académica y funcional. Desde la raíz del repositorio se aprecia una organización pensada para desarrollo y despliegue con Docker. El backend implementa correctamente una API REST con autenticación JWT, control por roles, persistencia con PostgreSQL y carga de imágenes. El frontend entrega una experiencia clara para usuarios públicos, clientes autenticados y administradores.

Si esta documentación se usa como base para una exposición, se recomienda presentar el proyecto en este orden:

1. visión general y arquitectura,
2. estructura de la raíz del repositorio,
3. backend por capas,
4. frontend por rutas y componentes,
5. flujo de autenticación e integración,
6. evidencias visuales del sistema funcionando.
