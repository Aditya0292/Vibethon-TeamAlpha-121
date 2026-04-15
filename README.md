# NeuroFlow: Tactical Intelligence & Learning OS
**codename: Vibeathon-TeamAlpha**

NeuroFlow is an institutional-grade, military-tactical styled web application built to train, evaluate, and gamify machine learning concepts for elite software operators. Featuring a "liquid glass" dark-mode aesthetic, the platform combines real-time AI code validation, interactive neural network sandboxes, and progression-based mission logs into a unified dashboard interface.

---

## 💻 Tech Stack
- **Framework:** Next.js 14.2 (App Router, Client & Server Components)
- **Styling:** TailwindCSS (Custom scanline overlays, neon accents, tactical UI patterns)
- **Backend/Auth:** Supabase Setup (PostgreSQL, Row Level Security, Auth)
- **AI Core (`SYN_INTEL`):** Multi-model routing utilizing Google Gemini, OpenRouter, and Grok for real-time code evaluation.

---

## 🛠️ Development Phases

### Phase 1: Foundation & Structural Aesthetic
The initial objective was to establish the immersive, tactical visual language of the application and set up the robust full-stack foundation.
- **Architecture Setup:** Bootstrapped the Next.js 14 app directory with strict TypeScript adherence.
- **UI/UX Design Language:** Implemented the "Liquid Glass" aesthetic—a mix of dark surfaces, glowing primary borders (`#69f6b8`), custom scrollbars, and a persistent CRT scanline overlay.
- **Authentication:** Integrated Supabase for secure user sign-ups and session management.
- **Landing Page Integration:** Built the root access terminal (`/`) featuring the `HeroContent` and `AccessTerminal` components to gate entry.

### Phase 2: Command Center Dashboard
Transitioning from the landing page, we established the centralized OS hub where the operator tracks their progression.
- **Global Navigation:** Developed a persistent, dynamic `Sidebar` component that tracks active routes via `usePathname` and houses core navigation links.
- **Analytics & Progression:** Built the `DashboardPage` featuring grids, the `SkillRadar` data visualization, `LevelProgress` tracking, and `MissionLog` history.
- **Responsive Layouts:** Ensured the dashboard grid degrades gracefully on mobile while maintaining its institutional density on desktop.

### Phase 3: Neural Hub (Interactive Tactical Games)
We built out the **Armory (/games)**—a repository of interactive widgets simulating data science and machine learning tasks.
- **KNN Visualizer (Module 01):** An interactive canvas allowing the operator to map K-Nearest Neighbor algorithms visually in real-time.
- **Neural Lite (Module 02):** A lightweight Neural Network playground.
- **Integration:** Wrapped these visualizations in tactical border containers and integrated them safely into the main centralized UI loop.

### Phase 4: Synthesis & Code Lab Integration
The introduction of a live, intelligent code environment for users to complete missions and test architectures.
- **Integrated IDE:** Created the `/code-lab` interface featuring a writable, syntax-highlighted editor textarea.
- **SYN_INTEL Comms:** Built a built-in terminal communication window that responds to operator commands (`START`, `STOP`, `EXECUTE`, `HELP`).
- **Real-Time AI Validation:** Created the `/api/code-check` route. When code is "Executed", this API proxies the operator's code to Gemini/OpenRouter logic cores to grade initialization sequences (e.g., TensorFlow layer optimizations).

### Phase 5: Routing Unification & Institutional Polish
Finalizing the architecture to verify a seamless, bug-free operator experience.
- **Layout Unification:** Removed redundant, isolated sidebars native to early versions of `/code-lab` and `/games`, effectively injecting the global Dashboard `Sidebar` unilaterally across the app.
- **Bug Eradication:** Addressed hydration errors, JSX text escaping bugs (`\`` and `\${}`), and lingering Git merge conflicts.
- **Aesthetic Standardization:** Ensured all buttons, dialog boxes, and grid borders perfectly adhered to the unified military-tactical design guidelines.

---

## 🚀 Getting Started

1. **Install Dependencies:**
   \`\`\`bash
   npm install
   \`\`\`

2. **Environment Configuration:**
   Create a \`.env.local\` file in the root directory and ensure the following keys are provided:
   \`\`\`env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   GEMINI_API_KEY=your_gemini_key
   OPENROUTER_API_KEY=your_openrouter_key
   GROK_API_KEY=your_grok_key
   \`\`\`

3. **Deploy Terminal:**
   \`\`\`bash
   npm run dev
   \`\`\`
   Navigate your browser to \`http://localhost:3000\` to establish uplink with the Command Center.

---
*SYS.STATUS: ONLINE // UPLINK: SECURE*
