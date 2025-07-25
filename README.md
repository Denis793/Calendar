# Calendar App

Календарний додаток з функціями створення подій, перегляду по дням та тижням, drag & drop функціональністю та backend інтеграцією з MongoDB.

## 🚀 Технології

- **Frontend**: React 19, TypeScript, Vite
- **State Management**: Zustand
- **Drag & Drop**: @hello-pangea/dnd
- **Forms**: Formik + Yup validation
- **Date Management**: date-fns
- **Styling**: SCSS Modules
- **Testing**: Vitest, Testing Library
- **Backend**: Node.js + Express + MongoDB

## 📁 Структура проєкту

```txt
calendar/
├── src/
│   ├── entities/                   # Бізнес-сутності
│   │   ├── calendar/              # Календарі
│   │   │   ├── CalendarEditor/    # Редактор календаря
│   │   │   ├── CalendarList/      # Список календарів
│   │   │   └── calendarStore.js   # Zustand store для календарів
│   │   ├── date/                  # Сутність дати
│   │   └── event/                 # Події
│   │       ├── EventEditor/       # Редактор подій
│   │       ├── EventList/         # Список подій
│   │       ├── ShareEvent/        # Поділ події
│   │       ├── ImportSharedEvent/ # Імпорт поділеної події
│   │       ├── eventStore.js      # Zustand store для подій
│   │       └── index.js
│   │
│   ├── features/                  # Функціональні компоненти
│   │   ├── dayView/              # Перегляд по дням
│   │   ├── weekView/             # Перегляд по тижням
│   │   ├── dragDrop/             # Drag & Drop функціональність
│   │   ├── eventForm/            # Форма створення/редагування події
│   │   └── layout/               # Компоненти макету
│   │
│   ├── shared/                   # Спільні компоненти та утиліти
│   │   ├── api/                  # API інтеграція
│   │   ├── config/               # Конфігурація
│   │   ├── hooks/                # Кастомні хуки
│   │   └── ui/                   # UI компоненти
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
│   │
│   ├── widgets/                  # Складні віджети
│   │   ├── CalendarSidebar/      # Бічна панель календаря
│   │   └── CurrentTimeMarker/    # Маркер поточного часу
│   │
│   ├── icons/                    # SVG іконки
│   ├── styles/                   # Глобальні стилі
│   ├── types/                    # TypeScript типи
│   ├── utils/                    # Утилітарні функції
│   │
│   ├── App.tsx                   # Головний компонент
│   ├── App.test.tsx             # Тести App компонента
│   ├── main.tsx                 # Точка входу
│   └── setupTests.ts            # Налаштування тестів
│
├── server/                       # Node.js Backend
│   ├── controllers/              # API контролери
│   │   ├── authController.js     # Контролер авторизації
│   │   ├── calendarController.js # Контролер календарів
│   │   └── eventController.js    # Контролер подій
│   ├── middleware/               # Middleware функції
│   │   └── auth.js              # Авторизаційний middleware
│   ├── models/                   # MongoDB моделі
│   │   ├── calendarModel.js     # Модель календаря
│   │   ├── eventModel.js        # Модель події
│   │   └── userModel.js         # Модель користувача
│   ├── routes/                   # API маршрути
│   │   ├── authRoutes.js        # Маршрути авторизації
│   │   ├── calendarRoutes.js    # Маршрути календарів
│   │   └── eventRoutes.js       # Маршрути подій
│   ├── scripts/                  # Скрипти
│   │   └── initDb.js            # Ініціалізація БД
│   ├── utils/                    # Утилітарні функції
│   │   ├── dbConnect.js         # Підключення до БД
│   │   └── errorHandler.js      # Обробка помилок
│   ├── package.json             # Залежності серверу
│   └── server.js                # Головний файл серверу
│
├── assets/                       # Статичні ресурси
│   └── favicon.ico
├── package.json                  # Залежності проєкту
├── vite.config.ts               # Конфігурація Vite
├── vitest.config.ts             # Конфігурація тестів
├── tsconfig.json                # Конфігурація TypeScript
├── eslint.config.js             # Конфігурація ESLint
├── index.html                   # HTML шаблон
├── README.md                    # Документація
└── README_SERVER.md             # Документація серверу
```

## 🛠️ Розробка

### Встановлення залежностей

```bash
# Фронтенд
npm install

# Backend
cd server
npm install
cd ..
```

### Запуск проєкту

```bash
# Тільки фронтенд
npm run dev

# Тільки backend
npm run server

# Фронтенд + Backend разом
npm run dev:full
```

### Тестування

```bash
npm run test              # Запуск тестів
npm run test:ui          # UI для тестів
npm run test:coverage    # Покриття тестами
npm run typecheck        # Перевірка TypeScript
```

### Лінтинг та збірка

```bash
npm run lint             # Перевірка коду
npm run build            # Збірка для продакшену
npm run preview          # Попередній перегляд збірки
```

## 📋 Функціональність

- ✅ Створення, редагування, видалення календарів
- ✅ Створення, редагування, видалення подій
- ✅ Перетягування подій (drag & drop)
- ✅ Перегляд по дням та тижням
- ✅ Кольорове кодування календарів
- ✅ Поділ подій з іншими користувачами
- ✅ Імпорт поділених подій
- ✅ Responsive дизайн
- ✅ Автоматична синхронізація з сервером
- ✅ Offline-first підхід

## 🔧 Архітектурні принципи

- **Feature-Sliced Design** - модульна архітектура
- **Separation of Concerns** - розділення відповідальностей
- **Component-Based Architecture** - компонентний підхід
- **TypeScript** - типізація для надійності
- **SCSS Modules** - ізольовані стилі
- **Zustand** - простий state management
