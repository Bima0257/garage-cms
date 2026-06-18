# Bengkel Motor CMS - Project Documentation

## Overview

Bengkel Motor CMS adalah Content Management System (CMS) berbasis Next.js 16 untuk mengelola website workshop motorcycleshop/steed. Project ini menggunakan Supabase sebagai database dan NextAuth untuk autentikasi.

## Tech Stack

| Category         | Technology                       |
| ---------------- | -------------------------------- |
| Framework        | Next.js 16.2.9 (App Router)      |
| Language         | TypeScript                       |
| Database         | Supabase (PostgreSQL)            |
| Auth             | NextAuth.js v5 (Beta)            |
| Styling          | Tailwind CSS v4                  |
| Form Validation  | React Hook Form + Zod            |
| UI Components    | Custom Components + Tabler Icons |
| Password Hashing | bcryptjs                         |

---

## Folder Structure

```
bengkel-motor-cms/
├── public/                     # Static assets (images, fonts, etc.)
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (public)/           # Public pages (no auth required)
│   │   │   ├── kontak/         # Contact page
│   │   │   ├── layanan/        # Services listing & detail
│   │   │   ├── produk/         # Products listing & detail
│   │   │   ├──tentang/         # About page
│   │   │   ├── layout.tsx      # Public layout (Navbar + Footer)
│   │   │   └── page.tsx        # Homepage
│   │   │
│   │   ├── admin/              # Admin panel (auth required)
│   │   │   ├── (dashboard)/    # Dashboard pages
│   │   │   │   ├── akun/       # Edit account/profile page
│   │   │   │   ├── layanan/    # Manage services
│   │   │   │   ├── pesan/      # View contact messages
│   │   │   │   ├── produk/     # Manage products
│   │   │   │   ├── pengaturan/  # Site settings
│   │   │   │   ├── layout.tsx   # Dashboard layout (Sidebar + Header)
│   │   │   │   └── page.tsx    # Dashboard homepage
│   │   │   ├── login/          # Login page
│   │   │   ├── layout.tsx      # Admin layout
│   │   │   └── login/layout.tsx
│   │   │
│   │   ├── api/                # API Routes
│   │   │   ├── auth/           # NextAuth routes
│   │   │   │   ├── [...nextauth]/   # Auth handler
│   │   │   │   └── seed/       # DB seed route
│   │   │   ├── contact/        # Contact form submission
│   │   │   ├── messages/       # Messages CRUD
│   │   │   ├── products/       # Products CRUD
│   │   │   ├── services/       # Services CRUD
│   │   │   ├── settings/       # Settings CRUD
│   │   │   ├── upload/         # Image upload
│   │   │   └── users/          # User profile CRUD
│   │   │
│   │   ├── layout.tsx          # Root layout
│   │   └── globals.css         # Global styles + CSS variables
│   │
│   ├── components/             # React components
│   │   ├── admin/              # Admin components
│   │   │   ├── ActionButtons.tsx
│   │   │   ├── DataTable.tsx    # Reusable data table
│   │   │   ├── FormDialog.tsx   # Reusable modal form
│   │   │   ├── Header.tsx       # Admin header
│   │   │   ├── ImageUploader.tsx
│   │   │   ├── MessagesClient.tsx
│   │   │   ├── ProductsClient.tsx
│   │   │   ├── ProfileClient.tsx
│   │   │   ├── ServicesClient.tsx
│   │   │   ├── SettingsClient.tsx
│   │   │   ├── Sidebar.tsx      # Admin sidebar navigation
│   │   │   └── index.ts        # Barrel export
│   │   │
│   │   └── public/             # Public website components
│   │       ├── ContactForm.tsx
│   │       ├── Footer.tsx
│   │       ├── Navbar.tsx
│   │       ├── ProductCard.tsx
│   │       ├── PromoModal.tsx
│   │       ├── ServiceCard.tsx
│   │       └── index.ts
│   │
│   ├── lib/                    # Utility libraries
│   │   ├── auth.ts             # NextAuth configuration
│   │   ├── supabase/           # Supabase clients
│   │   │   ├── admin.ts        # Admin client (server-side)
│   │   │   ├── index.ts        # Client-side client
│   │   │   └── server.ts       # Server-side client
│   │   ├── validations/        # Zod schemas
│   │   │   ├── about.ts
│   │   │   ├── contact-message.ts
│   │   │   ├── hero.ts
│   │   │   ├── index.ts
│   │   │   ├── modal-promotion.ts
│   │   │   ├── product.ts
│   │   │   ├── product-category.ts
│   │   │   ├── service.ts
│   │   │   ├── service-category.ts
│   │   │   ├── settings.ts
│   │   │   ├── social-media.ts
│   │   │   └── user.ts
│   │   └── index.ts
│   │
│   ├── types/                  # TypeScript types
│   │   └── database.types.ts   # Supabase generated types
│   │
│   └── middleware.ts           # Next.js middleware
│
├── .env                       # Environment variables
├── .env.local.example         # Example env file
├── next.config.ts             # Next.js configuration
├── package.json
├── tailwind.config.ts         # Tailwind configuration (CSS variables)
└── tsconfig.json
```

