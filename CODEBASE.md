# Xisaab — Codebase Documentation

> Generated: 2026-05-01  
> Repository: `Jamala12/xisaab`

---

## Overview

Xisaab (حساب, "accounts") is a multi-tenant invoicing and payment-tracking web application. Businesses register an account, then manage their customers, invoices, and payments through a React frontend backed by an ASP.NET Core REST API with a PostgreSQL database.

---

## Architecture

```
xisaab/
├── src/                         # .NET backend (Clean Architecture)
│   ├── Xisaab.Api               # ASP.NET Core Web API (entry point)
│   ├── Xisaab.Application       # DTOs (Data Transfer Objects)
│   ├── Xisaab.Domain            # Entities & Enums (no dependencies)
│   └── Xisaab.Infrastructure    # EF Core, Services, DI, Migrations
└── web/
    └── xisaab-web/              # React + TypeScript frontend (Vite)
```

**Tech stack**

| Layer | Technology |
|---|---|
| API | ASP.NET Core (.NET 9), JWT Bearer auth |
| ORM | Entity Framework Core + Npgsql (PostgreSQL) |
| Frontend | React 19, TypeScript, Vite 8 |
| Styling | Tailwind CSS v4, shadcn/ui |
| HTTP client | Axios |
| Routing | React Router v7 |

---

## Commit History

| Date | Commit | Description |
|---|---|---|
| 2026-03-14 | `c852d78` | Initial commit |
| 2026-03-14 | `0e83d08` | Scaffold — solution structure created |
| 2026-03-15 | `dbe7527` | Finished scaffolding, set up initial DB communication |
| 2026-03-15 | `f2ba2ee` | Added invoice endpoints with line items and customer reference |
| 2026-04-02 | `363cbaa` | Added payment endpoints with auto-paid status update |
| 2026-04-02 | `aa2168a` | Added `GET /customers/{id}/invoices` endpoint |
| 2026-04-02 | `bab5ea6` | Added dashboard endpoint with metrics |
| 2026-04-02 | `41bfa8e` | Authentication and JWT |
| 2026-04-03 | `bb37528` | Added `Business` entity and auto-increment `PaymentNumber` |
| 2026-04-04 | `5bd4e74` | Added seed data; added `BusinessId` to all entities (multi-tenancy) |
| 2026-04-04 | `ebee9f3` | Moved JWT secret out of source into environment |
| 2026-04-04 | `5408f18` | React prototype finished (no styling) |
| 2026-04-05 | `1bc5934` | Frontend foundation done (styled with shadcn/ui) |
| 2026-04-12 | `e6e53fb` | Edit and delete for customers, invoices, and payments |

---

## Backend — `src/`

### `Xisaab.Api`

Entry point and HTTP layer.

#### `Program.cs`

Bootstraps the application:
- Registers controllers, OpenAPI, Infrastructure services
- Adds CORS policy allowing `http://localhost:5173` (Vite dev server)
- Runs `DataSeeder.SeedAsync` on startup if the database is empty
- Configures Authentication → Authorization → Controllers pipeline

