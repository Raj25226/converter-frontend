# unimorpher — Frontend

A modern, full-featured file conversion web application built with **Next.js 14**, **React 18**, and **TypeScript**. Supports PDF, image, audio, and video conversion with user accounts, daily quotas, analytics, and an admin dashboard.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the App](#running-the-app)
- [Supported Converters](#supported-converters)
- [Pages & Routes](#pages--routes)
- [Components](#components)
- [Utility Libraries](#utility-libraries)
- [Dark Mode](#dark-mode)
- [Quota System](#quota-system)
- [Authentication Flow](#authentication-flow)
- [Analytics](#analytics)
- [SEO](#seo)
- [Deployment](#deployment)
- [Backend Requirements](#backend-requirements)
- [Contributing](#contributing)

---

## Features

### File Conversion
- 15 converter types across documents, images, audio, video, and utilities
- Drag-and-drop or click-to-upload interface
- Real-time upload progress bar
- Instant download on completion
- Files auto-deleted from server after 30 minutes
- File type and size validation (50MB max)
- Share button (Web Share API with clipboard fallback)

### User Accounts
- Register with email & password
- Email verification on signup
- Login / logout with JWT authentication
- Google OAuth sign-in
- Forgot password / reset password via email
- Edit profile (name, email)
- Change password

### Dashboard
- View recent conversion history (local, filtered by 30-min expiry)
- Re-download converted files (while link is active)
- Delete individual records or clear all history
- Daily quota usage visualized as a progress bar
- Account plan display

### Quota System
- **Guests:** 2 conversions per day
- **Logged-in users:** 10 conversions per day
- Quota resets at midnight (tracked in `localStorage`)
- Enforced client-side before upload; backend should enforce server-side too

### Admin Dashboard (`/admin`)
- Restricted to users with `role: "admin"`
- View total visits, conversions, unique visitors, and conversion rate
- Per-tool usage bar chart
- Recent user list
- System configuration overview

### Analytics
- Homepage stats widget (total visits, files converted, unique visitors, conversion rate)
- Session-deduped visit tracking (once per 30-minute session)
- Conversion event tracking per tool type
- Falls back to placeholder numbers if backend is unavailable

### SEO
- Per-page `<title>` and `<meta description>` via Next.js Metadata API
- FAQ schema (JSON-LD) on homepage
- Auto-generated `sitemap.xml` and `robots.txt`
- Tool-specific pages with individual metadata

### UI/UX
- Light and dark mode with zero flash on load (inline script in `<head>`)
- Fully responsive — mobile, tablet, desktop
- Custom fonts: **Plus Jakarta Sans** (body) + **Syne** (headings)
- CSS custom properties for consistent theming
- Smooth animations and micro-interactions

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 3 + CSS custom properties |
| HTTP client | Axios |
| Icons | Lucide React |
| Auth | JWT (stored in `localStorage`) + Google OAuth |
| State | React `useState` / `useEffect` (no external state library) |
| Fonts | Google Fonts (Plus Jakarta Sans, Syne) |

---

## Project Structure

```
src/
├── app/                          # Next.js App Router pages
│   ├── layout.tsx                # Root layout — fonts, theme init script, metadata
│   ├── page.tsx                  # Homepage — hero, analytics, converter grid, FAQ
│   ├── globals.css               # Global styles, Tailwind layers, CSS variables
│   ├── sitemap.ts                # Auto-generated sitemap.xml
│   ├── robots.ts                 # Auto-generated robots.txt
│   │
│   ├── login/page.tsx            # Login form
│   ├── signup/page.tsx           # Signup form with password strength indicator
│   ├── forgot-password/page.tsx  # Request password reset email
│   ├── reset-password/page.tsx   # Reset password with token
│   ├── dashboard/page.tsx        # User conversion history + quota
│   ├── profile/page.tsx          # Edit profile + change password
│   ├── admin/page.tsx            # Admin dashboard (role-gated)
│   │
│   ├── blog/page.tsx             # Blog listing page
│   ├── about/page.tsx            # About page
│   ├── privacy/page.tsx          # Privacy policy
│   ├── terms/page.tsx            # Terms of service
│   │
│   ├── pdf-to-word/page.tsx      # ─┐
│   ├── word-to-pdf/page.tsx      #  │
│   ├── jpg-to-png/page.tsx       #  │
│   ├── png-to-jpg/page.tsx       #  │  Each is a thin wrapper around
│   ├── jpg-to-webp/page.tsx      #  │  <FileConverter> with its own
│   ├── mp4-to-mp3/page.tsx       #  │  title, endpoint, and accepted
│   ├── excel-to-pdf/page.tsx     #  │  formats configured
│   ├── pdf-to-excel/page.tsx     #  │
│   ├── ppt-to-pdf/page.tsx       #  │
│   ├── heic-to-jpg/page.tsx      #  │
│   ├── webp-to-png/page.tsx      #  │
│   ├── mp4-to-gif/page.tsx       #  │
│   ├── wav-to-mp3/page.tsx       #  │
│   ├── zip-extract/page.tsx      #  │
│   └── file-compress/page.tsx    # ─┘
│
├── components/
│   ├── FileConverter.tsx         # Core upload/convert/download UI component
│   ├── Navbar.tsx                # Sticky nav with theme toggle, quota, user menu
│   ├── Footer.tsx                # Site-wide footer with all links
│   └── Analytics.tsx            # Homepage stats widget + trackConversion helper
│
└── lib/
    ├── auth.ts                   # User helpers, token helpers, local history CRUD
    ├── quota.ts                  # Daily quota tracking (localStorage)
    └── theme.ts                  # Theme read/apply utilities (fixes dark mode flash)
```

---

## Prerequisites

- **Node.js** 18 or higher
- **npm** 9+ or **yarn** 1.22+
- A running **backend API** on port `8080` (see [Backend Requirements](#backend-requirements))

---

## Installation

**1. Clone the repository**
```bash
git clone https://github.com/Raj25226/converter-frontend
cd converter-frontend
```

**2. Install dependencies**
```bash
npm install
```

**3. Set up environment variables**

Copy the example env file and fill in your values:
```bash
cp .env .env.local
```

Then edit `.env.local` (see [Environment Variables](#environment-variables) below).

**4. Start the development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Environment Variables

Create a `.env.local` file in the project root:

```env
# ─── Required ────────────────────────────────────────────────────────────────

# Your Google OAuth Client ID
# Get from: https://console.cloud.google.com/ → Credentials → OAuth 2.0 Client IDs
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id_here.apps.googleusercontent.com

# URL of your backend API (must be running before starting the frontend)
NEXT_PUBLIC_API_URL=http://localhost:8080

# ─── Optional ─────────────────────────────────────────────────────────────────

# App display name and URL
NEXT_PUBLIC_APP_NAME=unimorpher
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Google Analytics (uncomment to enable)
# NEXT_PUBLIC_GA_TRACKING_ID=UA-XXXXXXXXX-X

# Sentry error tracking (uncomment to enable)
# NEXT_PUBLIC_SENTRY_DSN=https://xxxxx@xxxxx.ingest.sentry.io/xxxxx
```

> **Note:** All `NEXT_PUBLIC_` variables are embedded into the browser bundle at build time. Never put secrets (JWT secret, database passwords, etc.) in `NEXT_PUBLIC_` variables.

---

## Running the App

| Command | Description |
|---|---|
| `npm run dev` | Start development server at `localhost:3000` with hot reload |
| `npm run build` | Build production bundle |
| `npm start` | Start production server (requires `npm run build` first) |
| `npm run lint` | Run ESLint |

---

## Supported Converters

### Documents
| Route | Input | Output |
|---|---|---|
| `/pdf-to-word` | `.pdf` | `.docx` |
| `/word-to-pdf` | `.docx`, `.doc` | `.pdf` |
| `/pdf-to-excel` | `.pdf` | `.xlsx` |
| `/excel-to-pdf` | `.xlsx`, `.xls` | `.pdf` |
| `/ppt-to-pdf` | `.pptx`, `.ppt` | `.pdf` |

### Images
| Route | Input | Output |
|---|---|---|
| `/jpg-to-png` | `.jpg`, `.jpeg` | `.png` |
| `/png-to-jpg` | `.png` | `.jpg` |
| `/jpg-to-webp` | `.jpg`, `.jpeg` | `.webp` |
| `/webp-to-png` | `.webp` | `.png` |
| `/heic-to-jpg` | `.heic`, `.heif` | `.jpg` |

### Media & Utilities
| Route | Input | Output |
|---|---|---|
| `/mp4-to-mp3` | `.mp4`, `.mov`, `.avi` | `.mp3` |
| `/mp4-to-gif` | `.mp4`, `.mov` | `.gif` |
| `/wav-to-mp3` | `.wav` | `.mp3` |
| `/zip-extract` | `.zip`, `.rar`, `.7z` | `.zip` |
| `/file-compress` | `.jpg`, `.png`, `.pdf` | compressed original format |

---

## Pages & Routes

| Route | Auth required | Description |
|---|---|---|
| `/` | No | Homepage — hero, stats, converter grid, FAQ |
| `/login` | No | Login with email/password |
| `/signup` | No | Register new account |
| `/forgot-password` | No | Request password reset |
| `/reset-password` | No | Set new password via email token |
| `/dashboard` | Yes | Conversion history, quota, account info |
| `/profile` | Yes | Edit name, email, password |
| `/admin` | Yes (admin role) | Admin stats, users, tool usage |
| `/blog` | No | Blog article listing |
| `/about` | No | About page |
| `/privacy` | No | Privacy policy |
| `/terms` | No | Terms of service |
| `/<converter>` | No | Individual converter pages (15 total) |

---

## Components

### `FileConverter` — `src/components/FileConverter.tsx`

The core upload/convert/download component used by all 15 converter pages.

**Props:**

| Prop | Type | Required | Description |
|---|---|---|---|
| `title` | `string` | ✓ | Page heading (e.g. "PDF to Word Converter") |
| `description` | `string` | ✓ | Subheading text |
| `endpoint` | `string` | ✓ | API path suffix (e.g. `"/pdf-to-word"`) → calls `POST /api/convert/pdf-to-word` |
| `acceptedFormats` | `string` | ✓ | HTML `accept` attribute (e.g. `".pdf"`) |
| `icon` | `ReactNode` | — | Icon shown in the header (defaults to Upload icon) |
| `gradient` | `string` | — | Tailwind gradient classes for the header (default: `"from-blue-600 to-violet-600"`) |
| `maxSizeMB` | `number` | — | Max upload size in MB (default: `50`) |
| `faqItems` | `{ q: string; a: string }[]` | — | FAQ section rendered below the converter card |

**Example usage:**
```tsx
// src/app/pdf-to-word/page.tsx
import FileConverter from "@/components/FileConverter";
import { FileText } from "lucide-react";

export default function Page() {
  return (
    <FileConverter
      title="PDF to Word Converter"
      description="Convert PDF documents to editable Word files"
      endpoint="/pdf-to-word"
      acceptedFormats=".pdf"
      icon={<FileText className="w-8 h-8" />}
      gradient="from-blue-500 to-blue-600"
      faqItems={[
        { q: "Is my file safe?", a: "Files are auto-deleted after 30 minutes." }
      ]}
    />
  );
}
```

**What it handles internally:**
- Drag-and-drop and click-to-browse file selection
- File size validation before upload
- Quota check before upload (blocks if daily limit reached)
- Axios POST with upload progress tracking
- Success state with download button
- Error display with sign-up prompt if quota is exhausted
- Saves to local conversion history on success
- Tracks analytics event on success
- Share button (native share or clipboard copy)

---

### `Navbar` — `src/components/Navbar.tsx`

Sticky top navigation bar. Reads user and theme from `localStorage` on mount.

Features: logo, nav links, remaining quota display, dark/light mode toggle, user menu (dashboard, profile, logout) or login/signup buttons. Fully responsive with a hamburger menu on mobile.

---

### `Footer` — `src/components/Footer.tsx`

Site-wide footer with columns for document converters, image converters, media/utilities, and company links. Includes security badges and social icons.

---

### `Analytics` — `src/components/Analytics.tsx`

Displays four stat cards on the homepage (total visits, files converted, unique visitors, conversion rate). Tracks a visit on mount (deduplicated per 30-minute session window using `sessionStorage`).

Also exports `trackConversion(converterType: string)` — called by `FileConverter` after a successful conversion.

---

## Utility Libraries

### `src/lib/auth.ts`

Helpers for reading/writing auth data from `localStorage`:

```ts
getUser()                    // → User | null
getToken()                   // → string | null
logout()                     // removes token + user from localStorage
isLoggedIn()                 // → boolean
isAdmin()                    // → boolean (checks role === 'admin')

// Conversion history (local, TTL-filtered)
saveConversionHistory(record)
getConversionHistory()       // → ConversionRecord[] (expired ones filtered out)
deleteConversionRecord(id)
clearConversionHistory()
```

**`ConversionRecord` shape:**
```ts
interface ConversionRecord {
  id: string;
  type: string;        // e.g. "pdf-to-word"
  fileName: string;
  downloadUrl?: string;
  timestamp: number;   // ms since epoch
  expiresAt: number;   // timestamp + 30 min
}
```

---

### `src/lib/quota.ts`

Client-side daily conversion quota:

```ts
getQuotaData()                     // → { count, date }
incrementQuota()                   // called after each successful conversion
canConvert(isLoggedIn: boolean)    // → boolean
getRemainingQuota(isLoggedIn)      // → { used, limit, remaining }
```

Limits: guests = **2/day**, logged-in = **10/day**. Auto-resets when the date changes.

---

### `src/lib/theme.ts`

```ts
getInitialTheme()             // reads localStorage or prefers-color-scheme
applyTheme(theme: Theme)      // adds/removes 'dark' class on <html>, saves to localStorage
```

The theme is also initialized synchronously in `layout.tsx` via an inline `<script>` tag to prevent the flash of wrong theme on page load.

---

## Dark Mode

The dark mode implementation has two parts working together:

**1. Inline script in `layout.tsx`** (runs before React hydrates):
```html
<script>
  var saved = localStorage.getItem('theme');
  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  var theme = saved || (prefersDark ? 'dark' : 'light');
  if (theme === 'dark') document.documentElement.classList.add('dark');
</script>
```
This prevents the white flash that occurs if you wait for React to apply the theme.

**2. `applyTheme()` in `src/lib/theme.ts`:**
```ts
// Correctly adds or removes the class — more reliable than classList.toggle(bool)
if (theme === 'dark') {
  root.classList.add('dark');
} else {
  root.classList.remove('dark');
}
```

**Theming approach:** CSS custom properties (`--bg`, `--fg`, `--card`, etc.) are defined for both `:root` (light) and `.dark` (dark). Components use `style={{ background: "rgb(var(--bg))" }}` or Tailwind's `dark:` variants for theme-aware styling.

---

## Quota System

The quota is tracked entirely in the browser via `localStorage` (key: `fc_quota`).

```
Guest users:       2 conversions / day
Logged-in users:  10 conversions / day
```

**How it works:**
1. On component mount, `FileConverter` reads remaining quota and displays it in a progress bar
2. When the user clicks **Convert**, `canConvert()` is called first
3. If quota is exhausted → show error with a sign-up CTA, block the upload
4. On successful conversion → `incrementQuota()` is called, quota display updates
5. Quota automatically resets on a new calendar day

> **Important:** This is a client-side guard for UX purposes. Your backend should independently enforce rate limits per IP or user account.

---

## Authentication Flow

```
User submits login form
        │
        ▼
POST /api/auth/login
        │
        ├─ emailVerified: false  ──→  Show verification warning
        │
        └─ success  ──→  Store token + user in localStorage
                                │
                                ▼
                        Navbar reads user from localStorage
                        Quota limit updated to 10/day
                        Dashboard and Profile pages become accessible
```

**JWT storage:** The token is stored in `localStorage` under the key `token`. It is sent as `Authorization: Bearer <token>` on all protected API calls.

**Protected page pattern:**
```tsx
useEffect(() => {
  const user = getUser();
  if (!user) router.push('/login');
}, []);
```

---

## Analytics

The `Analytics` component on the homepage:
1. **On mount:** calls `POST /api/analytics/track-visit` once per 30-minute session (tracked in `sessionStorage`)
2. **Every render:** calls `GET /api/analytics/stats` and displays the returned numbers
3. **On conversion success:** `FileConverter` calls `trackConversion(converterType)` → `POST /api/analytics/track-conversion`

If the backend is unavailable, the analytics component falls back to placeholder numbers so the homepage still renders correctly.

---

## SEO

| Feature | Implementation |
|---|---|
| Per-page titles | `export const metadata: Metadata = { title: "...", description: "..." }` in each `page.tsx` |
| Default title template | `"%s \| unimorpher"` set in root `layout.tsx` |
| FAQ schema | JSON-LD `FAQPage` schema in `src/app/page.tsx` |
| Sitemap | `src/app/sitemap.ts` → auto-served at `/sitemap.xml` |
| Robots.txt | `src/app/robots.ts` → auto-served at `/robots.txt` |
| Open Graph | Set in root `layout.tsx` metadata |

---

## Deployment

### Vercel (Recommended)

```bash
# 1. Push to GitHub
git push origin main

# 2. Import project at vercel.com
# 3. Add environment variables in Vercel dashboard:
#    NEXT_PUBLIC_GOOGLE_CLIENT_ID
#    NEXT_PUBLIC_API_URL  (your production backend URL)
#    NEXT_PUBLIC_APP_URL  (your production frontend URL)

# 4. Deploy — done!
```

### Docker

```dockerfile
# Dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
RUN npm ci --only=production
EXPOSE 3000
CMD ["npm", "start"]
```

```bash
docker build -t fileconvert-frontend .
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL=http://your-backend:8080 \
  -e NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_client_id \
  fileconvert-frontend
```

### Manual (VPS / bare metal)

```bash
npm run build
npm start
# Or use PM2:
pm2 start "npm start" --name fileconvert-frontend
```

---

## Backend Requirements

The frontend proxies all `/api/*` requests to the backend via `next.config.js`:

```js
rewrites: () => [{
  source: '/api/:path*',
  destination: `${process.env.NEXT_PUBLIC_API_URL}/api/:path*`
}]
```

The backend must run at the URL set in `NEXT_PUBLIC_API_URL` (default: `http://localhost:8080`).

**Quick reference of required endpoints:**

| Method | Endpoint | Auth | Purpose |
|---|---|---|---|
| POST | `/api/auth/signup` | No | Register |
| POST | `/api/auth/login` | No | Login |
| POST | `/api/auth/google` | No | Google OAuth |
| POST | `/api/auth/forgot-password` | No | Request reset |
| POST | `/api/auth/reset-password` | No | Reset with token |
| PUT | `/api/auth/profile` | JWT | Update profile |
| POST | `/api/auth/change-password` | JWT | Change password |
| POST | `/api/convert/<type>` | No | File conversion (15 types) |
| GET | `/api/download/:fileId` | No | Download converted file |
| POST | `/api/analytics/track-visit` | No | Track page visit |
| POST | `/api/analytics/track-conversion` | No | Track conversion event |
| GET | `/api/analytics/stats` | No | Get aggregate stats |
| GET | `/api/admin/stats` | JWT (admin) | Admin stats |
| GET | `/api/admin/users` | JWT (admin) | User list |

For full request/response shapes, validation rules, database schema, and Java dependencies, see **[BACKEND_REQUIREMENTS.md](./BACKEND_REQUIREMENTS.md)**.

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m "feat: add my feature"`
4. Push: `git push origin feature/my-feature`
5. Open a pull request

**Adding a new converter:**

1. Create the directory: `src/app/<from>-to-<to>/`
2. Add `page.tsx` using `FileConverter`:
```tsx
import FileConverter from "@/components/FileConverter";
export default function Page() {
  return (
    <FileConverter
      title="X to Y Converter"
      description="Convert X files to Y format"
      endpoint="/x-to-y"
      acceptedFormats=".x"
      gradient="from-blue-500 to-violet-600"
    />
  );
}
```
3. Add it to the converter grid in `src/app/page.tsx`
4. Add a backend endpoint `POST /api/convert/x-to-y`
5. Add the route to `src/app/sitemap.ts`

---

## License

© unimorpher