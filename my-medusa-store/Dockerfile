# my-medusa-store/Dockerfile
FROM node:20-alpine
WORKDIR /app

# 1) Install all deps (dev & prod)
COPY package.json package-lock.json ./
RUN npm ci

# 2) Copy your entire app
COPY . .

# 3) Configure env & start
ENV NODE_ENV=production
CMD ["npm", "start"]
