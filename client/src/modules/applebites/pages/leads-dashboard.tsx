import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import MDButton from '../../../components/MD/MDButton';
import MDInput from '../../../components/MD/MDInput';
import MDBox from '../../../components/MD/MDBox';
import MDTypography from '../../../components/MD/MDTypography';
import { Card, CardContent, Button, TextField, Select, MenuItem, FormControl, InputLabel, Chip, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';







import { Search, User, Mail, Phone, Building, Calendar, TrendingUp, LogOut, ArrowLeft, Eye, Edit, Trash2, ExternalLink } from 'lucide-react';
import { apiRequest } from '../../../lib/queryClient';
import type { Lead } from '@shared/schema';
import AdminLogin from '../../../components/admin-login';
import { useAdminAuth } from '../../../hooks/use-admin-auth';
import { useLocation } from 'wouter';
import { useToast } from '../../../hooks/use-toast';

export default function LeadsDashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const { isAuthenticated, isLoading, login, logout } = useAdminAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, navigate] = useLocation();

  const { data: leads, isLoading: leadsLoading } = useQuery<Lead[]>({
    queryKey: ['/api/leads', statusFilter === 'all' ? '' : statusFilter, searchQuery],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (searchQuery) params.append('search', searchQuery);
      
      const response = await fetch(`/api/leads?${params}`);
      if (!response.ok) throw new Error('Failed to fetch leads');
      return response.json();
    },
    enabled: isAuthenticated, // Only fetch when authenticated
  });

  // Mutation for updating lead status
  const updateLeadMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      return apiRequest('PATCH', `/api/leads/${id}`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/leads'] });
      toast({
        title: "Status Updated",
        description: "Lead status has been successfully updated.",
      });
      setShowStatusModal(false);
      setSelectedLead(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Mutation for deleting lead
  const deleteLeadMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest('DELETE', `/api/leads/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/leads'] });
      toast({
        title: "Lead Deleted",
        description: "Lead has been successfully deleted.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Delete Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });



  // Handler functions
  const handleViewDetails = (lead: Lead) => {
    setSelectedLead(lead);
    setShowDetailsModal(true);
  };

  const handleUpdateStatus = (lead: Lead) => {
    setSelectedLead(lead);
    setNewStatus(lead.leadStatus || 'new');
    setShowStatusModal(true);
  };

  const handleStatusUpdate = () => {
    if (selectedLead && newStatus) {
      updateLeadMutation.mutate({ id: selectedLead.id, status: newStatus });
    }
  };

  const handleDeleteLead = (leadId: number) => {
    deleteLeadMutation.mutate(leadId);
  };

  // Show authentication loading state
  if (isLoading) {
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
  if (!isAuthenticated) {
    return <AdminLogin onLoginSuccess={login} />;
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'new': 'bg-[#1a2332]/10 text-[#1a2332] border border-[#1a2332]/20',
      'contacted': 'bg-[#415A77]/20 text-[#1a2332] border border-[#415A77]/40',
      'qualified': 'bg-green-100 text-green-800 border border-green-200',
      'converted': 'bg-[#415A77]/30 text-[#1a2332] border border-[#415A77]/50',
      'closed': 'bg-gray-100 text-gray-800 border border-gray-200',
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border border-gray-200';
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-green-600';
    if (score >= 40) return 'text-blue-600';
    return 'text-red-600';
  };

  const formatCurrency = (value: string | null) => {
    if (!value) return '-';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(parseFloat(value));
  };

  const formatDate = (date: string | Date | null) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (leadsLoading) {
    return (
      <div >
        <div >
          <div ></div>
          <p >Loading leads...</p>
        </div>
      </div>
    );
  }

  return (
    <div >
      <div >
        <div >
          <div >
            <Button 
              variant="outline" 
              onClick={() => navigate('/team')}
              
            >
              <ArrowLeft  />
              Back to Dashboard
            </Button>
            <div >
              <h1 >Lead Management</h1>
              <p >Track and manage leads from valuation assessments</p>
            </div>
          </div>
          <div >
            <Button 
              variant="outline" 
              onClick={() => window.location.href = '/valuation-form'}
              
            >
              <ExternalLink  />
              <span >Valuation Form</span>
              <span >Form</span>
            </Button>
            <Button variant="outline" onClick={logout} >
              <LogOut  />
              Logout
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div >
          <div >
            <div >
              <Search  />
              <Input
                placeholder="Search leads..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent >
                <SelectItem value="all" >All Statuses</SelectItem>
                <SelectItem value="new" >New</SelectItem>
                <SelectItem value="contacted" >Contacted</SelectItem>
                <SelectItem value="qualified" >Qualified</SelectItem>
                <SelectItem value="converted" >Converted</SelectItem>
                <SelectItem value="closed" >Closed</SelectItem>
              </SelectContent>
            </Select>

            <div >
              <span >{leads?.length || 0}</span>
              <span >leads found</span>
            </div>
          </div>
        </div>

        {/* Leads List */}
        <div >
          {leads?.map((lead) => (
            <Card key={lead.id} >
              <div >
                <div >
                  <div >
                    <div >
                      <User  />
                      <h3 >
                        {lead.firstName} {lead.lastName}
                      </h3>
                    </div>
                    <div >
                      <Badge className={`${getStatusColor(lead.leadStatus || 'new')} flex-shrink-0`}>
                        {lead.leadStatus}
                      </Badge>
                      <div >
                        <TrendingUp  />
                        <span className={`font-medium ${getScoreColor(lead.leadScore || 0)}`}>
                          {lead.leadScore}/100
                        </span>
                      </div>
                    </div>
                  </div>

                  <div >
                    <div >
                      <Building  />
                      <span>{lead.company}</span>
                    </div>
                    <div >
                      <Mail  />
                      <span>{lead.email}</span>
                    </div>
                    {lead.phone && (
                      <div >
                        <Phone  />
                        <span>{lead.phone}</span>
                      </div>
                    )}
                    <div >
                      <Calendar  />
                      <span>Created {formatDate(lead.createdAt)}</span>
                    </div>
                  </div>

                  <div >
                    <div>
                      <span >Estimated Value:</span>
                      <span >
                        {formatCurrency(lead.estimatedValue)}
                      </span>
                    </div>
                    <div>
                      <span >Overall Grade:</span>
                      <span >{lead.overallGrade || '-'}</span>
                    </div>
                    <div>
                      <span >Follow-up Intent:</span>
                      <span >
                        {lead.followUpIntent || '-'}
                      </span>
                    </div>
                  </div>
                </div>

                <div >
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleViewDetails(lead)}
                    
                  >
                    <Eye  />
                    View Details
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleUpdateStatus(lead)}
                    
                  >
                    <Edit  />
                    Update Status
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        
                      >
                        <Trash2  />
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Lead</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this lead? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteLead(lead.id)}
                          
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </Card>
          ))}

          {leads?.length === 0 && (
            <Card >
              <User  />
              <h3 >No leads found</h3>
              <p >
                {searchQuery || statusFilter !== 'all' 
                  ? 'Try adjusting your search criteria or filters'
                  : 'Leads will appear here when users complete valuation assessments'}
              </p>
            </Card>
          )}
        </div>
      </div>

      {/* View Details Modal */}
      <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
        <DialogContent >
          <DialogHeader>
            <DialogTitle>Lead Details</DialogTitle>
            <DialogDescription>
              Complete information for {selectedLead?.firstName} {selectedLead?.lastName}
            </DialogDescription>
          </DialogHeader>
          {selectedLead && (
            <div >
              <div >
                <div>
                  <label >Name</label>
                  <p >{selectedLead.firstName} {selectedLead.lastName}</p>
                </div>
                <div>
                  <label >Company</label>
                  <p >{selectedLead.company}</p>
                </div>
                <div>
                  <label >Email</label>
                  <p >{selectedLead.email}</p>
                </div>
                <div>
                  <label >Phone</label>
                  <p >{selectedLead.phone || 'Not provided'}</p>
                </div>
                <div>
                  <label >Status</label>
                  <Badge className={getStatusColor(selectedLead.leadStatus || 'new')}>
                    {selectedLead.leadStatus}
                  </Badge>
                </div>
                <div>
                  <label >Lead Score</label>
                  <p className={`text-sm font-medium ${getScoreColor(selectedLead.leadScore || 0)}`}>
                    {selectedLead.leadScore}/100
                  </p>
                </div>
                <div>
                  <label >Estimated Value</label>
                  <p >{formatCurrency(selectedLead.estimatedValue)}</p>
                </div>
                <div>
                  <label >Overall Grade</label>
                  <p >{selectedLead.overallGrade || 'Not assessed'}</p>
                </div>
                <div>
                  <label >Follow-up Intent</label>
                  <p >{selectedLead.followUpIntent || 'Not specified'}</p>
                </div>
                <div>
                  <label >Created</label>
                  <p >{formatDate(selectedLead.createdAt)}</p>
                </div>
              </div>
              {selectedLead.notes && (
                <div>
                  <label >Notes</label>
                  <p >{selectedLead.notes}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Update Status Modal */}
      <Dialog open={showStatusModal} onOpenChange={setShowStatusModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Lead Status</DialogTitle>
            <DialogDescription>
              Update the status for {selectedLead?.firstName} {selectedLead?.lastName}
            </DialogDescription>
          </DialogHeader>
          <div >
            <div>
              <label >Current Status</label>
              <p >{selectedLead?.leadStatus || 'new'}</p>
            </div>
            <div>
              <label >New Status</label>
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select new status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="contacted">Contacted</SelectItem>
                  <SelectItem value="qualified">Qualified</SelectItem>
                  <SelectItem value="converted">Converted</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div >
              <Button variant="outline" onClick={() => setShowStatusModal(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleStatusUpdate}
                disabled={updateLeadMutation.isPending}
              >
                {updateLeadMutation.isPending ? 'Updating...' : 'Update Status'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}