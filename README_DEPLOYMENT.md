# Calendar Application - Deployment

## Огляд проєкту

Це full-stack календарний додаток, створений з використанням:
- **Frontend**: React + TypeScript + Vite
- **Backend**: Node.js + Express + MongoDB
- **Деплой**: Render.com

## Швидкий старт для деплою

### 1. Підготовка репозиторію

```bash
# Ініціалізація Git (якщо ще не зроблено)
git init
git add .
git commit -m "Ready for deployment"

# Додавання remote repository
git remote add origin https://github.com/your-username/your-repo.git
git push -u origin main
```

### 2. Створення MongoDB Atlas Database

1. Зареєструйтеся на [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Створіть новий кластер (Free Tier)
3. Створіть користувача бази даних
4. Налаштуйте Network Access (додайте 0.0.0.0/0 для Render)
5. Отримайте connection string

### 3. Деплой на Render.com

#### Автоматичний деплой (Рекомендується):

1. Зайдіть на [Render.com](https://render.com)
2. Створіть аккаунт або увійдіть
3. Натисніть **"New"** → **"Blueprint"**
4. Підключіть ваш GitHub репозиторій
5. Render автоматично знайде файл `render.yaml`
6. Налаштуйте змінні середовища:
   - `MONGODB_URI`: ваш connection string з Atlas
   - Інші змінні будуть налаштовані автоматично

#### Ручний деплой:

**Backend Service:**
- Service Type: Web Service
- Repository: ваш GitHub репозиторій
- Branch: main
- Root Directory: `server`
- Build Command: `npm install`
- Start Command: `npm start`

**Frontend Service:**
- Service Type: Static Site
- Repository: ваш GitHub репозиторій
- Branch: main  
- Build Command: `npm install && npm run build`
- Publish Directory: `dist`

### 4. Налаштування змінних середовища

#### Backend:
```
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/calendar_app
JWT_SECRET=your-super-secure-jwt-secret-key
JWT_EXPIRE=30d
JWT_COOKIE_EXPIRE=30
CLIENT_URL=https://your-frontend-url.onrender.com
```

#### Frontend:
```
VITE_API_URL=https://your-backend-url.onrender.com/api
VITE_NODE_ENV=production
VITE_SYNC_ENABLED=true
```

### 5. Ініціалізація бази даних

Після успішного деплою backend:
1. Відкрийте Render Dashboard
2. Перейдіть до вашого backend сервісу
3. Відкрийте Shell
4. Виконайте: `npm run server:init-db`

## Структура проєкту для деплою

```
├── server/                 # Backend код
│   ├── package.json       # Backend dependencies
│   ├── server.js          # Main server file
│   └── ...
├── src/                   # Frontend код
├── dist/                  # Build output (автоматично)
├── package.json           # Main package.json
├── render.yaml            # Render deployment config
├── .env.production        # Production environment template
├── Dockerfile.backend     # Docker config для backend
├── Dockerfile.frontend    # Docker config для frontend
├── nginx.conf             # Nginx config для frontend
└── DEPLOYMENT.md          # Детальні інструкції
```

## Корисні команди

```bash
# Перевірити готовність до деплою
npm run check-deployment

# Локальна збірка frontend
npm run build

# Запуск production server локально
npm run server:start

# Запуск повного стеку локально
npm run dev:full
```

## Troubleshooting

### Помилки build:
- Переконайтеся, що всі dependencies встановлені
- Перевірте TypeScript помилки: `npm run typecheck`
- Перевірте ESLint: `npm run lint`

### Помилки API:
- Перевірте CORS налаштування в backend
- Переконайтеся, що MONGODB_URI правильний
- Перевірте JWT_SECRET

### Помилки frontend:
- Переконайтеся, що VITE_API_URL правильний
- Перевірте network requests в браузері

## Моніторинг

- **Health Check**: `https://your-backend-url.onrender.com/api/health`
- **Logs**: Render Dashboard → Service → Logs
- **Metrics**: Render Dashboard → Service → Metrics

## Безпека

- ✅ HTTPS автоматично налаштований Render
- ✅ CORS налаштований для вашого frontend
- ✅ Rate limiting активований
- ✅ Security headers встановлені
- ✅ Environment variables захищені

## Підтримка

Якщо виникають проблеми:
1. Перевірте логи в Render Dashboard
2. Переконайтеся, що всі environment variables налаштовані
3. Перевірте статус MongoDB Atlas
4. Використовуйте health check endpoint для діагностики
