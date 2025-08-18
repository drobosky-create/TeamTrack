import React, { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { useAuth } from '@/hooks/useAuth';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import MDBox from '@/components/MD/MDBox';
import MDTypography from '@/components/MD/MDTypography';
import MDButton from '@/components/MD/MDButton';
import { TextField } from '@mui/material';
import { ArrowLeft, User, Phone, LogOut } from 'lucide-react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import { Switch, styled } from '@mui/material';

// Custom Navy Switch component with persistent styling
const NavySwitch = styled(Switch)(({ theme }) => ({
  '& .MuiSwitch-switchBase.Mui-checked': {
    color: '#0A1F44 !important',
    '&:hover': {
      backgroundColor: 'rgba(10, 31, 68, 0.04) !important',
    },
  },
  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
    backgroundColor: '#0A1F44 !important',
  },
  '& .MuiSwitch-track': {
    backgroundColor: '#D1D5DB !important',
  },
  '& .MuiSwitch-thumb': {
    color: '#ffffff !important',
  },
  '& .MuiSwitch-switchBase': {
    '&:not(.Mui-checked)': {
      color: '#ffffff !important',
    }
  }
}));

interface ProfileData {
  name: string;
  email: string;
  phone: string;
  title: string;
  company: string;
  about: string;
  facebook: string;
  twitter: string;
  instagram: string;
  linkedin: string;
  // Notification preferences
  emailResults: boolean;
  textResults: boolean;
  monthlyWebinars: boolean;
  marketUpdates: boolean;
  newFeatures: boolean;
}

