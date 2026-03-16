# Forum API

A RESTful API for a forum application built with Node.js and Express, featuring authentication, thread management, and comment functionality.

---

## Tech Stack

- **Runtime**: Node.js (ESM / ES Modules)
- **Framework**: Express v5
- **Database**: PostgreSQL (`pg`)
- **Authentication**: JSON Web Token (`jsonwebtoken`), Bcrypt (`bcrypt`)
- **ID Generator**: Nanoid
- **DI Container**: instances-container
- **Migration**: node-pg-migrate
- **Testing**: Vitest, Supertest
- **Linter**: ESLint
- **Dev Server**: Nodemon

---

## Architecture

Project ini menggunakan **Clean Architecture** untuk memisahkan tanggung jawab setiap lapisan kode secara tegas, sehingga mudah diuji, dipelihara, dan dikembangkan secara independen.

### Lapisan (Layers)

```
┌─────────────────────────────────────┐
│           Frameworks & Drivers       │  ← Express, PostgreSQL, JWT, Bcrypt
├─────────────────────────────────────┤
│        Interface Adapters            │  ← HTTP Handlers, Repositories (impl)
├─────────────────────────────────────┤
│          Use Cases / Services        │  ← Business logic aplikasi
├─────────────────────────────────────┤
│             Entities / Domain        │  ← Model domain, business rules inti
└─────────────────────────────────────┘
```

| Layer | Lokasi | Tanggung Jawab |
|---|---|---|
| **Entities / Domain** | `src/Domains/` | Model bisnis inti dan validasi domain |
| **Use Cases** | `src/*/use_case/` | Orkestrasi alur bisnis aplikasi |
| **Interface Adapters** | `src/*/handler/`, `src/*/repository/` | Menghubungkan use case dengan framework |
| **Frameworks & Drivers** | `src/Infrastructures/` | Express server, koneksi database, library eksternal |

### Prinsip Utama

- **Dependency Rule**: Ketergantungan hanya boleh mengarah ke dalam — layer luar boleh bergantung pada layer dalam, tidak sebaliknya.
- **Repository Pattern**: Layer use case berkomunikasi dengan database melalui interface repository, bukan langsung ke PostgreSQL. Implementasinya ada di layer infrastructure.
- **Dependency Injection**: Seluruh dependensi di-inject melalui `instances-container`, sehingga mudah di-mock saat testing.
- **Framework Independence**: Business logic tidak bergantung pada Express maupun PostgreSQL secara langsung, sehingga bisa diganti tanpa mengubah use case.

### Contoh Alur Request

```
HTTP Request
    │
    ▼
Express Router
    │
    ▼
Handler (Interface Adapter)
    │  — memanggil —
    ▼
Use Case (Business Logic)
    │  — melalui interface —
    ▼
Repository (Interface Adapter)
    │  — implementasi —
    ▼
PostgreSQL (Infrastructure)
```

---

## Prerequisites

Pastikan kamu sudah menginstal:

- [Node.js](https://nodejs.org/) >= 18.x
- [PostgreSQL](https://www.postgresql.org/) >= 13.x
- npm >= 9.x

---

## Installation

### 1. Clone Repository

```bash
git clone https://github.com/username/forum-api.git
cd forum-api
```

### 2. Install Dependencies

```bash
npm install
```

---

## Environment Setup

### `.env` (Development & Production)

Buat file `.env` di root project:

```env
# HTTP SERVER
HOST=localhost
PORT=3000

# POSTGRES
PGHOST=localhost
PGUSER=developer
PGDATABASE=forumapi
PGPASSWORD=supersecretpassword
PGPORT=5432

# POSTGRES TEST
PGHOST_TEST=localhost
PGUSER_TEST=developer
PGDATABASE_TEST=forumapi_test
PGPASSWORD_TEST=supersecretpassword
PGPORT_TEST=5432

# TOKENIZE
ACCESS_TOKEN_KEY=your_access_token_secret_key
REFRESH_TOKEN_KEY=your_refresh_token_secret_key
ACCCESS_TOKEN_AGE=3000
```

### `.test.env` (Testing)

Buat file `.test.env` di root project:

```env
# POSTGRES TEST
PGHOST=localhost
PGUSER=developer
PGDATABASE=forumapi_test
PGPASSWORD=supersecretpassword
PGPORT=5432

# TOKENIZE
ACCESS_TOKEN_KEY=your_access_token_secret_key
REFRESH_TOKEN_KEY=your_refresh_token_secret_key
ACCCESS_TOKEN_AGE=3000
```

> ⚠️ **Jangan gunakan nilai secret key dari contoh di atas untuk production!** Generate key acak yang kuat, misalnya dengan perintah:
> ```bash
> node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
> ```

---

## Database Setup

### Buat Database PostgreSQL

Masuk ke PostgreSQL dan buat database untuk development dan testing:

```sql
CREATE DATABASE forumapi;
CREATE DATABASE forumapi_test;
```

Pastikan user `developer` sudah memiliki akses ke kedua database tersebut.

### Jalankan Migrasi (Development)

```bash
npm run migrate up
```

### Jalankan Migrasi (Testing)

```bash
npm run migrate:test up
```

---

## Running the App

### Development (dengan auto-reload)

```bash
npm run start:dev
```

### Production

```bash
npm start
```

Server akan berjalan di `http://localhost:3000` (sesuai konfigurasi `.env`).

---

## Testing

### Jalankan Semua Test (sekali)

```bash
npm test
```

### Jalankan Test dalam Watch Mode

```bash
npm run test:watch
```

### Jalankan Test dengan Coverage Report

```bash
npm run test:coverage
```

---

## Linting

Periksa kualitas kode dengan ESLint:

```bash
npm run lint
```

---

## Available Scripts

| Script | Deskripsi |
|---|---|
| `npm start` | Menjalankan server production |
| `npm run start:dev` | Menjalankan server development dengan nodemon |
| `npm test` | Menjalankan semua unit/integration test |
| `npm run test:watch` | Menjalankan test dalam watch mode |
| `npm run test:coverage` | Menjalankan test dengan laporan coverage |
| `npm run migrate up` | Menjalankan migrasi database development |
| `npm run migrate:test up` | Menjalankan migrasi database testing |
| `npm run lint` | Menjalankan ESLint untuk seluruh codebase |

---

## Project Structure

```
forum-api/
├── src/
│   ├── app.js            # Entry point aplikasi
│   ├── ...               # Source code lainnya
├── migrations/           # File migrasi database
├── tests/                # File testing
├── .env                  # Environment variable (development)
├── .test.env             # Environment variable (testing)
├── package.json
└── README.md
```

---

## License

ISC
