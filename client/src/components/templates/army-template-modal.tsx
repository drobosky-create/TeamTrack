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

const armyValuesOptions = [
  "Loyalty", "Duty", "Respect", "Selfless Service", 
  "Honor", "Integrity", "Personal Courage"
];

const leadershipCompetenciesOptions = [
  "Leads by Example", "Builds Trust", "Extends Influence",
  "Leads Others", "Creates Positive Environment", "Prepares Self",
  "Develops Others", "Gets Results"
];

const templateFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  reviewType: z.enum(["monthly", "quarterly", "annual"]),
  templateType: z.enum(["standard", "army"]),
  instructions: z.string().optional(),
  categories: z.array(z.string()).min(1, "At least one category is required"),
  armyValues: z.array(z.string()).optional(),
  leadershipCompetencies: z.array(z.string()).optional(),
  sections: z.any().optional(),
});

type TemplateFormData = z.infer<typeof templateFormSchema>;

export default function ArmyTemplateModal({ template, onClose }: ArmyTemplateModalProps) {
  const [newCategory, setNewCategory] = useState("");
  const [selectedArmyValues, setSelectedArmyValues] = useState<string[]>(
    template?.armyValues as string[] || []
  );
  const [selectedCompetencies, setSelectedCompetencies] = useState<string[]>(
    template?.leadershipCompetencies as string[] || []
  );
  const { toast } = useToast();

  const form = useForm<TemplateFormData>({
    resolver: zodResolver(templateFormSchema),
    defaultValues: {
      name: template?.name || "",
      reviewType: template?.reviewType || "monthly",
      templateType: template?.templateType as "standard" | "army" || "army",
      instructions: template?.instructions || "",
      categories: template?.categories as string[] || [],
      armyValues: selectedArmyValues,
      leadershipCompetencies: selectedCompetencies,
    },
  });

  const templateType = form.watch("templateType");
  const categories = form.watch("categories");

  // Create/Update template mutation
  const saveTemplateMutation = useMutation({
    mutationFn: async (data: TemplateFormData) => {
      const templateData = {
        ...data,
        armyValues: templateType === "army" ? selectedArmyValues : undefined,
        leadershipCompetencies: templateType === "army" ? selectedCompetencies : undefined,
        sections: templateType === "army" ? getArmySections() : undefined,
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

  const getArmySections = () => {
    return {
      purposeOfCounseling: {
        title: "Purpose of Counseling",
        description: "To discuss performance, identify strengths and areas for improvement, and establish a plan for development.",
      },
      keyPointsOfDiscussion: {
        title: "Key Points of Discussion",
        subsections: {
          strengths: {
            title: "Strengths/Accomplishments",
            fields: [
              "Army Values Demonstrated",
              "Leader Attributes/Competencies Exhibited",
              "Specific Achievements",
              "Positive Impact"
            ]
          },
          areasForImprovement: {
            title: "Areas for Improvement",
            fields: [
              "Specific Deficiencies",
              "Impact of Deficiencies",
              "Army Values/Competencies Needing Development"
            ]
          }
        }
      },
      planOfAction: {
        title: "Plan of Action",
        fields: [
          "Rater Responsibilities",
          "Soldier Responsibilities", 
          "Timeline",
          "Training/Resources"
        ]
      },
      leaderResponsibilities: {
        title: "Leader Responsibilities",
        fields: ["Follow-up", "Mentorship"]
      },
      signatures: {
        title: "Signatures",
        fields: ["Soldier's Comments", "Soldier's Signature", "Rater's Signature"]
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

  const handleToggleArmyValue = (value: string) => {
    const updated = selectedArmyValues.includes(value)
      ? selectedArmyValues.filter(v => v !== value)
      : [...selectedArmyValues, value];
    setSelectedArmyValues(updated);
    form.setValue("armyValues", updated);
  };

  const handleToggleCompetency = (competency: string) => {
    const updated = selectedCompetencies.includes(competency)
      ? selectedCompetencies.filter(c => c !== competency)
      : [...selectedCompetencies, competency];
    setSelectedCompetencies(updated);
    form.setValue("leadershipCompetencies", updated);
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
              {templateType === "army" && <TabsTrigger value="army">Army Specific</TabsTrigger>}
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
                    <SelectItem value="army">Army Style</SelectItem>
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

            {templateType === "army" && (
              <TabsContent value="army" className="space-y-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Army Values</CardTitle>
                    <CardDescription>Select the Army values to include in this template</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-2">
                      {armyValuesOptions.map((value) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() => handleToggleArmyValue(value)}
                          className={`p-2 text-left border rounded-lg transition-colors ${
                            selectedArmyValues.includes(value)
                              ? 'bg-green-100 border-green-300 text-green-800'
                              : 'bg-white border-gray-300 hover:bg-gray-50'
                          }`}
                          data-testid={`button-army-value-${value}`}
                        >
                          {value}
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Leadership Competencies</CardTitle>
                    <CardDescription>Select the leadership competencies to evaluate</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-2">
                      {leadershipCompetenciesOptions.map((competency) => (
                        <button
                          key={competency}
                          type="button"
                          onClick={() => handleToggleCompetency(competency)}
                          className={`p-2 text-left border rounded-lg transition-colors ${
                            selectedCompetencies.includes(competency)
                              ? 'bg-blue-100 border-blue-300 text-blue-800'
                              : 'bg-white border-gray-300 hover:bg-gray-50'
                          }`}
                          data-testid={`button-competency-${competency}`}
                        >
                          {competency}
                        </button>
                      ))}
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