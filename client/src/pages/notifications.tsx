import React, { useState } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Alert,
  Snackbar,
  Switch,
  FormControlLabel,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton
} from '@mui/material';
import {
  Check as CheckIcon,
  Notifications as NotificationsIcon,
  Star as StarIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Error as ErrorIcon,
  Settings as SettingsIcon,
  Close as CloseIcon
} from '@mui/icons-material';

export default function Notifications() {
  const [successSB, setSuccessSB] = useState(false);
  const [infoSB, setInfoSB] = useState(false);
  const [warningSB, setWarningSB] = useState(false);
  const [errorSB, setErrorSB] = useState(false);

  const [notificationSettings, setNotificationSettings] = useState({
    emailReviews: true,
    emailGoals: false,
    emailTeamUpdates: true,
    pushReviews: true,
    pushGoals: true,
    pushTeamUpdates: false
  });

  const handleSettingChange = (setting: string) => {
    setNotificationSettings(prev => ({
      ...prev,
      [setting]: !prev[setting as keyof typeof prev]
    }));
  };

  const notifications = [
    {
      id: 1,
      type: 'success',
      title: 'Review Completed',
      message: 'Your Q4 performance review has been successfully submitted.',
      time: '2 hours ago',
      read: false
    },
    {
      id: 2,
      type: 'info',
      title: 'New Goal Assigned',
      message: 'You have been assigned a new quarterly goal for team collaboration.',
      time: '1 day ago',
      read: false
    },
    {
      id: 3,
      type: 'warning',
      title: 'Review Due Soon',
      message: 'Your monthly self-assessment is due in 3 days.',
      time: '2 days ago',
      read: true
    },
    {
      id: 4,
      type: 'error',
      title: 'Action Required',
      message: 'Please update your contact information in your profile.',
      time: '1 week ago',
      read: true
    }
  ];

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckIcon sx={{ color: '#4caf50' }} />;
      case 'info': return <InfoIcon sx={{ color: '#2196f3' }} />;
      case 'warning': return <WarningIcon sx={{ color: '#ff9800' }} />;
      case 'error': return <ErrorIcon sx={{ color: '#f44336' }} />;
      default: return <NotificationsIcon />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success': return '#e8f5e8';
      case 'info': return '#e3f2fd';
      case 'warning': return '#fff3e0';
      case 'error': return '#ffebee';
      default: return '#f5f5f5';
    }
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3, color: '#344767', fontWeight: 'bold' }}>
        Notifications
      </Typography>

      <Grid container spacing={3}>
        {/* Alerts Demo */}
        <Grid item xs={12} lg={6}>
          <Card sx={{ boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', borderRadius: 3 }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#344767', mb: 3 }}>
                Alert Messages
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 4 }}>
                <Alert 
                  severity="success" 
                  sx={{ borderRadius: 2, '& .MuiAlert-icon': { alignItems: 'center' } }}
                >
                  <Typography variant="body2">
                    A simple success alert with{' '}
                    <Typography component="span" sx={{ fontWeight: 600, textDecoration: 'underline', cursor: 'pointer' }}>
                      an example link
                    </Typography>
                    . Give it a click if you like.
                  </Typography>
                </Alert>

                <Alert 
                  severity="info" 
                  sx={{ borderRadius: 2, '& .MuiAlert-icon': { alignItems: 'center' } }}
                >
                  <Typography variant="body2">
                    A simple info alert with{' '}
                    <Typography component="span" sx={{ fontWeight: 600, textDecoration: 'underline', cursor: 'pointer' }}>
                      an example link
                    </Typography>
                    . Give it a click if you like.
                  </Typography>
                </Alert>

                <Alert 
                  severity="warning" 
                  sx={{ borderRadius: 2, '& .MuiAlert-icon': { alignItems: 'center' } }}
                >
                  <Typography variant="body2">
                    A simple warning alert with{' '}
                    <Typography component="span" sx={{ fontWeight: 600, textDecoration: 'underline', cursor: 'pointer' }}>
                      an example link
                    </Typography>
                    . Give it a click if you like.
                  </Typography>
                </Alert>

                <Alert 
                  severity="error" 
                  sx={{ borderRadius: 2, '& .MuiAlert-icon': { alignItems: 'center' } }}
                >
                  <Typography variant="body2">
                    A simple error alert with{' '}
                    <Typography component="span" sx={{ fontWeight: 600, textDecoration: 'underline', cursor: 'pointer' }}>
                      an example link
                    </Typography>
                    . Give it a click if you like.
                  </Typography>
                </Alert>
              </Box>

              <Typography variant="h6" sx={{ fontWeight: 700, color: '#344767', mb: 3 }}>
                Notification Modals
              </Typography>

              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button 
                  variant="contained" 
                  onClick={() => setSuccessSB(true)}
                  sx={{ 
                    backgroundColor: '#4caf50', 
                    '&:hover': { backgroundColor: '#43a047' },
                    textTransform: 'none'
                  }}
                >
                  Success notification
                </Button>
                <Button 
                  variant="contained" 
                  onClick={() => setInfoSB(true)}
                  sx={{ 
                    backgroundColor: '#2196f3', 
                    '&:hover': { backgroundColor: '#1976d2' },
                    textTransform: 'none'
                  }}
                >
                  Info notification
                </Button>
                <Button 
                  variant="contained" 
                  onClick={() => setWarningSB(true)}
                  sx={{ 
                    backgroundColor: '#ff9800', 
                    '&:hover': { backgroundColor: '#f57c00' },
                    textTransform: 'none'
                  }}
                >
                  Warning notification
                </Button>
                <Button 
                  variant="contained" 
                  onClick={() => setErrorSB(true)}
                  sx={{ 
                    backgroundColor: '#f44336', 
                    '&:hover': { backgroundColor: '#d32f2f' },
                    textTransform: 'none'
                  }}
                >
                  Error notification
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Notification Settings */}
        <Grid item xs={12} lg={6}>
          <Card sx={{ boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', borderRadius: 3 }}>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <SettingsIcon sx={{ color: '#344767' }} />
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#344767' }}>
                  Notification Settings
                </Typography>
              </Box>

              <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#344767', mb: 2, textTransform: 'uppercase' }}>
                Email Notifications
              </Typography>

              <Box sx={{ mb: 3 }}>
                <FormControlLabel
                  control={
                    <Switch 
                      checked={notificationSettings.emailReviews}
                      onChange={() => handleSettingChange('emailReviews')}
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': {
                          color: '#4caf50',
                        },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                          backgroundColor: '#4caf50',
                        },
                      }}
                    />
                  }
                  label={
                    <Typography variant="body2" sx={{ color: '#7b809a' }}>
                      Email me about review updates
                    </Typography>
                  }
                />
                <FormControlLabel
                  control={
                    <Switch 
                      checked={notificationSettings.emailGoals}
                      onChange={() => handleSettingChange('emailGoals')}
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': {
                          color: '#4caf50',
                        },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                          backgroundColor: '#4caf50',
                        },
                      }}
                    />
                  }
                  label={
                    <Typography variant="body2" sx={{ color: '#7b809a' }}>
                      Email me about goal assignments
                    </Typography>
                  }
                />
                <FormControlLabel
                  control={
                    <Switch 
                      checked={notificationSettings.emailTeamUpdates}
                      onChange={() => handleSettingChange('emailTeamUpdates')}
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': {
                          color: '#4caf50',
                        },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                          backgroundColor: '#4caf50',
                        },
                      }}
                    />
                  }
                  label={
                    <Typography variant="body2" sx={{ color: '#7b809a' }}>
                      Email me about team updates
                    </Typography>
                  }
                />
              </Box>

              <Divider sx={{ my: 2 }} />

              <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#344767', mb: 2, textTransform: 'uppercase' }}>
                Push Notifications
              </Typography>

              <Box>
                <FormControlLabel
                  control={
                    <Switch 
                      checked={notificationSettings.pushReviews}
                      onChange={() => handleSettingChange('pushReviews')}
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': {
                          color: '#4caf50',
                        },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                          backgroundColor: '#4caf50',
                        },
                      }}
                    />
                  }
                  label={
                    <Typography variant="body2" sx={{ color: '#7b809a' }}>
                      Push notifications for reviews
                    </Typography>
                  }
                />
                <FormControlLabel
                  control={
                    <Switch 
                      checked={notificationSettings.pushGoals}
                      onChange={() => handleSettingChange('pushGoals')}
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': {
                          color: '#4caf50',
                        },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                          backgroundColor: '#4caf50',
                        },
                      }}
                    />
                  }
                  label={
                    <Typography variant="body2" sx={{ color: '#7b809a' }}>
                      Push notifications for goals
                    </Typography>
                  }
                />
                <FormControlLabel
                  control={
                    <Switch 
                      checked={notificationSettings.pushTeamUpdates}
                      onChange={() => handleSettingChange('pushTeamUpdates')}
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': {
                          color: '#4caf50',
                        },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                          backgroundColor: '#4caf50',
                        },
                      }}
                    />
                  }
                  label={
                    <Typography variant="body2" sx={{ color: '#7b809a' }}>
                      Push notifications for team updates
                    </Typography>
                  }
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Notifications */}
        <Grid item xs={12}>
          <Card sx={{ boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', borderRadius: 3 }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#344767', mb: 3 }}>
                Recent Notifications
              </Typography>

              <List sx={{ p: 0 }}>
                {notifications.map((notification, index) => (
                  <ListItem 
                    key={notification.id}
                    sx={{ 
                      backgroundColor: notification.read ? 'transparent' : getNotificationColor(notification.type),
                      borderRadius: 2,
                      mb: 1,
                      border: '1px solid #e9ecef',
                      opacity: notification.read ? 0.7 : 1
                    }}
                  >
                    <ListItemIcon>
                      {getNotificationIcon(notification.type)}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#344767' }}>
                          {notification.title}
                        </Typography>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" sx={{ color: '#7b809a', mb: 0.5 }}>
                            {notification.message}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#7b809a' }}>
                            {notification.time}
                          </Typography>
                        </Box>
                      }
                    />
                    <IconButton size="small" sx={{ color: '#7b809a' }}>
                      <CloseIcon />
                    </IconButton>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Snackbars */}
      <Snackbar
        open={successSB}
        autoHideDuration={6000}
        onClose={() => setSuccessSB(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setSuccessSB(false)} 
          severity="success" 
          sx={{ 
            width: '100%',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            borderRadius: 2
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            Success! Your action was completed successfully.
          </Typography>
        </Alert>
      </Snackbar>

      <Snackbar
        open={infoSB}
        autoHideDuration={6000}
        onClose={() => setInfoSB(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setInfoSB(false)} 
          severity="info" 
          sx={{ 
            width: '100%',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            borderRadius: 2
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            Info: Here's some important information for you.
          </Typography>
        </Alert>
      </Snackbar>

      <Snackbar
        open={warningSB}
        autoHideDuration={6000}
        onClose={() => setWarningSB(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setWarningSB(false)} 
          severity="warning" 
          sx={{ 
            width: '100%',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            borderRadius: 2
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            Warning! Please pay attention to this message.
          </Typography>
        </Alert>
      </Snackbar>

      <Snackbar
        open={errorSB}
        autoHideDuration={6000}
        onClose={() => setErrorSB(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setErrorSB(false)} 
          severity="error" 
          sx={{ 
            width: '100%',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            borderRadius: 2
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            Error! Something went wrong. Please try again.
          </Typography>
        </Alert>
      </Snackbar>
    </Box>
  );
}