#### `appsettings.json`

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Database=xisaab;Username=postgres;Password=postgres"
  },
  "Jwt": {
    "Key": "",        // must be set via environment / secrets
    "Issuer": "xisaab-api"
  }
}
```

---

### Controllers

All controllers live at `src/Xisaab.Api/Controllers/` and are decorated with `[Authorize]` (except `AuthController`).

#### `AuthController.cs` — `POST /api/auth/register`, `POST /api/auth/login`

| Endpoint | Body | Returns |
|---|---|---|
| `POST /register` | `RegisterDto` (email, password, businessName) | `AuthResponseDto` (JWT token + email) |
| `POST /login` | `LoginDto` (email, password) | `AuthResponseDto` or `401` |

#### `CustomersController.cs` — `GET/POST/PUT/DELETE /api/customers`

| Endpoint | Auth | Description |
|---|---|---|
| `GET /customers` | ✓ | List all customers for the authenticated business |
| `POST /customers` | ✓ | Create a new customer |
| `GET /customers/{id}` | ✓ | Get a single customer |
| `GET /customers/{id}/invoices` | ✓ | Get all invoices belonging to a customer |
| `PUT /customers/{id}` | ✓ | Update name/phone/email |
| `DELETE /customers/{id}` | ✓ | Delete customer — blocked if they have invoices (`400`) |

#### `InvoicesController.cs` — `GET/POST/PUT/PATCH/DELETE /api/invoices`

| Endpoint | Auth | Description |
|---|---|---|
| `GET /invoices` | ✓ | List all invoices for the business |
| `POST /invoices` | ✓ | Create invoice with line items (status starts as `Draft`) |
| `GET /invoices/{id}` | ✓ | Get invoice detail (includes line items and payments) |
| `PATCH /invoices/{id}/status` | ✓ | Update status only (`UpdateInvoiceStatusDto`) |
| `PUT /invoices/{id}` | ✓ | Full update of dates/notes/line items — blocked if payments exist |
| `DELETE /invoices/{id}` | ✓ | Delete invoice — blocked if payments exist |

#### `PaymentsController.cs` — `GET/POST/DELETE /api/payments`

| Endpoint | Auth | Description |
|---|---|---|
| `GET /payments` | ✓ | List all payments for the business |
| `POST /payments` | ✓ | Record a payment against an invoice |
| `GET /payments/{id}` | ✓ | Get a single payment |
| `DELETE /payments/{id}` | ✓ | Delete a payment (reverts invoice status to `Draft` if it was `Paid`) |

#### `DashboardController.cs` — `GET /api/dashboard`

| Endpoint | Auth | Description |
|---|---|---|
| `GET /dashboard` | ✓ | Returns aggregated metrics for the authenticated business |

---

### `Xisaab.Domain`

Pure domain layer — no external dependencies.

#### Entities (`src/Xisaab.Domain/Entities/`)

| File | Entity | Key Fields |
|---|---|---|
| `Business.cs` | `Business` | `Id`, `Name`, `BusinessNumber` (auto-inc), `Email`, `CreatedAt`, `Tier` |
| `User.cs` | `User` | `Id`, `Email`, `PasswordHash`, `CreatedAt`, `BusinessId` (FK) |
| `Customer.cs` | `Customer` | `Id`, `CustomerNumber` (auto-inc), `Name`, `Phone`, `Email`, `CreatedAt`, `BusinessId` (FK) |
| `Invoice.cs` | `Invoice` | `Id`, `InvoiceNumber` (auto-inc), `CustomerId`, `BusinessId`, `IssueDate`, `DueDate`, `Status`, `Notes`; computed: `AmountPaid`, `AmountDue`, `IsFullyPaid` |
| `InvoiceLineItem.cs` | `InvoiceLineItem` | `Id`, `InvoiceId`, `Description`, `Quantity`, `UnitPrice`; computed: `Total` |
| `Payment.cs` | `Payment` | `Id`, `PaymentNumber` (auto-inc), `InvoiceId`, `BusinessId`, `Amount`, `PaidAt`, `PaymentMethod`, `Notes` |

#### Enums (`src/Xisaab.Domain/Enums/`)

| File | Enum | Values |
|---|---|---|
| `BusinessTier.cs` | `BusinessTier` | `Free`, `Basic`, `Pro`, `Enterprise` |
| `InvoiceStatus.cs` | `InvoiceStatus` | `Draft`, `Sent`, `PartiallyPaid`, `Paid`, `Overdue` |
| `PaymentMethod.cs` | `PaymentMethod` | `Cash`, `BankTransfer`, `Cheque`, `Zaad` |
| `ServiceResult.cs` | `ServiceResult` | `Success`, `NotFound`, `Blocked` |

---

### `Xisaab.Application`

Holds only DTOs — no business logic.

#### DTOs (`src/Xisaab.Application/DTOs/`)

| File | DTOs |
|---|---|
| `AuthResponseDto.cs` | `AuthResponseDto` — token + email returned on login/register |
| `LoginDto.cs` | `LoginDto` — email + password |
| `RegisterDto.cs` | `RegisterDto` — email + password + businessName |
| `CustomerDto.cs` | `CustomerDto` (read), `CreateCustomerDto` (write) |
| `UpdateCustomerDto.cs` | `UpdateCustomerDto` — name, phone, email |
| `InvoiceDto.cs` | `InvoiceDto` (list view), `CreateInvoiceDto` (with line items) |
| `InvoiceDetailDto.cs` | `InvoiceDetailDto` — full invoice with `LineItems[]` and `Payments[]` |
| `InvoiceLineItemDto.cs` | `InvoiceLineItemDto` (read), `CreateInvoiceLineItemDto` (write) |
| `UpdateInvoiceDto.cs` | `UpdateInvoiceDto` — issueDate, dueDate, notes, items list |
| `UpdateInvoiceItemDto.cs` | `UpdateLineItemDto` — description, quantity, unitPrice |
| `UpdateInvoiceStatusDto.cs` | `UpdateInvoiceStatusDto` — status string |
| `InvoicePaymentDto.cs` | `InvoicePaymentDto` — payment summary nested inside invoice detail |
| `PaymentDto.cs` | `PaymentDto` (read), `CreatePaymentDto` (write) |
| `DashboardDto.cs` | `DashboardDto` — all dashboard aggregates + recent invoices list |

---

### `Xisaab.Infrastructure`

#### `DependencyInjection.cs`

Extension method `AddInfrastructure()` called from `Program.cs`:
- Registers `AppDbContext` with Npgsql PostgreSQL provider
- Registers all scoped services: `CustomerService`, `InvoiceService`, `PaymentService`, `DashboardService`, `AuthServices`, `CurrentUserService`
- Adds `IHttpContextAccessor`
- Configures JWT Bearer authentication (validates issuer, audience, lifetime, signing key)

#### `Persistence/AppDbContext.cs`

EF Core `DbContext` with DbSets:

```csharp
DbSet<Customer>         Customers
DbSet<Invoice>          Invoices
DbSet<InvoiceLineItem>  InvoiceLineItems
DbSet<Payment>          Payments
DbSet<User>             Users
DbSet<Business>         Businesses
```

`OnModelCreating` configures auto-increment (`ValueGeneratedOnAdd`) for:
- `Customer.CustomerNumber`
- `Invoice.InvoiceNumber`
- `Business.BusinessNumber`
- `Payment.PaymentNumber`

#### `Persistence/DataSeeder.cs`

`SeedAsync(AppDbContext db)` — runs on every startup. If any `Business` row exists, it exits early. Otherwise seeds:
- Business: **Demo Trading Co** (`demo@xisaab.com`)
- User: `demo@xisaab.com` / `hamse123`
- Customers: Ahmed Ali, Faadumo Hassan, Ali Jama
- Invoices: 4 invoices across all three customers in various statuses (Sent, Overdue, Draft, Paid)
- Payments: 1 payment of $200 against the Paid invoice

#### Services (`src/Xisaab.Infrastructure/Services/`)

---

**`AuthServices.cs`**

| Method | Description |
|---|---|
| `RegisterAsync(RegisterDto)` | Creates a new `Business` (tier: Free) and `User` with BCrypt-hashed password; returns JWT |
| `LoginAsync(LoginDto)` | Verifies password hash; returns JWT or throws |
| `GenerateToken(User)` | Creates 8-hour HS256 JWT with claims: `NameIdentifier`, `Email`, `BusinessId` |

---

**`CurrentUserService.cs`**

Reads the `BusinessId` claim from the current HTTP context. Injected into every service to enforce tenant isolation.

---

**`CustomerService.cs`**

All queries are scoped by `_currentUser.BusinessId`.

| Method | Description |
|---|---|
| `GetAllAsync()` | Returns `List<CustomerDto>` formatted as `CUS-{number}` |
| `CreateAsync(CreateCustomerDto)` | Creates and returns new customer |
| `GetByIdAsync(Guid)` | Returns single `CustomerDto` or null |
| `GetAllInvoicesForCustomerAsync(Guid)` | Returns invoices for a specific customer |
| `UpdateAsync(Guid, UpdateCustomerDto)` | Updates name/phone/email; returns `NotFound` or `Success` |
| `DeleteAsync(Guid)` | Deletes customer; returns `Blocked` if invoices exist, else `Success` |

---

**`InvoiceService.cs`**

| Method | Description |
|---|---|
| `GetAllAsync()` | Returns all invoices as `List<InvoiceDto>` |
| `CreateAsync(CreateInvoiceDto)` | Creates invoice with nested line items; initial status is `Draft` |
| `GetByIdAsync(Guid)` | Returns `InvoiceDetailDto` with line items and payments |
| `UpdateStatusAsync(Guid, string)` | Parses string to `InvoiceStatus` enum and saves |
| `UpdateInvoiceAsync(Guid, UpdateInvoiceDto)` | Replaces all line items; blocked if any payments exist |
| `DeleteAsync(Guid)` | Deletes invoice and its line items; blocked if any payments exist |

---

**`PaymentService.cs`**

| Method | Description |
|---|---|
| `GetAllAsync()` | Returns all payments as `List<PaymentDto>` |
| `CreateAsync(CreatePaymentDto)` | Records payment; automatically sets invoice status to `Paid` if `IsFullyPaid` |
| `GetByIdAsync(Guid)` | Returns single `PaymentDto` or null |
| `DeleteAsync(Guid)` | Deletes payment; reverts invoice from `Paid` → `Draft` if it is no longer fully paid |

---

**`DashboardService.cs`**

`GetDashboardAsync()` returns `DashboardDto` with:
- `TotalCustomers` — count of business's customers
- `TotalInvoices` — invoices issued in the last 30 days
- `TotalDraftInvoices` / `TotalSentInvoices` / `TotalOverdueInvoices` — all-time counts by status
- `TotalAmountPaid` — sum of payments received in the last 30 days
- `TotalAmountOverdue` — sum of line item totals on `Overdue` invoices
- `RecentInvoices` — 5 most recent invoices ordered by `IssueDate` descending

---

### Database Migrations

Located at `src/Xisaab.Infrastructure/Migrations/`

| Migration | Date | Changes |
|---|---|---|
| `20260315003651_InitialCreate` | 2026-03-15 | Creates `Customers`, `Invoices`, `InvoiceLineItems`, `Payments` tables |
| `20260315115006_AddCustomerNumber` | 2026-03-15 | Drops text `InvoiceNumber`; adds auto-increment int `InvoiceNumber`; adds auto-increment int `CustomerNumber` |
| `20260402192947_AddUsers` | 2026-04-02 | Creates `Users` table (Id, Email, PasswordHash, CreatedAt) |
| `20260403103534_AddBusinessMultiTenancy` | 2026-04-03 | Creates `Businesses` table; adds `BusinessId` FK to Users, Payments, Invoices, Customers; adds auto-increment `PaymentNumber` |

---

## Frontend — `web/xisaab-web/`

React 19 + TypeScript SPA. Dev server runs on port `5173`; talks to API at `http://localhost:5298/api`.

