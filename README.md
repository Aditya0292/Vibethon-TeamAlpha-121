# NeuroFlow: Tactical Intelligence & Learning OS
**codename: Vibeathon-TeamAlpha**

NeuroFlow is an institutional-grade, military-tactical styled web application built to train, evaluate, and gamify machine learning concepts for elite software operators. Featuring a "liquid glass" dark-mode aesthetic, the platform combines real-time AI code validation, interactive neural network sandboxes, and progression-based mission logs into a unified dashboard interface.

---

## 💻 Tech Stack
- **Framework:** Next.js 14.2 (App Router, Client & Server Components)
- **Styling:** TailwindCSS (Custom scanline overlays, neon accents, tactical UI patterns)
- **Backend/Auth:** Supabase Setup (PostgreSQL, Row Level Security, Auth)
- **Code Execution:** Piston API (Sandboxed Python 3.10 runtime)
- **AI Core (`SYN_INTEL`):** Multi-model ensemble utilizing **Google Gemini 2.0 Flash**, **OpenRouter**, and **xAI Grok** for real-time code evaluation and assistance.

---

## 🏛️ System Architecture

NeuroFlow is architected with a decoupled approach, ensuring high performance and scalability:

- **Frontend (Application Layer):** Built on Next.js 14, leveraging React Server Components for optimized data fetching and Client Components for high-interactivity tactical modules (Canvas, IDE, etc.).
- **Tactical Core (AI Layer):** A sophisticated ensemble routing system that interfaces with multiple LLM providers (Gemini, Grok, OpenRouter). This acts as the "Game Master" / `SYN_INTEL`, providing real-time feedback, code suggestions, and grading.
- **Execution Sandbox:** Integrates with the Piston API to allow operators to run actual Python ML code safely in a sandboxed environment.
- **Data Persistence (Infra Layer):** Supabase handles the heavy lifting for real-time data sync, user authentication, and relational storage of operator metrics (XP, completion states).
- **Security:** Strict Row Level Security (RLS) is implemented on the database level to ensure operator data isolation.

---

## 📂 Project Structure

```bash
vibeathon-teamalpha/
├── app/                    # Next.js App Router (Routes & Layouts)
│   ├── api/               # API Endpoints (Code execution, AI assistance, Quizes)
│   ├── auth/              # Authentication flows (Login, Callback)
│   ├── code-lab/          # Integrated Tactical IDE with Live AI Assist
│   ├── dashboard/         # Core Operator Hub & Analytics
│   ├── games/             # Tactical Modules & Simulations (KNN, Neural Lite)
│   ├── quiz/              # Quiz Arena (Cognitive Profiling & Assessment)
│   ├── layout.tsx         # Global Frame & Scanline overlays
│   └── globals.css        # Tactical Design System & Utility tokens
├── components/             # Reusable UI Architecture
│   ├── dashboard/         # Dashboard-specific units (Sidebar, SkillRadar)
│   ├── AccessTerminal.tsx # Entry Authentication UI
│   ├── HeroContent.tsx    # Primary Landing animations
├── lib/                    # Shared Utilities & Logic Cores
│   ├── gemini.ts          # SYN_INTEL AI Ensemble Logic
│   ├── piston.ts          # Code execution & ML Mission definitions
│   ├── game-constants.ts  # Shared level & dataset telemetry
│   ├── xp.ts              # Operator Progression logic
├── public/                 # Static Assets (Images, Icons)
├── tailwind.config.ts      # Tactical Theme configuration
└── README.md               # Operations Manual
```

---

## 🛠️ Development Phases

### Phase 1: Foundation & Structural Aesthetic
Establish the immersive, tactical visual language and set up the robust full-stack foundation.
- **Architecture Setup:** Bootstrapped the Next.js 14 app directory with strict TypeScript adherence.
- **UI/UX Design Language:** Implemented the "Liquid Glass" aesthetic—a mix of dark surfaces, glowing primary borders (`#69f6b8`), and persistent CRT scanline overlays.
- **Authentication:** Integrated Supabase for secure user sign-ups and session management.

### Phase 2: Command Center Dashboard
Established the centralized OS hub where the operator tracks their progression.
- **Global Navigation:** Developed a persistent, dynamic `Sidebar` component used unilaterally across all modules.
- **Analytics & Progression:** Built the `DashboardPage` featuring grids, the `SkillRadar` data visualization, and `MissionLog` history.

### Phase 3: Neural Hub (Interactive Tactical Games)
Built out the **Armory (/games)**—a repository of interactive widgets simulating data science tasks.
- **KNN Visualizer:** Interactive canvas for mapping K-Nearest Neighbor algorithms visually.
- **Neural Lite:** A lightweight, interactive Neural Network architecture playground.

### Phase 4: Synthesis & Code Lab Integration
Introduction of a live, intelligent code environment for users to complete real ML missions.
- **Integrated IDE:** Created the `/code-lab` interface featuring a syntax-highlighted editor.
- **SYN_INTEL Comms:** Built-in terminal communication window that responds to command strings (`START`, `RUN`, `HINT`, `SUGGEST`).
- **Python Execution:** Integrated the Piston API to execute actual Python ML code (Gradient Descent, MSE Loss) in real-time.

### Phase 5: AI Ensemble & Live Assistance
The final push to make the platform a truly "intelligent" learning environment.
- **AI Ensemble:** Integrated a multi-provider fallback system switching between **Gemini, OpenRouter, and Grok**.
- **Live Assistance:** Added `SUGGEST` (code refactoring) and `HINT` (contextual pointers) triggers to the Code Lab.
- **Quiz Arena:** Launched the "Cognitive Profiling" unit with AI-generated tactical quizzes across `Beginner`, `Intermediate`, and `Advanced` threat levels.

### Phase 6: Production Readiness & Deployment
- **Type Safety Pass:** Resolved all TypeScript indexing and React dependency warnings.
- **Build Optimization:** Standardized API exports and shared constants for clean production builds.
- **Vercel Readiness:** Confirmed 0-error build state for seamless deployment to Vercel/Cloud infrastructure.

---

## 🚀 Getting Started

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Environment Configuration:**
   Create a `.env.local` file and provide the following tactical credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   GEMINI_API_KEY=your_gemini_key
   OPENROUTER_API_KEY=your_openrouter_key
   GROK_API_KEY=your_grok_key
   ```

3. **Deploy Terminal:**
   ```bash
   npm run dev
   ```
   Navigate your browser to `http://localhost:3000` to establish uplink with the Command Center.

---
*SYS.STATUS: OPERATIONAL // UPLINK: SECURE // MISSION_READY*
