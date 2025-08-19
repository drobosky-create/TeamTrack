import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import { useAuth } from "@/hooks/useAuth";
import { MaterialDashboardLayout } from "@/components/layout/MaterialDashboardLayout";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import Dashboard from "@/pages/dashboard";
import TeamDirectory from "@/pages/team-directory";
import Reviews from "@/pages/reviews";
import Goals from "@/pages/goals";
import Templates from "@/pages/templates";
import Settings from "@/pages/settings";
import Profile from "@/pages/profile";
import Notifications from "@/pages/notifications";
import Billing from "@/pages/billing";
import SetupWizard from "@/pages/setup-wizard";
import BrandingPage from "@/pages/branding";
import AnalyticsPage from "@/pages/analytics";
import FreeAssessment from "@/pages/assessments/FreeAssessmentNew";
import GrowthAssessment from "@/pages/assessments/GrowthAssessment";
import ConsumerSignup from "@/pages/consumer-signup";
import ConsumerLogin from "@/pages/consumer-login";
import AdminLoginPage from "@/pages/admin-login";
import AssessmentSelection from "@/pages/assessment-selection";
import ConsumerDashboard from "@/pages/consumer-dashboard";
import ClientManagementPage from "@/pages/clients";
import AdminClientRecordsPage from "@/pages/admin/clients";
import AssessmentResults from "@/pages/AssessmentResultsNew";
import ValueImprovementCalculator from "@/pages/ValueImprovementCalculator";
import FollowUpOptionsPage from "@/pages/follow-up";
import AppleBitesLanding from "@/pages/applebites-landing";
import PerformanceHubLanding from "@/pages/performancehub-landing";
import ConsumerAuth from "@/pages/consumer-auth";
import TestDashboard from "@/pages/test-dashboard";
import AdminDashboard from "@/pages/admin-dashboard";
import CheckoutPage from "@/pages/checkout";
import SubscriptionPage from "@/pages/subscription";
import PaymentSuccessPage from "@/pages/payment-success";
import SubscriptionSuccessPage from "@/pages/subscription-success";
import PaymentDemoPage from "@/pages/payment-demo";
import NavigationTestPage from "@/pages/navigation-test";
import ThemeManager from "@/components/admin/ThemeManager";
import AppleBitesCheckoutPage from "@/pages/applebites-checkout";
import { ThemeTokenProvider } from "@/components/ThemeTokenProvider";
import { AdminAuthProvider, useAdminAuth } from './hooks/use-admin-auth';

// Admin Dashboard Wrapper Component
function AdminDashboardWrapper() {
  const { adminUser, isLoading } = useAdminAuth();

  if (isLoading) {
    return <div>Loading admin dashboard...</div>;
  }

  if (!adminUser) {
    return <AdminLoginPage />;
  }

  // Use the MaterialDashboardLayout with AdminDashboard for admin users
  return (
    <MaterialDashboardLayout>
      <AdminDashboard />
    </MaterialDashboardLayout>
  );
}

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Switch>
      {/* Public Routes - Landing Pages */}
      <Route path="/applebites" component={AppleBitesLanding} />
      <Route path="/applebites-checkout" component={AppleBitesCheckoutPage} />
      <Route path="/performance-hub" component={PerformanceHubLanding} />
      <Route path="/consumer-auth" component={ConsumerAuth} />
      <Route path="/consumer-signup" component={ConsumerSignup} />
      <Route path="/consumer-login" component={ConsumerLogin} />
      <Route path="/consumer-dashboard" component={ConsumerDashboard} />
      <Route path="/admin-login" component={AdminLoginPage} />
      
      {/* Admin Dashboard Route */}
      <Route path="/dashboard" component={AdminDashboardWrapper} />
      <Route path="/assessment-selection" component={AssessmentSelection} />
      <Route path="/assessments/free" component={FreeAssessment} />
      <Route path="/assessments/growth" component={GrowthAssessment} />
      <Route path="/assessment-results/:id" component={AssessmentResults} />
      <Route path="/value-improvement/:id" component={ValueImprovementCalculator} />
      <Route path="/test-dashboard" component={TestDashboard} />
      
      {/* Root redirect to PerformanceHub by default */}
      {isLoading || !isAuthenticated ? (
        <>
          <Route path="/" component={PerformanceHubLanding} />
          <Route component={NotFound} />
        </>
      ) : (
        <MaterialDashboardLayout>
          <Switch>
            <Route path="/" component={Dashboard} />
            <Route path="/setup" component={SetupWizard} />
            <Route path="/team" component={TeamDirectory} />
            <Route path="/reviews" component={Reviews} />
            <Route path="/goals" component={Goals} />
            <Route path="/templates" component={Templates} />
            <Route path="/branding" component={BrandingPage} />
            <Route path="/analytics" component={AnalyticsPage} />
            <Route path="/clients" component={ClientManagementPage} />
            <Route path="/admin/clients" component={AdminClientRecordsPage} />
            <Route path="/results/:id" component={AssessmentResults} />
            <Route path="/follow-up" component={FollowUpOptionsPage} />
            <Route path="/theme-manager" component={ThemeManager} />
            <Route path="/payment-demo" component={PaymentDemoPage} />
            <Route path="/navigation-test" component={NavigationTestPage} />
            <Route path="/checkout" component={CheckoutPage} />
            <Route path="/subscription" component={SubscriptionPage} />
            <Route path="/payment-success" component={PaymentSuccessPage} />
            <Route path="/subscription-success" component={SubscriptionSuccessPage} />
            <Route path="/settings" component={Settings} />
            <Route path="/profile" component={Profile} />
            <Route path="/notifications" component={Notifications} />
            <Route path="/billing" component={Billing} />
            <Route component={NotFound} />
          </Switch>
        </MaterialDashboardLayout>
      )}
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AdminAuthProvider>
        <ThemeTokenProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </ThemeTokenProvider>
      </AdminAuthProvider>
    </QueryClientProvider>
  );
}

export default App;
