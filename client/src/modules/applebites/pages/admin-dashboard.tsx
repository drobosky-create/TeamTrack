import { useState, useEffect, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useLocation } from 'wouter';
import { Users, Plus, Edit, Trash2, Shield, LogOut, UserPlus, Settings, Home, BarChart3, Calendar, FileText, User, Clock, Crown, TrendingUp, Mail, Phone, Building, Eye, ExternalLink, ChevronDown, ChevronUp, Search, Filter, X, Save } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { insertTeamMemberSchema, type InsertTeamMember, type TeamMember } from '@shared/schema';
// Admin dashboard - authentication handled by AdminLoginPage
import { useToast } from '../../../hooks/use-toast';

// Material Dashboard Components
import MDBox from '../../../components/MD/MDBox';
import MDTypography from '../../../components/MD/MDTypography';
import MDButton from '../../../components/MD/MDButton';
import { Avatar } from '@mui/material';
import MDInput from '../../../components/MD/MDInput';
import { Card, CardContent, Container, Box, Button, Typography, Modal, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Chip, Checkbox, InputAdornment, Menu, MenuItem, Select, FormControl } from '@mui/material';
import { Grid } from '@mui/system';

const appleBitesLogoPath = '/assets/logos/apple-bites-meritage-logo.png';