### Entry Point

**`src/main.tsx`** — Wraps the app in:
```
StrictMode > BrowserRouter > AuthProvider > TooltipProvider > App
```

**`src/App.tsx`** — Defines all routes. Protected routes wrap content with `<Navbar />` in a sidebar layout (`ml-56`).

### Routes

| Path | Component | Protected |
|---|---|---|
| `/login` | `LoginPage` | No |
| `/register` | `RegisterPage` | No |
| `/` | Redirects to `/dashboard` | — |
| `/dashboard` | `DashboardPage` | Yes |
| `/customers` | `CustomersPage` | Yes |
| `/customers/new` | `NewCustomerPage` | Yes |
| `/customers/:id` | `DetailedCustomerPage` | Yes |
| `/customers/:id/edit` | `EditCustomerPage` | Yes |
| `/invoices` | `InvoicesPage` | Yes |
| `/invoices/new` | `NewInvoicePage` | Yes |
| `/invoices/:id` | `DetailedInvoicePage` | Yes |
| `/invoices/:id/edit` | `EditInvoicePage` | Yes |
| `/invoices/:id/payment` | `RecordPaymentPage` | Yes |
| `/payments` | `PaymentsPage` | Yes |
| `*` | `NotFoundPage` | No |

---

### Auth (`src/context/AuthContext.tsx`)

