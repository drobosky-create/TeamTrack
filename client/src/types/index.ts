export interface DashboardMetrics {
  totalTeamMembers: number;
  pendingReviews: number;
  overdueReviews: number;
  averageScore: number;
  completedThisMonth: number;
}

export interface CategoryScore {
  [categoryName: string]: number;
}

export interface ReviewWithDetails {
  id: string;
  employeeId: string;
  managerId: string;
  templateId: string;
  reviewType: 'monthly' | 'quarterly' | 'annual';
  dueDate: string;
  status: 'not_started' | 'in_progress' | 'complete' | 'overdue';
  selfReviewNotes?: string;
  managerReviewNotes?: string;
  scores?: CategoryScore;
  requiresFollowUp: boolean;
  followUpNotes?: string;
  attachments?: string[];
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
  employee: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    profileImageUrl?: string;
    department?: string;
  };
  manager: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    profileImageUrl?: string;
  };
  template: {
    id: string;
    name: string;
    categories: string[];
    instructions?: string;
  };
}