export default function ProfilePage() {
  const { user, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const [editMode, setEditMode] = useState(false);
  
  // Show demo profile for non-authenticated users
  const isDemoMode = !isAuthenticated;
  
  const [profile, setProfile] = useState<ProfileData>({
    name: 'Daniel Robosky',
    email: 'daniel@applebites.ai',
    phone: '(555) 123-4567',
    title: 'Director of Operations',
    company: 'Meritage Partners',
    about: "I'm like Thanos: decisive. If you can't decide, the answer is no. The equally difficult path, the more painful one in the short term — that's usually the right one.",
    facebook: '',
    twitter: '',
    instagram: '',
    linkedin: '',
    // Notification preferences
    emailResults: true,
    textResults: false,
    monthlyWebinars: true,
    marketUpdates: false,
    newFeatures: true,
  });

  // Initialize profile data from user when available
  useEffect(() => {
    if (user) {
      setProfile(prev => ({
        ...prev,
        name: `${(user as any).firstName || ''} ${(user as any).lastName || ''}`.trim() || prev.name,
        email: (user as any).email || prev.email,
        phone: (user as any).phone || prev.phone,
        title: (user as any).jobTitle || prev.title,
        company: (user as any).company || prev.company,
      }));
    }
  }, [user]);

  const updateProfileMutation = useMutation({
    mutationFn: async (data: Partial<ProfileData>) => {
      const response = await apiRequest('PUT', '/api/profile', data);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      return result;
    },
    onSuccess: (data) => {
      console.log('Profile updated successfully:', data);
      queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
      setEditMode(false);
    },
    onError: (error) => {
      console.error('Failed to update profile:', error);
    }
  });

  const handleChange = (field: string, value: string | boolean) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (isDemoMode && editMode) {
      // In demo mode, just show success and exit edit mode
      console.log('Demo mode: Profile changes saved locally');
      setEditMode(false);
    } else if (editMode) {
      updateProfileMutation.mutate(profile);
    } else {
      setEditMode(true);
    }
  };

  const handleSignOut = async () => {
    try {
      // Try multiple logout endpoints for compatibility
      await fetch('/api/logout', { credentials: 'include' });
      await fetch('/api/users/logout', { method: 'POST', credentials: 'include' });
      
      // Invalidate queries and redirect
      queryClient.clear();
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
      // Even if logout fails, clear local state and redirect
      queryClient.clear();
      window.location.href = '/';
    }
  };

  // Demo mode - show profile interface even without authentication
  // if (!isAuthenticated) {
  //   return (
  //     <MDBox 
  //       display="flex" 
  //       justifyContent="center" 
  //       alignItems="center" 
  //       minHeight="100vh"
  //       sx={{ backgroundColor: '#F7FAFC' }}
  //     >
  //       <MDTypography variant="h6" color="text">
  //         Please log in to view your profile
  //       </MDTypography>
  //     </MDBox>
  //   );
  // }

  return (
    <MDBox sx={{ backgroundColor: '#F7FAFC', minHeight: '100vh', py: 4 }}>
      <MDBox sx={{ maxWidth: '1024px', mx: 'auto', px: 3 }}>
        {/* Header */}
        <MDBox 
          display="flex" 
          justifyContent="space-between" 
          alignItems="center" 
          mb={3}
          sx={{
            flexDirection: { xs: 'column', sm: 'row' },
            gap: { xs: 2, sm: 0 }
          }}
        >
          <MDBox display="flex" alignItems="center">
            <Link href="/dashboard">
              <MDButton
                sx={{
                  background: 'transparent',
                  color: '#0A1F44',
                  minWidth: 'auto',
                  p: 1,
                  mr: 2,
                  '&:hover': {
                    background: 'rgba(0, 191, 166, 0.1)'
                  }
                }}
              >
                <ArrowLeft size={20} />
              </MDButton>
            </Link>
            <MDTypography variant="h4" fontWeight="bold" sx={{ color: '#111827' }}>
              Profile
            </MDTypography>
          </MDBox>
          <MDBox sx={{ display: 'flex', gap: 2 }}>
            <MDButton
              onClick={handleSignOut}
              sx={{
                px: 2,
                py: 1,
                background: 'transparent',
                color: '#EF4444',
                border: '1px solid #EF4444',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                '&:hover': {
                  background: 'rgba(239, 68, 68, 0.1)',
                  borderColor: '#DC2626'
                }
              }}
            >
              <LogOut size={16} />
              Sign Out
            </MDButton>
            <MDButton
              onClick={handleSave}
              disabled={updateProfileMutation.isPending}
              className="text-[#ffffff]"
              sx={{
                px: 2,
                py: 1,
                background: 'linear-gradient(to right, #00B4AA, #002E4D)',
                color: '#F9FAFB',
                borderRadius: '6px',
                '&:hover': {
                  background: 'linear-gradient(to right, #008E88, #001C2F)'
                },
                '&:disabled': {
                  opacity: 0.6
                }
              }}
            >
              {updateProfileMutation.isPending ? 'Saving...' : editMode ? 'Save' : 'Edit Profile'}
            </MDButton>
          </MDBox>
        </MDBox>

        {/* Avatar Section */}
        <MDBox 
          display="flex" 
          alignItems="center" 
          mb={3}
          sx={{
            flexDirection: { xs: 'column', sm: 'row' },
            textAlign: { xs: 'center', sm: 'left' }
          }}
        >
          <MDBox
            sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              border: '1px solid white',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              background: 'linear-gradient(135deg, #00718d 0%, #005b8c 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mr: 2
            }}
          >
            <User size={40} color="white" />
          </MDBox>
          <MDBox sx={{ ml: { xs: 0, sm: 2 }, mt: { xs: 2, sm: 0 } }}>
            <MDTypography variant="h5" fontWeight="bold" sx={{ color: '#1F2937' }}>
              {profile.name}
            </MDTypography>
            <MDTypography variant="body1" sx={{ color: '#6B7280' }}>
              {profile.title}
            </MDTypography>
            <MDTypography variant="body2" sx={{ color: '#9CA3AF' }}>
              {profile.company}
            </MDTypography>
          </MDBox>
        </MDBox>

        {/* Two Row Layout */}
        <MDBox>
          {/* First Row - Profile Information */}
          <MDBox mb={6}>
            <MDTypography 
              variant="h6" 
              fontWeight="bold" 
              sx={{ color: '#111827', mb: 3 }}
            >
              Profile Information
            </MDTypography>
            
            <MDBox sx={{ space: 2 }}>
              {['name', 'email', 'phone', 'title', 'company'].map((field) => (
                <MDBox key={field} mb={2}>
                  <MDTypography 
                    variant="body2" 
                    fontWeight="medium" 
                    sx={{ color: '#374151', textTransform: 'capitalize', mb: 0.5 }}
                  >
                    {field}
                  </MDTypography>
                  <TextField
                    type={field === 'email' ? 'email' : field === 'phone' ? 'tel' : 'text'}
                    value={profile[field as keyof ProfileData]}
                    onChange={(e: any) => handleChange(field, e.target.value)}
                    disabled={!editMode}
                    fullWidth
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: 'white',
                        border: editMode ? '1px solid #D1D5DB' : '1px solid transparent',
                        borderRadius: '6px',
                        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                        '&:focus-within': {
                          outline: editMode ? '2px solid #00B4AA' : 'none',
                          outlineOffset: '2px'
                        },
                        '& .MuiOutlinedInput-notchedOutline': {
                          border: 'none'
                        }
                      }
                    }}
                  />
                </MDBox>
              ))}

              <MDBox mb={2}>
                <MDTypography 
                  variant="body2" 
                  fontWeight="500" 
                  sx={{ color: '#374151', mb: 0.5 }}
                >
                  About
                </MDTypography>
                <TextField
                  multiline
                  rows={4}
                  value={profile.about}
                  onChange={(e: any) => handleChange('about', e.target.value)}
                  disabled={!editMode}
                  fullWidth
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'white',
                      border: editMode ? '1px solid #D1D5DB' : '1px solid transparent',
                      borderRadius: '6px',
                      boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                      '&:focus-within': {
                        outline: editMode ? '2px solid #00B4AA' : 'none',
                        outlineOffset: '2px'
                      },
                      '& .MuiOutlinedInput-notchedOutline': {
                        border: 'none'
                      }
                    }
                  }}
                />
              </MDBox>

              {/* Social Links */}
              <MDBox mt={3}>
                <MDTypography 
                  variant="h6" 
                  fontWeight="bold" 
                  sx={{ color: '#111827', mb: 2 }}
                >
                  Social Links
                </MDTypography>
                <MDBox 
                  display="grid" 
                  gridTemplateColumns={{ xs: '1fr', sm: 'repeat(2, 1fr)' }} 
                  gap={2}
                >
                  {[
                    { key: 'facebook', label: 'Facebook', icon: FaFacebook, color: '#1877F2' },
                    { key: 'twitter', label: 'X (Twitter)', icon: FaTwitter, color: '#000000' },
                    { key: 'instagram', label: 'Instagram', icon: FaInstagram, color: '#E4405F' },
                    { key: 'linkedin', label: 'LinkedIn', icon: FaLinkedin, color: '#0A66C2' }
                  ].map((social) => (
                    <MDBox key={social.key}>
                      <MDTypography 
                        variant="body2" 
                        fontWeight="medium" 
                        sx={{ 
                          color: '#374151', 
                          mb: 0.5,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1
                        }}
                      >
                        <social.icon size={16} style={{ color: social.color }} />
                        {social.label}
                      </MDTypography>
                      <TextField
                        type="url"
                        value={profile[social.key as keyof ProfileData]}
                        onChange={(e: any) => handleChange(social.key, e.target.value)}
                        disabled={!editMode}
                        fullWidth
                        variant="outlined"
                        placeholder={
                          social.key === 'facebook' ? 'https://facebook.com/yourprofile' :
                          social.key === 'twitter' ? 'https://x.com/yourhandle' :
                          social.key === 'instagram' ? 'https://instagram.com/yourprofile' :
                          social.key === 'linkedin' ? 'https://linkedin.com/in/yourprofile' : ''
                        }
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            backgroundColor: 'white',
                            border: editMode ? '1px solid #D1D5DB' : '1px solid transparent',
                            borderRadius: '6px',
                            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                            '&:focus-within': {
                              outline: editMode ? '2px solid #00B4AA' : 'none',
                              outlineOffset: '2px'
                            },
                            '& .MuiOutlinedInput-notchedOutline': {
                              border: 'none'
                            }
                          }
                        }}
                      />
                    </MDBox>
                  ))}
                </MDBox>
              </MDBox>
            </MDBox>
          </MDBox>

          {/* Second Row - Notification Preferences */}
          <MDBox>
            <MDTypography 
              variant="h6" 
              fontWeight="bold" 
              sx={{ color: '#111827', mb: 3 }}
            >
              Notification Preferences
            </MDTypography>
            
            <MDBox sx={{ space: 2 }}>
              {[
                { 
                  key: 'emailResults', 
                  label: 'Email me valuation results',
                  description: 'Receive completed assessment reports via email'
                },
                { 
                  key: 'textResults', 
                  label: 'Text me when results are ready',
                  description: 'Get SMS notifications when your valuation is complete'
                },
                { 
                  key: 'monthlyWebinars', 
                  label: 'Monthly webinar invitations',
                  description: 'Business growth and valuation strategy webinars'
                },
                { 
                  key: 'marketUpdates', 
                  label: 'Market insight updates',
                  description: 'Industry trends and valuation market reports'
                },
                { 
                  key: 'newFeatures', 
                  label: 'New feature announcements',
                  description: 'Platform updates and new assessment tools'
                }
              ].map((setting) => (
                <MDBox 
                  key={setting.key} 
                  display="flex" 
                  justifyContent="space-between" 
                  alignItems="center"
                  py={2}
                  sx={{
                    borderBottom: '1px solid #F3F4F6',
                    '&:last-child': {
                      borderBottom: 'none'
                    }
                  }}
                >
                  <MDBox flex={1}>
                    <MDTypography 
                      variant="body1" 
                      fontWeight="medium"
                      sx={{ color: '#111827', mb: 0.5 }}
                    >
                      {setting.label}
                    </MDTypography>
                    <MDTypography 
                      variant="body2"
                      sx={{ color: '#6B7280' }}
                    >
                      {setting.description}
                    </MDTypography>
                  </MDBox>
                  <NavySwitch
                    checked={profile[setting.key as keyof ProfileData] as boolean}
                    onChange={(e) => handleChange(setting.key, e.target.checked)}
                    disabled={!editMode}
                  />
                </MDBox>
              ))}
            </MDBox>
          </MDBox>
        </MDBox>
      </MDBox>
    </MDBox>
  );
}