import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import TemplateFormModal from "@/components/templates/template-form-modal";
import { Plus, Edit, FileText, Calendar } from "lucide-react";
import type { ReviewTemplate } from "@shared/schema";

export default function Templates() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading, user } = useAuth();
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<ReviewTemplate | null>(null);

  const { data: templates, isLoading: templatesLoading, refetch } = useQuery<ReviewTemplate[]>({
    queryKey: ["/api/templates"],
    enabled: !!user,
  });

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
    }
  }, [isAuthenticated, isLoading, toast]);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'annual': return 'bg-purple-100 text-purple-800';
      case 'quarterly': return 'bg-blue-100 text-blue-800';
      case 'monthly': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleCreateTemplate = () => {
    setSelectedTemplate(null);
    setShowTemplateModal(true);
  };

  const handleEditTemplate = (template: ReviewTemplate) => {
    setSelectedTemplate(template);
    setShowTemplateModal(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) return null;

  // Only admins can access templates
  if (user.role !== 'admin') {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header title="Access Denied" />
          <main className="flex-1 flex items-center justify-center">
            <Card>
              <CardContent className="p-12 text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Access Denied</h3>
                <p className="text-gray-600">Only administrators can manage review templates.</p>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          title="Review Templates" 
          subtitle="Create and manage reusable review templates for different review types"
        >
          <Button onClick={handleCreateTemplate} data-testid="button-create-template">
            <Plus className="h-4 w-4 mr-2" />
            New Template
          </Button>
        </Header>

        <main className="flex-1 overflow-y-auto p-6">
          {templatesLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : templates && templates.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {templates.map((template: ReviewTemplate) => (
                <Card key={template.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg" data-testid={`text-template-${template.id}`}>
                          {template.name}
                        </CardTitle>
                        <Badge 
                          className={getTypeColor(template.reviewType)} 
                          data-testid={`badge-type-${template.id}`}
                        >
                          <Calendar className="h-3 w-3 mr-1" />
                          {template.reviewType?.charAt(0).toUpperCase() + template.reviewType?.slice(1)}
                        </Badge>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditTemplate(template)}
                        data-testid={`button-edit-${template.id}`}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-3">
                      {template.instructions && (
                        <p className="text-sm text-gray-600 line-clamp-3" data-testid={`text-instructions-${template.id}`}>
                          {template.instructions}
                        </p>
                      )}

                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Categories</h4>
                        <div className="flex flex-wrap gap-1">
                          {(template.categories as string[])?.map((category, index) => (
                            <Badge 
                              key={index} 
                              variant="secondary" 
                              className="text-xs"
                              data-testid={`badge-category-${template.id}-${index}`}
                            >
                              {category}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="pt-2 text-xs text-gray-500 border-t">
                        Created {new Date(template.createdAt!).toLocaleDateString()}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <div className="text-gray-400 mb-4">
                  <FileText className="h-16 w-16 mx-auto" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Templates Found</h3>
                <p className="text-gray-600 mb-6">
                  Create your first review template to standardize your performance review process.
                </p>
                <Button onClick={handleCreateTemplate} data-testid="button-create-first-template">
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Template
                </Button>
              </CardContent>
            </Card>
          )}
        </main>
      </div>

      <TemplateFormModal
        open={showTemplateModal}
        onClose={() => setShowTemplateModal(false)}
        template={selectedTemplate}
        onSuccess={() => {
          refetch();
          setShowTemplateModal(false);
        }}
      />
    </div>
  );
}
