import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Copy, FileText } from "lucide-react";
import { ReviewTemplate, ReviewType } from "@/types/review";
import { CreateTemplateDialog } from "./CreateTemplateDialog";
import { EditTemplateDialog } from "./EditTemplateDialog";
import { useToast } from "@/hooks/use-toast";

// Mock data - replace with actual API calls
const mockTemplates: ReviewTemplate[] = [
  {
    id: "1",
    name: "Standard Performance Review",
    type: "quarterly",
    categories: [
      { id: "1", label: "Technical Skills", description: "Evaluation of technical competencies", weight: 25 },
      { id: "2", label: "Communication", description: "Written and verbal communication skills", weight: 20 },
      { id: "3", label: "Teamwork", description: "Collaboration and team contribution", weight: 20 },
      { id: "4", label: "Leadership", description: "Leadership potential and initiative", weight: 15 },
      { id: "5", label: "Goal Achievement", description: "Meeting objectives and deadlines", weight: 20 }
    ],
    instructions: "Please rate each category on a scale of 1-5 and provide detailed feedback.",
    isDefault: true,
    createdBy: "admin",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01")
  },
  {
    id: "2", 
    name: "Monthly Check-in",
    type: "monthly",
    categories: [
      { id: "6", label: "Current Projects", description: "Progress on ongoing work", weight: 40 },
      { id: "7", label: "Challenges", description: "Obstacles and roadblocks", weight: 30 },
      { id: "8", label: "Support Needed", description: "Areas where help is required", weight: 30 }
    ],
    instructions: "Focus on recent progress and immediate needs.",
    isDefault: false,
    createdBy: "admin",
    createdAt: new Date("2024-02-01"),
    updatedAt: new Date("2024-02-01")
  }
];

export function ReviewTemplates() {
  const [templates, setTemplates] = useState<ReviewTemplate[]>(mockTemplates);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<ReviewTemplate | null>(null);
  const { toast } = useToast();

  const handleCreateTemplate = (templateData: Omit<ReviewTemplate, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>) => {
    const newTemplate: ReviewTemplate = {
      ...templateData,
      id: Date.now().toString(),
      createdBy: "admin",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setTemplates([...templates, newTemplate]);
    setShowCreateDialog(false);
    toast({
      title: "Template created",
      description: "Review template has been created successfully."
    });
  };

  const handleEditTemplate = (templateData: Omit<ReviewTemplate, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>) => {
    if (!editingTemplate) return;
    
    const updatedTemplate: ReviewTemplate = {
      ...editingTemplate,
      ...templateData,
      updatedAt: new Date()
    };
    setTemplates(templates.map(t => t.id === editingTemplate.id ? updatedTemplate : t));
    setEditingTemplate(null);
    toast({
      title: "Template updated",
      description: "Review template has been updated successfully."
    });
  };

  const handleDuplicateTemplate = (template: ReviewTemplate) => {
    const duplicatedTemplate: ReviewTemplate = {
      ...template,
      id: Date.now().toString(),
      name: `${template.name} (Copy)`,
      isDefault: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setTemplates([...templates, duplicatedTemplate]);
    toast({
      title: "Template duplicated",
      description: "Review template has been duplicated successfully."
    });
  };

  const handleDeleteTemplate = (templateId: string) => {
    setTemplates(templates.filter(t => t.id !== templateId));
    toast({
      title: "Template deleted",
      description: "Review template has been deleted successfully."
    });
  };

  const handleSetDefault = (templateId: string) => {
    setTemplates(templates.map(t => ({
      ...t,
      isDefault: t.id === templateId
    })));
    toast({
      title: "Default template updated",
      description: "The default review template has been changed."
    });
  };

  const getTypeColor = (type: ReviewType) => {
    switch (type) {
      case 'monthly': return 'bg-blue-500/10 text-blue-700 border-blue-200';
      case 'quarterly': return 'bg-green-500/10 text-green-700 border-green-200';
      case 'annual': return 'bg-purple-500/10 text-purple-700 border-purple-200';
      default: return 'bg-gray-500/10 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Review Templates</h2>
          <p className="text-muted-foreground">Create and manage review templates for different review types</p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          New Template
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {templates.map((template) => (
          <Card key={template.id} className="group hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    {template.name}
                    {template.isDefault && (
                      <Badge variant="secondary" className="text-xs">Default</Badge>
                    )}
                  </CardTitle>
                  <CardDescription className="mt-1">
                    {template.categories.length} categories
                  </CardDescription>
                </div>
                <Badge className={getTypeColor(template.type)}>
                  {template.type}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-sm text-muted-foreground">
                  {template.instructions ? 
                    template.instructions.substring(0, 100) + (template.instructions.length > 100 ? "..." : "") :
                    "No instructions provided"
                  }
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium">Categories:</p>
                  <div className="flex flex-wrap gap-1">
                    {template.categories.slice(0, 3).map((category) => (
                      <Badge key={category.id} variant="outline" className="text-xs">
                        {category.label}
                      </Badge>
                    ))}
                    {template.categories.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{template.categories.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingTemplate(template)}
                    className="flex-1"
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDuplicateTemplate(template)}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                  {!template.isDefault && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteTemplate(template.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  )}
                </div>

                {!template.isDefault && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSetDefault(template.id)}
                    className="w-full text-xs"
                  >
                    Set as Default
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <CreateTemplateDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onSubmit={handleCreateTemplate}
      />

      {editingTemplate && (
        <EditTemplateDialog
          template={editingTemplate}
          open={!!editingTemplate}
          onOpenChange={(open) => !open && setEditingTemplate(null)}
          onSubmit={handleEditTemplate}
        />
      )}
    </div>
  );
}