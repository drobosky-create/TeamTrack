import React, { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ConsumerDashboardLayout } from '@/components/layout/ConsumerDashboardLayout';
import { 
  Star, 
  FileText,
  TrendingUp,
  Clock,
  ArrowRight,
  CheckCircle,
  Info
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
      <div className="max-w-6xl mx-auto">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {userData.firstName}!</h1>
          <p className="text-muted-foreground text-lg">
            Get professional insights into your business value and discover improvement opportunities.
          </p>
        </div>

        {/* Available Assessments */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
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

        {/* Assessment History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Assessment History
            </CardTitle>
          </CardHeader>
          <CardContent>
            {assessmentHistory.length === 0 ? (
              <div className="text-center py-8">
                <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Assessments Yet</h3>
                <p className="text-muted-foreground mb-4">
                  Start your first free assessment to see your business valuation results here.
                </p>
                <Button 
                  onClick={() => setLocation('/assessments/free')}
                  className="gap-2"
                >
                  Start Your First Assessment
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Assessment history items would be listed here */}
              </div>
            )}
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