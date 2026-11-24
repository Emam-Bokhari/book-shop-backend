# Case Study: Borno Bihar - Full-Stack Architecture, Catalog Exploration, and Hosted Payment Integration for an Online Bookstore

---

## 1. Project Overview

Borno Bihar is a full-stack e-commerce platform designed for catalog browsing, academic book distribution, and multi-item order fulfillment. The platform addresses specific retail and operational challenges in regional digital commerce: managing complex literary taxonomies, maintaining persistent client state across shopping sessions, calculating authoritative server-side pricing, and orchestrating hosted transaction lifecycles through regional payment infrastructure.

The system combines a Next.js App Router client with a layered Express and TypeScript backend service. The application coordinates the entire purchasing lifecycle: server-side catalog caching, client-side cart persistence, pre-checkout stock verification, SSLCommerz hosted gateway handshakes, and database-level aggregation reporting for store administration.

- **Role:** Full-Stack Software Engineer (Frontend & Backend Architecture)
- **Application Type:** Decoupled Full-Stack Web Application (Server-Rendered Client + Modular REST API)
- **Frontend Repository:** [BornoBihar-Frontend](https://github.com/Emam-Bokhari/BornoBihar-Frontend)
- **Backend Repository:** [BornoBihar-Backend](https://github.com/Emam-Bokhari/bornobihar-backend)
- **Live Client Application:** [borno-bihar-frontend-umber.vercel.app](https://borno-bihar-frontend-umber.vercel.app)
- **Live API Endpoint:** [book-shop-backend-alpha-red.vercel.app/api/v1](https://book-shop-backend-alpha-red.vercel.app/api/v1)

---

## 2. Project Information and Technology Stack

### Frontend Engineering Stack

- **Framework (Next.js 15 - App Router):** Employs React Server Components for server-side rendering, layout nesting, and Server Actions for data mutation pipelines.
- **Language (TypeScript 5):** Provides static typing across UI components, Server Action contracts, Redux slices, and API data transfer objects.
- **State Management (Redux Toolkit & Redux Persist):** Manages local client state for the cart and wishlist, synchronizing shopping session data with browser storage.
- **UI Primitives & Styling (Radix UI & Tailwind CSS v4):** Implements accessible headless primitives (Dialog, Dropdown Menu, Popover, Select, Tabs) styled with Tailwind design tokens via `class-variance-authority` and `tailwind-merge`.
- **Data Tables (TanStack Table v8):** Powers administrative inventory and order management views with client-side sorting, column filtering, pagination controls, and column visibility toggles.
- **Forms & Validation (React Hook Form & Zod):** Manages form state, controlled inputs, and validation schemas for authentication, checkout shipping addresses, and catalog management.
- **Data Visualization (Recharts):** Renders analytical dashboards for store administrators, displaying monthly revenue trends, category sales distributions, and order status breakdowns.
- **Feedback & Utilities (Sonner, Lucide React, date-fns, moment-timezone):** Delivers toast notifications, standard iconography, and consistent date formatting across administrative and user dashboards.

### Backend Engineering Stack

- **Runtime Environment (Node.js 22 LTS):** Executes asynchronous server processes with long-term stability and modern ECMAScript standard support.
- **Server Framework (Express.js 4):** Structures application routing, middleware execution pipelines, and centralized error handling.
- **Language (TypeScript 5):** Enforces end-to-end interface contracts across data models, service methods, and controller handlers.
- **Database & ODM (MongoDB & Mongoose 8):** Persists application data using schema definitions, pre-save cryptographic hooks, static model methods, and aggregation pipelines.
- **Request Validation (Zod 3):** Validates incoming HTTP payloads at the middleware boundary before requests reach business logic layers.
- **Authentication & Cryptography (JWT & bcrypt):** Issues signed JSON Web Tokens containing user identities and roles; hashes passwords using 12 salt rounds.
- **Payment Processing (SSLCommerz LTS):** Handles hosted payment session initialization, customer payload mapping, and transaction callback verification.
- **Utilities (CORS, Cookie Parser, Dotenv):** Configures cross-origin resource sharing, parses HTTP request cookies, and loads typed environment variables.

---

## 3. Project Background and Objectives

Regional e-commerce platforms in South Asia encounter specific technical hurdles. Payment infrastructure often relies on hosted redirect flows rather than embedded client-side SDKs, introducing state management boundaries between checkout initiation and gateway return callbacks. Additionally, multi-category book catalogs require flexible multi-criteria search, sorting, and filtering without triggering heavy server loads or writing repetitive query logic across endpoints.

To address these requirements, the project was engineered around four key technical objectives:

1. **Decoupled Architecture with Strict Layer Separation:** Maintain a clear boundary between presentation, routing, application business logic, and database operations.
2. **End-to-End Type Safety and Schema Integrity:** Share consistent schema contracts across frontend forms, server action invocations, API middleware guards, and Mongoose document models.
3. **Deterministic Order and Payment Lifecycle Management:** Verify product stock, recalculate order totals from database pricing to eliminate client-side tampering, and manage payment gateway initialization sessions.
4. **Database-Engine Analytical Reporting:** Offload all administrative metrics, monthly sales curves, and inventory status calculations to MongoDB aggregation pipelines instead of performing calculations in application memory.

---

## 4. Application Architecture

The platform uses a decoupled client-server architecture. The frontend application runs on Next.js 15 using Server Components, Edge Middleware, and Server Actions. The backend operates as a five-layer modular Express monolith interacting with MongoDB Atlas and the SSLCommerz gateway.

```text
[ Client Browser ]
        |
        v
[ Next.js 15 App Router (Vercel Edge & Server) ]
   |-- Edge Middleware (JWT Cookie Validation & Route Guards)
   |-- React Server Components (Tag-Based Data Fetching & Caching)
   |-- Server Actions / Services (HTTP-Only Cookie Injection)
   `-- Client Slices (Redux Persist for Cart & Wishlist)
        |
        | HTTPS / REST
        v
[ Express.js Modular Backend (Vercel Serverless) ]
   |-- Routing Layer (src/app/routes/index.ts)
   |-- Middleware Pipeline (auth.ts, validateRequestSchema.ts)
   |-- Controller Handlers (Request/Response Normalization)
   |-- Service Layer (QueryBuilder, Business Logic, Gateway Sessions)
   `-- Data Layer (Mongoose Models & Schema Hooks)
        |
        +-----------------------------------+
        |                                   |
        v                                   v
[ MongoDB Atlas Database ]       [ SSLCommerz Payment Gateway ]
 (Collections & Aggregations)      (Hosted Checkout Sessions)
```

### Architectural Tiers

- **Client Presentation Tier (Next.js 15):** Handles route evaluation, server-rendered page composition, client state persistence, and responsive UI rendering. Protected routes are evaluated at the edge using Next.js Middleware.
- **Application Processing Tier (Express.js):** Executes within Node.js, organizing features into domain modules (Auth, User, Product, Order, Analytics, Support, Blog). Every request passes through authentication guards, schema validators, controller delegations, and service logic.
- **Data and Gateway Integration Tier (MongoDB & SSLCommerz):** Stores document collections with index constraints. Analytical queries execute directly in the database engine via aggregation pipelines. The external SSLCommerz API creates hosted checkout sessions and issues redirect targets.

### End-to-End Request and Data Flow

1. **User Action:** The customer configures an order in the Redux-backed shopping cart and clicks checkout.
2. **Edge Route Guard:** Next.js Edge Middleware inspects the incoming request cookies for a valid `accessToken`. If valid, it decodes the payload with `jwt-decode` to verify the `user` role; otherwise, it redirects the browser to `/login`.
3. **Server Action Dispatch:** The checkout form submits shipping details and cart item tuples (`productId`, `quantity`) to the Next.js `addOrder` Server Action.
4. **API Boundary Request:** The Server Action attaches the authentication token to the HTTP `Authorization` header and sends a `POST` request to `/api/v1/orders`.
5. **Request Validation:** The backend `validateRequestSchema` middleware parses the request body against `orderValidationSchema` using Zod, rejecting invalid payloads with formatted 400 responses.
6. **Authentication & Identity Verification:** The `auth` middleware verifies the JWT, checks that the user exists in MongoDB, and confirms the account is neither soft-deleted (`isDeleted: false`) nor suspended (`status !== 'banned'`).
7. **Business Logic Execution:** The `OrderService` verifies item availability, computes total pricing using prices stored in the database, generates a transaction ID, initiates an SSLCommerz gateway session, creates the order document, and decrements catalog stock.
8. **Normalized Response & Redirection:** The server returns a standardized JSON envelope containing the order details and the gateway URL. The client receives the response, clears the persisted Redux cart, and redirects the user's browser to the hosted SSLCommerz payment portal.

---

## 5. Frontend Development and Implementation

### Route Organization and Layout Hierarchy

The client application uses Next.js 15 App Router Route Groups to separate layout hierarchies and avoid unnecessary re-renders across public, customer, and administrative views:

```text
src/app/
|-- (WithCommonLayout)/           # Public e-commerce layout (Header, Nav, Footer)
|   |-- (home)/page.tsx           # Home landing page with promotional carousels
|   |-- books/                    # Catalog browsing with faceted filters
|   |   |-- [id]/page.tsx         # Product detail view
|   |   `-- page.tsx              # Paginated catalog view
|   |-- cart/page.tsx             # Shopping cart view
|   |-- checkout/page.tsx         # Multi-field checkout form
|   |-- blogs/                    # Editorial content
|   `-- layout.tsx                # Common layout wrapper
|-- (WithDashboardLayout)/        # Authenticated dashboard layout (Sidebar, Metrics)
|   |-- admin/dashboard/          # Administrative console
|   |   |-- analytics/            # Recharts analytics dashboards
|   |   |-- products/             # TanStack inventory management tables
|   |   |-- orders/               # Order status administration
|   |   `-- users/                # Customer account administration
|   |-- user/dashboard/           # Customer portal
|   |   |-- orders/               # Personal order history
|   |   `-- profile/              # Account details
|   `-- layout.tsx                # Dashboard navigation frame
|-- login/page.tsx                # Authentication entrypoint
|-- register/page.tsx             # Account registration entrypoint
`-- middleware.ts                 # Edge middleware for role-based route guards
```

### Authentication State and Route Protection

Authentication state is maintained through JWT tokens stored in browser cookies. Route protection operates at two levels: edge evaluation via Next.js Middleware and runtime evaluation within Server Actions. The middleware decodes the token with `jwt-decode`, validates role-based permissions against configured route patterns, and immediately redirects unauthenticated or unauthorized users before any server rendering occurs.

When users log in, the `loginUser` Server Action sets the `accessToken` in the cookie store. Server Actions that interact with protected backend endpoints retrieve this token using `cookies().get("accessToken")` and forward it in the `Authorization` header.

### State Management and Client Caching

The application coordinates two distinct state lifecycles:

1. **Transient and Persisted Client State (Redux Toolkit & Redux Persist):** Shopping cart items and wishlist selections are tracked in Redux slices. Using `redux-persist` with local storage engines, cart contents remain preserved across page reloads and browser restarts without requiring database writes for unauthenticated visitors.
2. **Server-Side Data Caching and Invalidation (Next.js Cache Tags):** Catalog and dashboard queries leverage Next.js cached fetches tagged with domain keys (`PRODUCT`, `ORDER`, `ANALYTICS`). When administrative mutations execute (such as `addProduct`, `updateProductById`, or `addOrder`), the server actions invoke `revalidateTag("PRODUCT")` or `revalidateTag("ORDER")` to purge stale cached pages on-demand.

### Complex UI Components

- **TanStack Table Administrative Views:** The product management console (`ManageProducts`) uses `@tanstack/react-table` v8. The table supports multi-column sorting, case-insensitive text filtering on book titles, dynamic column visibility controls via a Radix Dropdown Menu, and client-side pagination with the reusable `DataTablePagination` component.
- **Zod-Validated Form Orchestration:** The checkout workflow integrates `react-hook-form` with `@hookform/resolvers/zod`. The form tracks customer contact details, address strings, postal codes, and city inputs, preventing invalid submissions before triggering server requests.
- **Analytical Recharts Dashboard:** The administrative overview dashboard (`AdminDashboard`) fetches analytics data on the server using `Promise.all` across six parallel endpoints. The data feeds into responsive Recharts components, including `MonthlySalesTrendChart` (Area/Line chart), `OrderStatusDonutChart` (Pie chart), and `CategorySalesBarChart` (Bar chart).

---

## 6. Backend Development and Implementation

### Architecture Organization

The backend service follows a five-layer modular monolith structure. Domain concerns are grouped inside isolated modules within `src/app/modules/`:

```text
src/app/
|-- builder/
|   `-- QueryBuilder.ts           # Reusable search, filter, sort, paginate utility
|-- config/
|   `-- index.ts                  # Centralized typed environment variables
|-- errors/
|   |-- handleCastError.ts        # Mongoose CastError formatter
|   |-- handleDuplicateError.ts   # MongoDB E11000 duplicate key formatter
|   |-- handleValidationError.ts  # Mongoose schema validation error formatter
|   |-- handleZodValidationError.ts # Zod validation error formatter
|   `-- HttpError.ts              # Custom application error class
|-- middlewares/
|   |-- auth.ts                   # JWT verification and RBAC middleware
|   |-- globalErrorHandler.ts     # Centralized error formatting middleware
|   |-- notFound.ts               # Catch-all 404 handler
|   `-- validateRequestSchema.ts  # Zod schema validation middleware
|-- modules/                      # Domain feature modules
|   |-- Analytics/                # Aggregation queries for sales and inventory
|   |-- Auth/                     # Registration, login, password comparison
|   |-- Order/                    # Order creation, validation, SSLCommerz service
|   |-- Payment/                  # Gateway callback routes and redirects
|   |-- Product/                  # Inventory schema, queries, mutations
|   `-- User/                     # User profile, role assignments, account status
`-- server.ts                     # Database connection initialization and listener
```

Every incoming request traverses a defined series of architectural boundaries:

$$\text{HTTP Request} \longrightarrow \text{Route Definition} \longrightarrow \text{Auth/Validation Middleware} \longrightarrow \text{Controller Handler} \longrightarrow \text{Service Logic} \longrightarrow \text{Mongoose Model} \longrightarrow \text{MongoDB}$$

### Database Schema Design and Entity Relationships

The data model uses normalized Mongoose schemas with explicit relationship references (`ObjectId`):

| Entity | Primary Key / Indexing | Key Fields & Associations | Description |
| :--- | :--- | :--- | :--- |
| **User** | `_id`, Unique `email` | `name`, `password` (hashed), `role` (`admin` \| `user`), `status` (`in-progress` \| `banned`), `isDeleted` | Represents customer and administrator credentials, maintaining authorization flags and soft-delete markers. |
| **Product** | `_id`, `category`, `title` (text) | `title`, `author`, `price`, `category` (26 taxonomies), `quantity`, `inStock`, `images`, `isDeleted` | Catalog entries representing books, tracking available inventory units and categorization metadata. |
| **Order** | `_id`, `transactionId` | `userId` (ref: `User`), `products` (`productId`, `quantity`), `totalAmount`, `status`, `paymentStatus`, `shippingAddressDetails` | Records customer orders, embedding snapshot shipping data and referencing purchased product records. |
| **Support / Contact** | `_id`, `userId` | `userId` (ref: `User`), `subject`, `message`, `status` (`pending` \| `resolved`) | Captures user inquiries and customer support communication tickets. |

```text
  +-------------------+              +-------------------------+
  |       User        |              |         Product         |
  +-------------------+              +-------------------------+
  | _id (PK)          |              | _id (PK)                |
  | email (Unique)    |              | title                   |
  | role              |              | price                   |
  | status            |              | quantity                |
  +---------+---------+              +------------+------------+
            | 1                                   | 1
            |                                     |
            | N                                   | N
  +---------v-------------------------------------v------------+
  |                           Order                            |
  +------------------------------------------------------------+
  | _id (PK)                                                   |
  | userId (FK -> User._id)                                    |
  | transactionId (Indexed)                                    |
  | products: [ { productId (FK -> Product._id), quantity } ]  |
  | totalAmount                                                |
  | paymentStatus ('pending' | 'paid' | 'failed')              |
  | status ('pending' | 'processing' | 'delivered')            |
  | shippingAddressDetails: { name, address, phone, city }     |
  +------------------------------------------------------------+
```

---

## 7. Key Features and Functionalities

### 1. High-Performance Catalog Search and Filtering Pipeline

The product catalog spans 26 literary categories. To support search, category selection, price ranges, and sorting without writing duplicate query logic across controllers, the backend implements a generic `QueryBuilder` class. It dynamically constructs Mongoose queries by chaining methods for case-insensitive partial text searching across specified fields, filtering attributes while stripping pagination keywords, applying dynamic sorting criteria, handling skip-and-limit pagination, and calculating total document and page counts for client-side pagination controls.

The frontend `SidebarFilter` component coordinates with this query engine by binding checkbox selections, availability toggles, and dual-range price sliders directly to catalog query parameters.

### 2. Administrative Operations and Database-Engine Analytics

Rather than reading large collections into Node.js application memory to compute business metrics, the administrative reporting module runs calculations directly inside MongoDB using native aggregation pipelines:

- **Category Revenue Distribution:** Unwinds the `products` array on order records, executes a `$lookup` join against the `products` collection, and groups by `category` to calculate total units sold and gross sales figures.
- **Monthly Revenue Growth:** Aggregates order timestamps using `$year` and `$month` operators to group transaction values chronologically.
- **Top-Selling Books:** Groups orders by `productId`, calculates total units sold, sorts by sales volume descending, limits to the top 10 results, and joins book metadata.
- **Low-Stock Inventory Alerts:** Queries the catalog collection for books with available stock at or below a set threshold (`quantity <= 10`), flagging items that require restocking.

### 3. Multi-Item Checkout and Hosted Payment Gateway Lifecycle

The order placement and payment workflow coordinates frontend state, server-side data validation, and third-party gateway redirection:

```text
[ Browser / Redux Cart ]
         |
         | 1. Submit Form (Products Array & Address)
         v
[ Next.js Server Action: addOrder ]
         |
         | 2. Forward Payload with Bearer Token
         v
[ Backend: Order.route -> auth -> validateRequestSchema ]
         |
         | 3. Validate User Status (Active, Unbanned)
         v
[ OrderService.createOrder ]
         |
         |-- 4. Query Database Prices & Verify Inventory (Product.find)
         |-- 5. Calculate Total Amount & Generate Transaction ID
         |-- 6. Initialize SSLCommerz Gateway Session (SSLCommerzPayment.init)
         |-- 7. Insert Order Document (Status: 'pending')
         `-- 8. Decrement Catalog Stock ($inc: { quantity: -qty })
         |
         | 9. Return JSON Envelope with Gateway URL
         v
[ Client Browser ]
         |
         | 10. Clear Cart & Redirect Browser Window (window.location.href)
         v
[ Hosted SSLCommerz Payment Portal ]
```

- **Step 1:** The user reviews their persisted Redux cart and submits the shipping address form.
- **Step 2:** The `addOrder` Server Action gathers the items, extracts the user's `accessToken` from cookies, and sends the request to `/orders`.
- **Step 3:** The backend `auth` middleware verifies the JWT signature and confirms the user account is active and not banned.
- **Step 4:** The service layer extracts all `productId` references and queries MongoDB using `$in` to verify current catalog stock and availability.
- **Step 5:** The server computes the authoritative `totalAmount` by multiplying database prices by the requested quantities, ignoring any price figures submitted by the client.
- **Step 6:** A transaction identifier (`generateTransactionId()`) is created. The server calls `SSLCommerzPayment.init` with order details, customer information, and callback routes (`/payment-success`, `/payment-fail`, `/payment-cancel`).
- **Step 7:** An order document is inserted into MongoDB with `paymentStatus: 'pending'` and `status: 'pending'`.
- **Step 8:** The database decrements available stock for each purchased item using `$inc`.
- **Step 9:** The API returns a successful response containing the created order and the `GatewayPageURL`.
- **Step 10:** The client receives the URL, dispatches `clearCart()` to reset Redux state, and redirects the browser window to the SSLCommerz payment portal.

---

## 8. Technical Challenges and Solutions

### Challenge 1: Server-Side Price Verification and Cart Desynchronization During Checkout

- **Context:** Shopping cart items, quantities, and pricing calculations are tracked in client-side state via Redux Persist. If the server were to accept client-calculated totals (`totalAmount`), malicious users could manipulate request payloads to purchase books at arbitrary prices. Furthermore, book prices or available inventory could change between the time a user adds an item to their cart and the moment they complete checkout.
- **Solution:** The checkout payload contract was restricted to an array of item tuples containing only `productId` and `quantity`, along with the customer's shipping address. Inside `OrderService.createOrder`, the server queries MongoDB directly using the list of product IDs via the `$in` operator. It verifies the existence of each product, ensures requested quantities do not exceed current inventory, rejects out-of-stock items, and calculates the authoritative total amount strictly from database unit prices before initializing the payment session.
- **Outcome:** Eliminated client-side price tampering vulnerabilities and prevented checkout requests for out-of-stock items, ensuring financial records match authoritative database catalog pricing.

### Challenge 2: Stock Allocation Boundaries Across External Hosted Payment Gateways

- **Context:** SSLCommerz requires redirecting the user to an external hosted portal to collect payment details. In the original implementation, book inventory was decremented immediately when generating the payment URL before payment was completed. If a customer abandoned the transaction, closed their browser, or experienced a payment failure at the gateway, the decremented inventory was not restored. Additionally, the callback routes (`/payment-success/:transactionId`, `/payment-fail/:transactionId`, `/payment-cancel/:transactionId`) redirected users to frontend views without updating the order's status in the database.
- **Solution:** Isolated the payment state lifecycle and restructured the callback architecture. The order entity was designed with explicit status flags (`paymentStatus: 'pending'`, `status: 'pending'`). The payment controller endpoints were audited and mapped to transaction references, establishing an architectural pattern where order status updates and stock restorations are decoupled from the initial redirect. For production stability, the system was prepared for Instant Payment Notification (IPN) webhooks, enabling server-to-server transaction validation before finalizing stock deductions.
- **Outcome:** Identified and isolated inventory desynchronization risks across third-party gateway boundaries, established explicit order status tracking, and created an architectural path for automated transaction reconciliation.

### Challenge 3: Heterogeneous Error Normalization Across Full-Stack Boundaries

- **Context:** The application processes errors from multiple independent sources: Zod schema validation errors, Mongoose schema validation failures, Mongoose `CastError` exceptions (from invalid MongoDB `ObjectId` strings), MongoDB E11000 duplicate key errors, and runtime `HttpError` exceptions. Without normalization, each error source emitted different response structures, causing client-side form resolvers and toast notification systems to receive unpredictable payloads.
- **Solution:** Implemented a centralized error formatting pipeline in the backend using a centralized `globalErrorHandler` middleware. Dedicated parsing utilities transform each native error structure into a predictable JSON envelope:
  - `handleZodValidationError` extracts and flattens schema validation errors with associated input paths.
  - `handleValidationError` formats Mongoose schema validation failures into clean message arrays.
  - `handleCastError` catches invalid MongoDB `ObjectId` conversion attempts.
  - `handleDuplicateError` captures duplicate key collisions (`E11000`) and highlights the conflicting fields.
  - Custom `HttpError` instances pass through explicit HTTP status codes and operational messages.
  - Execution stack traces are selectively included in development and sanitized in production environments.
- **Outcome:** Unified error handling across all API endpoints. The standardized `errorSources` array allows the frontend to map backend validation messages directly to matching form fields in React Hook Form or display clear messages in Sonner toast notifications.

---

## 9. Security and Performance Considerations

### Frontend Security and Optimization

- **Edge-Level Route Guards:** Route access is evaluated inside Next.js Edge Middleware before pages render, preventing unauthorized clients from accessing administrative or user dashboards.
- **On-Demand Cache Invalidation:** Server-rendered product views use Next.js tag-based caching (`tags: ["PRODUCT"]`). Catalog mutations invoke `revalidateTag("PRODUCT")` inside Server Actions, serving cached HTML to visitors while keeping data fresh after updates.
- **Client Bundle Minimization:** Heavy administrative views and public landing pages run as React Server Components by default. Client components (`"use client"`) are limited to interactive elements (filters, modal forms, tables, and cart controls), reducing JavaScript bundle sizes.
- **Responsive Media Delivery:** Book cover images use the Next.js `Image` component with defined `sizes` attributes, serving optimized WebP images and preventing layout shifts during page loads.

### Backend Security and Optimization

- **Cryptographic Password Hashing:** User passwords are encrypted using `bcrypt` with 12 salt rounds inside a Mongoose pre-save hook. Plaintext passwords are never stored in the database.
- **Runtime Request Boundary Validation:** All incoming request bodies are validated against strict Zod schemas using the `validateRequestSchema` middleware, sanitizing payloads before they reach controllers or services.
- **State-Aware Role-Based Access Control:** The `auth` middleware checks JWT signatures, verifies role permissions (`admin` vs. `user`), and confirms the requesting user account is neither marked as `isDeleted: true` nor flagged with `status: 'banned'`.
- **Production Error Sanitization:** The centralized error middleware suppresses internal execution stack traces when running in production (`config.NODE_ENV === "production"`), preventing database structures or internal server paths from leaking in API responses.

---

## 10. Project Outcomes

- **Full-Stack Order Fulfillment Lifecycle:** Built and deployed an end-to-end purchasing workflow spanning catalog exploration, faceted filtering, persistent shopping cart sessions, server-side price calculation, and hosted SSLCommerz payment gateway initialization.
- **Modular Five-Layer Backend Architecture:** Organized the server into isolated domain modules with clear separation between routes, validation schemas, controllers, business services, and Mongoose models across eight functional domains.
- **Database-Engine Analytical Reporting:** Offloaded all sales, category distribution, monthly growth, and inventory alerts to MongoDB aggregation pipelines, avoiding in-memory processing overhead in Node.js.
- **Consistent Full-Stack Validation Contracts:** Unified validation logic using Zod across both frontend forms and backend middleware, standardizing API error responses and streamlining client-side form error reporting.
- **Separation of Layouts and State Scopes:** Structured the client using Next.js App Router route groups, pairing Redux Persist for local shopping session data with edge-level middleware guards for protected views.

---

## 11. Future Improvements

1. **Atomic Multi-Document Transactions:** Wrap order creation and catalog stock deduction inside MongoDB multi-document transactions using `mongoose.startSession()` to guarantee all-or-nothing execution during concurrent checkouts.
2. **Server-Side IPN Webhook Integration:** Implement an SSLCommerz Instant Payment Notification (IPN) webhook listener to verify transactions server-to-server and automatically restore inventory when payments fail or are canceled.
3. **Distributed Caching Layer with Redis:** Introduce a Redis caching layer for read-heavy operations (such as catalog browsing, top-selling book queries, and category listings) to reduce read load on MongoDB Atlas.
4. **Automated Testing Suite:** Build a comprehensive test suite featuring unit tests for service methods and integration tests for checkout and authentication flows using Jest, Supertest, and React Testing Library.
