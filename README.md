# 💻 Smart Appointment Scheduler - Client Application

This is the frontend client web application for the Smart Appointment Scheduling System. Built using React and Vite, it offers an exceptionally polished, ultra-modern dark-mode interface styled with responsive glassmorphism, smooth animations, and rich user interactions.

---

## ⚡ Setup & Run Instructions

### 1. Prerequisites
* **Node.js** (v16.x or higher)
* **npm** (v7.x or higher)

### 2. Configure API Connection
Ensure the client points to the correct backend API address. Open the configuration utility file [frontend/utils/constants.js](file:///c:/Users/LENOVO/Desktop/Aloha/frontend/utils/constants.js) and verify:
```javascript
export const API_URL = "http://localhost:5000/api";
```
*(Update this URL if your backend runs on a different port or domain).*

### 3. Installation
Navigate to the frontend directory and install the packages:
```bash
cd frontend
npm install
```

### 4. Running the Application

#### Launch Development Server
```bash
npm run dev
```
*Vite will start up instantly and provide a local URL (e.g. `http://localhost:5173`) where you can open the web app in your browser.*

#### Build for Production
To bundle the application in optimized static assets, run:
```bash
npm run build
```
*The build output will be compiled into the `/dist` directory, ready to be hosted on any static provider (Netlify, Vercel, S3, etc.).*

---

## 🏗️ Architecture & Design Choices

The frontend app is engineered to be highly responsive, lightweight, and maintainable.

```text
src/
├── assets/      # Static resources
├── context/     # Auth Context for global session management
├── pages/       # Layout views (Login, Register, Dashboard)
├── services/    # Centralized HTTP Client configuration (Axios)
├── App.css      # Core Layout rules
├── App.jsx      # Navigation, Routing, and Session distribution
├── index.css    # Central styling system (CSS tokens, dark mode, glassmorphic cards)
└── main.jsx     # App entry point
```

### Key Architectural Choices:
1. **Global Session Distribution via Context API**:
   * The `AuthContext.jsx` acts as the single source of truth for user credentials.
   * On application load, it attempts to load existing credentials from `localStorage`.
   * The login and logout handlers are encapsulated in the Context, automatically maintaining synchronization between persistent state (`localStorage`) and volatile state (`user` react state), allowing the user to stay logged in seamlessly across page refreshes.
2. **Centralized Axios Interceptor**:
   * Rather than manually passing bearer tokens into every individual endpoint call, we configured an Axios interceptor in `api.js`:
     ```javascript
     api.interceptors.request.use((config) => {
         const user = JSON.parse(localStorage.getItem('user'));
         if (user && user.token) {
             config.headers.Authorization = `Bearer ${user.token}`;
         }
         return config;
     });
     ```
     This separates the token-resolution concern entirely from UI components, ensuring all calls made through the `api` client are automatically authorized.
3. **Vanilla CSS Style Tokens**:
   * Instead of utilizing heavy external frameworks, we implemented a custom, lightweight CSS framework utilizing CSS Variables (`index.css`). This contains a carefully crafted color palette (dark slate backgrounds, indigo primary buttons, glassmorphic blur states, and custom badges), generating a cohesive, stunning modern aesthetic.

---

## 🎨 Polished UI & Core Features

* **Glassmorphism Design System**:
  All cards utilize blur backing (`backdrop-filter: blur(10px)`) and fine borders (`border: 1px solid var(--border)`), matching the look and feel of modern high-end software. Subtle scaling transitions (`transform: translateY(-2px)`) occur on hover.
* **Interactive Date Filter**:
  A dynamic HTML5 calendar date picker inside the available slots widget allows users to switch between dates. The minimum selectable date is locked to the current date (`min={todayStr}`), preventing users from navigating to or querying historical slots.
* **Double-Submit Prevention**:
  During async request dispatching (booking or canceling), an `actionLoading` state disables the interactive buttons immediately, preventing users from spamming requests or triggering duplicate backend requests.
* **Password Visibility Toggle**:
  Both the Login and Register page forms include a visibility toggle option (`password-toggle-btn`) for password fields so users can verify their inputs before submitting.
* **Dynamic Badge Identifiers**:
  Slots dynamically display states using specific badge markings (`AVAILABLE` in success emerald, `BOOKED` in error ruby).
* **Responsive Column Layout**:
  Utilizes standard Flexbox & CSS Grid systems to scale seamlessly from narrow mobile displays (where slots stack vertically) to large desktop setups (where slot options and booked items sit side-by-side).
