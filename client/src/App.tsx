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
import FreeAssessment from "@/pages/assessments/FreeAssessment";
import GrowthAssessment from "@/pages/assessments/GrowthAssessment";
import ClientManagementPage from "@/pages/clients";
import AdminClientRecordsPage from "@/pages/admin/clients";
import AssessmentResults from "@/pages/AssessmentResults";
import FollowUpOptionsPage from "@/pages/follow-up";
import AppleBitesLanding from "@/pages/applebites-landing";
import PerformanceHubLanding from "@/pages/performancehub-landing";
import ConsumerAuth from "@/pages/consumer-auth";
import TestDashboard from "@/pages/test-dashboard";
import ThemeManager from "@/components/admin/ThemeManager";
import { ThemeTokenProvider } from "@/components/ThemeTokenProvider";



function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Switch>
      {/* Public Routes - Landing Pages */}
      <Route path="/applebites" component={AppleBitesLanding} />
      <Route path="/performance-hub" component={PerformanceHubLanding} />
      <Route path="/consumer-auth" component={ConsumerAuth} />
      <Route path="/assessments/free" component={FreeAssessment} />
      <Route path="/assessments/growth" component={GrowthAssessment} />
      <Route path="/assessment-results/:id" component={AssessmentResults} />
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
      <ThemeTokenProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeTokenProvider>
    </QueryClientProvider>
  );
}

export default App;
