import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  FileText, 
  Plus, 
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle,
  Star,
  Upload,
  Filter,
  BarChart3
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Review, ReviewStatus, ReviewType } from '@/types/review';

// Mock review data
const mockReviews: Review[] = [
  {
    id: '1',
    userId: '3',
    managerId: '2', 
    templateId: 'temp1',
    type: 'monthly',
    period: '2024-12',
    status: 'in_progress',
    scores: [
      { categoryId: 'cat1', selfScore: 4, selfNotes: 'Strong performance this month' },
      { categoryId: 'cat2', selfScore: 3, selfNotes: 'Room for improvement' },
    ],
    selfReviewCompleted: true,
    managerReviewCompleted: false,
    requiresFollowUp: false,
    attachments: [],
    createdAt: new Date('2024-12-01'),
    updatedAt: new Date('2024-12-15'),
    dueDate: new Date('2024-12-31'),
  },
  {
    id: '2',
    userId: '4',
    managerId: '2',
    templateId: 'temp1', 
    type: 'quarterly',
    period: '2024-Q4',
    status: 'complete',
    scores: [
      { categoryId: 'cat1', selfScore: 4, managerScore: 4, finalScore: 4 },
      { categoryId: 'cat2', selfScore: 3, managerScore: 4, finalScore: 4 },
    ],
    selfReviewCompleted: true,
    managerReviewCompleted: true,
    overallOutcome: 'pass',
    requiresFollowUp: false,
    attachments: [],
    createdAt: new Date('2024-10-01'),
    updatedAt: new Date('2024-11-15'),
    dueDate: new Date('2024-12-31'),
    completedAt: new Date('2024-11-15'),
  },
  {
    id: '3',
    userId: '5',
    managerId: '1',
    templateId: 'temp1',
    type: 'quarterly', 
    period: '2024-Q4',
    status: 'overdue',
    scores: [],
    selfReviewCompleted: false,
    managerReviewCompleted: false,
    requiresFollowUp: true,
    attachments: [],
    createdAt: new Date('2024-10-01'),
    updatedAt: new Date('2024-10-01'),
    dueDate: new Date('2024-12-15'),
  }
];

// Mock team members for display
const teamMembers = [
  { id: '1', name: 'Sarah Johnson' },
  { id: '2', name: 'Michael Chen' },
  { id: '3', name: 'Alex Rivera' },
  { id: '4', name: 'Jennifer Wu' },
  { id: '5', name: 'David Chen' },
];

