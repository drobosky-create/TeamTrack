import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Link, useLocation, useSearch } from 'wouter';
import { ArrowLeft, Building2, Mail, Phone, User, CheckCircle } from 'lucide-react';

export default function ConsumerSignup() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const searchParams = useSearch();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    companyName: '',
    password: '',
    confirmPassword: '',
  });
  const [isPaidPlan, setIsPaidPlan] = useState(false);

  // Check for payment success and prefill data
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    const paymentStatus = params.get('payment');
    const plan = params.get('plan');
    
    if (paymentStatus === 'success' && plan === 'growth') {
      setIsPaidPlan(true);
      
      // Get stored purchase data from session storage
      const purchaseData = sessionStorage.getItem('applebites_purchase');
      if (purchaseData) {
        const data = JSON.parse(purchaseData);
        const [firstName, ...lastNameParts] = (data.name || '').split(' ');
        setFormData(prev => ({
          ...prev,
          email: data.email || '',
          firstName: firstName || '',
          lastName: lastNameParts.join(' ') || '',
        }));
        
        // Clear the session storage after using it
        sessionStorage.removeItem('applebites_purchase');
      }
      
      toast({
        title: "Payment Successful!",
        description: "Complete your registration to access AppleBites Growth & Exit features.",
        duration: 5000,
      });
    }
  }, [searchParams, toast]);

  const signupMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await apiRequest('POST', '/api/auth/consumer-signup', data);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Account Created Successfully!",
        description: "You can now access the business assessment.",
      });
      // Store user data in session
      localStorage.setItem('consumerUser', JSON.stringify(data.user));
      // Redirect to consumer dashboard
      setLocation('/consumer-dashboard');
    },
    onError: (error: any) => {
      toast({
        title: "Signup Failed",
        description: error.message || "Please check your information and try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Passwords Don't Match",
        description: "Please ensure both passwords are the same.",
        variant: "destructive",
      });
      return;
    }

    // Validate password strength
    if (formData.password.length < 8) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 8 characters long.",
        variant: "destructive",
      });
      return;
    }

    signupMutation.mutate(formData);
  };

  const updateField = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-12">
      <div className="container max-w-md mx-auto px-4">
        <div className="mb-6">
          <Link href="/applebites">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to AppleBites
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Create Your AppleBites Account</CardTitle>
            <CardDescription>
              {isPaidPlan ? (
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="h-5 w-5" />
                  Growth & Exit Plan Purchased - Complete registration to access
                </div>
              ) : (
                'Sign up to access your free business valuation assessment'
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => updateField('firstName', e.target.value)}
                      className="pl-10"
                      required
                      data-testid="input-first-name"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => updateField('lastName', e.target.value)}
                    required
                    data-testid="input-last-name"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    className="pl-10"
                    required
                    data-testid="input-email"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => updateField('phone', e.target.value)}
                    className="pl-10"
                    required
                    data-testid="input-phone"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="companyName">Company Name</Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="companyName"
                    value={formData.companyName}
                    onChange={(e) => updateField('companyName', e.target.value)}
                    className="pl-10"
                    required
                    data-testid="input-company"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => updateField('password', e.target.value)}
                  required
                  minLength={8}
                  data-testid="input-password"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Must be at least 8 characters
                </p>
              </div>

              <div>
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => updateField('confirmPassword', e.target.value)}
                  required
                  data-testid="input-confirm-password"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 text-white hover:bg-blue-700"
                style={{ backgroundColor: '#2563eb', color: '#ffffff' }}
                disabled={signupMutation.isPending}
                data-testid="button-signup"
              >
                {signupMutation.isPending ? 'Creating Account...' : 'Create Account'}
              </Button>

              <div className="text-center text-sm">
                <span className="text-muted-foreground">Already have an account? </span>
                <Link href="/consumer-login" className="text-primary hover:underline">
                  Sign In
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}