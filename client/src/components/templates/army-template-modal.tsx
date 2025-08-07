import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { X, Plus, Trash2, Shield, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { ReviewTemplate } from "@shared/schema";

interface ArmyTemplateModalProps {
  template?: ReviewTemplate | null;
  onClose: () => void;
}

// Default examples that companies can customize
const defaultCoreValuesExamples = [
  "Integrity", "Excellence", "Innovation", "Collaboration", 
  "Customer Focus", "Accountability", "Respect"
];

const defaultCompetenciesExamples = [
  "Leadership", "Communication", "Problem Solving",
  "Team Collaboration", "Strategic Thinking", "Adaptability",
  "Results Orientation", "Professional Development"
];

const templateFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  reviewType: z.enum(["monthly", "quarterly", "annual"]),
  templateType: z.enum(["standard", "structured"]),
  instructions: z.string().optional(),
  categories: z.array(z.string()).min(1, "At least one category is required"),
  coreValues: z.array(z.string()).optional(),
  competencies: z.array(z.string()).optional(),
  sections: z.any().optional(),
});

type TemplateFormData = z.infer<typeof templateFormSchema>;

export default function ArmyTemplateModal({ template, onClose }: ArmyTemplateModalProps) {
  const [newCategory, setNewCategory] = useState("");
  const [customCoreValues, setCustomCoreValues] = useState<string[]>(
    template?.coreValues as string[] || []
  );
  const [customCompetencies, setCustomCompetencies] = useState<string[]>(
    template?.competencies as string[] || []
  );
  const [newCoreValue, setNewCoreValue] = useState("");
  const [newCompetency, setNewCompetency] = useState("");
  const { toast } = useToast();

  const form = useForm<TemplateFormData>({
    resolver: zodResolver(templateFormSchema),
    defaultValues: {
      name: template?.name || "",
      reviewType: template?.reviewType || "monthly",
      templateType: template?.templateType as "standard" | "structured" || "structured",
      instructions: template?.instructions || "",
      categories: template?.categories as string[] || [],
      coreValues: customCoreValues,
      competencies: customCompetencies,
    },
  });

  const templateType = form.watch("templateType");
  const categories = form.watch("categories");

  // Create/Update template mutation
  const saveTemplateMutation = useMutation({
    mutationFn: async (data: TemplateFormData) => {
      const templateData = {
        ...data,
        coreValues: templateType === "structured" ? customCoreValues : undefined,
        competencies: templateType === "structured" ? customCompetencies : undefined,
        sections: templateType === "structured" ? getStructuredSections() : undefined,
      };

      if (template) {
        return apiRequest(`/api/templates/${template.id}`, "PUT", {
          body: JSON.stringify(templateData),
        });
      } else {
        return apiRequest("/api/templates", "POST", {
          body: JSON.stringify(templateData),
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/templates"] });
      toast({
        title: "Success",
        description: `Template ${template ? "updated" : "created"} successfully`,
      });
      onClose();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || `Failed to ${template ? "update" : "create"} template`,
        variant: "destructive",
      });
    },
  });

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
            fields: [
              "Core Values Demonstrated",
              "Key Competencies Exhibited", 
              "Notable Accomplishments",
              "Positive Team Impact"
            ]
          },
          developmentAreas: {
            title: "Development Opportunities",
            fields: [
              "Skills to Enhance",
              "Growth Areas",
              "Learning Opportunities",
              "Support Needed"
            ]
          }
        }
      },
      actionPlan: {
        title: "Development Action Plan",
        fields: [
          "Manager Support",
          "Employee Commitments",
          "Timeline & Milestones",
          "Resources & Training"
        ]
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

  const handleAddCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      form.setValue("categories", [...categories, newCategory.trim()]);
      setNewCategory("");
    }
  };

  const handleRemoveCategory = (index: number) => {
    const updatedCategories = categories.filter((_, i) => i !== index);
    form.setValue("categories", updatedCategories);
  };

  const handleAddCoreValue = () => {
    if (newCoreValue.trim() && !customCoreValues.includes(newCoreValue.trim())) {
      const updated = [...customCoreValues, newCoreValue.trim()];
      setCustomCoreValues(updated);
      form.setValue("coreValues", updated);
      setNewCoreValue("");
    }
  };

  const handleRemoveCoreValue = (index: number) => {
    const updated = customCoreValues.filter((_, i) => i !== index);
    setCustomCoreValues(updated);
    form.setValue("coreValues", updated);
  };

  const handleAddCompetency = () => {
    if (newCompetency.trim() && !customCompetencies.includes(newCompetency.trim())) {
      const updated = [...customCompetencies, newCompetency.trim()];
      setCustomCompetencies(updated);
      form.setValue("competencies", updated);
      setNewCompetency("");
    }
  };

  const handleRemoveCompetency = (index: number) => {
    const updated = customCompetencies.filter((_, i) => i !== index);
    setCustomCompetencies(updated);
    form.setValue("competencies", updated);
  };

  const handleQuickAddCoreValue = (value: string) => {
    if (!customCoreValues.includes(value)) {
      const updated = [...customCoreValues, value];
      setCustomCoreValues(updated);
      form.setValue("coreValues", updated);
    }
  };

  const handleQuickAddCompetency = (competency: string) => {
    if (!customCompetencies.includes(competency)) {
      const updated = [...customCompetencies, competency];
      setCustomCompetencies(updated);
      form.setValue("competencies", updated);
    }
  };

  const onSubmit = (data: TemplateFormData) => {
    saveTemplateMutation.mutate(data);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-2">
            {templateType === "army" ? (
              <Shield className="h-5 w-5 text-green-600" />
            ) : (
              <FileText className="h-5 w-5 text-blue-600" />
            )}
            <h2 className="text-xl font-semibold">
              {template ? "Edit Template" : "Create New Template"}
            </h2>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="p-6">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="categories">Categories</TabsTrigger>
              {templateType === "structured" && <TabsTrigger value="structured">Values & Competencies</TabsTrigger>}
            </TabsList>

            <TabsContent value="basic" className="space-y-4 mt-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Template Name</Label>
                  <Input
                    id="name"
                    {...form.register("name")}
                    placeholder="Enter template name"
                    data-testid="input-template-name"
                  />
                  {form.formState.errors.name && (
                    <p className="text-sm text-red-600">{form.formState.errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reviewType">Review Type</Label>
                  <Select value={form.watch("reviewType")} onValueChange={(value) => form.setValue("reviewType", value as any)}>
                    <SelectTrigger data-testid="select-review-type">
                      <SelectValue placeholder="Select review type" />
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
                <Label htmlFor="templateType">Template Type</Label>
                <Select value={templateType} onValueChange={(value) => form.setValue("templateType", value as any)}>
                  <SelectTrigger data-testid="select-template-type">
                    <SelectValue placeholder="Select template type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="structured">Structured/Counseling Style</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="instructions">Instructions</Label>
                <Textarea
                  id="instructions"
                  {...form.register("instructions")}
                  placeholder="Enter template instructions"
                  rows={4}
                  data-testid="textarea-instructions"
                />
              </div>
            </TabsContent>

            <TabsContent value="categories" className="space-y-4 mt-6">
              <div className="space-y-2">
                <Label>Review Categories</Label>
                <div className="flex gap-2">
                  <Input
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="Add a category"
                    data-testid="input-new-category"
                  />
                  <Button type="button" onClick={handleAddCategory} data-testid="button-add-category">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  {categories.map((category, index) => (
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

            {templateType === "structured" && (
              <TabsContent value="structured" className="space-y-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Core Values</CardTitle>
                    <CardDescription>Add your organization's core values to evaluate in reviews</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex gap-2">
                        <Input
                          value={newCoreValue}
                          onChange={(e) => setNewCoreValue(e.target.value)}
                          placeholder="Add a core value"
                          data-testid="input-new-core-value"
                        />
                        <Button type="button" onClick={handleAddCoreValue} data-testid="button-add-core-value">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="space-y-2">
                        <p className="text-sm text-gray-600">Quick add examples:</p>
                        <div className="flex flex-wrap gap-2">
                          {defaultCoreValuesExamples.map((value) => (
                            <Button
                              key={value}
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => handleQuickAddCoreValue(value)}
                              disabled={customCoreValues.includes(value)}
                              data-testid={`button-quick-add-value-${value}`}
                            >
                              {value}
                            </Button>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {customCoreValues.map((value, index) => (
                          <Badge key={index} variant="secondary" className="flex items-center gap-1">
                            {value}
                            <button
                              type="button"
                              onClick={() => handleRemoveCoreValue(index)}
                              className="ml-1 hover:text-red-600"
                              data-testid={`button-remove-core-value-${index}`}
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Competencies</CardTitle>
                    <CardDescription>Add the competencies your organization wants to evaluate</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex gap-2">
                        <Input
                          value={newCompetency}
                          onChange={(e) => setNewCompetency(e.target.value)}
                          placeholder="Add a competency"
                          data-testid="input-new-competency"
                        />
                        <Button type="button" onClick={handleAddCompetency} data-testid="button-add-competency">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="space-y-2">
                        <p className="text-sm text-gray-600">Quick add examples:</p>
                        <div className="flex flex-wrap gap-2">
                          {defaultCompetenciesExamples.map((competency) => (
                            <Button
                              key={competency}
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => handleQuickAddCompetency(competency)}
                              disabled={customCompetencies.includes(competency)}
                              data-testid={`button-quick-add-competency-${competency}`}
                            >
                              {competency}
                            </Button>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {customCompetencies.map((competency, index) => (
                          <Badge key={index} variant="secondary" className="flex items-center gap-1">
                            {competency}
                            <button
                              type="button"
                              onClick={() => handleRemoveCompetency(index)}
                              className="ml-1 hover:text-red-600"
                              data-testid={`button-remove-competency-${index}`}
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            )}
          </Tabs>

          <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={saveTemplateMutation.isPending}
              data-testid="button-save-template"
            >
              {saveTemplateMutation.isPending ? "Saving..." : template ? "Update" : "Create"} Template
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}