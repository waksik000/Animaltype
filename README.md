# 🐾 AnimalType

> Клавиатурный тренажёр для развития скорости слепой печати

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-20-339933?logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb)](https://www.mongodb.com/)
[![Socket.io](https://img.shields.io/badge/Socket.io-4-010101?logo=socket.io)](https://socket.io/)
[![JWT](https://img.shields.io/badge/JWT-Auth-000000?logo=json-web-tokens)](https://jwt.io/)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite)](https://vitejs.dev/)

## 📋 Описание

**AnimalType** — это веб-приложение для тренировки и измерения скорости печати. Вдохновлено популярным тренажёром [MonkeyType](https://monkeytype.com/). Пользователи могут проходить тесты на скорость печати, отслеживать свой прогресс, соревноваться в таблице лидеров и общаться с администратором через встроенный чат поддержки.

### 🎯 Основные возможности

- ⚡ **Тренажёр слепой печати** — измерение WPM (слов в минуту), точности и количества ошибок
- 👤 **Система авторизации** — регистрация и вход с JWT-токенами
- 🏆 **Таблица лидеров** — топ-10 пользователей по максимальной скорости печати
- 📊 **История результатов** — сохранение попыток с детальной статистикой
- 💬 **Чат поддержки** — real-time общение с администратором через WebSocket
- 🌙 **Тёмная тема** — стильный минималистичный дизайн
- 📱 **Адаптивный дизайн** — поддержка desktop, tablet и mobile устройств

## 🛠 Технологический стек

### Frontend
- **[React 19](https://react.dev/)** — библиотека для построения пользовательских интерфейсов
- **[Vite](https://vitejs.dev/)** — сборщик модулей
- **[CSS Modules](https://github.com/css-modules/css-modules)** — изолированные стили компонентов
- **[React Router](https://reactrouter.com/)** — маршрутизация страниц
- **[Socket.io Client](https://socket.io/docs/v4/client-api/)** — WebSocket клиент для чата

### Backend
- **[Node.js](https://nodejs.org/)** — серверная платформа
- **[Express.js](https://expressjs.com/)** — веб-фреймворк
- **[MongoDB Atlas](https://www.mongodb.com/atlas)** — облачная база данных
- **[Mongoose](https://mongoosejs.com/)** — ODM для MongoDB
- **[Socket.io](https://socket.io/)** — real-time коммуникация
- **[JWT](https://jwt.io/)** — JSON Web Tokens для аутентификации
- **[bcryptjs](https://www.npmjs.com/package/bcryptjs)** — хеширование паролей

## 🚀 Установка и запуск

### Предварительные требования
- Node.js версии 18 или выше
- npm или yarn
- MongoDB (локальная или Atlas)

### 1. Клонирование репозитория
```bash
git clone https://github.com/waksik000/Animaltype.git
cd animaltype
```

### 2. Настройка бэкэнда
```bash
cd backend
npm install
```
Создай файл .env в папке backend
```env
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/animaltype
JWT_SECRET=your_secret_key_here
PORT=5000
```
И запусти проект
```bash
npm run dev
```
### 3. Настройка фронтенда
```bash
cd src
npm i
npm run dev
```
Открой браузер и перейди по адресу: http://localhost:5173

## 📁 Структура проекта
    animaltype/
    ├── frontend/
    │   ├── src/
    │   │   ├── components/        # React компоненты
    │   │   │   ├── AuthModal.jsx          
    │   │   │   ├── HistoryModal.jsx    # Шапка сайта
    │   │   │   ├── Leaderboard.jsx # Чат поддержки
    │   │   │   ├── ResultModal.jsx
    │   │   │   ├── Settings.jsx
    │   │   │   ├── SupportChat.jsx
    │   │   │   ├── SupportChat.module.css
    │   │   │   ├── Timer.jsx
    │   │   │   └── TypingArea.jsx
    │   │   ├── data/            # const файлы
    │   │   ├   ├── words.json
    │   │   └── App.jsx          # Корневой компонент
    │   └── package.json
    ├── backend/
    │   ├── config/               # Конфигурации
    │   │   ├── database.js       # Подключение к MongoDB
    │   │   └── socket.js         # Настройка Socket.io
    │   ├── models/               # Mongoose модели
    │   │   ├── User.js           # Модель пользователя
    │   │   ├── Result.js         # Модель результатов
    │   │   └── Message.js        # Модель сообщений чата
    │   ├── routes/               # API маршруты
    │   │   ├── auth.js           # Аутентификация
    │   │   └── results.js        # Результаты тестов
    │   ├── middleware/           # Middleware
    │   │   └── socketAuth.js     # Аутентификация сокетов
    │   ├── services/             # Бизнес-логика
    │   │   └── chatService.js    # Сервис чата
    │   ├── socket/               # Обработчики сокетов
    │   │   └── chatHandlers.js   # Логика чата
    │   ├── server.js             # Точка входа
    │   └── package.json
    └── README.md


## 🔌 API Endpoints
### Аутентификация
    Метод	Эндпоинт	        Описание

    POST	/api/auth/register	Регистрация пользователя
    POST	/api/auth/login	Вход в систему
### Результаты
    Метод	Эндпоинт	        Описание

    POST	/api/results	    Сохранить результат теста
    GET	    /api/results	    Получить историю результатов
    GET	/api/results/leaderboard	Получить таблицу лидеров
### WebSocket события
    Событие	            Описание
    support message	    Отправка сообщения в чат поддержки
    admin reply	        Ответ администратора пользователю
    new support message	Новое сообщение (для админов)
    admin message	    Ответ админа (для пользователя)
    chat history	    История сообщений при подключении

## 🎮 Использование
**Регистрация** — создай аккаунт с уникальным именем пользователя

**Вход** — войди используя свои учетные данные

**Тренировка** — начни печатать текст на главной странице

**Результаты** — просматривай свою статистику после каждого теста

**Лидеры** — сравнивай свои результаты с другими пользователями

**Поддержка** — используй чат для связи с администратором

## Администратор
Для доступа к админ-панели используй логин **admin** при регистрации. Администратор имеет доступ к:

Просмотру всех сообщений в чате поддержки

Ответам пользователям от имени поддержки

Расширенной статистике

## 🔒 Безопасность
Пароли хешируются с помощью **bcryptjs** (10 раундов соли)

Аутентификация через **JWT токены**

**WebSocket** соединения требуют валидный токен

**CORS** настроен для разрешённых источников

Данные пользователей изолированы (каждый видит только свои результаты)

## 📊 База данных
Проект использует MongoDB Atlas с тремя коллекциями:

### Users
**username** — уникальное имя пользователя

**password** — хешированный пароль

**role** — роль (user/admin)

### Results
**userId** — ссылка на пользователя

**wpm** — слов в минуту

**accuracy** — точность (%)

**errors** — количество ошибок

**date** — дата теста

### Messages
**from** — отправитель

**to** — получатель

**message** — текст сообщения

**type** — тип (user/admin)

**timestamp** — время отправки

## 🎨 Особенности UI/UX
- **Минималистичный дизайн** в тёмных тонах

- **Акцентный цвет #646cff** для интерактивных элементов

- **Плавные анимации** и переходы

- Визуальная **обратная связь** при наборе текста

- **Цветовое кодирование** правильных/неправильных символов

- **Адаптивная верстка** для всех устройств

- Кастомный **скроллбар**

- **Индикаторы загрузки** и сообщения об ошибках

## 👨‍💻 Автор
**Попов Артем**

Разработано в рамках учебного проекта по веб-разработке.