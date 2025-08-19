import React, { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { ConsumerDashboardLayout } from '@/components/layout/ConsumerDashboardLayout';
import { 
  Star, 
  FileText,
  TrendingUp,
  Clock,
  ArrowRight,
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

  return (
    <ConsumerDashboardLayout>
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

        {/* Main Content Grid - 3 Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                Quick Actions
              </CardTitle>
              <CardDescription>
                Get started with these assessment tasks
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => setLocation('/assessments/free')}
                data-testid="button-start-assessment"
              >
                <Star className="h-4 w-4 mr-2" />
                Start Free Assessment
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start" 
                disabled
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                Growth Assessment (Upgrade)
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => setLocation('/value-improvement-calculator')}
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Value Improvement Calculator
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start"
                disabled
              >
                <Users className="h-4 w-4 mr-2" />
                Schedule Consultation
              </Button>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Recent Activity
              </CardTitle>
              <CardDescription>
                Latest updates on your assessments
              </CardDescription>
            </CardHeader>
            <CardContent>
              {assessmentHistory.length > 0 ? (
                <div className="space-y-3">
                  {assessmentHistory.map((activity, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="h-4 w-4 mt-0.5 text-green-600" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium leading-none">
                          Completed Business Assessment
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          2 hours ago
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <Clock className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    No recent activity to show
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Complete your first assessment to see activity here
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Next Steps & Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5" />
                Next Steps
              </CardTitle>
              <CardDescription>
                Recommended actions to maximize value
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Complete Free Assessment</p>
                    <p className="text-xs text-muted-foreground">
                      Get your business valuation and grade
                    </p>
                  </div>
                  <Badge variant="outline">
                    Pending
                  </Badge>
                </div>

                <div className="flex items-center justify-between opacity-50">
                  <div>
                    <p className="text-sm font-medium">Review Results</p>
                    <p className="text-xs text-muted-foreground">
                      Understand your business grade
                    </p>
                  </div>
                  <Badge variant="secondary">
                    Locked
                  </Badge>
                </div>

                <div className="flex items-center justify-between opacity-50">
                  <div>
                    <p className="text-sm font-medium">Explore Improvements</p>
                    <p className="text-xs text-muted-foreground">
                      Use value improvement calculator
                    </p>
                  </div>
                  <Badge variant="secondary">
                    Locked
                  </Badge>
                </div>

                <div className="flex items-center justify-between opacity-50">
                  <div>
                    <p className="text-sm font-medium">Consider Growth Assessment</p>
                    <p className="text-xs text-muted-foreground">
                      Unlock detailed recommendations
                    </p>
                  </div>
                  <Badge variant="secondary">
                    $497
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upgrade Options Section */}
        <div className="grid md:grid-cols-2 gap-6 mt-6">
          {/* Free Assessment */}
          <Card className="border-2 hover:border-green-500 transition-all hover:shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <Star className="h-8 w-8 text-yellow-500" />
                <Badge variant="secondary">Available</Badge>
              </div>
              <CardTitle>Free Business Assessment</CardTitle>
              <CardDescription>
                Get an instant valuation of your business with our comprehensive analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-2xl font-bold text-green-600">$0</div>
                
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>EBITDA calculation and adjustments</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>10 business value drivers analysis</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>Valuation range estimate</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>Overall business grade (A-F)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>Value improvement calculator</span>
                  </li>
                </ul>

                <Button 
                  className="w-full gap-2"
                  onClick={() => setLocation('/assessments/free')}
                  data-testid="button-start-assessment"
                >
                  Start Free Assessment
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Growth Assessment - Upgrade Option */}
          <Card className="opacity-75 border-2 border-dashed">
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="h-8 w-8 text-blue-500" />
                <Badge variant="outline">Upgrade</Badge>
              </div>
              <CardTitle>Growth Assessment</CardTitle>
              <CardDescription>
                Unlock detailed insights and personalized recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-2xl font-bold text-blue-600">$497</div>
                
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-gray-400 mt-0.5" />
                    <span>Everything in Free Assessment</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-gray-400 mt-0.5" />
                    <span>Industry-specific multipliers</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-gray-400 mt-0.5" />
                    <span>30-minute consultation call</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-gray-400 mt-0.5" />
                    <span>AI coaching recommendations</span>
                  </li>
                </ul>

                <Button 
                  variant="outline" 
                  className="w-full"
                  disabled
                >
                  Available After Free Assessment
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Resources */}
        <Card className="shadow-soft-md border-border-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5" />
              What You'll Get
            </CardTitle>
            <CardDescription>
              Comprehensive insights to maximize your business value
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="h-2 w-2 rounded-full bg-green-500 mt-2" />
                  <div>
                    <p className="text-sm font-medium">Valuation Range</p>
                    <p className="text-xs text-muted-foreground">Industry-standard multiple-based estimation</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-2 w-2 rounded-full bg-green-500 mt-2" />
                  <div>
                    <p className="text-sm font-medium">Performance Grade</p>
                    <p className="text-xs text-muted-foreground">Overall business score from A to F</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-2 w-2 rounded-full bg-green-500 mt-2" />
                  <div>
                    <p className="text-sm font-medium">EBITDA Analysis</p>
                    <p className="text-xs text-muted-foreground">Detailed earnings calculation with adjustments</p>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="h-2 w-2 rounded-full bg-green-500 mt-2" />
                  <div>
                    <p className="text-sm font-medium">Value Drivers</p>
                    <p className="text-xs text-muted-foreground">Assessment of 10 key business factors</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-2 w-2 rounded-full bg-green-500 mt-2" />
                  <div>
                    <p className="text-sm font-medium">Improvement Calculator</p>
                    <p className="text-xs text-muted-foreground">See how upgrades impact your valuation</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-2 w-2 rounded-full bg-green-500 mt-2" />
                  <div>
                    <p className="text-sm font-medium">Action Insights</p>
                    <p className="text-xs text-muted-foreground">Specific recommendations for improvement</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Help Section */}
        <Alert className="mt-8">
          <Info className="h-4 w-4" />
          <AlertDescription>
            <strong>Need help?</strong> Our free assessment takes about 10-15 minutes to complete. 
            You'll need your recent financial statements including net income, interest, taxes, and depreciation.
          </AlertDescription>
        </Alert>
      </div>
    </ConsumerDashboardLayout>
  );
}