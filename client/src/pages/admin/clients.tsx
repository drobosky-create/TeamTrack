import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,

} from '@mui/material';
import { 
  Add as AddIcon, 
  Edit as EditIcon, 
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Download as DownloadIcon,
  Upload as UploadIcon,
  Assessment as AssessmentIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';

interface AdminClient {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  phone?: string;
  industry?: string;
  naicsCode?: string;
  status: 'active' | 'pending' | 'completed' | 'archived';
  assessmentType: 'free' | 'growth' | 'capital';
  valuation?: number;
  revenue?: number;
  ebitda?: number;
  assignedTo: string;
  createdDate: string;
  lastActivity: string;
  followUpStatus: 'interested' | 'not_interested' | 'consultation_booked' | 'pending';
  paidTier: boolean;
  plan: string;
  stripeSessionId?: string;
}

// Sample comprehensive client data for admin view
const adminClients: AdminClient[] = [
  {
    id: '1',
    companyName: 'TechStart Solutions',
    contactName: 'John Smith',
    email: 'john@techstart.com',
    phone: '(555) 123-4567',
    industry: 'Software Development',
    naicsCode: '541511',
    status: 'active',
    assessmentType: 'growth',
    valuation: 2500000,
    revenue: 1200000,
    ebitda: 240000,
    assignedTo: 'Sarah Connor',
    createdDate: '2025-01-15',
    lastActivity: '2025-01-19',
    followUpStatus: 'consultation_booked',
    paidTier: true
  },
  {
    id: '2',
    companyName: 'Green Energy Corp',
    contactName: 'Sarah Johnson',
    email: 'sarah@greenenergy.com',
    phone: '(555) 987-6543',
    industry: 'Renewable Energy',
    naicsCode: '221117',
    status: 'completed',
    assessmentType: 'capital',
    valuation: 8750000,
    revenue: 5600000,
    ebitda: 1120000,
    assignedTo: 'Mike Rodriguez',
    createdDate: '2025-01-10',
    lastActivity: '2025-01-18',
    followUpStatus: 'interested',
    paidTier: true
  },
  {
    id: '3',
    companyName: 'Local Bakery Co',
    contactName: 'Maria Garcia',
    email: 'maria@localbakery.com',
    phone: '(555) 555-1234',
    industry: 'Food Service',
    naicsCode: '722513',
    status: 'completed',
    assessmentType: 'free',
    valuation: 450000,
    revenue: 380000,
    ebitda: 57000,
    assignedTo: 'Unassigned',
    createdDate: '2025-01-12',
    lastActivity: '2025-01-17',
    followUpStatus: 'not_interested',
    paidTier: false
  }
];

export default function AdminClientRecordsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterAssessmentType, setFilterAssessmentType] = useState('all');
  const [selectedClient, setSelectedClient] = useState<AdminClient | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Fetch real consumer signups from API
  const { data: consumersData, isLoading, error } = useQuery({
    queryKey: ['/api/admin/consumer-signups'],
    queryFn: async () => {
      const response = await fetch('/api/admin/consumer-signups', {
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error('Failed to fetch consumer signups');
      }
      return response.json();
    }
  });

  // Transform consumer data to AdminClient format
  const clients: AdminClient[] = consumersData?.signups?.map((signup: any) => ({
    id: signup.id,
    companyName: signup.companyName || 'N/A',
    contactName: `${signup.firstName || ''} ${signup.lastName || ''}`.trim() || 'N/A',
    email: signup.email,
    phone: signup.phone || 'N/A',
    industry: 'Unknown', // TODO: Get from assessments
    naicsCode: 'Unknown', // TODO: Get from assessments
    status: 'active' as const,
    assessmentType: signup.plan as 'free' | 'growth' | 'capital',
    valuation: undefined, // TODO: Get from latest assessment
    revenue: undefined, // TODO: Get from latest assessment
    ebitda: undefined, // TODO: Get from latest assessment
    assignedTo: 'Unassigned',
    createdDate: new Date(signup.createdAt).toLocaleDateString(),
    lastActivity: new Date(signup.createdAt).toLocaleDateString(),
    followUpStatus: 'pending' as const,
    paidTier: signup.plan !== 'free',
    plan: signup.plan,
    stripeSessionId: signup.stripeSessionId
  })) || [];

  const filteredClients = clients.filter(client => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = !searchTerm || 
                         client.companyName?.toLowerCase().includes(searchLower) ||
                         client.contactName?.toLowerCase().includes(searchLower) ||
                         client.email?.toLowerCase().includes(searchLower) ||
                         client.industry?.toLowerCase().includes(searchLower) ||
                         client.assignedTo?.toLowerCase().includes(searchLower);
    
    const matchesStatus = filterStatus === 'all' || client.status === filterStatus;
    const matchesAssessment = filterAssessmentType === 'all' || client.assessmentType === filterAssessmentType;
    
    return matchesSearch && matchesStatus && matchesAssessment;
  });

  // Calculate summary metrics
  const totalValuation = clients.reduce((sum, c) => sum + (c.valuation || 0), 0);
  const totalRevenue = clients.reduce((sum, c) => sum + (c.revenue || 0), 0);
  const paidClients = clients.filter(c => c.paidTier).length;
  const averageValuation = clients.length > 0 ? totalValuation / clients.length : 0;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'warning';
      case 'completed': return 'success';
      case 'pending': return 'info';
      case 'archived': return 'default';
      default: return 'default';
    }
  };

  const getFollowUpColor = (status: string) => {
    switch (status) {
      case 'interested': return 'success';
      case 'consultation_booked': return 'primary';
      case 'not_interested': return 'error';
      case 'pending': return 'warning';
      default: return 'default';
    }
  };

  const handleViewClient = (client: AdminClient) => {
    setSelectedClient(client);
    setDialogOpen(true);
  };

  const handleDeleteClient = (clientId: string) => {
    // In real app, this would call API to delete client
    alert(`Delete client ${clientId} - Admin permission required`);
  };

  const handleOverrideValuation = (clientId: string) => {
    // In real app, this would open override dialog
    alert(`Override valuation for client ${clientId} - Admin override capability`);
  };

  // Show loading state
  if (isLoading) {
    return (
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <Typography variant="h6">Loading client records...</Typography>
      </Box>
    );
  }

  // Show error state
  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          Failed to load client records. Please try refreshing the page.
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1F2937', mb: 3 }}>
        Client Records - Admin Dashboard
      </Typography>

      <Typography variant="body1" sx={{ mb: 4, color: '#6B7280' }}>
        Live consumer signups and assessments from AppleBites platform. Total records: {clients.length}
      </Typography>

      {/* Admin Summary Metrics */}
      <Box sx={{ display: 'flex', gap: 3, mb: 4, flexWrap: 'wrap' }}>
        <Card sx={{ flex: 1, minWidth: 250 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <PersonIcon sx={{ color: '#667eea', fontSize: 32 }} />
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#667eea' }}>
                  {clients.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Clients
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ flex: 1, minWidth: 250 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <TrendingUpIcon sx={{ color: '#10B981', fontSize: 32 }} />
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#10B981' }}>
                  ${(totalValuation / 1000000).toFixed(1)}M
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Valuations
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ flex: 1, minWidth: 250 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <BusinessIcon sx={{ color: '#F59E0B', fontSize: 32 }} />
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#F59E0B' }}>
                  {paidClients}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Paid Assessments
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ flex: 1, minWidth: 250 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <AssessmentIcon sx={{ color: '#8B5CF6', fontSize: 32 }} />
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#8B5CF6' }}>
                  ${(averageValuation / 1000000).toFixed(1)}M
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Avg Valuation
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Admin Controls */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, alignItems: 'center', flexWrap: 'wrap' }}>
        <TextField
          placeholder="Search all client records..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ flex: 1, minWidth: 250 }}
        />
        
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={filterStatus}
            label="Status"
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="archived">Archived</MenuItem>
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 140 }}>
          <InputLabel>Assessment</InputLabel>
          <Select
            value={filterAssessmentType}
            label="Assessment"
            onChange={(e) => setFilterAssessmentType(e.target.value)}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="free">Free</MenuItem>
            <MenuItem value="growth">Growth</MenuItem>
            <MenuItem value="capital">Capital</MenuItem>
          </Select>
        </FormControl>

        <Button
          variant="contained"
          startIcon={<UploadIcon />}
          sx={{ background: 'linear-gradient(45deg, #10B981 30%, #059669 90%)' }}
        >
          Export Data
        </Button>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{ background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)' }}
        >
          Create Client
        </Button>
      </Box>

      {/* Enhanced Admin Client Table */}
      <Card>
        <CardContent sx={{ p: 0 }}>
          <TableContainer 
            component={Paper} 
            elevation={0}
            sx={{ 
              overflowX: 'auto',
              '&::-webkit-scrollbar': {
                height: '8px',
              },
              '&::-webkit-scrollbar-track': {
                backgroundColor: '#f1f1f1',
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: '#c1c1c1',
                borderRadius: '4px',
              },
              '&::-webkit-scrollbar-thumb:hover': {
                backgroundColor: '#a8a8a8',
              },
            }}
          >
            <Table sx={{ minWidth: 1200 }}>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#F9FAFB' }}>
                  <TableCell sx={{ fontWeight: 'bold', minWidth: 200 }}>Company</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', minWidth: 180 }}>Contact</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', minWidth: 120, display: { xs: 'none', md: 'table-cell' } }}>NAICS</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', minWidth: 120 }}>Assessment</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', minWidth: 100 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', minWidth: 120, display: { xs: 'none', lg: 'table-cell' } }}>Valuation</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', minWidth: 120, display: { xs: 'none', lg: 'table-cell' } }}>Revenue</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', minWidth: 140, display: { xs: 'none', md: 'table-cell' } }}>Assigned To</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', minWidth: 140, display: { xs: 'none', md: 'table-cell' } }}>Follow-Up</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', minWidth: 120 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredClients.map((client) => (
                  <TableRow key={client.id} hover>
                    <TableCell sx={{ minWidth: 200 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                        {client.companyName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Created: {client.createdDate}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ minWidth: 180 }}>
                      <Typography variant="body2">{client.contactName}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {client.email}
                      </Typography>
                      {/* Show additional info on mobile */}
                      <Box sx={{ display: { xs: 'block', md: 'none' }, mt: 1 }}>
                        <Chip
                          label={client.assessmentType.toUpperCase()}
                          color={client.paidTier ? 'primary' : 'default'}
                          size="small"
                          sx={{ mr: 1 }}
                        />
                        <Chip
                          label={client.status.toUpperCase()}
                          color={getStatusColor(client.status) as any}
                          size="small"
                        />
                      </Box>
                    </TableCell>
                    <TableCell sx={{ minWidth: 120, display: { xs: 'none', md: 'table-cell' } }}>
                      <Typography variant="body2">{client.naicsCode}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {client.industry}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ minWidth: 120, display: { xs: 'none', sm: 'table-cell' } }}>
                      <Chip
                        label={client.assessmentType.toUpperCase()}
                        color={client.paidTier ? 'primary' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell sx={{ minWidth: 100, display: { xs: 'none', sm: 'table-cell' } }}>
                      <Chip
                        label={client.status.toUpperCase()}
                        color={getStatusColor(client.status) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell sx={{ minWidth: 120, display: { xs: 'none', lg: 'table-cell' } }}>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        {client.valuation 
                          ? `$${(client.valuation / 1000000).toFixed(1)}M`
                          : 'Pending'
                        }
                      </Typography>
                      {client.ebitda && (
                        <Typography variant="caption" color="text.secondary">
                          EBITDA: ${(client.ebitda / 1000).toFixed(0)}K
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell sx={{ minWidth: 120, display: { xs: 'none', lg: 'table-cell' } }}>
                      {client.revenue 
                        ? `$${(client.revenue / 1000000).toFixed(1)}M`
                        : 'N/A'
                      }
                    </TableCell>
                    <TableCell sx={{ minWidth: 140, display: { xs: 'none', md: 'table-cell' } }}>
                      {client.assignedTo}
                    </TableCell>
                    <TableCell sx={{ minWidth: 140, display: { xs: 'none', md: 'table-cell' } }}>
                      <Chip
                        label={client.followUpStatus.replace('_', ' ').toUpperCase()}
                        color={getFollowUpColor(client.followUpStatus) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell sx={{ minWidth: 120 }}>
                      <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'nowrap' }}>
                        <IconButton 
                          size="small" 
                          onClick={() => handleViewClient(client)}
                          sx={{ color: '#667eea' }}
                        >
                          <ViewIcon fontSize="small" />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          sx={{ color: '#10B981' }}
                          onClick={() => handleOverrideValuation(client.id)}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" sx={{ color: '#F59E0B' }}>
                          <DownloadIcon fontSize="small" />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          sx={{ color: '#EF4444' }}
                          onClick={() => handleDeleteClient(client.id)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Admin Client Detail Dialog */}
      <Dialog 
        open={dialogOpen} 
        onClose={() => setDialogOpen(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            Admin View: {selectedClient?.companyName}
          </Typography>
        </DialogTitle>
        <DialogContent>
          {selectedClient && (
            <Box>
              <Alert severity="info" sx={{ mb: 3 }}>
                <strong>Admin Access:</strong> Complete client record with override capabilities, 
                assessment history, financial data, and system administration tools.
              </Alert>
              
              <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                <Box sx={{ flex: 1, minWidth: 300 }}>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                    Company Details
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography><strong>NAICS Code:</strong> {selectedClient.naicsCode}</Typography>
                    <Typography><strong>Industry:</strong> {selectedClient.industry}</Typography>
                    <Typography><strong>Contact:</strong> {selectedClient.contactName}</Typography>
                    <Typography><strong>Email:</strong> {selectedClient.email}</Typography>
                    <Typography><strong>Phone:</strong> {selectedClient.phone}</Typography>
                  </Box>
                </Box>
                
                <Box sx={{ flex: 1, minWidth: 300 }}>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                    Financial & Assessment Data
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography><strong>Assessment Type:</strong> {selectedClient.assessmentType.toUpperCase()}</Typography>
                    <Typography><strong>Paid Tier:</strong> {selectedClient.paidTier ? 'Yes' : 'No'}</Typography>
                    <Typography><strong>Revenue:</strong> ${selectedClient.revenue ? (selectedClient.revenue / 1000000).toFixed(1) + 'M' : 'N/A'}</Typography>
                    <Typography><strong>EBITDA:</strong> ${selectedClient.ebitda ? (selectedClient.ebitda / 1000).toFixed(0) + 'K' : 'N/A'}</Typography>
                    <Typography><strong>Valuation:</strong> ${selectedClient.valuation ? (selectedClient.valuation / 1000000).toFixed(1) + 'M' : 'Pending'}</Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Close</Button>
          <Button variant="outlined" color="warning">
            Override Valuation
          </Button>
          <Button variant="contained" sx={{ background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)' }}>
            Edit Record
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}