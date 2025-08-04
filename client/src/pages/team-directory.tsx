import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserFormModal from "@/components/team/user-form-modal";
import { Search, Users, GitBranch, Edit2, MoreHorizontal } from "lucide-react";
import type { User } from "@shared/schema";

export default function TeamDirectory() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading, user } = useAuth();
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("all");

  const { data: users, isLoading: usersLoading, refetch } = useQuery<User[]>({
    queryKey: ["/api/users"],
    enabled: !!user,
  });

  // Filter users based on search and department
  const filteredUsers = users?.filter(user => {
    const matchesSearch = !searchTerm || 
      `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = selectedDepartment === "all" || user.department === selectedDepartment;
    
    return matchesSearch && matchesDepartment;
  });

  // Get unique departments for filter
  const departments = Array.from(new Set(users?.map(u => u.department).filter(Boolean))) as string[];

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
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Team Directory</h1>
            <p className="text-gray-600 text-sm mt-1">Manage your team members and their review settings</p>
          </div>
          <Button variant="outline" className="flex items-center gap-2">
            <Edit2 className="h-4 w-4" />
            Edit My Profile
          </Button>
        </div>
      </div>

      <main className="flex-1 overflow-y-auto p-6">
          <Tabs defaultValue="directory" className="w-full">
            <div className="flex items-center justify-between mb-6">
              <TabsList className="grid w-fit grid-cols-2">
                <TabsTrigger value="directory" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Directory
                </TabsTrigger>
                <TabsTrigger value="orgchart" className="flex items-center gap-2">
                  <GitBranch className="h-4 w-4" />
                  Org Chart
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="directory">
              {/* Search and Filter Bar */}
              <div className="flex items-center gap-4 mb-6">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="All Departments" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Team Members Grid */}
              {usersLoading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filteredUsers?.map((teamMember: User) => (
                    <Card key={teamMember.id} className="hover:shadow-md transition-all duration-200 bg-white">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="relative">
                              <Avatar className="h-10 w-10">
                                <AvatarImage src={teamMember.profileImageUrl || undefined} />
                                <AvatarFallback className="bg-blue-100 text-blue-600 text-sm font-medium">
                                  {teamMember.firstName?.[0]}{teamMember.lastName?.[0]}
                                </AvatarFallback>
                              </Avatar>
                            </div>
                            <div className="min-w-0 flex-1">
                              <h3 className="font-medium text-gray-900 text-sm truncate" data-testid={`text-name-${teamMember.id}`}>
                                {teamMember.firstName} {teamMember.lastName}
                              </h3>
                              <p className="text-xs text-gray-500 truncate" data-testid={`text-email-${teamMember.id}`}>
                                {teamMember.email}
                              </p>
                            </div>
                          </div>
                          {(user.role === 'admin' || user.role === 'manager') && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditUser(teamMember)}
                              data-testid={`button-edit-${teamMember.id}`}
                              className="h-6 w-6 p-0"
                            >
                              <MoreHorizontal className="h-3 w-3" />
                            </Button>
                          )}
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">Role</span>
                            <Badge 
                              variant="secondary" 
                              className={`text-xs ${getRoleColor(teamMember.role)}`}
                              data-testid={`badge-role-${teamMember.id}`}
                            >
                              {teamMember.role?.replace('_', ' ')}
                            </Badge>
                          </div>
                          
                          {teamMember.department && (
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-500">Department</span>
                              <span className="text-xs font-medium text-gray-700" data-testid={`text-department-${teamMember.id}`}>
                                {teamMember.department}
                              </span>
                            </div>
                          )}

                          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                            <span className="text-xs text-gray-500">Member since</span>
                            <span className="text-xs text-gray-700">
                              {teamMember.createdAt ? new Date(teamMember.createdAt).toLocaleDateString('en-US', { 
                                month: 'numeric', 
                                day: 'numeric',
                                year: 'numeric'
                              }) : 'N/A'}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="orgchart">
              <div className="flex items-center justify-center h-64 bg-white rounded-lg border-2 border-dashed border-gray-300">
                <div className="text-center">
                  <GitBranch className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500 font-medium">Organizational Chart</p>
                  <p className="text-gray-400 text-sm">Coming soon - Visual org chart will be displayed here</p>
                </div>
              </div>
            </TabsContent>
        </Tabs>
      </main>

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
