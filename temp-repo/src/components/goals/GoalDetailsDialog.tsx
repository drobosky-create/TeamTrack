import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  Calendar, 
  Target, 
  TrendingUp, 
  CheckCircle2, 
  Circle,
  Edit,
  Trash2,
  Settings,
  FileText
} from 'lucide-react';
import { Goal } from '@/types/goals';
import { useGoals } from '@/hooks/useGoals';
import { useReviews } from '@/hooks/useReviews';
import { useToast } from '@/hooks/use-toast';
import { AddMilestoneDialog } from './AddMilestoneDialog';
import { AddMetricDialog } from './AddMetricDialog';
import { UpdateMetricDialog } from './UpdateMetricDialog';
import { EditGoalDialog } from './EditGoalDialog';
import { Button as LinkButton } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface GoalDetailsDialogProps {
  goal: Goal | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const GoalDetailsDialog: React.FC<GoalDetailsDialogProps> = ({
  goal,
  open,
  onOpenChange,
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddMilestone, setShowAddMilestone] = useState(false);
  const [showAddMetric, setShowAddMetric] = useState(false);
  const [showUpdateMetric, setShowUpdateMetric] = useState(false);
  const [showEditGoal, setShowEditGoal] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState<any>(null);
  const { createMilestone, createMetric, updateMilestone, updateMetric, updateGoal, toggleAutoCalculation, goals } = useGoals();
  const { reviews, linkGoalToReview } = useReviews();
  const { toast } = useToast();

  // Get the live goal data from the query instead of using the stale prop
  const liveGoal = goals?.find(g => g.id === goal?.id) || goal;

  if (!goal || !liveGoal) return null;

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

  const completedMilestones = liveGoal.milestones.filter(m => m.completed).length;

  const handleAddMilestone = () => {
    setShowAddMilestone(true);
  };

  const handleMilestoneSubmit = (data: { title: string; description?: string; targetDate: string }) => {
    createMilestone({
      goalId: liveGoal.id,
      title: data.title,
      description: data.description,
      targetDate: data.targetDate
    });
  };

  const handleAddMetric = () => {
    setShowAddMetric(true);
  };

  const handleMetricSubmit = (data: { name: string; target: number; unit: string; current?: number }) => {
    createMetric({
      goalId: liveGoal.id,
      name: data.name,
      target: data.target,
      unit: data.unit,
      current: data.current || 0
    });
  };

  const handleUpdateMetric = (metric: any) => {
    setSelectedMetric(metric);
    setShowUpdateMetric(true);
  };

  const handleEditGoal = () => {
    setShowEditGoal(true);
  };

  const handleGoalProgressUpdate = (progress: number) => {
    updateGoal({
      id: liveGoal.id,
      progress
    });
  };

  const handleDeleteGoal = () => {
    if (confirm(`Are you sure you want to delete the goal "${liveGoal.title}"?`)) {
      // Note: We'll need to add a delete mutation to the useGoals hook
      toast({
        title: "Delete functionality",
        description: "Goal deletion will be implemented in a future update.",
        variant: "destructive",
      });
    }
  };

  const handleMetricUpdate = (current: number) => {
    if (selectedMetric) {
      updateMetric({
        id: selectedMetric.id,
        current
      });
    }
  };

  const handleToggleMilestone = (milestoneId: string, completed: boolean) => {
    console.log('Toggling milestone:', milestoneId, 'Current completed:', completed);
    updateMilestone({
      id: milestoneId,
      completed: !completed,
      completedDate: !completed ? new Date().toISOString().split('T')[0] : undefined,
      goalId: liveGoal.id
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <DialogTitle className="text-xl">{liveGoal.title}</DialogTitle>
              <div className="flex items-center gap-2">
                <Badge variant={getPriorityColor(liveGoal.priority)}>
                  {liveGoal.priority}
                </Badge>
                <Badge className={`${getStatusColor(liveGoal.status)} text-white`}>
                  {liveGoal.status.replace('-', ' ')}
                </Badge>
                <Badge variant="outline">{liveGoal.category}</Badge>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleEditGoal}>
                <Edit className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={handleDeleteGoal}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="milestones">Milestones</TabsTrigger>
            <TabsTrigger value="metrics">Metrics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Progress Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Progress Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Overall Progress</span>
                    <span className="text-2xl font-bold">{liveGoal.progress}%</span>
                  </div>
                  <Progress value={liveGoal.progress} className="h-3" />
                </div>

                {/* Auto-calculation toggle */}
                <div className="flex items-center space-x-2 pt-2 border-t">
                  <Switch 
                    id="auto-calculate"
                    checked={liveGoal.autoCalculateProgress}
                    onCheckedChange={(checked) => toggleAutoCalculation({ goalId: liveGoal.id, autoCalculate: checked })}
                  />
                  <Label htmlFor="auto-calculate" className="text-sm cursor-pointer">
                    Auto-calculate progress from milestones
                  </Label>
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">Target Date</div>
                    <div className="font-medium">{liveGoal.targetDate.toLocaleDateString()}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">Days Remaining</div>
                    <div className="font-medium">
                      {Math.ceil((liveGoal.targetDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{liveGoal.description}</p>
              </CardContent>
            </Card>

            {/* Quick Stats & Review Link */}
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Milestones</p>
                      <p className="text-2xl font-bold">
                        {completedMilestones}/{liveGoal.milestones.length}
                      </p>
                    </div>
                    <CheckCircle2 className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Metrics</p>
                      <p className="text-2xl font-bold">{liveGoal.metrics.length}</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Review Integration */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Review Integration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {liveGoal.reviewId ? (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm font-medium text-blue-900">
                      This goal is linked to a performance review
                    </p>
                    <p className="text-xs text-blue-700 mt-1">
                      Progress on this goal will be tracked as part of your review process
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      Link this goal to a review for integrated performance tracking
                    </p>
                    <div className="flex gap-2">
                      <Select onValueChange={(reviewId) => linkGoalToReview({ goalId: liveGoal.id, reviewId })}>
                        <SelectTrigger className="flex-1">
                          <SelectValue placeholder="Select a review to link" />
                        </SelectTrigger>
                        <SelectContent>
                          {reviews?.filter(r => r.status !== 'completed').map((review) => (
                            <SelectItem key={review.id} value={review.id}>
                              {review.type} Review - {review.period}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="milestones" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Milestones</h3>
              <Button size="sm" onClick={handleAddMilestone}>Add Milestone</Button>
            </div>
            
            <div className="space-y-3">
              {liveGoal.milestones.map((milestone, index) => (
                <Card key={milestone.id}>
                  <CardContent className="pt-4">
                     <div className="flex items-start gap-3">
                       <button 
                         onClick={() => handleToggleMilestone(milestone.id, milestone.completed)}
                         className="mt-0.5"
                       >
                         {milestone.completed ? (
                           <CheckCircle2 className="h-5 w-5 text-green-500 hover:text-green-600 cursor-pointer" />
                         ) : (
                           <Circle className="h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer" />
                         )}
                       </button>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className={`font-medium ${milestone.completed ? 'line-through text-muted-foreground' : ''}`}>
                            {milestone.title}
                          </h4>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            {milestone.targetDate.toLocaleDateString()}
                          </div>
                        </div>
                        {milestone.description && (
                          <p className="text-sm text-muted-foreground">
                            {milestone.description}
                          </p>
                        )}
                        {milestone.completed && milestone.completedDate && (
                          <p className="text-sm text-green-600">
                            Completed on {milestone.completedDate.toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="metrics" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Metrics & KPIs</h3>
              <Button size="sm" onClick={handleAddMetric}>Add Metric</Button>
            </div>
            
            <div className="grid gap-4">
              {liveGoal.metrics.map((metric) => (
                <Card key={metric.id}>
                  <CardContent className="pt-4">
                    <div className="space-y-3">
                       <div className="flex items-center justify-between">
                         <h4 className="font-medium">{metric.name}</h4>
                         <div className="text-right">
                           <button 
                             onClick={() => handleUpdateMetric(metric)}
                             className="text-lg font-bold hover:text-primary cursor-pointer transition-colors"
                             title="Click to update current value"
                           >
                             {metric.current} / {metric.target} {metric.unit}
                           </button>
                           <div className="text-sm text-muted-foreground">
                             {Math.round((metric.current / metric.target) * 100)}% of target
                           </div>
                         </div>
                       </div>
                       <Progress 
                         value={(metric.current / metric.target) * 100} 
                         className="h-3 bg-secondary" 
                       />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
        
        <AddMilestoneDialog
          open={showAddMilestone}
          onOpenChange={setShowAddMilestone}
          onSubmit={handleMilestoneSubmit}
        />
        
        <AddMetricDialog
          open={showAddMetric}
          onOpenChange={setShowAddMetric}
          onSubmit={handleMetricSubmit}
        />
        
        <UpdateMetricDialog
          open={showUpdateMetric}
          onOpenChange={setShowUpdateMetric}
          onSubmit={handleMetricUpdate}
          metric={selectedMetric}
        />
        
        <EditGoalDialog
          open={showEditGoal}
          onOpenChange={setShowEditGoal}
          onSubmit={handleGoalProgressUpdate}
          currentProgress={liveGoal.progress}
          goalTitle={liveGoal.title}
        />
      </DialogContent>
    </Dialog>
  );
};