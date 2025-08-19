import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Link, useLocation } from 'wouter';
import { 
  ArrowLeft, 
  CheckCircle, 
  Crown, 
  Sparkles, 
  Lock,
  FileText,
  TrendingUp,
  Calculator,
  Calendar,
  MessageSquare,
  ChevronRight,
  BarChart3,
  Target,
  Users,
  DollarSign,
  Activity
} from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

interface ConsumerUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  companyName: string;
  plan?: 'free' | 'growth' | 'capital';
}

export default function ConsumerDashboard() {
  const [user, setUser] = useState<ConsumerUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [assessmentProgress, setAssessmentProgress] = useState(0);
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Get user from localStorage (set during login/signup)
    const storedUser = localStorage.getItem('consumerUser');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
    }

    // Also verify with backend
    apiRequest('GET', '/api/auth/consumer-user')
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setUser(data.user);
          // Update localStorage with latest data
          localStorage.setItem('consumerUser', JSON.stringify(data.user));
        }
      })
      .catch(error => {
        console.error('Error fetching user:', error);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = async () => {
    try {
      await apiRequest('POST', '/api/auth/consumer-logout');
      localStorage.removeItem('consumerUser');
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
      setLocation('/applebites');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to logout. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6">
            <p className="text-center mb-4">Please log in to access your dashboard.</p>
            <Link href="/consumer-login">
              <Button className="w-full">Go to Login</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getPlanIcon = () => {
    switch (user.plan) {
      case 'growth':
        return <Crown className="h-6 w-6 text-yellow-500" />;
      case 'capital':
        return <Sparkles className="h-6 w-6 text-purple-500" />;
      default:
        return <CheckCircle className="h-6 w-6 text-green-500" />;
    }
  };

  const getPlanName = () => {
    switch (user.plan) {
      case 'growth':
        return 'Growth & Exit Plan';
      case 'capital':
        return 'Capital Plan';
      default:
        return 'Free Plan';
    }
  };

  const getPlanFeatures = () => {
    switch (user.plan) {
      case 'growth':
        return [
          'Complete business valuation assessment',
          '60-minute 1:1 Deep Dive Call',
          'Private Equity Readiness Scorecard',
          'Opinion of Valuation',
          'Enterprise Value Simulator',
          'Growth strategy recommendations',
          'Exit planning tools',
          'Value improvement calculator',
          'Professional valuation report'
        ];
      case 'capital':
        return [
          'All Growth & Exit features',
          'Capital raising assistance',
          'Investor matchmaking',
          'Deal structuring support',
          'Due diligence preparation',
          'Direct access to advisors'
        ];
      default:
        return [
          'General EBITDA Multipliers',
          'Value Driver Assessment',
          'Basic PDF Report',
          'Email Delivery'
        ];
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50">
      {/* Header Navigation */}
      <div className="bg-white border-b">
        <div className="container max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Link href="/applebites">
                <Button variant="ghost" size="sm" className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>
              </Link>
              <div className="h-8 w-px bg-gray-200" />
              <div className="flex items-center gap-2">
                <img 
                  src="/apple-bites-logo.png" 
                  alt="AppleBites" 
                  className="h-8 w-auto"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <span className="font-semibold text-gray-900">AppleBites Dashboard</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge 
                variant={user?.plan === 'growth' ? 'default' : 'secondary'}
                className="px-3 py-1"
              >
                {user?.plan === 'growth' ? (
                  <>
                    <Crown className="h-3 w-3 mr-1" />
                    Growth & Exit
                  </>
                ) : user?.plan === 'capital' ? (
                  <>
                    <Sparkles className="h-3 w-3 mr-1" />
                    Capital
                  </>
                ) : (
                  'Free Plan'
                )}
              </Badge>
              <Button onClick={handleLogout} variant="outline" size="sm">
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user.firstName}!
          </h1>
          <p className="text-lg text-gray-600">{user.companyName}</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Assessment Status</p>
                  <p className="text-2xl font-bold">
                    {assessmentProgress === 0 ? 'Not Started' : 
                     assessmentProgress === 100 ? 'Complete' : 'In Progress'}
                  </p>
                </div>
                <Activity className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Business Grade</p>
                  <p className="text-2xl font-bold">
                    {user.plan === 'free' ? 'N/A' : 'Pending'}
                  </p>
                </div>
                <Target className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Reports Available</p>
                  <p className="text-2xl font-bold">
                    {user.plan === 'free' ? '0' : '1'}
                  </p>
                </div>
                <FileText className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Consultation Status</p>
                  <p className="text-2xl font-bold">
                    {user.plan === 'growth' ? 'Available' : 'Locked'}
                  </p>
                </div>
                <MessageSquare className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          {/* Assessment Progress */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Business Valuation Assessment</CardTitle>
                <CardDescription>
                  Complete your 4-step assessment to receive your business valuation
                </CardDescription>
              </CardHeader>
              <CardContent>
                {user.plan === 'free' ? (
                  <div className="text-center py-8">
                    <Lock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">
                      Upgrade to Growth & Exit plan to access the full assessment
                    </p>
                    <Link href="/applebites-checkout">
                      <Button className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700">
                        Upgrade Now
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div>
                    <div className="space-y-4">
                      {/* Assessment Steps */}
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${assessmentProgress >= 25 ? 'bg-green-500' : 'bg-gray-300'}`}>
                            {assessmentProgress >= 25 ? <CheckCircle className="h-5 w-5" /> : '1'}
                          </div>
                          <span className="text-sm font-medium">Financials</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${assessmentProgress >= 50 ? 'bg-green-500' : 'bg-gray-300'}`}>
                            {assessmentProgress >= 50 ? <CheckCircle className="h-5 w-5" /> : '2'}
                          </div>
                          <span className="text-sm font-medium">Adjustments</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${assessmentProgress >= 75 ? 'bg-green-500' : 'bg-gray-300'}`}>
                            {assessmentProgress >= 75 ? <CheckCircle className="h-5 w-5" /> : '3'}
                          </div>
                          <span className="text-sm font-medium">Value Drivers</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${assessmentProgress === 100 ? 'bg-green-500' : 'bg-gray-300'}`}>
                            {assessmentProgress === 100 ? <CheckCircle className="h-5 w-5" /> : '4'}
                          </div>
                          <span className="text-sm font-medium">Follow-up</span>
                        </div>
                      </div>

                      <Progress value={assessmentProgress} className="h-2" />
                      
                      <div className="pt-4">
                        {assessmentProgress === 0 ? (
                          <Button className="w-full" size="lg" data-testid="button-start-assessment">
                            Start Assessment
                            <ChevronRight className="h-4 w-4 ml-2" />
                          </Button>
                        ) : assessmentProgress < 100 ? (
                          <Button className="w-full" size="lg" data-testid="button-continue-assessment">
                            Continue Assessment
                            <ChevronRight className="h-4 w-4 ml-2" />
                          </Button>
                        ) : (
                          <div className="space-y-3">
                            <Button className="w-full" variant="outline" data-testid="button-view-report">
                              View Valuation Report
                              <FileText className="h-4 w-4 ml-2" />
                            </Button>
                            <Button className="w-full" data-testid="button-value-calculator">
                              Open Value Improvement Calculator
                              <Calculator className="h-4 w-4 ml-2" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Side Panel - Quick Actions */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  className="w-full justify-between" 
                  variant="outline"
                  disabled={user.plan === 'free'}
                  data-testid="button-schedule-consultation"
                >
                  <span className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Schedule Consultation
                  </span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
                
                <Button 
                  className="w-full justify-between" 
                  variant="outline"
                  disabled={user.plan === 'free'}
                  data-testid="button-view-insights"
                >
                  <span className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    View Insights
                  </span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
                
                <Button 
                  className="w-full justify-between" 
                  variant="outline"
                  data-testid="button-contact-support"
                >
                  <span className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Contact Support
                  </span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>

            {/* Plan Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  {getPlanIcon()}
                  {getPlanName()}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {getPlanFeatures().slice(0, 5).map((feature, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-xs text-gray-600">{feature}</span>
                    </div>
                  ))}
                </div>
                {user.plan === 'free' && (
                  <Link href="/applebites-checkout">
                    <Button className="w-full mt-4" size="sm">
                      Upgrade Plan
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Value Insights Section (Only for paid users) */}
        {user.plan !== 'free' && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Business Value Insights</CardTitle>
              <CardDescription>
                Your potential business value based on industry benchmarks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">Conservative</p>
                  <p className="text-2xl font-bold text-gray-700">$15.1M</p>
                  <p className="text-xs text-gray-500">3.2x EBITDA</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">Most Likely</p>
                  <p className="text-3xl font-bold text-green-600">$18.9M</p>
                  <p className="text-xs text-gray-500">4.2x EBITDA</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">Optimistic</p>
                  <p className="text-2xl font-bold text-gray-700">$22.7M</p>
                  <p className="text-xs text-gray-500">5.1x EBITDA</p>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium">Overall Business Grade</p>
                    <p className="text-xs text-gray-600">Based on your operational performance</p>
                  </div>
                  <div className="text-3xl font-bold text-orange-500">C</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Resources Section */}
        <Card>
          <CardHeader>
            <CardTitle>Resources & Support</CardTitle>
            <CardDescription>
              Tools and guides to help you maximize your business value
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                <div className="flex items-start gap-3">
                  <TrendingUp className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Growth Strategies Guide</p>
                    <p className="text-xs text-gray-600 mt-1">
                      Learn proven strategies to increase your business value
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                <div className="flex items-start gap-3">
                  <DollarSign className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Exit Planning Toolkit</p>
                    <p className="text-xs text-gray-600 mt-1">
                      Prepare your business for a successful exit
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                <div className="flex items-start gap-3">
                  <Users className="h-5 w-5 text-purple-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Investor Readiness Checklist</p>
                    <p className="text-xs text-gray-600 mt-1">
                      Ensure your business is ready for investor scrutiny
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                <div className="flex items-start gap-3">
                  <BarChart3 className="h-5 w-5 text-orange-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Industry Benchmarks</p>
                    <p className="text-xs text-gray-600 mt-1">
                      Compare your performance against industry standards
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}