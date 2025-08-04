import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Divider,
  Avatar,
  IconButton,
  Chip,
  Paper
} from '@mui/material';
import {
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  Instagram as InstagramIcon,
  Edit as EditIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { useAuth } from '@/hooks/useAuth';

// Profile Info Card Component
const ProfileInfoCard: React.FC<{
  title: string;
  description: string;
  info: Record<string, string>;
  social?: Array<{ link: string; icon: React.ReactNode; color: string }>;
}> = ({ title, description, info, social = [] }) => {
  return (
    <Card sx={{ height: '100%', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', borderRadius: 3 }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#344767', textTransform: 'capitalize' }}>
            {title}
          </Typography>
          <IconButton size="small" sx={{ color: '#344767' }}>
            <EditIcon />
          </IconButton>
        </Box>
        
        <Typography variant="body2" sx={{ color: '#7b809a', mb: 3, lineHeight: 1.6 }}>
          {description}
        </Typography>
        
        <Divider sx={{ my: 2 }} />
        
        <Box sx={{ mb: 3 }}>
          {Object.entries(info).map(([key, value]) => (
            <Box key={key} sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#344767', minWidth: 100, textTransform: 'capitalize' }}>
                {key.replace(/([A-Z])/g, ' $1').trim()}:
              </Typography>
              <Typography variant="body2" sx={{ color: '#7b809a', ml: 2 }}>
                {value}
              </Typography>
            </Box>
          ))}
        </Box>
        
        {social.length > 0 && (
          <Box sx={{ display: 'flex', gap: 1 }}>
            {social.map((item, index) => (
              <IconButton key={index} size="small" sx={{ color: `#${item.color}` }}>
                {item.icon}
              </IconButton>
            ))}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

// Platform Settings Card Component
const PlatformSettings: React.FC = () => {
  const settings = [
    { label: 'Account', checked: true },
    { label: 'Application', checked: false },
    { label: 'Product', checked: true },
    { label: 'Email', checked: false }
  ];

  return (
    <Card sx={{ height: '100%', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', borderRadius: 3 }}>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#344767', mb: 3 }}>
          Platform Settings
        </Typography>
        
        <Typography variant="h6" sx={{ fontSize: '0.875rem', fontWeight: 600, color: '#344767', mb: 2 }}>
          ACCOUNT
        </Typography>
        
        {settings.map((setting, index) => (
          <Box key={index} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="body2" sx={{ color: '#7b809a' }}>
              Email me when someone follows me
            </Typography>
            <Box
              sx={{
                width: 40,
                height: 20,
                borderRadius: 10,
                backgroundColor: setting.checked ? '#4caf50' : '#e0e0e0',
                position: 'relative',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              <Box
                sx={{
                  width: 16,
                  height: 16,
                  borderRadius: '50%',
                  backgroundColor: 'white',
                  position: 'absolute',
                  top: 2,
                  left: setting.checked ? 22 : 2,
                  transition: 'all 0.3s ease'
                }}
              />
            </Box>
          </Box>
        ))}
      </CardContent>
    </Card>
  );
};

// Profile Header Component
const ProfileHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  
  return (
    <Box sx={{ position: 'relative', mb: 4 }}>
      {/* Background Image */}
      <Box
        sx={{
          height: 300,
          background: 'linear-gradient(195deg, #66bb6a, #43a047)',
          borderRadius: 3,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.2)'
          }}
        />
      </Box>
      
      {/* Profile Info */}
      <Card
        sx={{
          position: 'absolute',
          bottom: -50,
          left: 24,
          right: 24,
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          borderRadius: 3
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 3 }}>
            <Avatar
              sx={{
                width: 100,
                height: 100,
                border: '4px solid white',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
              src={user?.profileImageUrl}
            >
              <PersonIcon sx={{ fontSize: 50 }} />
            </Avatar>
            
            <Box sx={{ flex: 1, pb: 1 }}>
              <Typography variant="h5" sx={{ fontWeight: 700, color: '#344767', mb: 0.5 }}>
                {user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : user?.email?.split('@')[0] || 'User'}
              </Typography>
              <Typography variant="body2" sx={{ color: '#7b809a', mb: 2 }}>
                Performance Team Member
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Chip label="Team Member" size="small" sx={{ backgroundColor: '#e8f5e8', color: '#4caf50' }} />
                <Chip label="Active" size="small" sx={{ backgroundColor: '#e3f2fd', color: '#2196f3' }} />
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>
      
      {/* Content */}
      <Box sx={{ mt: 8 }}>
        {children}
      </Box>
    </Box>
  );
};

export default function Profile() {
  const { user } = useAuth();

  return (
    <Box>
      <ProfileHeader>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} xl={4}>
            <PlatformSettings />
          </Grid>
          
          <Grid item xs={12} md={6} xl={4}>
            <ProfileInfoCard
              title="Profile Information"
              description="Hi, I'm a dedicated team member focused on achieving excellence in performance reviews and continuous improvement. I believe in transparent communication and collaborative growth."
              info={{
                fullName: user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : 'Not specified',
                email: user?.email || 'Not specified',
                location: 'Remote',
                department: 'Performance Team'
              }}
              social={[
                {
                  link: '#',
                  icon: <FacebookIcon />,
                  color: '3b5998'
                },
                {
                  link: '#',
                  icon: <TwitterIcon />,
                  color: '1da1f2'
                },
                {
                  link: '#',
                  icon: <InstagramIcon />,
                  color: 'e4405f'
                }
              ]}
            />
          </Grid>
          
          <Grid item xs={12} xl={4}>
            <Card sx={{ height: '100%', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', borderRadius: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#344767', mb: 3 }}>
                  Recent Activity
                </Typography>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {[
                    { action: 'Completed Q4 Review', time: '2 hours ago' },
                    { action: 'Updated Goals', time: '1 day ago' },
                    { action: 'Submitted Self Assessment', time: '3 days ago' },
                    { action: 'Attended Team Meeting', time: '1 week ago' }
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
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#344767' }}>
                          {activity.action}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#7b809a' }}>
                          {activity.time}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </ProfileHeader>
    </Box>
  );
}