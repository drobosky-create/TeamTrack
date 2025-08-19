# Overview

PerformanceHub is a comprehensive performance tracking web application designed for team-based organizations. It provides role-based dashboards for admins, managers, and team members to conduct and track performance reviews across monthly, quarterly, and annual cycles. The system combines self-assessments with manager evaluations, uses customizable scoring templates, and supports file attachments for comprehensive performance documentation. 

The platform also integrates AppleBites, a consumer-facing business valuation platform requiring account creation before assessment access. The customer journey follows: Account Creation → Assessment Selection → 4-Step Assessment (Financials → Adjustments → Value Drivers → Follow-up) → Valuation Report → Value Improvement Calculator → AI Coaching Recommendations upsell. This dual functionality serves both internal team performance management and external business valuation needs within a single, cohesive platform.

## Recent Updates (August 19, 2025)
- Successfully integrated MaterialDashboardLayout from TeamTrack with unified sidebar design for admin dashboard
- Implemented dual authentication system supporting both regular users and admin sessions
- Fixed horizontal scrolling issues in sidebar with proper overflow handling and text truncation
- Created comprehensive AdminDashboard with role testing functionality and admin-specific features
- Established consistent Material-UI gradient styling across all dashboard interfaces
- Fully restored AppleBites landing page at `/applebites` route with three pricing tiers (Free, Growth & Exit, Capital)
- Fixed AppleBites logo display by copying from `applebites/public/` to main `public/` directory
- Changed navigation button from "Meritage Partners" to "PerformanceHub" linking back to main application
- Reduced footer vertical size for more compact, professional appearance
- Clarified architecture: `/applebites` directory contains standalone app, while `client/src/pages/applebites-landing.tsx` serves the landing page

# User Preferences

Preferred communication style: Simple, everyday language.
Design System: Universal token-based theming - all colors, gradients, spacing, shadows, and typography must reference tokens, never hardcoded values.

# System Architecture

## Frontend Architecture
- **Framework & Language**: React with TypeScript, utilizing functional components and hooks.
- **Build Tool**: Vite for development and hot module replacement.
- **Routing**: Wouter for client-side routing with role-based access.
- **State Management**: TanStack Query for server state management and caching.
- **UI Components**: Shadcn/ui built on Radix UI primitives, integrated with Material Dashboard React components for a sophisticated visual design. MaterialDashboardLayout provides unified sidebar experience with role-based navigation.
- **Styling**: Tailwind CSS with universal token-based theming system. All styling properties (colors, gradients, spacing, shadows, typography) are defined in tokens.json as the single source of truth. Material-UI themes are dynamically generated from these tokens. Components reference theme.tokens or theme.gradients for all visual properties - no hardcoded values allowed.
- **Form Handling**: React Hook Form with Zod validation.
- **Layout System**: UnifiedSidebar component with Material-UI gradient styling, overflow protection, and consistent branding across all dashboards.

## Backend Architecture
- **Server**: Express.js with TypeScript for REST API.
- **ORM**: Drizzle ORM with PostgreSQL dialect for type-safe database operations.
- **Authentication**: Replit-based OpenID Connect authentication using Passport.js, with PostgreSQL-based session store.
- **File Handling**: Integration with Google Cloud Storage and Uppy for file uploads.
- **API Design**: RESTful endpoints with role-based access control and error handling middleware.

## Database Design
- **Database**: PostgreSQL (Neon serverless).
- **Schema Management**: Drizzle Kit for migrations.
- **Key Tables**: Users (with admin, manager, team_member roles), customizable review templates, reviews (with scoring, notes, attachments), and session management. Also includes tables for business valuation assessments (valuationAssessments, assessments) supporting A-F grading.

## Authentication & Authorization
- **Authentication**: Dual authentication system - Replit-based OpenID Connect using Passport.js for regular users, and email/password authentication for admin access.
- **Authorization**: Three-tier role-based access control (admin, manager, team_member) enforced via middleware on both client and server.
- **Session Management**: Secure server-side sessions stored in PostgreSQL with bcrypt password hashing for admin accounts.
- **Admin Portal**: Dedicated admin authentication flow with MaterialDashboardLayout integration and role testing capabilities.
- **Role Navigation**: 
  - **Admin**: Full system control with audit logs, export center, NAICS management, integrations (Stripe, SendGrid, GHL), activity tracking for dispute resolution, and role preview functionality
  - **Manager**: Deal pipeline visibility, team oversight, approval workflows, client management, limited export tools for Meritage Partners reporting
  - **User** (formerly Team Member): Consumer-focused AppleBites navigation with collaboration features, limited client view access, tasks & feedback from managers, notifications

## Data Flow Patterns
- **Client-Server Communication**: REST API with JSON payloads.
- **Caching**: React Query for client-side caching with automatic invalidation.
- **Error Handling**: Centralized error boundaries and toast notifications.
- **Form Validation**: Client-side validation with Zod schemas.

## Feature Specifications & Design Choices
- **Role-Based Dashboards**: Provides distinct dashboards for admins, managers, and team members.
- **Performance Review System**: Supports monthly, quarterly, annual review cycles with self-assessments and manager evaluations.
- **Customizable Templates**: Allows companies to create structured review templates with custom core values and competencies.
- **Setup Wizard**: Guides users through initial system configuration, including template selection, team setup, and member invitation.
- **AppleBites Consumer Flow**: Authentication-first approach requiring account creation before assessment access. 4-step assessment structure (Financials → Adjustments → Value Drivers → Follow-up) with user data from signup populating contact fields. Includes Value Improvement Calculator and AI coaching upsell path.
- **Consumer Authentication**: Separate consumer user system with bcrypt password hashing, session management, and PostgreSQL storage.
- **UI/UX Decisions**: Utilizes Material Dashboard React for a professional, modern aesthetic with a green gradient sidebar. Incorporates a centralized UI Token Management System for dynamic theme customization. Dual branded landing pages for PerformanceHub and AppleBites with distinct routing and consumer authentication.

# External Dependencies

## Database Services
- **Neon Database**: Serverless PostgreSQL hosting.

## Authentication Services
- **Replit Auth**: OpenID Connect provider.

## File Storage
- **Google Cloud Storage**: Cloud storage for review attachments.
- **Uppy**: File upload library.

## UI/UX Libraries
- **Radix UI**: Headless component primitives.
- **Lucide React**: Icon library.
- **date-fns**: Date manipulation and formatting utilities.
- **Tailwind CSS**: Utility-first CSS framework.