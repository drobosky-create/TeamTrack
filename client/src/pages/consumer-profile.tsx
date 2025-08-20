import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Container,
  Card,
  CardContent,
  Grid,
  Typography,
  Avatar,
  Switch,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Divider,
  useMediaQuery
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Security as SecurityIcon,
  Edit as EditIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

function ConsumerProfile() {
  const { data: user } = useQuery({
    queryKey: ['/api/auth/consumer-user'],
    select: (data: any) => data?.user || null,
  });
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Settings state
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [assessmentReminders, setAssessmentReminders] = useState(true);
  const [reportUpdates, setReportUpdates] = useState(false);
  const [newsletter, setNewsletter] = useState(false);
  
  // Password setup dialog state
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    password: '',
    confirmPassword: ''
  });

  const setPasswordMutation = useMutation({
    mutationFn: async (passwordData: { password: string }) => {
      const res = await apiRequest('POST', '/api/consumer/set-password', passwordData);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Password Set Successfully",
        description: "You can now log in with your email and password.",
      });
      setPasswordDialogOpen(false);
      setPasswordForm({ password: '', confirmPassword: '' });
      queryClient.invalidateQueries(['/api/auth/consumer-user']);
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to Set Password",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handlePasswordSubmit = () => {
    if (passwordForm.password !== passwordForm.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match.",
        variant: "destructive",
      });
      return;
    }
    
    if (passwordForm.password.length < 8) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 8 characters long.",
        variant: "destructive",
      });
      return;
    }

    setPasswordMutation.mutate({ password: passwordForm.password });
  };

  if (!user) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography>Loading profile...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      {/* Header Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
          height: 300,
          position: 'relative',
          borderRadius: isMobile ? 0 : '0 0 24px 24px',
        }}
      />
      
      <Container maxWidth="lg" sx={{ position: 'relative', mt: -15, pb: 4 }}>
        {/* Profile Card */}
        <Card
          sx={{
            p: 3,
            mb: 4,
            borderRadius: 3,
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
          }}
        >
          <Grid container spacing={3} alignItems="center">
            <Grid item>
              <Avatar
                sx={{
                  width: 100,
                  height: 100,
                  bgcolor: theme.palette.primary.main,
                  fontSize: '2rem',
                  fontWeight: 'bold'
                }}
              >
                {user.email?.[0]?.toUpperCase() || 'U'}
              </Avatar>
            </Grid>
            <Grid item xs>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#344767', mb: 1 }}>
                {user.email}
              </Typography>
              <Typography variant="body1" sx={{ color: '#7b809a', mb: 2 }}>
                AppleBites Growth Member
              </Typography>
              {!user.hasPassword && (
                <Button
                  variant="contained"
                  startIcon={<SecurityIcon />}
                  onClick={() => setPasswordDialogOpen(true)}
                  sx={{
                    background: 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #45a049 0%, #3d8b40 100%)',
                    }
                  }}
                >
                  Set Login Password
                </Button>
              )}
            </Grid>
          </Grid>
        </Card>

        <Grid container spacing={4}>
          {/* Account Settings */}
          <Grid item xs={12} md={6} xl={4}>
            <Card sx={{ height: '100%', borderRadius: 3, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#344767', mb: 3 }}>
                  Account Settings
                </Typography>
                
                <Box sx={{ mb: 3 }}>
                  <Typography variant="caption" sx={{ fontWeight: 'bold', color: '#7b809a', textTransform: 'uppercase', mb: 2, display: 'block' }}>
                    Notifications
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Switch 
                      checked={emailNotifications} 
                      onChange={() => setEmailNotifications(!emailNotifications)}
                      color="primary"
                    />
                    <Typography variant="body2" sx={{ ml: 1, color: '#344767' }}>
                      Email notifications
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Switch 
                      checked={assessmentReminders} 
                      onChange={() => setAssessmentReminders(!assessmentReminders)}
                      color="primary"
                    />
                    <Typography variant="body2" sx={{ ml: 1, color: '#344767' }}>
                      Assessment reminders
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Switch 
                      checked={reportUpdates} 
                      onChange={() => setReportUpdates(!reportUpdates)}
                      color="primary"
                    />
                    <Typography variant="body2" sx={{ ml: 1, color: '#344767' }}>
                      Report updates
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Switch 
                      checked={newsletter} 
                      onChange={() => setNewsletter(!newsletter)}
                      color="primary"
                    />
                    <Typography variant="body2" sx={{ ml: 1, color: '#344767' }}>
                      Newsletter subscription
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Profile Information */}
          <Grid item xs={12} md={6} xl={4}>
            <Card sx={{ height: '100%', borderRadius: 3, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#344767' }}>
                    Profile Information
                  </Typography>
                  <IconButton size="small">
                    <EditIcon />
                  </IconButton>
                </Box>
                
                <Typography variant="body2" sx={{ color: '#7b809a', mb: 3, lineHeight: 1.6 }}>
                  Welcome to AppleBites! You're now part of our Growth platform with access to comprehensive business valuation tools and AI-powered insights.
                </Typography>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <EmailIcon sx={{ color: '#7b809a', fontSize: 20 }} />
                    <Box>
                      <Typography variant="caption" sx={{ color: '#7b809a', textTransform: 'uppercase' }}>
                        Email
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#344767', fontWeight: 'medium' }}>
                        {user.email}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <PersonIcon sx={{ color: '#7b809a', fontSize: 20 }} />
                    <Box>
                      <Typography variant="caption" sx={{ color: '#7b809a', textTransform: 'uppercase' }}>
                        Member Since
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#344767', fontWeight: 'medium' }}>
                        {new Date(user.createdAt).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <SecurityIcon sx={{ color: '#7b809a', fontSize: 20 }} />
                    <Box>
                      <Typography variant="caption" sx={{ color: '#7b809a', textTransform: 'uppercase' }}>
                        Login Status
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#344767', fontWeight: 'medium' }}>
                        {user.hasPassword ? 'Password Enabled' : 'Event Access Only'}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Recent Activity */}
          <Grid item xs={12} xl={4}>
            <Card sx={{ height: '100%', borderRadius: 3, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#344767', mb: 3 }}>
                  Recent Activity
                </Typography>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {[
                    { action: 'Joined AppleBites Growth', time: 'Today' },
                    { action: 'Account Created', time: 'Today' },
                    { action: 'Welcome to AppleBites', time: 'Today' }
                  ].map((activity, index) => (
                    <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          backgroundColor: '#4caf50'
                        }}
                      />
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 'medium', color: '#344767' }}>
                          {activity.action}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#7b809a' }}>
                          {activity.time}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                  
                  <Divider sx={{ my: 1 }} />
                  
                  <Typography variant="body2" sx={{ color: '#7b809a', textAlign: 'center' }}>
                    Start your first assessment to see more activity
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Password Setup Dialog */}
      <Dialog
        open={passwordDialogOpen}
        onClose={() => setPasswordDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Set Login Password</Typography>
          <IconButton onClick={() => setPasswordDialogOpen(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 3, color: '#7b809a' }}>
            Set a password to log back into your account using your email and password.
          </Typography>
          <TextField
            fullWidth
            type="password"
            label="Password"
            value={passwordForm.password}
            onChange={(e) => setPasswordForm({ ...passwordForm, password: e.target.value })}
            margin="normal"
            helperText="Minimum 8 characters"
          />
          <TextField
            fullWidth
            type="password"
            label="Confirm Password"
            value={passwordForm.confirmPassword}
            onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
            margin="normal"
          />
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setPasswordDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handlePasswordSubmit}
            disabled={setPasswordMutation.isPending || !passwordForm.password || !passwordForm.confirmPassword}
            sx={{
              background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
            }}
          >
            {setPasswordMutation.isPending ? 'Setting...' : 'Set Password'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default ConsumerProfile;