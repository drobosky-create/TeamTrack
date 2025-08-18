# Overview

PerformanceHub is a comprehensive performance tracking web application designed for team-based organizations. The application provides role-based dashboards for admins, managers, and team members to conduct and track performance reviews across monthly, quarterly, and annual cycles. The system combines self-assessments with manager evaluations, uses customizable scoring templates, and supports file attachments for comprehensive performance documentation.

# User Preferences

Preferred communication style: Simple, everyday language.

# Recent Changes

## AppleBites Integration & Advanced Analytics (Jan 18, 2025)
- Successfully integrated AppleBites business valuation functionality into PerformanceHub
- Added comprehensive Value Drivers Heatmap component for visual performance assessment
- Implemented Advanced Analytics dashboard with charts, metrics, and insights
- Extended database schema with assessments table supporting A-F grading system
- Created new analytics page with tabbed interface: Overview Dashboard, Performance Heatmap, Team Insights
- Added "Advanced Analytics" navigation item for admin and manager roles
- Seamlessly merged AppleBites components while maintaining Material-UI design consistency
- Performance assessment system now supports 10 key areas: Financial Performance, Customer Relations, Leadership, Innovation, Goal Achievement, Systems & Processes, Quality Standards, Industry Knowledge, Risk Management, and Independence

## Enhanced Navigation Integration (Jan 18, 2025)
- Successfully merged AppSidebar functionality into MaterialDashboardLayout while preserving Material-UI styling
- Added new navigation items: Reports, Documents, My Report Card (user-specific), Help, and Advanced Analytics
- Implemented dynamic user-specific routing for personalized pages
- Enhanced role-based filtering logic for better permission control
- Maintained green gradient sidebar design with all Material Dashboard animations and effects
- Navigation now includes 17 total menu items with proper role restrictions

## Setup Wizard Implementation (Jan 8, 2025)
- Created comprehensive setup wizard to guide users through performance review system configuration
- 6-step wizard process covering welcome, template selection, configuration, team setup, scheduling, and completion
- Interactive template type selection between Standard and Structured templates
- Built-in customization tools for company values and competencies with quick-add examples
- **Enhanced team setup with member invitation system** - users can invite new team members during initial setup
- Email invitation functionality with role assignment (team member or manager) built into wizard
- Team member overview showing both current and pending invited members
- Integrated into navigation sidebar and dashboard with prominent call-to-action banner
- Wizard creates fully configured templates and sends team invitations for complete onboarding

## Customizable Template System Transformation (Jan 8, 2025)
- Transformed Army-specific template system into fully customizable company template system based on user feedback
- Updated database schema to use generic field names (coreValues, competencies) instead of military-specific terms
- Modified template modal UI to support custom company values and competencies that can be edited and configured
- Renamed template types from "army" to "structured" to reflect the flexible, non-military approach
- Updated storage methods and API routes to handle the new customizable template structure
- Companies can now create structured review templates with their own values, competencies, and evaluation criteria
- Implemented editable core values and competencies with quick-add examples and custom field support

## Material Dashboard Integration (Jan 4, 2025)
- Successfully integrated Material Dashboard React UI components from GitHub repository
- Replaced basic UI with sophisticated Material Dashboard layout and styling
- Created MaterialDashboardLayout component with professional sidebar navigation
- Enhanced dashboard with Material-UI statistics cards featuring floating gradient icons
- Fixed layout positioning issues ensuring content displays properly to the right of sidebar
- Improved visual design with modern Material Design aesthetics, shadows, and hover effects
- Updated card styling with professional gradients, proper spacing, and responsive design

# System Architecture

## Frontend Architecture
- **React with TypeScript**: Main UI framework using functional components and hooks
- **Vite**: Build tool and development server with hot module replacement
- **Routing**: Wouter for client-side routing with role-based page access
- **State Management**: TanStack Query (React Query) for server state management and caching
- **UI Components**: Shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming and responsive design
- **Form Handling**: React Hook Form with Zod validation for type-safe form management

## Backend Architecture
- **Express.js**: REST API server with TypeScript
- **Database ORM**: Drizzle ORM with PostgreSQL dialect for type-safe database operations
- **Authentication**: Replit-based OpenID Connect authentication with session management
- **Session Storage**: PostgreSQL-based session store using connect-pg-simple
- **File Uploads**: Integration with Google Cloud Storage and Uppy for file handling
- **API Design**: RESTful endpoints with role-based access control and error handling middleware

## Database Design
- **PostgreSQL**: Primary database using Neon serverless PostgreSQL
- **Schema Management**: Drizzle Kit for migrations and schema evolution
- **Key Tables**: 
  - Users with role-based permissions (admin, manager, team_member)
  - Review templates with customizable categories
  - Reviews with scoring, notes, and attachment support
  - Session management for authentication

## Authentication & Authorization
- **OpenID Connect**: Replit-based authentication using Passport.js strategy
- **Role-Based Access**: Three-tier permission system (admin, manager, team_member)
- **Session Management**: Secure server-side sessions with PostgreSQL storage
- **Route Protection**: Middleware-based authentication checks on both client and server

## Data Flow Patterns
- **Client-Server Communication**: REST API with JSON payloads
- **Caching Strategy**: React Query for client-side caching with automatic invalidation
- **Error Handling**: Centralized error boundaries and toast notifications
- **Form Validation**: Client-side validation with Zod schemas shared between frontend and backend

# External Dependencies

## Database Services
- **Neon Database**: Serverless PostgreSQL hosting with connection pooling
- **DATABASE_URL**: Environment variable for database connection string

## Authentication Services
- **Replit Auth**: OpenID Connect provider for user authentication
- **ISSUER_URL**: Authentication service endpoint
- **SESSION_SECRET**: Server-side session encryption key

## File Storage
- **Google Cloud Storage**: Cloud storage service for review attachments
- **Uppy**: File upload library with drag-and-drop support and progress tracking

## Development Tools
- **Replit Integration**: Development environment with live reload and error overlay
- **Vite Plugins**: Runtime error modal and cartographer for enhanced development experience

## UI/UX Libraries
- **Radix UI**: Headless component primitives for accessibility
- **Lucide React**: Icon library for consistent iconography
- **date-fns**: Date manipulation and formatting utilities
- **Tailwind CSS**: Utility-first CSS framework with custom design system