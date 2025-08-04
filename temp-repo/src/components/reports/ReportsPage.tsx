import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Download, Users, TrendingUp, TrendingDown, BarChart3, FileText, Clock, Search, User } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Area, AreaChart } from "recharts";
import { useAuth } from "@/contexts/AuthContext";

// Mock data - replace with actual API calls
// Mock individual employee data
const employeeData = [
  {
    id: "1",
    name: "Alice Johnson",
    role: "Senior Developer",
    department: "Engineering",
    avatar: "",
    currentScore: 4.5,
    trend: "up",
    reviewHistory: [
      { date: "2024-01", score: 4.2, type: "monthly", status: "completed" },
      { date: "2024-02", score: 4.3, type: "monthly", status: "completed" },
      { date: "2024-03", score: 4.4, type: "quarterly", status: "completed" },
      { date: "2024-04", score: 4.5, type: "monthly", status: "completed" },
      { date: "2024-05", score: 4.6, type: "monthly", status: "completed" },
      { date: "2024-06", score: 4.5, type: "quarterly", status: "completed" }
    ],
    categoryScores: [
      { category: "Technical Skills", current: 4.7, previous: 4.5, trend: "up" },
      { category: "Communication", current: 4.3, previous: 4.2, trend: "up" },
      { category: "Teamwork", current: 4.5, previous: 4.6, trend: "down" },
      { category: "Leadership", current: 4.4, previous: 4.1, trend: "up" },
      { category: "Goal Achievement", current: 4.6, previous: 4.4, trend: "up" }
    ]
  },
  {
    id: "2",
    name: "Bob Smith",
    role: "Product Manager",
    department: "Product",
    avatar: "",
    currentScore: 4.1,
    trend: "stable",
    reviewHistory: [
      { date: "2024-01", score: 4.0, type: "monthly", status: "completed" },
      { date: "2024-02", score: 4.1, type: "monthly", status: "completed" },
      { date: "2024-03", score: 4.0, type: "quarterly", status: "completed" },
      { date: "2024-04", score: 4.2, type: "monthly", status: "completed" },
      { date: "2024-05", score: 4.1, type: "monthly", status: "completed" },
      { date: "2024-06", score: 4.1, type: "quarterly", status: "overdue" }
    ],
    categoryScores: [
      { category: "Strategic Thinking", current: 4.3, previous: 4.1, trend: "up" },
      { category: "Communication", current: 4.0, previous: 4.0, trend: "stable" },
      { category: "Team Management", current: 3.9, previous: 4.1, trend: "down" },
      { category: "Execution", current: 4.2, previous: 4.0, trend: "up" },
      { category: "Innovation", current: 4.1, previous: 4.2, trend: "down" }
    ]
  },
  {
    id: "3",
    name: "Carol Davis",
    role: "UX Designer",
    department: "Design",
    avatar: "",
    currentScore: 4.6,
    trend: "up",
    reviewHistory: [
      { date: "2024-01", score: 4.3, type: "monthly", status: "completed" },
      { date: "2024-02", score: 4.4, type: "monthly", status: "completed" },
      { date: "2024-03", score: 4.5, type: "quarterly", status: "completed" },
      { date: "2024-04", score: 4.6, type: "monthly", status: "completed" },
      { date: "2024-05", score: 4.7, type: "monthly", status: "completed" },
      { date: "2024-06", score: 4.6, type: "quarterly", status: "completed" }
    ],
    categoryScores: [
      { category: "Design Quality", current: 4.8, previous: 4.6, trend: "up" },
      { category: "User Research", current: 4.5, previous: 4.4, trend: "up" },
      { category: "Collaboration", current: 4.6, previous: 4.5, trend: "up" },
      { category: "Innovation", current: 4.7, previous: 4.5, trend: "up" },
      { category: "Process Improvement", current: 4.4, previous: 4.3, trend: "up" }
    ]
  }
];

const reviewStats = {
  totalReviews: 156,
  completedReviews: 142,
  averageScore: 4.2,
  overdue: 8,
  thisMonth: 24,
  lastMonth: 18
};

const departmentPerformance = [
  { name: "Engineering", avgScore: 4.3, reviews: 45, completion: 95 },
  { name: "Design", avgScore: 4.5, reviews: 20, completion: 100 },
  { name: "Product", avgScore: 4.1, reviews: 15, completion: 87 },
  { name: "Marketing", avgScore: 4.4, reviews: 25, completion: 92 },
  { name: "Sales", avgScore: 4.2, reviews: 30, completion: 90 },
  { name: "Operations", avgScore: 4.0, reviews: 21, completion: 86 }
];

