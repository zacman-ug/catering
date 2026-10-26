# Chef Godwin Foods & Kitchen Uganda

Full-stack website for **Chef Godwin Marvin** — event catering and the Godwin Cooking School, based in Kampala, Uganda.

## Tech Stack

| Layer    | Technology                          |
| -------- | ----------------------------------- |
| Frontend | React 19, Vite, React Router, Tailwind CSS |
| Backend  | Node.js, Express 4                  |
| Database | PostgreSQL 16 + Prisma Migrate      |
| Auth     | JWT (admin panel)                   |

## Project Structure

```
chef-godwin-website/
├── client/                 # React + Vite frontend
│   ├── public/
│   └── src/
│       ├── components/     # Reusable UI components
│       ├── pages/          # Route-level pages
│       ├── hooks/          # Custom React hooks
│       ├── services/       # API client functions
│       ├── context/        # React context providers
│       ├── assets/         # Images, fonts
│       └── styles/         # Global CSS / Tailwind
├── server/                 # Express API
│   ├── src/
│   │   ├── config/         # DB, env, multer
│   │   ├── controllers/    # Request handlers
│   │   ├── middleware/     # Auth, validation, errors
│   │   ├── routes/         # API route definitions
│   │   ├── services/       # Business logic
│   │   ├── db/             # Migrations & seeds
│   │   └── utils/          # Helpers
│   └── uploads/            # User-uploaded media
├── docker-compose.yml      # PostgreSQL container
└── package.json            # npm workspaces root
```

## Quick Start

### Prerequisites

- Node.js 20+
- Docker (for PostgreSQL) **or** a local PostgreSQL install

### 1. Install dependencies

```bash
npm install
```

### 2. Start PostgreSQL

```bash
docker compose up -d
```

Default local credentials in this project:

- User: `postgres`
- Password: `12345`
- Database: `chef_godwin`

### 3. Configure environment

```bash
cp .env.example .env
# Edit .env if needed
```

Also copy env for the server:

```bash
cp .env server/.env
```

### 4. Run migrations & seed data

```bash
npm run db:setup
```

This applies Prisma SQL migrations and then seeds business data.

### 5. Start development servers

```bash
npm run dev
```

- **Frontend:** http://localhost:5173
- **Admin:** http://localhost:5173/admin/login
- **API:** http://localhost:5000/api
- **Health check:** http://localhost:5000/api/health

## Tests

```bash
npm run test
```

Uses Node.js built-in `node:test` (no extra test dependencies).

## Business Info (from Google Business Profile)

| Field    | Value |
| -------- | ----- |
| Business | Chef Godwin Foods and Kitchen Uganda |
| Owner    | Chef Godwin Marvin |
| Address  | God With Us Plaza, Kampala, Uganda |
| Phone    | +256 754 845 995 / +256 771 343 592 |
| Services | Event catering, cooking school, recipe content |

## API Endpoints (overview)

| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| GET | `/api/health` | Server health check |
| GET | `/api/services` | Catering service packages |
| GET | `/api/courses` | Cooking school courses |
| GET | `/api/gallery` | Event & food photos |
| GET | `/api/testimonials` | Client reviews |
| POST | `/api/bookings` | Submit catering inquiry |
| POST | `/api/enrollments` | Cooking school enrollment |
| POST | `/api/contact` | General contact message |
| POST | `/api/auth/login` | Admin login |
| GET | `/api/admin/*` | Protected admin routes |

## Prisma Commands

```bash
npm run db:migrate
npm run db:migrate:dev
npm run db:generate
npm run db:seed
npm run db:gallery:sync
```

To make gallery photos match the business profile exactly:

1. Put exact photo URLs in `server/src/db/gallery-business-profile.json`.
2. Run `npm run db:gallery:sync`.
3. Restart dev server if needed.

## Production Build

```bash
npm run build
npm start
```

The Express server serves the built React app from `client/dist` in production.

## License

Private — © Chef Godwin Foods and Kitchen Uganda
