# Avanaa — Glowy Square Online Shopping Mart

## Live Demo
Check out the live version of this project [here](https://avanaa-glowy-square-online-shopping.vercel.app/)!

## Table of contents
- Project summary
- Problem statement
- Why this solution (rationale)
- Architecture overview
- Key features
- Challenges encountered
- How challenges were solved (what changed)
- What to improve next (roadmap)
- Getting started (dev environment)
  - Prerequisites
  - Environment variables
  - Start backend
  - Start frontend
- Project structure (high level)
- API summary and contracts
- Data models (brief)
- Testing and verification
- Deployment notes
- Troubleshooting & common fixes
- Contribution guidelines
- License

---

## Project summary
Avanaa — Glowy Square is a full-stack e-commerce application built to demonstrate a production-like shopping platform: product catalog, cart, checkout, order history, reviews, authentication (email/password + Google OAuth), and a simple admin panel for product, order and user management.

The repository is a monorepo containing two main applications:
- `ags-backend/` — Node.js + Express + MongoDB API server
- `ags-frontend/` — React + Vite frontend application (Tailwind CSS)

This README documents how to run, test, and extend the system.

---

## Problem statement
Small and medium web shops need a reliable, extensible e-commerce starter application that covers the end-to-end flow (browse → cart → checkout → order history) and basic admin operations (product management, order processing, review moderation). The app must be mobile friendly, secure, and straightforward to deploy.

Requirements addressed by this project:
- Product catalog and search
- Add to cart and persistent cart behavior
- Checkout and order creation (server side validation)
- Order history for customers and status management for admins
- User authentication (email/password and Google OAuth)
- Reviews with star rating
- Admin dashboard for CRUD on products, orders and users
- Mobile-first responsive UI

---

## Why this solution?
- **MERN stack (React + Express + MongoDB)**: Well-suited for rapid development of full-stack JS apps. Uses the same language (JavaScript/TypeScript optional) across tiers.
- **Vite + React**: Fast dev server and modern build optimizations, good DX.
- **Express + Mongoose**: Lightweight API layer and convenient schema handling for MongoDB.
- **JWT auth + sessionStorage**: Provides stateless server sessions with client-side session control; sessionStorage is used intentionally to avoid persistent login across browser closes in this implementation (can be switched to localStorage for persistent login).
- **Tailwind CSS**: Utility-first approach for quick, consistent responsive styles.

---

## Architecture (high level)
- Monorepo containing two applications under the repository root.
- Backend (Express) exposes REST API endpoints under `/api/*` and connects to MongoDB Atlas.
- Frontend (React) calls backend endpoints via configured `VITE_BACKEND_URL` environment variable.
- JWT-based middleware applied globally to attach `req.userData` when a token is present.

Architecture type: MERN monorepo (single-repository web application — not microservices).

Component diagram (logical):
```
[Browser/Client] <--> [React (Vite)] <--> [Express API server] <--> [MongoDB Atlas]
        |                                         |
        +--- Google OAuth popup -> Google         +--- Supabase (optional for image storage)
```

Ports used in development (default):
- Backend: 5001
- Frontend (Vite): 5173 (Vite default; dev notes sometimes reference 5174 — confirm locally)

---

## Key features
- Product browsing + search
- Cart with localStorage persistence and event-driven updates
- Checkout flow (order creation, server-side validation, order ID generation)
- Order history with status tracking and icons
- Admin panel (products, orders, reviews, users)
- Reviews with star rating and hover preview
- Login/Register + Google OAuth integration
- Mobile-first responsive UI and accessibility considerations

---

## Getting started (development)
This repo contains `ags-backend` and `ags-frontend`. No code changes are required for the README.

### Prerequisites
- Node.js (v18+ recommended)
- npm
- MongoDB (Atlas connection string recommended)
- Google OAuth credentials for local testing (client id/secret)
- Optional: Supabase for image uploads (project URL and anon key)

### Environment variables
Create `.env` files in the respective folders with the following variables.

#### Backend (`ags-backend/.env`):
```
PORT=5001
MONGODB_URL=your_mongodb_connection_string
JWT_KEY=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
EMAIL_USER=your_email_for_notifications
EMAIL_PASS=your_email_password_or_app_password
```

#### Frontend (`ags-frontend/.env`):
```
VITE_BACKEND_URL=http://localhost:5001
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_SUPABASE_URL=optional_supabase_url
VITE_SUPABASE_ANON_KEY=optional_supabase_anon_key
```

> Note: Replace placeholder values with real credentials. Do not commit `.env` to source control.

### Install dependencies
From repo root run:
```bash
# Backend
cd ags-backend
npm install

# Frontend
cd ../ags-frontend
npm install
```

### Run in development (two terminals)
```bash
# Terminal 1 - backend
cd ags-backend
npm start

# Terminal 2 - frontend
cd ags-frontend
npm run dev
```

- Frontend (Vite) default port: 5173 (may open at 5173/5174 depending on local machine). The frontend uses `VITE_BACKEND_URL` to call the backend.
- Backend listens on port defined in `.env` (default 5001).

### Quick verification steps
1. Open frontend: `http://localhost:5173` (or Vite-provided URL).
2. Register or sign in (Google sign-in requires valid client ID matching redirect URL).
3. Add items to cart, proceed to checkout, place order.
4. Visit `/orders` to see order history.
5. Login as admin and visit `/admin/orders` to modify status.

---

## Project structure (high level)
```
/ (repo root)
├─ ags-backend/         # Express API
│  ├─ controllers/      # Business logic per resource
│  ├─ models/           # Mongoose models (User, Product, Order, Review, OTP)
│  ├─ routes/           # Route definitions (user, product, order, review)
│  ├─ index.js          # Server entrypoint (JWT middleware + route mounting)
│  └─ package.json

├─ ags-frontend/        # React application (Vite + Tailwind)
│  ├─ src/
│  │  ├─ components/    # Reusable UI components (Header, ProductCard, Loading...)
│  │  ├─ pages/         # Route pages (client & admin)
│  │  ├─ utils/         # cart helper, media uploads
│  │  └─ main.jsx
│  └─ package.json

└─ README.md
```

---

## API summary (essential endpoints)
- `POST /api/user/` — Register
- `POST /api/user/login` — Login (email/password)
- `POST /api/user/login/google` — Login with Google (backend validates Google access token)
- `GET /api/products/` — Get all products
- `GET /api/products/:productId` — Get product
- `POST /api/orders` — Create order (auth required)
- `GET /api/orders` — Get orders (user sees own orders; admin sees all)
- `PUT /api/orders/:orderId/:status` — Update order status (admin only)
- `POST /api/reviews` — Create review (auth required)

Refer to the controllers in `ags-backend/controllers/` for request/response shapes. The `Order` model uses `products` array with fields `{ productId, name, images, price, labelledPrice, quantity }`.

---

## Data model highlights
- `Order` contains `orderId`, `email`, `name`, `address`, `phone`, `products[]`, `total`, `labelledTotal`, `status`, `date`.
- `Product` includes `productId`, `name`, `description`, `price`, `labelledPrice`, `images`, `stock`, `isAvailable`.
- `User` contains `email`, `firstName`, `lastName`, `password` (hashed), `role`.

---

## Deployment notes
- Build frontend: `cd ags-frontend && npm run build`.
- Host frontend assets on static hosting (Vercel) and point API calls to the deployed backend.
- For backend: use render.com
- Configure Google OAuth redirect URIs to match production domain.

---

## Contribution guidelines
- Fork and create a feature branch: `feature/your-feature-name`.
- Add tests for your change.
- Open PR with clear description and link to issues.
- Keep scope small and focused per PR.

---

## License
Add MIT License for better quality and originality.

---
