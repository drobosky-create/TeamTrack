import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { AuthPage } from "@/pages/AuthPage";
import { AppLayout } from "@/components/layout/AppLayout";
import { AdminDashboard } from "@/components/dashboard/AdminDashboard";
import { TeamDirectory } from "@/components/team/TeamDirectory";
import { ReviewsPage } from "@/components/reviews/ReviewsPage";
import { ReviewFormPage } from "@/components/reviews/ReviewFormPage";
import { CreateReviewPage } from "@/components/reviews/CreateReviewPage";
import { ReviewDashboard } from "@/components/reviews/ReviewDashboard";
import { SettingsPage } from "@/components/settings/SettingsPage";
import { ReviewTemplates } from "@/components/settings/ReviewTemplates";
import { ReportsPage } from "@/components/reports/ReportsPage";
import { GoalsPage } from "@/components/goals/GoalsPage";
import { DocumentsPage } from "@/components/documents/DocumentsPage";
import { HowToPage } from "@/components/help/HowToPage";
import { ReportCard } from "@/components/reports/ReportCard";
import { GettingStartedGuide } from "@/components/help/guides/GettingStartedGuide";
import { ReviewsGuide } from "@/components/help/guides/ReviewsGuide";
import { TeamGuide } from "@/components/help/guides/TeamGuide";
import { GoalsGuide } from "@/components/help/guides/GoalsGuide";
import { ReportsGuide } from "@/components/help/guides/ReportsGuide";
import { SettingsGuide } from "@/components/help/guides/SettingsGuide";
import NotificationsPage from "./pages/NotificationsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <AuthPage />;
  }
  
  return <AppLayout>{children}</AppLayout>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AuthProvider>
          <NotificationProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/" element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/team" element={
              <ProtectedRoute>
                <TeamDirectory />
              </ProtectedRoute>
            } />
            <Route path="/reviews" element={
              <ProtectedRoute>
                <ReviewsPage />
              </ProtectedRoute>
            } />
            <Route path="/reviews/create" element={
              <ProtectedRoute>
                <CreateReviewPage />
              </ProtectedRoute>
            } />
            <Route path="/reviews/dashboard" element={
              <ProtectedRoute>
                <ReviewDashboard />
              </ProtectedRoute>
            } />
            <Route path="/reviews/:reviewId" element={
              <ProtectedRoute>
                <ReviewFormPage />
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            } />
            <Route path="/templates" element={
              <ProtectedRoute>
                <ReviewTemplates />
              </ProtectedRoute>
            } />
            <Route path="/reports" element={
              <ProtectedRoute>
                <ReportsPage />
              </ProtectedRoute>
            } />
            <Route path="/report-card/:userId" element={
              <ProtectedRoute>
                <ReportCard />
              </ProtectedRoute>
            } />
            <Route path="/goals" element={
              <ProtectedRoute>
                <GoalsPage />
              </ProtectedRoute>
            } />
            <Route path="/documents" element={
              <ProtectedRoute>
                <DocumentsPage />
              </ProtectedRoute>
            } />
            <Route path="/notifications" element={
              <ProtectedRoute>
                <NotificationsPage />
              </ProtectedRoute>
            } />
            <Route path="/help" element={
              <ProtectedRoute>
                <HowToPage />
              </ProtectedRoute>
            } />
            <Route path="/help/getting-started" element={
              <ProtectedRoute>
                <GettingStartedGuide />
              </ProtectedRoute>
            } />
            <Route path="/help/reviews" element={
              <ProtectedRoute>
                <ReviewsGuide />
              </ProtectedRoute>
            } />
            <Route path="/help/team" element={
              <ProtectedRoute>
                <TeamGuide />
              </ProtectedRoute>
            } />
            <Route path="/help/goals" element={
              <ProtectedRoute>
                <GoalsGuide />
              </ProtectedRoute>
            } />
            <Route path="/help/reports" element={
              <ProtectedRoute>
                <ReportsGuide />
              </ProtectedRoute>
            } />
            <Route path="/help/settings" element={
              <ProtectedRoute>
                <SettingsGuide />
              </ProtectedRoute>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
          </NotificationProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;