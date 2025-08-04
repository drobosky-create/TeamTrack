import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
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

const theme = createTheme({
  palette: {
    primary: {
      main: '#66bb6a',
    },
    secondary: {
      main: '#42a5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Switch>
      {isLoading || !isAuthenticated ? (
        <Route path="/" component={Landing} />
      ) : (
        <MaterialDashboardLayout>
          <Switch>
            <Route path="/" component={Dashboard} />
            <Route path="/team" component={TeamDirectory} />
            <Route path="/reviews" component={Reviews} />
            <Route path="/goals" component={Goals} />
            <Route path="/templates" component={Templates} />
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
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
