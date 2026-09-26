# PAWID Frontend Platform

> **"Every Paw Has an Identity."**

PawID is a nonprofit animal identity, community reporting, and welfare platform focused on street and community animals in Nepal and beyond.

---

## 🚀 Key Features & Architecture

- **Public Website (No Login Required)**
  - Home landing page with live statistics and 4-step workflow.
  - Interactive **Community Animal Map** powered by Leaflet.
  - Public Community Dog Directory with search & filters.
  - Volunteer onboarding & Contact pages.
- **Fast Mobile QR Scan Flow (`/d/:qrToken`)**
  - Instant mobile loading without popups or login requirements.
  - Transparent health badges (Vaccination & Sterilization status).
  - Last reported sighting timeline.
  - Voluntary geolocation reporting (`/d/:qrToken/report`) with explicit consent controls.
  - Incident & problem reporting (`/d/:qrToken/report-problem`).
- **Protected Admin & Volunteer Portal (`/dashboard`)**
  - Secure JWT authentication (`/login`).
  - Dog registration with automated PawID generation & printable QR tags.
  - Incident report triage & sighting moderation.
  - Verified veterinary health record logger.

---

## 🔒 Privacy & Governance Model

1. **Zero Automatic Tracking**: Scanning a tag NEVER collects location or IP address automatically.
2. **Voluntary Reporting**: Geolocation is shared strictly when a citizen explicitly submits a sighting.
3. **Reporter Anonymity**: Exact coordinates and reporter identity are kept confidential and never displayed publicly.
4. **Community Focus**: PawID is designed to help communities care for animals—not to monitor people.

---

## 🛠 Tech Stack

- **Framework**: React 18 + Vite + TypeScript
- **Routing**: React Router v6
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Mapping**: Leaflet + React Leaflet
- **State & Data Fetching**: TanStack Query (React Query)
- **Forms & Validation**: React Hook Form + Zod

---

## 📦 Installation & Setup

1. **Navigate to the frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   Set your API endpoint:
   ```env
   VITE_API_URL=http://localhost:5000/api/v1
   ```

4. **Run Development Server**:
   ```bash
   npm run dev
   ```

5. **Build for Production**:
   ```bash
   npm run build
   ```

---

## 📂 Project Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── router.tsx
│   │   └── providers.tsx
│   ├── components/
│   │   ├── layout/       (Navbar, Footer)
│   │   ├── ui/           (Button, Card, Badge, Modal, Input)
│   │   ├── dog/          (DogCard, DogProfileCard)
│   │   ├── map/          (CommunityMap, LocationPicker)
│   │   ├── sighting/     (SightingTimeline)
│   │   ├── health/       (HealthBadge)
│   │   └── common/       (Logo, StatsCard, EmptyState, LoadingState)
│   ├── pages/            (20 Public & Dashboard pages)
│   ├── services/         (API, Auth, Dog, Sighting, Report, Health)
│   ├── hooks/            (useAuth, useDog, useSightings, useLocation)
│   ├── types/            (TypeScript data interfaces)
│   ├── lib/              (utils, Zod schemas)
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── index.html
├── package.json
├── tailwind.config.js
└── vite.config.ts
```
