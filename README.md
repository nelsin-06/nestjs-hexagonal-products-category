# Hexagonal Architecture Product Service

Este proyecto implementa un servicio de productos utilizando NestJS, Arquitectura Hexagonal y DDD.

## Requisitos

- Node.js
- NPM

## Instalación

```bash
npm install
```

## Ejecución

```bash
npm run dev   # modo desarrollo (watch)
```

## Tests

Actualmente las pruebas son End-to-End (E2E) contra la API.

```bash
npm run test  # ejecuta las pruebas (E2E por ahora)
```

## Endpoints

### GET /products
Obtiene todos los productos.

### POST /products
Crea un nuevo producto.
**Headers:** `x-api-key: 42p8x5tgt3vdyj82VOhRgpCKvgR2dO1k` (API Key por defecto en `.env`/docker compose)
**Body:**
```json
{
  "name": "Producto",
  "sku": "SKU-123",
  "price": 100,
  "stock": 10
}
```

### PATCH /products/:id/stock
Actualiza el stock de un producto.
**Headers:** `x-api-key: 42p8x5tgt3vdyj82VOhRgpCKvgR2dO1k`
**Body:**
```json
{
  "stock": 50
}
```

### POST /products/:id/reindex
Reindexa un producto (simulado).
**Response:** 202 Accepted

## Documentación de Requests / Colecciones

Para probar rápidamente los endpoints tienes dos opciones:

1. Archivo local REST Client: `documentation/products.http` (abre en VS Code con la extensión "REST Client" y presiona "Send Request" en cada bloque).
2. Colección Postman pública: [Hexagonal Category Products](https://www.postman.com/dark-equinox-132990/workspace/hexagonal-category-products/collection/22972674-9d7e075b-a3bd-499b-81bb-ed20a7f055e4?action=share&creator=22972674)

La API Key por defecto ya está incluida en los ejemplos; recuerda rotarla si publicas el servicio.

## API Key por Defecto

Para probar rápidamente los endpoints protegidos utiliza:

```
Header: x-api-key: 42p8x5tgt3vdyj82VOhRgpCKvgR2dO1k
```

En `docker-compose.yml` se define como variable de entorno `API_KEY`. Cámbiala allí para rotarla.

## Arquitectura

El proyecto sigue una arquitectura hexagonal estricta.

- **Domain (`src/products/domain`)**: Entidades puras y puertos (interfaces). Regla de negocio: `stock === 0 => isActive = false`.
- **Application (`src/products/application`)**: Servicios (un caso de uso por carpeta) con método `execute()`.
- **Infrastructure (`src/products/infrastructure`)**: Adapters primarios (HTTP) y secundarios (DB / externo). Decoradores Nest y validaciones viven aquí.
- **Shared (`src/shared`)**: Excepciones, filtro global, guard API Key, interceptor de respuesta.

Patrones:
- Repository Pattern + Template Method (en `MongoBaseRepository` + mappers).
- Dependency Inversion (inyección de puertos abstractos).
- Mapper para sanitizar documentos Mongo -> dominio.
- Interceptor de respuesta para normalizar salida.
- Filtro global para capturar y modelar errores (`BusinessException`).

## Datos Semilla

El repositorio en memoria se inicializa con los siguientes datos:
- Taza Cerámica (TAZ-001)
- Camisa Negra (CAM-NEG-002)
- Cuaderno A5 (CUE-A5-003)

## Endpoints (Resumen)

| Método | Ruta | Protegido | Descripción |
|--------|------|-----------|-------------|
| GET    | /products | No | Lista productos |
| POST   | /products | Sí (x-api-key) | Crear producto |
| PATCH  | /products/:id/stock | Sí (x-api-key) | Actualizar stock |
| POST   | /products/:id/reindex | (configurable) | Reindex simulado |

## Intercambiar Adapter a Mongo

1. Levanta Mongo: `docker compose up -d mongo`
2. Descomenta `MongooseModule.forRoot(...)` en `src/app.module.ts`.
3. Descomenta `MongooseModule.forFeature([...])` en `src/products/products.module.ts`.
4. Cambia provider InMemory -> Mongo:
  ```ts
  { provide: ProductRepository, useClass: MongoProductRepository }
  ```
5. Reinicia la app.

El mapper (`ProductMapper`) mantiene limpio el dominio evitando filtrar campos no deseados.

## Diseño y Principios

- Arquitectura Hexagonal: Núcleo estable ante cambios externos.
- DDD: Entidad rica `Product` con invariantes y reglas derivadas.
- Inversión de Dependencias: Módulos inyectan abstracciones, no concreciones.
- BaseRepository no es Factory; combina Repository Pattern + Template Method.
- Guard API Key: Protege mutaciones.
- Interceptor: Punto único para estandarizar respuestas (ampliable para metadatos, correlación, paginado futuro).

## Mejoras Futuras (Roadmap Breve)

Solicitadas:
- Constructor de respuestas con campos de paginado / mensajes personalizados.
- Mapper en controlador para que Application solo maneje entidades (formalizar en creación/actualización).
- DTO response estructurado via interfaz `IProductResponse`.
- Interfaces Infra -> Application para tipar entrada y no reutilizar DTO transporte.
- Observabilidad: logging estructurado + métricas + tracing.
- Health/Readiness endpoints.
- Config tipada con validación (Joi/Zod).
- Pipeline CI (lint, test, build, scan, docker push).

## Nota Final

La arquitectura facilita agregar nuevos adapters (otro DB, cola de eventos, servicio externo) sin modificar el dominio. El código actual prioriza claridad y separación de responsabilidades para escalar.
