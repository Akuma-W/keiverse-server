# KEIVerse Backend Server

This is the **backend project** for **SE122 - Major Project 2 - UIT**.

**KEIVerse** is an **interactive education** platform designed to enhance both online and offline learning experiences. The backend server is responsible for handling authentication, class management, quizzes, assignments, real-time interactions, and notifications. Built with a modular and scalable architecture, it ensures security, performance, and real-time responsiveness for students, teachers, and administrators. This repository contains the backend API powering the KEIVerse ecosystem.

## Tech Stack

- **Framework:** NestJS (Node.js)
- **Language:** TypeScript
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Cache / Queue:** Redis
- **Authentication:** JWT, Passport
- **Realtime:** Socket.IO
- **File Upload:** Cloudinary / Cloud Storage
- **Containerization:** Docker, Docker Compose
- **API Documentation:** Swagger (OpenAPI)

## Features

- Authentication & Authorization (JWT, Role-based access)
- User management (Admin, Teacher, Student)
- Classroom management (create, join, approve students)
- Assignment management (create, submit, grade)
- Quiz system (online & offline, realtime participation)
- Realtime quiz sessions with Socket.IO
- Random student / group selection
- Grade management & statistics
- Forum & anonymous Q&A
- Group chat & messaging
- Survey / polling system
- Notification system (in-app & email)
- Excel import/export (students, grades)
- Redis caching & session support

## Installation & Run

### 1. Clone project

```bash
git clone https://github.com/Akuma-W/keiverse-server.git
cd kei-verse-server
```

### 2. Environment variables

Create a `.env` file based on `.env.example`:

``` bash
cp .env.example .env
```

### 3. Setup Docker

The project uses Docker Compose to run required services.

```bash
docker-compose-up
```

Included services:

- **PostgreSQL**
- **Redis**

Make sure Docker is running before executing this command.

### 4. Setup database

This project uses **Prisma**.

**1.** Install dependencies:

```bash
npm install
```

**2.** Generate Prisma client:

```bash
npx prisma generate
```

**3.** Run database migrations:

```bash
npx prisma migrate dev --name init
```

**4.** Seed initial data (roles table):

```bash
npx prisma db seed
```

The seed script will create default roles: `admin`, `teacher`, `student`.

### 5. Run project

**1.** Install packages

```bash
npm install
```

Run the backend server:

```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod
```

- Server runs at: [http://localhost:3000/](http://localhost:3000/)

- Swagger API docs: [http://localhost:3000/api/docs](http://localhost:3000/api/docs)

## Folder Structure

``` bash
src/
├── modules/
│   ├── auth/
│   ├── users/
│   ├── classrooms/
│   ├── assignments/
│   ├── quizzes/
│   ├── forums/
│   ├── chats/
│   ├── surveys/
│   ├── notifications/
│   └── grades/
├── infra/
│   ├── prisma/
│   ├── redis/
│   ├── cloudinary/
│   └── mail/
├── common/
│   ├── decorators/
│   ├── guards/
│   ├── filters/
│   ├── interceptors/
│   └── utils/
├── gateways/        # Socket.IO gateways
├── config/
├── main.ts
└── app.module.ts
```

## Contact

- **Project:** KEIVerse
- **Author:** Tran Tuan Phong
- **Email:** [tuanphongbrvt1@gmail.com](mailto:tuanphongbrvt1@gmail.com)
- **Linkedin:** [AkumaPhong](https://www.linkedin.com/in/phongakuma/)
- **Website:** (updating)

## LICENSE

This project is licensed under the **MIT License**.
See the `LICENSE` file for more details.
