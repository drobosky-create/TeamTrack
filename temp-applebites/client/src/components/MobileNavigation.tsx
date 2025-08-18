import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import {
  Box,
  Drawer,
  IconButton,
  AppBar,
  Toolbar,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Avatar,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  Dashboard,
  Assessment,
  TrendingUp,
  Analytics,
  Settings,
  LogoutOutlined,
  Person as User,
  Star as Crown
} from '@mui/icons-material';
import { useAuth } from '@/hooks/useAuth';
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock';

interface MobileNavigationProps {
  children: React.ReactNode;
}

const menuItems = [
  { text: 'Dashboard', path: '/dashboard', icon: <Dashboard /> },
  { text: 'New Assessment', path: '/assessment/free', icon: <Assessment /> },
  { text: 'Past Assessments', path: '/past-assessments', icon: <TrendingUp /> },
  { text: 'Value Calculator', path: '/value-calculator', icon: <Analytics /> },
  { text: 'Profile', path: '/profile', icon: <Settings /> },
];

export default function MobileNavigation({ children }: MobileNavigationProps) {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [location] = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user, isAuthenticated, logout } = useAuth();

  // Type guard for user object
  const typedUser = user as { firstName?: string; email?: string; tier?: string } | null;

  // Lock body scroll when mobile drawer is open
  useBodyScrollLock(mobileDrawerOpen && isMobile);

  const handleDrawerToggle = () => {
    setMobileDrawerOpen(!mobileDrawerOpen);
  };

  const handleDrawerClose = () => {
    setMobileDrawerOpen(false);
  };

  const handleLogout = () => {
    // Close the drawer first
    handleDrawerClose();
    // Use the proper logout function from useAuth hook which handles session cleanup and cache invalidation
    logout();
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'growth': return '#00718d';
      case 'capital': return '#4493de';
      default: return '#94A3B8';
    }
  };

  const getTierLabel = (tier: string) => {
    switch (tier) {
      case 'growth': return 'Growth';
      case 'capital': return 'Capital';
      default: return 'Free';
    }
  };

  // Mobile drawer content
  const drawerContent = (
    <Box sx={{ width: 280, height: '100%' }}>
      {/* Header */}
      <Box
        sx={{
          p: 2,
          background: 'linear-gradient(195deg, #0A1F44, #1C2D5A)',
          color: 'white',
          minHeight: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 0.5 }}>
            Apple Bites
          </Typography>
          <Typography variant="caption" sx={{ opacity: 0.8 }}>
            Business Valuation Platform
          </Typography>
        </Box>
        <IconButton
          onClick={handleDrawerClose}
          sx={{ color: 'white' }}
          aria-label="close drawer"
        >
          <CloseIcon />
        </IconButton>
      </Box>

      {/* User Profile Section */}
      {isAuthenticated && typedUser && (
        <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Avatar sx={{ bgcolor: '#00718d', mr: 1.5, width: 32, height: 32 }}>
              <User style={{ fontSize: 18 }} />
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 'medium', color: '#0A1F44' }}>
                {typedUser.firstName || typedUser.email}
              </Typography>
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 0.5,
                  px: 1,
                  py: 0.25,
                  borderRadius: 1,
                  bgcolor: getTierColor(typedUser.tier || 'free'),
                  color: 'white',
                  fontSize: '0.7rem',
                  fontWeight: 'medium'
                }}
              >
                <Crown style={{ fontSize: 12 }} />
                {getTierLabel(typedUser.tier || 'free')}
              </Box>
            </Box>
          </Box>
        </Box>
      )}

      {/* Navigation Menu */}
      <List sx={{ p: 1, flex: 1 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <Link href={item.path} style={{ width: '100%', textDecoration: 'none' }}>
              <ListItemButton
                selected={location === item.path}
                onClick={handleDrawerClose}
                sx={{
                  borderRadius: 1,
                  mx: 1,
                  mb: 0.5,
                  color: '#475569',
                  '&.Mui-selected': {
                    backgroundColor: '#e3f2fd',
                    color: '#00718d',
                    '&:hover': {
                      backgroundColor: '#e3f2fd',
                    },
                  },
                  '&:hover': {
                    backgroundColor: '#f5f5f5',
                  },
                }}
              >
                <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </Link>
          </ListItem>
        ))}
      </List>

      {/* Logout Button */}
      {isAuthenticated && (
        <>
          <Divider />
          <List sx={{ p: 1 }}>
            <ListItem disablePadding>
              <ListItemButton
                onClick={handleLogout}
                sx={{
                  borderRadius: 1,
                  mx: 1,
                  color: '#dc2626',
                  '&:hover': {
                    backgroundColor: '#fef2f2',
                  },
                }}
              >
                <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
                  <LogoutOutlined />
                </ListItemIcon>
                <ListItemText primary="Sign Out" />
              </ListItemButton>
            </ListItem>
          </List>
        </>
      )}
    </Box>
  );

  // Only show mobile navigation on mobile devices and when authenticated
  if (!isMobile || !isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Mobile App Bar */}
      <AppBar
        position="fixed"
        sx={{
          background: 'linear-gradient(195deg, #0A1F44, #1C2D5A)',
          zIndex: theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ color: 'white' }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" className="text-[#e9ecf2]" sx={{ flexGrow: 1, ml: 1 }}>
            Apple Bites
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        anchor="left"
        open={mobileDrawerOpen}
        onClose={handleDrawerClose}
        ModalProps={{
          keepMounted: true, // Better performance on mobile
          disableScrollLock: false, // Allow MUI to handle scroll lock
        }}
        PaperProps={{
          sx: {
            position: 'fixed',
            height: '100%',
            top: 0,
            zIndex: theme.zIndex.drawer + 2,
          }
        }}
        sx={{
          '& .MuiBackdrop-root': {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pt: 8, // Account for AppBar height
          minHeight: '100vh',
          // Block interaction when drawer is open
          pointerEvents: mobileDrawerOpen ? 'none' : 'auto',
        }}
        // Make content inert when drawer is open for accessibility
        {...(mobileDrawerOpen && { inert: '' })}
        aria-hidden={mobileDrawerOpen}
      >
        {children}
      </Box>
    </Box>
  );
}