export const ReviewsPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const getStatusBadge = (status: ReviewStatus) => {
    switch (status) {
      case 'complete':
        return <Badge className="bg-success/10 text-success border-success/20">Complete</Badge>;
      case 'in_progress':
        return <Badge variant="secondary">In Progress</Badge>;
      case 'overdue':
        return <Badge className="bg-destructive/10 text-destructive border-destructive/20">Overdue</Badge>;
      case 'not_started':
        return <Badge variant="outline">Not Started</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getStatusIcon = (status: ReviewStatus) => {
    switch (status) {
      case 'complete':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'in_progress':
        return <Clock className="h-4 w-4 text-primary" />;
      case 'overdue':
        return <AlertTriangle className="h-4 w-4 text-destructive" />;
      case 'not_started':
        return <FileText className="h-4 w-4 text-muted-foreground" />;
      default:
        return <FileText className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getUserName = (userId: string) => {
    return teamMembers.find(member => member.id === userId)?.name || 'Unknown User';
  };

  // Filter reviews based on user role
  const getVisibleReviews = () => {
    let filtered = mockReviews;
    
    // Role-based filtering
    if (user?.role === 'team_member') {
      filtered = filtered.filter(review => review.userId === user.id);
    } else if (user?.role === 'manager') {
      filtered = filtered.filter(review => 
        review.managerId === user.id || review.userId === user.id
      );
    }
    // Admin sees all reviews

    // Status filtering
    if (statusFilter !== 'all') {
      filtered = filtered.filter(review => review.status === statusFilter);
    }

    // Type filtering  
    if (typeFilter !== 'all') {
      filtered = filtered.filter(review => review.type === typeFilter);
    }

    return filtered;
  };

  const visibleReviews = getVisibleReviews();

  // Calculate stats
  const stats = {
    total: visibleReviews.length,
    inProgress: visibleReviews.filter(r => r.status === 'in_progress').length,
    overdue: visibleReviews.filter(r => r.status === 'overdue').length,
    completed: visibleReviews.filter(r => r.status === 'complete').length,
  };

  const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">Performance Reviews</h1>
          <p className="text-foreground-muted mt-1">Track and manage team performance evaluations</p>
        </div>
        <div className="flex gap-2">
          {(user?.role === 'admin' || user?.role === 'manager') && (
            <>
              <Button 
                variant="outline"
                className="gap-2"
                onClick={() => navigate('/reviews/dashboard')}
              >
                <BarChart3 className="h-4 w-4" />
                Analytics
              </Button>
              <Button 
                className="gap-2 bg-gradient-primary hover:opacity-90"
                onClick={() => navigate('/reviews/create')}
              >
                <Plus className="h-4 w-4" />
                Create Review
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="shadow-soft border-border-soft">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats.total}</div>
            <p className="text-xs text-muted-foreground">All periods</p>
          </CardContent>
        </Card>

        <Card className="shadow-soft border-border-soft">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats.inProgress}</div>
            <p className="text-xs text-muted-foreground">Active reviews</p>
          </CardContent>
        </Card>

        <Card className="shadow-soft border-border-soft">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{stats.overdue}</div>
            <p className="text-xs text-destructive">Need attention</p>
          </CardContent>
        </Card>

        <Card className="shadow-soft border-border-soft">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{completionRate}%</div>
            <Progress value={completionRate} className="mt-2 h-1" />
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="shadow-soft border-border-soft">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Label className="text-sm font-medium">Filters:</Label>
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="not_started">Not Started</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="complete">Complete</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="quarterly">Quarterly</SelectItem>
                <SelectItem value="annual">Annual</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Reviews List */}
      <div className="space-y-4">
        {visibleReviews.map((review) => (
          <Card key={review.id} className="shadow-soft border-border-soft hover:shadow-soft-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className="flex-shrink-0">
                    {getStatusIcon(review.status)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-medium text-foreground">
                        {getUserName(review.userId)} - {review.type} Review
                      </h3>
                      {getStatusBadge(review.status)}
                      <Badge variant="outline" className="text-xs">
                        {review.period}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3 w-3" />
                        Due: {review.dueDate.toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-2">
                        <FileText className="h-3 w-3" />
                        Self: {review.selfReviewCompleted ? 'Complete' : 'Pending'}
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="h-3 w-3" />
                        Manager: {review.managerReviewCompleted ? 'Complete' : 'Pending'}
                      </div>
                    </div>

                    {review.overallOutcome && (
                      <div className="mt-2">
                        <Badge 
                          variant={review.overallOutcome === 'pass' ? 'default' : 'destructive'}
                          className="text-xs"
                        >
                          {review.overallOutcome === 'pass' ? 'Passed' : 'Needs Improvement'}
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate(`/reviews/${review.id}`)}
                  >
                    View Details
                  </Button>
                  {(user?.id === review.userId || user?.id === review.managerId || user?.role === 'admin') && 
                   review.status !== 'complete' && (
                    <Button 
                      size="sm" 
                      className="bg-gradient-primary hover:opacity-90"
                      onClick={() => navigate(`/reviews/${review.id}`)}
                    >
                      {user?.id === review.userId ? 'Complete Self Review' : 'Complete Manager Review'}
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {visibleReviews.length === 0 && (
        <Card className="shadow-soft border-border-soft">
          <CardContent className="pt-12 pb-12 text-center">
            <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-medium text-foreground mb-2">No reviews found</h3>
            <p className="text-muted-foreground mb-6">
              {statusFilter !== 'all' || typeFilter !== 'all' 
                ? "Try adjusting your filters to see more reviews"
                : "No performance reviews have been created yet"
              }
            </p>
            {(user?.role === 'admin' || user?.role === 'manager') && (
              <Button 
                className="bg-gradient-primary hover:opacity-90"
                onClick={() => navigate('/reviews/create')}
              >
                Create First Review
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};