import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  LayoutDashboard,
  Users,
  FileText,
  Settings,
  BarChart3,
  Building2,
  LogOut,
  User,
  Target,
  HelpCircle,
  ClipboardList,
  FolderOpen
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface NavItem {
  title: string;
  url: string;
  icon: React.ElementType;
  roles: string[];
}

const getNavigationItems = (userId: string): NavItem[] => [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
    roles: ["admin", "manager", "team_member"]
  },
  {
    title: "Team Directory",
    url: "/team",
    icon: Users,
    roles: ["admin", "manager"]
  },
  {
    title: "Reviews",
    url: "/reviews",
    icon: FileText,
    roles: ["admin", "manager", "team_member"]
  },
  {
    title: "Templates",
    url: "/templates",
    icon: BarChart3,
    roles: ["admin"]
  },
  {
    title: "Reports",
    url: "/reports",
    icon: BarChart3,
    roles: ["admin", "manager"]
  },
  {
    title: "Goals",
    url: "/goals",
    icon: Target,
    roles: ["admin", "manager", "team_member"]
  },
  {
    title: "Documents",
    url: "/documents",
    icon: FolderOpen,
    roles: ["admin", "manager"]
  },
  {
    title: "My Report Card",
    url: `/report-card/${userId}`,
    icon: ClipboardList,
    roles: ["admin", "manager", "team_member"]
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
    roles: ["admin"]
  },
  {
    title: "Help",
    url: "/help",
    icon: HelpCircle,
    roles: ["admin", "manager", "team_member"]
  }
];

export function AppSidebar() {
  const { state } = useSidebar();
  const { user, profile, logout } = useAuth();
  const location = useLocation();
  const currentPath = location.pathname;
  
  const collapsed = state === "collapsed";

  const navigationItems = getNavigationItems(user?.id || '');
  const filteredItems = navigationItems.filter(item => 
    profile?.role && item.roles.includes(profile.role)
  );

  const isActive = (path: string) => currentPath === path;
  const getNavClassName = ({ isActive }: { isActive: boolean }) =>
    isActive 
      ? "bg-primary/10 text-primary font-medium border-r-2 border-primary" 
      : "hover:bg-muted/50 text-foreground-muted hover:text-foreground";

  const handleLogout = () => {
    logout();
  };

  if (!user) return null;

  return (
    <Sidebar
      className={`${collapsed ? "w-16" : "w-64"} border-r border-border-soft bg-surface shadow-soft transition-all duration-300`}
      collapsible="icon"
    >
      {/* Header */}
      <SidebarHeader className="p-4 border-b border-border-soft">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 bg-gradient-primary rounded-lg flex items-center justify-center shrink-0">
            <Building2 className="h-4 w-4 text-white" />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <h1 className="font-semibold text-foreground truncate">Performance Tracker</h1>
              <p className="text-xs text-muted-foreground truncate">{profile?.department || 'Employee'}</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        <SidebarGroup>
          {!collapsed && <SidebarGroupLabel>Navigation</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {filteredItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="h-10">
                    <NavLink to={item.url} className={getNavClassName}>
                      <item.icon className="h-4 w-4 shrink-0" />
                      {!collapsed && <span className="truncate">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="p-4 border-t border-border-soft">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8 shrink-0">
            <AvatarImage src={profile?.photo_url || ''} alt={profile?.name || ''} />
            <AvatarFallback className="bg-primary/10 text-primary text-xs">
              {profile?.name?.split(' ').map(n => n[0]).join('') || user?.email?.[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-foreground truncate">{profile?.name || user?.email}</p>
              <p className="text-xs text-muted-foreground truncate">{profile?.email || user?.email}</p>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="h-8 w-8 p-0 shrink-0 hover:bg-destructive/10 hover:text-destructive"
            title="Logout"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}