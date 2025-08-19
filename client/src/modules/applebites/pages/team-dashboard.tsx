import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'wouter';
import MDButton from '../../../components/MD/MDButton';
import MDInput from '../../../components/MD/MDInput';
import MDBox from '../../../components/MD/MDBox';
import MDTypography from '../../../components/MD/MDTypography';
import { Card, CardContent, Button, TextField, Select, MenuItem, FormControl, InputLabel, Chip, Dialog, DialogTitle, DialogContent, DialogActions, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { useToast } from '../../../hooks/use-toast';









import { Users, Plus, Edit, Trash2, Shield, LogOut, UserPlus, Settings } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { insertTeamMemberSchema, type InsertTeamMember, type TeamMember } from '@shared/schema';
import TeamLogin from '../../../components/team-login';
import { useTeamAuth } from '../../../hooks/use-team-auth';
import { useAdminAuth } from '../../../hooks/use-admin-auth';
import PasswordChangeForm from '../../../components/password-change-form';
import PasswordChangeModal from '../../../components/password-change-modal';
import appleBitesLogoImage from '@assets/apple-bites-logo.png';

export default function TeamDashboard() {
  const { user, isAuthenticated, isLoading, hasRole, logout, login } = useTeamAuth();
  const adminAuth = useAdminAuth();
  
  // Check if we're in admin context (URL contains /admin/)
  const isAdminContext = window.location.pathname.includes('/admin/');
  
  // Use admin auth if in admin context, otherwise use team auth
  const currentAuth = isAdminContext ? adminAuth : { user, isAuthenticated, isLoading, hasRole, logout, login };
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [showPasswordChangeModal, setShowPasswordChangeModal] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Check if user needs to change password on mount
  useEffect(() => {
    if (user && user.mustChangePassword) {
      setShowPasswordChangeModal(true);
    }
  }, [user]);

  const { data: teamMembers, isLoading: membersLoading } = useQuery<TeamMember[]>({
    queryKey: ['/api/team/members'],
    enabled: currentAuth.isAuthenticated && (isAdminContext || hasRole('admin')),
  });

  const form = useForm<InsertTeamMember>({
    resolver: zodResolver(insertTeamMemberSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      role: 'member',
      password: '',
    },
  });

  const createMemberMutation = useMutation({
    mutationFn: async (data: InsertTeamMember) => {
      const response = await fetch('/api/team/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create team member');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/team/members'] });
      setIsAddDialogOpen(false);
      form.reset();
      toast({
        title: 'Success',
        description: 'Team member created successfully',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const updateMemberMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: Partial<TeamMember> }) => {
      const response = await fetch(`/api/team/members/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error('Failed to update team member');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/team/members'] });
      toast({
        title: 'Success',
        description: 'Team member updated successfully',
      });
    },
  });

  const deleteMemberMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/team/members/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to delete team member');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/team/members'] });
      toast({
        title: 'Success',
        description: 'Team member deleted successfully',
      });
    },
  });

  // Show authentication loading state
  if (currentAuth.isLoading) {
    return (
      <div >
        <div >
          <div ></div>
          <p >Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Show login screen if not authenticated
  if (!currentAuth.isAuthenticated) {
    return <TeamLogin onLoginSuccess={(userData) => {
      // Update auth state properly
      login(userData);
      queryClient.invalidateQueries({ queryKey: ['/api/team/me'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/status'] });
    }} />;
  }

  const getRoleBadgeColor = (role: string) => {
    const colors: Record<string, string> = {
      'admin': 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-sm',
      'manager': 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-sm',
      'member': 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-sm',
    };
    return colors[role] || 'bg-gradient-to-r from-slate-400 to-slate-500 text-white shadow-sm';
  };

  const onSubmit = (data: InsertTeamMember) => {
    createMemberMutation.mutate(data);
  };

  return (
    <div >
      <div >
        {/* Top Navigation */}
        <div >
          <div >
            <img 
              src={appleBitesLogoImage} 
              alt="Apple Bites Business Assessment" 
              className="h-12 w-auto"
            />
            <div >
              <h1 >Team Dashboard</h1>
            </div>
          </div>
          <div >
            {/* Admin access removed - use proper admin login at /admin */}
          </div>
        </div>

        {/* User Info and Actions */}
        <div >
          <div >
            <div >
              <div >Welcome, {user?.firstName} {user?.lastName}</div>
              <div >
                <Shield  />
                <Chip 
                  label={user?.role?.toUpperCase() || 'USER'} 
                  size="small"
                  color="primary"
                  variant="filled"
                />
              </div>
            </div>
          </div>
          <div >
            <Button 
              variant="outlined" 
              onClick={() => setIsPasswordDialogOpen(true)}
              startIcon={<Settings />}
            >
              Change Password
            </Button>
            <Dialog 
              open={isPasswordDialogOpen} 
              onClose={() => setIsPasswordDialogOpen(false)}
            >
              <DialogTitle>Change Password</DialogTitle>
              <DialogContent>
                Update your account password for security.
                <PasswordChangeForm userId={user?.id} />
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setIsPasswordDialogOpen(false)}>
                  Cancel
                </Button>
              </DialogActions>
            </Dialog>
            <Button variant="outline" onClick={logout} >
              <LogOut  />
              Logout
            </Button>
          </div>
        </div>

        {/* Role-specific content */}
        {hasRole('admin') ? (
          <>
            {/* Admin Dashboard */}
            <div >
              <Card>
                <CardContent>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <h3>Total Members</h3>
                    <Users />
                  </div>
                  <div>{teamMembers?.length || 0}</div>
                  <p>registered accounts</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <h3>Active Members</h3>
                    <Shield />
                  </div>
                  <div>
                    {teamMembers?.filter(m => m.isActive).length || 0}
                  </div>
                  <p>currently active</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <h3>Admins</h3>
                    <Settings />
                  </div>
                  <div>
                    {teamMembers?.filter(m => m.role === 'admin').length || 0}
                  </div>
                  <p>with admin access</p>
                </CardContent>
              </Card>
            </div>

            {/* Team Members Management */}
            <Card>
              <CardContent>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <div>
                    <h3>Team Members</h3>
                    <p>Manage access and permissions</p>
                  </div>
                  <Button 
                    onClick={() => setIsAddDialogOpen(true)}
                    startIcon={<UserPlus />}
                  >
                    Add Member
                  </Button>
                </div>
                <Dialog 
                  open={isAddDialogOpen} 
                  onClose={() => setIsAddDialogOpen(false)}
                >
                  <DialogTitle>Add Team Member</DialogTitle>
                  <DialogContent>
                    <p>Create a new team member account with appropriate role permissions.</p>
                    <form onSubmit={form.handleSubmit(onSubmit)} style={{ marginTop: '16px' }}>
                      <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                        <TextField
                          {...form.register('firstName')}
                          label="First Name"
                          fullWidth
                          error={!!form.formState.errors.firstName}
                          helperText={form.formState.errors.firstName?.message}
                        />
                        <TextField
                          {...form.register('lastName')}
                          label="Last Name"
                          fullWidth
                          error={!!form.formState.errors.lastName}
                          helperText={form.formState.errors.lastName?.message}
                        />
                      </div>
                      <TextField
                        {...form.register('email')}
                        label="Email"
                        type="email"
                        fullWidth
                        style={{ marginBottom: '16px' }}
                        error={!!form.formState.errors.email}
                        helperText={form.formState.errors.email?.message}
                      />
                      <FormControl fullWidth style={{ marginBottom: '16px' }}>
                        <InputLabel>Role</InputLabel>
                        <Select
                          {...form.register('role')}
                          defaultValue="member"
                          label="Role"
                        >
                          <MenuItem value="member">Member</MenuItem>
                          <MenuItem value="manager">Manager</MenuItem>
                          <MenuItem value="admin">Admin</MenuItem>
                        </Select>
                      </FormControl>
                      <TextField
                        {...form.register('password')}
                        label="Password"
                        type="password"
                        fullWidth
                        style={{ marginBottom: '16px' }}
                        error={!!form.formState.errors.password}
                        helperText={form.formState.errors.password?.message}
                      />
                    </form>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={() => setIsAddDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={form.handleSubmit(onSubmit)} disabled={createMemberMutation.isPending}>
                      {createMemberMutation.isPending ? 'Creating...' : 'Create Member'}
                    </Button>
                  </DialogActions>
                </Dialog>
                
                {membersLoading ? (
                  <div>
                    <p>Loading team members...</p>
                  </div>
                ) : (
                  <div>
                    <Table>
                      <thead>
                        <TableRow>
                          <TableCell component="th">Name</TableCell>
                          <TableCell component="th">Email</TableCell>
                          <TableCell component="th">Role</TableCell>
                          <TableCell component="th">Status</TableCell>
                          <TableCell component="th">Last Login</TableCell>
                          <TableCell component="th">Actions</TableCell>
                        </TableRow>
                      </thead>
                    <TableBody>
                      {membersLoading ? (
                        <TableRow>
                          <TableCell colSpan={6} >
                            Loading team members...
                          </TableCell>
                        </TableRow>
                      ) : !teamMembers || teamMembers.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} >
                            {!isAuthenticated ? 'Please log in to view team members' : 
                             !hasRole('admin') ? 'Admin access required to view team members' :
                             'No team members found. Create your first team member to get started.'}
                          </TableCell>
                        </TableRow>
                      ) : (
                        teamMembers.map((member) => (
                          <TableRow key={member.id} >
                            <TableCell >
                              {member.firstName} {member.lastName}
                            </TableCell>
                            <TableCell>{member.email}</TableCell>
                            <TableCell>
                              <Chip 
                                label={member.role}
                                size="small"
                                color="primary"
                                variant="filled"
                              />
                            </TableCell>
                            <TableCell>
                              <Chip 
                                label={member.isActive ? 'Active' : 'Inactive'}
                                size="small"
                                color={member.isActive ? 'success' : 'default'}
                                variant="filled"
                              />
                            </TableCell>
                            <TableCell>
                              {member.lastLoginAt
                                ? new Date(member.lastLoginAt).toLocaleDateString()
                                : 'Never'}
                            </TableCell>
                            <TableCell>
                              <div >
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() =>
                                    updateMemberMutation.mutate({
                                      id: member.id,
                                      updates: { isActive: !member.isActive },
                                    })
                                  }
                                  
                                >
                                  {member.isActive ? 'Deactivate' : 'Activate'}
                                </Button>
                                {member.id !== user?.id && (
                                  <Button
                                    size="small"
                                    variant="outlined"
                                    color="error"
                                    onClick={() => {
                                      if (confirm(`Are you sure you want to delete ${member.firstName} ${member.lastName}? This action cannot be undone.`)) {
                                        deleteMemberMutation.mutate(member.id);
                                      }
                                    }}
                                    startIcon={<Trash2 />}
                                  >
                                    Delete
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        ) : (
          <>
            {/* Manager/Member Dashboard */}
            <Card>
              <CardContent>
                <h3>Welcome to the Team Dashboard</h3>
                <p >
                  You are logged in as a {user?.role}. Your permissions allow you to:
                </p>
                <ul >
                  {user?.role === 'manager' ? (
                    <>
                      <li>View team analytics and reports</li>
                      <li>Manage leads and customer interactions</li>
                      <li>Access valuation assessments</li>
                    </>
                  ) : (
                    <>
                      <li>View assigned leads and tasks</li>
                      <li>Access customer support tools</li>
                      <li>View valuation reports</li>
                    </>
                  )}
                </ul>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Password Change Modal */}
      {user && (
        <PasswordChangeModal
          isOpen={showPasswordChangeModal}
          onSuccess={() => {
            setShowPasswordChangeModal(false);
            // Refresh user data to update mustChangePassword flag
            queryClient.invalidateQueries({ queryKey: ['/api/team/me'] });
            toast({
              title: 'Password Updated',
              description: 'Your password has been successfully changed.',
            });
          }}
          userEmail={user.email}
        />
      )}
    </div>
  );
}