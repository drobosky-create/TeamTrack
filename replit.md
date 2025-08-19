# Overview

PerformanceHub is a comprehensive performance tracking web application designed for team-based organizations. It provides role-based dashboards for admins, managers, and team members to conduct and track performance reviews across monthly, quarterly, and annual cycles. The system combines self-assessments with manager evaluations, uses customizable scoring templates, and supports file attachments for comprehensive performance documentation. The platform also integrates a business valuation module (AppleBites) for consumer-focused business assessment, offering tiered valuations and industry-specific analysis. This dual functionality aims to serve both internal team performance management and external business valuation needs within a single, cohesive platform.

# User Preferences

Preferred communication style: Simple, everyday language.
Design System: Universal token-based theming - all colors, gradients, spacing, shadows, and typography must reference tokens, never hardcoded values.

# System Architecture

## Frontend Architecture
- **Framework & Language**: React with TypeScript, utilizing functional components and hooks.
- **Build Tool**: Vite for development and hot module replacement.
- **Routing**: Wouter for client-side routing with role-based access.
- **State Management**: TanStack Query for server state management and caching.
- **UI Components**: Shadcn/ui built on Radix UI primitives, integrated with Material Dashboard React components for a sophisticated visual design.
- **Styling**: Tailwind CSS with universal token-based theming system. All styling properties (colors, gradients, spacing, shadows, typography) are defined in tokens.json as the single source of truth. Material-UI themes are dynamically generated from these tokens. Components reference theme.tokens or theme.gradients for all visual properties - no hardcoded values allowed.
- **Form Handling**: React Hook Form with Zod validation.

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
- **Authentication**: Replit-based OpenID Connect using Passport.js.
- **Authorization**: Three-tier role-based access control (admin, manager, team_member) enforced via middleware on both client and server.
- **Session Management**: Secure server-side sessions stored in PostgreSQL.
- **Role Navigation**: 
  - **Admin**: Full system control with audit logs, export center, NAICS management, integrations (Stripe, SendGrid, GHL), and activity tracking for dispute resolution
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
- **AppleBites Integration**: Full business valuation platform with Free, Growth, and Capital assessment tiers, featuring financial data entry, value driver evaluation, and NAICS-dependent analysis.
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