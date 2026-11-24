# Borno Bihar - Book Shop Backend API

A scalable, secure, and production-ready RESTful API designed for Borno Bihar, an online bookstore platform. Built with TypeScript, Node.js, Express.js, and MongoDB with Mongoose, the backend provides role-based access control (Admin and Customer), catalog and inventory management, order processing, SSLCommerz payment gateway integration, comprehensive analytics, and customer support services.

---

## Live Deployment & Repository Links

- GitHub Repository: https://github.com/Emam-Bokhari/bornobihar-backend
- Live API Base URL: https://book-shop-backend-alpha-red.vercel.app/api/v1
- Health Check Endpoint: https://book-shop-backend-alpha-red.vercel.app
- Live Frontend Client: https://borno-bihar-frontend-umber.vercel.app

---

## Key Features

### 1. Authentication and Authorization

- Secure user registration and login with bcrypt password hashing.
- Role-Based Access Control (RBAC) with dedicated permissions for `admin` and `user`.
- JWT (JSON Web Token) authentication for stateless and secure session verification.
- Account status tracking (active and banned user restrictions).

### 2. Product and Inventory Management

- Full CRUD operations for books (title, author, category, price, quantity, description, cover image, rating).
- Automated inventory synchronization: product stock decreases automatically upon successful order placement.
- Stock availability verification preventing checkout if stock is insufficient or depleted.
- Real-time catalog filtering by category, author, price range, and search terms using a custom QueryBuilder.

### 3. Order Processing and Payment Integration

- Complete checkout workflow supporting multi-item orders and customer shipping details.
- Secure payment integration powered by SSLCommerz hosted checkout gateway.
- Dedicated callback endpoints for payment success, failure, and cancellation.
- Automated redirect workflows returning customers to designated frontend response pages.
- Customer-specific order history retrieval and admin-level order status management (`pending`, `shipping`, `delivered`, `cancelled`).

### 4. Admin Analytics and Dashboard Reporting

- High-level business overview statistics (revenue, total orders, customer counts).
- Order status distribution and monthly sales trends.
- Category-wise sales breakdowns and top-selling book analytics.
- Automated inventory alerts for low-stock and out-of-stock items.

### 5. Content and Customer Engagement

- Blog management module with administrative publishing and public reading endpoints.
- Support ticket creation for registered users with admin review.
- General contact form handling and newsletter subscription management.

### 6. Architecture and Error Handling

- Clean modular architectural pattern (Controller - Service - Model - Route - Validation - Interface).
- Request validation powered by Zod schemas prior to hitting controllers.
- Centralized global error handling with standardized JSON response formatting.
- Explicit handling for CastError, duplicate key conflicts, and Zod validation errors.

---

## Technology Stack

- Runtime Environment: Node.js (v20+)
- Server Framework: Express.js
- Programming Language: TypeScript
- Database: MongoDB (NoSQL)
- Object Data Modeling (ODM): Mongoose
- Authentication: JSON Web Tokens (jsonwebtoken), bcrypt
- Request Validation: Zod
- Payment Gateway: SSLCommerz (`sslcommerz-lts`)
- Utilities: Cookie-Parser, CORS, Dotenv, Axios
- Code Quality and Formatting: ESLint, Prettier
- Development Tooling: ts-node-dev, nodemon, tsc
- Deployment Platform: Vercel

---

## Folder Structure

```text
bornobihar-backend/
|-- src/
|   |-- @types/
|   |   `-- sslcommerz-lts.d.ts
|   |-- app/
|   |   |-- builder/
|   |   |   `-- QueryBuilder.ts
|   |   |-- config/
|   |   |   `-- index.ts
|   |   |-- errors/
|   |   |   |-- handleCastError.ts
|   |   |   |-- handleDuplicateError.ts
|   |   |   |-- handleValidationError.ts
|   |   |   |-- handleZodValidationError.ts
|   |   |   `-- HttpError.ts
|   |   |-- interface/
|   |   |   |-- error.ts
|   |   |   `-- index.d.ts
|   |   |-- middlewares/
|   |   |   |-- auth.ts
|   |   |   |-- globalErrorHandler.ts
|   |   |   |-- notFound.ts
|   |   |   `-- validateRequestSchema.ts
|   |   |-- modules/
|   |   |   |-- Analytics/
|   |   |   |-- Auth/
|   |   |   |-- Blog/
|   |   |   |-- Contact/
|   |   |   |-- Newsletter/
|   |   |   |-- Order/
|   |   |   |-- Payment/
|   |   |   |-- Product/
|   |   |   |-- ShippingAddress/
|   |   |   |-- Support/
|   |   |   `-- User/
|   |   |-- routes/
|   |   |   `-- index.ts
|   |   `-- utils/
|   |       |-- global/
|   |       |   |-- asyncHandler.ts
|   |       |   `-- sendResponse.ts
|   |       `-- moduleSpecific/
|   |           `-- queryFilters.ts
|   |-- app.ts
|   `-- server.ts
|-- .env.example
|-- .gitignore
|-- .prettierignore
|-- .prettierrc
|-- eslint.config.mjs
|-- package.json
|-- tsconfig.json
|-- vercel.json
`-- README.md
```

