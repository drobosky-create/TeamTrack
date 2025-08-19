import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Link, useLocation } from 'wouter';
import { ArrowLeft, CheckCircle, Crown, Sparkles, Lock } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-8">
      <div className="container max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <Link href="/applebites">
              <Button variant="ghost" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to AppleBites
              </Button>
            </Link>
          </div>
          <Button onClick={handleLogout} variant="outline">
            Logout
          </Button>
        </div>

        {/* Welcome Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-3xl">
              Welcome back, {user.firstName}!
            </CardTitle>
            <CardDescription className="text-lg">
              {user.companyName}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3 mb-4">
              {getPlanIcon()}
              <div>
                <p className="text-lg font-semibold">{getPlanName()}</p>
                <p className="text-sm text-gray-600">Your current subscription</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Plan Features */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Your Plan Features</CardTitle>
            <CardDescription>
              Here's what's included in your {getPlanName()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {getPlanFeatures().map((feature, index) => (
                <div key={index} className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Action Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">Start Assessment</CardTitle>
              <CardDescription>
                Begin your business valuation assessment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full" 
                disabled={user.plan === 'free'}
                data-testid="button-start-assessment"
              >
                {user.plan === 'free' ? (
                  <>
                    <Lock className="h-4 w-4 mr-2" />
                    Upgrade to Access
                  </>
                ) : (
                  'Start Now'
                )}
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">View Reports</CardTitle>
              <CardDescription>
                Access your valuation reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full" 
                variant="outline"
                disabled={user.plan === 'free'}
                data-testid="button-view-reports"
              >
                {user.plan === 'free' ? 'No Reports Yet' : 'View Reports'}
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">Schedule Call</CardTitle>
              <CardDescription>
                Book your consultation call
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full" 
                variant="outline"
                disabled={user.plan === 'free'}
                data-testid="button-schedule-call"
              >
                {user.plan === 'free' ? (
                  <>
                    <Lock className="h-4 w-4 mr-2" />
                    Upgrade Required
                  </>
                ) : (
                  'Schedule Now'
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Upgrade CTA for Free Users */}
        {user.plan === 'free' && (
          <Card className="mt-8 border-green-500 border-2">
            <CardContent className="pt-6">
              <div className="text-center">
                <Crown className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Unlock Full Access</h3>
                <p className="text-gray-600 mb-4">
                  Upgrade to the Growth & Exit Plan to access all features and get your complete business valuation.
                </p>
                <Link href="/applebites-checkout">
                  <Button className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700">
                    Upgrade Now - $1,995
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}