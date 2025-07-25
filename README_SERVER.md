# Calendar App with MongoDB Backend

Повнофункціональний календарний додаток з React фронтендом та Node.js + MongoDB backend.

## 🚀 Швидкий старт

### Передумови

- Node.js (версія 16 або новіша)
- MongoDB Compass або MongoDB Server
- npm або yarn

### 1. Встановлення залежностей

```bash
npm install
```

### 2. Налаштування MongoDB

1. Встановіть MongoDB Compass або запустіть MongoDB Server
2. Створіть базу даних `calendar_app`
3. Переконайтеся що MongoDB працює на `mongodb://localhost:27017`

### 3. Налаштування Environment змінних

#### Створіть файл .env в корні проєкту:

```env
# Frontend Configuration
VITE_API_URL=http://localhost:3001/api
VITE_NODE_ENV=development
VITE_SYNC_ENABLED=true

# Server Configuration
NODE_ENV=development
PORT=3001

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/calendar_app

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-make-it-long-and-secure
JWT_EXPIRE=30d
JWT_COOKIE_EXPIRE=30

# Client Configuration
CLIENT_URL=http://localhost:5173

# Database Connection Options
DB_NAME=calendar_app

# Security
BCRYPT_ROUNDS=12

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=info
```

### 4. Запуск додатку

#### Окремо (рекомендовано для розробки)

Термінал 1 - Backend:

```bash
npm run server
```

Термінал 2 - Frontend:

```bash
npm run dev
```

#### Разом:

```bash
npm run dev:full
```

#### Ініціалізація бази даних:

```bash
npm run server:init-db
```

## 📡 API Endpoints

### Authentication

- `POST /api/auth/register` - Реєстрація
- `POST /api/auth/login` - Авторизація
- `GET /api/auth/me` - Поточний користувач
- `PUT /api/auth/profile` - Оновлення профілю
- `GET /api/auth/logout` - Вихід

### Calendars

- `GET /api/calendars` - Отримати всі календарі
- `POST /api/calendars` - Створити календар
- `GET /api/calendars/:id` - Отримати календар
- `PUT /api/calendars/:id` - Оновити календар
- `DELETE /api/calendars/:id` - Видалити календар
- `PATCH /api/calendars/:id/visibility` - Перемикнути видимість

### Events

- `GET /api/events` - Отримати всі події
- `POST /api/events` - Створити подію
- `GET /api/events/:id` - Отримати подію
- `PUT /api/events/:id` - Оновити подію
- `DELETE /api/events/:id` - Видалити подію
- `PATCH /api/events/:id/move` - Перемістити подію
- `POST /api/events/:id/duplicate` - Дублювати подію

## 🔧 Особливості

### Архітектура

- ✅ **Feature-Sliced Design** - модульна архітектура
- ✅ **TypeScript** - повна типізація фронтенду
- ✅ **Component-Based** - компонентний підхід
- ✅ **SCSS Modules** - ізольовані стилі

### Синхронізація даних

- ✅ Автоматична синхронізація між фронтендом та бекендом
- ✅ Offline-first підхід з локальним збереженням
- ✅ Відкат змін при помилках мережі
- ✅ Оптимістичні оновлення UI

### Функціональність

- ✅ Створення, редагування, видалення календарів
- ✅ Створення, редагування, видалення подій
- ✅ Перетягування подій (drag & drop)
- ✅ Повторювані події
- ✅ Різні види перегляду (день, тиждень)
- ✅ Кольорове кодування
- ✅ Поділ календарів та подій
- ✅ Імпорт поділених подій
- ✅ Responsive дизайн

## 🗄️ База даних

### Моделі MongoDB

- **User** - користувачі з налаштуваннями
- **Calendar** - календарі з правами доступу
- **Event** - події з деталями та повтореннями

### Індекси для оптимізації

- По даті та календарю для подій
- По власнику для календарів
- По унікальному ID

## 🔐 Безпека

- JWT аутентифікація
- BCrypt хешування паролів
- Rate limiting
- CORS налаштування
- Валідація даних
- Helmet.js security headers

## 🚦 Статуси та помилки

- Сервер: `http://localhost:3001/api/health`
- Клієнт: `http://localhost:5173`

## 🛠️ Розробка

### Структура проєкту

