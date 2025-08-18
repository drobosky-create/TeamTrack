import React, { lazy, Suspense } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import MaterialWrapper from "@/components/MaterialWrapper";
import MobileNavigation from "@/components/MobileNavigation";
import { AdminAuthProvider } from "@/hooks/use-admin-auth";
import { TeamAuthProvider } from "@/hooks/use-team-auth";
import { useAuth } from "@/hooks/useAuth";
import FreeAssessment from "@/pages/free-assessment";
import GrowthExitAssessment from "@/pages/strategic-assessment-new-clean";
import AnalyticsDashboard from "@/pages/analytics-dashboard";
import ValueCalculator from "@/pages/value-calculator";
import LeadsDashboard from "@/pages/leads-dashboard";
import TeamDashboard from "@/pages/team-dashboard";
import AdminDashboard from "@/pages/admin-dashboard";
import Dashboard from "@/pages/dashboard";
import AssessmentResults from "@/pages/assessment-results";
import Profile from "@/pages/profile";
import PastAssessments from "@/pages/past-assessments";
import SignupPage from "@/pages/signup";
import LoginPage from "@/pages/login";
import PrivacyPolicy from "@/pages/privacy-policy";
import TermsOfUse from "@/pages/terms-of-use";
import PricingPage from "@/pages/pricing";
import LandingPage from "@/pages/landing";
import CheckoutSuccess from "@/pages/checkout-success";
import AdminLoginPage from "@/pages/admin-login";
import CookieBanner from "@/components/CookieBanner";
import { IS_UNIFIED_SHELL } from "@/config/flags";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();
  
  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        backgroundColor: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div>Loading...</div>
      </div>
    );
  }
  
  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'white' }}>
      <MobileNavigation>
        <Switch>
          {/* Authentication routes - always accessible */}
          <Route path="/signup" component={SignupPage} />
          <Route path="/login" component={LoginPage} />
          <Route path="/admin-login" component={AdminLoginPage} />

          {/* Admin routes - always accessible */}
          <Route path="/admin" component={AdminLoginPage} />

          
          {/* Legal pages - always accessible */}
          <Route path="/privacy-policy" component={PrivacyPolicy} />
          <Route path="/terms-of-use" component={TermsOfUse} />
          <Route path="/pricing">
            <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', background: 'linear-gradient(135deg, #0A1F44 0%, #1B2C4F 100%)' }}>Loading...</div>}>
              {React.createElement(lazy(() => import("./pages/dynamic-pricing")))}
            </Suspense>
          </Route>
          <Route path="/checkout">
            <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', background: 'linear-gradient(135deg, #0A1F44 0%, #1B2C4F 100%)' }}>Loading...</div>}>
              {React.createElement(lazy(() => import("./pages/checkout")))}
            </Suspense>
          </Route>
          <Route path="/checkout/success" component={CheckoutSuccess} />
          
          {/* Landing page for non-authenticated users, dashboard for authenticated */}
          <Route path="/">
            {isAuthenticated ? <Dashboard /> : <LandingPage />}
          </Route>
          <Route path="/dashboard">
            {isAuthenticated ? <Dashboard /> : <LoginPage />}
          </Route>
          
          {/* Assessment pages - protected */}
          <Route path="/assessment/free">
            {isAuthenticated ? <FreeAssessment /> : <LoginPage />}
          </Route>
          <Route path="/assessment/paid">
            {isAuthenticated ? <GrowthExitAssessment /> : <LoginPage />}
          </Route>
          <Route path="/assessment-results/:id">
            {isAuthenticated ? <AssessmentResults /> : <LoginPage />}
          </Route>
          <Route path="/value-calculator">
            {isAuthenticated ? <ValueCalculator /> : <LoginPage />}
          </Route>
          <Route path="/profile">
            {isAuthenticated ? <Profile /> : <LoginPage />}
          </Route>
          <Route path="/past-assessments">
            {isAuthenticated ? <PastAssessments /> : <LoginPage />}
          </Route>
          
          {/* Admin/Team pages - self-authenticated */}
          <Route path="/admin/analytics" component={AnalyticsDashboard} />
          <Route path="/admin/leads" component={LeadsDashboard} />
          <Route path="/admin/team" component={AdminLoginPage} />
          <Route path="/team" component={TeamDashboard} />
          
          {/* Fallback - redirect to login if not authenticated */}
          <Route>
            {isAuthenticated ? <Dashboard /> : <LoginPage />}
          </Route>
        </Switch>
      </MobileNavigation>
      <CookieBanner />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MaterialWrapper>
        <AdminAuthProvider>
          <TeamAuthProvider>
            <Router />
          </TeamAuthProvider>
        </AdminAuthProvider>
      </MaterialWrapper>
    </QueryClientProvider>
  );
}

export default App;
