import { Link } from 'wouter';
import MDBox from '../../../components/MD/MDBox';
import MDTypography from '../../../components/MD/MDTypography';
import MDButton from '../../../components/MD/MDButton';
import MDAvatar from '../../../components/MD/MDAvatar';
import { 
  User, 
  FileText, 
  Crown, 
  Clock, 
  BarChart3, 
  Plus,
  ExternalLink,
  LogOut,
  TrendingUp
} from 'lucide-react';

interface MobileDashboardProps {
  user: {
    name: string;
    email: string;
    tier: 'free' | 'growth' | 'capital';
  };
  onSignOut: () => void;
}

export default function MobileDashboard({ user, onSignOut }: MobileDashboardProps) {
  // Debug logging to confirm mobile dashboard is being rendered
  console.log('MobileDashboard component rendering for user:', user.name);
  
  // Apple Bites Brand Colors
  const colors = {
    primary: "#00718d",
    secondary: "#0A1F44", 
    accent: "#005b8c",
    grayLight: "#F7FAFC"
  };

  const gradients = {
    primary: "linear-gradient(135deg, #00718d 0%, #0A1F44 100%)",
    glow: "linear-gradient(135deg, #00718d 0%, #3B82F6 100%)"
  };

  const getTierLabel = (tier: string) => {
    switch (tier) {
      case 'free': return 'Free';
      case 'growth': return 'Growth';
      case 'capital': return 'Capital';
      default: return 'Free';
    }
  };

  const getTierGradient = (tier: string) => {
    switch (tier) {
      case 'free': return 'linear-gradient(135deg, #CBD5E1 0%, #94A3B8 100%)';
      case 'growth': return gradients.primary;
      case 'capital': return gradients.glow;
      default: return 'linear-gradient(135deg, #CBD5E1 0%, #94A3B8 100%)';
    }
  };

  return (
    <MDBox sx={{ 
      minHeight: '100vh',
      backgroundColor: '#f8f9fa',
      padding: 2
    }}>
      {/* Mobile Header */}
      <MDBox
        sx={{
          background: 'linear-gradient(135deg, #0A1F44 0%, #1C2D5A 100%)',
          borderRadius: 2,
          padding: 2,
          mb: 3,
          color: 'white'
        }}
      >
        <MDBox display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <MDBox display="flex" alignItems="center">
            <MDAvatar
              sx={{
                background: gradients.glow,
                width: 36,
                height: 36,
                mr: 1.5
              }}
            >
              <User size={18} color="white" />
            </MDAvatar>
            <MDBox>
              <MDTypography variant="body1" fontWeight="medium" sx={{ color: 'white', fontSize: '0.9rem' }}>
                {user.name}
              </MDTypography>
            </MDBox>
          </MDBox>
          
          <MDBox
            sx={{
              background: getTierGradient(user.tier),
              color: 'white',
              px: 1.5,
              py: 0.5,
              borderRadius: 2,
              fontSize: '0.65rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}
          >
            {getTierLabel(user.tier)}
          </MDBox>
        </MDBox>

        {/* Mobile Navigation */}
        <MDBox display="flex" gap={1} flexWrap="wrap">
          <Link href="/assessment/free">
            <MDButton
              sx={{
                background: gradients.glow,
                color: 'white',
                py: 0.8,
                px: 1.5,
                fontSize: '0.75rem',
                minWidth: 'auto',
                flex: '1'
              }}
              startIcon={<Plus size={14} />}
            >
              New
            </MDButton>
          </Link>

          {user.tier === 'free' && (
            <MDButton
              sx={{
                background: 'transparent',
                border: `1px solid ${colors.accent}`,
                color: colors.accent,
                py: 0.8,
                px: 1.5,
                fontSize: '0.75rem',
                minWidth: 'auto',
                flex: '1'
              }}
              startIcon={<Crown size={14} />}
              onClick={() => window.location.href = '/pricing'}
            >
              Upgrade
            </MDButton>
          )}

          <MDButton
            onClick={onSignOut}
            sx={{
              background: 'transparent',
              border: `1px solid #EF4444`,
              color: '#EF4444',
              py: 0.8,
              px: 1.5,
              fontSize: '0.75rem',
              minWidth: 'auto'
            }}
            startIcon={<LogOut size={14} />}
          >
            Out
          </MDButton>
        </MDBox>
      </MDBox>

      {/* Simple Mobile Content Cards */}
      <MDBox display="flex" flexDirection="column" gap={2}>
        {/* New Assessment Card */}
        <MDBox
          sx={{
            backgroundColor: 'white',
            borderRadius: 2,
            padding: 2,
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            minHeight: 120
          }}
        >
          <MDBox display="flex" alignItems="center" mb={1.5}>
            <MDBox
              sx={{
                backgroundColor: '#e3f2fd',
                borderRadius: '50%',
                width: 36,
                height: 36,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 1.5
              }}
            >
              <FileText size={20} color={colors.primary} />
            </MDBox>
            <MDTypography variant="h6" fontWeight="medium" fontSize="1rem">
              New Assessment
            </MDTypography>
          </MDBox>
          <MDTypography variant="body2" color="text" mb={2} fontSize="0.875rem">
            Create a business valuation assessment
          </MDTypography>
          <Link href="/assessment/free">
            <MDButton 
              sx={{
                background: gradients.primary,
                color: 'white',
                width: '100%',
                py: 1,
                fontSize: '0.75rem'
              }}
            >
              Get Started
            </MDButton>
          </Link>
        </MDBox>

        {/* Upgrade/Premium Card */}
        <MDBox
          sx={{
            backgroundColor: 'white',
            borderRadius: 2,
            padding: 2,
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            minHeight: 120
          }}
        >
          <MDBox display="flex" alignItems="center" mb={1.5}>
            <MDBox
              sx={{
                backgroundColor: user.tier === 'free' ? '#fff3e0' : '#e8f5e8',
                borderRadius: '50%',
                width: 36,
                height: 36,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 1.5
              }}
            >
              {user.tier === 'free' ? 
                <Crown size={20} color="#ff9800" /> : 
                <BarChart3 size={20} color="#4caf50" />
              }
            </MDBox>
            <MDTypography variant="h6" fontWeight="medium" fontSize="1rem">
              {user.tier === 'free' ? 'Upgrade Plan' : 'Premium'}
            </MDTypography>
          </MDBox>
          <MDTypography variant="body2" color="text" mb={2} fontSize="0.875rem">
            {user.tier === 'free' ? 
              'Unlock industry analysis & AI insights' :
              'Access premium analytics'
            }
          </MDTypography>
          {user.tier === 'free' ? (
            <MDButton 
              sx={{
                background: 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)',
                color: 'white',
                width: '100%',
                py: 1,
                fontSize: '0.75rem'
              }}
              onClick={() => window.open('https://products.applebites.ai/', '_blank')}
              endIcon={<ExternalLink size={14} />}
            >
              Upgrade Now
            </MDButton>
          ) : (
            <Link href="/value-calculator">
              <MDButton 
                variant="outlined" 
                sx={{
                  borderColor: '#4caf50',
                  color: '#4caf50',
                  width: '100%',
                  py: 1,
                  fontSize: '0.75rem'
                }}
              >
                View Tools
              </MDButton>
            </Link>
          )}
        </MDBox>

        {/* Quick Actions */}
        <MDBox
          sx={{
            backgroundColor: 'white',
            borderRadius: 2,
            padding: 2,
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
          }}
        >
          <MDTypography variant="h6" fontWeight="medium" mb={2} fontSize="1rem">
            Quick Actions
          </MDTypography>
          <MDBox display="flex" flexDirection="column" gap={1}>
            <Link href="/past-assessments">
              <MDButton
                variant="outlined"
                sx={{
                  justifyContent: 'flex-start',
                  width: '100%',
                  py: 1,
                  fontSize: '0.75rem',
                  borderColor: '#e0e0e0',
                  color: '#666'
                }}
                startIcon={<Clock size={16} />}
              >
                View Assessment History
              </MDButton>
            </Link>
            
            {user.tier !== 'free' && (
              <Link href="/value-calculator">
                <MDButton
                  variant="outlined"
                  sx={{
                    justifyContent: 'flex-start',
                    width: '100%',
                    py: 1,
                    fontSize: '0.75rem',
                    borderColor: '#e0e0e0',
                    color: '#666'
                  }}
                  startIcon={<TrendingUp size={16} />}
                >
                  Value Calculator
                </MDButton>
              </Link>
            )}
          </MDBox>
        </MDBox>
      </MDBox>
    </MDBox>
  );
}