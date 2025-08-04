import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import { X, Plus } from "lucide-react";
import type { ReviewTemplate } from "@shared/schema";

const templateFormSchema = z.object({
  name: z.string().min(1, "Template name is required"),
  reviewType: z.enum(['monthly', 'quarterly', 'annual']),
  instructions: z.string().optional(),
});

type TemplateFormData = z.infer<typeof templateFormSchema>;

interface TemplateFormModalProps {
  open: boolean;
  onClose: () => void;
  template?: ReviewTemplate | null;
  onSuccess: () => void;
}

export default function TemplateFormModal({ open, onClose, template, onSuccess }: TemplateFormModalProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [categories, setCategories] = useState<string[]>([]);
  const [newCategory, setNewCategory] = useState('');

  const form = useForm<TemplateFormData>({
    resolver: zodResolver(templateFormSchema),
    defaultValues: {
      name: '',
      reviewType: 'quarterly',
      instructions: '',
    },
  });

  useEffect(() => {
    if (template) {
      form.reset({
        name: template.name,
        reviewType: template.reviewType,
        instructions: template.instructions || '',
      });
      setCategories((template.categories as string[]) || []);
    } else {
      form.reset({
        name: '',
        reviewType: 'quarterly',
        instructions: '',
      });
      setCategories(['Communication', 'Technical Skills', 'Problem Solving', 'Team Collaboration', 'Leadership']);
    }
    setNewCategory('');
  }, [template, form]);

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      await apiRequest('POST', '/api/templates', data);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Template created successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/templates"] });
      onSuccess();
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to create template",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      await apiRequest('PUT', `/api/templates/${template?.id}`, data);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Template updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/templates"] });
      onSuccess();
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to update template",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: TemplateFormData) => {
    if (categories.length === 0) {
      toast({
        title: "Error",
        description: "At least one category is required",
        variant: "destructive",
      });
      return;
    }

    const payload = {
      ...data,
      categories,
    };

    if (template) {
      updateMutation.mutate(payload);
    } else {
      createMutation.mutate(payload);
    }
  };

  const addCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      setCategories(prev => [...prev, newCategory.trim()]);
      setNewCategory('');
    }
  };

  const removeCategory = (categoryToRemove: string) => {
    setCategories(prev => prev.filter(cat => cat !== categoryToRemove));
  };

  const handleCategoryKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addCategory();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle data-testid="modal-title">
            {template ? 'Edit Review Template' : 'Create New Template'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Template Name</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder="Enter template name"
                        data-testid="input-template-name"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="reviewType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Review Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-review-type">
                          <SelectValue placeholder="Select review type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="quarterly">Quarterly</SelectItem>
                        <SelectItem value="annual">Annual</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="instructions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Instructions</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      rows={4}
                      placeholder="Provide guidance for reviewers on how to use this template..."
                      data-testid="textarea-instructions"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <FormLabel>Performance Categories</FormLabel>
              <p className="text-sm text-gray-600 mb-3">
                Define the categories that will be rated in this review (1-5 scale for each category)
              </p>
              
              <div className="space-y-3">
                <div className="flex gap-2">
                  <Input
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    onKeyPress={handleCategoryKeyPress}
                    placeholder="Add a new category..."
                    className="flex-1"
                    data-testid="input-new-category"
                  />
                  <Button
                    type="button"
                    onClick={addCategory}
                    disabled={!newCategory.trim() || categories.includes(newCategory.trim())}
                    data-testid="button-add-category"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                </div>

                {categories.length > 0 && (
                  <div className="flex flex-wrap gap-2 p-3 border rounded-lg bg-gray-50">
                    {categories.map((category, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-sm py-1 px-3 flex items-center gap-2"
                        data-testid={`category-${index}`}
                      >
                        {category}
                        <button
                          type="button"
                          onClick={() => removeCategory(category)}
                          className="hover:text-red-600"
                          data-testid={`remove-category-${index}`}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}

                {categories.length === 0 && (
                  <div className="text-center py-6 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
                    <p>No categories added yet. Add at least one category to continue.</p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-between pt-4 border-t">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
                data-testid="button-cancel"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={createMutation.isPending || updateMutation.isPending || categories.length === 0}
                data-testid="button-save"
              >
                {createMutation.isPending || updateMutation.isPending 
                  ? "Saving..." 
                  : template ? "Update Template" : "Create Template"
                }
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
