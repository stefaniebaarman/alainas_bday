# Alaina's Bullpen Birthday Hunt

A mobile-first scavenger hunt web app for Alaina's birthday at **The Bullpen** in Washington, DC. Teams join by name, complete bar challenges with photo proof, and compete on a live leaderboard — no login required.

## Tech stack

- React + Vite + TypeScript
- Firebase Firestore (teams, completions, leaderboard)
- Firebase Anonymous Auth (background only — no user accounts)
- Cloudinary unsigned uploads for photo proof
- GitHub Pages deployment

## Quick start

### 1. Clone and install

```bash
npm install
```

### 2. Environment variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

| Variable | Where to get it |
|----------|-----------------|
| `VITE_FIREBASE_*` | [Firebase Console](https://console.firebase.google.com) → Project settings → Your apps → Web app config |
| `VITE_CLOUDINARY_CLOUD_NAME` | [Cloudinary Dashboard](https://cloudinary.com/console) |
| `VITE_CLOUDINARY_UPLOAD_PRESET` | Cloudinary → Settings → Upload → Upload presets (create an **unsigned** preset) |

### 3. Firebase setup

1. Create a Firebase project (free Spark plan is fine).
2. Enable **Firestore Database** (start in production mode).
3. Enable **Authentication** → Sign-in method → **Anonymous**.
4. Add a **Web app** and copy the config into `.env`.
5. Deploy Firestore rules (Firebase Console → Firestore → Rules):

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /teams/{teamId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if false;
    }
    match /completions/{completionId} {
      allow read: if true;
      allow create: if request.auth != null
        && !exists(/databases/$(database)/documents/completions/$(completionId));
      allow update, delete: if false;
    }
  }
}
```

6. Create composite indexes if prompted by Firebase when you first run the app (single-field indexes are usually auto-created).

### 4. Cloudinary setup

1. Create a free Cloudinary account.
2. Go to **Settings → Upload → Upload presets**.
3. Add preset → set **Signing Mode** to **Unsigned**.
4. Copy the preset name to `VITE_CLOUDINARY_UPLOAD_PRESET`.

### 5. Run locally

```bash
npm run dev
```

Open the URL shown in the terminal (usually `http://localhost:5173`).

## App flow

1. **Landing** — "Join the Hunt" CTA
2. **Team** — enter a team name; existing names join that team (case-insensitive)
3. **Challenges** — complete checklist with optional photo upload per challenge
4. **Leaderboard** — live rankings by total points

Team ID is stored in `localStorage` so users stay on their team between refreshes.

## Customize challenges

Edit `src/data/challenges.ts` to change titles, descriptions, points, and photo requirements.

## Build

```bash
npm run build
npm run preview
```

## Deploy to GitHub Pages

### Option A: GitHub Actions (recommended)

This repo includes `.github/workflows/deploy.yml`.

1. Push the repo to GitHub.
2. Go to **Settings → Pages → Build and deployment** → Source: **GitHub Actions**.
3. Add repository **Secrets** (Settings → Secrets and variables → Actions) for every `VITE_*` variable from `.env.example`.
4. Push to `main` (or run the workflow manually). The workflow sets `VITE_BASE_PATH` to `/<repo-name>/` automatically.

Your site will be at: `https://<username>.github.io/<repo-name>/`

### Option B: Manual deploy

```bash
# Replace Alaina_bday with your actual repo name
VITE_BASE_PATH=/Alaina_bday/ npm run build
```

Then upload the `dist/` folder to GitHub Pages, or use `gh-pages` branch:

```bash
npx gh-pages -d dist
```

Ensure `vite.config.ts` `base` matches your repo path (via `VITE_BASE_PATH`).

## Project structure

```
src/
├── data/challenges.ts    # Challenge definitions
├── lib/
│   ├── firebase.ts       # Firebase init
│   ├── firestore.ts      # Teams, completions, leaderboard
│   ├── cloudinary.ts     # Photo uploads
│   └── storage.ts        # localStorage helpers
├── pages/                # Route pages
├── components/           # UI components
└── hooks/useAuth.tsx     # Anonymous auth
```

## Notes

- No Firebase Storage, backend server, or paid hosting required.
- Photo uploads go directly from the browser to Cloudinary.
- Completion documents use IDs `{teamId}_{challengeId}` to prevent duplicate submissions.

Happy birthday, Alaina! 🎂
