import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Users, 
  Plus, 
  Search, 
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Mail,
  Calendar,
  Network,
  Briefcase,
  Phone,
  FileText
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { OrgChart } from './OrgChart';
import { ProfileEditDialog } from '@/components/profile/ProfileEditDialog';
import { ProfileViewDialog } from '@/components/profile/ProfileViewDialog';

interface TeamMember {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  department: string | null;
  job_title: string | null;
  photo_url: string | null;
  created_at: string;
}

export const TeamDirectory: React.FC = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProfile, setSelectedProfile] = useState<TeamMember | null>(null);
  const [showProfileView, setShowProfileView] = useState(false);
  const [showProfileEdit, setShowProfileEdit] = useState(false);
  const [editingProfileId, setEditingProfileId] = useState<string | null>(null);

  // Fetch team members from Supabase
  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setTeamMembers(data || []);
      } catch (error: any) {
        toast({
          title: 'Error',
          description: 'Failed to load team members',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeamMembers();
  }, [toast]);

  // Get unique departments for filter
  const departments = Array.from(new Set(teamMembers.map(member => member.department).filter(Boolean)));

  // Filter team members
  const filteredMembers = teamMembers.filter(member => {
    const matchesSearch = 
      (member.name?.toLowerCase().includes(searchQuery.toLowerCase()) || false) ||
      (member.email?.toLowerCase().includes(searchQuery.toLowerCase()) || false);
    const matchesDepartment = departmentFilter === 'all' || member.department === departmentFilter;
    
    return matchesSearch && matchesDepartment;
  });

  const handleViewProfile = (member: TeamMember) => {
    setSelectedProfile(member);
    setShowProfileView(true);
  };

  const handleEditProfile = (member: TeamMember) => {
    setEditingProfileId(member.id);
    setShowProfileEdit(true);
  };

  const canEditProfile = (member: TeamMember) => {
    // Users can edit their own profile, or if they're an admin
    return member.id === user?.id || profile?.id === user?.id;
  };

  const canViewReportCard = (member: TeamMember) => {
    // Team members can view their own, managers can view their reports, admins can view all
    if (profile?.role === 'admin') return true;
    if (member.id === user?.id) return true;
    if (profile?.role === 'manager') {
      // In a real app, you'd check if this member reports to the current user
      // For now, we'll allow managers to view all report cards
      return true;
    }
    return false;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">Team Directory</h1>
          <p className="text-foreground-muted mt-1">Manage your team members and their review settings</p>
        </div>
        <Button 
          className="gap-2 bg-gradient-primary hover:opacity-90" 
          onClick={() => handleEditProfile({ id: user?.id || '', name: profile?.name, email: profile?.email, phone: profile?.phone, department: profile?.department, job_title: profile?.job_title, photo_url: profile?.photo_url, created_at: new Date().toISOString() })}
        >
          <Edit className="h-4 w-4" />
          Edit My Profile
        </Button>
      </div>

      {/* Tabs for Directory and Org Chart */}
      <Tabs defaultValue="directory" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="directory" className="gap-2">
            <Users className="h-4 w-4" />
            Directory
          </TabsTrigger>
          <TabsTrigger value="orgchart" className="gap-2">
            <Network className="h-4 w-4" />
            Org Chart
          </TabsTrigger>
        </TabsList>

        {/* Directory Tab */}
        <TabsContent value="directory" className="space-y-6">
          {/* Filters */}
          <Card className="shadow-soft border-border-soft">
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Search */}
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Department Filter */}
                <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    {departments.map(dept => (
                      <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

              </div>
            </CardContent>
          </Card>

          {/* Team Members Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="shadow-soft border-border-soft">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-muted rounded-full animate-pulse" />
                      <div className="space-y-2">
                        <div className="h-4 w-24 bg-muted rounded animate-pulse" />
                        <div className="h-3 w-32 bg-muted rounded animate-pulse" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="h-6 w-20 bg-muted rounded animate-pulse" />
                    <div className="h-4 w-16 bg-muted rounded animate-pulse" />
                    <div className="h-3 w-28 bg-muted rounded animate-pulse" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredMembers.map((member) => (
                <Card 
                  key={member.id} 
                  className="shadow-soft border-border-soft hover:shadow-soft-md transition-shadow cursor-pointer"
                  onClick={() => handleViewProfile(member)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={member.photo_url || undefined} alt={member.name || ''} />
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {member.name?.split(' ').map(n => n[0]).join('') || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-base">{member.name || 'No name set'}</CardTitle>
                          <CardDescription className="text-sm">{member.email}</CardDescription>
                        </div>
                      </div>
                      {canEditProfile(member) && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {canViewReportCard(member) && (
                              <DropdownMenuItem onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/report-card/${member.id}`);
                              }}>
                                <FileText className="mr-2 h-4 w-4" />
                                View Report Card
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem onClick={(e) => {
                              e.stopPropagation();
                              handleEditProfile(member);
                            }}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Profile
                            </DropdownMenuItem>
                            {member.email && (
                              <DropdownMenuItem onClick={(e) => {
                                e.stopPropagation();
                                window.open(`mailto:${member.email}`, '_blank');
                              }}>
                                <Mail className="mr-2 h-4 w-4" />
                                Send Email
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {/* Job Title */}
                    {member.job_title && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Briefcase className="h-3 w-3" />
                        {member.job_title}
                      </div>
                    )}

                    {/* Department */}
                    {member.department && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Users className="h-3 w-3" />
                        {member.department}
                      </div>
                    )}

                    {/* Phone */}
                    {member.phone && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="h-3 w-3" />
                        {member.phone}
                      </div>
                    )}

                    {/* Member since */}
                    <div className="text-xs text-muted-foreground">
                      Member since {new Date(member.created_at).toLocaleDateString()}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!isLoading && filteredMembers.length === 0 && (
            <Card className="shadow-soft border-border-soft">
              <CardContent className="pt-8 pb-8 text-center">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No team members found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchQuery || departmentFilter !== 'all' 
                    ? "Try adjusting your search or filters"
                    : "Complete your profile to appear in the team directory"
                  }
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Org Chart Tab */}
        <TabsContent value="orgchart" className="space-y-6">
          <Card className="shadow-soft border-border-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Network className="h-5 w-5" />
                Organization Chart
              </CardTitle>
              <CardDescription>
                Visual representation of your team hierarchy. Drag nodes to reposition them.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-muted-foreground">Org chart feature coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Profile Dialogs */}
      <ProfileViewDialog
        open={showProfileView}
        onOpenChange={setShowProfileView}
        profile={selectedProfile}
        canEdit={selectedProfile ? canEditProfile(selectedProfile) : false}
        onEdit={() => {
          if (selectedProfile) {
            setShowProfileView(false);
            handleEditProfile(selectedProfile);
          }
        }}
      />

      <ProfileEditDialog
        open={showProfileEdit}
        onOpenChange={(open) => {
          setShowProfileEdit(open);
          if (!open) {
            setEditingProfileId(null);
          }
        }}
        isOwnProfile={editingProfileId === user?.id}
        profileId={editingProfileId || undefined}
      />
    </div>
  );
};