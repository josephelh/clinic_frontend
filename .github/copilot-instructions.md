AI Copilot Instructions: Frontend - Moroccan Dental SaaS
1. Core Tech Stack
Framework: React 19 (Strict Mode) + Vite.
Language: TypeScript (Strict).
Styling: Tailwind CSS 3.4 + Horizon UI Free (Chakra UI components for shells).
State: Zustand + Persistence (LocalStorage).
Scheduler: Syncfusion EJ2 React Schedule.
Animations: Framer Motion (Modern SaaS transitions).
Localization: i18next (French default, Arabic RTL support).
2. Architectural Pattern: View-Service-Store (V-S-S)
Views (src/views/)
Pure UI and Layout logic.
They must not call Axios directly.
They call Services to fetch/mutate data.
They listen to the Store for global state (Auth, Clinic info).
Services (src/services/)
The single source of truth for API communication.
Mapping Requirement: Always transform raw backend JSON (e.g., ISO date strings) into clean UI objects (e.g., Javascript new Date()) here.
Handle error parsing and user-friendly error messages.
Store (src/store/)
useAuthStore: Manages JWT, User Role (DOCTOR/ASSISTANT), and Clinic Tier.
useConfigStore: Manages Language (fr/ar) and Sidebar status.
Use persist middleware for session survival.
Components (src/components/)
Follow Horizon UI DNA.
Use Path Aliases for imports: src/components/... or src/api/....
3. UI/UX Standards (Surgery-Grade)
Tablet Ergonomics (10-inch focus)
Minimum Tap Target: 44px x 44px for all clickable elements.
Input Height: Prefer h-12 (Tailwind) for text inputs and selects.
Padding: High whitespace (p-4 to p-6) to prevent "fat-finger" errors by clinical staff.
Colors:
Text: navy-700 (Dark Mode: white).
Action: brand-500 (Modern Purple/Blue).
Multi-Tenancy (Subdomain Awareness)
Axios (src/api/axios.ts): Automatically detects the subdomain.
Base URL must be dynamic: http://${window.location.hostname}:8000/api.
FDI Tooth Chart Logic
Notation: FDI World Dental Federation (Two-digit system: 11-48).
Interactive Map: SVG-based teeth. Tapping a tooth opens the TreatmentStep or ToothFinding form.
4. Coding Standards
Functional Components
Use export default function ComponentName() {}.
Use TypeScript interfaces for all Props.
Style Priority
Tailwind CSS: For all layout, spacing, and simple styling.
Chakra UI: Only for complex Horizon UI blocks (Sidebar, Navbar, Modals).
Framer Motion: For loaders and page transitions.
Localization (i18n)
Use const { t } = useTranslation().
RTL Support: When language is 'ar', the container must have dir="rtl". Use logical Tailwind classes: ms-4 (start) instead of ml-4, pe-2 (end) instead of pr-2.
5. Syncfusion Scheduler Specifics
Resource Grouping: By Doctor (resourceId: 'doctor').
Templates: Separate QuickInfoTemplate.tsx (tap preview) and EditorTemplate.tsx (double-tap form) into the components/ folder of the agenda view.
Dates: Scheduler requires real Javascript Date objects; services must convert strings before passing data to the View.
6. Anti-Patterns (NEVER DO THESE)
NO Relative Imports: ../../ is forbidden. Use aliases.
NO Direct Axios in Components: Must go through the Service layer.
NO Universal Tooth Numbers: If Copilot suggests numbers like 1-32, reject them and use 11-48 (FDI).
NO inline style props: Use Tailwind classes unless calculating dynamic heights.
NO hardcoded domain names: Always use window.location.hostname.

Project Name: The Surgery (Dental Management).
Target User: Moroccan Dentists & Assistants using Tablets.
Current Objective: (Insert current feature, e.g., Patient EMR with FDI Chart).