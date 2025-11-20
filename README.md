# Point of Sales (POS) Backend API

**Point of Sales (POS) Backend** is a RESTful API service designed to support digital cashier operations. Built with **Node.js** and **Express.js**, it utilizes **Prisma ORM** to interface with a **PostgreSQL** database.

This system provides comprehensive features for managing products, categories, order transactions, and generating dashboard reports for business owners. It also integrates **Cloudinary** for efficient product image storage.

## 🛠 Tech Stack

* **Runtime:** [Node.js](https://nodejs.org/)
* **Framework:** [Express.js](https://expressjs.com/)
* **Database:** PostgreSQL
* **ORM:** [Prisma](https://www.prisma.io/)
* **Authentication:** JSON Web Token (JWT)
* **File Storage:** Cloudinary (via Multer)
* **Validation:** Joi / Express Validator (implied middleware)
* **Environment:** Dotenv

## 📂 Database Structure

The database schema is defined using Prisma and includes the following key models:

* `User`: Stores user data (cashier/admin) for authentication.
* `Category`: Manages product categories.
* `Product`: Contains product details, stock, price, and images.
* `Order`: Records sales transactions (header information).
* `OrderItem`: Details individual items within each transaction.

## 🚀 Installation & Setup

Follow these steps to set up and run the project locally.

### 1. Prerequisites
Ensure you have the following installed:
* Node.js (v18+)
* PostgreSQL

### 2. Clone & Install Dependencies
```bash
git clone <repository-url>
cd Point-Of-Sales-BE
npm install
````

### 3\. Environment Configuration (.env)

Create a `.env` file in the root directory and configure the following variables (refer to `src/config/env.js` for keys):

```ini
# Server Configuration
PORT=4000

# Database Configuration (Prisma)
DATABASE_URL="postgresql://user:password@localhost:5432/pos_db?schema=public"

# JWT Secret
JWT_SECRET=your_super_secret_key

# Cloudinary Configuration (For image uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 4\. Database Migration

Run Prisma migrations to create the tables in your local database:

```bash
npx prisma migrate dev --name init
```

*(Optional)* You can populate the database with initial data if a seed script is available:

```bash
npm run seed
# or
node prisma/seed.js
```

### 5\. Running the Server

  * **Development Mode (Nodemon):**
    ```bash
    npm run dev
    ```
  * **Production Mode:**
    ```bash
    npm start
    ```

The server will start at `http://localhost:4000` (or the PORT specified in your `.env`).

-----

## 📡 API Endpoint Documentation

Below is a list of available endpoints based on the router structure in `src/modules`.

### 🔐 Authentication

| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| `POST` | `/auth/register` | Register a new user | Public |
| `POST` | `/auth/login` | User login (Returns Token) | Public |
| `GET` | `/auth/profile` | Get current user profile | 🔒 Bearer Token |

### 📦 Categories

| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| `GET` | `/categories` | Fetch all categories | 🔒 Bearer Token |
| `POST` | `/categories` | Create a new category | 🔒 Bearer Token |
| `PUT` | `/categories/:id` | Update category details | 🔒 Bearer Token |
| `DELETE` | `/categories/:id` | Delete a category | 🔒 Bearer Token |

### 🛍️ Products

| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| `GET` | `/products` | Fetch all products (Supports filtering) | 🔒 Bearer Token |
| `POST` | `/products` | Add a new product (With image upload) | 🔒 Bearer Token |
| `PUT` | `/products/:id` | Update product information | 🔒 Bearer Token |
| `DELETE` | `/products/:id` | Delete a product | 🔒 Bearer Token |

### 🧾 Orders (Transactions)

| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| `POST` | `/orders` | Create a new transaction (Checkout) | 🔒 Bearer Token |
| `GET` | `/orders` | View transaction history | 🔒 Bearer Token |

### 📊 Reports

| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| `GET` | `/reports/dashboard` | Get sales summary and statistics | 🔒 Bearer Token |

-----

## 🧪 Project Structure

```text
.
├── prisma/                 # Database schema & Migrations
├── src/
│   ├── config/             # Environment & Database configuration
│   ├── libs/               # Helper libraries (e.g., Cloudinary uploader)
│   ├── middlewares/        # Auth checks, validation, error handling
│   ├── modules/            # Modular architecture (Controller, Service, Router)
│   │   ├── auth/
│   │   ├── categories/
│   │   ├── orders/
│   │   ├── products/
│   │   └── reports/
│   ├── app.js              # Express app setup
│   └── server.js           # Server entry point
└── package.json
```

## 📄 License

This project is open-source and available for educational or further development purposes.

Copyright © 2025 RapzzKY

