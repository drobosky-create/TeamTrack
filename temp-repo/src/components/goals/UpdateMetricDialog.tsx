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

const updateMetricSchema = z.object({
  current: z.string().min(1, 'Current value is required').refine(
    (val) => !isNaN(Number(val)) && Number(val) >= 0,
    'Current value must be a non-negative number'
  ),
});

type UpdateMetricFormData = z.infer<typeof updateMetricSchema>;

interface UpdateMetricDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (current: number) => void;
  metric: {
    name: string;
    current: number;
    target: number;
    unit: string;
  } | null;
}

export const UpdateMetricDialog: React.FC<UpdateMetricDialogProps> = ({
  open,
  onOpenChange,
  onSubmit,
  metric,
}) => {
  const form = useForm<UpdateMetricFormData>({
    resolver: zodResolver(updateMetricSchema),
    defaultValues: {
      current: metric?.current?.toString() || '0',
    },
  });

  // Reset form when metric changes
  React.useEffect(() => {
    if (metric) {
      form.reset({
        current: metric.current.toString(),
      });
    }
  }, [metric, form]);

  const handleSubmit = (data: UpdateMetricFormData) => {
    onSubmit(parseFloat(data.current));
    onOpenChange(false);
  };

  if (!metric) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update {metric.name}</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <div className="mb-4 p-4 bg-muted rounded-lg">
            <div className="text-sm text-muted-foreground mb-1">Target</div>
            <div className="text-lg font-semibold">
              {metric.target} {metric.unit}
            </div>
          </div>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="current"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Value</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="Enter current value"
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
                Update Metric
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};