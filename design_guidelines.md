# Tender Platform - Design Guidelines

## Design Approach: Enterprise Design System

**Selected Framework:** Material Design (Enterprise Variant) with Linear-inspired refinements
- **Rationale:** This is a utility-focused, data-dense B2B platform requiring professional credibility, efficient information processing, and scalable component patterns. Material Design provides robust data table components, clear hierarchy, and enterprise-grade patterns while Linear's typography and spacing refinements add modern polish.

## Core Design Principles

1. **Data First:** Information density with clear hierarchy - users need to process ranked lists, compliance status, and bid comparisons efficiently
2. **Trust & Transparency:** Professional aesthetics that convey reliability, security, and regulatory compliance
3. **Efficient Workflows:** Minimize clicks, support keyboard navigation, optimize for power users
4. **Status Clarity:** Instant visual feedback on availability, compliance, document expiry, and workflow stages

---

## Color Palette

### Light Mode
- **Primary:** 210 100% 45% (Professional blue - trust, reliability)
- **Primary Hover:** 210 100% 38%
- **Secondary:** 210 15% 25% (Charcoal for text hierarchy)
- **Accent (Success):** 145 65% 42% (Compliance valid, available status)
- **Warning:** 38 95% 55% (Expiring documents, pending actions)
- **Error:** 0 85% 50% (Compliance failed, unavailable)
- **Background:** 0 0% 98%
- **Surface:** 0 0% 100%
- **Border:** 210 20% 90%

### Dark Mode  
- **Primary:** 210 100% 55%
- **Primary Hover:** 210 100% 62%
- **Secondary:** 210 15% 85%
- **Accent (Success):** 145 55% 48%
- **Warning:** 38 95% 60%
- **Error:** 0 75% 58%
- **Background:** 210 15% 8%
- **Surface:** 210 12% 12%
- **Border:** 210 15% 20%

---

## Typography

**Font Stack:** Inter (primary), SF Pro Display (headings alternative)

- **Display (Page Headers):** 32px/38px, weight 600, -0.02em tracking
- **H1 (Section Headers):** 24px/32px, weight 600, -0.01em tracking  
- **H2 (Card/Panel Headers):** 18px/24px, weight 500
- **Body Large:** 16px/24px, weight 400
- **Body (Default):** 14px/20px, weight 400
- **Caption (Metadata):** 12px/16px, weight 400, 60% opacity
- **Label (Form/Table):** 13px/18px, weight 500, uppercase tracking 0.02em
- **Mono (IDs/Codes):** JetBrains Mono 13px/18px

---

## Layout System

**Spacing Primitives:** Use Tailwind units of **2, 3, 4, 6, 8, 12, 16, 24**
- Component padding: p-4 or p-6
- Section spacing: gap-8, gap-12
- Page margins: px-6 md:px-8 lg:px-12
- Card/Panel internal: p-6
- Data table cells: px-4 py-3

**Grid System:**
- Container max-width: max-w-[1400px] (wide for data tables)
- Sidebar: 280px fixed (navigation, filters)
- Main content: flex-1
- Responsive breakpoints: sm:640px, md:768px, lg:1024px, xl:1280px

---

## Component Library

### Navigation
- **Top Bar:** Fixed header with org switcher, notifications (badge counts), user menu, availability toggle (prominent)
- **Sidebar (Desktop):** Persistent navigation with icons + labels, collapsible sections, active state with accent border-left
- **Mobile:** Bottom tab bar with 4-5 primary actions

### Data Tables (Core Component)
- **Ranked List View:** Sortable columns with directional indicators, sticky header, row hover state (subtle background), inline action buttons (view, shortlist, compare)
- **Columns:** Score (visual bar + number), Company (logo + name), Rating (stars + count), Distance, Availability (badge), Compliance (icon grid), Capability Fit (%)
- **Density Options:** Comfortable (py-4), Compact (py-2), toggle in table header
- **Saved Views:** Filter/sort state persistence, named view dropdown

### Details Drawer (Slide-over)
- **Width:** 600px from right edge
- **Header:** Company name, logo, close button, primary action (Request Bid/Submit Bid)
- **Content Sections:** Tabbed navigation (Overview, Compliance, Crew, Reviews, Why Matched)
- **Why Matched Chips:** Small badges with icons showing top matching factors (e.g., "Skills 92%", "15km away", "Available Now")
- **Compliance Status Grid:** Document type, expiry date, status badge, view/download icons