---

## API Endpoints Reference

Base Path: `/api/v1`

### Authentication (`/auth`)

| Method | Endpoint         | Access | Description                                   |
| ------ | ---------------- | ------ | --------------------------------------------- |
| POST   | `/auth/register` | Public | Register a new user account                   |
| POST   | `/auth/login`    | Public | Authenticate user credentials and receive JWT |

### Users (`/users`)

| Method | Endpoint                | Access        | Description                                  |
| ------ | ----------------------- | ------------- | -------------------------------------------- |
| GET    | `/users`                | Admin         | Retrieve all registered users                |
| GET    | `/users/me`             | Authenticated | Retrieve authenticated user's profile        |
| GET    | `/users/:id`            | Admin         | Retrieve user by ID                          |
| PATCH  | `/users/update-profile` | Authenticated | Update user profile details                  |
| PATCH  | `/users/:id/status`     | Admin         | Update account status (e.g., active, banned) |
| PATCH  | `/users/:id/role`       | Admin         | Update user role (e.g., user, admin)         |
| DELETE | `/users/:id`            | Authenticated | Delete a user account                        |

### Products / Books (`/products`)

| Method | Endpoint                       | Access | Description                                          |
| ------ | ------------------------------ | ------ | ---------------------------------------------------- |
| POST   | `/products`                    | Admin  | Create a new book item                               |
| GET    | `/products`                    | Public | List books with search, filter, sort, and pagination |
| GET    | `/products/all`                | Public | List all books without default pagination            |
| GET    | `/products/category/:category` | Public | List books filtered by category                      |
| GET    | `/products/:id`                | Public | Retrieve detailed information for a single book      |
| PATCH  | `/products/:id`                | Admin  | Update book information or stock                     |
| DELETE | `/products/:id`                | Admin  | Remove a book from the catalog                       |

### Orders (`/orders`)

| Method | Endpoint             | Access        | Description                                                   |
| ------ | -------------------- | ------------- | ------------------------------------------------------------- |
| POST   | `/orders`            | Authenticated | Place a new order and generate payment session                |
| GET    | `/orders/byUser`     | Authenticated | Retrieve order history for the logged-in user                 |
| GET    | `/orders`            | Admin         | List all orders with filters and pagination                   |
| GET    | `/orders/:id`        | Admin         | Retrieve single order details                                 |
| PATCH  | `/orders/:id/status` | Admin         | Update order status (pending, shipping, delivered, cancelled) |

### Payments (`/payments`)

| Method | Endpoint                                   | Access                    | Description                                     |
| ------ | ------------------------------------------ | ------------------------- | ----------------------------------------------- |
| POST   | `/payments/payment-success/:transactionId` | Public (Gateway Callback) | Handle SSLCommerz success callback and redirect |
| POST   | `/payments/payment-fail/:transactionId`    | Public (Gateway Callback) | Handle SSLCommerz fail callback and redirect    |
| POST   | `/payments/payment-cancel/:transactionId`  | Public (Gateway Callback) | Handle SSLCommerz cancel callback and redirect  |

### Shipping Address (`/shipping-address`)

| Method | Endpoint                | Access        | Description                           |
| ------ | ----------------------- | ------------- | ------------------------------------- |
| POST   | `/shipping-address`     | Authenticated | Save shipping address information     |
| GET    | `/shipping-address`     | Admin         | Retrieve all saved shipping addresses |
| GET    | `/shipping-address/:id` | Authenticated | Retrieve shipping address by ID       |
| PATCH  | `/shipping-address/:id` | Authenticated | Update shipping address details       |
| DELETE | `/shipping-address/:id` | Admin         | Delete a shipping address record      |

### Analytics (`/analytics`)

| Method | Endpoint                                 | Access | Description                                     |
| ------ | ---------------------------------------- | ------ | ----------------------------------------------- |
| GET    | `/analytics/overview`                    | Admin  | Retrieve dashboard overview figures             |
| GET    | `/analytics/getStats`                    | Admin  | Retrieve system and sales summary statistics    |
| GET    | `/analytics/order-status-distribution`   | Admin  | Retrieve distribution of order statuses         |
| GET    | `/analytics/sales-by-category`           | Admin  | Retrieve total sales grouped by book category   |
| GET    | `/analytics/monthly-sales-trend`         | Admin  | Retrieve monthly revenue and sales volume trend |
| GET    | `/analytics/payment-status-distribution` | Admin  | Retrieve payment status metrics                 |
| GET    | `/analytics/top-selling-books`           | Admin  | Retrieve ranking of top-selling books           |
| GET    | `/analytics/recent-orders`               | Admin  | List recent order transactions                  |
| GET    | `/analytics/inventory-alert`             | Admin  | Retrieve low-stock inventory warnings           |

