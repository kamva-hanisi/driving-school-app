# Driving School App

Full-stack driving school booking platform built with React, Vite, Express, and PostgreSQL.

## What Works Now

- Public client booking form
- Separate platform owner and company admin portals
- Company admin login and registration
- Company-scoped dashboards with real PostgreSQL booking data
- Platform dashboard for all company admins and bookings
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

Open the new `driving_school` database in pgAdmin 4 and use Query Tool for your PostgreSQL tables and seed data.

Create the required tables in your database using pgAdmin, Beekeeper Studio, or
Render's SQL shell.


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

## Deploy to Render

This repo includes a [render.yaml](render.yaml) Blueprint for:

- `driving-school-api`: Node/Express API
- `driving-school-frontend`: Vite static site
- `driving-school-db`: Render PostgreSQL database

### 1. Push the repo to GitHub

Render deploys from a Git repository, so push this project to GitHub or GitLab.

### 2. Create the Render Blueprint

In Render, choose **New + > Blueprint**, connect your repo, and select the
root-level `render.yaml` file. Render will ask for secret values marked with
`sync: false`.

Initial required values:

```env
FRONTEND_URL=https://driving-school-frontend.onrender.com
VITE_API_URL=https://driving-school-api.onrender.com/api
```

Render generates `JWT_SECRET` and wires `DATABASE_URL` to the Render Postgres
database automatically.

Optional values, only needed if you use those features:

```env
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=https://driving-school-api.onrender.com/api/auth/google/callback
FACEBOOK_APP_ID=
FACEBOOK_APP_SECRET=
FACEBOOK_CALLBACK_URL=https://driving-school-api.onrender.com/api/auth/facebook/callback
EMAIL_USER=
EMAIL_PASS=
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
```

If Render gives your services different URLs, use those real URLs instead.

### 3. Create the database tables

After Render creates `driving-school-db`, connect to it with Beekeeper Studio
using the Render database **External Database URL**, or use Render's SQL shell.
Create the app tables there privately.

### 4. Redeploy

After the env vars and tables are ready, manually redeploy both services. Test:

- Frontend: `https://driving-school-frontend.onrender.com`
- API health: `https://driving-school-api.onrender.com/api/health`

## Company Names

Right now, company separation is based on `school_id`.

Example:

If you want company-branded URLs like:

```text
/booking/fast-driving-school
/booking/realistic-driver-school
```

the next improvement is to add a `company_name` and `company_slug` field for
each company admin.

## Important Notes

- Social login code is ready, but it will not work until real provider credentials are added to `backend/.env`.
- Clients now pay in person, so the booking flow no longer redirects to payment.
- Clients can download their booking reference card after confirming and also from the tracking page.
- If Twilio credentials are missing, bookings still save but WhatsApp sending is skipped.
- Company admins must share their own booking link from the dashboard so client bookings are assigned to the correct `school_id`.
- The plain `/booking` route falls back to the first active company admin and should not be used as the main company-specific booking link.
- Rotate any real secrets that were previously committed or shared.

## Next Good Improvements

- Add `company_name` and `company_slug` for branded company booking pages
- Add Apple login or OTP phone login
- Add charts to the dashboard
- Add calendar scheduling view
- Add branch support inside each company
