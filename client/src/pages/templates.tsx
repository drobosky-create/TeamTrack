import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Edit, Trash2, FileText, Shield, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import ArmyTemplateModal from "../components/templates/army-template-modal";
import type { ReviewTemplate } from "@shared/schema";

export default function Templates() {
  const [selectedTemplate, setSelectedTemplate] = useState<ReviewTemplate | null>(null);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const { toast } = useToast();

  // Fetch all templates
  const { data: allTemplates, isLoading: isLoadingAll } = useQuery({
    queryKey: ["/api/templates"],
  });

  // Fetch Structured templates
  const { data: structuredTemplates, isLoading: isLoadingStructured } = useQuery({
    queryKey: ["/api/templates", { type: "structured" }],
    enabled: activeTab === "structured",
  });

  // Fetch standard templates
  const { data: standardTemplates, isLoading: isLoadingStandard } = useQuery({
    queryKey: ["/api/templates", { type: "standard" }],
    enabled: activeTab === "standard",
  });

  // Delete template mutation
  const deleteTemplateMutation = useMutation({
    mutationFn: async (templateId: string) => {
      return await apiRequest(`/api/templates/${templateId}`, "DELETE");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/templates"] });
      toast({
        title: "Success",
        description: "Template deleted successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete template",
        variant: "destructive",
      });
    },
  });

  const handleCreateTemplate = () => {
    setSelectedTemplate(null);
    setShowTemplateModal(true);
  };

  const handleEditTemplate = (template: ReviewTemplate) => {
    setSelectedTemplate(template);
    setShowTemplateModal(true);
  };

  const handleDeleteTemplate = async (template: ReviewTemplate) => {
    if (confirm(`Are you sure you want to delete the template "${template.name}"?`)) {
      deleteTemplateMutation.mutate(template.id);
    }
  };

  const getTemplateTypeColor = (templateType: string) => {
    return templateType === 'structured' 
      ? 'bg-green-100 text-green-800 border-green-200' 
      : 'bg-blue-100 text-blue-800 border-blue-200';
  };

  const getTemplateIcon = (templateType: string) => {
    return templateType === 'structured' ? Shield : FileText;
  };

  const getCurrentTemplates = (): ReviewTemplate[] => {
    switch (activeTab) {
      case 'structured': return (structuredTemplates as ReviewTemplate[]) || [];
      case 'standard': return (standardTemplates as ReviewTemplate[]) || [];
      default: return (allTemplates as ReviewTemplate[]) || [];
    }
  };

  const isLoading = () => {
    switch (activeTab) {
      case 'structured': return isLoadingStructured;
      case 'standard': return isLoadingStandard;
      default: return isLoadingAll;
    }
  };

  if (isLoading()) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Review Templates</h1>
            <p className="text-gray-600 text-sm mt-1">Manage standard and Army-style performance review templates</p>
          </div>
          <Button onClick={handleCreateTemplate} className="flex items-center gap-2" data-testid="button-create-template">
            <Plus className="h-4 w-4" />
            New Template
          </Button>
        </div>
      </div>

      <main className="flex-1 overflow-y-auto p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex items-center justify-between mb-6">
            <TabsList className="grid w-fit grid-cols-3">
              <TabsTrigger value="all" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                All Templates
              </TabsTrigger>
              <TabsTrigger value="structured" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Structured
              </TabsTrigger>
              <TabsTrigger value="standard" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Standard
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value={activeTab}>
            {getCurrentTemplates().length === 0 ? (
              <div className="flex items-center justify-center h-64 bg-white rounded-lg border-2 border-dashed border-gray-300">
                <div className="text-center">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500 font-medium">No templates found</p>
                  <p className="text-gray-400 text-sm">Create your first template to get started</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {getCurrentTemplates().map((template) => {
                  const Icon = getTemplateIcon(template.templateType || 'standard');
                  return (
                    <Card key={template.id} className="bg-white hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            <Icon className="h-5 w-5 text-gray-600" />
                            <div>
                              <CardTitle className="text-lg">{template.name}</CardTitle>
                              <CardDescription className="mt-1">
                                {template.reviewType} review
                              </CardDescription>
                            </div>
                          </div>
                          <Badge 
                            variant="secondary" 
                            className={getTemplateTypeColor(template.templateType || 'standard')}
                          >
                            {template.templateType === 'structured' ? 'Structured' : 'Standard'}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {template.instructions && (
                            <p className="text-sm text-gray-600 line-clamp-2">
                              {template.instructions}
                            </p>
                          )}
                          
                          <div className="flex flex-wrap gap-1">
                            {Array.isArray(template.categories) && template.categories.map((category: string, index: number) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {category}
                              </Badge>
                            ))}
                          </div>

                          {template.templateType === 'structured' && (
                            <div className="space-y-2">
                              {Array.isArray(template.coreValues) && template.coreValues.length > 0 && (
                                <div>
                                  <p className="text-xs font-medium text-gray-700">Core Values:</p>
                                  <div className="flex flex-wrap gap-1">
                                    {template.coreValues.slice(0, 3).map((value: string, index: number) => (
                                      <Badge key={index} variant="outline" className="text-xs bg-green-50">
                                        {value}
                                      </Badge>
                                    ))}
                                    {template.coreValues.length > 3 && (
                                      <Badge variant="outline" className="text-xs">
                                        +{template.coreValues.length - 3} more
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}

                          <div className="flex justify-between items-center pt-2 border-t">
                            <span className="text-xs text-gray-500">
                              Created {template.createdAt ? new Date(template.createdAt).toLocaleDateString() : 'N/A'}
                            </span>
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditTemplate(template)}
                                data-testid={`button-edit-${template.id}`}
                                className="h-8 w-8 p-0"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteTemplate(template)}
                                data-testid={`button-delete-${template.id}`}
                                className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      {showTemplateModal && (
        <ArmyTemplateModal
          template={selectedTemplate}
          onClose={() => setShowTemplateModal(false)}
        />
      )}
    </div>
  );
}