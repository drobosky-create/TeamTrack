import React, { useState, useMemo } from 'react';
import { Link } from 'wouter';
import { useAuth } from '@/hooks/useAuth';
import MDBox from '@/components/MD/MDBox';
import MDTypography from '@/components/MD/MDTypography';
import MDButton from '@/components/MD/MDButton';
import MDAvatar from '@/components/MD/MDAvatar';
import MobileDashboard from '@/components/MobileDashboard';
import { 
  User, 
  FileText, 
  Crown, 
  Clock, 
  BarChart3, 
  Plus,
  ExternalLink,
  Eye,
  Calendar,
  LogOut,
  Check,
  Lock,
  Star,
  TrendingUp,
  Search,
  Filter,
  X
} from 'lucide-react';
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, Typography, Chip, TextField, InputAdornment, Menu, MenuItem, Box } from '@mui/material';
import { useTheme, useMediaQuery } from '@mui/material';

interface DashboardUser {
  id?: string;
  email: string;
  tier: 'free' | 'growth' | 'capital';
  firstName?: string;
  lastName?: string;
  name?: string; // For backwards compatibility with mock data
  authProvider?: string;
}

interface Assessment {
  id: number;
  firstName: string;
  lastName: string;
  company: string;
  email: string;
  adjustedEbitda: string;
  midEstimate: string;
  lowEstimate: string;
  highEstimate: string;
  valuationMultiple: string;
  overallScore: string;
  tier: string;
  reportTier: string;
  createdAt: string;
  pdfUrl?: string;
  isProcessed: boolean;
  executiveSummary?: string;
}

// Remove mock user data - will use real auth data only

