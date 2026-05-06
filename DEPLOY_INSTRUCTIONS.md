# 🚀 Инструкция по деплою на Timeweb Cloud App Platform

## ✅ Что уже сделано

1. **next.config.js** обновлён с `output: 'standalone'` для Docker
2. **Dockerfile** создан в `/apps/web/Dockerfile.txt`
3. **.dockerignore** создан в `/apps/web/dockerignore.txt`
4. **docker-compose.yml** создан для локального тестирования

---

## 📋 Шаги для деплоя

### 1️⃣ Подготовка файлов в GitHub

Вам нужно переименовать файлы в вашем GitHub репозитории:

```bash
# В папке /apps/web/
Dockerfile.txt → Dockerfile
dockerignore.txt → .dockerignore
docker-compose.txt → docker-compose.yml
```

**Важно:** Переименование делайте прямо на GitHub:
- Откройте файл → Edit → измените имя → Commit

---

### 2️⃣ Создание package.json

В корне `/apps/web/` создайте файл `package.json`:

```json
{
  "name": "shirokov-deus-capital",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "^14.2.0",
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "@neondatabase/serverless": "^0.9.0",
    "argon2": "^0.31.0",
    "motion": "^10.16.0",
    "lucide-react": "^0.400.0",
    "react-colorful": "^5.6.1",
    "sonner": "^1.5.0",
    "zustand": "^4.5.0"
  },
  "devDependencies": {
    "@types/node": "^20.14.0",
    "@types/react": "^18.3.5",
    "@types/react-dom": "^18.3.0",
    "autoprefixer": "^10.4.19",
    "postcss": "^8.4.38",
    "tailwindcss": "^3.4.4"
  }
}
```

---

### 3️⃣ Настройка переменных окружения

В **Timeweb Cloud App Platform** добавьте все переменные окружения:

```env
NODE_ENV=production
DATABASE_URL=ваш_database_url
RESEND_API_KEY=ваш_resend_key
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=ваш_google_maps_key
STRIPE_SECRET_KEY=ваш_stripe_key
AUTH_SECRET=ваш_auth_secret
AUTH_URL=https://ваш-домен.ru
BETTER_AUTH_SECRET=ваш_better_auth_secret
BETTER_AUTH_URL=https://ваш-домен.ru
NEXT_PUBLIC_CREATE_APP_URL=https://ваш-домен.ru
NEXT_PUBLIC_CREATE_ENV=production
```

---

### 4️⃣ Деплой на Timeweb Cloud

#### **Вариант A: Через Docker образ (рекомендуется)**

1. Соберите Docker образ локально:
```bash
cd apps/web
docker build -t shirokov-deus:latest .
```

2. Загрузите образ в Docker Hub или Timeweb Container Registry:
```bash
docker tag shirokov-deus:latest your-username/shirokov-deus:latest
docker push your-username/shirokov-deus:latest
```

3. В Timeweb App Platform:
   - Создайте новое приложение
   - Выберите "Docker-образ"
   - Укажите `your-username/shirokov-deus:latest`
   - Порт: `3000`

---

#### **Вариант B: Прямой деплой из GitHub**

1. В Timeweb App Platform:
   - Создайте приложение
   - Подключите GitHub репозиторий
   - **Root Directory:** `apps/web`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
   - **Port:** `3000`

2. Добавьте переменные окружения (см. шаг 3)

---

### 5️⃣ Проверка деплоя

После деплоя проверьте:
- ✅ Главная страница открывается
- ✅ API эндпоинты работают (`/api/leads`)
- ✅ Формы отправки лидов работают
- ✅ База данных подключена

---

## 🐛 Устранение проблем

### Проблема: "Application error"
**Решение:** Проверьте логи в Timeweb панели, скорее всего не хватает переменных окружения

### Проблема: "Cannot connect to database"
**Решение:** Проверьте `DATABASE_URL` в переменных окружения

### Проблема: "Module not found"
**Решение:** Убедитесь, что `package.json` содержит все зависимости

---

## 🔄 Локальное тестирование Docker

Перед деплоем можно протестировать локально:

```bash
cd apps/web

# Переименуйте файлы
mv Dockerfile.txt Dockerfile
mv dockerignore.txt .dockerignore
mv docker-compose.txt docker-compose.yml

# Запустите
docker-compose up --build
```

Откройте http://localhost:3000

---

## 📞 Альтернативы Timeweb Cloud

Если будут проблемы с Timeweb, используйте:

### **Vercel (идеален для Next.js)**
- Бесплатный план
- Автоматический деплой из GitHub
- Не нужен Docker
- [vercel.com](https://vercel.com)

### **Railway**
- Простой деплой из GitHub
- Поддержка Docker из коробки
- [railway.app](https://railway.app)

### **Render**
- Бесплатный план
- Автоматический деплой
- [render.com](https://render.com)

---

## ✅ Чеклист перед деплоем

- [ ] Файлы переименованы (Dockerfile, .dockerignore)
- [ ] package.json создан в /apps/web/
- [ ] Все переменные окружения добавлены
- [ ] GitHub репозиторий обновлён
- [ ] Docker образ собирается без ошибок (если используете Docker)

---

**Вопросы?** Пишите в чат! Готов помочь на любом этапе деплоя 🚀
