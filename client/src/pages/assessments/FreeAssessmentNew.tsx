import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { 
  ArrowRight, 
  ArrowLeft,
  DollarSign,
  Calculator,
  TrendingUp,
  MessageSquare,
  Info,
  CheckCircle
} from 'lucide-react';

interface AssessmentData {
  // Financials
  netIncome: number;
  interestExpense: number;
  taxExpense: number;
  depreciation: number;
  
  // Adjustments
  excessOwnerCompensation: number;
  personalExpenses: number;
  oneTimeExpenses: number;
  otherAdjustments: number;
  adjustmentNotes: string;
  
  // Value Drivers (A-F grades)
  financialPerformance: string;
  customerConcentration: string;
  managementTeamStrength: string;
  competitivePosition: string;
  growthProspects: string;
  systemsProcesses: string;
  assetQuality: string;
  industryOutlook: string;
  riskFactors: string;
  ownerDependency: string;
  
  // Follow-up
  consultationPreference: string;
  additionalComments: string;
}

const gradeOptions = ['A', 'B', 'C', 'D', 'F'];

export default function FreeAssessment() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const totalSteps = 4;
  
  // Check if user is authenticated
  const [userData, setUserData] = useState<any>(null);
  
  useEffect(() => {
    const user = localStorage.getItem('consumerUser');
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to access the assessment.",
        variant: "destructive",
      });
      setLocation('/consumer-signup');
    } else {
      setUserData(JSON.parse(user));
    }
  }, []);

  const [formData, setFormData] = useState<AssessmentData>({
    // Financials
    netIncome: 0,
    interestExpense: 0,
    taxExpense: 0,
    depreciation: 0,
    
    // Adjustments
    excessOwnerCompensation: 0,
    personalExpenses: 0,
    oneTimeExpenses: 0,
    otherAdjustments: 0,
    adjustmentNotes: '',
    
    // Value Drivers - default to C grade
    financialPerformance: 'C',
    customerConcentration: 'C',
    managementTeamStrength: 'C',
    competitivePosition: 'C',
    growthProspects: 'C',
    systemsProcesses: 'C',
    assetQuality: 'C',
    industryOutlook: 'C',
    riskFactors: 'C',
    ownerDependency: 'C',
    
    // Follow-up
    consultationPreference: 'maybe',
    additionalComments: '',
  });

  const submitAssessment = useMutation({
    mutationFn: async (data: AssessmentData) => {
      // Include user data from authentication
      const assessmentPayload = {
        ...data,
        ...userData,
        tier: 'free'
      };
      const response = await apiRequest('POST', '/api/assessments/free', assessmentPayload);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Report Generated!",
        description: "Your business valuation report is ready.",
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

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      submitAssessment.mutate(formData);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const updateField = (field: keyof AssessmentData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const calculateEBITDA = () => {
    const ebitda = 
      formData.netIncome + 
      formData.interestExpense + 
      formData.taxExpense + 
      formData.depreciation;
    
    const adjustedEbitda = ebitda +
      formData.excessOwnerCompensation +
      formData.personalExpenses +
      formData.oneTimeExpenses +
      formData.otherAdjustments;
    
    return { ebitda, adjustedEbitda };
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <DollarSign className="h-6 w-6 text-blue-600" />
              <h3 className="text-lg font-semibold">Financial Information</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Please provide your company's financial information for the most recent fiscal year to calculate EBITDA.
            </p>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="netIncome">Net Income *</Label>
                <Input
                  id="netIncome"
                  type="number"
                  value={formData.netIncome}
                  onChange={(e) => updateField('netIncome', parseFloat(e.target.value) || 0)}
                  placeholder="0"
                  data-testid="input-net-income"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Your company's net income for the most recent fiscal year
                </p>
              </div>

              <div>
                <Label htmlFor="interestExpense">Interest Expense *</Label>
                <Input
                  id="interestExpense"
                  type="number"
                  value={formData.interestExpense}
                  onChange={(e) => updateField('interestExpense', parseFloat(e.target.value) || 0)}
                  placeholder="0"
                  data-testid="input-interest"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Interest paid on loans and credit facilities
                </p>
              </div>

              <div>
                <Label htmlFor="taxExpense">Tax Expense *</Label>
                <Input
                  id="taxExpense"
                  type="number"
                  value={formData.taxExpense}
                  onChange={(e) => updateField('taxExpense', parseFloat(e.target.value) || 0)}
                  placeholder="0"
                  data-testid="input-tax"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Income tax expenses for the fiscal year
                </p>
              </div>

              <div>
                <Label htmlFor="depreciation">Depreciation & Amortization *</Label>
                <Input
                  id="depreciation"
                  type="number"
                  value={formData.depreciation}
                  onChange={(e) => updateField('depreciation', parseFloat(e.target.value) || 0)}
                  placeholder="0"
                  data-testid="input-depreciation"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Total depreciation and amortization expenses
                </p>
              </div>
            </div>

            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-2">
                  <Calculator className="h-5 w-5 text-blue-600" />
                  <p className="font-semibold">EBITDA Calculation</p>
                </div>
                <p className="text-2xl font-bold text-blue-600">
                  ${calculateEBITDA().ebitda.toLocaleString()}
                </p>
              </CardContent>
            </Card>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <Calculator className="h-6 w-6 text-blue-600" />
              <h3 className="text-lg font-semibold">EBITDA Adjustments</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Add back one-time, non-recurring, or personal expenses to calculate adjusted EBITDA.
            </p>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="excessOwnerComp">Excess Owner Compensation</Label>
                <Input
                  id="excessOwnerComp"
                  type="number"
                  value={formData.excessOwnerCompensation}
                  onChange={(e) => updateField('excessOwnerCompensation', parseFloat(e.target.value) || 0)}
                  placeholder="0"
                  data-testid="input-excess-comp"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Amount paid to owner above market rate for the position
                </p>
              </div>

              <div>
                <Label htmlFor="personalExpenses">Personal Expenses</Label>
                <Input
                  id="personalExpenses"
                  type="number"
                  value={formData.personalExpenses}
                  onChange={(e) => updateField('personalExpenses', parseFloat(e.target.value) || 0)}
                  placeholder="0"
                  data-testid="input-personal-expenses"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Personal expenses run through business (travel, meals, etc.)
                </p>
              </div>

              <div>
                <Label htmlFor="oneTimeExpenses">One-Time Expenses</Label>
                <Input
                  id="oneTimeExpenses"
                  type="number"
                  value={formData.oneTimeExpenses}
                  onChange={(e) => updateField('oneTimeExpenses', parseFloat(e.target.value) || 0)}
                  placeholder="0"
                  data-testid="input-one-time"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Non-recurring expenses (legal fees, moving costs, etc.)
                </p>
              </div>

              <div>
                <Label htmlFor="otherAdjustments">Other Adjustments</Label>
                <Input
                  id="otherAdjustments"
                  type="number"
                  value={formData.otherAdjustments}
                  onChange={(e) => updateField('otherAdjustments', parseFloat(e.target.value) || 0)}
                  placeholder="0"
                  data-testid="input-other-adjustments"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Other legitimate business adjustments
                </p>
              </div>

              <div>
                <Label htmlFor="adjustmentNotes">Notes (Optional)</Label>
                <Textarea
                  id="adjustmentNotes"
                  value={formData.adjustmentNotes}
                  onChange={(e) => updateField('adjustmentNotes', e.target.value)}
                  placeholder="Additional context for your adjustments..."
                  rows={3}
                  data-testid="input-adjustment-notes"
                />
              </div>
            </div>

            <Card className="bg-green-50 border-green-200">
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Base EBITDA:</span>
                    <span className="font-semibold">${calculateEBITDA().ebitda.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-green-600">
                    <span className="text-sm">Total Adjustments:</span>
                    <span className="font-semibold">
                      +${(formData.excessOwnerCompensation + formData.personalExpenses + 
                          formData.oneTimeExpenses + formData.otherAdjustments).toLocaleString()}
                    </span>
                  </div>
                  <div className="border-t pt-2 flex justify-between">
                    <span className="font-semibold">Adjusted EBITDA:</span>
                    <span className="text-xl font-bold text-green-600">
                      ${calculateEBITDA().adjustedEbitda.toLocaleString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 3:
        const valueDrivers = [
          { key: 'financialPerformance', label: 'Financial Performance', desc: 'Revenue growth, profitability trends, and financial stability' },
          { key: 'customerConcentration', label: 'Customer Concentration', desc: 'Diversification of customer base and revenue concentration risk' },
          { key: 'managementTeamStrength', label: 'Management Team Strength', desc: 'Quality and depth of management team, succession planning' },
          { key: 'competitivePosition', label: 'Competitive Position', desc: 'Market share, competitive advantages, and barriers to entry' },
          { key: 'growthProspects', label: 'Growth Prospects', desc: 'Market growth potential and expansion opportunities' },
          { key: 'systemsProcesses', label: 'Systems & Processes', desc: 'Operational systems and documentation' },
          { key: 'assetQuality', label: 'Asset Quality', desc: 'Condition and value of business assets' },
          { key: 'industryOutlook', label: 'Industry Outlook', desc: 'Industry trends and future prospects' },
          { key: 'riskFactors', label: 'Risk Factors', desc: 'Overall business risk assessment' },
          { key: 'ownerDependency', label: 'Owner Dependency', desc: 'Business dependence on current owner' },
        ];

        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="h-6 w-6 text-blue-600" />
              <h3 className="text-lg font-semibold">Value Drivers Assessment</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Rate each factor that impacts your business value from A (excellent) to F (poor).
            </p>
            
            <div className="space-y-4">
              {valueDrivers.map((driver) => (
                <Card key={driver.key} className="p-4">
                  <div className="space-y-3">
                    <div>
                      <Label className="text-base font-medium">{driver.label}</Label>
                      <p className="text-xs text-muted-foreground mt-1">{driver.desc}</p>
                    </div>
                    <RadioGroup
                      value={formData[driver.key as keyof AssessmentData] as string}
                      onValueChange={(value) => updateField(driver.key as keyof AssessmentData, value)}
                      className="flex gap-4"
                    >
                      {gradeOptions.map((grade) => (
                        <div key={grade} className="flex items-center">
                          <RadioGroupItem
                            value={grade}
                            id={`${driver.key}-${grade}`}
                            className="peer sr-only"
                          />
                          <Label
                            htmlFor={`${driver.key}-${grade}`}
                            className={`
                              px-3 py-2 rounded-md cursor-pointer border-2 transition-all
                              ${formData[driver.key as keyof AssessmentData] === grade 
                                ? grade === 'A' ? 'bg-green-100 border-green-500 text-green-700'
                                : grade === 'B' ? 'bg-blue-100 border-blue-500 text-blue-700'
                                : grade === 'C' ? 'bg-yellow-100 border-yellow-500 text-yellow-700'
                                : grade === 'D' ? 'bg-orange-100 border-orange-500 text-orange-700'
                                : 'bg-red-100 border-red-500 text-red-700'
                                : 'bg-white border-gray-300 hover:border-gray-400'
                              }
                            `}
                          >
                            {grade}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <MessageSquare className="h-6 w-6 text-blue-600" />
              <h3 className="text-lg font-semibold">Follow-up Preferences</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Let us know how you'd like to proceed after receiving your valuation report.
            </p>
            
            <Card className="p-6">
              <Label className="text-base font-medium mb-4 block">
                Would you like to discuss your valuation results with one of our experts?
              </Label>
              <RadioGroup
                value={formData.consultationPreference}
                onValueChange={(value) => updateField('consultationPreference', value)}
                className="space-y-3"
              >
                <div className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-gray-50">
                  <RadioGroupItem value="yes" id="consultation-yes" />
                  <div className="flex-1">
                    <Label htmlFor="consultation-yes" className="cursor-pointer">
                      <span className="font-medium">Yes, schedule a consultation</span>
                      <p className="text-sm text-muted-foreground mt-1">
                        I'd like to discuss the results and explore options for improving my business value or preparing for a potential sale.
                      </p>
                    </Label>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-gray-50">
                  <RadioGroupItem value="maybe" id="consultation-maybe" />
                  <div className="flex-1">
                    <Label htmlFor="consultation-maybe" className="cursor-pointer">
                      <span className="font-medium">Maybe later</span>
                      <p className="text-sm text-muted-foreground mt-1">
                        I'd like to review the report first and may be interested in follow-up services in the future.
                      </p>
                    </Label>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-gray-50">
                  <RadioGroupItem value="no" id="consultation-no" />
                  <div className="flex-1">
                    <Label htmlFor="consultation-no" className="cursor-pointer">
                      <span className="font-medium">No, just the report</span>
                      <p className="text-sm text-muted-foreground mt-1">
                        I only need the valuation report at this time.
                      </p>
                    </Label>
                  </div>
                </div>
              </RadioGroup>
            </Card>

            <div>
              <Label htmlFor="comments">Additional Comments (Optional)</Label>
              <Textarea
                id="comments"
                value={formData.additionalComments}
                onChange={(e) => updateField('additionalComments', e.target.value)}
                placeholder="Any specific questions or areas you'd like to focus on during the consultation..."
                rows={4}
                data-testid="input-comments"
              />
            </div>

            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="pt-6">
                <h4 className="font-semibold mb-3">Ready to Generate Report</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Your comprehensive business valuation report will include:
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span className="text-sm">Detailed EBITDA calculation and adjustments</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span className="text-sm">Value driver analysis and scoring</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span className="text-sm">Business valuation range estimate</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span className="text-sm">Recommendations for value improvement</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span className="text-sm">Follow-up consultation scheduling (if requested)</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        );
      
      default:
        return null;
    }
  };

  const getStepTitle = () => {
    switch (step) {
      case 1: return 'Financials';
      case 2: return 'Adjustments';
      case 3: return 'Value Drivers';
      case 4: return 'Follow-up';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-12">
      <div className="container max-w-3xl mx-auto px-4">
        <Card>
          <CardHeader>
            <CardTitle>Free Business Valuation Assessment</CardTitle>
            <CardDescription>
              Get an instant estimate of your business value
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Progress Steps */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                {[1, 2, 3, 4].map((stepNumber) => (
                  <div key={stepNumber} className="flex-1 flex items-center">
                    <div className="flex flex-col items-center w-full">
                      <div
                        className={`
                          w-10 h-10 rounded-full flex items-center justify-center font-semibold
                          ${step >= stepNumber 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-gray-200 text-gray-500'}
                        `}
                      >
                        {step > stepNumber ? <CheckCircle className="h-5 w-5" /> : stepNumber}
                      </div>
                      <span className="text-xs mt-2 text-center">
                        {stepNumber === 1 ? 'Financials' :
                         stepNumber === 2 ? 'Adjustments' :
                         stepNumber === 3 ? 'Value Drivers' : 'Follow-up'}
                      </span>
                    </div>
                    {stepNumber < 4 && (
                      <div className={`flex-1 h-1 ${step > stepNumber ? 'bg-blue-600' : 'bg-gray-200'}`} />
                    )}
                  </div>
                ))}
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
                <ArrowLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>
              <Button
                onClick={handleNext}
                disabled={submitAssessment.isPending}
                className="bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                style={{ backgroundColor: '#2563eb', color: '#ffffff' }}
                data-testid="button-next"
              >
                {step === totalSteps ? (
                  submitAssessment.isPending ? 'Generating Report...' : 'Generate Report'
                ) : (
                  <>
                    Continue
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