React context (`AuthContext`) that:
- Reads/writes `token` and `email` to `localStorage`
- Exposes `login(token, email)`, `logout()`, `isAuthenticated`
- Used by `ProtectedRoute` to guard pages

**`src/components/ProtectedRoute.tsx`** — Redirects to `/login` (with `state.from`) if not authenticated.

---

### API Client (`src/api/client.ts`)

Axios instance with base URL `http://localhost:5298/api`.

- **Request interceptor** — attaches `Authorization: Bearer <token>` header from `localStorage`
- **Response interceptor** — on `401` (non-auth endpoints) clears storage and redirects to `/login`

---

### API Modules (`src/api/`)

| File | Functions |
|---|---|
| `auth.ts` | `login(email, password)`, `register(email, password, businessName)` |
| `customers.ts` | `getCustomers()`, `getCustomer(id)`, `createCustomer(data)`, `updateCustomer(id, data)`, `deleteCustomer(id)` |
| `invoices.ts` | `getInvoices()`, `getInvoice(id)`, `createInvoice(data)`, `updateInvoiceStatus(id, status)`, `updateInvoice(id, data)`, `deleteInvoice(id)` |
| `payments.ts` | `getPayments()`, `createPayment(data)`, `deletePayment(id)` |
| `dashboard.ts` | `getDashboard()` |

