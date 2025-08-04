import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import RatingInput from "./rating-input";
import { CloudUpload, X, FileText } from "lucide-react";
import type { Review, ReviewTemplate, User } from "@shared/schema";
import type { CategoryScore } from "@/types";

const reviewFormSchema = z.object({
  employeeId: z.string().min(1, "Employee is required"),
  templateId: z.string().min(1, "Template is required"),
  reviewType: z.enum(['monthly', 'quarterly', 'annual']),
  dueDate: z.string().min(1, "Due date is required"),
  selfReviewNotes: z.string().optional(),
  managerReviewNotes: z.string().optional(),
  requiresFollowUp: z.boolean().default(false),
  followUpNotes: z.string().optional(),
});

type ReviewFormData = z.infer<typeof reviewFormSchema>;

interface ReviewFormModalProps {
  open: boolean;
  onClose: () => void;
  review?: Review | null;
  onSuccess: () => void;
}

export default function ReviewFormModal({ open, onClose, review, onSuccess }: ReviewFormModalProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [scores, setScores] = useState<CategoryScore>({});
  const [attachments, setAttachments] = useState<string[]>([]);

  const { data: users } = useQuery<User[]>({
    queryKey: ["/api/users"],
    enabled: open && (user?.role === 'admin' || user?.role === 'manager'),
  });

  const { data: templates } = useQuery<ReviewTemplate[]>({
    queryKey: ["/api/templates"],
    enabled: open,
  });

  const form = useForm<ReviewFormData>({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: {
      employeeId: '',
      templateId: '',
      reviewType: 'quarterly',
      dueDate: '',
      selfReviewNotes: '',
      managerReviewNotes: '',
      requiresFollowUp: false,
      followUpNotes: '',
    },
  });

  const selectedTemplate = templates?.find(t => t.id === form.watch('templateId'));

  useEffect(() => {
    if (review) {
      form.reset({
        employeeId: review.employeeId,
        templateId: review.templateId,
        reviewType: review.reviewType,
        dueDate: review.dueDate.split('T')[0],
        selfReviewNotes: review.selfReviewNotes || '',
        managerReviewNotes: review.managerReviewNotes || '',
        requiresFollowUp: review.requiresFollowUp,
        followUpNotes: review.followUpNotes || '',
      });
      setScores((review.scores as CategoryScore) || {});
      setAttachments(review.attachments || []);
    } else {
      form.reset();
      setScores({});
      setAttachments([]);
    }
  }, [review, form]);

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      await apiRequest('POST', '/api/reviews', data);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Review created successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/reviews"] });
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
        description: "Failed to create review",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      await apiRequest('PUT', `/api/reviews/${review?.id}`, data);
    },
    onSuccess: () => {
      toast({
        title: "Success", 
        description: "Review updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/reviews"] });
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
        description: "Failed to update review",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ReviewFormData) => {
    const payload = {
      ...data,
      managerId: user?.id,
      dueDate: new Date(data.dueDate).toISOString(),
      scores,
      attachments,
    };

    if (review) {
      updateMutation.mutate(payload);
    } else {
      createMutation.mutate(payload);
    }
  };

  const handleScoreChange = (category: string, score: number) => {
    setScores(prev => ({ ...prev, [category]: score }));
  };

  const isReadOnly = review && user?.role === 'team_member' && user?.id !== review.employeeId;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle data-testid="modal-title">
            {review ? `Performance Review - ${review.employeeId}` : 'Create New Review'}
          </DialogTitle>
          {review && (
            <p className="text-sm text-gray-600">
              {review.reviewType?.charAt(0).toUpperCase() + review.reviewType?.slice(1)} Review • Due {new Date(review.dueDate).toLocaleDateString()}
            </p>
          )}
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {!review && (user?.role === 'admin' || user?.role === 'manager') && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="employeeId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Employee</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-employee">
                            <SelectValue placeholder="Select employee" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {users?.filter(u => u.role === 'team_member').map((employee) => (
                            <SelectItem key={employee.id} value={employee.id}>
                              {employee.firstName} {employee.lastName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="templateId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Template</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-template">
                            <SelectValue placeholder="Select template" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {templates?.map((template) => (
                            <SelectItem key={template.id} value={template.id}>
                              {template.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {selectedTemplate && (
              <div>
                <h4 className="text-md font-semibold text-gray-900 mb-4">Performance Categories</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {(selectedTemplate.categories as string[])?.map((category, index) => (
                    <RatingInput
                      key={index}
                      label={category}
                      value={scores[category] || 0}
                      onChange={(score) => handleScoreChange(category, score)}
                      disabled={isReadOnly}
                    />
                  ))}
                </div>
              </div>
            )}

            <FormField
              control={form.control}
              name="selfReviewNotes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Self-Review Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      rows={4}
                      placeholder="Add your self-assessment notes here..."
                      disabled={user?.role !== 'team_member' && !review}
                      data-testid="textarea-self-notes"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="managerReviewNotes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Manager Review Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      rows={4}
                      placeholder="Add manager assessment notes here..."
                      disabled={user?.role === 'team_member'}
                      data-testid="textarea-manager-notes"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-3">
              <FormField
                control={form.control}
                name="requiresFollowUp"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={user?.role === 'team_member'}
                        data-testid="checkbox-follow-up"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Requires Follow-up Action</FormLabel>
                    </div>
                  </FormItem>
                )}
              />

              {form.watch('requiresFollowUp') && (
                <FormField
                  control={form.control}
                  name="followUpNotes"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          {...field}
                          rows={3}
                          placeholder="Describe follow-up actions needed..."
                          disabled={user?.role === 'team_member'}
                          data-testid="textarea-follow-up"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            <div>
              <FormLabel>Attachments</FormLabel>
              <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <CloudUpload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">
                  Drag and drop files here, or{" "}
                  <button type="button" className="text-primary hover:text-blue-700">browse</button>
                </p>
                <p className="text-xs text-gray-500 mt-1">PDF, images, documents up to 10MB</p>
              </div>
              
              {attachments.length > 0 && (
                <div className="mt-3 space-y-2">
                  {attachments.map((attachment, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div className="flex items-center space-x-2">
                        <FileText className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-700">{attachment}</span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setAttachments(prev => prev.filter((_, i) => i !== index))}
                        data-testid={`remove-attachment-${index}`}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-between pt-4 border-t">
              <Button type="button" variant="outline" onClick={onClose} data-testid="button-cancel">
                Cancel
              </Button>
              <div className="space-x-3">
                <Button 
                  type="button" 
                  variant="outline" 
                  disabled={createMutation.isPending || updateMutation.isPending}
                  data-testid="button-save-draft"
                >
                  Save Draft
                </Button>
                <Button 
                  type="submit" 
                  disabled={createMutation.isPending || updateMutation.isPending}
                  data-testid="button-submit"
                >
                  {createMutation.isPending || updateMutation.isPending ? "Saving..." : 
                   review ? "Update Review" : "Create Review"}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
