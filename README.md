# 🧾 Point-Of-Sales-BE

A modern **Point of Sales (POS) backend system** built with **Express.js**, **Prisma ORM**, and **PostgreSQL**.  
Designed for small to medium businesses, this project provides core transaction and reporting features like product management, order handling, and real-time sales reports — all secured with JWT-based authentication and role management.

---

## 🚀 Features

- 🔐 **Authentication & Authorization**
  - Secure login with JWT
  - Role-based access control (Admin / Cashier)

- 📦 **Category & Product Management**
  - CRUD operations for categories and products
  - Image upload with Multer

- 💳 **Order System**
  - Create draft orders and add items dynamically
  - Checkout with automatic stock updates

- 📊 **Sales Reporting**
  - Daily and summary reports (revenue, top-selling products, hourly sales)
  - Uses Prisma aggregations for performance

- 🧠 **Clean Architecture**
  - Separation between Controller, Service, and Middleware layers
  - Modularized and scalable folder structure

---

## 🧱 Tech Stack

| Layer | Technology |
|-------|-------------|
| Backend Framework | **Express.js** |
| ORM | **Prisma ORM** |
| Database | **PostgreSQL** |
| Authentication | **JWT (jsonwebtoken)** |
| Validation | **Zod** |
| File Upload | **Multer** |
| Reporting | **Prisma GroupBy & Aggregation** |

---
