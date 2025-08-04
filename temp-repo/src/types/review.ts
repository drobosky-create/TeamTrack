export type ReviewType = 'monthly' | 'quarterly' | 'annual';
export type ReviewStatus = 'not_started' | 'in_progress' | 'complete' | 'overdue';

export interface ReviewCategory {
  id: string;
  label: string;
  description?: string;
  weight?: number;
}

export interface ReviewScore {
  categoryId: string;
  selfScore?: number;
  managerScore?: number;
  finalScore?: number;
  selfNotes?: string;
  managerNotes?: string;
}

export interface Review {
  id: string;
  userId: string;
  managerId: string;
  templateId: string;
  type: ReviewType;
  period: string; // e.g., "2024-Q1", "2024-03"
  status: ReviewStatus;
  scores: ReviewScore[];
  selfReviewCompleted: boolean;
  managerReviewCompleted: boolean;
  overallOutcome?: 'pass' | 'fail';
  requiresFollowUp: boolean;
  attachments: ReviewAttachment[];
  createdAt: Date;
  updatedAt: Date;
  dueDate: Date;
  completedAt?: Date;
}

export interface ReviewAttachment {
  id: string;
  filename: string;
  url: string;
  type: string;
  uploadedBy: string;
  uploadedAt: Date;
}

export interface ReviewTemplate {
  id: string;
  name: string;
  type: ReviewType;
  categories: ReviewCategory[];
  instructions?: string;
  isDefault: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}