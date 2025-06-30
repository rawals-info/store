# ---- 1) Builder stage ----
FROM node:20-alpine AS builder
WORKDIR /app
    
    # Install dependencies early (cacheable)
COPY package.json package-lock.json ./
RUN npm ci
    
    # Copy source code & build
COPY . .
RUN npm run build
    
    # ---- 2) Runtime stage ----
FROM node:20-alpine
WORKDIR /app
    
    # Copy built files + manifest for runtime install
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/package-lock.json ./package-lock.json
    
    # Install only production deps
RUN npm ci --production
    
ENV NODE_ENV=production
    # Medusa’s production start
CMD ["npm", "start"]
    