# Шаг 1: Сборка приложения (Builder stage)
FROM node:18-alpine AS builder

WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm ci

# Копируем остальные файлы проекта
COPY . .

# Собираем приложение
RUN npm run build

# Шаг 2: Запуск (Production stage)
FROM node:18-alpine AS runner

WORKDIR /app

# Устанавливаем только production-зависимости
COPY --from=builder /app/package*.json ./
RUN npm ci --only=production

# Копируем собранные файлы из builder-этапа
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.js ./

# Указываем порт (Next.js по умолчанию использует 3000)
EXPOSE 3000

# Запускаем сервер
CMD ["npm", "start"]