---

## Database Schema (Supabase)

### Tables

| Table                | Description                                             |
| -------------------- | ------------------------------------------------------- |
| `abouts`             | About page content (description, mission, vision, etc.) |
| `contact_messages`   | Messages from contact form                              |
| `heroes`             | Hero banner slides                                      |
| `modal_promotions`   | Promo modal popups                                      |
| `product_categories` | Product categories                                      |
| `products`           | Products listing                                        |
| `service_categories` | Service categories                                      |
| `services`           | Services listing                                        |
| `settings`           | Site settings (logo, favicon, meta, etc.)               |
| `social_media`       | Social media links                                      |
| `users`              | Admin users for authentication                          |

---

## Authentication Flow

```
┌─────────────────────────────────────────────────────────────┐
│                        USER LOGIN FLOW                       │
└─────────────────────────────────────────────────────────────┘

1. User visits /admin/login
         │
         ▼
2. Enter username & password
         │
         ▼
3. POST /api/auth/callback/credentials (NextAuth)
         │
         ▼
4. Validate against 'users' table in Supabase
   - Check username exists
   - Verify password (bcrypt.compare)
         │
         ├─── Invalid ───► Return error, show "Invalid credentials"
         │
         ▼
5. Create JWT session with user data
         │
         ▼
6. Redirect to /admin/dashboard
         │
         ▼
7. Middleware checks session for protected routes
```

### Middleware Protection

```
┌─────────────────────────────────────────────────────────────┐
│                      MIDDLEWARE FLOW                         │
└─────────────────────────────────────────────────────────────┘

Request comes in
        │
        ▼
┌───────────────────┐
│ Is /admin route?  │──No──► Allow (public route)
└───────────────────┘
        │
       Yes
        │
        ▼
┌───────────────────────────┐
│ Has valid session token?  │
└───────────────────────────┘
    │                   │
   No                   Yes
    │                   │
    ▼                   ▼
Redirect to          Allow access
/admin/login
```

---

## API Routes Architecture

### Route Handler Pattern

```
API Route: /api/[resource]/route.ts
    │
    ├── GET     → List all (with pagination/filtering)
    ├── POST    → Create new
    │
    └── /api/[resource]/[id]/route.ts
            │
            ├── GET    → Get single item
            ├── PUT    → Update item
            └── DELETE → Delete item
```

### API Endpoints

