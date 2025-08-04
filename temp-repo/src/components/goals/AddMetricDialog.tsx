import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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

const addMetricSchema = z.object({
  name: z.string().min(1, 'Metric name is required'),
  target: z.string().min(1, 'Target value is required').refine(
    (val) => !isNaN(Number(val)) && Number(val) > 0,
    'Target must be a positive number'
  ),
  unit: z.string().min(1, 'Unit is required'),
  current: z.string().refine(
    (val) => val === '' || (!isNaN(Number(val)) && Number(val) >= 0),
    'Current value must be a non-negative number'
  ).optional(),
});

type AddMetricFormData = z.infer<typeof addMetricSchema>;

interface AddMetricDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: { name: string; target: number; unit: string; current?: number }) => void;
}

export const AddMetricDialog: React.FC<AddMetricDialogProps> = ({
  open,
  onOpenChange,
  onSubmit,
}) => {
  const form = useForm<AddMetricFormData>({
    resolver: zodResolver(addMetricSchema),
    defaultValues: {
      name: '',
      target: '',
      unit: '',
      current: '0',
    },
  });

  const handleSubmit = (data: AddMetricFormData) => {
    onSubmit({
      name: data.name,
      target: parseFloat(data.target),
      unit: data.unit,
      current: data.current ? parseFloat(data.current) : 0,
    });
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Metric</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Metric Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Revenue Generated" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="target"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target Value</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="100" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="unit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Unit</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., $, hours, %" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="current"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Value (Optional)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="0" 
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
                Add Metric
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};