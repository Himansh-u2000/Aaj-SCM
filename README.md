# AAJ SCM — Order & Shipment Management Dashboard

A modern, responsive logistics dashboard built with **React 19 + Vite + Tailwind CSS**. No external UI libraries — every component is hand-crafted from scratch.

> **Login Credentials**  
> Email: `coordinator@aajscm.com`  
> Password: `admin123`

---

## 🚀 Project Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 🏗️ Architecture Decisions

### Tech Stack
| Technology | Purpose |
|-----------|---------|
| React 19 | UI framework |
| Vite 8 | Build tool & dev server |
| Tailwind CSS 3.4 | Utility-first styling |
| React Router DOM 7 | Client-side routing |

### Why No UI Library?
Every component (Button, Input, Badge, Table, Drawer, Timeline, etc.) is built from scratch to demonstrate:
- Deep understanding of component architecture
- Full control over design tokens and styling
- Zero dependency bloat
- Complete alignment with the custom AAJ SCM design system

### State Management
- **React Context + useReducer**: For global state (auth, toasts). The app's scope doesn't justify Redux — Context is sufficient and adds zero bundle size.
- **Local useState**: For page-level state (filters, search, pagination, selected rows).
- **Custom hooks**: Encapsulate reusable logic (debounce, pagination, media queries, localStorage).

### Mock API Layer
All data fetching goes through a service layer (`src/services/`) that simulates real API behavior:
- Configurable network delay (200-700ms)
- Pagination, filtering, sorting handled server-side (simulated)
- Easy to swap with real API endpoints — just replace the data functions with `fetch`/`axios` calls

---

## 📁 Folder Structure

```
src/
├── assets/              # Static assets (logo, images)
├── components/          # Reusable Design System components
│   ├── Badge/           # Status badges (Delivered, Pending, etc.)
│   ├── Button/          # Primary, Secondary, Outline, Ghost, Danger
│   ├── Card/            # Content cards with optional hover
│   ├── Checkbox/        # Custom checkbox (red theme)
│   ├── Drawer/          # Right-side slide-in panel
│   ├── Dropdown/        # Filter dropdown with selection
│   ├── EmptyState/      # No-data placeholder
│   ├── Input/           # Text/password/email with icons & validation
│   ├── Loader/          # Spinner, Skeleton, TableSkeleton
│   ├── Modal/           # Centered modal with backdrop
│   ├── Pagination/      # Page numbers with navigation
│   ├── SearchBar/       # Search with debounce & clear
│   ├── Sidebar/         # Dark responsive sidebar
│   └── Timeline/        # Shipment tracking timeline
├── context/             # React Context providers
│   ├── AuthContext.jsx   # Authentication state
│   └── ToastContext.jsx  # Toast notifications
├── data/                # Mock data generators
│   ├── dashboardStats.js
│   ├── orders.js         # 1,248 mock orders
│   ├── shipments.js      # 250 mock shipments
│   └── users.js
├── hooks/               # Custom React hooks
│   ├── useDebounce.js
│   ├── useLocalStorage.js
│   ├── useMediaQuery.js
│   └── usePagination.js
├── layouts/             # Page layout wrappers
│   ├── AuthLayout.jsx    # Login page (blurred BG)
│   └── DashboardLayout.jsx # Sidebar + Header + Content
├── pages/               # Route-level components
│   ├── Dashboard/        # KPI cards, activity, quick actions
│   ├── Login/            # Authentication screen
│   ├── Orders/           # Orders table with filters
│   └── Shipments/        # Tracking cards + detail drawer
├── services/            # API service layer
│   ├── api.js            # Base wrapper (simulates fetch)
│   ├── authService.js
│   ├── dashboardService.js
│   ├── orderService.js
│   └── shipmentService.js
├── utils/               # Shared utilities
│   ├── constants.js      # Status enums, nav items, colors
│   ├── formatters.js     # Date, currency, number formatting
│   └── validators.js     # Form validation helpers
├── App.jsx              # Root with routing
├── index.css            # Global styles + design tokens
└── main.jsx             # React entry point
```

---

