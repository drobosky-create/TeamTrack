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
  Sparkles
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
function PastAssessmentsSection() {
  const { data: assessments, isLoading } = useQuery<Assessment[]>({
    queryKey: ['/api/assessments'],
  });

  const [searchTerm, setSearchTerm] = useState('');

  const filteredAssessments = useMemo(() => {
    if (!assessments) return [];
    
    return assessments.filter(assessment => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = !searchTerm || 
        assessment.company?.toLowerCase().includes(searchLower) ||
        `${assessment.firstName} ${assessment.lastName}`.toLowerCase().includes(searchLower) ||
        assessment.email?.toLowerCase().includes(searchLower);
      
      return matchesSearch;
    });
  }, [assessments, searchTerm]);

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
      <Card>
        <CardContent className="text-center py-8">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Assessments Yet</h3>
          <p className="text-gray-600 mb-4">
            Complete your first business valuation to see results here
          </p>
          <Link href="/assessment/free">
            <Button className="bg-gradient-to-r from-[#00718d] to-[#0A1F44] hover:from-[#005f73] hover:to-[#081833]">
              <Plus className="h-4 w-4 mr-2" />
              Start First Assessment
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  const displayAssessments = filteredAssessments.slice(0, 3);

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search assessments..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {searchTerm && (
          <X 
            className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 cursor-pointer hover:text-gray-600"
            onClick={() => setSearchTerm('')}
          />
        )}
      </div>

      {/* Assessment Cards */}
      {displayAssessments.map((assessment) => (
        <Card key={assessment.id} className="hover:shadow-lg transition-shadow">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-xl"
                  style={{ backgroundColor: getGradeColor(assessment.overallScore) }}
                >
                  {assessment.overallScore}
                </div>
                <div>
                  <h4 className="font-semibold">
                    {assessment.company || `${assessment.firstName} ${assessment.lastName}`}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {formatDate(assessment.createdAt)} • {formatCurrency(assessment.midEstimate)} valuation
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={assessment.tier === 'free' ? 'secondary' : 'default'}>
                  {assessment.tier.toUpperCase()}
                </Badge>
                <Link href={`/assessment-results/${assessment.id}`}>
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      
      {filteredAssessments.length > 3 && (
        <Link href="/past-assessments">
          <Button variant="outline" className="w-full">
            <BarChart3 className="h-4 w-4 mr-2" />
            View All Assessments ({filteredAssessments.length})
          </Button>
        </Link>
      )}
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

  // Calculate dashboard metrics
  const totalAssessments = assessments.length;
  const latestAssessment = assessments.length > 0 ? 
    assessments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0] : 
    null;
  
  const latestValuation = latestAssessment?.midEstimate ? 
    parseFloat(latestAssessment.midEstimate) : 0;

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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Link href="/applebites">
                <Button variant="ghost" size="sm">
                  ← Back
                </Button>
              </Link>
              <div className="h-8 w-px bg-gray-200" />
              <h1 className="text-xl font-semibold">AppleBites Dashboard</h1>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant={user.plan === 'growth' ? 'default' : 'secondary'} className="px-3 py-1">
                {getTierIcon(user.plan)}
                <span className="ml-1">{getTierLabel(user.plan)}</span>
              </Badge>
              <Button onClick={handleLogout} variant="outline" size="sm">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user.firstName || 'User'}!
          </h2>
          <p className="text-lg text-gray-600">
            Ready to unlock your business potential? Start with a comprehensive valuation assessment.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-[#00718d] to-[#0A1F44] text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">{getTierLabel(user.plan)}</p>
                  <p className="text-sm opacity-90">Current Plan</p>
                </div>
                {getTierIcon(user.plan) || <Crown className="h-8 w-8 opacity-50" />}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">{totalAssessments}</p>
                  <p className="text-sm text-gray-600">Completed Assessments</p>
                </div>
                <FileText className="h-8 w-8 text-[#00718d]" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">
                    {latestValuation > 0 ? formatCurrency(latestValuation) : '$0'}
                  </p>
                  <p className="text-sm text-gray-600">Estimated Value</p>
                </div>
                <TrendingUp className="h-8 w-8 text-[#005b8c]" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Action Card */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Get Started with Your Valuation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-6">
                  Our comprehensive assessment analyzes your business across key value drivers to provide accurate valuation estimates and improvement recommendations.
                </p>
                <div className="flex gap-3">
                  <Link href="/assessment/free">
                    <Button className="bg-gradient-to-r from-[#00718d] to-[#0A1F44]">
                      <FileText className="h-4 w-4 mr-2" />
                      Start Free Assessment
                    </Button>
                  </Link>
                  {user.plan === 'free' ? (
                    <Link href="/applebites-checkout">
                      <Button variant="outline">
                        <Crown className="h-4 w-4 mr-2" />
                        Upgrade to Growth
                      </Button>
                    </Link>
                  ) : (
                    <Link href="/assessment/paid">
                      <Button variant="outline">
                        <Crown className="h-4 w-4 mr-2" />
                        Start Growth Assessment
                      </Button>
                    </Link>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Recent Assessments */}
            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-[#00718d]" />
                  Recent Assessments
                </h3>
                <Link href="/past-assessments">
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    View All
                  </Button>
                </Link>
              </div>
              <PastAssessmentsSection />
            </div>
          </div>

          {/* Side Panel */}
          <div className="space-y-6">
            {/* Quick Assessment Card */}
            <Card className="text-center">
              <CardContent className="pt-6">
                <Clock className="h-12 w-12 text-[#005b8c] mx-auto mb-4" />
                <h4 className="text-lg font-semibold mb-2">Quick Assessment</h4>
                <p className="text-sm text-gray-600 mb-3">Complete in 10-15 minutes</p>
                <p className="text-xs text-[#005b8c]">Perfect for getting started</p>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  className="w-full justify-between"
                  variant="outline"
                  disabled={user.plan === 'free'}
                  asChild
                >
                  <a href="https://api.leadconnectorhq.com/widget/bookings/applebites" target="_blank" rel="noopener noreferrer">
                    <span className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Schedule Consultation
                    </span>
                    <ChevronRight className="h-4 w-4" />
                  </a>
                </Button>

                <Link href="/past-assessments">
                  <Button className="w-full justify-between" variant="outline">
                    <span className="flex items-center gap-2">
                      <BarChart3 className="h-4 w-4" />
                      View Past Assessments
                    </span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </Link>

                {user.plan === 'free' && (
                  <Link href="/applebites-checkout">
                    <Button className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700">
                      <Crown className="h-4 w-4 mr-2" />
                      Upgrade to Growth
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}