// Admin Sidebar Component - Exact copy from user dashboard structure
function AdminSidebar({ user, onSignOut, activeTab, setActiveTab }: { user: any; onSignOut: () => void; activeTab: string; setActiveTab: (tab: string) => void }) {
  // Apple Bites Brand Colors - Exact copy from user dashboard
  const colors = {
    primary: "#00718d",
    secondary: "#0A1F44", 
    accent: "#005b8c",
    grayLight: "#F7FAFC",
    gray: "#CBD5E1"
  };

  const gradients = {
    primary: "linear-gradient(135deg, #00718d 0%, #0A1F44 100%)",
    light: "linear-gradient(135deg, #00718d 0%, #005b8c 100%)",
    dark: "linear-gradient(135deg, #0A1F44 0%, #1C2D5A 100%)",
    glow: "linear-gradient(135deg, #00718d 0%, #3B82F6 100%)"
  };

  const getTierGradient = (role: string) => {
    switch (role) {
      case 'admin': return gradients.primary;
      case 'manager': return gradients.light;
      default: return 'linear-gradient(135deg, #CBD5E1 0%, #94A3B8 100%)';
    }
  };

  const getTierLabel = (role: string) => {
    switch (role) {
      case 'admin': return 'Admin';
      case 'manager': return 'Manager';
      default: return 'Member';
    }
  };

  return (
    <MDBox
      sx={{
        // Desktop: Fixed sidebar
        position: { xs: 'relative', md: 'fixed' },
        top: { xs: 0, md: '24px' },
        left: { xs: 0, md: '24px' },
        width: { xs: '100%', md: 280 },
        height: { xs: 'auto', md: 'calc(100vh - 48px)' },
        background: gradients.dark,
        borderRadius: { xs: '0', md: '20px' },
        border: { xs: 'none', md: `1px solid rgba(255, 255, 255, 0.15)` },
        boxShadow: { xs: 'none', md: '0 4px 12px rgba(0,0,0,0.15), 0 0 0 1px rgba(255, 255, 255, 0.1)' },
        backdropFilter: 'blur(8px)',
        padding: { xs: 2, md: 3 },
        display: 'flex',
        flexDirection: 'column',
        zIndex: 1000,
        overflow: 'hidden', // Prevent internal scrolling
        mb: { xs: 2, md: 0 }, // Add margin bottom on mobile
      }}
    >
      {/* User Info Section */}
      <MDBox mb={4}>
        <MDBox display="flex" alignItems="center" mb={2}>
          <Avatar
            sx={{
              background: gradients.glow,
              width: 48,
              height: 48,
              mr: 2
            }}
          >
            <User size={24} color="white" />
          </Avatar>
          <MDBox>
            <MDTypography variant="h6" fontWeight="medium" sx={{ color: 'white' }}>
              {user?.firstName} {user?.lastName}
            </MDTypography>
            <MDTypography variant="caption" sx={{ color: colors.accent }}>
              {user?.email}
            </MDTypography>
          </MDBox>
        </MDBox>
        
        <MDBox display="flex" alignItems="center">
          <MDTypography variant="body2" mr={1} sx={{ color: 'white' }}>
            Role:
          </MDTypography>
          <MDBox
            sx={{
              background: getTierGradient(user?.role || 'admin'),
              color: 'white',
              px: 2,
              py: 0.5,
              borderRadius: 2,
              fontSize: '0.75rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}
          >
            {getTierLabel(user?.role || 'admin')}
          </MDBox>
        </MDBox>
      </MDBox>

      {/* Navigation Buttons - Exact structure from user dashboard */}
      <MDBox display="flex" flexDirection="column" gap={1.5}>
        <MDButton
          onClick={() => setActiveTab('overview')}
          sx={{
            background: activeTab === 'overview' ? gradients.glow : 'transparent',
            border: activeTab === 'overview' ? 'none' : `1px solid rgba(255, 255, 255, 0.3)`,
            color: activeTab === 'overview' ? 'white' : '#dbdce1',
            '&:hover': {
              background: activeTab === 'overview' ? gradients.light : 'rgba(255, 255, 255, 0.1)',
              transform: 'translateY(-2px)'
            },
            transition: 'all 0.3s ease',
            width: '100%',
            py: 1.2
          }}
          startIcon={<Home size={18} />}
        >
          Dashboard Overview
        </MDButton>

        <MDButton
          onClick={() => setActiveTab('team')}
          sx={{
            background: activeTab === 'team' ? gradients.glow : 'transparent',
            border: activeTab === 'team' ? 'none' : `1px solid rgba(255, 255, 255, 0.3)`,
            color: activeTab === 'team' ? 'white' : '#dbdce1',
            '&:hover': {
              background: activeTab === 'team' ? gradients.light : 'rgba(255, 255, 255, 0.1)',
              transform: 'translateY(-2px)'
            },
            transition: 'all 0.3s ease',
            width: '100%',
            py: 1.2
          }}
          startIcon={<Users size={18} />}
        >
          Team Members
        </MDButton>

        <MDButton
          onClick={() => setActiveTab('leads')}
          sx={{
            background: activeTab === 'leads' ? gradients.glow : 'transparent',
            border: activeTab === 'leads' ? 'none' : `1px solid rgba(255, 255, 255, 0.3)`,
            color: activeTab === 'leads' ? 'white' : '#dbdce1',
            '&:hover': {
              background: activeTab === 'leads' ? gradients.light : 'rgba(255, 255, 255, 0.1)',
              transform: 'translateY(-2px)'
            },
            transition: 'all 0.3s ease',
            width: '100%',
            py: 1.2
          }}
          startIcon={<FileText size={18} />}
        >
          Leads
        </MDButton>



        <MDButton
          onClick={() => setActiveTab('users')}
          sx={{
            background: activeTab === 'users' ? gradients.glow : 'transparent',
            border: activeTab === 'users' ? 'none' : `1px solid rgba(255, 255, 255, 0.3)`,
            color: activeTab === 'users' ? 'white' : '#dbdce1',
            '&:hover': {
              background: activeTab === 'users' ? gradients.light : 'rgba(255, 255, 255, 0.1)',
              transform: 'translateY(-2px)'
            },
            transition: 'all 0.3s ease',
            width: '100%',
            py: 1.2
          }}
          startIcon={<User size={18} />}
        >
          Users
        </MDButton>

        <MDButton
          onClick={() => setActiveTab('analytics')}
          sx={{
            background: activeTab === 'analytics' ? gradients.glow : 'transparent',
            border: activeTab === 'analytics' ? 'none' : `1px solid rgba(255, 255, 255, 0.3)`,
            color: activeTab === 'analytics' ? 'white' : '#dbdce1',
            '&:hover': {
              background: activeTab === 'analytics' ? gradients.light : 'rgba(255, 255, 255, 0.1)',
              transform: 'translateY(-2px)'
            },
            transition: 'all 0.3s ease',
            width: '100%',
            py: 1.2
          }}
          startIcon={<BarChart3 size={18} />}
        >
          Analytics
        </MDButton>

        <MDButton
          onClick={onSignOut}
          className="text-[#dbdce1]"
          sx={{
            background: 'transparent',
            border: `1px solid #EF4444`,
            color: '#EF4444',
            '&:hover': {
              background: 'rgba(239, 68, 68, 0.1)',
              borderColor: '#DC2626',
              transform: 'translateY(-2px)'
            },
            transition: 'all 0.3s ease',
            width: '100%',
            py: 1.2
          }}
          startIcon={<LogOut size={18} />}
        >
          Sign Out
        </MDButton>
      </MDBox>

      {/* Spacer */}
      <MDBox flexGrow={1} />

      {/* Footer - Exact copy from user dashboard */}
      <MDBox mt={4} pt={2} borderTop={`1px solid rgba(255, 255, 255, 0.2)`}>
        <MDBox display="flex" flexDirection="column" alignItems="center" gap={1}>
          <img
            src="/assets/logos/apple-bites-meritage-logo.png"
            alt="Apple Bites by Meritage Partners"
            width={250}
            height={250}
            style={{
              objectFit: 'contain',
              maxWidth: '100%'
            }}
          />
        </MDBox>
      </MDBox>
    </MDBox>
  );
}

// Stats Card Component
function StatsCard({ title, value, subtitle, icon: Icon, color }: {
  title: string;
  value: string | number;
  subtitle: string;
  icon: any;
  color: string;
}) {
  const getGradient = (color: string) => {
    const gradients = {
      primary: 'linear-gradient(135deg, #00718d 0%, #0A1F44 100%)',
      success: 'linear-gradient(135deg, #16A34A 0%, #059669 100%)',
      warning: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
      info: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
    };
    return gradients[color as keyof typeof gradients] || gradients.primary;
  };

  return (
    <Card sx={{ height: '100%', boxShadow: '0 2px 8px -4px rgba(0,0,0,0.1)' }}>
      <CardContent sx={{ p: 2 }}>
        <MDBox display="flex" justifyContent="space-between" alignItems="center">
          <MDBox>
            <MDTypography variant="h5" fontWeight="bold" sx={{ color: '#344767', mb: 0.5 }}>
              {value}
            </MDTypography>
            <MDTypography variant="body2" sx={{ color: '#67748e', mb: 0.25, fontSize: '0.9rem' }}>
              {title}
            </MDTypography>
            <MDTypography variant="caption" sx={{ color: '#67748e', fontSize: '0.75rem' }}>
              {subtitle}
            </MDTypography>
          </MDBox>
          <MDBox
            sx={{
              background: getGradient(color),
              borderRadius: '8px',
              p: 1.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: '36px',
              minHeight: '36px'
            }}
          >
            <Icon size={18} color="white" />
          </MDBox>
        </MDBox>
      </CardContent>
    </Card>
  );
}

export default function AdminDashboard() {
  // Admin dashboard doesn't use team authentication
  const [isLoading, setIsLoading] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [activeTab, setActiveTab] = useState('overview'); // Internal navigation state
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Admin user object for display
  const adminUser = {
    firstName: 'Daniel',
    lastName: 'Robosky',
    email: 'drobosky@meritage-partners.com',
    role: 'admin'
  };

  // Admin logout function
  const handleAdminLogout = async () => {
    try {
      await fetch('/api/admin/logout', {
        method: 'POST',
        credentials: 'include',
      });
      window.location.href = '/admin';
    } catch (error) {
      console.error('Logout error:', error);
      window.location.href = '/admin';
    }
  };

  const { data: teamMembers, isLoading: membersLoading } = useQuery<TeamMember[]>({
    queryKey: ['/api/team/members'],
    enabled: true, // Admin dashboard assumes proper authentication
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
      setIsAddModalOpen(false);
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
  if (isLoading) {
    return (
      <MDBox display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <MDTypography variant="h6">Loading...</MDTypography>
      </MDBox>
    );
  }

  // Show login screen if not authenticated
  // Admin dashboard assumes authentication is handled by AdminLoginPage
  // No fallback login form needed here

  const getRoleColor = (role: string) => {
    const colors = {
      'admin': 'error',
      'manager': 'info', 
      'member': 'success',
    };
    return colors[role as keyof typeof colors] || 'default';
  };

  const onSubmit = (data: InsertTeamMember) => {
    createMemberMutation.mutate(data);
  };



  return (
    <MDBox sx={{ 
      display: { xs: 'block', md: 'flex' }, 
      minHeight: '100vh', 
      backgroundColor: '#f8f9fa' 
    }}>
      <AdminSidebar user={adminUser} onSignOut={handleAdminLogout} activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {/* Main Content */}
      <MDBox
        sx={{
          flex: 1,
          marginLeft: { xs: 0, md: '328px' }, // No margin on mobile, fixed margin on desktop
          p: { xs: 2, md: 4 },
          minHeight: '100vh',
          width: { xs: '100%', md: 'calc(100% - 328px)' }, // Full width on mobile
        }}
      >
        <Container maxWidth="xl">
          {/* Header */}
          <MDBox mb={3} display="flex" justifyContent="space-between" alignItems="center">
            <MDBox>
              <MDTypography variant="h4" fontWeight="bold" sx={{ color: '#344767', mb: 1 }}>
                {activeTab === 'team' && 'Team Management'}
                {activeTab === 'leads' && 'Lead Management'}
                {activeTab === 'users' && 'User Directory'}
                {activeTab === 'analytics' && 'Analytics Dashboard'}
                {activeTab === 'overview' && 'Admin Dashboard'}
              </MDTypography>
              <MDTypography variant="body1" sx={{ color: '#67748e' }}>
                Welcome back, {adminUser?.firstName} {adminUser?.lastName} - {activeTab === 'team' && 'Manage your team and organization'}
                {activeTab === 'leads' && 'Track and manage leads'}
                {activeTab === 'users' && 'View all registered consumers'}
                {activeTab === 'analytics' && 'View system analytics'}
                {activeTab === 'overview' && 'Overview of all system metrics'}
              </MDTypography>
            </MDBox>
            <MDBox display="flex" gap={2}>
              <MDButton
                variant="outlined"
                color="info"
                onClick={handleAdminLogout}
                startIcon={<LogOut size={18} />}
              >
                Logout
              </MDButton>
            </MDBox>
          </MDBox>

          {/* Conditional Content Based on Active Tab */}
          {activeTab === 'team' && (
            <>
              {/* Stats Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                <StatsCard
                  title="Total Members"
                  value={teamMembers?.length || 0}
                  subtitle="registered accounts"
                  icon={Users}
                  color="primary"
                />
                <StatsCard
                  title="Active Members"
                  value={teamMembers?.filter(m => m.isActive).length || 0}
                  subtitle="currently active"
                  icon={Shield}
                  color="success"
                />
                <StatsCard
                  title="Admins"
                  value={teamMembers?.filter(m => m.role === 'admin').length || 0}
                  subtitle="with admin access"
                  icon={Settings}
                  color="info"
                />
                <StatsCard
                  title="Managers"
                  value={teamMembers?.filter(m => m.role === 'manager').length || 0}
                  subtitle="team managers"
                  icon={UserPlus}
                  color="warning"
                />
              </div>

              {/* Team Members Table */}
          <Card sx={{ boxShadow: '0 2px 8px -4px rgba(0,0,0,0.1)' }}>
            <MDBox p={2.5} display="flex" justifyContent="space-between" alignItems="center">
              <MDTypography variant="h6" fontWeight="bold" sx={{ color: '#344767' }}>
                Team Members
              </MDTypography>
              <MDButton
                variant="contained"
                color="info"
                onClick={() => setIsAddModalOpen(true)}
                startIcon={<Plus size={18} />}
              >
                Add Member
              </MDButton>
            </MDBox>
            
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
                    <TableCell><Typography fontWeight="bold">Name</Typography></TableCell>
                    <TableCell><Typography fontWeight="bold">Email</Typography></TableCell>
                    <TableCell><Typography fontWeight="bold">Role</Typography></TableCell>
                    <TableCell><Typography fontWeight="bold">Status</Typography></TableCell>
                    <TableCell><Typography fontWeight="bold">Actions</Typography></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {teamMembers?.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell>
                        <Typography variant="body2" fontWeight="medium">
                          {member.firstName} {member.lastName}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ color: '#67748e' }}>
                          {member.email}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={member.role.toUpperCase()} 
                          color={getRoleColor(member.role) as any}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={member.isActive ? 'Active' : 'Inactive'}
                          color={member.isActive ? 'success' : 'default'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton 
                          size="small" 
                          onClick={() => setEditingMember(member)}
                          sx={{ color: '#67748e' }}
                        >
                          <Edit size={16} />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          onClick={() => deleteMemberMutation.mutate(member.id)}
                          sx={{ color: '#f44336' }}
                        >
                          <Trash2 size={16} />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>

          {/* Add Member Modal */}
          <Modal
            open={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
            aria-labelledby="add-member-title"
            BackdropProps={{
              style: { 
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                backdropFilter: 'blur(4px)'
              }
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 600,
                backgroundColor: '#ffffff',
                borderRadius: 2,
                boxShadow: '0 24px 38px 3px rgba(0,0,0,0.14), 0 9px 46px 8px rgba(0,0,0,0.12), 0 11px 15px -7px rgba(0,0,0,0.20)',
                p: 4,
                border: '1px solid #e0e0e0',
                outline: 'none',
                opacity: 1,
                zIndex: 1300,
              }}
            >
              <MDTypography variant="h5" fontWeight="bold" mb={3} sx={{ color: '#344767' }}>
                Add Team Member
              </MDTypography>
              
              <Box component="form" onSubmit={form.handleSubmit(onSubmit)} sx={{ mt: 2 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <TextField
                      fullWidth
                      label="First Name"
                      variant="outlined"
                      {...form.register('firstName')}
                      error={!!form.formState.errors.firstName}
                      helperText={form.formState.errors.firstName?.message}
                    />
                    <TextField
                      fullWidth
                      label="Last Name"
                      variant="outlined"
                      {...form.register('lastName')}
                      error={!!form.formState.errors.lastName}
                      helperText={form.formState.errors.lastName?.message}
                    />
                  </Box>
                  <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    {...form.register('email')}
                    error={!!form.formState.errors.email}
                    helperText={form.formState.errors.email?.message}
                  />
                  <TextField
                    fullWidth
                    label="Password"
                    type="password"
                    {...form.register('password')}
                    error={!!form.formState.errors.password}
                    helperText={form.formState.errors.password?.message}
                  />
                  <TextField
                    fullWidth
                    select
                    label="Role"
                    {...form.register('role')}
                    SelectProps={{ native: true }}
                  >
                    <option value="member">Member</option>
                    <option value="manager">Manager</option>
                    <option value="admin">Admin</option>
                  </TextField>
                </Box>
                
                <MDBox mt={3} display="flex" justifyContent="flex-end" gap={2}>
                  <MDButton 
                    variant="outlined" 
                    onClick={() => setIsAddModalOpen(false)}
                  >
                    Cancel
                  </MDButton>
                  <MDButton 
                    variant="contained" 
                    color="info" 
                    type="submit"
                    disabled={createMemberMutation.isPending}
                  >
                    {createMemberMutation.isPending ? 'Creating...' : 'Create Member'}
                  </MDButton>
                </MDBox>
              </Box>
            </Box>
          </Modal>
          </>
          )}

          {/* Overview Dashboard Tab */}
          {activeTab === 'overview' && (
            <OverviewDashboard teamMembers={teamMembers} />
          )}

          {/* Leads Dashboard Tab */}
          {activeTab === 'leads' && (
            <LeadsManagement />
          )}

          {/* Users Dashboard Tab */}
          {activeTab === 'users' && (
            <UsersManagement />
          )}

          {/* Analytics Dashboard Tab */}
          {activeTab === 'analytics' && (
            <AnalyticsDashboard />
          )}

        </Container>
      </MDBox>
    </MDBox>
  );
}

// Overview Dashboard Component
function OverviewDashboard({ teamMembers }: { teamMembers?: TeamMember[] }) {
  const { data: leads } = useQuery<any[]>({
    queryKey: ['/api/leads'],
    enabled: true,
  });

  return (
    <>
      {/* System Overview Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <StatsCard
          title="Total Team Members"
          value={teamMembers?.length || 0}
          subtitle="registered users"
          icon={Users}
          color="primary"
        />
        <StatsCard
          title="Total Leads"
          value={leads?.length || 0}
          subtitle="in system"
          icon={TrendingUp}
          color="success"
        />
        <StatsCard
          title="Active Members"
          value={teamMembers?.filter(m => m.isActive).length || 0}
          subtitle="currently active"
          icon={Shield}
          color="info"
        />
        <StatsCard
          title="System Health"
          value="Online"
          subtitle="all systems operational"
          icon={Settings}
          color="warning"
        />
      </div>

      {/* Recent Activity */}
      <Card sx={{ boxShadow: '0 2px 8px -4px rgba(0,0,0,0.1)', mb: 3 }}>
        <MDBox p={2.5}>
          <MDTypography variant="h6" fontWeight="bold" sx={{ color: '#344767', mb: 2 }}>
            System Overview
          </MDTypography>
          <MDTypography variant="body2" sx={{ color: '#67748e' }}>
            Welcome to the Apple Bites admin dashboard. From here you can manage your team, track leads, and view system analytics.
          </MDTypography>
        </MDBox>
      </Card>
    </>
  );
}

// Leads Management Component
function LeadsManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [expandedLeads, setExpandedLeads] = useState<Set<number>>(new Set());

  const { data: leads, isLoading: leadsLoading } = useQuery<any[]>({
    queryKey: ['/api/leads', statusFilter === 'all' ? '' : statusFilter, searchQuery],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (searchQuery) params.append('search', searchQuery);
      
      const response = await fetch(`/api/leads?${params}`);
      if (!response.ok) throw new Error('Failed to fetch leads');
      return response.json();
    },
    enabled: true,
  });

  const { data: allAssessments, isLoading: assessmentsLoading } = useQuery<any[]>({
    queryKey: ['/api/analytics/assessments'],
    queryFn: async () => {
      const response = await fetch('/api/analytics/assessments');
      if (!response.ok) throw new Error('Failed to fetch assessments');
      return response.json();
    },
    enabled: true,
  });

  // Function to get assessments for a specific lead by email
  const getLeadAssessments = (leadEmail: string) => {
    if (!allAssessments || !leadEmail) return [];
    return allAssessments.filter(assessment => 
      assessment.email?.toLowerCase() === leadEmail.toLowerCase()
    );
  };

  const toggleLeadExpansion = (leadId: number) => {
    setExpandedLeads(prev => {
      const newSet = new Set(prev);
      if (newSet.has(leadId)) {
        newSet.delete(leadId);
      } else {
        newSet.add(leadId);
      }
      return newSet;
    });
  };

  const formatCurrency = (value: number | string) => {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(num)) return '$0';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'capital': return 'error';
      case 'growth': return 'warning';
      case 'free': return 'info';
      default: return 'default';
    }
  };

  const getScoreColor = (score: string) => {
    if (!score) return 'default';
    const grade = score.charAt(0);
    switch (grade) {
      case 'A': return 'success';
      case 'B': return 'info';
      case 'C': return 'warning';
      case 'D':
      case 'F': return 'error';
      default: return 'default';
    }
  };

  return (
    <>
      {/* Search and Filter */}
      <Card sx={{ boxShadow: '0 2px 8px -4px rgba(0,0,0,0.1)', mb: 3 }}>
        <MDBox p={2.5}>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
            <MDBox display="flex" alignItems="center" gap={1}>
              <Users size={20} />
              <MDTypography variant="h6" fontWeight="bold" color="dark">
                Leads & Their Assessments
              </MDTypography>
            </MDBox>
            <TextField
              label="Search leads..."
              variant="outlined"
              size="small"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ minWidth: '300px' }}
            />
            <TextField
              select
              label="Status"
              size="small"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              SelectProps={{ native: true }}
              sx={{ minWidth: '150px' }}
            >
              <option value="all">All Status</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="qualified">Qualified</option>
              <option value="proposal">Proposal</option>
              <option value="closed">Closed</option>
            </TextField>
          </div>
        </MDBox>
      </Card>

      {/* Leads with Assessments Table */}
      <Card sx={{ boxShadow: '0 2px 8px -4px rgba(0,0,0,0.1)' }}>
        <MDBox p={2.5} display="flex" justifyContent="space-between" alignItems="center">
          <MDTypography variant="h6" fontWeight="bold" sx={{ color: '#344767' }}>
            Leads ({leads?.length || 0})
          </MDTypography>
        </MDBox>
        
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
                <TableCell><Typography fontWeight="bold">Name</Typography></TableCell>
                <TableCell><Typography fontWeight="bold">Email</Typography></TableCell>
                <TableCell><Typography fontWeight="bold">Phone</Typography></TableCell>
                <TableCell><Typography fontWeight="bold">Company</Typography></TableCell>
                <TableCell><Typography fontWeight="bold">Status</Typography></TableCell>
                <TableCell><Typography fontWeight="bold">Assessments</Typography></TableCell>
                <TableCell><Typography fontWeight="bold">Date</Typography></TableCell>
                <TableCell><Typography fontWeight="bold">Actions</Typography></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {leadsLoading ? (
                <TableRow>
                  <TableCell colSpan={8} sx={{ textAlign: 'center', py: 4 }}>
                    <Typography>Loading leads...</Typography>
                  </TableCell>
                </TableRow>
              ) : !leads?.length ? (
                <TableRow>
                  <TableCell colSpan={8} sx={{ textAlign: 'center', py: 4 }}>
                    <Typography color="textSecondary">No leads found</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                leads
                  ?.filter(lead => {
                    if (!searchQuery) return true;
                    return `${lead.firstName || ''} ${lead.lastName || ''}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           (lead.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                           (lead.company || '').toLowerCase().includes(searchQuery.toLowerCase());
                  })
                  ?.filter(lead => statusFilter === 'all' || lead.status === statusFilter)
                  ?.map((lead) => {
                    const leadAssessments = getLeadAssessments(lead.email || '');
                    const isExpanded = expandedLeads.has(lead.id);
                    
                    return (
                      <>
                        {/* Main Lead Row */}
                        <TableRow key={lead.id} sx={{ '&:hover': { backgroundColor: '#f5f5f5' } }}>
                          <TableCell>
                            <MDBox display="flex" alignItems="center" gap={1}>
                              <User size={16} />
                              {`${lead.firstName || ''} ${lead.lastName || ''}`.trim() || 'N/A'}
                            </MDBox>
                          </TableCell>
                          <TableCell>
                            <MDBox display="flex" alignItems="center" gap={1}>
                              <Mail size={16} />
                              {lead.email || 'N/A'}
                            </MDBox>
                          </TableCell>
                          <TableCell>
                            <MDBox display="flex" alignItems="center" gap={1}>
                              <Phone size={16} />
                              {lead.phone || 'N/A'}
                            </MDBox>
                          </TableCell>
                          <TableCell>
                            <MDBox display="flex" alignItems="center" gap={1}>
                              <Building size={16} />
                              {lead.company || 'N/A'}
                            </MDBox>
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={lead.status || 'new'} 
                              size="small"
                              color={lead.status === 'qualified' ? 'success' : lead.status === 'closed' ? 'error' : 'default'}
                            />
                          </TableCell>
                          <TableCell>
                            <MDBox display="flex" alignItems="center" gap={1}>
                              <FileText size={16} />
                              <Typography variant="body2">
                                {leadAssessments.length} assessment{leadAssessments.length !== 1 ? 's' : ''}
                              </Typography>
                              {leadAssessments.length > 0 && (
                                <IconButton 
                                  size="small" 
                                  onClick={() => toggleLeadExpansion(lead.id)}
                                  sx={{ ml: 1 }}
                                >
                                  {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                </IconButton>
                              )}
                            </MDBox>
                          </TableCell>
                          <TableCell>
                            <MDBox display="flex" alignItems="center" gap={1}>
                              <Calendar size={16} />
                              {lead.createdAt ? new Date(lead.createdAt).toLocaleDateString() : 'N/A'}
                            </MDBox>
                          </TableCell>
                          <TableCell>
                            <MDBox display="flex" alignItems="center" gap={1}>
                              <IconButton size="small" title="View Lead Details">
                                <Eye size={16} />
                              </IconButton>
                            </MDBox>
                          </TableCell>
                        </TableRow>

                        {/* Expanded Assessments for this Lead */}
                        {isExpanded && leadAssessments.map((assessment) => (
                          <TableRow 
                            key={`assessment-${assessment.id}`} 
                            sx={{ backgroundColor: '#f9f9f9', borderLeft: '3px solid #1976d2' }}
                          >
                            <TableCell sx={{ pl: 4 }}>
                              <MDBox display="flex" alignItems="center" gap={1}>
                                <FileText size={14} />
                                <Typography variant="body2" color="textSecondary">
                                  Assessment
                                </Typography>
                              </MDBox>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" fontWeight="medium">
                                {assessment.company || 'Business Assessment'}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" fontWeight="medium" sx={{ color: '#2E7D3A' }}>
                                {formatCurrency(assessment.midEstimate || 0)}
                              </Typography>
                              <Typography variant="caption" sx={{ color: '#67748e' }}>
                                {formatCurrency(assessment.lowEstimate || 0)} - {formatCurrency(assessment.highEstimate || 0)}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" sx={{ color: '#67748e' }}>
                                EBITDA: {formatCurrency(assessment.adjustedEbitda || 0)}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Chip 
                                label={assessment.overallScore || 'N/A'} 
                                color={getScoreColor(assessment.overallScore || '') as any}
                                size="small"
                              />
                            </TableCell>
                            <TableCell>
                              <Chip 
                                label={assessment.tier?.toUpperCase() || 'FREE'} 
                                color={getTierColor(assessment.tier || 'free') as any}
                                size="small"
                              />
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" sx={{ color: '#67748e' }}>
                                {assessment.createdAt ? new Date(assessment.createdAt).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric'
                                }) : 'N/A'}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <MDBox display="flex" alignItems="center" gap={1}>
                                {assessment.pdfUrl && (
                                  <IconButton 
                                    size="small" 
                                    onClick={() => window.open(assessment.pdfUrl, '_blank')}
                                    sx={{ color: '#2E7D3A' }}
                                    title="View PDF Report"
                                  >
                                    <Eye size={16} />
                                  </IconButton>
                                )}
                                <IconButton 
                                  size="small" 
                                  onClick={() => window.open(`/assessment-results/${assessment.id}`, '_blank')}
                                  sx={{ color: '#1976d2' }}
                                  title="View Full Assessment"
                                >
                                  <ExternalLink size={16} />
                                </IconButton>
                              </MDBox>
                            </TableCell>
                          </TableRow>
                        ))}
                      </>
                    );
                  })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </>
  );
}

// Users Management Component
function UsersManagement() {
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  // Search and filter state for users
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [userFilterAnchor, setUserFilterAnchor] = useState<null | HTMLElement>(null);
  const [userTierFilter, setUserTierFilter] = useState<string>('');
  const [userStatusFilter, setUserStatusFilter] = useState<string>('');
  
  // Tier editing state
  const [editingUserTier, setEditingUserTier] = useState<string | null>(null);
  const [newTierValue, setNewTierValue] = useState<string>('');

  const { data: users, isLoading: usersLoading } = useQuery<any[]>({
    queryKey: ['/api/users'],
    queryFn: async () => {
      const response = await fetch('/api/users');
      if (!response.ok) throw new Error('Failed to fetch users');
      return response.json();
    },
    enabled: true,
  });

  // Delete single user mutation
  const deleteSingleUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete user');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users'] });
      toast({
        title: "Success",
        description: "User deleted successfully",
        variant: "default",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete user",
        variant: "destructive",
      });
    },
  });

  // Delete all users mutation
  const deleteAllUsersMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/users', {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete all users');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users'] });
      toast({
        title: "Success",
        description: "All users deleted successfully",
        variant: "default",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete all users",
        variant: "destructive",
      });
    },
  });

  // Delete multiple users mutation
  const deleteMultipleUsersMutation = useMutation({
    mutationFn: async (userIds: string[]) => {
      const response = await fetch('/api/users/delete-multiple', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userIds }),
      });
      if (!response.ok) throw new Error('Failed to delete selected users');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users'] });
      setSelectedUsers([]);
      toast({
        title: "Success",
        description: "Selected users deleted successfully",
        variant: "default",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete selected users",
        variant: "destructive",
      });
    },
  });

  // Update user tier mutation
  const updateUserTierMutation = useMutation({
    mutationFn: async ({ userId, tier }: { userId: string; tier: string }) => {
      const response = await fetch(`/api/users/${userId}/tier`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier }),
      });
      if (!response.ok) throw new Error('Failed to update user tier');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users'] });
      setEditingUserTier(null);
      setNewTierValue('');
      toast({
        title: "Success",
        description: "User tier updated successfully",
        variant: "default",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update user tier",
        variant: "destructive",
      });
    },
  });

  const handleDeleteUser = (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      deleteSingleUserMutation.mutate(userId);
    }
  };

  const handleDeleteAllUsers = () => {
    if (window.confirm('Are you sure you want to delete ALL users? This action cannot be undone and will remove all consumer accounts.')) {
      deleteAllUsersMutation.mutate();
    }
  };

  const handleDeleteSelectedUsers = () => {
    if (selectedUsers.length === 0) return;
    if (window.confirm(`Are you sure you want to delete ${selectedUsers.length} selected users? This action cannot be undone.`)) {
      deleteMultipleUsersMutation.mutate(selectedUsers);
    }
  };

  const handleSelectUser = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === filteredUsers?.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers?.map(u => u.id) || []);
    }
  };

  // Filter users based on search and filters
  const filteredUsers = useMemo(() => {
    if (!users) return [];
    
    return users.filter(user => {
      // Text search
      const searchLower = userSearchTerm.toLowerCase();
      const matchesSearch = !userSearchTerm || 
        `${user.firstName || ''} ${user.lastName || ''}`.toLowerCase().includes(searchLower) ||
        (user.fullName || '').toLowerCase().includes(searchLower) ||
        (user.email || '').toLowerCase().includes(searchLower);
      
      // Tier filter
      const matchesTier = !userTierFilter || user.tier === userTierFilter;
      
      // Status filter
      const matchesStatus = !userStatusFilter || 
        (userStatusFilter === 'active' && user.isActive) ||
        (userStatusFilter === 'inactive' && !user.isActive);
      
      return matchesSearch && matchesTier && matchesStatus;
    });
  }, [users, userSearchTerm, userTierFilter, userStatusFilter]);

  const clearUserFilters = () => {
    setUserSearchTerm('');
    setUserTierFilter('');
    setUserStatusFilter('');
    setUserFilterAnchor(null);
  };

  const handleEditTier = (userId: string, currentTier: string) => {
    setEditingUserTier(userId);
    setNewTierValue(currentTier || 'free');
  };

  const handleSaveTier = (userId: string) => {
    updateUserTierMutation.mutate({ userId, tier: newTierValue });
  };

  const handleCancelEdit = () => {
    setEditingUserTier(null);
    setNewTierValue('');
  };

  const hasActiveUserFilters = userSearchTerm || userTierFilter || userStatusFilter;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'capital': return 'error';
      case 'growth': return 'warning';
      case 'free': return 'info';
      default: return 'default';
    }
  };

  const getProviderColor = (provider: string) => {
    switch (provider) {
      case 'replit': return 'primary';
      case 'custom': return 'secondary';
      default: return 'default';
    }
  };

  return (
    <>
      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <StatsCard
          title="Total Users"
          value={users?.length || 0}
          subtitle="registered consumers"
          icon={Users}
          color="primary"
        />
        <StatsCard
          title="Active Users"
          value={users?.filter(u => u.isActive).length || 0}
          subtitle="currently active"
          icon={Shield}
          color="success"
        />
        <StatsCard
          title="Free Tier"
          value={users?.filter(u => u.tier === 'free').length || 0}
          subtitle="free accounts"
          icon={User}
          color="info"
        />
        <StatsCard
          title="Paid Tier"
          value={users?.filter(u => u.tier !== 'free').length || 0}
          subtitle="growth & capital"
          icon={Crown}
          color="warning"
        />
      </div>

      {/* Users Table */}
      <Card sx={{ boxShadow: '0 2px 8px -4px rgba(0,0,0,0.1)' }}>
        <MDBox p={2.5} display="flex" justifyContent="space-between" alignItems="center">
          <MDTypography variant="h6" fontWeight="bold" sx={{ color: '#344767' }}>
            All Users ({hasActiveUserFilters ? filteredUsers?.length : users?.length || 0})
          </MDTypography>
          <MDBox display="flex" gap={2}>
            {selectedUsers.length > 0 && (
              <MDButton
                variant="contained"
                color="warning"
                onClick={handleDeleteSelectedUsers}
                disabled={deleteMultipleUsersMutation.isPending}
                startIcon={<Trash2 size={18} />}
              >
                Delete Selected ({selectedUsers.length})
              </MDButton>
            )}
            <MDButton
              variant="contained"
              color="error"
              onClick={handleDeleteAllUsers}
              disabled={deleteAllUsersMutation.isPending}
              startIcon={<Trash2 size={18} />}
            >
              Delete All Users
            </MDButton>
          </MDBox>
        </MDBox>

        {/* Search and Filter Controls */}
        <MDBox px={2.5} pb={2}>
          <MDBox display="flex" gap={2} mb={2}>
            <TextField
              variant="outlined"
              size="small"
              placeholder="Search users..."
              value={userSearchTerm}
              onChange={(e) => setUserSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search size={20} color="#9CA3AF" />
                  </InputAdornment>
                ),
                endAdornment: userSearchTerm && (
                  <InputAdornment position="end">
                    <X 
                      size={16} 
                      color="#9CA3AF" 
                      style={{ cursor: 'pointer' }}
                      onClick={() => setUserSearchTerm('')}
                    />
                  </InputAdornment>
                )
              }}
              sx={{
                flexGrow: 1,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  backgroundColor: '#F9FAFB',
                  '&:hover': { backgroundColor: '#F3F4F6' }
                }
              }}
            />
            <MDButton
              onClick={(e) => setUserFilterAnchor(e.currentTarget)}
              sx={{
                minWidth: 'auto',
                p: 1.5,
                backgroundColor: hasActiveUserFilters ? '#00718d' : '#F9FAFB',
                color: hasActiveUserFilters ? 'white' : '#6B7280',
                border: '1px solid #E5E7EB',
                '&:hover': {
                  backgroundColor: hasActiveUserFilters ? '#005f73' : '#F3F4F6'
                }
              }}
            >
              <Filter size={18} />
            </MDButton>
            
            {/* Filter Menu */}
            <Menu
              anchorEl={userFilterAnchor}
              open={Boolean(userFilterAnchor)}
              onClose={() => setUserFilterAnchor(null)}
              sx={{ mt: 1 }}
            >
              <Box sx={{ p: 2, minWidth: 200 }}>
                <MDTypography variant="subtitle2" fontWeight="medium" mb={2}>
                  Filter by Tier
                </MDTypography>
                {['', 'free', 'growth', 'capital'].map(tier => (
                  <MenuItem 
                    key={tier}
                    onClick={() => setUserTierFilter(tier)}
                    selected={userTierFilter === tier}
                    sx={{ px: 1, py: 0.5, borderRadius: 1, mb: 0.5 }}
                  >
                    {tier ? tier.charAt(0).toUpperCase() + tier.slice(1) : 'All Tiers'}
                  </MenuItem>
                ))}
                
                <MDTypography variant="subtitle2" fontWeight="medium" mt={2} mb={2}>
                  Filter by Status
                </MDTypography>
                {['', 'active', 'inactive'].map(status => (
                  <MenuItem 
                    key={status}
                    onClick={() => setUserStatusFilter(status)}
                    selected={userStatusFilter === status}
                    sx={{ px: 1, py: 0.5, borderRadius: 1, mb: 0.5 }}
                  >
                    {status ? status.charAt(0).toUpperCase() + status.slice(1) : 'All Statuses'}
                  </MenuItem>
                ))}
                
                {hasActiveUserFilters && (
                  <MDButton
                    onClick={clearUserFilters}
                    sx={{
                      mt: 2,
                      width: '100%',
                      backgroundColor: '#F3F4F6',
                      color: '#6B7280',
                      '&:hover': { backgroundColor: '#E5E7EB' }
                    }}
                  >
                    Clear All Filters
                  </MDButton>
                )}
              </Box>
            </Menu>
          </MDBox>

          {/* Results Summary */}
          {hasActiveUserFilters && (
            <MDBox mb={2}>
              <MDTypography variant="body2" color="text" sx={{ opacity: 0.7 }}>
                Showing {filteredUsers?.length || 0} of {users?.length || 0} users
                {(userTierFilter || userStatusFilter || userSearchTerm) && ' • '}
                {userSearchTerm && `Searching for "${userSearchTerm}"`}
                {userTierFilter && ` • ${userTierFilter.charAt(0).toUpperCase() + userTierFilter.slice(1)} tier`}
                {userStatusFilter && ` • ${userStatusFilter.charAt(0).toUpperCase() + userStatusFilter.slice(1)} users`}
              </MDTypography>
            </MDBox>
          )}
        </MDBox>
        
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
                <TableCell>
                  <Checkbox
                    checked={filteredUsers && filteredUsers.length > 0 && selectedUsers.length === filteredUsers.length}
                    indeterminate={selectedUsers.length > 0 && selectedUsers.length < (filteredUsers?.length || 0)}
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell><Typography fontWeight="bold">Name</Typography></TableCell>
                <TableCell><Typography fontWeight="bold">Email</Typography></TableCell>
                <TableCell><Typography fontWeight="bold">Tier</Typography></TableCell>
                <TableCell><Typography fontWeight="bold">Auth Provider</Typography></TableCell>
                <TableCell><Typography fontWeight="bold">Status</Typography></TableCell>
                <TableCell><Typography fontWeight="bold">Created</Typography></TableCell>
                <TableCell><Typography fontWeight="bold">Actions</Typography></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {usersLoading ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    <Typography variant="body2">Loading users...</Typography>
                  </TableCell>
                </TableRow>
              ) : filteredUsers && filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    <Typography variant="body2">
                      {hasActiveUserFilters ? 'No users match your search criteria' : 'No users found'}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers?.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => handleSelectUser(user.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {user.firstName && user.lastName 
                          ? `${user.firstName} ${user.lastName}`
                          : user.fullName || 'Unknown User'
                        }
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{user.email}</Typography>
                    </TableCell>
                    <TableCell>
                      {editingUserTier === user.id ? (
                        <MDBox display="flex" alignItems="center" gap={1}>
                          <FormControl size="small" sx={{ minWidth: 100 }}>
                            <Select
                              value={newTierValue}
                              onChange={(e) => setNewTierValue(e.target.value)}
                              sx={{ fontSize: '0.875rem' }}
                            >
                              <MenuItem value="free">Free</MenuItem>
                              <MenuItem value="growth">Growth</MenuItem>
                              <MenuItem value="capital">Capital</MenuItem>
                            </Select>
                          </FormControl>
                          <IconButton 
                            size="small" 
                            onClick={() => handleSaveTier(user.id)}
                            sx={{ color: '#16A34A' }}
                            title="Save"
                            disabled={updateUserTierMutation.isPending}
                          >
                            <Save size={14} />
                          </IconButton>
                          <IconButton 
                            size="small" 
                            onClick={handleCancelEdit}
                            sx={{ color: '#DC2626' }}
                            title="Cancel"
                          >
                            <X size={14} />
                          </IconButton>
                        </MDBox>
                      ) : (
                        <MDBox display="flex" alignItems="center" gap={1}>
                          <Chip 
                            label={user.tier?.toUpperCase() || 'FREE'}
                            size="small"
                            color={getTierColor(user.tier || 'free')}
                          />
                          <IconButton 
                            size="small" 
                            onClick={() => handleEditTier(user.id, user.tier || 'free')}
                            sx={{ color: '#6B7280', '&:hover': { color: '#00718d' } }}
                            title="Edit Tier"
                          >
                            <Edit size={14} />
                          </IconButton>
                        </MDBox>
                      )}
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={user.authProvider === 'replit' ? 'Replit' : 'Email'}
                        size="small"
                        color={getProviderColor(user.authProvider)}
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={user.isActive ? 'Active' : 'Inactive'}
                        size="small"
                        color={user.isActive ? 'success' : 'default'}
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ color: '#67748e' }}>
                        {user.createdAt ? formatDate(user.createdAt) : 'Unknown'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <IconButton 
                        size="small" 
                        onClick={() => handleDeleteUser(user.id)}
                        sx={{ color: '#d32f2f' }}
                        title="Delete User"
                        disabled={deleteSingleUserMutation.isPending}
                      >
                        <Trash2 size={16} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </>
  );
}

// Analytics Dashboard Component  
function AnalyticsDashboard() {
  const { data: analytics } = useQuery<any>({
    queryKey: ['/api/analytics'],
    queryFn: async () => {
      const response = await fetch('/api/analytics');
      if (!response.ok) throw new Error('Failed to fetch analytics');
      return response.json();
    },
    enabled: true,
  });

  return (
    <>
      {/* Analytics Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <StatsCard
          title="Total Assessments"
          value={analytics?.totalAssessments || 0}
          subtitle="completed"
          icon={FileText}
          color="primary"
        />
        <StatsCard
          title="Active Users"
          value={analytics?.activeUsers || 0}
          subtitle="this month"
          icon={Users}
          color="success"
        />
        <StatsCard
          title="Conversion Rate"
          value={`${analytics?.conversionRate || 0}%`}
          subtitle="lead to customer"
          icon={TrendingUp}
          color="info"
        />
        <StatsCard
          title="Revenue"
          value={`$${analytics?.revenue || 0}`}
          subtitle="this month"
          icon={BarChart3}
          color="warning"
        />
      </div>

      {/* Analytics Content */}
      <Card sx={{ boxShadow: '0 2px 8px -4px rgba(0,0,0,0.1)' }}>
        <MDBox p={2.5}>
          <MDTypography variant="h6" fontWeight="bold" sx={{ color: '#344767', mb: 2 }}>
            System Analytics
          </MDTypography>
          <MDTypography variant="body2" sx={{ color: '#67748e' }}>
            Detailed analytics dashboard coming soon. This will include charts, metrics, and reporting functionality.
          </MDTypography>
        </MDBox>
      </Card>
    </>
  );
}