### Content, Support, and Inquiries

| Method | Endpoint           | Access        | Description                              |
| ------ | ------------------ | ------------- | ---------------------------------------- |
| POST   | `/blogs`           | Admin         | Create a new blog post                   |
| GET    | `/blogs`           | Public        | List all published blog articles         |
| GET    | `/blogs/:id`       | Public        | Retrieve a specific blog post            |
| PATCH  | `/blogs/:id`       | Admin         | Edit an existing blog post               |
| DELETE | `/blogs/:id`       | Admin         | Delete a blog post                       |
| POST   | `/supports`        | Authenticated | Submit a customer support inquiry        |
| GET    | `/supports`        | Admin         | Retrieve all customer support tickets    |
| DELETE | `/supports/:id`    | Admin         | Delete a support inquiry                 |
| POST   | `/contacts`        | Public        | Submit contact form message              |
| GET    | `/contacts`        | Admin         | Retrieve submitted contact messages      |
| DELETE | `/contacts/:id`    | Admin         | Delete a contact record                  |
| POST   | `/newsletters`     | Public        | Subscribe an email address to newsletter |
| GET    | `/newsletters`     | Admin         | Retrieve newsletter subscriber list      |
| DELETE | `/newsletters/:id` | Admin         | Remove an email from newsletter list     |

---

## Installation and Setup Guide

Follow the steps below to run this project in your local development environment:

### 1. Prerequisites

Ensure you have the following installed on your machine:

- Node.js (version 20.x or higher)
- npm or yarn package manager
- MongoDB database (local instance or MongoDB Atlas cluster)
- SSLCommerz sandbox account (for testing checkout workflows)

### 2. Clone the Repository

```bash
git clone https://github.com/Emam-Bokhari/bornobihar-backend.git
cd bornobihar-backend
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Setup Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Open the `.env` file and replace all placeholder values with your actual configuration credentials:

```env
PORT=5001
NODE_ENV=development
DATABASE_USER_NAME=your_mongodb_username_here
DATABASE_PASS=your_mongodb_password_here
DATABASE_URL=enter_your_mongodb_connection_uri_here
BCRYPT_SALT_ROUNDS=12
STORE_ID=enter_your_sslcommerz_store_id_here
STORE_PASS=enter_your_sslcommerz_store_password_here
JWT_ACCESS_SECRET=enter_your_secure_jwt_secret_key_here
```

Important Security Note: Never commit your actual `.env` file or sensitive credentials to version control. The `.gitignore` file must always include `.env`.

### 5. Run in Development Mode

Start the development server with live reload via `ts-node-dev`:

```bash
npm run start:dev
```

The server will initialize at:

```text
http://localhost:5001
```

### 6. Build and Run in Production Mode

Compile TypeScript to JavaScript and execute the production build:

```bash
# Build the TypeScript project into the dist/ directory
npm run build

# Start the compiled production server
npm run start:prod
```

### 7. Code Quality Scripts

```bash
# Run ESLint to inspect code quality
npm run lint

# Automatically fix linting issues
npm run lint:fix

# Format codebase using Prettier
npm run format
```

---

## Environment Variables Reference

| Variable             | Description                                   | Example / Format                                               |
| -------------------- | --------------------------------------------- | -------------------------------------------------------------- |
| `PORT`               | Port number on which the server listens       | `5001`                                                         |
| `NODE_ENV`           | Application environment state                 | `development` or `production`                                  |
| `DATABASE_USER_NAME` | MongoDB database user identifier              | Database user string                                           |
| `DATABASE_PASS`      | MongoDB database user password                | Database user password string                                  |
| `DATABASE_URL`       | Full MongoDB connection string (URI)          | `mongodb+srv://<user>:<password>@cluster.mongodb.net/<dbname>` |
| `BCRYPT_SALT_ROUNDS` | Salt rounds for hashing passwords             | `12`                                                           |
| `STORE_ID`           | SSLCommerz Store ID                           | Provided by SSLCommerz Merchant Panel                          |
| `STORE_PASS`         | SSLCommerz Store Password                     | Provided by SSLCommerz Merchant Panel                          |
| `JWT_ACCESS_SECRET`  | Secret key used for signing JWT access tokens | 64+ character random string                                    |

---

## Contact and Contributions

For technical questions, issues, or suggestions regarding this project:

- Author: Moshfiqur Rahman
- Email: moshfiqurrahman37@gmail.com
- GitHub Profile: https://github.com/Emam-Bokhari
- LinkedIn Profile: https://www.linkedin.com/in/moshfiqur-rahman-a302b32a3/
