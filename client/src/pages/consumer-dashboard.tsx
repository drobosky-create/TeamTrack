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

        {/* Quick Stats Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="shadow-soft border-border-soft">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Free Assessment</CardTitle>
              <Star className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">Available</div>
              <p className="text-xs text-success">Get instant valuation</p>
            </CardContent>
          </Card>

          <Card className="shadow-soft border-border-soft">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Assessments Taken</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{assessmentHistory.length}</div>
              <p className="text-xs text-muted-foreground">Completed</p>
            </CardContent>
          </Card>

          <Card className="shadow-soft border-border-soft">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Business Grade</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">--</div>
              <p className="text-xs text-muted-foreground">Complete assessment</p>
            </CardContent>
          </Card>

          <Card className="shadow-soft border-border-soft">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Estimated Value</CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">--</div>
              <p className="text-xs text-muted-foreground">Start assessment</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Get Started Section */}
          <Card className="shadow-soft-md border-border-soft">
            <CardHeader>
              <CardTitle>Get Started with Your Valuation</CardTitle>
              <CardDescription>
                Our comprehensive assessment analyzes your business across 10 key value drivers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">EBITDA Analysis</p>
                    <p className="text-xs text-muted-foreground">Calculate adjusted earnings before interest, taxes, depreciation, and amortization</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Value Drivers Assessment</p>
                    <p className="text-xs text-muted-foreground">Evaluate 10 critical factors that impact your business value</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Business Grade</p>
                    <p className="text-xs text-muted-foreground">Receive an overall grade (A-F) based on your performance</p>
                  </div>
                </div>
              </div>
              
              <Button 
                className="w-full gap-2"
                onClick={() => setLocation('/assessments/free')}
                data-testid="button-start-assessment"
              >
                Start Free Assessment
                <ArrowRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          {/* Assessment Progress & History */}
          <Card className="shadow-soft-md border-border-soft">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Assessment Progress
                <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
                  View All <ArrowRight className="h-3 w-3 ml-1" />
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