<div align="center">

# 🚀 BloopLabs

**Turn rough ideas into competition-ready projects.**

BloopLabs is an AI-powered innovation platform that helps students frame, validate, and structure their ideas into polished, science-fair-ready submissions.

</div>

---

## ✨ What it does

Got a half-formed idea for a science fair, hackathon, or class project? BloopLabs walks you from a rough concept to a structured, presentable brief:

- 🧠 **AI Research** — Describe your concept in plain English. The AI checks its feasibility, uniqueness, and potential impact instantly.
- 🎯 **Project Builder** — Automatically generates a problem statement, solution summary, methodology, materials list, and expected outcomes, formatted for competitions.
- 🛰️ **Innovation Mentor** — A set of AI tools for idea generation, pitch coaching, project critique, and feasibility checks.
- 📤 **Export Center** — Export your finished project brief as a `.docx` file, ready to submit or print.
- 🔐 **Accounts & Projects** — Sign in with Google or email/password (via Firebase) and manage multiple saved projects from a dashboard.

### How it works

1. **Describe your idea** — Answer a few simple questions about your concept, target audience, and grade level.
2. **AI improves it** — The engine structures your idea, writes a professional problem statement, and suggests materials and steps.
3. **Export & submit** — Review the polished project brief, edit as needed, and export it for your competition or assignment.

---

## 🛠️ Tech stack

| Layer | Tech |
|---|---|
| Frontend | React 19, TypeScript, Vite, React Router, Tailwind CSS v4 |
| AI | Google Gemini API (`@google/genai`), used server-side only |
| Auth & Data | Firebase (Authentication) |
| Backend (local dev) | Express server (`server.ts`) |
| Backend (production) | Netlify Functions (`netlify/functions/api.ts`) |
| Animation / UI | GSAP, Motion, Vanta.js (globe background), Lucide icons |
| Document export | `docx`, `file-saver` |

---

## 📋 Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- A [Google Gemini API key](https://ai.google.dev/)
- A [Firebase](https://firebase.google.com/) project (for authentication)

---

## ⚙️ Setup

**1. Clone the repository**

```bash
git clone <your-repo-url>
cd blooplabs
```

**2. Install dependencies**

```bash
npm install
```

**3. Configure environment variables**

Copy the example env file and fill in your own values:

```bash
cp .env.example .env.local
```

Then edit `.env.local`:

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_MEASUREMENT_ID=
GEMINI_API_KEY=
```

> ⚠️ **Note:** `GEMINI_API_KEY` is used **server-side only** (in `server.ts` / the Netlify function) and is never exposed to the browser. The `VITE_FIREBASE_*` variables configure the Firebase client SDK and are safe to expose in a frontend build, but you should still use your **own** Firebase project's values rather than reusing anyone else's.
>
> 🔒 Never commit `.env.local` (or any file containing real keys) to version control. If a real key has ever been committed to this repo's history, rotate it in the Google/Firebase console — removing it from a later commit does not remove it from git history.

**4. Run the app locally**

```bash
npm run dev
```

This starts the Express dev server (with Vite in middleware mode) at **http://localhost:3000**.

---

## 📦 Available scripts

| Script | Description |
|---|---|
| `npm run dev` | Start the local development server |
| `npm run build` | Build the frontend (Vite) and bundle the server for production |
| `npm start` | Run the production build (`dist/server.cjs`) |
| `npm run preview` | Preview the production Vite build |
| `npm run lint` | Type-check the project with `tsc --noEmit` |
| `npm run clean` | Remove build output |

---

## 🚢 Deployment

This project is configured for **Netlify** out of the box (see `netlify.toml`):

- Build command: `npm run build`
- Publish directory: `dist`
- API routes (`/api/*`) are proxied to a Netlify Function at `netlify/functions/api.ts`
- All other routes fall back to `index.html` (client-side routing via React Router)

To deploy:

1. Push this repository to GitHub.
2. Connect it to [Netlify](https://www.netlify.com/).
3. Add the environment variables from `.env.local` (including `GEMINI_API_KEY`) in your Netlify site's **Environment variables** settings.
4. Deploy 🎉

---

## 📁 Project structure

```
├── server.ts                    # Express server (local dev + production entry)
├── netlify/functions/api.ts     # Serverless API for Netlify deployment
├── src/
│   ├── pages/                   # Route-level pages (Landing, Dashboard, NewProject, etc.)
│   ├── components/               # Shared components (Layout, ProtectedRoute, UI primitives)
│   ├── contexts/AuthContext.tsx  # Firebase auth state
│   ├── hooks/                    # Custom hooks (useProjects, useAiUsage)
│   └── lib/                      # Firebase config & utilities
├── public/                       # Static assets, icons, favicon
└── netlify.toml                  # Netlify build & redirect configuration
```
