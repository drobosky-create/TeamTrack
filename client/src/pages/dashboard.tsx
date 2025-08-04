import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import MetricsCards from "@/components/dashboard/metrics-cards";
import RecentReviews from "@/components/dashboard/recent-reviews";
import TeamPerformance from "@/components/dashboard/team-performance";
import UpcomingReviews from "@/components/dashboard/upcoming-reviews";

export default function Dashboard() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading, user } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          title="Dashboard Overview" 
          subtitle={`Welcome back, ${user.firstName}! Here's your team's performance summary.`}
        />
        <main className="flex-1 overflow-y-auto p-6">
          <MetricsCards />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
            <RecentReviews />
            <TeamPerformance />
          </div>

          <div className="mt-8">
            <UpcomingReviews />
          </div>
        </main>
      </div>
    </div>
  );
}
