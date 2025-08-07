import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  ChevronRight, 
  ChevronLeft, 
  Check, 
  FileText, 
  Shield, 
  Users, 
  Calendar,
  Plus,
  X,
  Lightbulb,
  Target,
  Star,
  Settings
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { ReviewTemplate, User } from "@shared/schema";

const WIZARD_STEPS = [
  { id: 'welcome', title: 'Welcome', icon: Star },
  { id: 'template-type', title: 'Choose Template Style', icon: FileText },
  { id: 'template-config', title: 'Configure Template', icon: Settings },
  { id: 'team-setup', title: 'Set Up Your Team', icon: Users },
  { id: 'schedule', title: 'Schedule Reviews', icon: Calendar },
  { id: 'complete', title: 'Complete', icon: Check }
];

export default function SetupWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [wizardData, setWizardData] = useState({
    templateType: '',
    templateName: '',
    reviewType: 'quarterly',
    categories: ['Performance', 'Goals', 'Professional Development'],
    coreValues: [] as string[],
    competencies: [] as string[],
    instructions: '',
    selectedUsers: [] as string[]
  });
  
  const [newCategory, setNewCategory] = useState('');
  const [newValue, setNewValue] = useState('');
  const [newCompetency, setNewCompetency] = useState('');
  
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  // Fetch users for team setup
  const { data: users } = useQuery({
    queryKey: ["/api/users"],
  });

  // Create template mutation
  const createTemplateMutation = useMutation({
    mutationFn: async (templateData: any) => {
      return await apiRequest("/api/templates", "POST", templateData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/templates"] });
    },
  });

  const currentStepData = WIZARD_STEPS[currentStep];
  const progress = ((currentStep + 1) / WIZARD_STEPS.length) * 100;

  const updateWizardData = (field: string, value: any) => {
    setWizardData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < WIZARD_STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0: return true; // Welcome
      case 1: return wizardData.templateType !== ''; // Template type
      case 2: return wizardData.templateName.trim() !== ''; // Template config
      case 3: return true; // Team setup (optional)
      case 4: return true; // Schedule (we'll set defaults)
      default: return true;
    }
  };

  const handleAddCategory = () => {
    if (newCategory.trim() && !wizardData.categories.includes(newCategory.trim())) {
      updateWizardData('categories', [...wizardData.categories, newCategory.trim()]);
      setNewCategory('');
    }
  };

  const handleRemoveCategory = (index: number) => {
    const updated = wizardData.categories.filter((_, i) => i !== index);
    updateWizardData('categories', updated);
  };

  const handleAddValue = () => {
    if (newValue.trim() && !wizardData.coreValues.includes(newValue.trim())) {
      updateWizardData('coreValues', [...wizardData.coreValues, newValue.trim()]);
      setNewValue('');
    }
  };

  const handleAddCompetency = () => {
    if (newCompetency.trim() && !wizardData.competencies.includes(newCompetency.trim())) {
      updateWizardData('competencies', [...wizardData.competencies, newCompetency.trim()]);
      setNewCompetency('');
    }
  };

  const quickAddValue = (value: string) => {
    if (!wizardData.coreValues.includes(value)) {
      updateWizardData('coreValues', [...wizardData.coreValues, value]);
    }
  };

  const quickAddCompetency = (competency: string) => {
    if (!wizardData.competencies.includes(competency)) {
      updateWizardData('competencies', [...wizardData.competencies, competency]);
    }
  };

  const handleFinish = async () => {
    const templateData = {
      name: wizardData.templateName,
      reviewType: wizardData.reviewType,
      templateType: wizardData.templateType,
      categories: wizardData.categories,
      instructions: wizardData.instructions || `${wizardData.templateName} template for ${wizardData.reviewType} performance reviews.`,
      coreValues: wizardData.templateType === 'structured' ? wizardData.coreValues : undefined,
      competencies: wizardData.templateType === 'structured' ? wizardData.competencies : undefined,
      sections: wizardData.templateType === 'structured' ? getStructuredSections() : undefined,
    };

    try {
      await createTemplateMutation.mutateAsync(templateData);
      toast({
        title: "Setup Complete!",
        description: "Your performance review system has been configured successfully.",
      });
      setLocation("/templates");
    } catch (error) {
      toast({
        title: "Setup Failed",
        description: "There was an error setting up your review system. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getStructuredSections = () => {
    return {
      purposeOfReview: {
        title: "Purpose of Review",
        description: "To discuss performance, recognize achievements, identify development opportunities, and establish goals for continued growth.",
      },
      keyPointsOfDiscussion: {
        title: "Key Discussion Points",
        subsections: {
          strengths: {
            title: "Strengths & Achievements",
            fields: ["Core Values Demonstrated", "Key Competencies Exhibited", "Notable Accomplishments", "Positive Team Impact"]
          },
          developmentAreas: {
            title: "Development Opportunities", 
            fields: ["Skills to Enhance", "Growth Areas", "Learning Opportunities", "Support Needed"]
          }
        }
      },
      actionPlan: {
        title: "Development Action Plan",
        fields: ["Manager Support", "Employee Commitments", "Timeline & Milestones", "Resources & Training"]
      },
      managerNotes: {
        title: "Manager Notes",
        fields: ["Follow-up Actions", "Additional Support"]
      },
      acknowledgment: {
        title: "Review Acknowledgment",
        fields: ["Employee Comments", "Employee Signature", "Manager Signature"]
      }
    };
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Performance Review Setup</h1>
              <p className="text-gray-600 mt-2">Let's get your performance review system configured in just a few steps</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Step {currentStep + 1} of {WIZARD_STEPS.length}</p>
              <Progress value={progress} className="w-32" />
            </div>
          </div>

          {/* Step indicators */}
          <div className="flex items-center justify-between mb-6">
            {WIZARD_STEPS.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 
                  ${index <= currentStep 
                    ? 'bg-blue-600 border-blue-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-400'
                  }`}>
                  <step.icon className="h-5 w-5" />
                </div>
                {index < WIZARD_STEPS.length - 1 && (
                  <div className={`w-20 h-0.5 mx-2 
                    ${index < currentStep ? 'bg-blue-600' : 'bg-gray-300'}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <currentStepData.icon className="h-6 w-6" />
              {currentStepData.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Welcome Step */}
            {currentStep === 0 && (
              <div className="text-center space-y-6">
                <div className="mx-auto w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center">
                  <Star className="h-12 w-12 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-semibold mb-4">Welcome to Performance Reviews!</h3>
                  <p className="text-gray-600 mb-6">
                    This wizard will help you set up a complete performance review system tailored to your organization. 
                    We'll guide you through choosing templates, configuring evaluation criteria, and scheduling reviews.
                  </p>
                  <div className="grid md:grid-cols-2 gap-4 text-left">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <Target className="h-6 w-6 text-blue-600 mb-2" />
                      <h4 className="font-medium mb-2">Customizable Templates</h4>
                      <p className="text-sm text-gray-600">Create review templates that match your company's values and competencies.</p>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg">
                      <Users className="h-6 w-6 text-green-600 mb-2" />
                      <h4 className="font-medium mb-2">Team Management</h4>
                      <p className="text-sm text-gray-600">Set up review schedules and assign managers to team members.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Template Type Selection */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Choose Your Review Template Style</h3>
                  <p className="text-gray-600 mb-6">
                    Select the type of performance review template that best fits your organization's needs.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <Card 
                    className={`cursor-pointer border-2 transition-colors ${
                      wizardData.templateType === 'standard' 
                        ? 'border-blue-600 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => updateWizardData('templateType', 'standard')}
                    data-testid="card-standard-template"
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <FileText className="h-8 w-8 text-blue-600" />
                        {wizardData.templateType === 'standard' && <Check className="h-6 w-6 text-blue-600" />}
                      </div>
                      <CardTitle>Standard Template</CardTitle>
                      <CardDescription>
                        Simple, flexible template with customizable categories. Perfect for most organizations.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Custom review categories</li>
                        <li>• Goal setting and tracking</li>
                        <li>• Manager and self-review sections</li>
                        <li>• Easy to customize</li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card 
                    className={`cursor-pointer border-2 transition-colors ${
                      wizardData.templateType === 'structured' 
                        ? 'border-green-600 bg-green-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => updateWizardData('templateType', 'structured')}
                    data-testid="card-structured-template"
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <Shield className="h-8 w-8 text-green-600" />
                        {wizardData.templateType === 'structured' && <Check className="h-6 w-6 text-green-600" />}
                      </div>
                      <CardTitle>Structured Template</CardTitle>
                      <CardDescription>
                        Comprehensive template with company values and competencies. Great for detailed evaluations.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Company core values assessment</li>
                        <li>• Competency-based evaluations</li>
                        <li>• Structured discussion points</li>
                        <li>• Development action planning</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {/* Template Configuration */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Configure Your Template</h3>
                  <p className="text-gray-600 mb-6">
                    Set up the basic information and customize your review template.
                  </p>
                </div>

                <Tabs defaultValue="basic" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="basic">Basic Info</TabsTrigger>
                    <TabsTrigger value="categories">Categories</TabsTrigger>
                    {wizardData.templateType === 'structured' && (
                      <TabsTrigger value="values">Values & Competencies</TabsTrigger>
                    )}
                  </TabsList>

                  <TabsContent value="basic" className="space-y-4 mt-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="template-name">Template Name</Label>
                        <Input
                          id="template-name"
                          placeholder="e.g., Q1 Performance Review"
                          value={wizardData.templateName}
                          onChange={(e) => updateWizardData('templateName', e.target.value)}
                          data-testid="input-template-name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="review-type">Review Frequency</Label>
                        <Select value={wizardData.reviewType} onValueChange={(value) => updateWizardData('reviewType', value)}>
                          <SelectTrigger data-testid="select-review-type">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="monthly">Monthly</SelectItem>
                            <SelectItem value="quarterly">Quarterly</SelectItem>
                            <SelectItem value="annual">Annual</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="instructions">Instructions (Optional)</Label>
                      <Textarea
                        id="instructions"
                        placeholder="Add any special instructions for reviewers..."
                        value={wizardData.instructions}
                        onChange={(e) => updateWizardData('instructions', e.target.value)}
                        rows={3}
                        data-testid="textarea-instructions"
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="categories" className="space-y-4 mt-6">
                    <div className="space-y-2">
                      <Label>Review Categories</Label>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Add a category"
                          value={newCategory}
                          onChange={(e) => setNewCategory(e.target.value)}
                          data-testid="input-new-category"
                        />
                        <Button type="button" onClick={handleAddCategory} data-testid="button-add-category">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-4">
                        {wizardData.categories.map((category, index) => (
                          <Badge key={index} variant="secondary" className="flex items-center gap-1">
                            {category}
                            <button
                              type="button"
                              onClick={() => handleRemoveCategory(index)}
                              className="ml-1 hover:text-red-600"
                              data-testid={`button-remove-category-${index}`}
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </TabsContent>

                  {wizardData.templateType === 'structured' && (
                    <TabsContent value="values" className="space-y-6 mt-6">
                      <div className="space-y-4">
                        <div>
                          <Label className="text-base font-medium">Core Values</Label>
                          <p className="text-sm text-gray-600 mb-4">Add your organization's core values</p>
                          <div className="flex gap-2 mb-4">
                            <Input
                              placeholder="Add a core value"
                              value={newValue}
                              onChange={(e) => setNewValue(e.target.value)}
                              data-testid="input-new-value"
                            />
                            <Button type="button" onClick={handleAddValue} data-testid="button-add-value">
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="space-y-2">
                            <p className="text-sm text-gray-600">Quick add examples:</p>
                            <div className="flex flex-wrap gap-2">
                              {["Integrity", "Excellence", "Innovation", "Collaboration", "Customer Focus"].map(value => (
                                <Button
                                  key={value}
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => quickAddValue(value)}
                                  disabled={wizardData.coreValues.includes(value)}
                                  data-testid={`button-quick-value-${value}`}
                                >
                                  {value}
                                </Button>
                              ))}
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2 mt-4">
                            {wizardData.coreValues.map((value, index) => (
                              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                                {value}
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updated = wizardData.coreValues.filter((_, i) => i !== index);
                                    updateWizardData('coreValues', updated);
                                  }}
                                  className="ml-1 hover:text-red-600"
                                  data-testid={`button-remove-value-${index}`}
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div>
                          <Label className="text-base font-medium">Competencies</Label>
                          <p className="text-sm text-gray-600 mb-4">Add the competencies to evaluate</p>
                          <div className="flex gap-2 mb-4">
                            <Input
                              placeholder="Add a competency"
                              value={newCompetency}
                              onChange={(e) => setNewCompetency(e.target.value)}
                              data-testid="input-new-competency"
                            />
                            <Button type="button" onClick={handleAddCompetency} data-testid="button-add-competency">
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="space-y-2">
                            <p className="text-sm text-gray-600">Quick add examples:</p>
                            <div className="flex flex-wrap gap-2">
                              {["Leadership", "Communication", "Problem Solving", "Team Collaboration", "Strategic Thinking"].map(comp => (
                                <Button
                                  key={comp}
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => quickAddCompetency(comp)}
                                  disabled={wizardData.competencies.includes(comp)}
                                  data-testid={`button-quick-comp-${comp}`}
                                >
                                  {comp}
                                </Button>
                              ))}
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2 mt-4">
                            {wizardData.competencies.map((comp, index) => (
                              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                                {comp}
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updated = wizardData.competencies.filter((_, i) => i !== index);
                                    updateWizardData('competencies', updated);
                                  }}
                                  className="ml-1 hover:text-red-600"
                                  data-testid={`button-remove-comp-${index}`}
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  )}
                </Tabs>
              </div>
            )}

            {/* Team Setup */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Set Up Your Team (Optional)</h3>
                  <p className="text-gray-600 mb-6">
                    You can configure team member settings now or skip this step and set it up later in the Team Directory.
                  </p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Lightbulb className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-blue-900 mb-1">Pro Tip</p>
                      <p className="text-sm text-blue-800">
                        After completing this setup, you can manage your team members, assign managers, and set review cadences 
                        in the Team Directory. You can also create and schedule individual reviews from the Reviews page.
                      </p>
                    </div>
                  </div>
                </div>

                {users && Array.isArray(users) && users.length > 0 ? (
                  <div>
                    <h4 className="font-medium mb-4">Current Team Members ({users.length})</h4>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {users.map((user: User) => (
                        <div key={user.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-sm font-medium text-blue-600">
                                {user.firstName?.[0] || user.email?.[0]?.toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium">{user.firstName} {user.lastName}</p>
                              <p className="text-sm text-gray-600">{user.email}</p>
                            </div>
                          </div>
                          <Badge variant={user.role === 'admin' ? 'default' : user.role === 'manager' ? 'secondary' : 'outline'}>
                            {user.role}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No team members found. You can add team members later in the Team Directory.</p>
                  </div>
                )}
              </div>
            )}

            {/* Schedule Setup */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Review Schedule</h3>
                  <p className="text-gray-600 mb-6">
                    Your template is configured for <strong>{wizardData.reviewType}</strong> reviews. 
                    You can create and schedule individual reviews after completing the setup.
                  </p>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-green-900 mb-1">What's Next?</p>
                      <p className="text-sm text-green-800 mb-2">After completing this setup, you'll be able to:</p>
                      <ul className="text-sm text-green-800 space-y-1">
                        <li>• Create new reviews using your custom template</li>
                        <li>• Schedule reviews for specific team members</li>
                        <li>• Set due dates and review periods</li>
                        <li>• Track review progress on your dashboard</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Review Template Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-700">Template Name</p>
                        <p className="text-gray-900">{wizardData.templateName}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Type</p>
                        <p className="text-gray-900">{wizardData.templateType === 'structured' ? 'Structured' : 'Standard'}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Frequency</p>
                        <p className="text-gray-900 capitalize">{wizardData.reviewType}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Categories</p>
                        <p className="text-gray-900">{wizardData.categories.length} categories</p>
                      </div>
                    </div>
                    {wizardData.templateType === 'structured' && (
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-gray-700">Core Values</p>
                          <p className="text-gray-900">{wizardData.coreValues.length} values</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700">Competencies</p>
                          <p className="text-gray-900">{wizardData.competencies.length} competencies</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Completion */}
            {currentStep === 5 && (
              <div className="text-center space-y-6">
                <div className="mx-auto w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
                  <Check className="h-12 w-12 text-green-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-semibold mb-4">Setup Complete!</h3>
                  <p className="text-gray-600 mb-6">
                    Your performance review system is now configured and ready to use. 
                    Your template has been created and you can start creating reviews.
                  </p>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
                    <h4 className="font-medium text-blue-900 mb-2">Next Steps:</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Visit the <strong>Templates</strong> page to view and manage your templates</li>
                      <li>• Go to <strong>Reviews</strong> to create and schedule performance reviews</li>
                      <li>• Use the <strong>Team Directory</strong> to manage team members and assign managers</li>
                      <li>• Check your <strong>Dashboard</strong> for review progress and upcoming deadlines</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 0}
            data-testid="button-prev-step"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>

          <div className="text-sm text-gray-500">
            {currentStep + 1} of {WIZARD_STEPS.length}
          </div>

          {currentStep === WIZARD_STEPS.length - 1 ? (
            <Button 
              onClick={handleFinish}
              disabled={createTemplateMutation.isPending}
              data-testid="button-finish-setup"
            >
              {createTemplateMutation.isPending ? 'Creating...' : 'Complete Setup'}
              <Check className="h-4 w-4 ml-1" />
            </Button>
          ) : (
            <Button
              onClick={nextStep}
              disabled={!canProceed()}
              data-testid="button-next-step"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}