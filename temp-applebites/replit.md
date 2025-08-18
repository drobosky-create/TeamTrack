# replit.md

# Apple Bites – Development Notes

## Current Development Branch
**main** (protecting production platform)

All development is now being done directly on the **main** branch.  
The previous `ecosystem-modules` branch has been merged into `main` via cherry-pick, including all features such as search functionality, tier management, admin login, and dashboard updates.  

## Notes
- Use `main` for all future commits and pull requests.  
- `ecosystem-modules` is no longer the active development branch.  

## Overview
This is a full-stack web application for Meritage Partners, designed as a business valuation calculator. It guides users through a multi-step valuation process, generates professional PDF reports, and provides administrative dashboards for lead and team management. The platform aims to offer comprehensive business valuation services, leveraging AI for narrative generation and integrating with key external services for CRM and email automation. The project's vision is to provide a streamlined, accurate, and professional valuation tool with market potential for various business sizes.

## Current Development Status (August 18, 2025)
**Branch Transition**: Moving all ecosystem-modules functionality to main branch via cherry-pick process from commit `dec5fe138dbba1c84eee7cf467f7f2c029e6e463`

**Recently Fixed**:
- ✅ Resolved Git cherry-pick conflicts in App.tsx and MaterialDashboardLayout.tsx
- ✅ Created missing config/flags.ts file for feature flag management  
- ✅ Fixed import path issues (useAuth hook) and TypeScript type errors
- ✅ Application running successfully with search functionality and tier management ready for production

## Recent Changes (August 2025)
**✅ COMPLETED: Real Data Pre-fill Functionality (August 13, 2025)**
- Fixed Growth & Exit Assessment pre-fill feature to use actual user data from previous assessments
- Implemented intelligent financial calculations from historical EBITDA data (converts $82,464 EBITDA to realistic revenue estimates)
- Updated React Hook Form instances to properly display pre-filled values in all form fields
- Added comprehensive debugging for data loading and form population processes
- Pre-fill now calculates: Net Income ($57,725), Interest ($10,995), Taxes ($14,431), Depreciation ($16,493), Amortization ($5,498)
- Growth & Exit Assessment forms now display meaningful business data instead of blank fields

**✅ COMPLETED: Dynamic Pricing Integration (August 13, 2025)**
- Replaced all hardcoded pricing ($795, $1,995) with dynamic Stripe price fetching
- Updated pricing page to pull live prices from `/api/stripe/products` endpoint
- Enhanced strategic assessment page with dynamic pricing display
- Implemented automatic price formatting for proper currency display
- Added fallback pricing for offline scenarios while maintaining user experience
- Future price changes in Stripe now automatically update throughout the entire application