---

### TypeScript Types (`src/types/index.ts`)

| Interface | Fields |
|---|---|
| `Customer` | id, customerNumber, name, phone?, email?, createdAt |
| `Invoice` | id, customerId, invoiceNumber, customerName, customerNumber, issueDate, dueDate, total, status, notes?, lineItems?, payments? |
| `InvoiceLineItem` | id, description, quantity, unitPrice, total |
| `InvoicePayment` | id, paymentNumber, amount, paymentDate, paymentMethod, notes? |
| `Payment` | id, invoiceId, paymentNumber, invoiceNumber, customerName, customerNumber, amount, paymentDate, paymentMethod, notes? |
| `AuthResponse` | token, email |
| `DashboardData` | totalCustomers, totalInvoices, totalDraftInvoices, totalSentInvoices, totalOverdueInvoices, totalAmountPaid, totalAmountOverdue, recentInvoices |

---

### Pages (`src/pages/`)

| File | Description |
|---|---|
| `LoginPage.tsx` | Email/password form; calls `login()`, stores token, navigates to `state.from` or `/dashboard` |
| `RegisterPage.tsx` | Email/password/businessName form; calls `register()`, stores token, navigates to `/dashboard` |
| `DashboardPage.tsx` | 4 stat cards (Customers, Invoices breakdown, Paid 30d, Overdue) + recent invoices table |
| `CustomersPage.tsx` | Paginated table of customers with link to detail page; New Customer button |
| `NewCustomerPage.tsx` | Form to create a customer; redirects to customer detail on success |
| `DetailedCustomerPage.tsx` | Customer info cards (email, phone, outstanding balance) + invoices table; Edit and Delete buttons (delete is guarded with `AlertDialog`) |
| `EditCustomerPage.tsx` | Pre-filled form to update customer name/phone/email |
| `InvoicesPage.tsx` | Table of all invoices with status badges; New Invoice button |
| `NewInvoicePage.tsx` | Form with customer selector, due date, notes, and dynamic line-items rows; pre-fills `customerId` from query param |
| `DetailedInvoicePage.tsx` | Invoice header + status selector + line items table with totals footer + payments table; Record Payment and Edit buttons; delete guarded by `AlertDialog` |
| `EditInvoicePage.tsx` | Pre-filled form to update invoice dates, notes, and line items; blocked if payments exist (API enforces) |
| `RecordPaymentPage.tsx` | Form with amount, date, payment method (Cash/BankTransfer/Cheque/Zaad), notes; pre-fills invoice from URL param |
| `PaymentsPage.tsx` | Table of all payments across the business with delete capability |
| `NotFoundPage.tsx` | 404 page with back-to-dashboard link |

