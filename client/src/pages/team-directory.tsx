import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import UserFormModal from "@/components/team/user-form-modal";
import { Search, Users, GitBranch, Edit2, MoreHorizontal, Download, Upload, Trash2, UserCheck, FileText } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { User } from "@shared/schema";

export default function TeamDirectory() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading, user } = useAuth();
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [showBulkActionsDialog, setShowBulkActionsDialog] = useState(false);
  const [bulkAction, setBulkAction] = useState<string>("");
  const [bulkRole, setBulkRole] = useState<string>("");

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

  // Bulk action mutations
  const bulkDeleteMutation = useMutation({
    mutationFn: async (userIds: string[]) => {
      for (const userId of userIds) {
        await apiRequest(`/api/users/${userId}`, "DELETE");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      setSelectedUsers([]);
      toast({ title: "Success", description: "Selected users deleted successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const bulkRoleChangeMutation = useMutation({
    mutationFn: async ({ userIds, role }: { userIds: string[], role: string }) => {
      for (const userId of userIds) {
        await apiRequest(`/api/users/${userId}`, "PUT", { role });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      setSelectedUsers([]);
      toast({ title: "Success", description: "User roles updated successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  // Export functionality
  const handleExport = () => {
    if (!users) return;
    
    const csvContent = [
      ["Name", "Email", "Role", "Department", "Manager", "Created At"].join(","),
      ...users.map(user => [
        `"${user.firstName} ${user.lastName}"`,
        `"${user.email}"`,
        `"${user.role}"`,
        `"${user.department || ''}"`,
        `"${users.find(u => u.id === user.managerId)?.firstName || ''} ${users.find(u => u.id === user.managerId)?.lastName || ''}"`,
        `"${user.createdAt ? new Date(user.createdAt).toLocaleDateString() : ''}"`
      ].join(","))
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'team-directory.csv';
    link.click();
    window.URL.revokeObjectURL(url);
  };

  // Import functionality
  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        // Simple CSV parsing - in production you'd want a more robust parser
        const lines = text.split('\n');
        const headers = lines[0].split(',');
        const data = lines.slice(1).map(line => {
          const values = line.split(',');
          return headers.reduce((obj, header, index) => {
            obj[header.replace(/"/g, '')] = values[index]?.replace(/"/g, '') || '';
            return obj;
          }, {} as any);
        });
        console.log('Imported data:', data);
        toast({ title: "Import", description: `Imported ${data.length} records (processing not implemented)` });
      };
      reader.readAsText(file);
    }
  };

  // Org chart data structure
  const getOrgChartData = () => {
    if (!users) return [];
    
    // Group users by manager
    const usersByManager = users.reduce((acc, user) => {
      const managerId = user.managerId || 'root';
      if (!acc[managerId]) acc[managerId] = [];
      acc[managerId].push(user);
      return acc;
    }, {} as Record<string, User[]>);
    
    return usersByManager;
  };

  const renderOrgNode = (user: User, level = 0) => {
    const orgData = getOrgChartData();
    const subordinates = (orgData as Record<string, User[]>)[user.id] || [];
    
    return (
      <div key={user.id} className={`ml-${level * 8}`}>
        <Card className="mb-2 bg-white border hover:shadow-md transition-shadow">
          <CardContent className="p-3">
            <div className="flex items-center space-x-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.profileImageUrl || undefined} />
                <AvatarFallback className="bg-blue-100 text-blue-600 text-xs">
                  {user.firstName?.[0]}{user.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h4 className="font-medium text-sm">{user.firstName} {user.lastName}</h4>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
              <Badge variant="secondary" className={`text-xs ${getRoleColor(user.role)}`}>
                {user.role?.replace('_', ' ')}
              </Badge>
            </div>
          </CardContent>
        </Card>
        {subordinates.map((subordinate: User) => renderOrgNode(subordinate, level + 1))}
      </div>
    );
  };

  const handleSelectUser = (userId: string, checked: boolean) => {
    if (checked) {
      setSelectedUsers(prev => [...prev, userId]);
    } else {
      setSelectedUsers(prev => prev.filter(id => id !== userId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedUsers(filteredUsers?.map(u => u.id) || []);
    } else {
      setSelectedUsers([]);
    }
  };

  const handleBulkAction = () => {
    if (bulkAction === 'delete') {
      bulkDeleteMutation.mutate(selectedUsers);
    } else if (bulkAction === 'role_change' && bulkRole) {
      bulkRoleChangeMutation.mutate({ userIds: selectedUsers, role: bulkRole });
    }
    setShowBulkActionsDialog(false);
    setBulkAction("");
    setBulkRole("");
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
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={handleExport} className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              <label htmlFor="import-csv" className="cursor-pointer">Import CSV</label>
              <input
                id="import-csv"
                type="file"
                accept=".csv"
                onChange={handleImport}
                className="hidden"
              />
            </Button>
            {selectedUsers.length > 0 && (
              <Button 
                variant="outline" 
                onClick={() => setShowBulkActionsDialog(true)}
                className="flex items-center gap-2"
              >
                <UserCheck className="h-4 w-4" />
                Bulk Actions ({selectedUsers.length})
              </Button>
            )}
            {(user.role === 'admin' || user.role === 'manager') && (
              <Button 
                onClick={handleCreateUser}
                className="flex items-center gap-2"
                data-testid="button-add-member"
              >
                <Users className="h-4 w-4" />
                Add New Member
              </Button>
            )}
            <Button variant="outline" className="flex items-center gap-2">
              <Edit2 className="h-4 w-4" />
              Edit My Profile
            </Button>
          </div>
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
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="select-all"
                    checked={(filteredUsers?.length || 0) > 0 && selectedUsers.length === (filteredUsers?.length || 0)}
                    onCheckedChange={handleSelectAll}
                  />
                  <label htmlFor="select-all" className="text-sm text-gray-600">Select All</label>
                </div>
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
                    <Card key={teamMember.id} className={`hover:shadow-md transition-all duration-200 bg-white ${selectedUsers.includes(teamMember.id) ? 'ring-2 ring-blue-500' : ''}`}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <Checkbox
                              checked={selectedUsers.includes(teamMember.id)}
                              onCheckedChange={(checked) => handleSelectUser(teamMember.id, checked as boolean)}
                            />
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
              <div className="bg-white rounded-lg border p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Organization Chart</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FileText className="h-4 w-4" />
                    <span>Hierarchical view of team structure</span>
                  </div>
                </div>
                
                {usersLoading ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Root level users (no manager) */}
                    {users?.filter(u => !u.managerId).map(rootUser => renderOrgNode(rootUser))}
                    
                    {/* If no hierarchy exists, show all users */}
                    {users?.filter(u => !u.managerId).length === 0 && (
                      <div className="text-center py-8">
                        <GitBranch className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-500 font-medium">No organizational hierarchy defined</p>
                        <p className="text-gray-400 text-sm">Assign managers to team members to see the org chart</p>
                        <div className="mt-6 space-y-2">
                          {users?.map(user => (
                            <Card key={user.id} className="bg-gray-50">
                              <CardContent className="p-3">
                                <div className="flex items-center space-x-3">
                                  <Avatar className="h-8 w-8">
                                    <AvatarImage src={user.profileImageUrl || undefined} />
                                    <AvatarFallback className="bg-blue-100 text-blue-600 text-xs">
                                      {user.firstName?.[0]}{user.lastName?.[0]}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="flex-1">
                                    <h4 className="font-medium text-sm">{user.firstName} {user.lastName}</h4>
                                    <p className="text-xs text-gray-500">{user.email}</p>
                                  </div>
                                  <Badge variant="secondary" className={`text-xs ${getRoleColor(user.role)}`}>
                                    {user.role?.replace('_', ' ')}
                                  </Badge>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
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

      {/* Bulk Actions Dialog */}
      <Dialog open={showBulkActionsDialog} onOpenChange={setShowBulkActionsDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bulk Actions</DialogTitle>
            <DialogDescription>
              Choose an action to apply to the {selectedUsers.length} selected user(s).
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Action</label>
              <Select value={bulkAction} onValueChange={setBulkAction}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="role_change">Change Role</SelectItem>
                  <SelectItem value="delete">Delete Users</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {bulkAction === 'role_change' && (
              <div className="space-y-2">
                <label className="text-sm font-medium">New Role</label>
                <Select value={bulkRole} onValueChange={setBulkRole}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="team_member">Team Member</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            
            {bulkAction === 'delete' && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <div className="flex items-center gap-2 text-red-800">
                  <Trash2 className="h-4 w-4" />
                  <span className="font-medium">Warning</span>
                </div>
                <p className="text-sm text-red-700 mt-1">
                  This action will permanently delete the selected users and cannot be undone.
                </p>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBulkActionsDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleBulkAction}
              disabled={(bulkAction === 'role_change' && !bulkRole) || !bulkAction}
              variant={bulkAction === 'delete' ? 'destructive' : 'default'}
            >
              {bulkAction === 'delete' ? 'Delete Users' : 'Apply Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
