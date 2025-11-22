# AI Coding Agent Instructions (NestJS Hexagonal / DDD)

Focus: Stay inside the established Hexagonal boundaries. NEVER bleed framework concerns into `domain/`.

## Architecture Essentials
Layering (inward dependencies only):
1. Domain (`src/products/domain`): Pure TS. Entities (e.g., `entity/product.ts`) + Ports (`ports/out/db/product.repository.port.ts`). No Nest/Mongoose imports.
2. Application (`src/products/application/<use-case>`): One class per use case (`CreateProductService.execute`, `UpdateStockService.execute`). Inject abstract ports only.
3. Infrastructure (`src/products/infrastructure/adapters`): Primary (HTTP controllers + DTOs) under `in/http/...`; Secondary (DB, external) under `out/`. All NestJS decorators + validation live here.

## Core Conventions
- Inject abstract port, not concrete: `constructor(private readonly productRepository: ProductRepository) {}`.
- Domain validation happens inside entity constructor; `Product.isActive` is derived (`stock > 0`). Controllers map domain objects to DTOs (see `find-products` controller + `product.response.dto.ts`).
- Error handling: Business rules -> `BusinessException`; duplicates -> `ConflictException` in `CreateProductService`; missing resources -> `BusinessException` with metadata (see `UpdateStockService`). Global filter: `shared/infrastructure/filters/global-exception.filter.ts`.
- Auth: Protected mutations require `x-api-key: test-key` (guard: `shared/infrastructure/guards/api-key.guard.ts`). Reads (`GET /products`) are public.
- Testing E2E: `test/products.e2e-spec.ts` spins `AppModule`, sets a `ValidationPipe`, uses `supertest` to assert seeds + auth + error codes.
- Naming: Use folder names matching verb phrase (`create-product`, `update-stock`, `reindex-product`). Service class name = PascalCase + `Service`; method = `execute()`.
- Ports location: `domain/ports/out/db/*` extending shared `BaseRepository`. Add new finder/update signatures in the port before adapter implementation.

## Adding a Use Case (Concrete Steps)
1. Domain: Add/extend entity behavior if required (keep validation internal). Update port if new persistence operations are needed.
2. Application: New `<verb>-<noun>` folder + `*.service.ts` exposing `execute(...)`.
3. Infrastructure (secondary): Implement port in adapter (Mongo/memory). Map persistence <-> Domain explicitly.
4. Infrastructure (primary): New controller + request/response DTO(s). Map Domain -> DTO; never return entity directly.
5. Module: Register service + bind abstract port to implementation provider.
6. Test: Extend E2E spec (happy path + one failure scenario). Mock port for unit tests if added.

## Commands & Envs
- Dev: `npm run start:dev` (sets `NODE_ENV=dev`). Other env scripts: `start:local`, `start:qa`, etc.
- Build: `npm run build` -> emits to `dist/` then `start:prod`.
- Lint/Format: `npm run lint`, `npm run format`.
- Tests: Unit `npm test`; Coverage `npm run test:cov`; E2E `npm run test:e2e` (runs in band, `NODE_ENV=test`).

## Implementation Tips
- Generate IDs consistently (currently `Math.random().toString(36).substring(7)` in `CreateProductService`; consider centralized ID provider if expanded).
- Prefer `BusinessException` over raw `Error` for domain validation if you need HTTP mapping; today entity uses raw errors—wrap at the application layer if exposed.
- Keep controllers thin: validate input DTO, call `service.execute`, map Domain -> response DTO, set status codes.
- When extending repository: ensure symmetry (`save`, `findAll`, `findById`, `update`, plus custom like `findBySku`).
- Product activation rule: `isActive` automatically becomes `false` when `stock === 0`, otherwise `true`.

## Quick Example
```ts
// New stock adjustment use case pattern
@Injectable()
export class AdjustStockService {
  constructor(private readonly productRepo: ProductRepository) {}
  async execute(id: string, delta: number) {
    const product = await productRepo.findById(id);
    if (!product) throw new BusinessException('Product not found', 404);
    product.updateStock(product.stock + delta);
    await productRepo.update(product);
    return product; // Controller maps to DTO
  }
}
```

## Validation Checklist (before PR)
- Domain purity (no framework imports).
- Port injection via abstract class.
- DTOs present for every controller IO.
- Errors use consistent exception strategy.
- E2E covers success + one failure path.

Refine or request more detail if you need repository adapter patterns or DTO mapping examples.
