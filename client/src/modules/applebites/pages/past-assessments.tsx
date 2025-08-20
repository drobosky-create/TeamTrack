import React, { useState, useMemo } from 'react';
import { Link, useLocation } from 'wouter';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { apiRequest, queryClient } from '@/lib/queryClient';
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
  Sparkles,
  LayoutDashboard,
  CheckSquare,
  Bell,
  Trash2,
  Menu,
  X,
  Home,
  History,
  Calculator
} from 'lucide-react';
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";

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

export default function PastAssessmentsPage() {
  const [user, setUser] = useState<ConsumerUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [assessmentToDelete, setAssessmentToDelete] = useState<Assessment | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  // Fetch assessments data - using consumer-specific endpoint
  const { data: assessments = [], isLoading: assessmentsLoading } = useQuery<Assessment[]>({
    queryKey: ['/api/consumer/assessments'],
  });
  
  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (assessmentId: number) => {
      const response = await apiRequest('DELETE', `/api/consumer/assessments/${assessmentId}`);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete assessment');
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Assessment deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/consumer/assessments'] });
      setDeleteDialogOpen(false);
      setAssessmentToDelete(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete assessment",
        variant: "destructive",
      });
    },
  });

  // No need to filter by email since API only returns user's assessments
  const filteredAssessments = useMemo(() => {
    if (!assessments) return [];
    
    const searchLower = searchTerm.toLowerCase();
    return assessments.filter(assessment => {
      if (!searchTerm) return true;
      return (
        assessment.company?.toLowerCase().includes(searchLower) ||
        `${assessment.firstName} ${assessment.lastName}`.toLowerCase().includes(searchLower) ||
        assessment.email?.toLowerCase().includes(searchLower)
      );
    });
  }, [assessments, searchTerm]);

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
  
  const handleDeleteClick = (assessment: Assessment) => {
    setAssessmentToDelete(assessment);
    setDeleteDialogOpen(true);
  };
  
  const handleDeleteConfirm = () => {
    if (assessmentToDelete) {
      deleteMutation.mutate(assessmentToDelete.id);
    }
  };
  
  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setAssessmentToDelete(null);
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
              <Button className="w-full justify-start bg-transparent hover:bg-white/10 text-white py-3">
                <LayoutDashboard className="h-4 w-4 mr-3" />
                My Dashboard
              </Button>
            </Link>
            
            {/* My Assessments - Active State */}
            <Link href="/past-assessments">
              <Button className="w-full justify-start bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white py-3">
                <BarChart3 className="h-4 w-4 mr-3" />
                My Assessments
              </Button>
            </Link>
            
            {/* Explore Improvements */}
            <Link href="/value-improvement/latest">
              <Button className="w-full justify-start bg-transparent hover:bg-white/10 text-white py-3">
                <TrendingUp className="h-4 w-4 mr-3" />
                Explore Improvements
              </Button>
            </Link>
            
            {/* Free Assessment */}
            <Link href="/assessment/free">
              <Button className="w-full justify-start bg-transparent hover:bg-white/10 text-white py-3">
                <FileText className="h-4 w-4 mr-3" />
                Free Assessment
              </Button>
            </Link>
            
            {/* Growth Assessment */}
            {user.plan === 'free' ? (
              <Link href="/applebites-checkout">
                <Button className="w-full justify-start bg-transparent hover:bg-white/10 text-white py-3">
                  <Crown className="h-4 w-4 mr-3" />
                  Growth Assessment
                  <Lock className="h-3 w-3 ml-auto" />
                </Button>
              </Link>
            ) : (
              <Link href="/assessment/paid">
                <Button className="w-full justify-start bg-transparent hover:bg-white/10 text-white py-3">
                  <Crown className="h-4 w-4 mr-3" />
                  Growth Assessment
                </Button>
              </Link>
            )}
            
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
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setMobileMenuOpen(true)}
                >
                  <Menu className="h-5 w-5" />
                </Button>
                <h1 className="text-xl font-semibold">My Assessments</h1>
              </div>
              <Button onClick={handleLogout} variant="outline" size="sm">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black/50" 
              onClick={() => setMobileMenuOpen(false)}
            />
            
            {/* Slide-out Menu */}
            <div className="fixed left-0 top-0 h-full w-80 bg-white shadow-lg transform transition-transform duration-300">
              {/* Header */}
              <div className="bg-gradient-to-r from-[#42424a] to-[#191919] text-white p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-semibold">AppleBites</h2>
                    <p className="text-sm opacity-90">Business Valuation</p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-white hover:bg-white/10"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* Navigation Menu */}
              <div className="p-4 space-y-2">
                <Link href="/consumer-dashboard">
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-left"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Home className="h-4 w-4 mr-3" />
                    Dashboard
                  </Button>
                </Link>
                
                <Link href="/assessment/free">
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-left"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <FileText className="h-4 w-4 mr-3" />
                    Free Assessment
                  </Button>
                </Link>

                {user?.plan !== 'free' && (
                  <Link href="/assessment/paid">
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-left"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Crown className="h-4 w-4 mr-3" />
                      Growth Assessment
                    </Button>
                  </Link>
                )}

                <Link href="/past-assessments">
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-left bg-blue-50 text-blue-600"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <History className="h-4 w-4 mr-3" />
                    My Assessments
                  </Button>
                </Link>

                <Link href="/value-improvement/latest">
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-left"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Calculator className="h-4 w-4 mr-3" />
                    Value Calculator
                  </Button>
                </Link>

                {user?.plan === 'free' && (
                  <Link href="/applebites-checkout">
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-left text-green-600 hover:bg-green-50"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Crown className="h-4 w-4 mr-3" />
                      Upgrade to Growth
                    </Button>
                  </Link>
                )}

                <div className="pt-4 border-t">
                  <Link href="/applebites">
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-left"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      ← Back to Landing
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="p-4 md:p-8">
          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-semibold text-gray-800 mb-2">
              My Assessments
            </h1>
            <p className="text-gray-600">
              Review your business valuation history and track your growth over time.
            </p>
          </div>

          {/* Search and Actions Bar */}
          <div className="flex justify-between items-center mb-6">
            <div className="relative w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by company, name, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-3">
              <Link href="/assessment/free">
                <Button className="bg-[#0d6e8c] hover:bg-[#0a5a73] text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  New Assessment
                </Button>
              </Link>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
            </div>
          </div>

          {/* Assessments Grid */}
          {assessmentsLoading ? (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-gray-600">Loading assessments...</p>
              </CardContent>
            </Card>
          ) : filteredAssessments.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {searchTerm ? 'No assessments found' : 'No assessments yet'}
                </h3>
                <p className="text-gray-600 mb-6">
                  {searchTerm 
                    ? 'Try adjusting your search criteria.'
                    : 'Start your first assessment to understand your business value.'}
                </p>
                {!searchTerm && (
                  <Link href="/assessment/free">
                    <Button className="bg-[#0d6e8c] hover:bg-[#0a5a73] text-white">
                      <Plus className="h-4 w-4 mr-2" />
                      Start Your First Assessment
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredAssessments.map((assessment) => (
                <Card key={assessment.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-5">
                    <div className="flex justify-between items-start mb-3">
                      <div className="cursor-pointer" onClick={() => setLocation(`/assessment-results/${assessment.id}`)}>
                        <h3 className="font-semibold text-gray-800 text-lg">{assessment.company}</h3>
                        <p className="text-sm text-gray-600">
                          {assessment.firstName} {assessment.lastName}
                        </p>
                      </div>
                      <Badge 
                        className="px-2 py-1" 
                        style={{ backgroundColor: getGradeColor(assessment.overallScore), color: 'white' }}
                      >
                        Grade {assessment.overallScore}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2 mb-3 cursor-pointer" onClick={() => setLocation(`/assessment-results/${assessment.id}`)}>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Valuation:</span>
                        <span className="font-semibold text-gray-800">
                          {formatCurrency(assessment.midEstimate)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Multiple:</span>
                        <span className="font-medium text-gray-700">
                          {assessment.valuationMultiple}x
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Range:</span>
                        <span className="text-sm text-gray-700">
                          {formatCurrency(assessment.lowEstimate)} - {formatCurrency(assessment.highEstimate)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center pt-3 border-t">
                      <span className="text-xs text-gray-500">
                        {formatDate(assessment.createdAt)}
                      </span>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="text-[#1976d2]"
                          onClick={() => setLocation(`/assessment-results/${assessment.id}`)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="text-red-600 hover:text-red-700"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteClick(assessment);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Delete Confirmation Dialog */}
      <div
        className={`fixed inset-0 flex items-center justify-center z-50 ${
          deleteDialogOpen ? '' : 'hidden'
        }`}
      >
        <div className="fixed inset-0 bg-black bg-opacity-50" onClick={handleDeleteCancel}></div>
        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 relative z-10">
          <h2 className="text-xl font-semibold mb-4">Delete Assessment</h2>
          <p className="text-gray-600 mb-6">
            Are you sure you want to delete the assessment for{' '}
            <strong>{assessmentToDelete?.company}</strong>? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={handleDeleteCancel}
              disabled={deleteMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={handleDeleteConfirm}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}