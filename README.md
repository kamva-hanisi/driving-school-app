# Driving School App

A full-stack driving school project with a React frontend and an Express/MySQL backend. The app is designed to help learners move through a simple booking flow, while leaving room for admin tools, poster generation, and future business features.

## What This Project Does

- shows a landing page for the driving school
- guides users through a multi-step booking process
- supports learner code selection such as Code 8, Code 10, and Code 14
- includes an authentication API for registering and logging in users
- includes dashboard and poster pages for future expansion

## Tech Stack

### Frontend

- React
- React Router
- Vite
- Sass
- Axios

### Backend

- Node.js
- Express
- MySQL
- bcryptjs
- JSON Web Tokens
- dotenv

## Project Structure

```text
driving-school-app/
  backend/
    src/
      config/
      controllers/
      middleware/
      routes/
      app.js
      server.js
  frontend/
    src/
      components/
      hooks/
      pages/
      services/
      styles/
      App.jsx
      main.jsx
  README.md
```

## Frontend Setup

From the `frontend` folder:

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
```

## Backend Setup

From the `backend` folder:

```bash
npm install
```

Create a `.env` file and add:

```env
PORT=5000
DB_HOST=localhost
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_NAME=driving_school
JWT_SECRET=your_secret_key
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
```

Then start the backend:

```bash
node src/server.js
```

## API Endpoints

Current authentication endpoints:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/bookings` requires `Authorization: Bearer <token>`

## Multi-School Migration

Run these SQL migrations when you are ready to enable school-level isolation:

```sql
ALTER TABLE users ADD school_id INT;
ALTER TABLE bookings ADD school_id INT;
```

Until those columns exist, the backend now falls back to the legacy schema so the app can still run.

## WhatsApp Setup

WhatsApp notifications use Twilio from the backend utility in [backend/src/utils/whatsapp.js](/c:/projects/driving-school-app/backend/src/utils/whatsapp.js).

- Install dependency: `npm install twilio`
- Add Twilio env vars to `backend/.env`
- Use WhatsApp-enabled numbers in international format, for example `+27123456789`

## Notes

- the frontend booking experience is the most complete part of the project right now
- the backend auth flow is started and ready for further expansion
- booking API routes are referenced in `backend/src/app.js`, so that area may still need implementation if it has not been added yet

## Roadmap

- save bookings to the database
- protect private routes with auth middleware
- add admin and instructor dashboards
- add reminders, analytics, and payment support

## GitHub Description

If you want a short GitHub repo description, you can use this:

`Full-stack driving school booking app built with React, Vite, Express, and MySQL.`

## Table

CREATE TABLE users (
id INT AUTO_INCREMENT PRIMARY KEY,
name VARCHAR(100) NOT NULL,
email VARCHAR(150) NOT NULL UNIQUE,
password VARCHAR(255) NOT NULL
);

CREATE TABLE bookings (
id INT AUTO_INCREMENT PRIMARY KEY,
customer_name VARCHAR(100) NOT NULL,
customer_email VARCHAR(150),
customer_phone VARCHAR(30) NOT NULL,
code VARCHAR(50) NOT NULL,
service VARCHAR(100) NOT NULL,
booking_date DATE NOT NULL,
booking_time TIME NOT NULL,
status VARCHAR(50) NOT NULL
);

npm install twilio