// Past Assessments Component
function PastAssessmentsSection() {
  const { data: assessments, isLoading } = useQuery<Assessment[]>({
    queryKey: ['/api/assessments'],
  });

  // Search and filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAnchor, setFilterAnchor] = useState<null | HTMLElement>(null);
  const [gradeFilter, setGradeFilter] = useState<string>('');
  const [tierFilter, setTierFilter] = useState<string>('');

  // Filter assessments based on search and filters
  const filteredAssessments = useMemo(() => {
    if (!assessments) return [];
    
    return assessments.filter(assessment => {
      // Text search
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = !searchTerm || 
        assessment.company?.toLowerCase().includes(searchLower) ||
        `${assessment.firstName} ${assessment.lastName}`.toLowerCase().includes(searchLower) ||
        assessment.email?.toLowerCase().includes(searchLower);
      
      // Grade filter
      const matchesGrade = !gradeFilter || assessment.overallScore === gradeFilter;
      
      // Tier filter
      const matchesTier = !tierFilter || assessment.tier === tierFilter;
      
      return matchesSearch && matchesGrade && matchesTier;
    });
  }, [assessments, searchTerm, gradeFilter, tierFilter]);

  const clearFilters = () => {
    setSearchTerm('');
    setGradeFilter('');
    setTierFilter('');
    setFilterAnchor(null);
  };

  const formatCurrency = (value: string | null) => {
    if (!value) return "$0";
    const numValue = parseFloat(value);
    
    if (numValue >= 1000000) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
        notation: 'compact',
        compactDisplay: 'short'
      }).format(numValue);
    } else {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(numValue);
    }
  };

  const formatDate = (dateString: string | Date) => {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case "A": return "#4CAF50";
      case "B": return "#8BC34A";
      case "C": return "#FF9800";
      case "D": return "#FF5722";
      case "F": return "#F44336";
      default: return "#9E9E9E";
    }
  };

  if (isLoading) {
    return (
      <Card sx={{ p: 4, textAlign: 'center' }}>
        <MDTypography variant="body2" color="text">
          Loading recent assessments...
        </MDTypography>
      </Card>
    );
  }

  if (!assessments || assessments.length === 0) {
    return (
      <Card sx={{ p: 4, textAlign: 'center' }}>
        <FileText size={48} color="#9CA3AF" style={{ marginBottom: 16 }} />
        <MDTypography variant="h6" fontWeight="medium" color="text" mb={1}>
          No Assessments Yet
        </MDTypography>
        <MDTypography variant="body2" color="text" mb={3}>
          Complete your first business valuation to see results here
        </MDTypography>
        <Link href="/assessment/free">
          <MDButton
            sx={{
              background: 'linear-gradient(135deg, #00718d 0%, #0A1F44 100%)',
              color: 'white',
              py: 1.5,
              px: 3
            }}
            startIcon={<Plus size={18} />}
          >
            Start First Assessment
          </MDButton>
        </Link>
      </Card>
    );
  }

  const hasActiveFilters = searchTerm || gradeFilter || tierFilter;
  const displayAssessments = filteredAssessments.slice(0, 3);

  return (
    <MDBox display="flex" flexDirection="column" gap={2}>
      {/* Search and Filter Controls */}
      <MDBox display="flex" gap={2} mb={2}>
        <TextField
          variant="outlined"
          size="small"
          placeholder="Search assessments..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search size={20} color="#9CA3AF" />
              </InputAdornment>
            ),
            endAdornment: searchTerm && (
              <InputAdornment position="end">
                <X 
                  size={16} 
                  color="#9CA3AF" 
                  style={{ cursor: 'pointer' }}
                  onClick={() => setSearchTerm('')}
                />
              </InputAdornment>
            )
          }}
          sx={{
            flexGrow: 1,
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              backgroundColor: '#F9FAFB',
              '&:hover': { backgroundColor: '#F3F4F6' }
            }
          }}
        />
        <MDButton
          onClick={(e) => setFilterAnchor(e.currentTarget)}
          sx={{
            minWidth: 'auto',
            p: 1.5,
            backgroundColor: hasActiveFilters ? '#00718d' : '#F9FAFB',
            color: hasActiveFilters ? 'white' : '#6B7280',
            border: '1px solid #E5E7EB',
            '&:hover': {
              backgroundColor: hasActiveFilters ? '#005f73' : '#F3F4F6'
            }
          }}
        >
          <Filter size={18} />
        </MDButton>
        
        {/* Filter Menu */}
        <Menu
          anchorEl={filterAnchor}
          open={Boolean(filterAnchor)}
          onClose={() => setFilterAnchor(null)}
          sx={{ mt: 1 }}
        >
          <Box sx={{ p: 2, minWidth: 200 }}>
            <MDTypography variant="subtitle2" fontWeight="medium" mb={2}>
              Filter by Grade
            </MDTypography>
            {['', 'A', 'B', 'C', 'D', 'F'].map(grade => (
              <MenuItem 
                key={grade}
                onClick={() => setGradeFilter(grade)}
                selected={gradeFilter === grade}
                sx={{ px: 1, py: 0.5, borderRadius: 1, mb: 0.5 }}
              >
                {grade || 'All Grades'}
              </MenuItem>
            ))}
            
            <MDTypography variant="subtitle2" fontWeight="medium" mt={2} mb={2}>
              Filter by Tier
            </MDTypography>
            {['', 'free', 'growth', 'capital'].map(tier => (
              <MenuItem 
                key={tier}
                onClick={() => setTierFilter(tier)}
                selected={tierFilter === tier}
                sx={{ px: 1, py: 0.5, borderRadius: 1, mb: 0.5 }}
              >
                {tier ? tier.charAt(0).toUpperCase() + tier.slice(1) : 'All Tiers'}
              </MenuItem>
            ))}
            
            {hasActiveFilters && (
              <MDButton
                onClick={clearFilters}
                sx={{
                  mt: 2,
                  width: '100%',
                  backgroundColor: '#F3F4F6',
                  color: '#6B7280',
                  '&:hover': { backgroundColor: '#E5E7EB' }
                }}
              >
                Clear All Filters
              </MDButton>
            )}
          </Box>
        </Menu>
      </MDBox>

      {/* Results Summary */}
      {hasActiveFilters && (
        <MDBox mb={2}>
          <MDTypography variant="body2" color="text" sx={{ opacity: 0.7 }}>
            Showing {filteredAssessments.length} of {assessments.length} assessments
            {(gradeFilter || tierFilter || searchTerm) && ' • '}
            {searchTerm && `Searching for "${searchTerm}"`}
            {gradeFilter && ` • Grade ${gradeFilter}`}
            {tierFilter && ` • ${tierFilter.charAt(0).toUpperCase() + tierFilter.slice(1)} tier`}
          </MDTypography>
        </MDBox>
      )}

      {/* No Results Message */}
      {filteredAssessments.length === 0 && assessments.length > 0 && (
        <Card sx={{ p: 4, textAlign: 'center' }}>
          <Search size={48} color="#9CA3AF" style={{ marginBottom: 16 }} />
          <MDTypography variant="h6" fontWeight="medium" color="text" mb={1}>
            No matching assessments
          </MDTypography>
          <MDTypography variant="body2" color="text" mb={3}>
            Try adjusting your search terms or filters
          </MDTypography>
          <MDButton
            onClick={clearFilters}
            sx={{
              backgroundColor: '#F3F4F6',
              color: '#6B7280',
              '&:hover': { backgroundColor: '#E5E7EB' }
            }}
          >
            Clear Filters
          </MDButton>
        </Card>
      )}

      {/* Assessment Cards */}
      {displayAssessments.map((assessment) => (
        <Card key={assessment.id} sx={{ p: 3, border: '1px solid #E5E7EB' }}>
          <MDBox display="flex" justifyContent="space-between" alignItems="center">
            <MDBox display="flex" alignItems="center" gap={2}>
              <MDBox
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 2,
                  background: `linear-gradient(135deg, ${getGradeColor(assessment.overallScore)} 20%, ${getGradeColor(assessment.overallScore)}40 100%)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <MDTypography variant="h5" fontWeight="bold" sx={{ color: 'white' }}>
                  {assessment.overallScore}
                </MDTypography>
              </MDBox>
              <MDBox>
                <MDTypography variant="h6" fontWeight="medium" color="text">
                  {assessment.company || `${assessment.firstName} ${assessment.lastName}`}
                </MDTypography>
                <MDTypography variant="body2" color="text" sx={{ opacity: 0.7 }}>
                  {formatDate(assessment.createdAt)} • {formatCurrency(assessment.midEstimate)} valuation
                </MDTypography>
              </MDBox>
            </MDBox>
            <MDBox display="flex" alignItems="center" gap={1}>
              <Chip 
                label={assessment.tier.toUpperCase()} 
                size="small" 
                sx={{ 
                  backgroundColor: assessment.tier === 'free' ? '#E5E7EB' : '#00718d',
                  color: assessment.tier === 'free' ? '#6B7280' : 'white',
                  fontSize: '0.75rem'
                }} 
              />
              <Link href={`/assessment-results/${assessment.id}`}>
                <MDButton
                  sx={{
                    minWidth: 'auto',
                    p: 1,
                    color: '#6B7280',
                    '&:hover': { color: '#00718d' }
                  }}
                >
                  <Eye size={16} />
                </MDButton>
              </Link>
            </MDBox>
          </MDBox>
        </Card>
      ))}
      
      {filteredAssessments.length > 3 && (
        <Link href="/past-assessments">
          <MDButton
            sx={{
              background: 'transparent',
              border: '1px solid #D1D5DB',
              color: '#6B7280',
              py: 1.5,
              width: '100%',
              '&:hover': {
                background: '#F9FAFB',
                borderColor: '#00718d',
                color: '#00718d'
              }
            }}
            startIcon={<BarChart3 size={18} />}
          >
            View All Assessments ({hasActiveFilters ? filteredAssessments.length : assessments.length})
          </MDButton>
        </Link>
      )}
    </MDBox>
  );
}

// Responsive Dashboard with Mobile/Desktop Views
export default function Dashboard() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const queryClient = useQueryClient();
  // Temporarily disable mobile detection to test dashboard
  const isMobile = false;

  // Fetch assessments data for dashboard metrics
  const { data: assessments = [] } = useQuery<Assessment[]>({
    queryKey: ['/api/assessments'],
  });
  
  // Debug logging
  console.log('Dashboard - isLoading:', isLoading, 'isAuthenticated:', isAuthenticated, 'user:', user);

  // Show loading state while authentication is being checked
  if (isLoading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        backgroundColor: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div>Loading dashboard...</div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated || !user) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        backgroundColor: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '16px'
      }}>
        <div>Please log in to access your dashboard</div>
        <Link href="/login">
          <MDButton variant="gradient" color="info">
            Go to Login
          </MDButton>
        </Link>
      </div>
    );
  }
  
  // Use actual user data only - no mock fallback
  const displayUser = user as DashboardUser;

  const handleSignOut = () => {
    logout(); // Use the logout function from useAuth
  };

  // Mobile uses the unified mobile navigation wrapper, so we continue with the desktop layout
  // The MobileNavigation component handles showing/hiding content on mobile
  // No need for separate mobile dashboard component
  
  console.log('Rendering Desktop dashboard');

  // Desktop version with clean layout (no problematic sidebar)
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

  // Calculate dashboard metrics from assessments
  const totalAssessments = assessments.length;
  
  // Get latest valuation (most recent assessment)
  const latestAssessment = assessments.length > 0 ? 
    assessments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0] : 
    null;
  
  const latestValuation = latestAssessment?.midEstimate ? 
    parseFloat(latestAssessment.midEstimate) : 0;

  // Format currency helper function  
  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
        notation: 'compact',
        compactDisplay: 'short'
      }).format(value);
    } else {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(value);
    }
  };

  // Desktop Layout with Sidebar
  return (
    <MDBox sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      {/* Sidebar - Hidden on mobile */}
      <MDBox
        sx={{
          width: 280,
          background: 'linear-gradient(135deg, #0A1F44 0%, #1C2D5A 100%)',
          color: 'white',
          display: { xs: 'none', md: 'flex' }, // Hide on mobile, show on desktop
          flexDirection: 'column',
          position: 'fixed',
          height: '100vh',
          overflowY: 'auto'
        }}
      >
        {/* Logo Section */}
        <MDBox sx={{ p: 3, textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <img
            src="/assets/logos/apple-bites-meritage-logo.png"
            alt="Apple Bites Business Assessment"
            style={{
              width: '80%',
              maxWidth: 200,
              height: 'auto',
              marginBottom: 16
            }}
          />
          <MDTypography variant="h6" sx={{ color: '#81e5d8', fontWeight: 300 }}>
            Business Valuation Platform
          </MDTypography>
        </MDBox>

        {/* User Info */}
        <MDBox sx={{ p: 3, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <MDBox display="flex" alignItems="center" mb={2}>
            <MDAvatar
              sx={{
                background: gradients.glow,
                width: 48,
                height: 48,
                mr: 2
              }}
            >
              <User size={20} color="white" />
            </MDAvatar>
            <MDBox>
              <MDTypography variant="body2" sx={{ color: 'white', fontWeight: 500 }}>
                {displayUser.firstName || displayUser.name?.split(' ')[0] || 'User'}
              </MDTypography>
              <MDTypography variant="caption" sx={{ color: '#81e5d8' }}>
                {getTierLabel(displayUser.tier)} Plan
              </MDTypography>
            </MDBox>
          </MDBox>
        </MDBox>

        {/* Navigation */}
        <MDBox sx={{ flex: 1, p: 2 }}>
          <MDBox display="flex" flexDirection="column" gap={1}>
            <Link href="/assessment/free">
              <MDButton
                sx={{
                  background: gradients.glow,
                  color: 'white',
                  width: '100%',
                  py: 1.5,
                  justifyContent: 'flex-start'
                }}
                startIcon={<FileText size={18} />}
              >
                Free Assessment
              </MDButton>
            </Link>
            
            {displayUser.tier === 'free' ? (
              <Link href="/pricing">
                <MDButton
                  sx={{
                    background: 'transparent',
                    border: '1px solid rgba(255,255,255,0.3)',
                    color: '#dbdce1',
                    width: '100%',
                    py: 1.5,
                    justifyContent: 'flex-start',
                    '&:hover': {
                      background: 'rgba(255,255,255,0.1)'
                    }
                  }}
                  startIcon={<Crown size={18} />}
                >
                  Growth Assessment
                </MDButton>
              </Link>
            ) : (
              <Link href="/assessment/paid">
                <MDButton
                  sx={{
                    background: 'transparent',
                    border: '1px solid rgba(255,255,255,0.3)',
                    color: '#dbdce1',
                    width: '100%',
                    py: 1.5,
                    justifyContent: 'flex-start',
                    '&:hover': {
                      background: 'rgba(255,255,255,0.1)'
                    }
                  }}
                  startIcon={<Crown size={18} />}
                >
                  Growth Assessment
                </MDButton>
              </Link>
            )}
            
            <Link href="/past-assessments">
              <MDButton
                sx={{
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.3)',
                  color: '#dbdce1',
                  width: '100%',
                  py: 1.5,
                  justifyContent: 'flex-start',
                  '&:hover': {
                    background: 'rgba(255,255,255,0.1)'
                  }
                }}
                startIcon={<BarChart3 size={18} />}
              >
                Past Assessments
              </MDButton>
            </Link>
            
            <MDButton
              component="a"
              href="https://api.leadconnectorhq.com/widget/bookings/applebites"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.3)',
                color: '#dbdce1',
                width: '100%',
                py: 1.5,
                justifyContent: 'flex-start',
                '&:hover': {
                  background: 'rgba(255,255,255,0.1)'
                }
              }}
              startIcon={<Calendar size={18} />}
            >
              Schedule Consultation
            </MDButton>
          </MDBox>
        </MDBox>

        {/* Sign Out */}
        <MDBox sx={{ p: 2, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <MDButton
            onClick={handleSignOut}
            sx={{
              background: 'transparent',
              border: '1px solid #EF4444',
              color: '#EF4444',
              width: '100%',
              py: 1.5
            }}
            startIcon={<LogOut size={18} />}
          >
            Sign Out
          </MDButton>
        </MDBox>
      </MDBox>

      {/* Main Content */}
      <MDBox sx={{ 
        flexGrow: 1, 
        marginLeft: { xs: 0, md: '280px' }, // No margin on mobile, 280px margin on desktop
        p: { xs: 2, md: 3 }, // Less padding on mobile
        width: '100%',
        maxWidth: '100%',
        overflow: 'hidden' // Prevent horizontal scroll
      }}>
        {/* Welcome Header */}
        <MDBox mb={4}>
          <MDTypography variant="h3" fontWeight="medium" color="text" mb={1}>
            Welcome back, {displayUser.firstName || displayUser.name?.split(' ')[0] || 'User'}!
          </MDTypography>
          <MDTypography variant="body1" color="text">
            Ready to unlock your business potential? Start with a comprehensive valuation assessment.
          </MDTypography>
        </MDBox>

        {/* Quick Stats Cards */}
        <MDBox 
          display="flex" 
          gap={3} 
          mb={4}
          sx={{
            flexDirection: { xs: 'column', md: 'row' }, // Stack on mobile, row on desktop
            width: '100%'
          }}
        >
          <Card sx={{ flex: 1, p: 3, background: gradients.glow, color: 'white' }}>
            <MDBox display="flex" alignItems="center" justifyContent="space-between">
              <MDBox>
                <MDTypography variant="h4" fontWeight="bold" color="white">
                  {getTierLabel(displayUser.tier)}
                </MDTypography>
                <MDTypography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                  Current Plan
                </MDTypography>
              </MDBox>
              <Crown size={32} color="white" />
            </MDBox>
          </Card>
          
          <Card sx={{ flex: 1, p: 3 }}>
            <MDBox display="flex" alignItems="center" justifyContent="space-between">
              <MDBox>
                <MDTypography variant="h4" fontWeight="bold" color="text">
                  {totalAssessments}
                </MDTypography>
                <MDTypography variant="body2" color="text">
                  Completed Assessments
                </MDTypography>
              </MDBox>
              <FileText size={32} color={colors.primary} />
            </MDBox>
          </Card>
          
          <Card sx={{ flex: 1, p: 3 }}>
            <MDBox display="flex" alignItems="center" justifyContent="space-between">
              <MDBox>
                <MDTypography variant="h4" fontWeight="bold" color="text">
                  {latestValuation > 0 ? formatCurrency(latestValuation) : '$0'}
                </MDTypography>
                <MDTypography variant="body2" color="text">
                  Estimated Value
                </MDTypography>
              </MDBox>
              <TrendingUp size={32} color={colors.accent} />
            </MDBox>
          </Card>
        </MDBox>

        {/* Action Cards and Past Assessments */}
        <MDBox 
          display="flex" 
          gap={3}
          sx={{
            flexDirection: { xs: 'column', lg: 'row' }, // Stack on mobile/tablet, row on large screens
            width: '100%'
          }}
        >
          <Card sx={{ flex: 2, p: 4 }}>
            <MDTypography variant="h5" fontWeight="medium" color="text" mb={2}>
              Get Started with Your Valuation
            </MDTypography>
            <MDTypography variant="body1" color="text" mb={3}>
              Our comprehensive assessment analyzes your business across key value drivers to provide accurate valuation estimates and improvement recommendations.
            </MDTypography>
            <MDBox display="flex" gap={2}>
              <Link href="/assessment/free">
                <MDButton
                  sx={{
                    background: gradients.primary,
                    color: 'white',
                    py: 1.5,
                    px: 3
                  }}
                  startIcon={<FileText size={18} />}
                >
                  Start Free Assessment
                </MDButton>
              </Link>
              {displayUser.tier === 'free' ? (
                <Link href="/pricing">
                  <MDButton
                    sx={{
                      background: 'transparent',
                      border: `1px solid ${colors.primary}`,
                      color: colors.primary,
                      py: 1.5,
                      px: 3
                    }}
                    startIcon={<Crown size={18} />}
                  >
                    Upgrade to Growth
                  </MDButton>
                </Link>
              ) : (
                <Link href="/assessment/paid">
                  <MDButton
                    sx={{
                      background: 'transparent',
                      border: `1px solid ${colors.primary}`,
                      color: colors.primary,
                      py: 1.5,
                      px: 3
                    }}
                    startIcon={<Crown size={18} />}
                  >
                    Start Growth Assessment
                  </MDButton>
                </Link>
              )}
            </MDBox>
          </Card>
          
          <Card sx={{ flex: 1, p: 4, textAlign: 'center' }}>
            <Clock size={48} color={colors.accent} style={{ marginBottom: 16 }} />
            <MDTypography variant="h6" fontWeight="medium" color="text" mb={2}>
              Quick Assessment
            </MDTypography>
            <MDTypography variant="body2" color="text" mb={3}>
              Complete in 10-15 minutes
            </MDTypography>
            <MDTypography variant="caption" sx={{ color: colors.accent }}>
              Perfect for getting started
            </MDTypography>
          </Card>
        </MDBox>

        {/* Past Assessments Section */}
        <MDBox mt={4}>
          <MDBox display="flex" alignItems="center" justifyContent="space-between" mb={3}>
            <MDBox display="flex" alignItems="center" gap={2}>
              <BarChart3 size={24} color={colors.primary} />
              <MDTypography variant="h5" fontWeight="medium" color="text">
                Recent Assessments
              </MDTypography>
            </MDBox>
            <Link href="/past-assessments">
              <MDButton
                sx={{
                  background: 'transparent',
                  color: colors.primary,
                  py: 1,
                  px: 2,
                  fontSize: '0.875rem',
                  '&:hover': {
                    background: 'rgba(0, 113, 141, 0.1)'
                  }
                }}
                startIcon={<Eye size={16} />}
              >
                View All
              </MDButton>
            </Link>
          </MDBox>
          <PastAssessmentsSection />
        </MDBox>
      </MDBox>
    </MDBox>
  );
}