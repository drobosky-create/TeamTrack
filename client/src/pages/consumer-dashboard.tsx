import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Dashboard as DashboardIcon } from '@mui/icons-material';
import { 
  Star, 
  FileText,
  TrendingUp,
  Clock,
  CheckCircle,
  Info,
  DollarSign,
  BarChart3,
  Users,
  Award
} from 'lucide-react';

export default function ConsumerDashboard() {
  const [, setLocation] = useLocation();
  const [userData, setUserData] = useState<any>(null);
  const [assessmentHistory, setAssessmentHistory] = useState<any[]>([]);

  useEffect(() => {
    const user = localStorage.getItem('consumerUser');
    if (!user) {
      setLocation('/consumer-login');
    } else {
      setUserData(JSON.parse(user));
      // In production, fetch assessment history from API
      setAssessmentHistory([]);
    }
  }, []);

  if (!userData) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  // AppleBites Consumer Layout
  const ConsumerLayout = ({ children }: { children: React.ReactNode }) => {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* AppleBites Sidebar */}
        <div className="fixed inset-y-0 left-0 w-64 bg-gradient-to-b from-blue-900 to-blue-800 text-white">
          <div className="p-6">
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <Star className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h1 className="text-lg font-bold">AppleBites</h1>
                <p className="text-xs text-blue-200">Business Valuation Platform</p>
              </div>
            </div>
            
            {/* Navigation */}
            <nav className="space-y-2">
              <a href="/consumer-dashboard" className="flex items-center px-3 py-2 rounded-lg bg-blue-700 text-white">
                <DashboardIcon className="h-5 w-5 mr-3" />
                Dashboard
              </a>
              <a href="/assessments/free" className="flex items-center px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                <Star className="h-5 w-5 mr-3" />
                Free Assessment
              </a>
              <a href="#" className="flex items-center px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors opacity-50">
                <TrendingUp className="h-5 w-5 mr-3" />
                Growth Assessment
              </a>
              <a href="/value-improvement-calculator" className="flex items-center px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                <BarChart3 className="h-5 w-5 mr-3" />
                Value Calculator
              </a>
              <a href="#" className="flex items-center px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors opacity-50">
                <Users className="h-5 w-5 mr-3" />
                Consultation
              </a>
            </nav>
          </div>
          
          {/* User Info */}
          <div className="absolute bottom-6 left-6 right-6">
            <div className="bg-blue-700 rounded-lg p-3">
              <p className="text-sm font-medium">{userData.firstName} {userData.lastName}</p>
              <p className="text-xs text-blue-200">{userData.email}</p>
              <button 
                onClick={() => {
                  localStorage.removeItem('consumerUser');
                  setLocation('/consumer-login');
                }}
                className="text-xs text-blue-200 hover:text-white mt-1"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="ml-64">
          <div className="p-8">
            {children}
          </div>
        </div>
      </div>
    );
  };

  return (
    <ConsumerLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {userData.firstName}!</h1>
          <p className="text-muted-foreground text-lg">
            Ready to unlock your business potential? Start with a comprehensive valuation assessment.
          </p>
        </div>

        {/* Top Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Free Assessment Card */}
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold mb-1">Free</h3>
                  <p className="text-blue-100 text-sm">Assessment</p>
                </div>
                <div className="text-right">
                  <Star className="h-6 w-6 mb-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Assessment Count */}
          <Card className="border border-gray-200">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-gray-900">{assessmentHistory.length}</div>
              <p className="text-gray-600 text-sm mt-1">Assessments</p>
              <FileText className="h-5 w-5 text-gray-400 mx-auto mt-2" />
            </CardContent>
          </Card>

          {/* Business Value */}
          <Card className="border border-gray-200">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-gray-900">--</div>
              <p className="text-gray-600 text-sm mt-1">Est. Value</p>
              <TrendingUp className="h-5 w-5 text-gray-400 mx-auto mt-2" />
            </CardContent>
          </Card>
        </div>

        {/* Get Started Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              Get Started with Your Valuation
            </CardTitle>
            <CardDescription>
              Our comprehensive assessment analyzes your business across 10 key value drivers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                className="flex-1"
                onClick={() => setLocation('/assessments/free')}
                data-testid="button-start-assessment"
              >
                <Star className="h-4 w-4 mr-2" />
                Start Free Assessment
              </Button>
              <Button 
                variant="outline" 
                className="flex-1" 
                disabled
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                Upgrade to Growth ($497)
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Assessments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Recent Assessments
              </span>
              <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
                View All (0)
              </Button>
            </CardTitle>
            <CardDescription>Track your assessment journey</CardDescription>
          </CardHeader>
          <CardContent>
            {assessmentHistory.length === 0 ? (
              <div className="text-center py-8">
                <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Assessments Yet</h3>
                <p className="text-muted-foreground mb-4 text-sm">
                  Complete your first assessment to unlock insights about your business value.
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Assessment Progress</span>
                    <span className="text-muted-foreground">0%</span>
                  </div>
                  <Progress value={0} className="h-2" />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {assessmentHistory.map((assessment, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 rounded-lg border">
                    <div className="h-2 w-2 rounded-full bg-green-500 mt-2" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">Business Assessment</p>
                      <p className="text-sm text-muted-foreground">Completed</p>
                      <p className="text-xs text-muted-foreground">Grade: A | Value: $2.1M</p>
                    </div>
                    <Badge variant="default">Complete</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Help & Tips */}
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            <strong>Need help?</strong> Our free assessment takes about 10-15 minutes to complete. 
            You'll need your recent financial statements including net income, interest, taxes, and depreciation.
          </AlertDescription>
        </Alert>
      </div>
    </ConsumerLayout>
  );
}