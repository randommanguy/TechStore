# TechStore &bull; Full-Stack E-Commerce Platform

A production-oriented full-stack e-commerce web application featuring a layered Node.js / Express backend with PostgreSQL & Knex.js, AWS S3 asset storage, and a responsive frontend with customer authentication, administrator management, dynamic product filtering, and shopping cart functionality.

---

## Table of Contents

- [Features Overview](#features-overview)
- [Tech Stack](#tech-stack)
- [Project Architecture](#project-architecture)
- [Folder Structure](#folder-structure)
- [Frontend Application](#frontend-application)
- [API Reference](#api-reference)
  - [Customer Routes](#customer-routes)
  - [Product & Category Routes](#product--category-routes)
  - [Administrator Routes](#administrator-routes)
- [Database & Transactions](#database--transactions)
- [Background Jobs](#background-jobs)
- [Environment Variables](#environment-variables)
- [Getting Started](#getting-started)

---

## Features Overview

### Storefront & Customer Experience
- **Interactive Product Catalog**: Browse products with search, category filtering (`Electronics`, `Audio`, `Wearables`, `Accessories`), stock counters, and product descriptions.
- **Cart Management**: Add items with selectable quantities, adjust cart amounts, view real-time subtotal/tax calculations, and remove items.
- **Customer Authentication**: Account registration and JWT-based authentication (access tokens & refresh tokens) with secure bcrypt password hashing.
- **Preview Checkout Notice**: Modal notifications explaining preview-mode checkout status while retaining cart state.

### Administrator Management Portal
- **Admin Dashboard**: Real-time stats overview for catalog size, active categories, and total inventory stock.
- **Inventory Controls**: Adjust inventory levels on the fly (`+5` / `-5`), remove products, or add new catalog items with image presets.
- **Category & Subcategory Hierarchy**: Endpoints for creating, renaming, and deleting categories and subcategories with automatic slug generation.
- **Product Management**: Support for multi-image uploads using AWS S3 storage with transactional inventory tracking.

### System & Architecture
- **Layered MVC Pattern**: Clean separation among routes, controllers, and models.
- **Database Transactions**: Atomicity and data consistency across order, cart, and inventory modifications.
- **Automated Inventory Recovery**: Hourly `node-cron` job restores stock from abandoned carts.

---

## Tech Stack

### Frontend
- **React 18 & Vite** (Component-based architecture, Fast HMR, Production bundling)
- **Modern CSS3** (Flexbox, CSS Grid, Custom CSS Variables, Responsive Layouts)
- **Context API** (State management for Auth, Cart, Products, and Toast notifications)
- **LocalStorage & API Sync** (Client-side persistence with optional backend synchronization)

### Backend
- **Node.js** & **Express.js** (REST API & static asset hosting)
- **Knex.js** (Query Builder & migration manager)
- **PostgreSQL** (AWS RDS / relational data store)
- **JWT (`jsonwebtoken`)** (Dual token authentication: access & refresh)
- **bcrypt** (Password hashing and verification)
- **Multer** & **Multer-S3** (@aws-sdk/client-s3 for cloud file storage)
- **node-cron** (Scheduled background tasks)

---

## Project Architecture

The backend follows a layered architectural pattern:

```text
HTTP Request
     │
     ▼
Routes (view/)
     │
     ▼
Middlewares & Auth (middlewares/, token/)
     │
     ▼
Controllers (control/)
     │
     ▼
Models (model/)
     │
     ▼
PostgreSQL Database (Knex Query Builder)
```

---

## Folder Structure

```text
e-commerce-2/
├── client/                   # React frontend application (Vite)
│   ├── src/
│   │   ├── components/       # UI components (Navbar, Cart, Catalog, Modals, Admin)
│   │   ├── context/          # State providers (Auth, Cart, Products, Toast)
│   │   ├── constants/        # Default seed products and categories
│   │   ├── App.jsx           # Main React component
│   │   ├── main.jsx          # React DOM entrypoint
│   │   └── index.css         # Component and global styles
│   ├── vite.config.js        # Vite config with Express proxy & outputDir
│   └── package.json          # Frontend dependencies and scripts
├── control/                  # Application controllers (business logic)
│   ├── controller_admin.js   # Admin operations & inventory logic
│   ├── controller_cus.js     # Customer auth, cart, and checkout logic
│   └── controller_item.js    # Catalog, category, and product queries
├── model/                    # Data access layer & Knex models
│   ├── models_admin.js       # Admin queries & transaction logic
│   ├── models_cus.js         # Customer data, cart, & checkout queries
│   └── models_item.js        # Category & product queries
├── view/                     # Express route definitions
│   ├── router_admin.js       # Admin endpoints
│   ├── router_cus.js         # Customer endpoints
│   └── router_items.js       # Product and category endpoints
├── public/                   # Compiled frontend distribution (served by Express)
├── public_legacy/            # Archived original vanilla HTML/CSS/JS files
├── middlewares/              # Express middlewares (e.g., upload handling)
├── token/                    # JWT token generation & verification
├── jobs/                     # Background cron jobs (cart cleanup)
├── mig/                      # Knex database migrations
├── knexfile.js               # Knex database configuration
├── index.js                  # Express server entry point
├── valid.js                  # Request validation utilities
└── .env                      # Environment configuration
```

---

## Frontend Application

The React frontend is built using Vite and served directly by the Express server (`http://localhost:3000`):

- **Storefront**: Responsive grid view with search and category filters.
- **Cart System**: Slide-out cart modal with live tax (8%), shipping calculation, and quantity controls.
- **Quick-Fill Testing Accounts**:
  - **Customer**: `alex@techstore.com` (Password: `Password123!`)
  - **Administrator**: `admin@techstore.com` (Password: `AdminPassword123!`)
- **Admin Portal**: Accessible from the top navigation bar for managing products and viewing stats.
- **Development Workflow**:
  - `npm run client:dev`: Launches the Vite development server at `http://localhost:5173` with automatic API proxying.
  - `npm run build`: Compiles the React application into `public/`.
  - `npm start`: Starts the Express server which hosts both the API and the compiled React SPA at `http://localhost:3000`.

---

## API Reference

### Customer Routes

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/cus/signup` | Register new customer account | No |
| `POST` | `/cus/login` | Authenticate customer and receive JWT | No |
| `POST` | `/cus/refresh` | Renew access token via refresh token | No |
| `POST` | `/cus/cart/add` | Add product to active cart & reserve stock | Bearer (User) |
| `DELETE` | `/cus/cart/del` | Remove product from active cart | Bearer (User) |
| `POST` | `/cus/cart/check_out` | Convert cart into an order | Bearer (User) |

### Product & Category Routes

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/cus/categories/get_all` | Retrieve list of all categories | Bearer |
| `GET` | `/cus/categories/all_sub/:id` | Get subcategories for a category ID | Bearer |
| `GET` | `/cus/categories/:cid/sub/:sid/products` | Retrieve products under subcategory | Bearer |

### Administrator Routes

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/admin/signup` | Register new admin account (requires `employee_id`) | No |
| `POST` | `/admin/login` | Authenticate admin account and receive JWT | No |
| `POST` | `/admin/refresh` | Refresh admin access token | No |
| `POST` | `/admin/add_categories` | Create new categories with auto-slugs | Bearer (Admin) |
| `PUT` | `/admin/update_categories` | Rename existing categories | Bearer (Admin) |
| `DELETE` | `/admin/delete_categories` | Bulk delete categories | Bearer (Admin) |
| `POST` | `/admin/categories/add_subs` | Add subcategories under a category | Bearer (Admin) |
| `PUT` | `/admin/categories/upd_subs` | Update subcategory details | Bearer (Admin) |
| `DELETE` | `/admin/categories/del_subs` | Delete subcategories | Bearer (Admin) |
| `POST` | `/admin/categories/:cid/sub/:sid/add` | Add new product with image uploads | Bearer (Admin) |
| `PUT` | `/admin/categories/:cid/sub/:sid/upd` | Update existing product details | Bearer (Admin) |
| `DELETE` | `/admin/categories/:cid/sub/:sid/del` | Remove product from inventory | Bearer (Admin) |

---

## Database & Transactions

The database architecture uses PostgreSQL managed through Knex.js:

- **Customers** (`ecom2_cus_tb`): User records, profile addresses, and hashed passwords.
- **Admins** (`admin_tb`): Administrator records, employee IDs, and audit timestamps.
- **Categories & Subcategories** (`categories`, `subcategories_tb`): Hierarchical catalog taxonomy with unique slugs.
- **Products** (`product_tb`): Product titles, descriptions, pricing, stock levels, and S3 image URLs.
- **Carts & Items** (`cart_tb`, `cart_items_tb`): Active, abandoned, and converted customer shopping carts.
- **Orders** (`orders_tb`): Finalized checkout records with GST, shipping, and receipt breakdown.

Critical operations use Knex transactions (`knex.transaction()`) to guarantee atomicity and rollback capability on error.

---

## Background Jobs

A scheduled job in `jobs/cart_cleanup.js` runs automatically via `node-cron`:
- Periodically checks for active carts inactive for longer than 2 hours.
- Restores reserved product quantities back into inventory stock.
- Updates cart status to `abandoned` to prevent stock lockup.

---

## Environment Variables

Create a `.env` file in the project root with the following parameters:

```env
# Server Port
Port=3000

# Database Configuration (PostgreSQL / AWS RDS)
aws_rds_host=your-db-host.rds.amazonaws.com
aws_rds_user=postgres
aws_rds_prd=your_db_password
aws_rds_db=your_database_name

# Customer JWT Secrets
access_sec_k=your_customer_access_secret
refresh_sec_k=your_customer_refresh_secret

# Admin JWT Secrets
admin_access_sec_k=your_admin_access_secret
admin_refresh_sec_k=your_admin_refresh_secret

# AWS S3 Storage (Product Images)
AWS_REGION=ap-south-1
AWS_ACCESS_KEY=your_aws_access_key
AWS_SECRET_KEY=your_aws_secret_key
AWS_BUCKET_NAME=your_s3_bucket_name
```

---

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Ensure your `.env` file is properly configured with your PostgreSQL credentials and JWT secret keys.

### 3. Run Migrations (Optional)
```bash
npx knex migrate:latest
```

### 4. Start the Application
```bash
npm start
```
Or with auto-reloading:
```bash
npm run dev
```

### 5. Access the Web Application
Open your browser and navigate to:
```
http://localhost:3000
```
