# Avanaa — Glowy Square Online Shopping Mart

Professional README for the Avanaa Glowy Square e‑commerce project.

This document is written to be comprehensive and actionable for developers, operators, and stakeholders. It explains the problem, solution choices, architecture, setup, operational runbook, testing, known issues, and future improvements.

---

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

## Why this solution (rationale)
- **MERN stack (React + Express + MongoDB)**: Well-suited for rapid development of full-stack JS apps. Uses the same language (JavaScript/TypeScript optional) across tiers.
- **Monorepo layout**: Keeping frontend and backend together simplifies local development, versioning and CI while avoiding the operational complexity of multiple microservices for a starter app.
- **Vite + React**: Fast dev server and modern build optimizations, good DX.
- **Express + Mongoose**: Lightweight API layer and convenient schema handling for MongoDB.
- **JWT auth + sessionStorage**: Provides stateless server sessions with client-side session control; sessionStorage is used intentionally to avoid persistent login across browser closes in this implementation (can be switched to localStorage for persistent login).
- **Tailwind CSS**: Utility-first approach for quick, consistent responsive styles.

This combination balances developer productivity, performance, and a realistic feature set for an e-commerce starter product.

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

## Challenges faced
This project evolved from multiple feature requests and bug reports. Notable challenges included:
1. Authentication consistency: token storage mismatches between frontend components (some used `localStorage`, others `sessionStorage`). This resulted in Google sign-in appearing successful but the app not recognizing the logged-in state.
2. Cart persistence and real-time badge updates: cart state persisted in `localStorage` but header badge required a reliable event to update across components.
3. Order creation failures: frontend called a non-matching endpoint (`/api/orders/user`) while backend expected `/api/orders`. This caused Axios errors on checkout.
4. Order status synchronization: admin UI allowed invalid status values (typos and unsupported values), causing 400 errors from backend validation.
5. Header / layout overlap issues: fixed by consistent page padding (pt-20) to account for fixed header.
6. Mobile/desktop UX inconsistencies (various small layout issues across pages).

---

## How these challenges were solved
This section captures the concrete fixes, refactors, and process decisions that addressed the above issues.

1. **Authentication mismatch**
   - Replaced all `localStorage` token reads/writes/removes with `sessionStorage` to implement the desired session behavior (auto-logout on tab close).
   - Updated Google OAuth callback handlers to store tokens in `sessionStorage`.
   - Updated other pages (admin and client) to read token from `sessionStorage` consistently.

2. **Cart badge real-time updates**
   - Implemented an event-based update: `window.dispatchEvent(new Event('cartUpdated'))` in `utils/cart.js` (`addToCart`, `removeFromCart`) and after checkout when cart is cleared.
   - Header listens for `cartUpdated` and `storage` events to refresh counts immediately.

3. **Order creation endpoint mismatch**
   - Fixed frontend to POST to `/api/orders` (backend implementation existed) and updated the order history fetch to use `/api/orders`.
   - Standardized response handling (frontend now expects `response.data` where backend returns JSON payload).

4. **Order status validation errors**
   - Aligned admin UI status options with backend allowed values: `pending`, `processing`, `shipped`, `delivered`, `cancelled` (correct spelling) and removed invalid options like `completed`/`returned`.
   - Converted frontend status displays to use lowercase checks (or `toLowerCase()`) so case mismatches don't show wrong styling.

5. **Header overlap and layout fixes**
   - Added `pt-20` on main page containers to prevent content being hidden behind the fixed header.
   - Centralized header styling and fixed mobile drawer behavior.

6. **Mobile/UX polish**
   - Applied responsive Tailwind classes across components, added sticky bottom action bars for mobile, and adjusted spacing.

All changes were made in the frontend files only (no backend code was modified) unless needed to add or align endpoints. The fixes were validated locally with the dev server and manual interaction flows.

---

## What I would improve next (roadmap & suggested enhancements)
These are practical next steps that would extend the product toward production-readiness and better UX.

### Priority: Production-readiness
1. **Payment integration** — Add Stripe (or another provider) to handle payments safely and record paid orders.
2. **Inventory & stock control** — Prevent overselling and decrement stock on checkout; add admin stock alerts.
3. **Rate limiting & security** — Add request throttling, input sanitization, and stronger validation.
4. **Email & notifications** — Order confirmation emails and status change notifications (e.g., via Nodemailer or transactional email provider).
5. **CI & CD pipelines** — Add GitHub Actions for lint/test/build and automated deployments.

### Medium-term improvements
1. **Analytics & admin dashboard** — Sales charts, product performance, user activity.
2. **Role-based access control (RBAC)** — More granular permissions for operators.
3. **Caching & performance** — Add Redis caching for hot endpoints, optimize DB indexes.
4. **E2E tests** — Add Playwright or Cypress tests for key flows (login, add to cart, checkout).
5. **Internationalization (i18n)** — Multi-language support and currency formatting.

### Long-term / nice-to-have
1. **Microservice split** — If scale demands, split payments, products and orders into independent services.
2. **Real-time features** — WebSockets or server-sent events for real-time order updates.
3. **Search engine** — Integrate Elasticsearch or Algolia for fast product search and autocomplete.

---

## Getting started (development)
This repo contains `ags-backend` and `ags-frontend`. No code changes are required for the README.

### Prerequisites
- Node.js (v18+ recommended)
- npm (or yarn)
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

## Testing and verification
- Manual flows validated: registration/login (email + Google), add to cart, checkout, order creation, order history, admin status updates, product CRUD, review posting.
- Add automated tests:
  - Unit tests for controllers (Jest)
  - Integration tests for API (Supertest)
  - E2E tests (Cypress/Playwright)

---

## Deployment notes
- Build frontend: `cd ags-frontend && npm run build`.
- Host frontend assets on static hosting (Netlify, Vercel, S3, etc.) and point API calls to the deployed backend.
- For backend: use process manager (PM2) or containerize with Docker; ensure environment variables are set securely.
- Configure Google OAuth redirect URIs to match production domain.

---

## Troubleshooting & common fixes
- **403 Forbidden (Invalid token)**: Verify `JWT_KEY` matches and token is sent as `Authorization: Bearer <token>`.
- **Axios 400 on order status**: Ensure admin sends only allowed statuses: `pending`, `processing`, `shipped`, `delivered`, `cancelled`.
- **Google sign-in but not logged in**: Ensure token storage is consistent (project uses `sessionStorage`); also check `VITE_GOOGLE_CLIENT_ID` and OAuth redirect URIs.
- **Cart badge not updating**: Ensure cart operations dispatch `cartUpdated` event and header listens for it.

---

## Contribution guidelines
- Fork and create a feature branch: `feature/your-feature-name`.
- Add tests for your change.
- Open PR with clear description and link to issues.
- Keep scope small and focused per PR.

---

## License
This project uses the ISC license (check `package.json`). Replace or update license text to match your policy.

---

## Final notes
This README captures the current state of the repository and the engineering decisions made during development. If you want, I can:
- Add an `EXPORT.md` with API contract examples (sample requests/responses)
- Add `docker-compose` files for local dev with MongoDB
- Add E2E test skeletons (Cypress)

If you'd like any changes to tone, level of detail, or additional sections (e.g., API examples, sequence diagrams), tell me which parts to expand and I will update the README accordingly.
