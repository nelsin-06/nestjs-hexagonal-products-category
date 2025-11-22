import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Server } from 'http';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('ProductsController (e2e)', () => {
  let app: INestApplication;
  let server: Server;
  interface ProductDTO {
    id: string;
    name: string;
    sku: string;
    price: number;
    stock: number;
  }

  // Initialize once for the suite to reduce overhead; each test can still mutate the DB.
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true }),
    );
    await app.init();
    // Cast through unknown to satisfy strict lint rule about assigning any.
    server = app.getHttpServer() as unknown as Server;
  });

  // Ensure Nest application + underlying Mongoose connections are closed so Jest exits cleanly.
  afterAll(async () => {
    await app.close();
  });

  it('/products (GET)', () => {
    return request(server)
      .get('/products')
      .expect(200)
      .expect((res) => {
        const body = res.body as ProductDTO[];
        expect(Array.isArray(body)).toBe(true);
        expect(body.length).toBeGreaterThan(0); // Seed data
      });
  });

  it('/products (POST) - 401 without API Key', () => {
    return request(server)
      .post('/products')
      .send({
        name: 'New Product',
        sku: 'NEW-001',
        price: 10,
        stock: 10,
      })
      .expect(401);
  });

  it('/products (POST) - 201 with API Key', () => {
    const uniqueSku = `NEW-${Date.now()}`;
    return request(server)
      .post('/products')
      .set('x-api-key', '42p8x5tgt3vdyj82VOhRgpCKvgR2dO1k')
      .send({
        name: 'New Product',
        sku: uniqueSku,
        price: 10,
        stock: 10,
      })
      .expect(201)
      .expect((res) => {
        expect((res.body as ProductDTO).sku).toBe(uniqueSku);
      });
  });

  it('/products (POST) - 409 Duplicate SKU', () => {
    return request(server)
      .post('/products')
      .set('x-api-key', '42p8x5tgt3vdyj82VOhRgpCKvgR2dO1k')
      .send({
        name: 'Duplicate Product',
        sku: 'TAZ-001', // Existing SKU from seed
        price: 10,
        stock: 10,
      })
      .expect(409);
  });

  it('/products/:id/stock (PATCH) - 200 Update Stock', async () => {
    // First get a product to know its ID
    const productsRes = await request(server).get('/products');
    const products = productsRes.body as ProductDTO[];
    const product = products[0];

    return request(server)
      .patch(`/products/${product.id}/stock`)
      .set('x-api-key', '42p8x5tgt3vdyj82VOhRgpCKvgR2dO1k')
      .send({ stock: 100 })
      .expect(200)
      .expect((res) => {
        expect((res.body as ProductDTO).stock).toBe(100);
      });
  });
});
