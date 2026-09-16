# Driving School App

A full-stack operations and booking platform for driving schools. It gives
learners a simple way to book and track lessons while giving owners and
platform administrators the tools to manage bookings, availability, customer
communication, and day-to-day operations.

## Why It Matters

Many driving schools still coordinate lessons through calls, messages, and
spreadsheets. This project brings that workflow into one system, reducing
manual administration and giving customers a clearer booking experience.

## Highlights

- Guided public booking flow with service, date, time, and customer details
- Booking review, downloadable booking cards, and reference-based tracking
- Secure registration and login with JWT authentication and password hashing
- Role-protected owner and platform administration portals
- Live booking summaries, status management, editing, and deletion
- Availability checks that prevent conflicting time-slot selection
- Poster creation tools for driving-school marketing content
- Contact messages stored in PostgreSQL with optional SMTP email delivery
- Responsive React interface backed by a REST API

## Technology

| Area | Technology |
| --- | --- |
| Web | React, React Router, Vite, Sass, Axios |
| API | Node.js, Express, JWT, bcryptjs, Nodemailer |
| Data | PostgreSQL |
| Deployment | Vercel, GitHub Pages, GitHub Actions |

## Project Structure

```text
driving-school-app/
|-- web/                 React and Vite application
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
npm --prefix api install
```

Create `api/.env` from `api/.env.example` and provide your local database,
JWT, frontend URL, and optional SMTP settings. Create `web/.env` from
`web/.env.example` when a custom API URL is needed.

Run commands from the repository root:

```bash
npm run dev:all   # Web and API together
npm run dev:web   # Web only
npm run dev:api   # API only
```

By default, the web app runs at `http://localhost:5173` and the API runs at
`http://localhost:5000`. API health is available at `/api/health`.

## Deployment

The web and API are independently deployable. In Vercel, configure separate
projects with Root Directory set to `web` and `api` respectively. Each folder
contains its own `vercel.json`.

The GitHub Pages workflow builds from `web/` and reads `VITE_API_URL` from the
repository's GitHub Actions secrets.

## Engineering Focus

This project demonstrates full-stack product development across responsive UI,
REST API design, authentication and authorization, relational data, deployment
automation, environment management, and customer-facing workflows.
