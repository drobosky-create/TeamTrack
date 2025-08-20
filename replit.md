# Overview
PerformanceHub is a comprehensive web application for team performance tracking and business valuation. It offers role-based dashboards for managing performance reviews across various cycles, integrating self-assessments with manager evaluations, customizable scoring, and document attachments. Additionally, it features AppleBites, a consumer-facing platform for business valuation, guiding users through account creation, a four-step assessment process, valuation report generation, a value improvement calculator, and AI coaching recommendations. This dual functionality provides a unified platform for internal team management and external business valuation needs.

# User Preferences
Preferred communication style: Simple, everyday language.
Design System: Universal token-based theming - all colors, gradients, spacing, shadows, and typography must reference tokens, never hardcoded values.

# System Architecture

## Frontend Architecture
- **Framework & Language**: React with TypeScript, using functional components and hooks.
- **Build Tool**: Vite.
- **Routing**: Wouter for client-side routing with role-based access.
- **State Management**: TanStack Query for server state management and caching.
- **UI Components**: Shadcn/ui (built on Radix UI) integrated with Material Dashboard React components for a sophisticated visual design. MaterialDashboardLayout provides a unified sidebar experience with role-based navigation.
- **Styling**: Tailwind CSS with a universal token-based theming system, defining all visual properties in `tokens.json`. Material-UI themes are dynamically generated from these tokens.
- **Form Handling**: React Hook Form with Zod validation.
- **Layout System**: UnifiedSidebar component with Material-UI gradient styling and consistent branding.

## Backend Architecture
- **Server**: Express.js with TypeScript for REST API.
- **ORM**: Drizzle ORM with PostgreSQL dialect.
- **Authentication**: Replit-based OpenID Connect authentication using Passport.js, with PostgreSQL-based session store.
- **File Handling**: Integration with Google Cloud Storage and Uppy for file uploads.
- **API Design**: RESTful endpoints with role-based access control and error handling.

## Database Design
- **Database**: PostgreSQL (Neon serverless).
- **Schema Management**: Drizzle Kit for migrations.
- **Key Tables**: Users (with admin, manager, team_member roles), customizable review templates, reviews (with scoring, notes, attachments), session management, and business valuation assessments.

## Authentication & Authorization
- **Authentication**: Dual system supporting Replit-based OpenID Connect for regular users and email/password for admin access.
- **Authorization**: Three-tier role-based access control (admin, manager, team_member) enforced via middleware.
- **Session Management**: Secure server-side sessions stored in PostgreSQL.
- **Admin Portal**: Dedicated admin authentication flow with MaterialDashboardLayout integration.
- **Role Navigation**: Distinct functionalities for Admin (full control, audit logs, integrations), Manager (deal pipeline, team oversight, client management), and User/Team Member (AppleBites navigation, collaboration, tasks, feedback).

## Data Flow Patterns
- **Client-Server Communication**: REST API with JSON payloads.
- **Caching**: React Query for client-side caching.
- **Error Handling**: Centralized error boundaries and toast notifications.
- **Form Validation**: Client-side validation with Zod schemas.

## Feature Specifications & Design Choices
- **Role-Based Dashboards**: Provides distinct dashboards for different user roles.
- **Performance Review System**: Supports monthly, quarterly, and annual review cycles with self-assessments and manager evaluations.
- **Customizable Templates**: Allows creation of structured review templates with custom core values.
- **Setup Wizard**: Guides initial system configuration.
- **AppleBites Consumer Flow**: Authentication-first approach with a 4-step assessment (Financials, Adjustments, Value Drivers, Follow-up), including a Value Improvement Calculator and AI coaching.
- **Consumer Authentication**: Separate user system with bcrypt hashing and PostgreSQL storage.
- **UI/UX Decisions**: Utilizes Material Dashboard React for a modern aesthetic, with a centralized UI Token Management System for dynamic theme customization. Dual-branded landing pages for PerformanceHub and AppleBites.

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