### Comparison Panel
- **Layout:** Side-by-side cards for up to 3 contractors/bids
- **Sticky Headers:** Company names remain visible while scrolling
- **Delta Highlights:** Differences shown in accent color (better) or warning (worse)
- **Fields:** All key metrics, expandable sections for method statements

### Forms & Inputs
- **Style:** Material-inspired with floating labels, clear focus states (primary color border)
- **Required Fields:** Asterisk + helper text
- **File Uploads:** Drag-drop zones with file type icons, progress bars, validation badges
- **Date Pickers:** Calendar overlay with quick ranges (Today, Next 7 Days, Next 30 Days)
- **Location Input:** Map preview with radius selector, address autocomplete

### Status Badges
- **Available:** Green background, white text, pulsing dot indicator
- **Busy:** Gray background, dark text  
- **Compliance Valid:** Green check icon, subtle green background
- **Expiring Soon:** Amber warning icon, amber background
- **Expired:** Red X icon, red background
- **Pending Verification:** Blue info icon, blue background

### Cards & Panels
- **Elevated Cards:** Subtle shadow (0 1px 3px rgba(0,0,0,0.1)), rounded corners (8px), white/surface background
- **Stat Cards:** Large number (32px), label below, trend indicator (↑↓), icon top-right
- **Action Cards:** Primary action button bottom-right, secondary actions as icon buttons top-right

### Modals & Dialogs
- **Overlay:** bg-black/50 backdrop-blur-sm
- **Container:** Max 600px width, rounded-lg, shadow-2xl
- **Header:** Title + close button, border-bottom
- **Footer:** Actions right-aligned, secondary button left

### Analytics Dashboards
- **Charts:** Recharts library with consistent color mapping, interactive tooltips, legend toggles
- **KPI Cards Grid:** 3-4 columns on desktop, stack on mobile
- **Filters Panel:** Sticky sidebar with date range, category, region selectors

---

## Crew Nomination & Compliance

### Crew Profile Cards
- **Layout:** Photo (64px circle), name, role, compliance score (%)
- **Document Status:** Icon grid showing license/medical/induction status (green check/amber warning/red X)
- **Expandable Details:** Click to reveal full compliance list, experience, qualifications

### Nomination Wizard (Multi-step)
1. **Select Crew:** Checkbox list with filters (available, compliance valid, role)
2. **Review Assignments:** Drag-to-reorder, role assignment per member
3. **Compliance Check:** Warning panel for expiring/invalid docs, upload prompts
4. **Confirm & Submit:** Summary table, consent acknowledgment

### Site Pass Pack (Export)
- **Format Options:** PDF bundle, ZIP archive
- **Content:** Cover sheet with org details, individual crew sheets (photo, docs, expiry dates), consolidated status table

---

## Interactions & Micro-animations

**Animations:** Minimal and purposeful only
- **Loading States:** Skeleton screens for tables, shimmer effect
- **Transitions:** 200ms ease for hover states, 300ms for drawer open/close
- **Success Feedback:** Subtle green checkmark animation on form submit
- **Avoid:** Excessive animations, decorative motion

---

## Accessibility

- **Keyboard Navigation:** Full support with visible focus rings (2px primary color outline)
- **ARIA Labels:** All interactive elements, table column headers, status badges
- **Color Contrast:** WCAG AA minimum (4.5:1 for text)
- **Screen Reader:** Announce updates for dynamic content (new bids, notifications)
- **Form Inputs:** Consistent dark mode implementation including all inputs and text fields

---

## Images

**Hero Section (Marketing/Landing Page Only):**
- **Not applicable** - This is a B2B application platform, not a marketing site
- Login/onboarding screens may use abstract illustrations of construction/business collaboration (geometric, minimal, primary color palette)

**In-App Images:**
- **Company Logos:** 48px circles for table rows, 120px for detail drawers
- **Crew Photos:** 64px circles (cards), 120px (full profiles)  
- **Document Icons:** 24px type-specific icons (PDF, License, Medical, etc.)
- **Empty States:** Simple SVG illustrations (no data found, no bids yet) in grayscale with primary accent