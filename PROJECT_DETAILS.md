# 🌐 Global README Localizer (GRL) - Technical Deep Dive & Showcase

Welcome to the comprehensive technical documentation for **Global README Localizer**, an aesthetically stunning, high-performance platform engineered to automate the localization of open-source documentation.

---

## 📌 1. Project Vision
**GRL** was born from a simple problem: the vast majority of open-source innovation is locked behind the English language barrier. While code is universal, documentation is not. GRL bridges this gap by providing a specialized, developer-first localization tool that respects the technical nuances of Markdown—code blocks, relative links, and image paths remain untouched while the technical prose is perfectly translated.

---

## 🚀 2. Core Features
- **Instant Repo Parsing**: Direct integration with the GitHub REST API to analyze repository structures and identify primary documentation files.
- **Precision Translation**: Powered by the **Lingo.dev SDK**, providing LLM-driven localization that understands technical context.
- **Batch Processing**: Select multiple languages at once and watch as the engine localizes your entire project in parallel.
- **Resilient Architecture**: A hybrid storage system using **Supabase** (Postgres) with an automated **LocalStorage** fallback for maximum availability.
- **IDE-Grade UI**: A "Cyber-Obsidian" design system built with vanilla CSS, featuring glassmorphism and motion-optimized interactions.

---

## 🛠️ 3. The Tech Stack: Why These Choices?

### **Frontend: React 19 + Vite**
We chose **React 19** for its experimental performance capabilities and **Vite** for the fastest possible development loop. The application is a client-side powerhouse that handles segmentation and markdown reconstruction entirely on the user's machine.

### **Styling: Vanilla CSS (Custom Design System)**
Instead of Tailwind, we engineered a custom CSS variable-based design system. This allowed for:
- **Rich Aesthetics**: Precise control over gradients, backdrops, and glassmorphic depth.
- **Micro-Animations**: Custom cubic-bezier transitions for sidebar elements and button states.
- **Theme Stability**: A rock-solid "Cyber-Obsidian" aesthetic that feels premium and unified.

### **Backend: Supabase**
Integrated for its robust **PostgreSQL** backend and **GoTrue** authentication. It acts as our primary persistence layer for user profiles and translation history.

---

## 🌍 4. Lingo.dev Integration: The Beating Heart

The integration with **Lingo.dev** is at the core of GRL's value proposition. Here is how we utilized it:

### **The SDK & API**
We integrated the **Lingo.dev REST API** directly into our service layer (`translator.js`). 
- **Direct Localize Endpoint**: We hit `https://api.lingo.dev/process/localize` with custom payloads.
- **Batch Translation**: Instead of sending one paragraph at a time, we utilize the Lingo.dev key-value payload system to send all markdown segments in a single HTTP request, drastically reducing latency.

### **Specialized Segmentation**
Universal translation AI often mangles markdown. GRL uses a custom **Segmentation Engine** before sending data to Lingo.dev:
1. **Fence Protection**: Code blocks (```) are extracted and cached.
2. **Placeholder Logic**: Links `[label](url)`, images `![alt](url)`, and inline code `` `code` `` are replaced with unique Unicode placeholders (e.g., `⟦CODE0⟧`).
3. **Lingo.dev Processing**: The "cleaned" text is sent to Lingo.dev, which translates the prose while ignoring the placeholders.
4. **Reconstruction**: GRL's restoration logic swaps the placeholders back for the original technical entities and stitches the code blocks back in.

---

## ⚠️ 5. Challenges Faced (and How We Conquered Them)

### **Challenge A: Markdown Integrity**
*   **The Problem**: LLMs sometimes add extra spaces or change punctuation in URLs, breaking relative links or image paths during translation.
*   **The Solution**: We implemented a **Placeholder Protection Layer**. By replacing technical syntax with non-translatable Unicode symbols before the API call, we ensured that the technical plumbing of the document was invisible to the translation engine.

### **Challenge B: The "Black Screen" Crash**
*   **The Problem**: During the refactor to support multiple languages, a stale variable reference in the UI component caused the entire React tree to crash when switching views.
*   **The Solution**: We implemented more robust state initialization and removed legacy single-language references. We also identified that deep prop-drilling was causing synchronization issues and moved to a more centralized state model in the `ProjectPage`.

### **Challenge C: API Latency & UI Feedback**
*   **The Problem**: Translating a large README into 5+ languages at once takes time. Users felt the app was "stuck".
*   **The Solution**: We built a **Sequential Batch Progress Engine**. Each language has its own synthesis state, and an overall progress percentage is tracked in the sidebar, providing the user with real-time visual feedback of the "Synthesis" process.

---

## 📜 6. How to Run This Project
1. **Environment**: Set up a `.env` with `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, and `VITE_LINGO_API_KEY`.
2. **Install**: `npm install`
3. **Dev**: `npm run dev`
4. **Build**: `npm run build`

---

**Developing for a borderless open-source world.**
*GRL Team*
❤️
