# Point of Sales (POS) Backend API

**Point of Sales (POS) Backend** adalah layanan REST API yang dibangun untuk mendukung operasional sistem kasir digital. Backend ini dikembangkan menggunakan **Node.js** dan **Express.js**, dengan **Prisma ORM** sebagai jembatan ke database **PostgreSQL**.

Sistem ini menyediakan fitur manajemen produk, kategori, transaksi pemesanan, serta laporan dashboard ringkas untuk pemilik bisnis. Penyimpanan gambar produk terintegrasi menggunakan layanan **Cloudinary**.

## 🛠 Tech Stack

* **Runtime:** [Node.js](https://nodejs.org/)
* **Framework:** [Express.js](https://expressjs.com/)
* **Database:** PostgreSQL
* **ORM:** [Prisma](https://www.prisma.io/)
* **Authentication:** JSON Web Token (JWT)
* **File Storage:** Cloudinary (via Multer)
* **Validation:** Joi / Express Validator (implied from middleware)
* **Environment:** Dotenv

## 📂 Struktur Database

Skema database didefinisikan menggunakan Prisma dengan model utama sebagai berikut:

* `User`: Menyimpan data pengguna (kasir/admin) untuk autentikasi.
* `Category`: Mengelola kategori produk.
* `Product`: Data barang yang dijual, termasuk stok, harga, dan gambar.
* `Order`: Mencatat transaksi penjualan (header).
* `OrderItem`: Rincian item produk dalam setiap transaksi.

## 🚀 Instalasi & Menjalankan

Ikuti langkah-langkah berikut untuk menjalankan proyek di komputer lokal Anda.

### 1. Prasyarat
Pastikan Anda telah menginstal:
* Node.js (v18+)
* PostgreSQL

### 2. Clone & Install Dependencies
```bash
git clone <repository-url>
cd Point-Of-Sales-BE
npm install
````

### 3\. Konfigurasi Environment (.env)

Buat file `.env` di root folder dan sesuaikan variabel berikut (lihat `src/config/env.js` untuk referensi key yang digunakan):

```ini
# Server Configuration
PORT=4000

# Database Configuration (Prisma)
DATABASE_URL="postgresql://user:password@localhost:5432/pos_db?schema=public"

# JWT Secret
JWT_SECRET=rahasia_super_aman_123

# Cloudinary Configuration (Untuk upload gambar)
CLOUDINARY_CLOUD_NAME=nama_cloud_anda
CLOUDINARY_API_KEY=api_key_anda
CLOUDINARY_API_SECRET=api_secret_anda
```

### 4\. Migrasi Database

Jalankan migrasi Prisma untuk membuat tabel di database lokal Anda:

```bash
npx prisma migrate dev --name init
```

*(Opsional)* Anda dapat mengisi data awal (seeding) jika tersedia script seed:

```bash
npm run seed
# atau
node prisma/seed.js
```

### 5\. Menjalankan Server

  * **Mode Development (Nodemon):**
    ```bash
    npm run dev
    ```
  * **Mode Production:**
    ```bash
    npm start
    ```

Server akan berjalan di `http://localhost:4000` (atau sesuai PORT di .env).

-----

## 📡 Dokumentasi API Endpoint

Berikut adalah daftar endpoint yang tersedia berdasarkan struktur router di `src/modules`.

### 🔐 Authentication

| Method | Endpoint | Deskripsi | Auth |
| :--- | :--- | :--- | :--- |
| `POST` | `/auth/register` | Mendaftarkan user baru | Public |
| `POST` | `/auth/login` | Login user (mendapatkan Token) | Public |
| `GET` | `/auth/profile` | Mendapatkan profil user yang login | 🔒 Bearer Token |

### 📦 Categories

| Method | Endpoint | Deskripsi | Auth |
| :--- | :--- | :--- | :--- |
| `GET` | `/categories` | Mengambil semua kategori | 🔒 Bearer Token |
| `POST` | `/categories` | Membuat kategori baru | 🔒 Bearer Token |
| `PUT` | `/categories/:id` | Update kategori | 🔒 Bearer Token |
| `DELETE` | `/categories/:id` | Hapus kategori | 🔒 Bearer Token |

### 🛍️ Products

| Method | Endpoint | Deskripsi | Auth |
| :--- | :--- | :--- | :--- |
| `GET` | `/products` | Mengambil semua produk (Bisa filter kategori) | 🔒 Bearer Token |
| `POST` | `/products` | Tambah produk baru (Support upload gambar) | 🔒 Bearer Token |
| `PUT` | `/products/:id` | Update data produk | 🔒 Bearer Token |
| `DELETE` | `/products/:id` | Hapus produk | 🔒 Bearer Token |

### 🧾 Orders (Transaksi)

| Method | Endpoint | Deskripsi | Auth |
| :--- | :--- | :--- | :--- |
| `POST` | `/orders` | Membuat transaksi baru (Checkout) | 🔒 Bearer Token |
| `GET` | `/orders` | Melihat riwayat transaksi | 🔒 Bearer Token |

### 📊 Reports (Laporan)

| Method | Endpoint | Deskripsi | Auth |
| :--- | :--- | :--- | :--- |
| `GET` | `/reports/dashboard` | Mendapatkan ringkasan penjualan/statistik | 🔒 Bearer Token |

-----

## 🧪 Struktur Project

```text
.
├── prisma/                 # Schema database & Migrations
├── src/
│   ├── config/             # Konfigurasi env & database
│   ├── libs/               # Helper libraries (e.g., Cloudinary uploader)
│   ├── middlewares/        # Auth check, validation, error handling
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

## 📄 Lisensi

Proyek ini bersifat open-source dan dapat digunakan untuk keperluan pembelajaran atau pengembangan lebih lanjut.

Copyright © 2025 RapzzKY
