import { 
  Drawer, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
  Box, 
  Typography,
  Divider,
  useTheme,
  useMediaQuery
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  Assessment as AssessmentIcon,
  Analytics as AnalyticsIcon,
  People as PeopleIcon,
  TrendingUp as TrendingUpIcon
} from "@mui/icons-material";
import { useLocation } from "wouter";

const drawerWidth = 280;

const menuItems = [
  { text: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" },
  { text: "Free Assessment", icon: <AssessmentIcon />, path: "/assessment/free" },
  { text: "Growth Assessment", icon: <TrendingUpIcon />, path: "/assessment/paid" },
  { text: "Value Calculator", icon: <AnalyticsIcon />, path: "/value-calculator" },
  { text: "Team Management", icon: <PeopleIcon />, path: "/team" },
];

export default function Sidebar() {
  const [location] = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Hide sidebar on mobile devices
  if (isMobile) {
    return null;
  }

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        display: { xs: 'none', md: 'block' }, // Hide on mobile, show on desktop
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          background: 'linear-gradient(195deg, #42424a, #191919)',
          color: 'white',
          borderRight: 'none',
        },
      }}
    >
      {/* Logo Section */}
      <Box sx={{ 
        p: 3, 
        textAlign: 'center',
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <Typography 
          variant="h5" 
          sx={{ 
            color: 'white', 
            fontWeight: 'bold',
            background: 'linear-gradient(45deg, #005b8c, #4493de)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
        >
          Apple Bites
        </Typography>
        <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
          Business Valuation Platform
        </Typography>
      </Box>

      <Box sx={{ flex: 1, p: 2 }}>
        <List sx={{ p: 0 }}>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                selected={location === item.path}
                sx={{
                  borderRadius: 2,
                  minHeight: 48,
                  color: 'rgba(255, 255, 255, 0.8)',
                  '&.Mui-selected': {
                    background: 'linear-gradient(195deg, #005b8c, #4493de)',
                    color: 'white',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                    '&:hover': {
                      background: 'linear-gradient(195deg, #005b8c, #4493de)',
                    },
                  },
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                <ListItemIcon 
                  sx={{ 
                    color: 'inherit',
                    minWidth: 40,
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text}
                  primaryTypographyProps={{
                    fontSize: '0.875rem',
                    fontWeight: 500,
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Footer */}
      <Box sx={{ p: 2, borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
          © 2025 Meritage Partners
        </Typography>
      </Box>
    </Drawer>
  );
}