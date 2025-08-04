import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";
import { ReviewTemplate, ReviewType, ReviewCategory } from "@/types/review";

interface EditTemplateDialogProps {
  template: ReviewTemplate;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (template: Omit<ReviewTemplate, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>) => void;
}

export function EditTemplateDialog({ template, open, onOpenChange, onSubmit }: EditTemplateDialogProps) {
  const [name, setName] = useState("");
  const [type, setType] = useState<ReviewType>("quarterly");
  const [instructions, setInstructions] = useState("");
  const [categories, setCategories] = useState<ReviewCategory[]>([]);

  useEffect(() => {
    if (template) {
      setName(template.name);
      setType(template.type);
      setInstructions(template.instructions || "");
      setCategories(template.categories);
    }
  }, [template]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const validCategories = categories.filter(cat => cat.label.trim() !== "");
    if (validCategories.length === 0 || name.trim() === "") return;

    // Normalize weights to sum to 100
    const totalWeight = validCategories.reduce((sum, cat) => sum + (cat.weight || 0), 0);
    const normalizedCategories = validCategories.map(cat => ({
      ...cat,
      weight: totalWeight > 0 ? Math.round((cat.weight || 0) * 100 / totalWeight) : Math.round(100 / validCategories.length)
    }));

    onSubmit({
      name: name.trim(),
      type,
      categories: normalizedCategories,
      instructions: instructions.trim() || undefined,
      isDefault: template.isDefault
    });
  };

  const addCategory = () => {
    const newCategory: ReviewCategory = {
      id: Date.now().toString(),
      label: "",
      description: "",
      weight: 20
    };
    setCategories([...categories, newCategory]);
  };

  const removeCategory = (categoryId: string) => {
    setCategories(categories.filter(cat => cat.id !== categoryId));
  };

  const updateCategory = (categoryId: string, field: keyof ReviewCategory, value: string | number) => {
    setCategories(categories.map(cat => 
      cat.id === categoryId ? { ...cat, [field]: value } : cat
    ));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Review Template</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Template Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Quarterly Performance Review"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Review Type</Label>
              <Select value={type} onValueChange={(value: ReviewType) => setType(value)}>
                <SelectTrigger>
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
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="Provide guidance for reviewers on how to complete this review..."
              rows={3}
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Review Categories</Label>
              <Button type="button" variant="outline" size="sm" onClick={addCategory}>
                <Plus className="h-4 w-4 mr-1" />
                Add Category
              </Button>
            </div>
            
            <div className="space-y-3">
              {categories.map((category, index) => (
                <Card key={category.id}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center justify-between">
                      Category {index + 1}
                      {categories.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeCategory(category.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid gap-3 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Category Name</Label>
                        <Input
                          value={category.label}
                          onChange={(e) => updateCategory(category.id, 'label', e.target.value)}
                          placeholder="e.g., Technical Skills"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Weight (%)</Label>
                        <Input
                          type="number"
                          min="1"
                          max="100"
                          value={category.weight || ''}
                          onChange={(e) => updateCategory(category.id, 'weight', parseInt(e.target.value) || 0)}
                          placeholder="20"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Description (Optional)</Label>
                      <Input
                        value={category.description || ''}
                        onChange={(e) => updateCategory(category.id, 'description', e.target.value)}
                        placeholder="Brief description of what this category evaluates..."
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}