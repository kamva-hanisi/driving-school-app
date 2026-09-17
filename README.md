# Driving School App

A full-stack operations and booking platform for driving schools. It gives
learners a simple way to book and track lessons while giving authorized staff
separate tools to manage bookings, availability, customer
communication, and day-to-day operations.

## Why It Matters

Many driving schools still coordinate lessons through calls, messages, and
spreadsheets. This project brings that workflow into one system, reducing
manual administration and giving customers a clearer booking experience.

## Highlights

- Guided public booking flow with service, date, time, and customer details
- Booking review, downloadable booking cards, and reference-based tracking
- Separate client and staff applications with no admin code in the client build
- Secure admin login with JWT authentication and password hashing
- Live booking summaries, status management, editing, and deletion
- Availability checks that prevent conflicting time-slot selection
- Poster creation tools for driving-school marketing content
- Contact messages stored in PostgreSQL with optional SMTP email delivery
- Responsive React interface backed by a REST API

## Technology

| Area | Technology |
| --- | --- |
| Client | React, React Router, Vite, Sass, Axios |
| Admin | React, React Router, Vite, Sass, Axios, html2canvas |
| API | Node.js, Express, JWT, bcryptjs, Nodemailer |
| Data | PostgreSQL |
| Deployment | Vercel, GitHub Pages, GitHub Actions |

## Project Structure

```text
driving-school-app/
|-- web/                 Client-only booking and tracking app
|-- admin/               Separate protected admin app
|-- api/                 Express API and PostgreSQL integration
|-- scripts/dev-all.js   Combined development runner
|-- package.json         Root development commands
`-- README.md
```

## Local Development

### Requirements

- Node.js 22 or later
- PostgreSQL
- npm

Install dependencies:

```bash
npm --prefix web install
npm --prefix admin install
npm --prefix api install
```

Create `api/.env` from `api/.env.example` and provide your local database,
JWT, allowed frontend URLs, and optional SMTP settings. Create local `.env`
files from `web/.env.example` and `admin/.env.example` when custom deployment
URLs are needed.

Run commands from the repository root:

```bash
npm run dev:all     # Client, admin, and API together
npm run dev:web     # Client only on port 5173
npm run dev:admin   # Admin only on port 5174
npm run dev:api     # API only on port 5000
```

API health is available at `/api/health`.

### Register The Owner

1. Start the admin app and API with `npm run dev:all`.
2. Open `http://localhost:5174/register`.
3. Create the first owner account.
4. Sign in at `http://localhost:5174/login` after registration.

Registration closes automatically as soon as an admin or owner account exists
in the database. This lets a new owner set up the website without receiving a
server secret while preventing later visitors from creating admin accounts.

## Deployment

The three applications are independently deployable. GitHub Pages hosts the
client from `web/`. In Vercel, configure separate projects with Root Directory
set to `admin` and `api`. Set `VITE_API_URL` and `VITE_CLIENT_URL` on the admin
project. On the API project, set `FRONTEND_URL` to a comma-separated list of
the client and admin origins so CORS accepts both deployments. The deployed
registration page is available at `/register` on the admin project's domain
until its first owner account is created.

The GitHub Pages workflow builds from `web/` and reads `VITE_API_URL` from the
repository's GitHub Actions secrets.

## Engineering Focus

This project demonstrates full-stack product development across responsive UI,
REST API design, authentication and authorization, relational data, deployment
automation, environment management, and customer-facing workflows.
