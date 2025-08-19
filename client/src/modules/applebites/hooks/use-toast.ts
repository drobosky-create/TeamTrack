import { useState } from 'react';

export interface ToastProps {
  title: string;
  description?: string;
  variant?: 'default' | 'destructive';
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const toast = (props: ToastProps) => {
    // Simple console implementation for now - can be enhanced later
    console.log(`Toast: ${props.title} - ${props.description || ''}`);
    
    // Add toast to state for potential UI implementation
    setToasts(prev => [...prev, props]);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
      setToasts(prev => prev.slice(1));
    }, 3000);
  };

  return { toast, toasts };
}