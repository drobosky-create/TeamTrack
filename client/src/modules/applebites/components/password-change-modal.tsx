import { useState } from 'react';




import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { apiRequest } from '../../../lib/queryClient';
import { AlertCircle, Lock } from 'lucide-react';

const passwordChangeSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type PasswordChangeForm = z.infer<typeof passwordChangeSchema>;

interface PasswordChangeModalProps {
  isOpen: boolean;
  onSuccess: () => void;
  userEmail: string;
}

export default function PasswordChangeModal({ isOpen, onSuccess, userEmail }: PasswordChangeModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<PasswordChangeForm>({
    resolver: zodResolver(passwordChangeSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: PasswordChangeForm) => {
    setIsLoading(true);
    try {
      await apiRequest('POST', '/api/team/change-password', {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });

      toast({
        title: 'Success',
        description: 'Your password has been updated successfully.',
      });

      form.reset();
      onSuccess();
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to change password',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent  onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <div >
            <div >
              <Lock  />
            </div>
            <div>
              <DialogTitle>Password Change Required</DialogTitle>
              <DialogDescription >
                For security reasons, you must change your temporary password before continuing.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div >
          <div >
            <AlertCircle  />
            <div >
              <p >Account: {userEmail}</p>
              <p >You're using a temporary password. Please create a secure password to continue.</p>
            </div>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} >
            <FormField
              control={form.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Password</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      type="password" 
                      placeholder="Enter your temporary password"
                      
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      type="password" 
                      placeholder="Create a new secure password"
                      
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm New Password</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      type="password" 
                      placeholder="Confirm your new password"
                      
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div >
              <Button 
                type="submit" 
                disabled={isLoading}
                
              >
                {isLoading ? 'Updating...' : 'Update Password'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}