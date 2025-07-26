# Calendar App

Live: [https://calendar-fxvh.onrender.com](https://calendar-fxvh.onrender.com)

A calendar application with features for creating events, day and week views, drag & drop functionality, and backend integration with MongoDB.

## 🚀 Technologies

- **Frontend**: React 19, TypeScript, Vite  
- **State Management**: Zustand  
- **Drag & Drop**: @hello-pangea/dnd  
- **Forms**: Formik + Yup validation  
- **Date Management**: date-fns  
- **Styling**: SCSS Modules  
- **Testing**: Vitest, Testing Library  
- **Backend**: Node.js + Express + MongoDB  

## 📁 Project Structure

```txt
calendar/
├── src/
│   ├── entities/
│   │   ├── calendar/
│   │   │   ├── CalendarEditor/
│   │   │   ├── CalendarList/
│   │   │   └── calendarStore.js
│   │   ├── date/
│   │   └── event/
│   │       ├── EventEditor/
│   │       ├── EventList/
│   │       ├── ShareEvent/
│   │       ├── ImportSharedEvent/
│   │       ├── eventStore.js
│   │       └── index.js
│   ├── features/
│   │   ├── dayView/
│   │   ├── weekView/
│   │   ├── dragDrop/
│   │   ├── eventForm/
│   │   └── layout/
│   ├── shared/
│   │   ├── api/
│   │   ├── config/
│   │   ├── hooks/
│   │   └── ui/
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
│   ├── widgets/
│   │   ├── CalendarSidebar/
│   │   └── CurrentTimeMarker/
│   ├── icons/
│   ├── styles/
│   ├── types/
│   ├── utils/
│   ├── App.tsx
│   ├── App.test.tsx
│   ├── main.tsx
│   └── setupTests.ts
├── server/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── calendarController.js
│   │   └── eventController.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── calendarModel.js
│   │   ├── eventModel.js
│   │   └── userModel.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── calendarRoutes.js
│   │   └── eventRoutes.js
│   ├── scripts/
│   │   └── initDb.js
│   ├── utils/
│   │   ├── dbConnect.js
│   │   └── errorHandler.js
│   ├── package.json
│   └── server.js
├── assets/
│   └── favicon.ico
├── package.json
├── vite.config.ts
├── vitest.config.ts
├── tsconfig.json
├── eslint.config.js
├── index.html
├── README.md
└── README_SERVER.md
```

# Frontend
npm install

# Backend
cd server
npm install
cd ..

# Frontend only
npm run dev

# Backend only
npm run server

# Frontend + Backend together
npm run dev:full

npm run test             # Run tests
npm run test:ui         # Launch UI testing mode
npm run test:coverage   # View test coverage
npm run typecheck       # TypeScript type checking

npm run lint            # Lint the code
npm run build           # Build for production
npm run preview         # Preview the production build

📋 Features
✅ Create, edit, delete calendars

✅ Create, edit, delete events

✅ Drag & drop events

✅ Day and week views

✅ Calendar color tagging

✅ Share events with other users

✅ Import shared events

✅ Responsive design

✅ Real-time sync with backend

✅ Offline-first approach

🔧 Architectural Principles
Feature-Sliced Design – modular architecture

Separation of Concerns – clean code structure

Component-Based Architecture – reusable components

TypeScript – static typing for safety

SCSS Modules – scoped styling

Zustand – simple state management
