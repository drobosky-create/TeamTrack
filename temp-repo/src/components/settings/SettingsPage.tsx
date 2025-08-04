import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserManagement } from "./UserManagement";
import { CompanySettings } from "./CompanySettings";
import { useAuth } from "@/contexts/AuthContext";

export function SettingsPage() {
  const { profile } = useAuth();

  if (profile?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-foreground">Access Denied</h1>
          <p className="text-muted-foreground mt-2">You need admin privileges to access settings.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your organization's review system</p>
      </div>

      <Tabs defaultValue="users" className="space-y-6">
        <TabsList>
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="company">Company Info</TabsTrigger>
          <TabsTrigger value="general">General</TabsTrigger>
        </TabsList>
        
        <TabsContent value="users">
          <UserManagement />
        </TabsContent>
        
        <TabsContent value="company">
          <CompanySettings />
        </TabsContent>
        
        <TabsContent value="general">
          <div className="space-y-6">
            <div className="text-center py-12">
              <p className="text-muted-foreground">General settings coming soon...</p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}