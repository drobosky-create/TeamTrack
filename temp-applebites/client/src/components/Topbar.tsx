import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Box, 
  IconButton, 
  Menu,
  MenuItem,
  Avatar,
  Breadcrumbs,
  Link
} from "@mui/material";
import { 
  Notifications as NotificationsIcon, 
  Settings as SettingsIcon,
  Menu as MenuIcon,
  AccountCircle
} from "@mui/icons-material";

const drawerWidth = 280;

export default function Topbar() {
  const [location] = useLocation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  
  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // Generate breadcrumbs from current path
  const pathSegments = location.split('/').filter(segment => segment);
  const breadcrumbItems = pathSegments.map((segment, index) => {
    const path = '/' + pathSegments.slice(0, index + 1).join('/');
    const label = segment.charAt(0).toUpperCase() + segment.slice(1).replace('-', ' ');
    return { label, path };
  });

  return (
    <AppBar 
      position="fixed" 
      elevation={0}
      sx={{ 
        width: `calc(100% - ${drawerWidth}px)`, 
        ml: `${drawerWidth}px`,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(20px)',
        color: '#344767',
        borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
      }}
    >
      <Toolbar sx={{ minHeight: '70px !important' }}>
        <Box sx={{ flexGrow: 1 }}>
          {/* Breadcrumbs */}
          {breadcrumbItems.length > 0 && (
            <Breadcrumbs
              sx={{ 
                fontSize: '0.875rem',
                color: '#67748e',
                '& .MuiBreadcrumbs-separator': {
                  color: '#67748e',
                }
              }}
            >
              <Link href="/" sx={{ color: '#67748e', textDecoration: 'none' }}>
                Dashboard
              </Link>
              {breadcrumbItems.map((item, index) => (
                <Typography 
                  key={index}
                  color={index === breadcrumbItems.length - 1 ? '#344767' : '#67748e'}
                  sx={{ fontWeight: index === breadcrumbItems.length - 1 ? 600 : 400 }}
                >
                  {item.label}
                </Typography>
              ))}
            </Breadcrumbs>
          )}
          
          {/* Page Title */}
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              color: '#344767',
              fontWeight: 700,
              fontSize: '1.125rem',
              mt: 0.5
            }}
          >
            {breadcrumbItems.length > 0 
              ? breadcrumbItems[breadcrumbItems.length - 1].label 
              : 'Dashboard'
            }
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Search Input Placeholder */}
          <Box sx={{ display: { xs: 'none', md: 'block' }, mr: 2 }}>
            {/* Material Dashboard search component would go here */}
          </Box>

          {/* Notifications */}
          <IconButton 
            size="small"
            sx={{ 
              color: '#67748e',
              '&:hover': { backgroundColor: 'rgba(52, 71, 103, 0.1)' }
            }}
          >
            <NotificationsIcon fontSize="small" />
          </IconButton>

          {/* Settings */}
          <IconButton 
            size="small"
            sx={{ 
              color: '#67748e',
              '&:hover': { backgroundColor: 'rgba(52, 71, 103, 0.1)' }
            }}
          >
            <SettingsIcon fontSize="small" />
          </IconButton>

          {/* User Menu */}
          <IconButton
            size="small"
            onClick={handleMenu}
            sx={{ 
              color: '#67748e',
              '&:hover': { backgroundColor: 'rgba(52, 71, 103, 0.1)' }
            }}
          >
            <AccountCircle />
          </IconButton>
          
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <MenuItem onClick={handleClose}>Profile</MenuItem>
            <MenuItem onClick={handleClose}>Settings</MenuItem>
            <MenuItem onClick={handleClose}>Logout</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}