const reviewTrends = [
  { month: "Jan", completed: 28, average: 4.1 },
  { month: "Feb", completed: 32, average: 4.2 },
  { month: "Mar", completed: 35, average: 4.0 },
  { month: "Apr", completed: 30, average: 4.3 },
  { month: "May", completed: 38, average: 4.4 },
  { month: "Jun", completed: 42, average: 4.2 }
];

const scoreDistribution = [
  { range: "1-2", count: 8, color: "#ef4444" },
  { range: "2-3", count: 15, color: "#f97316" },
  { range: "3-4", count: 45, color: "#eab308" },
  { range: "4-5", count: 88, color: "#22c55e" }
];

const reviewTypes = [
  { name: "Quarterly", value: 65, color: "#3b82f6" },
  { name: "Monthly", value: 25, color: "#8b5cf6" },
  { name: "Annual", value: 10, color: "#10b981" }
];

export function ReportsPage() {
  const { profile } = useAuth();
  const [timeframe, setTimeframe] = useState("6months");
  const [department, setDepartment] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);

  if (!profile || !["admin", "manager"].includes(profile.role || "")) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-foreground">Access Denied</h1>
          <p className="text-muted-foreground mt-2">You need admin or manager privileges to view reports.</p>
        </div>
      </div>
    );
  }

  const completionRate = ((reviewStats.completedReviews / reviewStats.totalReviews) * 100).toFixed(1);
  const monthlyGrowth = ((reviewStats.thisMonth - reviewStats.lastMonth) / reviewStats.lastMonth * 100).toFixed(1);

  // Filter employees based on search and department
  const filteredEmployees = employeeData.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         emp.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = department === "all" || emp.department.toLowerCase() === department.toLowerCase();
    return matchesSearch && matchesDepartment;
  });

  const selectedEmployeeData = selectedEmployee ? 
    employeeData.find(emp => emp.id === selectedEmployee) : null;

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up": return <TrendingUp className="h-4 w-4 text-green-500" />;
      case "down": return <TrendingDown className="h-4 w-4 text-red-500" />;
      default: return <div className="h-4 w-4" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "up": return "text-green-600";
      case "down": return "text-red-600";
      default: return "text-gray-600";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">Reports & Analytics</h1>
          <p className="text-muted-foreground mt-1">Comprehensive performance review insights</p>
        </div>
        <div className="flex gap-3">
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1month">Last Month</SelectItem>
              <SelectItem value="3months">Last 3 Months</SelectItem>
              <SelectItem value="6months">Last 6 Months</SelectItem>
              <SelectItem value="1year">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reviewStats.totalReviews}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              +{monthlyGrowth}% from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completionRate}%</div>
            <div className="text-xs text-muted-foreground">
              {reviewStats.completedReviews} of {reviewStats.totalReviews} completed
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reviewStats.averageScore}/5</div>
            <div className="text-xs text-green-600">
              Above target (4.0)
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue Reviews</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{reviewStats.overdue}</div>
            <div className="text-xs text-muted-foreground">
              Require immediate attention
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="departments">Departments</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="distribution">Score Distribution</TabsTrigger>
          <TabsTrigger value="individual">Individual Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Review Trends */}
            <Card>
              <CardHeader>
                <CardTitle>Review Completion Trends</CardTitle>
                <CardDescription>Monthly review completion over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={reviewTrends}>
                    <defs>
                      <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="completed"
                      stroke="hsl(var(--primary))"
                      fillOpacity={1}
                      fill="url(#colorCompleted)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Review Types */}
            <Card>
              <CardHeader>
                <CardTitle>Review Types Distribution</CardTitle>
                <CardDescription>Breakdown by review frequency</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={reviewTypes}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      dataKey="value"
                    >
                      {reviewTypes.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex justify-center gap-4 mt-4">
                  {reviewTypes.map((type) => (
                    <div key={type.name} className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: type.color }}
                      />
                      <span className="text-sm">{type.name} ({type.value}%)</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="departments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Department Performance</CardTitle>
              <CardDescription>Average scores and completion rates by department</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={departmentPerformance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis yAxisId="left" domain={[0, 5]} />
                  <YAxis yAxisId="right" orientation="right" domain={[0, 100]} />
                  <Tooltip />
                  <Bar yAxisId="left" dataKey="avgScore" fill="hsl(var(--primary))" name="Avg Score" />
                  <Bar yAxisId="right" dataKey="completion" fill="hsl(var(--secondary))" name="Completion %" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {departmentPerformance.map((dept) => (
              <Card key={dept.name}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{dept.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Average Score</span>
                    <Badge variant={dept.avgScore >= 4.0 ? "default" : "secondary"}>
                      {dept.avgScore}/5
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Reviews</span>
                    <span className="font-medium">{dept.reviews}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Completion</span>
                    <span className={`font-medium ${dept.completion >= 90 ? 'text-green-600' : 'text-orange-600'}`}>
                      {dept.completion}%
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance Trends</CardTitle>
              <CardDescription>Average review scores over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={reviewTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis domain={[3.5, 4.5]} />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="average" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={3}
                    dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="distribution" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Score Distribution</CardTitle>
              <CardDescription>How review scores are distributed across ranges</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={scoreDistribution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="range" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-6">
                {scoreDistribution.map((item) => (
                  <div key={item.range} className="text-center">
                    <div className="text-2xl font-bold" style={{ color: item.color }}>
                      {item.count}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Score {item.range}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="individual" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Employee List */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Team Members
                  </CardTitle>
                  <CardDescription>Select an employee to view their performance history</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search employees..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {filteredEmployees.map((employee) => (
                      <div
                        key={employee.id}
                        className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                          selectedEmployee === employee.id 
                            ? 'border-primary bg-primary/5' 
                            : 'border-border hover:bg-accent'
                        }`}
                        onClick={() => setSelectedEmployee(employee.id)}
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={employee.avatar} />
                            <AvatarFallback>{employee.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">{employee.name}</p>
                            <p className="text-xs text-muted-foreground truncate">{employee.role}</p>
                          </div>
                          <div className="flex items-center gap-1">
                            {getTrendIcon(employee.trend)}
                            <span className="text-sm font-medium">{employee.currentScore}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Individual Performance Details */}
            <div className="lg:col-span-2">
              {selectedEmployeeData ? (
                <div className="space-y-6">
                  {/* Employee Header */}
                  <Card>
                    <CardHeader>
                      <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={selectedEmployeeData.avatar} />
                          <AvatarFallback>{selectedEmployeeData.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <CardTitle className="text-xl">{selectedEmployeeData.name}</CardTitle>
                          <CardDescription>{selectedEmployeeData.role} • {selectedEmployeeData.department}</CardDescription>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-2">
                            {getTrendIcon(selectedEmployeeData.trend)}
                            <span className="text-2xl font-bold">{selectedEmployeeData.currentScore}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">Current Score</p>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>

                  {/* Performance Trend */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Performance History</CardTitle>
                      <CardDescription>Review scores over time</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={selectedEmployeeData.reviewHistory}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis domain={[3.5, 5]} />
                          <Tooltip />
                          <Line 
                            type="monotone" 
                            dataKey="score" 
                            stroke="hsl(var(--primary))" 
                            strokeWidth={3}
                            dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 6 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  {/* Category Breakdown */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Category Performance</CardTitle>
                      <CardDescription>Current vs previous review comparison</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {selectedEmployeeData.categoryScores.map((category) => (
                          <div key={category.category} className="flex items-center justify-between p-3 rounded-lg border">
                            <div className="flex-1">
                              <p className="font-medium">{category.category}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-sm text-muted-foreground">
                                  Previous: {category.previous}
                                </span>
                                <span className={`text-sm ${getTrendColor(category.trend)}`}>
                                  ({category.trend === "up" ? "+" : category.trend === "down" ? "-" : ""}
                                  {Math.abs(category.current - category.previous).toFixed(1)})
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {getTrendIcon(category.trend)}
                              <span className="text-xl font-bold">{category.current}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Recent Reviews */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Review History</CardTitle>
                      <CardDescription>Recent performance reviews</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {selectedEmployeeData.reviewHistory.slice().reverse().map((review, index) => (
                          <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                            <div className="flex items-center gap-3">
                              <div className="text-sm">
                                <p className="font-medium">{review.date}</p>
                                <p className="text-muted-foreground capitalize">{review.type} Review</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <Badge variant={review.status === "completed" ? "default" : "destructive"}>
                                {review.status}
                              </Badge>
                              <span className="font-bold text-lg">{review.score}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <Card className="h-96 flex items-center justify-center">
                  <CardContent>
                    <div className="text-center">
                      <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold">Select an Employee</h3>
                      <p className="text-muted-foreground">Choose a team member to view their performance history</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}