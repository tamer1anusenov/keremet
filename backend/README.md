# Инструкция по установке и настройке проекта

## Требования
- Node.js (версия 14 или выше)
- PostgreSQL (версия 12 или выше)
- npm или yarn
- `express`
- `express-session`
- `connect-pg-simple`
- `pg`
- `dotenv`
- `ejs`
- `bcryptjs`
- `passport`
- `passport-local`
- `morgan`
- `prisma`

## Установка и настройка

### 1. Установка PostgreSQL
1. Скачайте PostgreSQL с официального сайта: https://www.postgresql.org/download/
2. Установите PostgreSQL, следуя инструкциям установщика
3. Запомните пароль, который вы установили для пользователя postgres

### 2. Настройка проекта
1. Клонируйте репозиторий:
```bash
git clone <url-репозитория>
cd backend
```

2. Установите зависимости:
```bash
npm install
# или
yarn install
```

3. Убедитесь, что все необходимые пакеты установлены:
```bash
npm install express express-session connect-pg-simple pg dotenv ejs bcryptjs passport passport-local morgan prisma
```

4. Создайте файл `.env` в корневой директории проекта:
```
DATABASE_URL=postgresql://postgres:ваш_пароль@localhost:5432/имя_базы_данных
PORT=4000
SESSION_SECRET=ваш_секретный_ключ
```

5. Создайте базу данных:
```bash
psql -U postgres
CREATE DATABASE имя_базы_данных;
\q
```

6. Примените миграции:
```bash
npx prisma migrate dev
# или
yarn prisma migrate dev
```

7. Запустите сервер базы данных, если он не запущен:
```bash
sudo systemctl start postgresql  # Для Linux
net start postgresql  # Для Windows
```

### 3. Запуск проекта
```bash
npm run dev
# или
yarn dev
```

## Проверка работоспособности
После запуска сервер должен быть доступен по адресу: http://localhost:4000

## Возможные проблемы
- **Ошибка подключения к базе данных**:
  - Проверьте правильность данных в файле `.env`
  - Убедитесь, что PostgreSQL запущен
  - Проверьте имя пользователя и пароль

- **Ошибка "Cannot find module 'connect-pg-simple'"**:
  - Установите недостающий пакет: `npm install connect-pg-simple`

- **Ошибка "PORT already in use"**:
  - Проверьте, не занят ли порт 4000 другой программой (`lsof -i :4000` в Linux/Mac или `netstat -ano | findstr :4000` в Windows)
  - Измените порт в файле `.env` и в `server.js`

## Дополнительная информация
- Для работы с базой данных через GUI можно использовать **pgAdmin** или **DBeaver**.
- Логи сервера можно отслеживать с помощью **morgan**.

