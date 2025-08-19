import React, { useState, useMemo } from 'react';
import { Link, useLocation } from 'wouter';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { apiRequest } from '@/lib/queryClient';
import { 
  User, 
  FileText, 
  Crown, 
  Clock, 
  BarChart3, 
  Plus,
  Eye,
  Calendar,
  LogOut,
  Check,
  Lock,
  TrendingUp,
  Search,
  Filter,
  X,
  ChevronRight,
  Activity,
  Target,
  MessageSquare,
  DollarSign,
  Users,
  Sparkles,
  LayoutDashboard,
  CheckSquare,
  Bell
} from 'lucide-react';
import { useQuery, useQueryClient } from "@tanstack/react-query";

interface ConsumerUser {
  id: string;
  email: string;
  plan?: 'free' | 'growth' | 'capital';
  firstName?: string;
  lastName?: string;
  companyName?: string;
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

// Past Assessments Component
function PastAssessmentsSection({ userEmail }: { userEmail: string }) {
  const { data: assessments, isLoading } = useQuery<Assessment[]>({
    queryKey: ['/api/assessments'],
  });

  const [searchTerm, setSearchTerm] = useState('');

  const filteredAssessments = useMemo(() => {
    if (!assessments) return [];
    const emailLower = (userEmail || '').toLowerCase();
    const base = assessments.filter(a => a.email?.toLowerCase() === emailLower);

    const searchLower = searchTerm.toLowerCase();
    return base.filter(assessment => {
      if (!searchTerm) return true;
      return (
        assessment.company?.toLowerCase().includes(searchLower) ||
        `${assessment.firstName} ${assessment.lastName}`.toLowerCase().includes(searchLower) ||
        assessment.email?.toLowerCase().includes(searchLower)
      );
    });
  }, [assessments, userEmail, searchTerm]);

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
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-gray-600">Loading recent assessments...</p>
        </CardContent>
      </Card>
    );
  }

  if (!assessments || assessments.length === 0) {
    return (
      <div className="bg-white rounded-lg border p-6 text-center">
        <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">No Assessments Yet</h3>
        <p className="text-gray-600 mb-4">
          Complete your first business valuation to see results here
        </p>
        <Link href="/assessment/free">
          <Button className="bg-[#0d6e8c] hover:bg-[#0a5a73] text-white">
            <Plus className="h-4 w-4 mr-2" />
            Start First Assessment
          </Button>
        </Link>
      </div>
    );
  }

  const displayAssessments = filteredAssessments.slice(0, 3);

  return (
    <div>
      {/* Search Bar */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search assessments..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-10 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1976d2] bg-gray-50"
        />
        {searchTerm && (
          <X 
            className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 cursor-pointer hover:text-gray-600"
            onClick={() => setSearchTerm('')}
          />
        )}
        <Filter className="absolute right-10 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 cursor-pointer hover:text-gray-600" />
      </div>

      {/* Assessment Cards */}
      <div className="space-y-3">
        {displayAssessments.map((assessment) => (
          <div key={assessment.id} className="bg-white rounded-lg border p-4 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg"
                  style={{ backgroundColor: getGradeColor(assessment.overallScore) }}
                >
                  {assessment.overallScore}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">
                    {assessment.company || 'Business Assessment'}
                  </h4>
                  <p className="text-sm text-gray-500">
                    {formatDate(assessment.createdAt)} • {formatCurrency(assessment.midEstimate)} valuation
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-600 uppercase">
                  {assessment.tier}
                </span>
                <Link href={`/assessment-results/${assessment.id}`}>
                  <Button variant="ghost" size="sm" className="text-[#1976d2] hover:bg-[#1976d2]/10">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Main Dashboard Component
export default function ConsumerDashboardTeamTrack() {
  const [user, setUser] = useState<ConsumerUser | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  // Fetch assessments data for dashboard metrics
  const { data: assessments = [] } = useQuery<Assessment[]>({
    queryKey: ['/api/assessments'],
  });

  // Filter assessments by the logged-in user (must be before conditional returns)
  const userEmail = (user?.email || '').toLowerCase();
  
  // Only this user's assessments
  const userAssessments = useMemo(
    () => (assessments || []).filter(a => a.email?.toLowerCase() === userEmail),
    [assessments, userEmail]
  );

  // Metrics based ONLY on this user's data
  const totalAssessments = userAssessments.length;

  const latestAssessment = userAssessments.length
    ? [...userAssessments].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )[0]
    : null;

  const latestValuation =
    latestAssessment?.midEstimate && !Number.isNaN(Number(latestAssessment.midEstimate))
      ? Number(latestAssessment.midEstimate)
      : null;

  // Check authentication
  React.useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await apiRequest('GET', '/api/auth/consumer-user');
      const data = await response.json();
      
      if (data.user) {
        setUser(data.user);
      } else {
        setLocation('/consumer-login');
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setLocation('/consumer-login');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await apiRequest('POST', '/api/auth/consumer-logout');
      queryClient.clear();
      setLocation('/applebites');
    } catch (error) {
      console.error('Logout failed:', error);
      toast({
        title: "Logout Failed",
        description: "There was an error logging out. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const getTierLabel = (tier?: string) => {
    switch (tier) {
      case 'free': return 'Free';
      case 'growth': return 'Growth & Exit';
      case 'capital': return 'Capital';
      default: return 'Free';
    }
  };

  const getTierIcon = (tier?: string) => {
    switch (tier) {
      case 'growth': return <Crown className="h-5 w-5" />;
      case 'capital': return <Sparkles className="h-5 w-5" />;
      default: return null;
    }
  };

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

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="hidden md:flex w-[280px] bg-gradient-to-b from-[#0A1F44] to-[#1C2D5A] text-white flex-col fixed h-screen">
        {/* Logo Section */}
        <div className="p-6 text-center border-b border-white/10">
          <img
            src="/apple-bites-logo.png"
            alt="AppleBites"
            className="w-32 mx-auto mb-3"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          <p className="text-sm text-cyan-200 font-light">Business Valuation Platform</p>
        </div>

        {/* User Info */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center">
              <User className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="font-medium">{user.firstName || 'User'}</p>
              <p className="text-xs text-cyan-200">{getTierLabel(user.plan)} Plan</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="flex flex-col gap-3">
            {/* My Dashboard */}
            <Link href="/consumer-dashboard">
              <Button className="w-full justify-start bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white py-3">
                <LayoutDashboard className="h-4 w-4 mr-3" />
                My Dashboard
              </Button>
            </Link>
            
            {/* My Assessments */}
            <Link href="/past-assessments">
              <Button className="w-full justify-start bg-transparent hover:bg-white/10 text-white py-3">
                <BarChart3 className="h-4 w-4 mr-3" />
                My Assessments
              </Button>
            </Link>
            
            {/* Client View (Limited) */}
            <Link href="/client-view">
              <Button className="w-full justify-start bg-transparent hover:bg-white/10 text-white py-3">
                <Eye className="h-4 w-4 mr-3" />
                Client View (Limited)
              </Button>
            </Link>
            
            {/* Free & Growth Assessments Section */}
            <div className="border-t border-white/10 pt-3 mt-2">
              <p className="text-xs text-cyan-200 uppercase tracking-wider mb-2 px-2">Assessments</p>
              <div className="space-y-2">
                <Link href="/assessment/free">
                  <Button className="w-full justify-start bg-transparent hover:bg-white/10 text-white/90 py-2">
                    <FileText className="h-4 w-4 mr-3" />
                    Free Assessment
                  </Button>
                </Link>
                
                {user.plan === 'free' ? (
                  <Link href="/applebites-checkout">
                    <Button className="w-full justify-start bg-transparent hover:bg-white/10 text-white/90 py-2">
                      <Crown className="h-4 w-4 mr-3" />
                      Growth Assessment
                      <Lock className="h-3 w-3 ml-auto" />
                    </Button>
                  </Link>
                ) : (
                  <Link href="/assessment/paid">
                    <Button className="w-full justify-start bg-transparent hover:bg-white/10 text-white/90 py-2">
                      <Crown className="h-4 w-4 mr-3" />
                      Growth Assessment
                    </Button>
                  </Link>
                )}
              </div>
            </div>
            
            {/* Tasks & Feedback */}
            <Link href="/tasks-feedback">
              <Button className="w-full justify-start bg-transparent hover:bg-white/10 text-white py-3">
                <CheckSquare className="h-4 w-4 mr-3" />
                Tasks & Feedback
              </Button>
            </Link>
            
            {/* Notifications */}
            <Link href="/notifications">
              <Button className="w-full justify-start bg-transparent hover:bg-white/10 text-white py-3">
                <Bell className="h-4 w-4 mr-3" />
                Notifications
              </Button>
            </Link>
            
            {/* Profile Management */}
            <Link href="/profile">
              <Button className="w-full justify-start bg-transparent hover:bg-white/10 text-white py-3">
                <User className="h-4 w-4 mr-3" />
                Profile Management
              </Button>
            </Link>
            
            {/* Schedule Consultation */}
            <Button 
              className="w-full justify-start bg-transparent hover:bg-white/10 text-white py-3"
              asChild
            >
              <a href="https://api.leadconnectorhq.com/widget/bookings/applebites" target="_blank" rel="noopener noreferrer">
                <Calendar className="h-4 w-4 mr-3" />
                Schedule Consultation
              </a>
            </Button>
          </div>
        </div>

        {/* Sign Out */}
        <div className="p-6 border-t border-white/10">
          <Button 
            onClick={handleLogout} 
            className="w-full bg-transparent border border-red-400 text-red-400 hover:bg-red-400/10 py-3"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 md:ml-[280px]">
        {/* Mobile Header */}
        <div className="md:hidden bg-white border-b">
          <div className="px-4 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <Link href="/applebites">
                  <Button variant="ghost" size="sm">
                    ← Back
                  </Button>
                </Link>
                <h1 className="text-xl font-semibold">Dashboard</h1>
              </div>
              <Button onClick={handleLogout} variant="outline" size="sm">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="p-4 md:p-8">
          {/* Welcome Section */}
          <div className="mb-6">
            <h1 className="text-3xl font-semibold text-gray-800 mb-2">
              Welcome back, {user.firstName || 'Daniel'}!
            </h1>
            <p className="text-gray-600">
              Ready to unlock your business potential? Start with a comprehensive valuation assessment.
            </p>
          </div>

          {/* Top Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {/* Plan Badge */}
            <div className="bg-[#1976d2] text-white rounded-lg p-4 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold">{getTierLabel(user.plan)}</h3>
                <p className="text-sm opacity-90 mt-1">Current Plan</p>
              </div>
              <Crown className="h-8 w-8 text-white/80" />
            </div>

            {/* Completed Assessments */}
            <div className="bg-white border rounded-lg p-4 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-gray-800">{totalAssessments}</h3>
                <p className="text-sm text-gray-600 mt-1">Completed Assessments</p>
              </div>
              <FileText className="h-8 w-8 text-[#1976d2]" />
            </div>

            {/* Estimated Value */}
            <div className="bg-white border rounded-lg p-4 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-gray-800">
                  {latestValuation != null ? formatCurrency(latestValuation) : '—'}
                </h3>
                <p className="text-sm text-gray-600 mt-1">Estimated Value</p>
              </div>
              <TrendingUp className="h-8 w-8 text-[#1976d2]" />
            </div>
          </div>

          {/* Main Content Area */}
          <div className="space-y-6">
            {/* Top Row - Get Started and Quick Assessment Cards */}
            <div className="grid lg:grid-cols-[2fr_1fr] gap-6">
              {/* Get Started Card */}
              <Card className="bg-white h-full">
                <CardContent className="p-6 flex flex-col justify-between h-full">
                  <div>
                    <h2 className="text-xl font-semibold mb-3">Get Started with Your Valuation</h2>
                    <p className="text-gray-600 mb-6">
                      Our comprehensive assessment analyzes your business across key value drivers to provide accurate valuation estimates and improvement recommendations.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <Link href="/assessment/free">
                      <Button className="bg-[#0d6e8c] hover:bg-[#0a5a73] text-white">
                        <FileText className="h-4 w-4 mr-2" />
                        Start Free Assessment
                      </Button>
                    </Link>
                    {user.plan === 'free' ? (
                      <Link href="/applebites-checkout">
                        <Button variant="outline" className="border-[#0d6e8c] text-[#0d6e8c] hover:bg-[#0d6e8c] hover:text-white">
                          <Crown className="h-4 w-4 mr-2" />
                          Upgrade to Growth
                        </Button>
                      </Link>
                    ) : (
                      <Link href="/assessment/paid">
                        <Button variant="outline" className="border-[#0d6e8c] text-[#0d6e8c] hover:bg-[#0d6e8c] hover:text-white">
                          <Crown className="h-4 w-4 mr-2" />
                          Start Growth Assessment
                        </Button>
                      </Link>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Assessment Card */}
              <Card className="bg-white border h-full">
                <CardContent className="p-6 text-center flex flex-col justify-center h-full">
                  <Clock className="h-16 w-16 text-[#1976d2] mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Quick Assessment</h3>
                  <p className="text-gray-600 mb-2">Complete in 10-15 minutes</p>
                  <p className="text-sm text-[#1976d2]">Perfect for getting started</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Assessments Section - Full Width */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-gray-600" />
                  Recent Assessments
                </h3>
                <Link href="/past-assessments">
                  <Button variant="ghost" size="sm" className="text-[#1976d2] hover:text-[#1565c0]">
                    <Eye className="h-4 w-4 mr-1" />
                    View All
                  </Button>
                </Link>
              </div>
              <PastAssessmentsSection userEmail={user.email!} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}