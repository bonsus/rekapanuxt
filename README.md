# RekapNuxt — Full-Stack SaaS Starter

Production-ready full-stack application built with **Nuxt 3**, **PostgreSQL**, **Prisma**, **Tailwind CSS**, and **JWT authentication**.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Nuxt 3 (SSR/SPA) |
| Database | PostgreSQL |
| ORM | Prisma |
| Auth | JWT (access + refresh tokens) |
| Styling | Tailwind CSS |
| State | Pinia |
| Validation | Zod |
| Password hashing | bcryptjs |

---

## Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
```bash
cp .env.example .env
```

Edit `.env` with your values:
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/rekapnuxt"
NUXT_JWT_SECRET="your-super-secret-key-min-32-chars"
NUXT_JWT_REFRESH_SECRET="your-refresh-secret-key-min-32-chars"
```

### 3. Set up the database
```bash
# Push schema to database
npm run db:push

# Seed with demo users
npm run db:seed
```

### 4. Run development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Demo Accounts

| Role | Email | Password |
|---|---|---|
| Admin | admin@example.com | admin123456 |
| User | user@example.com | user123456 |

---

## Project Structure

```
rekapnuxt/
├── prisma/
│   ├── schema.prisma          # DB schema (User, RefreshToken)
│   └── seed.ts                # Demo data seeder
├── server/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login.post.ts    # POST /api/auth/login
│   │   │   ├── me.get.ts        # GET  /api/auth/me
│   │   │   ├── refresh.post.ts  # POST /api/auth/refresh
│   │   │   └── logout.post.ts   # POST /api/auth/logout
│   │   ├── user/
│   │   │   └── password.put.ts  # PUT  /api/user/password
│   │   └── admin/users/
│   │       ├── index.get.ts     # GET  /api/admin/users (paginated + search)
│   │       ├── index.post.ts    # POST /api/admin/users
│   │       ├── [id].put.ts      # PUT  /api/admin/users/:id
│   │       └── [id].delete.ts   # DELETE /api/admin/users/:id
│   └── utils/
│       ├── prisma.ts            # Prisma client singleton
│       ├── jwt.ts               # sign/verify access & refresh tokens
│       └── auth.ts              # requireAuth / requireAdmin helpers
├── middleware/
│   ├── auth.ts                  # Protect user routes
│   └── admin.ts                 # Protect admin routes + role check
├── stores/
│   └── auth.ts                  # Pinia auth store
├── composables/
│   ├── useApi.ts                # fetchWithAuth (auto token refresh)
│   ├── useAuth.ts               # login / logout / fetchMe
│   └── useUsers.ts              # CRUD wrappers for admin user management
├── plugins/
│   └── auth.client.ts           # Restore session on page load
├── layouts/
│   ├── auth.vue                 # Login page layout (centered card)
│   └── dashboard.vue            # App layout (sidebar + header)
├── components/
│   ├── layout/
│   │   ├── Sidebar.vue          # Role-aware navigation sidebar
│   │   └── Header.vue           # Top bar with sign-out
│   ├── ui/
│   │   ├── AppButton.vue        # Button with variants + loading state
│   │   ├── AppInput.vue         # Input with label + error
│   │   ├── AppModal.vue         # Accessible modal dialog
│   │   ├── AppPagination.vue    # Smart pagination with ellipsis
│   │   └── AppBadge.vue         # Coloured badge
│   └── user/
│       ├── UserTable.vue        # Data table with skeleton loading
│       └── UserForm.vue         # Create / edit user form
├── pages/
│   ├── index.vue                # Smart redirect
│   ├── login.vue                # User login
│   ├── dashboard/
│   │   ├── index.vue            # User dashboard
│   │   └── profile.vue          # Profile + change password
│   └── admin/
│       ├── login.vue            # Admin login
│       ├── dashboard.vue        # Admin dashboard with stats
│       └── users/index.vue      # Full CRUD user management
└── types/
    └── index.ts                 # Shared TypeScript types
```

---

## Authentication Flow

```
Login → access_token (JWT, 15min, stored in Pinia + localStorage)
      + refresh_token (JWT, 7d, stored in DB + HttpOnly cookie)

Expired access_token → GET /api/auth/refresh (automatically retried by useApi)
                     → New access_token returned, refresh_token rotated

Logout → Delete refresh_token from DB + clear cookie + clear store
```

---

## API Reference

### Auth
| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/login` | — | Email + password login |
| GET | `/api/auth/me` | Bearer | Get current user |
| POST | `/api/auth/refresh` | Cookie | Refresh access token |
| POST | `/api/auth/logout` | Cookie | Invalidate session |

### User
| Method | Path | Auth | Description |
|---|---|---|---|
| PUT | `/api/user/password` | Bearer | Update own password |

### Admin
| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/api/admin/users` | Admin | List users (paginated, search, filter) |
| POST | `/api/admin/users` | Admin | Create user |
| PUT | `/api/admin/users/:id` | Admin | Update user |
| DELETE | `/api/admin/users/:id` | Admin | Delete user |

---

## Available Scripts

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build

npm run db:push      # Sync schema to DB (no migration history)
npm run db:migrate   # Create and apply migration
npm run db:studio    # Open Prisma Studio GUI
npm run db:seed      # Seed demo data
```
