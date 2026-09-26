# PawID - Animal Identity & Community-Care REST API

**PawID** is an open community-care platform empowering cities, shelters, and volunteers to manage street and community animals through digital identities, physical QR collar tags, health history tracking, and voluntary community sighting reports.

---

## 🌟 Features & Business Rules

1. **Animal Identity & PawIDs**: Every registered animal is assigned an unpredictable, human-readable PawID (e.g. `PAW-NP-A8F42K`).
2. **Cryptographic QR Tokens & Public Profiles**: Physical QR tags embed a unique, random QR token that resolves to a public web profile (`https://pawid.org/d/{qrToken}`).
3. **Strict Location Privacy Model**:
   - **QR Scan Consent Rule**: Scanning a QR code does **NOT** collect the scanner's location.
   - **Voluntary Submissions Only**: Location is captured ONLY when a user explicitly submits a sighting and approves `voluntarilySharedLocation: true`.
   - **Coordinate Protection**: Exact private registration coordinates are strictly hidden from public API responses.
4. **Role-Based Access Control (RBAC)**: Server-enforced permissions for `ADMIN` (dashboard, analytics, user management, QR regeneration, report moderation) and `VOLUNTEER` (dog registration, health record creation, sighting reporting).
5. **Health Records**: Detailed health logs (vaccinations, sterilizations, treatments) with explicit distinction between volunteer-submitted and admin-verified records.
6. **Community Sightings & Reports**: Public and authenticated users can submit sightings and emergency reports (injured, missing, abuse).
7. **Admin Dashboard Analytics**: Real-time aggregated statistics (total dogs, active, missing, vaccinated, sterilized, weekly sightings, pending reports, audit activity log).

---

## 🛠️ Technology Stack

- **Runtime**: Node.js v20+
- **Framework**: Express.js
- **Language**: TypeScript (Strict Mode)
- **Database**: MongoDB with Mongoose ODM (GeoJSON 2dsphere indexing)
- **Validation**: Zod
- **Authentication**: JWT (Access Token + DB-persisted Refresh Token) & bcryptjs
- **Security**: Helmet, CORS, Express-Rate-Limit (tiered limiters)
- **QR Generation**: QRCode (Base64 Data URLs & SVG)
- **File Uploads**: Multer
- **Testing**: Vitest + Supertest + MongoDB Memory Server
- **Containerization**: Docker & Docker Compose
- **API Spec**: OpenAPI 3.0 (Swagger)

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18+)
- MongoDB (v6.0+) running locally or via Docker

### 1. Installation
```bash
# Install dependencies
npm install
```

### 2. Environment Configuration
Copy the sample environment file:
```bash
cp .env.example .env
```
Ensure variables such as `MONGODB_URI`, `JWT_ACCESS_SECRET`, and `JWT_REFRESH_SECRET` are configured.

### 3. Database Seeding
Seed the database with default demo accounts (`admin@example.test`, `volunteer@example.test`), 5 sample dogs, sightings, and health records:
```bash
npm run seed
```

### 4. Running the Development Server
```bash
npm run dev
```
The server will start at `http://localhost:5000/api/v1`.

### 5. Running Tests
Run full test suite with Vitest in-memory MongoDB:
```bash
npm test
```

### 6. Building for Production
```bash
npm run build
npm start
```

---

## 🐳 Docker Setup

Run PawID API and MongoDB in containerized environment:

```bash
docker-compose up --build -d
```

---

## 📖 API Documentation

The OpenAPI 3.0 specification is available at [docs/openapi.json](file:///home/socialworker/Desktop/pawid/docs/openapi.json).

### Key Endpoints Overview

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/auth/register` | Public | Register Volunteer account |
| `POST` | `/api/v1/auth/login` | Public | Authenticate user & get JWT tokens |
| `GET` | `/api/v1/public/dogs/:qrToken` | Public | Get safe public dog profile |
| `POST` | `/api/v1/public/dogs/:qrToken/sightings` | Public | Submit voluntary sighting |
| `GET` | `/api/v1/public/dogs/nearby` | Public | Find nearby dogs by coordinates |
| `POST` | `/api/v1/dogs` | Volunteer / Admin | Register new dog + generate PawID & QR token |
| `POST` | `/api/v1/dogs/:id/qr/regenerate` | Admin | Invalidate old QR token & generate new one |
| `GET` | `/api/v1/admin/dashboard` | Admin | Get dashboard analytics & recent audit log |

---

## 🔒 Security & Privacy Architecture

- **No Passwords Saved Plaintext**: Password hashing with `bcryptjs`.
- **JWT Payload Minimization**: JWT contains only `{ sub: userId, role: role }`.
- **Rate Limiting**: Tiered limiters for authentication endpoints, public sightings, reports, and global API routes.
- **Strict Input Validation**: Zod middleware sanitizes all request parameters, queries, and request bodies.
- **Audit Logging**: Sensitive administrative actions (dog creation, deactivation, QR regeneration, role changes) are recorded in `AuditLog`.
