import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Target, TrendingUp, Calendar, Filter, AlertCircle, Loader2, Edit, Trash2 } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { CreateGoalDialog } from '@/components/goals/CreateGoalDialog';
import { EditGoalDialog } from '@/components/goals/EditGoalDialog';
import { GoalDetailsDialog } from '@/components/goals/GoalDetailsDialog';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import type { Goal, GoalStatus, GoalCategory } from '@shared/schema';

export default function GoalsPage() {
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [filter, setFilter] = useState<'all' | GoalStatus>('all');
  const [categoryFilter, setCategoryFilter] = useState<'all' | GoalCategory>('all');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch goals data
  const { data: goals = [], isLoading, error } = useQuery<Goal[]>({
    queryKey: ['/api/goals'],
  });

  // Delete goal mutation
  const deleteGoalMutation = useMutation({
    mutationFn: async (goalId: string) => {
      return await apiRequest(`/api/goals/${goalId}`, 'DELETE');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/goals'] });
      toast({
        title: "Goal deleted",
        description: "The goal has been successfully deleted.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete goal.",
        variant: "destructive",
      });
    },
  });

  const getStatusColor = (status: GoalStatus) => {
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

  const filteredGoals = goals.filter((goal: Goal) => {
    const statusMatch = filter === 'all' || goal.status === filter;
    const categoryMatch = categoryFilter === 'all' || goal.category === categoryFilter;
    return statusMatch && categoryMatch;
  });

  const stats = {
    total: goals.length,
    completed: goals.filter((g: Goal) => g.status === 'completed').length,
    onTrack: goals.filter((g: Goal) => g.status === 'on-track').length,
    atRisk: goals.filter((g: Goal) => ['at-risk', 'behind'].includes(g.status)).length,
    avgProgress: goals.length > 0 ? Math.round(goals.reduce((acc: number, g: Goal) => acc + (g.progress || 0), 0) / goals.length) : 0
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Goals & Objectives</h1>
            <p className="text-muted-foreground">
              Track your professional development and performance goals
            </p>
          </div>
        </div>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Goals & Objectives</h1>
            <p className="text-muted-foreground">
              Track your professional development and performance goals
            </p>
          </div>
        </div>
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load goals. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Goals & Objectives</h1>
          <p className="text-muted-foreground">
            Track your professional development and performance goals
          </p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="gap-2" data-testid="button-create-goal">
              <Plus className="h-4 w-4" />
              New Goal
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Goal</DialogTitle>
            </DialogHeader>
            <CreateGoalDialog onClose={() => setShowCreateDialog(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Goals</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-total-goals">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600" data-testid="text-completed-goals">{stats.completed}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">On Track</CardTitle>
            <Calendar className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600" data-testid="text-ontrack-goals">{stats.onTrack}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">At Risk</CardTitle>
            <AlertCircle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600" data-testid="text-atrisk-goals">{stats.atRisk}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Progress</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-avg-progress">{stats.avgProgress}%</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Tabs */}
      <Tabs defaultValue="all">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="all" onClick={() => setFilter('all')}>All Goals</TabsTrigger>
            <TabsTrigger value="active" onClick={() => setFilter('active')}>Active</TabsTrigger>
            <TabsTrigger value="completed" onClick={() => setFilter('completed')}>Completed</TabsTrigger>
            <TabsTrigger value="at-risk" onClick={() => setFilter('at-risk')}>At Risk</TabsTrigger>
          </TabsList>
          
          <select 
            className="px-3 py-2 border rounded-md text-sm"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value as any)}
            data-testid="select-category-filter"
          >
            <option value="all">All Categories</option>
            <option value="performance">Performance</option>
            <option value="development">Development</option>
            <option value="leadership">Leadership</option>
            <option value="technical">Technical</option>
            <option value="business">Business</option>
            <option value="personal">Personal</option>
          </select>
        </div>

        <TabsContent value="all" className="space-y-4">
          {filteredGoals.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Target className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No goals found</h3>
                <p className="text-muted-foreground text-center mb-4">
                  Create your first goal to start tracking your progress.
                </p>
                <Button onClick={() => setShowCreateDialog(true)} data-testid="button-create-first-goal">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Goal
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {filteredGoals.map((goal: Goal) => (
                <Card key={goal.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 
                            className="text-lg font-semibold cursor-pointer hover:text-blue-600" 
                            onClick={() => setSelectedGoal(goal)}
                            data-testid={`text-goal-title-${goal.id}`}
                          >
                            {goal.title}
                          </h3>
                          <Badge variant={getPriorityColor(goal.priority)} data-testid={`badge-priority-${goal.id}`}>
                            {goal.priority}
                          </Badge>
                          <Badge 
                            className={`text-white ${getStatusColor(goal.status)}`}
                            data-testid={`badge-status-${goal.id}`}
                          >
                            {goal.status.replace('-', ' ')}
                          </Badge>
                        </div>
                        
                        <p className="text-muted-foreground mb-3" data-testid={`text-goal-description-${goal.id}`}>
                          {goal.description}
                        </p>
                        
                        <div className="flex items-center gap-4 mb-3">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">Category:</span>
                            <Badge variant="outline" data-testid={`badge-category-${goal.id}`}>
                              {goal.category}
                            </Badge>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">Due:</span>
                            <span className="text-sm" data-testid={`text-due-date-${goal.id}`}>
                              {new Date(goal.targetDate).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Progress</span>
                            <span className="text-sm font-medium" data-testid={`text-progress-${goal.id}`}>
                              {goal.progress || 0}%
                            </span>
                          </div>
                          <Progress value={goal.progress || 0} className="h-2" />
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingGoal(goal)}
                          data-testid={`button-edit-goal-${goal.id}`}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteGoalMutation.mutate(goal.id)}
                          disabled={deleteGoalMutation.isPending}
                          data-testid={`button-delete-goal-${goal.id}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Goal Details Dialog */}
      {selectedGoal && (
        <GoalDetailsDialog
          goal={selectedGoal}
          open={!!selectedGoal}
          onClose={() => setSelectedGoal(null)}
        />
      )}

      {/* Edit Goal Dialog */}
      {editingGoal && (
        <EditGoalDialog
          goal={editingGoal}
          open={!!editingGoal}
          onClose={() => setEditingGoal(null)}
        />
      )}
    </div>
  );
}