**✅ COMPLETED: UI Consistency Fixes (August 12, 2025)**
- Fixed "Free Assessment" identifier consistency by updating header title to match button text
- Resolved valuation results overflow on mobile with responsive grid layout that stacks properly
- Fixed "Explore" button navigation to properly link to dashboard instead of showing sidebar
- Updated mobile navigation "Apple Bites" text color to proper shade (#e9ecf2)
- Enhanced Free Assessment badge with flexbox centering to ensure text displays within styled container

**✅ COMPLETED: Full Admin Dashboard Rebuild**
- Migrated from shadcn/ui to Material Dashboard React components
- Implemented unified admin interface with internal tab navigation
- Fixed routing issues by replacing separate route components with state-managed tabs
- Added complete functionality for all admin sections:
  - Dashboard Overview: System metrics and team statistics
  - Team Members: Full CRUD operations with modal forms
  - Leads Management: Search, filter, and table view of all leads
  - Analytics Dashboard: System analytics and key performance metrics
- Resolved Material UI Grid syntax errors and JSX fragment issues
- Authentication confirmed working with email/password login

**✅ COMPLETED: Enhanced Leads Section with Dual View Functionality**
- Integrated valuation results viewing directly within existing Leads tab
- Added toggle buttons to switch between "Leads" and "Assessments" views
- Unified interface displays both lead management and completed assessment results
- Assessment view shows comprehensive data: business info, valuations, scores, tiers
- Includes action buttons for PDF reports and full assessment viewing
- Enhanced user experience by removing separate Valuations tab in favor of unified view
- Successfully tested and confirmed working with existing assessment data

**✅ COMPLETED: Mobile Navigation Drawer with Full Layout Fixes (August 11, 2025)**
- Implemented unified mobile navigation drawer with body scroll lock
- Fixed original sidebar overlapping issue by hiding desktop sidebar on mobile
- Removed fixed left margin from main content on mobile devices
- Added hamburger menu with white icon color in mobile navigation bar
- Fixed login form input text color to white on mobile devices
- Prevented horizontal scrolling with proper container constraints
- Made dashboard cards stack vertically on mobile for better fit
- Fixed logout functionality to use useAuth hook for proper session cleanup and cache invalidation
- Mobile logout now works correctly with proper authentication state management

**✅ COMPLETED: Add Team Member Modal UI Fix (August 5, 2025)**
- Fixed Last Name field display issue in Add Team Member popup form
- Resolved modal transparency problem by replacing MDBox with standard Material-UI Box
- Enhanced modal backdrop with dark overlay and blur effect for professional appearance
- Improved form layout using flexbox for proper side-by-side field arrangement
- Modal now displays with solid white background and proper visual hierarchy

**✅ COMPLETED: Admin Login Authentication System Fixed (August 5, 2025)**
- Resolved auto-logout issue that was clearing admin sessions on frontend mount
- Admin authentication working perfectly with both credential sets:
  - Primary: drobosky@meritage-partners.com / Cooper12!!
  - Fallback: admin / admin123
- Sessions now persist correctly across page refreshes
- Full admin dashboard access confirmed with all tabs functional
- User management and deletion operations working correctly

**✅ COMPLETED: Analytics Dashboard Accuracy & Real Data Integration (August 5, 2025)**
- Completely rebuilt analytics dashboard with proper Material-UI components
- Fixed 104+ component import errors and Material-UI variant issues
- Connected to real assessment data via /api/analytics/assessments endpoint
- Dashboard now shows accurate metrics from actual platform usage:
  - 16 total users in system
  - 114 total completed assessments
  - Real average valuations, EBITDA totals, and completion rates
  - Authentic follow-up intent and score distributions
  - Genuine monthly trend data from actual assessment dates
- Professional tabbed interface with interactive charts displaying real business intelligence

## User Preferences
Preferred communication style: Simple, everyday language. Focus on actions and progress rather than repetitive phrases. Perform periodic audits for project cleanup rather than extensive organizational work.

Development Priority: Always check Argon Dashboard folder first for any files, templates, or assets. Use Argon components, styles, and logic as the primary source. Only look elsewhere if Argon folder doesn't contain a relevant match.

## System Architecture

### Frontend
- **Framework**: React 18 with TypeScript
- **Styling**: Material Dashboard design system, professional blue-based color scheme with subtle shadows, and a clean, modern aesthetic. Prioritizes a two-column authentication layout and Material Dashboard components (MDBox, MDTypography, MDButton, etc.).
- **State Management**: React Hook Form for form state, TanStack Query for server state.
- **Routing**: Wouter for client-side routing.
- **Build Tool**: Vite.

### Backend
- **Runtime**: Node.js with Express.js server.
- **Language**: TypeScript with ES modules.
- **API Design**: RESTful API with JSON responses.
- **Session Management**: Express sessions with PostgreSQL storage.
- **Authentication**: Session-based authentication for admin/team access, includes OAuth (Google, GitHub, Apple) and email/password options with bcrypt hashing.

### Database
- **Primary Database**: PostgreSQL (Neon serverless).
- **ORM**: Drizzle ORM with PostgreSQL adapter.
- **Schema Management**: Drizzle Kit for migrations.

### Key Features & Design Decisions
- **Valuation Assessment**: Multi-step form (EBITDA → Adjustments → Value Drivers → Follow-up → Results) with real-time EBITDA calculations, value driver scoring (A-F grades), and AI-powered narrative generation (OpenAI GPT-4). Industry-specific NAICS multipliers are applied based on actual business performance.
- **Lead & Team Management**: Comprehensive lead tracking, status management, activity logging, and role-based access control (admin, member, viewer) for team members.
- **PDF Report Generation**: Professional valuation reports using Puppeteer, branded templates, automated email delivery via SendGrid, and embedded charts.
- **UI/UX**: Emphasis on a clean, professional interface with consistent branding (Apple Bites/Meritage Partners), responsiveness across devices, and intuitive user flows. Utilizes a blue color palette, glassmorphism effects, and animated loading indicators. Features include an interactive value calculator with gauge, strategic valuation range analysis, and a comprehensive dashboard displaying key metrics and past assessments.
- **Payment & Tier System**: Two-tier system (Free, Growth & Exit) with dynamic Stripe integration for pricing and payment processing. Includes automatic tier activation and user management.
- **Legal Compliance**: Integrated cookie banner, privacy policy, and terms of use pages.

## External Dependencies

### Production Services
- **Neon PostgreSQL**: Primary database hosting.
- **SendGrid**: Email delivery for reports and communications.
- **GoHighLevel**: CRM integration for contact synchronization and lead management.
- **OpenAI**: AI analysis services for narrative generation and financial coaching.
- **Stripe**: Payment processing for tiered access.
- **n8n**: Automation workflows for advanced lead processing.

### Development Tools & Libraries
- **Puppeteer**: PDF generation (Chromium).
- **Drizzle**: Database ORM and migrations.
- **TanStack Query**: Server state management.
- **React Hook Form**: Form validation and state.
- **Recharts**: Data visualization charts.
- **Vite**: Frontend build tool.
- **esbuild**: Backend bundling.

### UI/UX Libraries
- **shadcn/ui**: (Removed during Material Dashboard migration, but part of initial structure)
- **Radix UI**: (Removed during Material Dashboard migration)
- **Material-UI (MUI)**: Core UI component library.
- **Material Dashboard**: Theme and component system for consistent styling.