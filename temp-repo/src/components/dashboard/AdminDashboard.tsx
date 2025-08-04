import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  FileText, 
  AlertTriangle, 
  TrendingUp, 
  Calendar,
  Plus,
  ArrowRight
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  // Mock data - would come from API
  const stats = {
    totalUsers: 24,
    activeReviews: 8,
    overdueReviews: 3,
    completionRate: 78,
    avgScore: 4.2
  };

  const recentActivity = [
    { user: 'Alex Rivera', action: 'Completed monthly review', time: '2 hours ago', type: 'completed' },
    { user: 'Sarah Kim', action: 'Started quarterly review', time: '4 hours ago', type: 'started' },
    { user: 'Mike Johnson', action: 'Review is overdue', time: '1 day ago', type: 'overdue' }
  ];

  const upcomingReviews = [
    { user: 'Jennifer Wu', type: 'Monthly', due: 'Tomorrow', status: 'pending' },
    { user: 'David Chen', type: 'Quarterly', due: 'Dec 15', status: 'pending' },
    { user: 'Lisa Park', type: 'Annual', due: 'Dec 20', status: 'pending' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">Admin Dashboard</h1>
          <p className="text-foreground-muted mt-1">Manage your team's performance reviews</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <Calendar className="h-4 w-4" />
            Schedule Review
          </Button>
          <Button className="gap-2 bg-gradient-primary hover:opacity-90">
            <Plus className="h-4 w-4" />
            Add Team Member
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="shadow-soft border-border-soft">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Team Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats.totalUsers}</div>
            <p className="text-xs text-success">+2 this month</p>
          </CardContent>
        </Card>

        <Card className="shadow-soft border-border-soft">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Reviews</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats.activeReviews}</div>
            <p className="text-xs text-muted-foreground">In progress</p>
          </CardContent>
        </Card>

        <Card className="shadow-soft border-border-soft">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue Reviews</CardTitle>
            <AlertTriangle className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{stats.overdueReviews}</div>
            <p className="text-xs text-warning">Need attention</p>
          </CardContent>
        </Card>

        <Card className="shadow-soft border-border-soft">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats.completionRate}%</div>
            <Progress value={stats.completionRate} className="mt-2 h-1" />
          </CardContent>
        </Card>

        <Card className="shadow-soft border-border-soft">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats.avgScore}/5</div>
            <p className="text-xs text-success">+0.2 vs last period</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card className="shadow-soft-md border-border-soft">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Recent Activity
              <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
                View all <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            </CardTitle>
            <CardDescription>Latest updates from your team</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                <div className={`h-2 w-2 rounded-full mt-2 ${
                  activity.type === 'completed' ? 'bg-success' :
                  activity.type === 'started' ? 'bg-primary' : 'bg-warning'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{activity.user}</p>
                  <p className="text-sm text-foreground-muted">{activity.action}</p>
                  <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Upcoming Reviews */}
        <Card className="shadow-soft-md border-border-soft">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Upcoming Reviews
              <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
                Manage <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            </CardTitle>
            <CardDescription>Reviews scheduled for the next week</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingReviews.map((review, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{review.user}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs">
                      {review.type}
                    </Badge>
                    <span className="text-xs text-muted-foreground">Due {review.due}</span>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Send Reminder
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};