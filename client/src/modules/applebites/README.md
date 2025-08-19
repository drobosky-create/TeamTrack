# AppleBites Module

This directory contains AppleBites business valuation platform components that were consolidated from the original `applebites/client/src/` directory for better organization within the unified application structure.

## Status

**Note**: The main AppleBites functionality has been integrated directly into the main application through:
- AppleBites Landing Page (`client/src/pages/applebites-landing.tsx`)
- Consumer Authentication (`client/src/pages/consumer-auth.tsx`)
- Free Assessment workflow (`client/src/pages/free-assessment.tsx`)
- Growth Assessment workflow (`client/src/pages/growth-assessment.tsx`)
- Assessment Results display (`client/src/pages/results.tsx`)
- Follow-up Options (`client/src/pages/follow-up.tsx`)

## Structure

This module serves as an archive of the original AppleBites components:
- `components/` - Original React components (for reference)
- `pages/` - Original page components (archived)
- `hooks/` - Custom React hooks (available for reuse)
- `lib/` - Utility functions and configurations
- `theme/` - AppleBites-specific theme configurations
- `utils/` - Helper utilities

## Integration

The unified application provides AppleBites functionality through:
- Dual routing: `/applebites` for external clients, `/performance-hub` for internal team
- Role-based access: Consumer (team_member), Team Member (manager), Admin (admin)
- Shared authentication system with Replit Auth
- Unified Material-UI theme system with database-driven UI tokens
- Centralized database schema in `shared/schema.ts`

## Usage

Components from this module can be referenced or imported when extending AppleBites functionality, but the main application flow uses the integrated pages in the primary `client/src/pages/` directory.