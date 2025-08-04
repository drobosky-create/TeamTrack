import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Users,
  Calendar,
  BarChart3
} from 'lucide-react';

// Mock data for the dashboard
const dashboardStats = {
  totalReviews: 156,
  completedReviews: 89,
  overdueReviews: 12,
  inProgressReviews: 34,
  notStartedReviews: 21,
  completionRate: 57,
  averageScore: 4.2,
  trendsChange: +12
};

const completionTrendData = [
  { month: 'Jan', completed: 45, total: 52 },
  { month: 'Feb', completed: 38, total: 48 },
  { month: 'Mar', completed: 52, total: 61 },
  { month: 'Apr', completed: 41, total: 49 },
  { month: 'May', completed: 67, total: 73 },
  { month: 'Jun', completed: 89, total: 156 },
];

const statusDistribution = [
  { name: 'Completed', value: 89, color: '#22c55e' },
  { name: 'In Progress', value: 34, color: '#3b82f6' },
  { name: 'Not Started', value: 21, color: '#94a3b8' },
  { name: 'Overdue', value: 12, color: '#ef4444' },
];

const departmentPerformance = [
  { department: 'Engineering', completed: 24, total: 28, rate: 86 },
  { department: 'Sales', completed: 18, total: 22, rate: 82 },
  { department: 'Marketing', completed: 15, total: 20, rate: 75 },
  { department: 'Operations', completed: 12, total: 18, rate: 67 },
  { department: 'HR', completed: 8, total: 12, rate: 67 },
];

const recentActivity = [
  { id: 1, user: 'Sarah Chen', action: 'completed review', time: '2 hours ago', type: 'complete' },
  { id: 2, user: 'Mike Johnson', action: 'submitted self-review', time: '4 hours ago', type: 'progress' },
  { id: 3, user: 'Alex Rivera', action: 'review became overdue', time: '1 day ago', type: 'overdue' },
  { id: 4, user: 'Emily Davis', action: 'started review', time: '2 days ago', type: 'start' },
  { id: 5, user: 'Tom Wilson', action: 'completed review', time: '3 days ago', type: 'complete' },
];

const MetricCard: React.FC<{
  title: string;
  value: string | number;
  change?: number;
  icon: React.ReactNode;
  description?: string;
}> = ({ title, value, change, icon, description }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      {change !== undefined && (
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          {change > 0 ? (
            <TrendingUp className="h-3 w-3 text-green-500" />
          ) : (
            <TrendingDown className="h-3 w-3 text-red-500" />
          )}
          <span className={change > 0 ? 'text-green-500' : 'text-red-500'}>
            {change > 0 ? '+' : ''}{change}%
          </span>
          <span>from last month</span>
        </div>
      )}
      {description && (
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      )}
    </CardContent>
  </Card>
);

export const ReviewDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Review Analytics</h1>
          <p className="text-muted-foreground">
            Monitor review completion rates and team performance
          </p>
        </div>
        <Button variant="outline" className="gap-2">
          <Calendar className="h-4 w-4" />
          Export Report
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Reviews"
          value={dashboardStats.totalReviews}
          icon={<BarChart3 className="h-4 w-4 text-muted-foreground" />}
          description="Active review cycles"
        />
        <MetricCard
          title="Completion Rate"
          value={`${dashboardStats.completionRate}%`}
          change={dashboardStats.trendsChange}
          icon={<CheckCircle className="h-4 w-4 text-muted-foreground" />}
        />
        <MetricCard
          title="Overdue Reviews"
          value={dashboardStats.overdueReviews}
          icon={<AlertTriangle className="h-4 w-4 text-red-500" />}
          description="Require immediate attention"
        />
        <MetricCard
          title="Average Score"
          value={dashboardStats.averageScore}
          change={8}
          icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
          description="Out of 5.0"
        />
      </div>

      {/* Main Dashboard Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="departments">By Department</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Status Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Review Status Distribution</CardTitle>
                <CardDescription>Current status of all reviews</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statusDistribution}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {statusDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Completion Progress */}
            <Card>
              <CardHeader>
                <CardTitle>Department Progress</CardTitle>
                <CardDescription>Completion rates by department</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {departmentPerformance.map((dept) => (
                  <div key={dept.department} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{dept.department}</span>
                      <span className="text-muted-foreground">
                        {dept.completed}/{dept.total} ({dept.rate}%)
                      </span>
                    </div>
                    <Progress value={dept.rate} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Departments Tab */}
        <TabsContent value="departments">
          <Card>
            <CardHeader>
              <CardTitle>Department Performance</CardTitle>
              <CardDescription>Review completion rates by department</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={departmentPerformance}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="department" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="rate" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Trends Tab */}
        <TabsContent value="trends">
          <Card>
            <CardHeader>
              <CardTitle>Completion Trends</CardTitle>
              <CardDescription>Review completion over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={completionTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="completed" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={3}
                      dot={{ fill: "hsl(var(--primary))" }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="total" 
                      stroke="hsl(var(--muted-foreground))" 
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={{ fill: "hsl(var(--muted-foreground))" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Activity Tab */}
        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest review actions and updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center gap-4 p-3 rounded-lg border">
                    <div className="flex-shrink-0">
                      {activity.type === 'complete' && (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      )}
                      {activity.type === 'progress' && (
                        <Clock className="h-5 w-5 text-blue-500" />
                      )}
                      {activity.type === 'overdue' && (
                        <AlertTriangle className="h-5 w-5 text-red-500" />
                      )}
                      {activity.type === 'start' && (
                        <Users className="h-5 w-5 text-gray-500" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        <span className="font-semibold">{activity.user}</span> {activity.action}
                      </p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                    <Badge 
                      variant={
                        activity.type === 'complete' ? 'default' :
                        activity.type === 'overdue' ? 'destructive' : 'secondary'
                      }
                    >
                      {activity.type}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};