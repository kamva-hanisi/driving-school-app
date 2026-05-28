# Driving School App

Full-stack driving school booking platform built with React, Vite, Express, and PostgreSQL.

## What Works

- Public client booking form
- Admin sign up and login with email/password
- Admin dashboard with real PostgreSQL booking data
- Booking status management
- Booking reference tracking
- Contact messages saved to PostgreSQL

## Stack

- Frontend: React, React Router, Vite, Sass, Axios
- Backend: Node.js, Express, PostgreSQL, bcryptjs, JWT, dotenv

## PostgreSQL Setup

Use pgAdmin 4, DBeaver, TablePlus, or another PostgreSQL client. MySQL Workbench is only for MySQL, so it will not connect to this PostgreSQL project.

First connect as your PostgreSQL admin user, usually `postgres`, and run:

```sql
CREATE DATABASE driving_school;

CREATE USER driving_app WITH PASSWORD 'your_password';

GRANT ALL PRIVILEGES ON DATABASE driving_school TO driving_app;
```

Then connect to the `driving_school` database and run this schema:

```sql
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(30) NOT NULL DEFAULT 'admin'
    CHECK (role IN ('owner', 'admin', 'super_admin')),
  school_id INT NULL UNIQUE,
  account_status VARCHAR(30) NOT NULL DEFAULT 'active'
    CHECK (account_status IN ('active', 'deactivated', 'deleted')),
  deletion_scheduled_at TIMESTAMP NULL,
  deactivated_until TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_school ON users(school_id);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(account_status);

CREATE TABLE IF NOT EXISTS bookings (
  id SERIAL PRIMARY KEY,
  customer_name VARCHAR(100) NOT NULL,
  customer_email VARCHAR(150) NULL,
  customer_phone VARCHAR(30) NOT NULL,
  code VARCHAR(50) NOT NULL,
  service VARCHAR(100) NOT NULL,
  booking_date DATE NOT NULL,
  booking_time TIME NOT NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  school_id INT NULL REFERENCES users(school_id) ON DELETE SET NULL,
  public_reference VARCHAR(20) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_bookings_date_time ON bookings(booking_date, booking_time);
CREATE INDEX IF NOT EXISTS idx_bookings_school ON bookings(school_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_bookings_updated_at ON bookings;

CREATE TRIGGER set_bookings_updated_at
BEFORE UPDATE ON bookings
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE TABLE IF NOT EXISTS contact_messages (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NULL,
  subject VARCHAR(150) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

GRANT USAGE, CREATE ON SCHEMA public TO driving_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO driving_app;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO driving_app;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO driving_app;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT USAGE, SELECT ON SEQUENCES TO driving_app;
```

There is no demo admin account. The admin creates their own account in the app:

```text
http://localhost:5173/owner/register
```

After registering, log in here:

```text
http://localhost:5173/owner/login
```

Each admin account automatically gets its own `school_id`. Bookings made from that admin's booking link are shown in that admin's dashboard.

## PostgreSQL Connection

Use these details in pgAdmin or another PostgreSQL client:

```text
Host: 127.0.0.1
Port: 5432
Database: driving_school
Username: driving_app
Password: your_password
```

## Backend Env

Create `backend/.env` from `backend/.env.example`.

```env
PORT=5000
DB_HOST=127.0.0.1
DB_PORT=5432
DB_USER=driving_app
DB_PASSWORD=your_password
DB_NAME=driving_school
JWT_SECRET=replace-with-a-long-random-secret
FRONTEND_URL=http://localhost:5173
```

## Frontend Env

Create `frontend/.env` from `frontend/.env.example`.

```env
VITE_API_URL=http://localhost:5000/api
```

## Install And Run

Backend:

```bash
cd backend
npm install
npm run dev
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

## Main API Routes

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `DELETE /api/auth/me`
- `POST /api/bookings`
- `GET /api/bookings/public/:reference`
- `PATCH /api/bookings/public/:reference`
- `GET /api/bookings`
- `GET /api/bookings/summary`
- `PATCH /api/bookings/:id/status`
- `DELETE /api/bookings/:id`
- `POST /api/contact`
