import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Target, TrendingUp, Calendar, Filter, AlertCircle, Loader2 } from 'lucide-react';
import { Goal, GoalStatus, GoalCategory } from '@/types/goals';
import { CreateGoalDialog } from './CreateGoalDialog';
import { GoalDetailsDialog } from './GoalDetailsDialog';
import { useGoals } from '@/hooks/useGoals';
import { Alert, AlertDescription } from '@/components/ui/alert';

export const GoalsPage: React.FC = () => {
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [filter, setFilter] = useState<'all' | GoalStatus>('all');
  const [categoryFilter, setCategoryFilter] = useState<'all' | GoalCategory>('all');

  // Fetch real goals data
  const { goals, isLoading, error } = useGoals();

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

  const filteredGoals = goals.filter(goal => {
    const statusMatch = filter === 'all' || goal.status === filter;
    const categoryMatch = categoryFilter === 'all' || goal.category === categoryFilter;
    return statusMatch && categoryMatch;
  });

  const stats = {
    total: goals.length,
    completed: goals.filter(g => g.status === 'completed').length,
    onTrack: goals.filter(g => g.status === 'on-track').length,
    atRisk: goals.filter(g => ['at-risk', 'behind'].includes(g.status)).length,
    avgProgress: goals.length > 0 ? Math.round(goals.reduce((acc, g) => acc + g.progress, 0) / goals.length) : 0
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
        <Alert variant="destructive">
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
        <Button onClick={() => setShowCreateDialog(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          New Goal
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Goals</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">On Track</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.onTrack}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Progress</CardTitle>
            <Filter className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgProgress}%</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all" onClick={() => setFilter('all')}>All Goals</TabsTrigger>
          <TabsTrigger value="active" onClick={() => setFilter('active')}>Active</TabsTrigger>
          <TabsTrigger value="on-track" onClick={() => setFilter('on-track')}>On Track</TabsTrigger>
          <TabsTrigger value="at-risk" onClick={() => setFilter('at-risk')}>At Risk</TabsTrigger>
          <TabsTrigger value="completed" onClick={() => setFilter('completed')}>Completed</TabsTrigger>
        </TabsList>

        <TabsContent value={filter} className="space-y-4">
          {/* Goals Grid */}
          {filteredGoals.length === 0 ? (
            <div className="text-center py-12">
              <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                {filter === 'all' ? 'No goals yet' : `No ${filter.replace('-', ' ')} goals`}
              </h3>
              <p className="text-muted-foreground mb-4">
                {filter === 'all' 
                  ? 'Start by creating your first goal to track your progress.' 
                  : `No goals match the current filter. Try viewing all goals or create a new one.`
                }
              </p>
              {filter === 'all' && (
                <Button onClick={() => setShowCreateDialog(true)} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Create Your First Goal
                </Button>
              )}
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredGoals.map((goal) => (
                <Card key={goal.id} className="cursor-pointer hover:shadow-md transition-shadow" 
                      onClick={() => setSelectedGoal(goal)}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-base line-clamp-2">{goal.title}</CardTitle>
                      <Badge variant={getPriorityColor(goal.priority)} className="text-xs">
                        {goal.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {goal.description}
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Progress</span>
                        <span className="font-medium">{goal.progress}%</span>
                      </div>
                      <Progress value={goal.progress} className="h-2" />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Badge 
                        className={`${getStatusColor(goal.status)} text-white`}
                      >
                        {goal.status.replace('-', ' ')}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        Due {goal.targetDate.toLocaleDateString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <CreateGoalDialog 
        open={showCreateDialog} 
        onOpenChange={setShowCreateDialog}
      />
      
      <GoalDetailsDialog 
        goal={selectedGoal}
        open={!!selectedGoal}
        onOpenChange={(open) => !open && setSelectedGoal(null)}
      />
    </div>
  );
};