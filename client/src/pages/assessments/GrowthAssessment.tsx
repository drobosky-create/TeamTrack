import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { ArrowRight, Shield, Clock, FileText, TrendingUp } from 'lucide-react';

// Initialize Stripe
if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  console.error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}
const stripePromise = import.meta.env.VITE_STRIPE_PUBLIC_KEY 
  ? loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY)
  : null;

interface GrowthAssessmentData {
  // All fields from free assessment plus...
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  companyName: string;
  jobTitle: string;
  foundingYear: number;
  industry: string;
  naicsCode?: string;
  
  // Detailed financials
  annualRevenue: number;
  netIncome: number;
  interest: number;
  taxes: number;
  depreciation: number;
  amortization: number;
  
  // Owner adjustments
  ownerSalary: number;
  personalExpenses: number;
  oneTimeExpenses: number;
  otherAdjustments: number;
  adjustmentNotes: string;
  
  // All 10 value drivers
  financialPerformance: string;
  customerConcentration: string;
  managementTeam: string;
  competitivePosition: string;
  growthProspects: string;
  systemsProcesses: string;
  assetQuality: string;
  industryOutlook: string;
  riskFactors: string;
  ownerDependency: string;
  
  // Follow-up
  followUpIntent: string;
  additionalComments: string;
}

function GrowthAssessmentForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [clientSecret, setClientSecret] = useState('');
  const totalSteps = 7; // Including payment step
  
  const [formData, setFormData] = useState<GrowthAssessmentData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    companyName: '',
    jobTitle: '',
    foundingYear: new Date().getFullYear() - 5,
    industry: '',
    naicsCode: '',
    annualRevenue: 0,
    netIncome: 0,
    interest: 0,
    taxes: 0,
    depreciation: 0,
    amortization: 0,
    ownerSalary: 0,
    personalExpenses: 0,
    oneTimeExpenses: 0,
    otherAdjustments: 0,
    adjustmentNotes: '',
    financialPerformance: 'C',
    customerConcentration: 'C',
    managementTeam: 'C',
    competitivePosition: 'C',
    growthProspects: 'C',
    systemsProcesses: 'C',
    assetQuality: 'C',
    industryOutlook: 'C',
    riskFactors: 'C',
    ownerDependency: 'C',
    followUpIntent: 'yes',
    additionalComments: '',
  });

  // Create payment intent when reaching payment step
  useEffect(() => {
    if (step === totalSteps && !clientSecret) {
      apiRequest('POST', '/api/assessments/growth/create-payment', { 
        amount: 497, // $497 for growth assessment
        email: formData.email,
        companyName: formData.companyName,
      })
        .then(res => res.json())
        .then(data => {
          if (data.clientSecret) {
            setClientSecret(data.clientSecret);
          }
        })
        .catch(err => {
          toast({
            title: "Payment Setup Failed",
            description: "Unable to initialize payment. Please try again.",
            variant: "destructive",
          });
        });
    }
  }, [step, clientSecret, formData.email, formData.companyName]);

  const submitAssessment = useMutation({
    mutationFn: async (data: GrowthAssessmentData & { paymentIntentId?: string }) => {
      const response = await apiRequest('POST', '/api/assessments/growth', data);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Assessment Submitted Successfully!",
        description: "Your comprehensive growth assessment report is being prepared.",
      });
      setLocation(`/assessment-results/${data.id}`);
    },
    onError: (error: any) => {
      toast({
        title: "Submission Failed",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const handlePaymentSubmit = async () => {
    if (!stripe || !elements) return;

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin + '/assessment-complete',
      },
      redirect: 'if_required',
    });

    if (error) {
      toast({
        title: "Payment Failed",
        description: error.message,
        variant: "destructive",
      });
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      // Payment successful, submit assessment
      submitAssessment.mutate({
        ...formData,
        paymentIntentId: paymentIntent.id,
      });
    }
  };

  const handleNext = () => {
    if (step < totalSteps - 1) {
      setStep(step + 1);
    } else if (step === totalSteps - 1) {
      // Move to payment step
      setStep(totalSteps);
    } else {
      // Handle payment
      handlePaymentSubmit();
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const updateField = (field: keyof GrowthAssessmentData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => updateField('firstName', e.target.value)}
                  required
                  data-testid="input-first-name"
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name *</Label>
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
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => updateField('email', e.target.value)}
                required
                data-testid="input-email"
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone *</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => updateField('phone', e.target.value)}
                required
                data-testid="input-phone"
              />
            </div>
            <div>
              <Label htmlFor="companyName">Company Name *</Label>
              <Input
                id="companyName"
                value={formData.companyName}
                onChange={(e) => updateField('companyName', e.target.value)}
                required
                data-testid="input-company"
              />
            </div>
            <div>
              <Label htmlFor="jobTitle">Job Title</Label>
              <Input
                id="jobTitle"
                value={formData.jobTitle}
                onChange={(e) => updateField('jobTitle', e.target.value)}
                data-testid="input-job-title"
              />
            </div>
          </div>
        );
      
      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Business Information</h3>
            <div>
              <Label htmlFor="industry">Industry *</Label>
              <Input
                id="industry"
                value={formData.industry}
                onChange={(e) => updateField('industry', e.target.value)}
                placeholder="e.g., Technology, Healthcare, Manufacturing"
                required
                data-testid="input-industry"
              />
            </div>
            <div>
              <Label htmlFor="naicsCode">NAICS Code (Optional)</Label>
              <Input
                id="naicsCode"
                value={formData.naicsCode}
                onChange={(e) => updateField('naicsCode', e.target.value)}
                placeholder="6-digit NAICS code"
                data-testid="input-naics"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Providing your NAICS code helps us give more accurate industry-specific valuations
              </p>
            </div>
            <div>
              <Label htmlFor="foundingYear">Founding Year *</Label>
              <Input
                id="foundingYear"
                type="number"
                value={formData.foundingYear}
                onChange={(e) => updateField('foundingYear', parseInt(e.target.value))}
                min="1900"
                max={new Date().getFullYear()}
                required
                data-testid="input-founding-year"
              />
            </div>
            <div>
              <Label htmlFor="annualRevenue">Annual Revenue (Last 12 Months) *</Label>
              <Input
                id="annualRevenue"
                type="number"
                value={formData.annualRevenue}
                onChange={(e) => updateField('annualRevenue', parseFloat(e.target.value) || 0)}
                placeholder="Enter exact amount in dollars"
                required
                data-testid="input-annual-revenue"
              />
            </div>
          </div>
        );
      
      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Financial Details (Last 12 Months)</h3>
            <p className="text-sm text-muted-foreground">
              These values help us calculate your adjusted EBITDA for a more accurate valuation.
            </p>
            <div>
              <Label htmlFor="netIncome">Net Income ($) *</Label>
              <Input
                id="netIncome"
                type="number"
                value={formData.netIncome}
                onChange={(e) => updateField('netIncome', parseFloat(e.target.value) || 0)}
                required
                data-testid="input-net-income"
              />
            </div>
            <div>
              <Label htmlFor="interest">Interest Expense ($)</Label>
              <Input
                id="interest"
                type="number"
                value={formData.interest}
                onChange={(e) => updateField('interest', parseFloat(e.target.value) || 0)}
                data-testid="input-interest"
              />
            </div>
            <div>
              <Label htmlFor="taxes">Taxes Paid ($)</Label>
              <Input
                id="taxes"
                type="number"
                value={formData.taxes}
                onChange={(e) => updateField('taxes', parseFloat(e.target.value) || 0)}
                data-testid="input-taxes"
              />
            </div>
            <div>
              <Label htmlFor="depreciation">Depreciation ($)</Label>
              <Input
                id="depreciation"
                type="number"
                value={formData.depreciation}
                onChange={(e) => updateField('depreciation', parseFloat(e.target.value) || 0)}
                data-testid="input-depreciation"
              />
            </div>
            <div>
              <Label htmlFor="amortization">Amortization ($)</Label>
              <Input
                id="amortization"
                type="number"
                value={formData.amortization}
                onChange={(e) => updateField('amortization', parseFloat(e.target.value) || 0)}
                data-testid="input-amortization"
              />
            </div>
          </div>
        );
      
      case 4:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Owner Adjustments</h3>
            <p className="text-sm text-muted-foreground">
              Help us normalize your financials by identifying owner-specific expenses.
            </p>
            <div>
              <Label htmlFor="ownerSalary">Owner's Total Compensation ($)</Label>
              <Input
                id="ownerSalary"
                type="number"
                value={formData.ownerSalary}
                onChange={(e) => updateField('ownerSalary', parseFloat(e.target.value) || 0)}
                data-testid="input-owner-salary"
              />
            </div>
            <div>
              <Label htmlFor="personalExpenses">Personal Expenses Run Through Business ($)</Label>
              <Input
                id="personalExpenses"
                type="number"
                value={formData.personalExpenses}
                onChange={(e) => updateField('personalExpenses', parseFloat(e.target.value) || 0)}
                data-testid="input-personal-expenses"
              />
            </div>
            <div>
              <Label htmlFor="oneTimeExpenses">One-Time/Non-Recurring Expenses ($)</Label>
              <Input
                id="oneTimeExpenses"
                type="number"
                value={formData.oneTimeExpenses}
                onChange={(e) => updateField('oneTimeExpenses', parseFloat(e.target.value) || 0)}
                data-testid="input-one-time-expenses"
              />
            </div>
            <div>
              <Label htmlFor="otherAdjustments">Other Adjustments ($)</Label>
              <Input
                id="otherAdjustments"
                type="number"
                value={formData.otherAdjustments}
                onChange={(e) => updateField('otherAdjustments', parseFloat(e.target.value) || 0)}
                data-testid="input-other-adjustments"
              />
            </div>
            <div>
              <Label htmlFor="adjustmentNotes">Adjustment Notes</Label>
              <Textarea
                id="adjustmentNotes"
                value={formData.adjustmentNotes}
                onChange={(e) => updateField('adjustmentNotes', e.target.value)}
                placeholder="Explain any adjustments or special circumstances..."
                rows={3}
                data-testid="input-adjustment-notes"
              />
            </div>
          </div>
        );
      
      case 5:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Core Value Drivers</h3>
            <p className="text-sm text-muted-foreground">
              Rate these key aspects from A (Excellent) to F (Poor)
            </p>
            
            {[
              { field: 'financialPerformance', label: 'Financial Performance' },
              { field: 'customerConcentration', label: 'Customer Diversification' },
              { field: 'managementTeam', label: 'Management Team Strength' },
              { field: 'competitivePosition', label: 'Competitive Position' },
              { field: 'growthProspects', label: 'Growth Prospects' },
            ].map(({ field, label }) => (
              <div key={field}>
                <Label className="mb-2">{label}</Label>
                <RadioGroup
                  value={formData[field as keyof GrowthAssessmentData] as string}
                  onValueChange={(value) => updateField(field as keyof GrowthAssessmentData, value)}
                  className="flex flex-row space-x-4"
                >
                  {['A', 'B', 'C', 'D', 'F'].map((grade) => (
                    <div key={grade} className="flex items-center space-x-1">
                      <RadioGroupItem value={grade} id={`${field}-${grade}`} />
                      <Label htmlFor={`${field}-${grade}`}>{grade}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            ))}
          </div>
        );
      
      case 6:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Additional Value Drivers</h3>
            <p className="text-sm text-muted-foreground">
              Complete your assessment with these additional factors
            </p>
            
            {[
              { field: 'systemsProcesses', label: 'Systems & Processes' },
              { field: 'assetQuality', label: 'Asset Quality' },
              { field: 'industryOutlook', label: 'Industry Outlook' },
              { field: 'riskFactors', label: 'Risk Management' },
              { field: 'ownerDependency', label: 'Owner Independence' },
            ].map(({ field, label }) => (
              <div key={field}>
                <Label className="mb-2">{label}</Label>
                <RadioGroup
                  value={formData[field as keyof GrowthAssessmentData] as string}
                  onValueChange={(value) => updateField(field as keyof GrowthAssessmentData, value)}
                  className="flex flex-row space-x-4"
                >
                  {['A', 'B', 'C', 'D', 'F'].map((grade) => (
                    <div key={grade} className="flex items-center space-x-1">
                      <RadioGroupItem value={grade} id={`${field}-${grade}`} />
                      <Label htmlFor={`${field}-${grade}`}>{grade}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            ))}
            
            <div className="mt-6">
              <Label htmlFor="followUpIntent">Follow-Up Preference</Label>
              <Select
                value={formData.followUpIntent}
                onValueChange={(value) => updateField('followUpIntent', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your preference" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Schedule a consultation call</SelectItem>
                  <SelectItem value="maybe">Send me more information</SelectItem>
                  <SelectItem value="no">Just the report, thanks</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );
      
      case 7: // Payment step
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Complete Your Purchase</h3>
            
            <div className="bg-muted/50 p-4 rounded-lg space-y-2">
              <h4 className="font-medium">Growth Assessment Package</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Comprehensive 20+ page valuation report
                </li>
                <li className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Industry-specific analysis and benchmarking
                </li>
                <li className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  30-minute consultation call included
                </li>
                <li className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  100% satisfaction guarantee
                </li>
              </ul>
              <div className="pt-2 border-t">
                <p className="text-lg font-semibold">Total: $497</p>
              </div>
            </div>

            {clientSecret && (
              <div className="space-y-4">
                <PaymentElement />
                <p className="text-xs text-muted-foreground">
                  Your payment information is secure and encrypted. We never store your card details.
                </p>
              </div>
            )}
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-12">
      <div className="container max-w-3xl mx-auto px-4">
        <Card>
          <CardHeader>
            <CardTitle>Growth Business Assessment</CardTitle>
            <CardDescription>
              Get a comprehensive valuation report with personalized insights and recommendations
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between text-sm text-muted-foreground mb-2">
                <span>Step {step} of {totalSteps}</span>
                <span>{Math.round((step / totalSteps) * 100)}% Complete</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(step / totalSteps) * 100}%` }}
                />
              </div>
            </div>

            {/* Form Content */}
            <div className="min-h-[400px]">
              {renderStep()}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={step === 1}
                className="border-gray-400 text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                data-testid="button-back"
              >
                Back
              </Button>
              <Button
                onClick={handleNext}
                disabled={submitAssessment.isPending || (step === totalSteps && !stripe)}
                className="bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                style={{ backgroundColor: '#2563eb', color: '#ffffff' }}
                data-testid="button-next"
              >
                {step === totalSteps ? (
                  submitAssessment.isPending ? 'Processing...' : 'Complete Purchase'
                ) : (
                  <>
                    Next
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function GrowthAssessment() {
  if (!stripePromise) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardContent className="pt-6">
            <p className="text-destructive">Payment system is not configured. Please contact support.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise}>
      <GrowthAssessmentForm />
    </Elements>
  );
}