---

### Components

| File | Description |
|---|---|
| `components/Navbar.tsx` | Fixed left sidebar (256px); links to Dashboard, Customers, Invoices, Payments; shows logged-in email; Logout button |
| `components/ProtectedRoute.tsx` | Redirects unauthenticated users to `/login` |
| `components/ui/` | shadcn/ui primitives: `alert-dialog`, `badge`, `button`, `card`, `input`, `label`, `select`, `separator`, `sheet`, `sidebar`, `skeleton`, `table`, `tooltip` |

### Hooks & Utilities

| File | Description |
|---|---|
| `src/hooks/use-mobile.ts` | `useIsMobile()` — returns `true` when viewport < 768px |
| `src/lib/utils.ts` | `cn(...inputs)` — merges Tailwind class names using `clsx` + `tailwind-merge` |

---

### Frontend Dependencies

| Package | Version | Purpose |
|---|---|---|
| `react` | ^19.2.4 | UI framework |
| `react-router-dom` | ^7.14.0 | Client-side routing |
| `axios` | ^1.14.0 | HTTP client |
| `tailwindcss` | ^4.2.2 | Utility-first CSS |
| `shadcn` | ^4.1.2 | Component library |
| `lucide-react` | ^1.7.0 | Icons |
| `radix-ui` | ^1.4.3 | Accessible UI primitives |
| `clsx` + `tailwind-merge` | latest | Class name utilities |
| `vite` | ^8.0.1 | Build tool / dev server |
| `typescript` | ~5.9.3 | Type safety |

---

## Key Business Rules

1. **Multi-tenancy** — every DB record carries a `BusinessId`. All service queries filter by the current user's `BusinessId` (from JWT claim). Users never see another business's data.

2. **Invoice creation** — new invoices always start in `Draft` status. Status can be manually changed via `PATCH /invoices/{id}/status`.

3. **Auto-paid logic** — when a payment is recorded, if the sum of all payments equals or exceeds the invoice total (`IsFullyPaid`), the invoice status is automatically set to `Paid`.

4. **Payment reversal** — if the only payment on a `Paid` invoice is deleted, the invoice reverts to `Draft`.

5. **Delete protection** — a Customer cannot be deleted if it has any invoices. An Invoice cannot be deleted or edited if it has any payments.

6. **Auto-increment numbers** — `CustomerNumber`, `InvoiceNumber`, `PaymentNumber`, and `BusinessNumber` are all DB-generated identity columns. They are displayed with prefixes: `CUS-`, `INV-`, `PAY-`.

7. **JWT** — tokens are valid for 8 hours. The signing key must be provided via environment variable / secrets (not committed to source).

---

## Running Locally

**Backend**
```bash
# Requires PostgreSQL running on localhost:5432
# Set JWT key via environment or dotnet user-secrets
cd src/Xisaab.Api
dotnet run
# API runs on http://localhost:5298
```

**Frontend**
```bash
cd web/xisaab-web
npm install
npm run dev
# Dev server on http://localhost:5173
```

**Demo credentials** (seeded automatically on first run)
```
Email:    demo@xisaab.com
Password: hamse123
```
