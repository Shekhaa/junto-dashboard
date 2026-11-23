# Junto Operations & Telemetry Dashboard

A production-ready, dark-mode Realtime Operations & Analytics Dashboard for **Junto** (the verified college network), designed to deploy effortlessly on Vercel and consume the Django REST API.

---

## 🎨 Aesthetic & Design System

* **Linear Dark Aesthetic**:
  * Canvas Background: `#0B0F19`
  * Card Surfaces: `#111827`
  * Subtle Borders: `#1F2937`
  * Primary Accent: `#6366F1` (Indigo)
  * Status / Active Indicator: `#10B981` (Emerald Green)
* **Icons**: [Lucide React](https://lucide.dev)
* **Charts**: Recharts with smoothed gradients, peak milestone indicators, and custom tooltips.

---

## 🚀 Core Modules Built

1. **Password Gate (Auth Wall)**:
   * Sleek `/login` portal validating against `DASHBOARD_PASSWORD`.
   * Issues an AES-256 encrypted session cookie (`junto_ops_session`) signed using the Web Crypto API via `jose`.
   * Edge Middleware (`middleware.ts`) protecting all `/dashboard/*` routes and redirecting unauthorized visitors.
2. **Real-Time KPI Ribbon**:
   * **Online Now**: Live active student count with pulsing green beacon (active in last 5 min).
   * **Today's DAU**: Daily active students with day-over-day growth percentage.
   * **Average Session Duration**: Realtime app dwell stickiness (mins/session).
   * **Verification Funnel**: Multi-segment visual progress bar displaying Fully Verified, Semi-Verified, and Pending ID Card OCR states.
3. **Campus Peak Hours Heatmap (24-Hour Area Chart)**:
   * Smoothed 24-hour distribution curve highlighting:
     * *Morning Rush (08:00 - 10:00)*
     * *Canteen Lunch Peak (12:00 - 14:00)*
     * *Hostel Primetime (20:00 - 23:00)*
4. **Student In-Time & Out-Time Telemetry Table**:
   * Searchable by student name or roll number.
   * Filterable by **College**, **Academic Year**, and **Section**.
   * Telemetry columns: Student Name, Roll No, College, Year & Section, In-Time (HH:MM:SS), Out-Time (HH:MM:SS), Duration, Status (🟢 Online / ⚪ Offline).
   * Built-in pagination and One-Click CSV Export.
5. **Content & Community Radar**:
   * Live count of Posts Created Today.
   * Polls Voted Today.
   * Active Chat Messages Exchanged across direct and ephemeral group chats.
6. **Resilient Realtime Polling**:
   * Automated 30-second interval polling with a visual indicator and toggle switch.
   * Instant "Refresh Now" manual trigger button.
   * Backend-For-Frontend (BFF) proxy at `/api/ops/overview` sending `X-Admin-Secret-Key` server-side so keys are **never leaked to browser JavaScript bundles**.
   * Graceful fallback telemetry buffer if backend is temporarily unreachable.

---

## 🛠️ Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

| Variable | Description | Default |
| :--- | :--- | :--- |
| `DASHBOARD_PASSWORD` | Password required to unlock the `/login` gate | `junto-admin-2026` |
| `SESSION_SECRET` | 32+ character key used to sign and encrypt session cookies | `junto-super-secure-encryption-secret-key-32chars-min` |
| `BACKEND_API_URL` | Base URL of your Junto Django REST API | `http://localhost:8000` |
| `BACKEND_OPS_KEY` | Master secret key sent in `X-Admin-Secret-Key` header | `junto-ops-secret-key-2026` |

---

## 💻 Local Setup & Development

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. Enter the password configured in `DASHBOARD_PASSWORD` to unlock the console.

---

## 🚢 Deploying to Vercel

### Option 1: Via Vercel Web Dashboard (Recommended)
1. Push this repository to GitHub / GitLab / Bitbucket:
   ```bash
   git add .
   git commit -m "feat: initial release of Junto Operations Dashboard"
   git remote add origin https://github.com/YOUR_USERNAME/junto-ops-dashboard.git
   git push -u origin main
   ```
2. Go to [vercel.com/new](https://vercel.com/new).
3. Import your `junto-ops-dashboard` repository.
4. In the **Environment Variables** section, set:
   * `DASHBOARD_PASSWORD`
   * `SESSION_SECRET`
   * `BACKEND_API_URL` (e.g. `https://api.junto.app`)
   * `BACKEND_OPS_KEY`
5. Click **Deploy**. Vercel will build and deploy the Next.js App Router application worldwide on the Edge network!

### Option 2: Via Vercel CLI
```bash
npm install -g vercel
vercel
```
