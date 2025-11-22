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
# Desarrollo
npm run start:dev
```

## Tests

```bash
# E2E Tests
npm run test:e2e
```

## Endpoints

### GET /products
Obtiene todos los productos.

### POST /products
Crea un nuevo producto.
**Headers:** `x-api-key: test-key`
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
**Headers:** `x-api-key: test-key`
**Body:**
```json
{
  "stock": 50
}
```

### POST /products/:id/reindex
Reindexa un producto (simulado).
**Response:** 202 Accepted

## Arquitectura

El proyecto sigue una arquitectura hexagonal estricta basada en el repositorio de referencia, con la siguiente estructura para el módulo `products`:

- **Domain (`src/products/domain`)**:
    - `entity`: Entidades del dominio.
    - `ports`:
        - `secondary/db`: Interfaces para repositorios.
- **Application (`src/products/application`)**:
    - Servicios por caso de uso (e.g., `create-product`, `find-products`).
- **Infrastructure (`src/products/infrastructure`)**:
    - `adapters`:
        - `primary/http`: Controladores y DTOs agrupados por funcionalidad.
        - `secondary/db`: Implementación de repositorios y DAOs.

## Datos Semilla

El repositorio en memoria se inicializa con los siguientes datos:
- Taza Cerámica (TAZ-001)
- Camisa Negra (CAM-NEG-002)
- Cuaderno A5 (CUE-A5-003)
