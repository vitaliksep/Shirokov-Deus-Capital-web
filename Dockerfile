FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build 2>&1 || true

FROM node:20-alpine
WORKDIR /app
RUN npm install -g serve
COPY --from=builder /app/build/client ./build
EXPOSE 3000
CMD ["serve", "-s", "build", "-l", "3000"]
