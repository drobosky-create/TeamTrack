import React, { useState } from 'react';
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
  Tabs,
  Tab,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import { 
  Add as AddIcon, 
  Edit as EditIcon, 
  Visibility as ViewIcon,
  Download as DownloadIcon,
  ExpandMore as ExpandMoreIcon,
  Assessment as AssessmentIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
} from '@mui/icons-material';

interface Client {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  industry: string;
  status: 'active' | 'pending' | 'completed';
  assessmentType: 'free' | 'growth' | 'capital';
  valuation?: number;
  lastActivity: string;
  assignedTo: string;
}

// Sample client data for team member view
const sampleClients: Client[] = [
  {
    id: '1',
    companyName: 'TechStart Solutions',
    contactName: 'John Smith',
    email: 'john@techstart.com',
    phone: '(555) 123-4567',
    industry: 'Software Development',
    status: 'active',
    assessmentType: 'growth',
    valuation: 2500000,
    lastActivity: '2025-01-19',
    assignedTo: 'me'
  },
  {
    id: '2',
    companyName: 'Green Energy Corp',
    contactName: 'Sarah Johnson',
    email: 'sarah@greenenergy.com',
    phone: '(555) 987-6543',
    industry: 'Renewable Energy',
    status: 'completed',
    assessmentType: 'capital',
    valuation: 8750000,
    lastActivity: '2025-01-18',
    assignedTo: 'me'
  }
];

export default function ClientManagementPage() {
  const [clients] = useState<Client[]>(sampleClients);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const filteredClients = clients.filter(client =>
    client.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.industry.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'warning';
      case 'completed': return 'success';
      case 'pending': return 'info';
      default: return 'default';
    }
  };

  const getAssessmentTypeColor = (type: string) => {
    switch (type) {
      case 'free': return 'success';
      case 'growth': return 'primary';
      case 'capital': return 'secondary';
      default: return 'default';
    }
  };

  const handleViewClient = (client: Client) => {
    setSelectedClient(client);
    setDialogOpen(true);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1F2937', mb: 3 }}>
        Client Management
      </Typography>

      <Typography variant="body1" sx={{ mb: 4, color: '#6B7280' }}>
        Manage and track your assigned clients through their assessment journey.
      </Typography>

      {/* Quick Stats */}
      <Box sx={{ display: 'flex', gap: 3, mb: 4, flexWrap: 'wrap' }}>
        <Card sx={{ flex: 1, minWidth: 200 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <PersonIcon sx={{ color: '#667eea', fontSize: 32 }} />
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#667eea' }}>
                  {clients.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Active Clients
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ flex: 1, minWidth: 200 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <AssessmentIcon sx={{ color: '#10B981', fontSize: 32 }} />
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#10B981' }}>
                  {clients.filter(c => c.status === 'completed').length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Completed Assessments
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ flex: 1, minWidth: 200 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <BusinessIcon sx={{ color: '#F59E0B', fontSize: 32 }} />
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#F59E0B' }}>
                  $
                  {(clients.reduce((sum, c) => sum + (c.valuation || 0), 0) / 1000000).toFixed(1)}M
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Valuations
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Search and Actions */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, alignItems: 'center', flexWrap: 'wrap' }}>
        <TextField
          placeholder="Search clients..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ flex: 1, minWidth: 250 }}
        />
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{
            background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
            color: 'white'
          }}
        >
          Add Client
        </Button>
      </Box>

      {/* Clients Table */}
      <Card>
        <CardContent sx={{ p: 0 }}>
          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#F9FAFB' }}>
                  <TableCell sx={{ fontWeight: 'bold' }}>Company</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Contact</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Industry</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Assessment</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Valuation</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Last Activity</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredClients.map((client) => (
                  <TableRow key={client.id} hover>
                    <TableCell>
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                        {client.companyName}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{client.contactName}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {client.email}
                      </Typography>
                    </TableCell>
                    <TableCell>{client.industry}</TableCell>
                    <TableCell>
                      <Chip
                        label={client.assessmentType.toUpperCase()}
                        color={getAssessmentTypeColor(client.assessmentType) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={client.status.toUpperCase()}
                        color={getStatusColor(client.status) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {client.valuation 
                        ? `$${(client.valuation / 1000000).toFixed(1)}M`
                        : 'Pending'
                      }
                    </TableCell>
                    <TableCell>{client.lastActivity}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton 
                          size="small" 
                          onClick={() => handleViewClient(client)}
                          sx={{ color: '#667eea' }}
                        >
                          <ViewIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" sx={{ color: '#10B981' }}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" sx={{ color: '#F59E0B' }}>
                          <DownloadIcon fontSize="small" />
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

      {/* Client Detail Dialog */}
      <Dialog 
        open={dialogOpen} 
        onClose={() => setDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            {selectedClient?.companyName}
          </Typography>
        </DialogTitle>
        <DialogContent>
          {selectedClient && (
            <Box>
              <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)}>
                <Tab label="Overview" />
                <Tab label="Assessment History" />
                <Tab label="Notes & Tasks" />
              </Tabs>

              {activeTab === 0 && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                    Company Information
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Typography><strong>Contact:</strong> {selectedClient.contactName}</Typography>
                    <Typography><strong>Email:</strong> {selectedClient.email}</Typography>
                    <Typography><strong>Phone:</strong> {selectedClient.phone}</Typography>
                    <Typography><strong>Industry:</strong> {selectedClient.industry}</Typography>
                    <Typography><strong>Assessment Type:</strong> {selectedClient.assessmentType.toUpperCase()}</Typography>
                    {selectedClient.valuation && (
                      <Typography><strong>Current Valuation:</strong> ${(selectedClient.valuation / 1000000).toFixed(1)}M</Typography>
                    )}
                  </Box>
                </Box>
              )}

              {activeTab === 1 && (
                <Box sx={{ mt: 3 }}>
                  <Alert severity="info">
                    Assessment history and detailed scoring would be displayed here with access to 
                    value driver breakdowns, EBITDA calculations, and improvement recommendations.
                  </Alert>
                </Box>
              )}

              {activeTab === 2 && (
                <Box sx={{ mt: 3 }}>
                  <Alert severity="info">
                    Client notes, follow-up tasks, and internal team communications would be managed here.
                    This includes onboarding tasks, review schedules, and follow-up reminders.
                  </Alert>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Close</Button>
          <Button variant="contained" sx={{ background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)' }}>
            Edit Client
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}