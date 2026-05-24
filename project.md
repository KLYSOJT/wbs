# Ramon Magsaysay National High School (RMNHS) Web-Based System (WBS)
## Technical Architecture & Codebase Map

This document provides a comprehensive analysis of the RMNHS Web-Based System codebase. It is designed to help developers and stakeholders quickly understand the project layout, technical stack, state management, backend integration, and core architectural patterns.

---

## 🏛️ 1. Project Overview & Business Value

The **RMNHS Web-Based System (WBS)** is a highly optimized, premium web application built for Recto Memorial National High School. Its primary objective is to serve as a dual-purpose portal:
1. **Public Information & Transparency Portal**: Allows students, parents, and the local community to view school announcements, read campus news, view organizational structure, download learning modules, and audit DepEd-mandated procurement/financial transparency records.
2. **Secure Administrative Dashboard**: Allows school administrators to dynamically manage and upload new notices, news articles, academic materials, official memoranda, and procurement records.

---

## 🛠️ 2. The Modern Technology Stack

The project relies on a modern, high-performance stack chosen for developer velocity, speed, and modern look-and-feel:

*   **Vite (v8.0) & React (v19.0)**: Used as the core build-tool and UI framework. Vite provides near-instant Hot Module Replacement (HMR) during development, while React 19 ensures efficient rendering and rendering modern component structures.
*   **Tailwind CSS (v4.3)**: Leveraging the brand-new Tailwind v4 engine via `@tailwindcss/vite`. Key styles and configuration tokens are handled natively in CSS rather than a bulky JavaScript config file.
*   **Supabase (PostgreSQL BaaS)**: Serving as the backend for authentication, database storage, and real-time operations. It enables dynamic updates to news, announcements, and resource lists.
*   **React Router Dom (v7.1)**: Used for layout-nested client-side routing, enabling fluid, single-page application (SPA) navigation.
*   **Lucide React**: For a clean, unified modern icon library matching premium visual standards.

---

## 📁 3. Directory Structure & Key Files

The code is strictly organized following **clean separation of concerns (SoC)**:

```text
react-wbs/
├── .env                    # Environment variables (Supabase URL & Anon Key)
├── index.html              # HTML Entry Point
├── vite.config.js          # Vite config bundling Tailwind v4 & React compiler/plugins
├── src/
│   ├── main.jsx            # Application entry point, mounts App in DOM
│   ├── App.jsx             # Main router containing both Public & Admin routes
│   ├── index.css           # Premium styling tokens, Tailwind directives, and admin theme dark/light variables
│   ├── assets/             # SVGs and campus imagery
│   ├── components/         # Shared, structural UI components
│   │   ├── Layout.jsx      # Wraps public pages, binds Navbar & Footer
│   │   ├── AdminLayout.jsx # Wraps admin pages, sidebar navigation, dark mode support
│   │   ├── Navbar.jsx      # Highly responsive multi-level desktop/mobile header
│   │   ├── Footer.jsx      # Desktop/mobile footer with contact info & links
│   │   └── HeroWaveBackground.jsx # Custom backdrop SVG grid animations
│   ├── lib/                # Core service abstractions
│   │   ├── supabase.js     # Supabase client instantiation
│   │   ├── AuthContextValue.js # Created context reference
│   │   ├── AuthContext.jsx # Global provider for user roles & session state
│   │   └── useAuth.js      # Custom React Hook for clean context ingestion
│   └── pages/              # Routed pages
│       ├── Home.jsx        # Landing page with stats, announcements, carousel, video list, and bento court layout
│       ├── History.jsx     # Narrative timeline of RMNHS
│       ├── VMC.jsx         # Vision, Mission, & Core Values page
│       ├── Location.jsx    # Campus geography and embedded interactive maps
│       ├── Research.jsx    # School research and academic publications
│       ├── OrganizationalStructure.jsx # Displaying school leaders and faculty hierarchies
│       ├── RecognizedOrganizations.jsx # Dynamic showcase of registered student/parent organizations
│       ├── Resources/      # Academic & Legal downloads
│       │   ├── LearningMaterials.jsx # Dynamic learning modules filtered by Grade (7-10)
│       │   └── Memorandum.jsx       # Universal reusable table component for School/Division/DepEd memos
│       ├── Transparency/   # Government & Fiscal auditing reports
│       │   └── TransparencyInfo.jsx  # Overview of Transparency Board mandates
│       └── Admin/          # Secure Management Interfaces
│           ├── Login.jsx   # Administrative login gateway
│           ├── Dashboard.jsx # Overview statistics and logs
│           ├── LearningMaterials.jsx
│           ├── Location.jsx
│           ├── Memoranda.jsx # Reusable administrative dashboard view for memos
│           ├── OrganizationalStructure.jsx
│           ├── RecognizedOrganizations.jsx
│           └── Research.jsx
└── supabase/
    └── README.md           # RLS policy troubleshooting and profile table schema repair scripts
```

