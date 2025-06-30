FROM node:20-alpine
WORKDIR /app

# 1) Install deps
COPY package.json package-lock.json ./
RUN npm ci

# 2) Copy only your Medusa app
COPY . .

# 3) Build & expose
RUN npm run build
EXPOSE 9000

# 4) Start in server mode
CMD ["npm", "run", "start"]
