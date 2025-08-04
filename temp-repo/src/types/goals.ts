export interface Goal {
  id: string;
  title: string;
  description: string;
  category: GoalCategory;
  priority: GoalPriority;
  status: GoalStatus;
  progress: number; // 0-100
  targetDate: Date;
  createdDate: Date;
  updatedDate: Date;
  userId: string;
  assignedBy?: string;
  reviewId?: string;
  autoCalculateProgress: boolean;
  milestones: GoalMilestone[];
  metrics: GoalMetric[];
}

export interface GoalMilestone {
  id: string;
  title: string;
  description?: string;
  targetDate: Date;
  completed: boolean;
  completedDate?: Date;
}

export interface GoalMetric {
  id: string;
  name: string;
  target: number;
  current: number;
  unit: string;
}

export type GoalCategory = 
  | 'performance'
  | 'development'
  | 'leadership'
  | 'technical'
  | 'business'
  | 'personal';

export type GoalPriority = 'low' | 'medium' | 'high' | 'critical';

export type GoalStatus = 
  | 'draft'
  | 'active'
  | 'on-track'
  | 'at-risk'
  | 'behind'
  | 'completed'
  | 'cancelled';

export interface GoalTemplate {
  id: string;
  title: string;
  description: string;
  category: GoalCategory;
  defaultPriority: GoalPriority;
  suggestedDuration: number; // days
  milestoneTemplates: Omit<GoalMilestone, 'id' | 'completed' | 'completedDate'>[];
  metricTemplates: Omit<GoalMetric, 'id' | 'current'>[];
}