---

## 🔒 4. State Management & Authentication Design

### The Global Auth System
The project implements a centralized authentication context using React’s `useContext` hook in `src/lib/AuthContext.jsx`. It manages three states globally:
*   `user`: Current session user object (real or mock).
*   `isAdmin`: Boolean flag validating if the user holds an administrative role.
*   `loading`: Standard loader blocking routes during session restoration.

### The Hybrid Session Model
To accommodate both rapid developer workflows/testing and secure production logins, `AuthContext` uses a dual-verification strategy:

```javascript
// Verification flow inside checkUser()
const storedMockUser = localStorage.getItem('mock_user');
if (storedMockUser) {
  setUser(JSON.parse(storedMockUser));
  setIsAdmin(true);
  setLoading(false);
  return;
}
// Fallback to real Supabase validation
const { data: { session } } = await supabase.auth.getSession();
```

1.  **Mock Admin Portal Bypass**: For offline/fast layout testing, typing **`admin@rmnhs.edu.ph`** or **`admin@gmail.com`** with password **`admin123`** stores a simulated administrative session in `localStorage` and unlocks the full admin dashboard.
2.  **Supabase Auth Integration**: For actual production deployment, it establishes a secure session using Supabase's `signInWithPassword`, validating the user's ID against the database `profiles` table to confirm `role === 'admin'`.

---

## 📊 5. Reusable Component Patterns & Parameterized Routing

One of the most elegant architectural choices in this codebase is the extensive use of **DRY (Don't Repeat Yourself)** parametrized layouts in `App.jsx`.

### Example: Universal Legal & Procurement Archive
Instead of creating 15 separate files for each procurement type (APP, Bids, Awards, PhilGEPS, SSLG, MOOE, Red Cross, etc.), the system uses a single, highly reusable `<Memorandum>` component and injects specific parameters:

```jsx
<Route path="/transparency/app" element={<Layout><Memorandum tableName="app" title="Annual Procurement Plan (APP)" /></Layout>} />
<Route path="/transparency/bac" element={<Layout><Memorandum tableName="bac" title="Bids and Awards Committee" /></Layout>} />
<Route path="/transparency/mooe" element={<Layout><Memorandum tableName="mooe" title="MOOE" /></Layout>} />
```

Inside `Memorandum.jsx`, the component dynamically queries Supabase using the provided `tableName` prop:
```javascript
const { data, error } = await supabase
  .from(tableName)
  .select('*')
  .order('created_at', { ascending: false });
```
This is a textbook **Senior Developer pattern**: it drastically simplifies maintenance. If you want to change the visual layout of all 15 audit grids, you only need to edit **one** component (`Memorandum.jsx`).

---

## 🎨 6. Premium Aesthetic System

Aesthetics are heavily optimized to present a professional, premium experience:
*   **Bento Card Grid Layouts**: Used on the homepage to beautifully showcase speech labs, computer hubs, and covered courts.
*   **Parallax-style Carousel & Vignette Masks**: The landing hero applies radial vignettes and back-end blur masks to keep typography legible while images fade, delivering a cinematic cinematic entry.
*   **Responsive Fluid Typography**: Custom Outfit headings are styled with negative tracking (`tracking-tight` or `tracking-tighter`) for an expensive, high-end editorial feel.
*   **Complete Dark Theme for Administrative Operations**: While public pages remain bright, the admin panel uses a sophisticated dark color palette (`.admin-shell.admin-dark`) scoped via class wrappers to reduce screen fatigue during long administrative shifts.

---

## 🛡️ 7. Development Insights & Structural Vulnerabilities

As a Senior Developer review, here are the core aspects, known caveats, and future risks you must keep in mind:

### ⚠️ RLS Infinite Recursion Risk
As documented in the `supabase/README.md`, watch out for infinite recursion policies. 
*   **The Cause**: Having an Row-Level Security (RLS) policy on `public.profiles` that references its own table (e.g., `id = auth.uid()` via query checking the same table) will cause Supabase to trigger a recursive execution chain, crashing the request with a `500` error.
*   **The Solution**: Ensure the RLS policy relies on direct metadata or cleanly written joinless checks, as provided in `repair_profiles_rls.sql`.

### 🔄 Admin Credentials Migration
*   **Current state**: The bypass in `AuthContext.jsx` makes local development painless, but **must never** be deployed to production as-is.
*   **Recommended Action**: Secure this logic by enclosing it in an environment flag (e.g., `import.meta.env.DEV`) so mock logins are disabled in production, routing all authentications strictly through Supabase.

### 📁 Storage & File Upload Strategy
*   **Need**: Memos and learning materials require file downloads.
*   **Implementation Strategy**: Integrating Supabase Storage buckets (e.g., `memoranda-files`, `modules`) and linking bucket paths into the database tables allows files to be uploaded directly from the Admin Dashboard.
