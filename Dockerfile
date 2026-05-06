FROM node:18-alpine AS base

# Установка зависимостей только когда это необходимо
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
# Для образов на базе Ubuntu/Debian:
RUN apt-get update && apt-get install -y python3 build-essential && rm -rf /var/lib/apt/lists/*

# Для образов на базе Alpine (часто используется для Node.js):
RUN apk add --no-cache python3 make g++ gcc

# Копируем файлы зависимостей
COPY package.json package-lock.json* ./
RUN npm install

# Билд приложения
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Переменные окружения для билда (если нужны)
ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

# Production образ
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Копируем собранное приложение
COPY --from=builder /app/public ./public

# Автоматически используем output standalone
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