| Method | Endpoint                  | Description         |
| ------ | ------------------------- | ------------------- |
| GET    | `/api/products`           | List all products   |
| POST   | `/api/products`           | Create product      |
| GET    | `/api/products/[id]`      | Get product by ID   |
| PUT    | `/api/products/[id]`      | Update product      |
| DELETE | `/api/products/[id]`      | Delete product      |
| GET    | `/api/services`           | List all services   |
| POST   | `/api/services`           | Create service      |
| GET    | `/api/services/[id]`      | Get service by ID   |
| PUT    | `/api/services/[id]`      | Update service      |
| DELETE | `/api/services/[id]`      | Delete service      |
| GET    | `/api/messages`           | List messages       |
| GET    | `/api/messages/[id]`      | Get message         |
| PUT    | `/api/messages/[id]/read` | Mark as read        |
| GET    | `/api/settings`           | Get settings        |
| PUT    | `/api/settings`           | Update settings     |
| POST   | `/api/contact`            | Submit contact form |
| GET    | `/api/users/[id]`         | Get user profile    |
| PUT    | `/api/users/[id]`         | Update user profile |
| POST   | `/api/upload`             | Upload image        |
| GET    | `/api/auth/seed`          | Seed database       |

---

## Page Flow - Admin Dashboard

```
┌─────────────────────────────────────────────────────────────────┐
│                     ADMIN DASHBOARD FLOW                         │
└─────────────────────────────────────────────────────────────────┘

┌──────────────┐
│  /admin      │ ← Dashboard (stats overview)
└──────────────┘
        │
        ▼
┌──────────────┐     ┌──────────────┐
│  /admin/produk│ ──►│ ProductsClient │
└──────────────┘     │    - List     │
        │           │    - Add      │
        │           │    - Edit      │
        │           │    - Delete    │
        │           └──────────────┘
        │
        ▼
┌──────────────┐     ┌──────────────┐
│  /admin/layanan│ ─►│ ServicesClient│
└──────────────┘     │    - List     │
        │           │    - Add      │
        │           │    - Edit      │
        │           │    - Delete    │
        │           └──────────────┘
        │
        ▼
┌──────────────┐     ┌──────────────┐
│  /admin/pesan │ ──►│ MessagesClient │
└──────────────┘     │    - List     │
        │           │    - Read     │
        │           │    - Delete    │
        │           └──────────────┘
        │
        ▼
┌──────────────┐     ┌──────────────┐
│  /admin/about│ ►│ SettingsClient│
└──────────────┘     │    - Logo     │
        │            │    - Meta     │
        │            │    - About    │
        │            │    - Social   │
        │            └──────────────┘
        │
        ▼
┌──────────────┐     ┌──────────────┐
│  /admin/akun │ ──►│ ProfileClient │
└──────────────┘     │    - Name    │
                     │    - Username│
                     │    - Password│
                     └──────────────┘
```

---

## Component Architecture

### Reusable Components

```
┌─────────────────────────────────────────────────────────────┐
│                    CORE COMPONENTS                          │
└─────────────────────────────────────────────────────────────┘

┌─────────────────┐
│   FormDialog    │  ← Reusable modal for add/edit forms
│  ┌───────────┐  │
│  │  Header   │  │
│  ├───────────┤  │
│  │   Form    │  │  Accepts: schema, fields config, handlers
│  │   Fields  │  │
│  ├───────────┤  │
│  │  Actions  │  │
│  └───────────┘  │
└─────────────────┘

┌─────────────────┐
│   DataTable     │  ← Reusable table with sorting/pagination
│  ┌───────────┐  │
│  │  Header   │  │
│  ├───────────┤  │
│  │   Rows    │  │  Accepts: columns, data, actions
│  │   Actions │  │
│  ├───────────┤  │
│  │ Pagination│  │
│  └───────────┘  │
└─────────────────┘

┌─────────────────┐
│  ImageUploader  │  ← Drag & drop image upload with preview
│  ┌───────────┐  │
│  │   Drop    │  │
│  │   Zone    │  │
│  ├───────────┤  │
│  │  Preview  │  │
│  └───────────┘  │
└─────────────────┘
```

### Client vs Server Components

| Type              | Examples             | Pattern                                       |
| ----------------- | -------------------- | --------------------------------------------- |
| Server Components | Pages, Layouts       | `async function Page()` with direct DB access |
| Client Components | Forms, Interactivity | `'use client'` with useState/useEffect        |
| Hybrid            | ProfileClient        | Server fetches data, Client handles form      |

