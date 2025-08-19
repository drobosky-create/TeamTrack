import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { ArrowRight, Building2, DollarSign, TrendingUp, Users } from 'lucide-react';

interface AssessmentData {
  // Contact Info
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  companyName: string;
  jobTitle: string;
  
  // Business Info
  foundingYear: number;
  industry: string;
  annualRevenue: string;
  employeeCount: string;
  
  // Financial Data
  netIncome: number;
  interest: number;
  taxes: number;
  depreciation: number;
  amortization: number;
  
  // Value Drivers (A-F grades)
  financialPerformance: string;
  customerConcentration: string;
  managementTeam: string;
  competitivePosition: string;
  growthProspects: string;
  
  // Follow-up
  followUpIntent: string;
  additionalComments: string;
}

export default function FreeAssessment() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const totalSteps = 5;
  
  const [formData, setFormData] = useState<AssessmentData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    companyName: '',
    jobTitle: '',
    foundingYear: new Date().getFullYear() - 5,
    industry: '',
    annualRevenue: '',
    employeeCount: '',
    netIncome: 0,
    interest: 0,
    taxes: 0,
    depreciation: 0,
    amortization: 0,
    financialPerformance: 'C',
    customerConcentration: 'C',
    managementTeam: 'C',
    competitivePosition: 'C',
    growthProspects: 'C',
    followUpIntent: 'maybe',
    additionalComments: '',
  });

  const submitAssessment = useMutation({
    mutationFn: async (data: AssessmentData) => {
      const response = await apiRequest('POST', '/api/assessments/free', data);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Assessment Submitted!",
        description: "Your free business valuation report is being generated.",
      });
      // Navigate to results page
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

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      // Submit the assessment
      submitAssessment.mutate(formData);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const updateField = (field: keyof AssessmentData, value: any) => {
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
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => updateField('firstName', e.target.value)}
                  required
                  data-testid="input-first-name"
                />
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
              <Label htmlFor="email">Email</Label>
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
              <Label htmlFor="phone">Phone</Label>
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
              <Label htmlFor="companyName">Company Name</Label>
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
              <Label htmlFor="industry">Industry</Label>
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
              <Label htmlFor="foundingYear">Founding Year</Label>
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
              <Label htmlFor="annualRevenue">Annual Revenue Range</Label>
              <RadioGroup
                value={formData.annualRevenue}
                onValueChange={(value) => updateField('annualRevenue', value)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="0-1M" id="rev1" />
                  <Label htmlFor="rev1">$0 - $1M</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="1M-5M" id="rev2" />
                  <Label htmlFor="rev2">$1M - $5M</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="5M-10M" id="rev3" />
                  <Label htmlFor="rev3">$5M - $10M</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="10M-50M" id="rev4" />
                  <Label htmlFor="rev4">$10M - $50M</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="50M+" id="rev5" />
                  <Label htmlFor="rev5">$50M+</Label>
                </div>
              </RadioGroup>
            </div>
            <div>
              <Label htmlFor="employeeCount">Number of Employees</Label>
              <RadioGroup
                value={formData.employeeCount}
                onValueChange={(value) => updateField('employeeCount', value)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="1-10" id="emp1" />
                  <Label htmlFor="emp1">1-10</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="11-50" id="emp2" />
                  <Label htmlFor="emp2">11-50</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="51-200" id="emp3" />
                  <Label htmlFor="emp3">51-200</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="200+" id="emp4" />
                  <Label htmlFor="emp4">200+</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        );
      
      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Financial Information (Last 12 Months)</h3>
            <p className="text-sm text-muted-foreground">
              Enter approximate values. These will be used to calculate your business's EBITDA.
            </p>
            <div>
              <Label htmlFor="netIncome">Net Income ($)</Label>
              <Input
                id="netIncome"
                type="number"
                value={formData.netIncome}
                onChange={(e) => updateField('netIncome', parseFloat(e.target.value) || 0)}
                placeholder="0"
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
                placeholder="0"
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
                placeholder="0"
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
                placeholder="0"
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
                placeholder="0"
                data-testid="input-amortization"
              />
            </div>
          </div>
        );
      
      case 4:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Business Value Drivers</h3>
            <p className="text-sm text-muted-foreground">
              Rate each aspect of your business from A (Excellent) to F (Poor)
            </p>
            
            {[
              { field: 'financialPerformance', label: 'Financial Performance', icon: DollarSign },
              { field: 'customerConcentration', label: 'Customer Diversification', icon: Users },
              { field: 'managementTeam', label: 'Management Team Strength', icon: Building2 },
              { field: 'competitivePosition', label: 'Competitive Position', icon: TrendingUp },
              { field: 'growthProspects', label: 'Growth Prospects', icon: TrendingUp },
            ].map(({ field, label, icon: Icon }) => (
              <div key={field}>
                <div className="flex items-center gap-2 mb-2">
                  <Icon className="h-4 w-4" />
                  <Label>{label}</Label>
                </div>
                <RadioGroup
                  value={formData[field as keyof AssessmentData] as string}
                  onValueChange={(value) => updateField(field as keyof AssessmentData, value)}
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
      
      case 5:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Follow-Up Information</h3>
            <div>
              <Label>Would you like to discuss your valuation with an advisor?</Label>
              <RadioGroup
                value={formData.followUpIntent}
                onValueChange={(value) => updateField('followUpIntent', value)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="follow-yes" />
                  <Label htmlFor="follow-yes">Yes, I'd like to schedule a consultation</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="maybe" id="follow-maybe" />
                  <Label htmlFor="follow-maybe">Maybe, send me more information</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="follow-no" />
                  <Label htmlFor="follow-no">No, just the report please</Label>
                </div>
              </RadioGroup>
            </div>
            <div>
              <Label htmlFor="comments">Additional Comments (Optional)</Label>
              <Textarea
                id="comments"
                value={formData.additionalComments}
                onChange={(e) => updateField('additionalComments', e.target.value)}
                placeholder="Tell us more about your business or any specific questions you have..."
                rows={4}
                data-testid="input-comments"
              />
            </div>
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
            <CardTitle>Free Business Valuation Assessment</CardTitle>
            <CardDescription>
              Get an instant estimate of your business value in just 5 minutes
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
                data-testid="button-back"
              >
                Back
              </Button>
              <Button
                onClick={handleNext}
                disabled={submitAssessment.isPending}
                data-testid="button-next"
              >
                {step === totalSteps ? (
                  submitAssessment.isPending ? 'Submitting...' : 'Submit Assessment'
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