## 🎨 Design System

### Colors
| Token | Value | Usage |
|-------|-------|-------|
| Primary | `#c5202c` | Buttons, links, active states |
| Secondary | `#1E293B` | Sidebar, text, dark surfaces |
| Tertiary | `#64748B` | Muted text, secondary labels |
| Delivered | `#16a34a` | Success status |
| In Transit | `#2563eb` | Active status |
| Delayed | `#dc2626` | Error/warning status |
| Pending | `#f59e0b` | Waiting status |

### Typography (Inter)
| Style | Size | Weight |
|-------|------|--------|
| System | 36px | Bold |
| Heading | 24px | Bold |
| Title | 18px | Semibold |
| Body | 14px | Regular |
| Caption | 12px | Medium |
| Label | 10px | Semibold |

### Components
- **Button**: 5 variants × 3 sizes + loading + icons
- **Input**: Label, icons, error/helper text, password toggle
- **Badge**: 6 status variants with optional dot
- **Card**: Content container with hover elevation
- **Checkbox**: Custom red-themed with indeterminate
- **Dropdown**: Select with animated menu
- **SearchBar**: With clear button
- **Table**: Sortable headers, row selection, actions
- **Pagination**: Page numbers + entry count
- **Drawer**: Right-side panel (shipment tracking)
- **Timeline**: Tracking history with status dots
- **Toast**: 4 types with auto-dismiss

---

## ⚡ Performance Considerations

| Optimization | Implementation | Impact |
|-------------|----------------|--------|
| **Debounced Search** | `useDebounce(value, 300)` on all search inputs | Prevents API calls on every keystroke |
| **Pagination** | Server-side simulation, 10 items/page | Avoids rendering 1,248+ rows at once |
| **React.memo** | Applied to all design system components | Prevents unnecessary re-renders |
| **useMemo** | KPI card data, pagination page numbers | Avoids expensive re-computations |
| **useCallback** | Event handlers passed as props | Stable references for memoized children |
| **Lazy Loading** | `React.lazy()` for all page components | Code-split chunks, smaller initial load |
| **Skeleton Loading** | Table/card skeletons during fetch | Improved perceived performance |
| **CSS Containment** | Tailwind's utility approach | Minimal CSS, no specificity conflicts |

### Bundle Size (Production)
- Total JS: ~311 KB (gzipped: ~93 KB)
- CSS: 28.6 KB (gzipped: 6 KB)
- Lazy-loaded chunks: Dashboard (13.8 KB), Orders (15 KB), Shipments (16.9 KB), Login (7.4 KB)

---

## 📱 Responsive Breakpoints

| Breakpoint | Width | Behavior |
|-----------|-------|----------|
| Mobile | < 640px | Sidebar hidden (hamburger), stacked filters, compact table |
| Tablet | 640-1023px | 2-column grids, condensed sidebar |
| Desktop | ≥ 1024px | Full sidebar, 4-column KPI grid, full table |

---

## 🔐 Authentication Flow

1. User enters credentials on login page
2. `authService.login()` validates against mock users
3. On success: stores user + JWT token in localStorage
4. `AuthContext` provides `isAuthenticated` state globally
5. `ProtectedRoute` wrapper redirects unauthenticated users to `/login`
6. `PublicRoute` redirects authenticated users to `/`

---

## 📝 Assumptions

1. This is a **frontend-only** prototype — all data is mocked with simulated API delays
2. Authentication uses localStorage (not httpOnly cookies) for demo purposes
3. 1,248 orders and 250 shipments are generated randomly on app load
4. Inventory and Reports pages are placeholder "Coming Soon" screens
5. The design system follows the Figma specifications provided
6. No server-side rendering — client-only SPA deployed as static files

---

## 🚀 Deployment

The app builds to a static `dist/` folder. Deploy to:

**Vercel:**
```bash
npx vercel
```

**Netlify:**
```bash
npx netlify deploy --prod --dir=dist
```

For SPA routing (React Router), add a `vercel.json`:
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/" }]
}
```

Or for Netlify, add `public/_redirects`:
```
/*    /index.html   200
```
