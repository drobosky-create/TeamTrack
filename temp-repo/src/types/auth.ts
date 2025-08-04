export type UserRole = 'admin' | 'manager' | 'team_member';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  department?: string;
  managerId?: string;
  employmentType: 'employee' | 'contractor';
  reviewCadence: 'monthly' | 'quarterly' | 'annual';
  avatar?: string;
  createdAt: Date;
  lastLogin?: Date;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}