import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from "@/hooks/use-toast";

export interface Notification {
  id: string;
  type: 'review_due' | 'review_overdue' | 'review_completed' | 'feedback_request' | 'goal_update' | 'general';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
  userId?: string;
  priority: 'low' | 'medium' | 'high';
}

interface NotificationContextValue {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotification: (id: string) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
}

const NotificationContext = createContext<NotificationContextValue | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

// Mock notifications data
const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'review_due',
    title: 'Review Due Soon',
    message: 'Sarah Johnson\'s quarterly review is due in 3 days',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    read: false,
    actionUrl: '/reviews/review-123',
    priority: 'high'
  },
  {
    id: '2',
    type: 'review_overdue',
    title: 'Overdue Review',
    message: 'Mike Chen\'s monthly review is 2 days overdue',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    read: false,
    actionUrl: '/reviews/review-456',
    priority: 'high'
  },
  {
    id: '3',
    type: 'review_completed',
    title: 'Review Completed',
    message: 'Alex Thompson has completed their self-assessment',
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
    read: true,
    actionUrl: '/reviews/review-789',
    priority: 'medium'
  },
  {
    id: '4',
    type: 'feedback_request',
    title: 'Feedback Request',
    message: 'You have a new 360-degree feedback request from Emma Wilson',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    read: false,
    actionUrl: '/reviews/feedback-321',
    priority: 'medium'
  },
  {
    id: '5',
    type: 'goal_update',
    title: 'Goal Progress Update',
    message: 'David Kim has updated progress on Q4 objectives',
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
    read: true,
    actionUrl: '/goals/goal-654',
    priority: 'low'
  }
];

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    // Load notifications from localStorage or API
    const stored = localStorage.getItem('notifications');
    if (stored) {
      const parsed = JSON.parse(stored).map((n: any) => ({
        ...n,
        timestamp: new Date(n.timestamp)
      }));
      setNotifications(parsed);
    } else {
      setNotifications(mockNotifications);
    }
  }, []);

  useEffect(() => {
    // Save notifications to localStorage
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }, [notifications]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, read: true }))
    );
  };

  const clearNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false
    };
    
    setNotifications(prev => [newNotification, ...prev]);
    
    // Show toast for high priority notifications
    if (notification.priority === 'high') {
      toast({
        title: notification.title,
        description: notification.message,
        variant: notification.type === 'review_overdue' ? 'destructive' : 'default'
      });
    }
  };

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      markAsRead,
      markAllAsRead,
      clearNotification,
      addNotification
    }}>
      {children}
    </NotificationContext.Provider>
  );
};