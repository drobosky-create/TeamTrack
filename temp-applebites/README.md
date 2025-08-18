# Apple Bites Business Valuation Platform

A comprehensive web application designed for Meritage Partners to provide professional business valuations through an intuitive multi-step assessment process, complete with administrative dashboards and automated reporting capabilities.

## 🚀 Overview

This full-stack application guides users through a sophisticated business valuation process, generates professional PDF reports, and provides comprehensive administrative tools for lead and team management. The platform leverages AI-powered analysis and integrates with key external services to deliver accurate, professional valuations for businesses of all sizes.

Apple Bites functions as the front-end qualification and valuation engine for Meritage Partners, designed to assess and segment opportunities before they move into the M&A CRM and deal execution workflows.

## ✨ Key Features

### 📊 Business Valuation Assessment
- **Multi-step Assessment Process**: EBITDA calculation → Financial adjustments → Value driver scoring → Follow-up preferences → Comprehensive results
- **AI-Powered Analysis**: OpenAI GPT-4 integration for intelligent narrative generation and financial coaching
- **Industry-Specific Valuations**: NAICS multipliers applied based on actual business performance metrics
- **Real-time Calculations**: Dynamic EBITDA calculations with instant feedback and validation
- **Professional Scoring**: A-F grade system for value drivers with detailed performance analysis
- **Integrated qualification** scoring that will trigger CRM pipeline placement in future phases.

### 👥 Administrative Dashboard
- **Unified Interface**: Complete admin panel with internal tab navigation for seamless management
- **Team Management**: Full CRUD operations for team members with role-based access control (admin, member, viewer)
- **Integrated Leads Management**: Combined leads and assessment viewing with expandable inline reports
- **Real-time Analytics**: Live dashboard showing system metrics, completion rates, and performance trends
- **Assessment Results Access**: Direct admin access to user assessment results without authentication barriers
- **Future release**: Will include deal and team KPI tracking modules, enabling opportunity performance measurement from the point of assessment.

### 📈 Analytics & Reporting
- **Real-time Metrics**: Live data from actual platform usage including completion rates and average valuations
- **Interactive Charts**: Professional data visualization with trends, distributions, and performance indicators
- **Comprehensive Insights**: Follow-up intent tracking, score distributions, and monthly trend analysis
- **Export Capabilities**: PDF report generation with professional branding and automated email delivery

### 🔐 Authentication & Access Control
- **Session-based Authentication**: Secure admin and team access with persistent sessions
- **Multi-tier Access**: Free and premium tier system with Stripe payment integration
- **Admin Bypass**: Seamless admin access to user assessment results for support and analysis
- **Credential Management**: Multiple authentication methods including email/password and OAuth options

### 💳 Payment & Subscription Management
- **Stripe Integration**: Professional payment processing for tiered access plans
- **Dynamic Pricing**: Two-tier system (Free, Growth & Exit) with automatic activation
- **Subscription Management**: Automated billing and user tier management

###  Planned Features
- **CRM integration** for automated lead funnel placement.
- **KPI tracking dashboards** for both opportunities and team member performance.
- **DocuSign integration** for e-signature workflows tied to assessments.
- **AI Agent assistance** for guided onboarding and valuation improvement suggestions.
- **Dynamic NAICS crawler** for live multiplier updates.

## 🛠 Technical Architecture

### Frontend
- **Framework**: React 18 with TypeScript for type-safe development
- **UI Components**: Material Dashboard React with Material-UI (MUI) components
- **State Management**: React Hook Form for forms, TanStack Query for server state
- **Routing**: Wouter for efficient client-side routing
- **Build System**: Vite for fast development and optimized production builds
- **Styling**: Professional blue-based design system with glassmorphism effects

### Backend
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript with ES modules for modern development
- **API Design**: RESTful APIs with JSON responses
- **Session Management**: Express sessions with PostgreSQL storage
- **Authentication**: Simple session-based authentication with bcrypt password hashing

### Database
- **Database**: PostgreSQL (Neon serverless) for reliable data persistence
- **ORM**: Drizzle ORM with PostgreSQL adapter for type-safe database operations
- **Migrations**: Drizzle Kit for schema management and automated migrations

## 🔧 Setup & Installation

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL database (Neon recommended)
- Stripe account for payment processing
- SendGrid account for email delivery
- OpenAI API key for AI analysis

### Environment Variables
Create a `.env` file with the following variables:
```bash
DATABASE_URL=your_postgresql_connection_string
STRIPE_SECRET_KEY=your_stripe_secret_key
VITE_STRIPE_PUBLIC_KEY=your_stripe_publishable_key
SENDGRID_API_KEY=your_sendgrid_api_key
OPENAI_API_KEY=your_openai_api_key
SESSION_SECRET=your_session_secret
```

### Installation
```bash
# Install dependencies
npm install

# Set up database schema
npm run db:push

# Start development server
npm run dev
```

The application will be available at `http://localhost:5000`

## 👨‍💼 Admin Access

### Authentication Credentials
- **Primary**: `drobosky@meritage-partners.com` / `Cooper12!!`
- **Fallback**: `admin` / `admin123`

### Admin Capabilities
- View and manage all assessment results
- Access comprehensive analytics dashboard
- Manage team members and permissions
- Export PDF reports and lead data
- Monitor system performance and usage metrics

## 📱 Usage

### For Business Owners
1. **Start Assessment**: Begin with basic business information
2. **EBITDA Calculation**: Input financial data for automated calculations
3. **Value Driver Analysis**: Complete scoring across key business areas
4. **Follow-up Preferences**: Set communication and next step preferences
5. **Receive Results**: Get comprehensive valuation report with AI-powered insights

### For Administrators
1. **Dashboard Access**: Login with admin credentials
2. **Lead Management**: View, search, and filter all leads and assessments
3. **Analytics Review**: Monitor platform performance and user engagement
4. **Team Management**: Add, edit, or remove team members
5. **Report Generation**: Access and export professional PDF reports

## 📊 Current System Status

### Recent Completions ✅
- **Admin Dashboard Rebuild**: Complete migration to Material Dashboard React
- **Integrated Assessment Management**: Unified leads and assessment viewing
- **Real-time Analytics**: Connected to actual assessment data
- **Authentication System**: Persistent admin sessions with proper access control
- **Assessment Results Access**: Admin bypass for seamless result viewing
- **UI/UX Improvements**: Fixed Material-UI component errors and enhanced interface

### System Metrics
- **114** total completed assessments
- **16** registered users in system
- Real average valuations and EBITDA calculations
- Authentic follow-up intent and score distributions
- Live monthly trend data from actual assessment dates

## 🔗 External Integrations

- **Neon PostgreSQL**: Primary database hosting
- **SendGrid**: Email delivery for reports and communications
- **GoHighLevel**: CRM integration for contact synchronization
- **OpenAI**: AI analysis services for narrative generation
- **Stripe**: Payment processing for tiered access
- **Puppeteer**: Professional PDF report generation

## 🎨 Design System

The platform features a professional, modern design with:
- Clean blue-based color palette with subtle shadows
- Glassmorphism effects and animated loading indicators
- Responsive design optimized for all devices
- Interactive value calculators with gauge visualizations
- Comprehensive dashboard with key metrics display

## 🚀 Deployment

The application is configured for deployment on Replit with:
- Automatic workflow management
- Environment variable configuration
- Database connection handling
- SSL certificate management
- Custom domain support

---

**Built with ❤️ for Meritage Partners**

For technical support or questions, contact the development team or refer to the comprehensive documentation in `replit.md`.