---

## Data Flow - CRUD Operations

```
┌─────────────────────────────────────────────────────────────┐
│                     CREATE OPERATION                          │
└─────────────────────────────────────────────────────────────┘

User clicks "Add New"
        │
        ▼
Open FormDialog (client component)
        │
        ▼
User fills form → React Hook Form validates with Zod
        │
        ├─── Validation fails ──► Show error messages
        │
        ▼
User clicks "Save"
        │
        ▼
POST /api/products (or other resource)
        │
        ▼
API Route:
  1. Auth check (session)
  2. Parse & validate body (Zod)
  3. Insert to Supabase
  4. Return success/error
        │
        ├─── Error ──► Show Swal error
        │
        ▼
FormDialog closes
        │
        ▼
Page revalidates → Fresh data displayed

┌─────────────────────────────────────────────────────────────┐
│                     UPDATE OPERATION                         │
└─────────────────────────────────────────────────────────────┘

User clicks edit icon on row
        │
        ▼
Open FormDialog with existing data (defaultValues)
        │
        ▼
User modifies form → React Hook Form validates
        │
        ▼
User clicks "Save"
        │
        ▼
PUT /api/products/[id]
        │
        ▼
Same auth + validation flow as create
        │
        ▼
Success → Refresh data, close dialog
```

---

## Form Validation Pattern

```
┌─────────────────────────────────────────────────────────────┐
│                    VALIDATION FLOW                           │
└─────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────┐
│        Zod Schema (lib/validations)   │
│  ┌────────────────────────────────┐   │
│  │ export const productSchema =   │   │
│  │   z.object({                  │   │
│  │     name: z.string().min(1),   │   │
│  │     price: z.number().min(0),  │   │
│  │     // ...more fields          │   │
│  │   })                           │   │
│  └────────────────────────────────┘   │
└──────────────────────────────────────┘
                    │
                    ▼
┌──────────────────────────────────────┐
│        React Hook Form              │
│  ┌────────────────────────────────┐  │
│  │ const form = useForm({         │  │
│  │   resolver: zodResolver(schema)│  │
│  │ })                             │  │
│  └────────────────────────────────┘  │
└──────────────────────────────────────┘
                    │
                    ▼
┌──────────────────────────────────────┐
│         Form Submit                  │
│  ┌────────────────────────────────┐  │
│  │ handleSubmit(data => {        │  │
│  │   // data is validated        │  │
│  │ })                             │  │
│  └────────────────────────────────┘  │
└──────────────────────────────────────┘
                    │
                    ▼
┌──────────────────────────────────────┐
│      API Route Validation            │
│  ┌────────────────────────────────┐  │
│  │ const parsed = schema.parse(body)│ │
│  │ // Throws if invalid           │  │
│  └────────────────────────────────┘  │
└──────────────────────────────────────┘
```

---

## Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# NextAuth
AUTH_SECRET=your_auth_secret

# Optional
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

---

## Key Features

1. **Authentication**
   - Username/password login
   - JWT session (24 hours)
   - Protected admin routes via middleware

2. **CRUD Operations**
   - Products management
   - Services management
   - Contact messages
   - Site settings

3. **Image Upload**
   - Drag & drop interface
   - Preview before upload
   - Stored in Supabase Storage

4. **Form Validation**
   - Client-side (React Hook Form + Zod)
   - Server-side (Zod)
   - Real-time error messages

5. **Responsive Design**
   - Desktop-first admin panel
   - Mobile-friendly public site
   - Consistent design system (CSS variables)

---

## Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run ESLint
npm run lint
```

---

## Notes

- Project menggunakan Next.js 16 dengan App Router dan Turbopack
- CSS variables didefinisikan di `globals.css` untuk theming
- Design system mengikuti dark theme dengan accent orange (#f2a93b)
- Semua admin routes dilindungi via middleware
- Public routes (`/admin/login`) dapat diakses tanpa auth
