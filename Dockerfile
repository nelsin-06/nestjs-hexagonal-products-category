# Multi-stage Dockerfile for NestJS Hexagonal backend

# ---- Base builder ----
FROM node:20-alpine AS builder
WORKDIR /app
# IMPORTANT: No establecemos NODE_ENV=production aquí para que se instalen devDependencies (incluye @nestjs/cli)
# Alternativa sería mantener NODE_ENV=production y usar: npm install --legacy-peer-deps --include=dev
# Mantengo la forma más clara: sin producción en etapa de build.
# Install deps separately to leverage layer caching
COPY package.json package-lock.json* yarn.lock* pnpm-lock.yaml* ./
RUN npm install --legacy-peer-deps
COPY tsconfig.json tsconfig.build.json nest-cli.json .eslint* .prettier* ./
COPY src ./src
RUN npm run build

# ---- Production runtime ----
FROM node:20-alpine AS production
WORKDIR /app
ENV NODE_ENV=production
# Only copy necessary artifacts
COPY package.json package-lock.json* ./
RUN npm install --omit=dev --legacy-peer-deps \
 && npm cache clean --force
COPY --from=builder /app/dist ./dist
# Non-root user (optional)
RUN addgroup -S app && adduser -S app -G app
USER app
EXPOSE 3000
CMD ["node", "dist/main.js"]

# ---- Development (optional) ----
FROM node:20-alpine AS dev
WORKDIR /app
ENV NODE_ENV=dev
COPY package.json package-lock.json* ./
RUN npm install --legacy-peer-deps
COPY tsconfig.json tsconfig.build.json nest-cli.json .eslint* .prettier* ./
COPY src ./src
EXPOSE 3000
CMD ["npm", "run", "start:dev"]
