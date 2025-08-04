import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useGoals } from "@/hooks/useGoals";
import { useReviews } from "@/hooks/useReviews";
import { usePerformanceData } from "@/hooks/usePerformanceData";
import { Link } from "react-router-dom";
import { 
  Target, 
  Calendar, 
  Users, 
  TrendingUp, 
  CheckCircle, 
  Clock, 
  Plus,
  FileText,
  Award,
  AlertCircle
} from "lucide-react";
import { formatDistanceToNow, isAfter, addDays } from "date-fns";

const Dashboard = () => {
  const { user, profile } = useAuth();
  const { goals } = useGoals();
  const { reviews } = useReviews();
  const { performanceMetrics } = usePerformanceData();

  // Calculate key metrics
  const activeGoals = goals?.filter(goal => goal.status === 'active') || [];
  const completedGoals = goals?.filter(goal => goal.status === 'completed') || [];
  const pendingReviews = reviews?.filter(review => 
    review.status === 'in_progress' || review.status === 'not_started'
  ) || [];
  const upcomingDeadlines = reviews?.filter(review => 
    isAfter(new Date(review.dueDate), new Date()) &&
    isAfter(addDays(new Date(), 7), new Date(review.dueDate))
  ) || [];

  const overallProgress = goals?.length ? 
    Math.round(goals.reduce((acc, goal) => acc + (goal.progress || 0), 0) / goals.length) : 0;

  // Recent activity (mock data for now - could be enhanced with actual activity tracking)
  const recentActivity = [
    ...completedGoals.slice(0, 2).map(goal => ({
      type: 'goal_completed',
      title: `Completed goal: ${goal.title}`,
      time: goal.updatedDate,
      icon: CheckCircle,
      color: 'text-green-600'
    })),
    ...activeGoals.slice(0, 3).map(goal => ({
      type: 'goal_progress',
      title: `Updated progress on: ${goal.title}`,
      time: goal.updatedDate,
      icon: Target,
      color: 'text-blue-600'
    }))
  ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Welcome back, {profile?.name || user?.email}</h1>
        <p className="text-muted-foreground">
          Here's what's happening with your performance goals and reviews.
        </p>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Goals</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeGoals.length}</div>
            <p className="text-xs text-muted-foreground">
              {completedGoals.length} completed this period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Progress</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallProgress}%</div>
            <Progress value={overallProgress} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingReviews.length}</div>
            <p className="text-xs text-muted-foreground">
              {upcomingDeadlines.length} due this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Performance Score</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {performanceMetrics?.averageReviewScore ? Math.round(performanceMetrics.averageReviewScore) : '--'}
            </div>
            <p className="text-xs text-muted-foreground">
              Based on recent reviews
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Quick Actions
            </CardTitle>
            <CardDescription>
              Get started with these common tasks
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link to="/goals">
              <Button variant="outline" className="w-full justify-start">
                <Target className="h-4 w-4 mr-2" />
                Create New Goal
              </Button>
            </Link>
            
            {profile?.role === 'manager' || profile?.role === 'admin' ? (
              <Link to="/reviews">
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  Start Review Process
                </Button>
              </Link>
            ) : null}
            
            <Link to="/team">
              <Button variant="outline" className="w-full justify-start">
                <Users className="h-4 w-4 mr-2" />
                View Team Directory
              </Button>
            </Link>
            
            <Link to="/reports">
              <Button variant="outline" className="w-full justify-start">
                <TrendingUp className="h-4 w-4 mr-2" />
                View Performance Report
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>
              Latest updates on your goals and reviews
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentActivity.length > 0 ? (
              <div className="space-y-3">
                {recentActivity.map((activity, index) => {
                  const Icon = activity.icon;
                  return (
                    <div key={index} className="flex items-start gap-3">
                      <Icon className={`h-4 w-4 mt-0.5 ${activity.color}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium leading-none">
                          {activity.title}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatDistanceToNow(new Date(activity.time), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No recent activity to show
              </p>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Deadlines & Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Attention Required
            </CardTitle>
            <CardDescription>
              Upcoming deadlines and important items
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingDeadlines.length > 0 ? (
                upcomingDeadlines.slice(0, 3).map((review) => (
                  <div key={review.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{review.type} Review</p>
                      <p className="text-xs text-muted-foreground">
                        Due {formatDistanceToNow(new Date(review.dueDate), { addSuffix: true })}
                      </p>
                    </div>
                    <Badge variant="outline">
                      {review.status}
                    </Badge>
                  </div>
                ))
              ) : null}

              {pendingReviews.length > 0 ? (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Pending Reviews</p>
                    <p className="text-xs text-muted-foreground">
                      {pendingReviews.length} review(s) need attention
                    </p>
                  </div>
                  <Link to="/reviews">
                    <Button size="sm" variant="outline">
                      View
                    </Button>
                  </Link>
                </div>
              ) : null}

              {upcomingDeadlines.length === 0 && pendingReviews.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  All caught up! No urgent items.
                </p>
              ) : null}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Insights */}
      {performanceMetrics && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Performance Insights
            </CardTitle>
            <CardDescription>
              Your performance trends and achievements
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {completedGoals.length}
                </div>
                <p className="text-sm text-muted-foreground">Goals Completed</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {performanceMetrics.averageReviewScore ? Math.round(performanceMetrics.averageReviewScore) : '--'}
                </div>
                <p className="text-sm text-muted-foreground">Avg Review Score</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {overallProgress}%
                </div>
                <p className="text-sm text-muted-foreground">Goal Progress</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;