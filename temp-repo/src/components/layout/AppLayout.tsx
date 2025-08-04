import React from 'react';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from './AppSidebar';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { NotificationPanel } from '@/components/notifications/NotificationPanel';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { user, profile } = useAuth();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background-subtle">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          {/* Top Bar */}
          <header className="h-16 border-b border-border-soft bg-surface shadow-soft flex items-center justify-between px-6">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="hover:bg-muted rounded-lg p-2 transition-colors" />
              
              {/* Search */}
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search reviews, team members..." 
                  className="pl-10 w-80 bg-background"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Notifications */}
              <NotificationPanel />
              
              {/* User Info */}
              <div className="hidden sm:flex items-center gap-2 text-sm">
                <span className="text-foreground-muted">Welcome back,</span>
                <span className="font-medium text-foreground">{profile?.name?.split(' ')[0] || user?.email?.split('@')[0]}</span>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};