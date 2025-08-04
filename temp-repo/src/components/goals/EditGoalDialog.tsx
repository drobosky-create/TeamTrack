import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

const editGoalSchema = z.object({
  progress: z.string().min(1, 'Progress is required').refine(
    (val) => !isNaN(Number(val)) && Number(val) >= 0 && Number(val) <= 100,
    'Progress must be a number between 0 and 100'
  ),
});

type EditGoalFormData = z.infer<typeof editGoalSchema>;

interface EditGoalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (progress: number) => void;
  currentProgress: number;
  goalTitle: string;
}

export const EditGoalDialog: React.FC<EditGoalDialogProps> = ({
  open,
  onOpenChange,
  onSubmit,
  currentProgress,
  goalTitle,
}) => {
  const form = useForm<EditGoalFormData>({
    resolver: zodResolver(editGoalSchema),
    defaultValues: {
      progress: currentProgress.toString(),
    },
  });

  // Reset form when dialog opens
  React.useEffect(() => {
    if (open) {
      form.reset({
        progress: currentProgress.toString(),
      });
    }
  }, [open, currentProgress, form]);

  const handleSubmit = (data: EditGoalFormData) => {
    onSubmit(parseFloat(data.progress));
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Goal Progress</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <div className="mb-4 p-4 bg-muted rounded-lg">
            <div className="text-sm text-muted-foreground mb-1">Goal</div>
            <div className="font-semibold">{goalTitle}</div>
          </div>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="progress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Progress (%)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="Enter progress (0-100)"
                      min="0"
                      max="100"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                Update Progress
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};