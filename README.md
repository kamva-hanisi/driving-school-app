# Driving School App

Full-stack driving school booking platform built with React, Vite, Express, and PostgreSQL.

## What Works Now

- Public client booking form
- Owner/admin login and registration
- Dashboard with real PostgreSQL booking data
- Booking status management
- Google and Facebook OAuth flow support
- Downloadable booking references and Twilio env hooks for production setup

## Stack

- Frontend: React, React Router, Vite, Sass, Axios
- Backend: Node.js, Express, PostgreSQL, bcryptjs, JWT, dotenv

## Project Structure

```text
driving-school-app/
  backend/
    src/
  frontend/
    src/
  README.md
```

## Local Setup

### 1. Database

Create the database and app user in pgAdmin 4, then use the connection values below in `backend/.env`.

Connection values for a local PostgreSQL server:

```text
Connection Name: Driving School App
Hostname: 127.0.0.1
Port: 5432
Username: driving_app
Password: DrivingApp@123
Maintenance database: driving_school
```

First connect in pgAdmin 4 with your PostgreSQL administrator account, then run this SQL in the `postgres` maintenance database:

```sql
CREATE USER driving_app WITH PASSWORD 'DrivingApp@123';
CREATE DATABASE driving_school OWNER driving_app;
```

Open the new `driving_school` database in pgAdmin 4 and use Query Tool for your PostgreSQL tables and seed data.

Owner/admin login after running the SQL:

```text
URL: http://localhost:5173/owner/login
Email: admin@drivingschool.com
Password: Admin@123
```

### 2. Backend env

Create `backend/.env` from [backend/.env.example](/c:/projects/driving-school-app/backend/.env.example).

Local example:

```env
PORT=5000
DB_HOST=127.0.0.1
DB_PORT=5432
DB_USER=driving_app
DB_PASSWORD=DrivingApp@123
DB_NAME=driving_school
# DATABASE_URL=postgresql://driving_app:DrivingApp%40123@127.0.0.1:5432/driving_school
JWT_SECRET=replace_with_a_long_random_secret

TWILIO_ACCOUNT_SID=replace_with_your_twilio_account_sid
TWILIO_AUTH_TOKEN=replace_with_your_twilio_auth_token
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886

FRONTEND_URL=http://localhost:5173

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret
FACEBOOK_CALLBACK_URL=http://localhost:5000/api/auth/facebook/callback
```

### 3. Frontend env

Create `frontend/.env` from [frontend/.env.example](/c:/projects/driving-school-app/frontend/.env.example).

Local example:

```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Install and run

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

## OAuth Callback URLs

Use these exact values when creating Google and Facebook apps for local development:

- Frontend URL: `http://localhost:5173`
- Backend URL: `http://localhost:5000`
- Google callback: `http://localhost:5000/api/auth/google/callback`
- Facebook callback: `http://localhost:5000/api/auth/facebook/callback`

Production example if your frontend and backend are on different domains:

- Frontend URL: `https://yourdomain.com`
- Backend URL: `https://api.yourdomain.com`
- Google callback: `https://api.yourdomain.com/api/auth/google/callback`
- Facebook callback: `https://api.yourdomain.com/api/auth/facebook/callback`

## Google Setup

In Google Cloud Console:

1. Create an OAuth application.
2. Add the authorized redirect URI:
   `http://localhost:5000/api/auth/google/callback`
3. Add your production redirect URI when deploying:
   `https://api.yourdomain.com/api/auth/google/callback`
4. Copy the client ID and secret into `backend/.env`.

## Facebook Setup

In Meta for Developers:

1. Create an app with Facebook Login enabled.
2. Add this Valid OAuth Redirect URI:
   `http://localhost:5000/api/auth/facebook/callback`
3. Add your production redirect URI when deploying:
   `https://api.yourdomain.com/api/auth/facebook/callback`
4. Copy the app ID and app secret into `backend/.env`.

## Main API Routes

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/google`
- `GET /api/auth/google/callback`
- `GET /api/auth/facebook`
- `GET /api/auth/facebook/callback`
- `POST /api/bookings`
- `GET /api/bookings/public/:reference`
- `GET /api/bookings`
- `GET /api/bookings/summary`
- `PATCH /api/bookings/:id/status`

## Important Notes

- Social login code is ready, but it will not work until real provider credentials are added to `backend/.env`.
- Clients now pay in person, so the booking flow no longer redirects to payment.
- Clients can download their booking reference card after confirming and also from the tracking page.
- If Twilio credentials are missing, bookings still save but WhatsApp sending is skipped.
- Rotate any real secrets that were previously committed or shared.

## Next Good Improvements

- Add Apple login or OTP phone login
- Add charts to the dashboard
- Add calendar scheduling view
- Add branch or multi-school support
