import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import UserFormModal from "@/components/team/user-form-modal";
import { Plus, Edit, Mail, Building } from "lucide-react";
import type { User } from "@shared/schema";

export default function TeamDirectory() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading, user } = useAuth();
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const { data: users, isLoading: usersLoading, refetch } = useQuery<User[]>({
    queryKey: ["/api/users"],
    enabled: !!user,
  });

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
    }
  }, [isAuthenticated, isLoading, toast]);

  const handleCreateUser = () => {
    setSelectedUser(null);
    setShowUserModal(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'manager': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          title="Team Directory" 
          subtitle="Manage your team members and organizational structure"
        >
          {user.role === 'admin' && (
            <Button onClick={handleCreateUser} data-testid="button-add-user">
              <Plus className="h-4 w-4 mr-2" />
              Add Team Member
            </Button>
          )}
        </Header>

        <main className="flex-1 overflow-y-auto p-6">
          {usersLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {users?.map((teamMember: User) => (
                <Card key={teamMember.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={teamMember.profileImageUrl || undefined} />
                          <AvatarFallback>
                            {teamMember.firstName?.[0]}{teamMember.lastName?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-gray-900" data-testid={`text-name-${teamMember.id}`}>
                            {teamMember.firstName} {teamMember.lastName}
                          </h3>
                          <Badge className={getRoleColor(teamMember.role)} data-testid={`badge-role-${teamMember.id}`}>
                            {teamMember.role?.replace('_', ' ')}
                          </Badge>
                        </div>
                      </div>
                      {user.role === 'admin' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditUser(teamMember)}
                          data-testid={`button-edit-${teamMember.id}`}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4" />
                        <span data-testid={`text-email-${teamMember.id}`}>
                          {teamMember.email}
                        </span>
                      </div>
                      {teamMember.department && (
                        <div className="flex items-center space-x-2">
                          <Building className="h-4 w-4" />
                          <span data-testid={`text-department-${teamMember.id}`}>
                            {teamMember.department}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Review Cadence</span>
                        <span className="capitalize" data-testid={`text-cadence-${teamMember.id}`}>
                          {teamMember.reviewCadence}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </main>
      </div>

      <UserFormModal
        open={showUserModal}
        onClose={() => setShowUserModal(false)}
        user={selectedUser}
        onSuccess={() => {
          refetch();
          setShowUserModal(false);
        }}
      />
    </div>
  );
}
