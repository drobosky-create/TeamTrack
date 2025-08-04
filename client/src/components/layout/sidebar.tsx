import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  Users, 
  ClipboardList, 
  FileText, 
  Settings, 
  TrendingUp,
  LogOut 
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function Sidebar() {
  const [location] = useLocation();
  const { user } = useAuth();

  const handleLogout = () => {
    window.location.href = '/api/logout';
  };

  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard, allowedRoles: ['admin', 'manager', 'team_member'] },
    { name: 'Team Directory', href: '/team', icon: Users, allowedRoles: ['admin', 'manager'] },
    { name: 'Reviews', href: '/reviews', icon: ClipboardList, allowedRoles: ['admin', 'manager', 'team_member'] },
    { name: 'Templates', href: '/templates', icon: FileText, allowedRoles: ['admin'] },
    { name: 'Settings', href: '/settings', icon: Settings, allowedRoles: ['admin', 'manager', 'team_member'] },
  ];

  const filteredNavigation = navigation.filter(item => 
    item.allowedRoles.includes(user?.role || 'team_member')
  );

  return (
    <div className="w-64 bg-white shadow-lg border-r border-gray-200 flex flex-col">
      {/* Logo/Branding */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <TrendingUp className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">PerformanceHub</h1>
            <p className="text-xs text-gray-500 capitalize">
              {user?.role?.replace('_', ' ')} Dashboard
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {filteredNavigation.map((item) => {
            const isActive = location === item.href;
            return (
              <li key={item.name}>
                <Link href={item.href}>
                  <a 
                    className={cn(
                      "flex items-center space-x-3 p-3 rounded-lg transition-colors",
                      isActive 
                        ? "bg-blue-50 text-primary border border-blue-100" 
                        : "text-gray-700 hover:bg-gray-50"
                    )}
                    data-testid={`nav-link-${item.name.toLowerCase().replace(' ', '-')}`}
                  >
                    <item.icon className="h-5 w-5" />
                    <span className={isActive ? "font-medium" : ""}>{item.name}</span>
                  </a>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user?.profileImageUrl || undefined} />
            <AvatarFallback>
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate" data-testid="sidebar-user-name">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs text-gray-500 truncate capitalize" data-testid="sidebar-user-role">
              {user?.role?.replace('_', ' ')}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="text-gray-400 hover:text-gray-600"
            data-testid="button-sidebar-logout"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