```
calendar/
├── src/                        # React фронтенд (TypeScript)
│   ├── entities/              # Бізнес-сутності
│   │   ├── calendar/         # Календарі
│   │   │   ├── CalendarEditor/
│   │   │   ├── CalendarList/
│   │   │   └── calendarStore.js
│   │   ├── date/             # Сутність дати
│   │   └── event/            # Події
│   │       ├── EventEditor/
│   │       ├── EventList/
│   │       ├── ShareEvent/
│   │       ├── ImportSharedEvent/
│   │       ├── eventStore.js
│   │       └── index.js
│   ├── features/             # Функціональні компоненти
│   │   ├── dayView/         # Перегляд по дням
│   │   ├── weekView/        # Перегляд по тижням
│   │   ├── dragDrop/        # Drag & Drop
│   │   ├── eventForm/       # Форми подій
│   │   └── layout/          # Макет
│   ├── shared/              # Спільні компоненти
│   │   ├── api/            # API інтеграція
│   │   ├── config/         # Конфігурація
│   │   ├── hooks/          # Кастомні хуки
│   │   └── ui/             # UI компоненти
│   │       ├── Button/
│   │       ├── CalendarEvent/
│   │       ├── Checkbox/
│   │       ├── ColorPicker/
│   │       ├── ConfirmModal/
│   │       ├── DatePicker/
│   │       ├── Dropdown/
│   │       ├── Icons/
│   │       ├── Input/
│   │       ├── Link/
│   │       ├── Modal/
│   │       ├── SelectMenu/
│   │       ├── Textarea/
│   │       └── Toast/
│   ├── widgets/             # Складні віджети
│   │   ├── CalendarSidebar/
│   │   └── CurrentTimeMarker/
│   ├── icons/              # SVG іконки
│   ├── styles/             # Глобальні стилі
│   ├── types/              # TypeScript типи
│   ├── utils/              # Утилітарні функції
│   ├── App.tsx             # Головний компонент
│   ├── App.test.tsx        # Тести
│   ├── main.tsx            # Точка входу
│   └── setupTests.ts       # Налаштування тестів
├── server/                 # Node.js backend
│   ├── controllers/       # Контролери API
│   │   ├── authController.js
│   │   ├── calendarController.js
│   │   └── eventController.js
│   ├── middleware/        # Middleware функції
│   │   └── auth.js
│   ├── models/           # MongoDB моделі
│   │   ├── calendarModel.js
│   │   ├── eventModel.js
│   │   └── userModel.js
│   ├── routes/           # API роути
│   │   ├── authRoutes.js
│   │   ├── calendarRoutes.js
│   │   └── eventRoutes.js
│   ├── scripts/          # Скрипти
│   │   └── initDb.js
│   ├── utils/            # Утилітарні функції
│   │   ├── dbConnect.js
│   │   └── errorHandler.js
│   ├── package.json      # Залежності серверу
│   └── server.js         # Головний файл серверу
├── assets/               # Статичні ресурси
│   └── favicon.ico
├── package.json          # Залежності проєкту
├── vite.config.ts        # Конфігурація Vite
├── vitest.config.ts      # Конфігурація тестів
├── tsconfig.json         # Конфігурація TypeScript
├── eslint.config.js      # Конфігурація ESLint
├── index.html           # HTML шаблон
├── README.md            # Основна документація
└── README_SERVER.md     # Документація серверу
```

### Команди розробки

```bash
npm run dev          # Запуск фронтенду (Vite dev server)
npm run server       # Запуск серверу (nodemon)
npm run server:start # Запуск серверу (production)
npm run server:init-db # Ініціалізація бази даних
npm run dev:full     # Запуск обох разом (concurrently)
npm run build        # Збірка для продакшену (TypeScript + Vite)
npm run lint         # Перевірка коду (ESLint)
npm run test         # Запуск тестів (Vitest)
npm run test:ui      # UI для тестів
npm run test:coverage # Покриття тестами
npm run typecheck    # Перевірка TypeScript
npm run preview      # Попередній перегляд збірки
```

## 🔧 Технології

### Frontend

- **React 19** - основний фреймворк
- **TypeScript** - типізація
- **Vite** - збірка та dev server
- **Zustand** - state management
- **@hello-pangea/dnd** - drag & drop
- **Formik + Yup** - форми та валідація
- **date-fns** - робота з датами
- **SCSS Modules** - стилізація
- **Vitest** - тестування

### Backend

- **Node.js + Express** - сервер
- **MongoDB + Mongoose** - база даних
- **JWT** - аутентифікація
- **BCrypt** - хешування паролів
- **Helmet** - безпека

## 📝 Примітки

- Default календар завжди присутній та не синхронізується з сервером
- Всі зміни автоматично синхронізуються між фронтендом та бекендом
- При відсутності інтернету додаток працює локально
- Дані зберігаються як локально (Zustand persist), так і на сервері (MongoDB)
- Всі залежності (frontend + backend) тепер в одному package.json
- Environment змінні для frontend та backend в одному .env файлі
- Сервер запускається з корня проєкту через npm run server
