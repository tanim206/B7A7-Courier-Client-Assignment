# Logistics Management System - Client

A modern, full-stack logistics management application built with **Next.js 16**, **React 19**, and **TypeScript**. Features role-based access control, real-time shipment tracking, and a responsive dashboard for admins, staff, and customers.

## 🚀 Tech Stack

| Category | Technologies |
|----------|-------------|
| **Framework** | Next.js 16 (App Router), React 19 |
| **Language** | TypeScript 5 |
| **State Management** | TanStack Query (React Query v5) |
| **UI Components** | Shadcn/UI, Radix UI, Lucide React |
| **Styling** | Tailwind CSS v4, CSS Variables |
| **Forms & Validation** | TanStack Form, Zod v4 |
| **Authentication** | Google OAuth 2.0, JWT, Role-based Guards |
| **API Client** | ofetch (lightweight fetch wrapper) |
| **Code Quality** | Biome (linting + formatting) |
| **Package Manager** | Bun |

## 🏗️ Project Structure

```
src/
├── api/                 # API layer (typed endpoints)
│   ├── auth.api.ts      # Authentication endpoints
│   ├── shipment.api.ts  # Shipment CRUD & tracking
│   ├── user.api.ts      # User management
│   ├── admin.api.ts     # Admin-only operations
│   └── hub-application.api.ts
├── auth/                # Auth guards & providers
│   ├── auth-guard.tsx   # Route protection
│   ├── role-guard.tsx   # Role-based access
│   └── google-auth.provider.tsx
├── components/
│   ├── ui/              # Reusable UI primitives (Shadcn)
│   └── google-login/    # Google OAuth button
├── hooks/               # Custom React hooks
│   ├── shipment.hook.ts # Shipment data fetching
│   ├── user.hook.ts     # User data fetching
│   └── use-debounced-value.ts
├── layout/              # Dashboard layouts
│   ├── dashboard-shell.tsx
│   └── dashboard-sidebar.tsx
├── lib/                 # Utilities & configs
│   ├── apiClient.ts     # Typed API client
│   ├── api-error.ts     # Error handling
│   ├── format.ts        # Formatters (date, currency)
│   └── qr.ts            # QR code generation
├── providers/           # React context providers
│   └── query.provider.tsx
├── routes/              # Route definitions by role
│   ├── admin.route.ts
│   ├── staff.route.ts
│   └── customer.route.ts
├── types/               # TypeScript definitions
│   ├── shipment.type.ts
│   ├── user.type.ts
│   └── api.type.ts
└── validation/          # Zod schemas
    ├── shipment.validation.ts
    └── auth.validation.ts
```

## ✨ Key Features

### 🔐 Authentication & Authorization
- **Google OAuth 2.0** integration with secure token handling
- **Role-based access control** (Admin, Staff, Customer)
- Protected routes with automatic redirects
- JWT token management with refresh logic

### 📦 Shipment Management
- Create, read, update, delete shipments
- Real-time status tracking (Pending → In Transit → Delivered)
- QR code generation for parcel identification
- Hub assignment & transfer workflows

### 👥 User Management
- Role-specific dashboards (Admin/Staff/Customer)
- User profile management
- Hub application system for partner onboarding

### 🎨 UI/UX
- Fully responsive design (mobile-first)
- Accessible components (ARIA compliant)
- Dark mode support via CSS variables
- Toast notifications, loading skeletons, modals

## 🛠️ Getting Started

### Prerequisites
- **Bun** ≥ 1.4.0 (or Node.js ≥ 20)
- Backend API running (see server repo)

### Installation

```bash
# Clone & install
git clone <repository-url>
cd client
bun install

# Environment setup
cp .env.example .env.local
# Edit .env.local with your configuration

# Development
bun run dev

# Production build
bun run build
bun run start
```

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL | Yes |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Google OAuth client ID | Yes |
| `NEXT_PUBLIC_APP_URL` | Frontend URL for callbacks | Yes |

## 📋 Available Scripts

| Command | Description |
|---------|-------------|
| `bun run dev` | Start development server (Turbopack) |
| `bun run build` | Production build |
| `bun run start` | Run production server |
| `bun run lint` | Run Biome linter |
| `bun run format` | Auto-format with Biome |

## 🏛️ Architecture Highlights

### Type-Safe API Layer
```typescript
// Automatic type inference from Zod schemas
const shipment = await api.shipments.create(data) // Fully typed response
```

### Server-Client Boundary Optimization
- Server Components by default for SEO & performance
- Client Components only where interactivity needed
- TanStack Query for server state (caching, deduping, retries)

### Role-Based Routing
```typescript
// routes/admin.route.ts
export const adminRoutes = [
  { path: '/admin/dashboard', component: AdminDashboard },
  { path: '/admin/users', component: UserManagement },
] as const
```

### Error Handling Strategy
- Centralized `ApiError` class with status codes
- Toast notifications for user-facing errors
- Structured logging for debugging

## 🧪 Code Quality

- **Biome** for fast linting & formatting (replaces ESLint + Prettier)
- **TypeScript strict mode** enabled
- **Zod** for runtime validation matching compile-time types
- **Path aliases** (`@/*`) for clean imports

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Connect GitHub repo to Vercel
# Add environment variables in dashboard
# Deploy automatically on push to main
```

### Docker
```dockerfile
FROM oven/bun:1.4-alpine
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile
COPY . .
RUN bun run build
EXPOSE 3000
CMD ["bun", "run", "start"]
```

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

---

**Built for interview demonstration** — showcasing modern React patterns, type-safe full-stack development, and production-ready architecture.