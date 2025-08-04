import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Target, TrendingUp, User } from 'lucide-react';
import { format } from 'date-fns';
import type { Goal } from '@shared/schema';

interface GoalDetailsDialogProps {
  goal: Goal;
  open: boolean;
  onClose: () => void;
}

export function GoalDetailsDialog({ goal, open, onClose }: GoalDetailsDialogProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'on-track': return 'bg-blue-500';
      case 'active': return 'bg-yellow-500';
      case 'at-risk': return 'bg-orange-500';
      case 'behind': return 'bg-red-500';
      case 'cancelled': return 'bg-gray-500';
      default: return 'bg-gray-400';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'destructive';
      case 'high': return 'default';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold" data-testid="text-goal-details-title">
            {goal.title}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Status and Priority */}
          <div className="flex items-center gap-3">
            <Badge 
              className={`text-white ${getStatusColor(goal.status)}`}
              data-testid="badge-goal-details-status"
            >
              {goal.status.replace('-', ' ')}
            </Badge>
            <Badge variant={getPriorityColor(goal.priority)} data-testid="badge-goal-details-priority">
              {goal.priority} priority
            </Badge>
          </div>

          {/* Description */}
          {goal.description && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground" data-testid="text-goal-details-description">
                  {goal.description}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Current Progress</span>
                  <span className="text-lg font-semibold" data-testid="text-goal-details-progress">
                    {goal.progress || 0}%
                  </span>
                </div>
                <Progress value={goal.progress || 0} className="h-3" />
              </div>
            </CardContent>
          </Card>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Category
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Badge variant="outline" className="text-base" data-testid="badge-goal-details-category">
                  {goal.category}
                </Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Target Date
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-base" data-testid="text-goal-details-target-date">
                  {goal.targetDate ? format(new Date(goal.targetDate), 'PPP') : 'No date set'}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Timestamps */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created:</span>
                  <span data-testid="text-goal-details-created">
                    {goal.createdAt ? format(new Date(goal.createdAt), 'PPP') : 'Unknown'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Last Updated:</span>
                  <span data-testid="text-goal-details-updated">
                    {goal.updatedAt ? format(new Date(goal.updatedAt), 'PPP') : 'Unknown'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Milestones and Metrics (if available) */}
          {goal.milestones && Array.isArray(goal.milestones) && goal.milestones.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Milestones</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {(goal.milestones as any[]).map((milestone: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-2 border rounded">
                      <span data-testid={`text-milestone-${index}`}>{milestone.title || 'Untitled'}</span>
                      <Badge variant={milestone.completed ? "default" : "outline"}>
                        {milestone.completed ? "Completed" : "Pending"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {goal.metrics && Array.isArray(goal.metrics) && goal.metrics.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {(goal.metrics as any[]).map((metric: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-2 border rounded">
                      <span data-testid={`text-metric-name-${index}`}>{metric.name || 'Metric'}</span>
                      <span data-testid={`text-metric-value-${index}`}>
                        {metric.current || 0}/{metric.target || 0} {metric.unit || ''}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}