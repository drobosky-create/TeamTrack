import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  ArrowLeft, 
  BarChart3, 
  TrendingUp, 
  PieChart,
  Download,
  Filter,
  Calendar,
  Users,
  FileText
} from "lucide-react";
import { Link } from "react-router-dom";

export function ReportsGuide() {
  return (
    <div className="space-y-6 max-w-4xl">
      {/* Back Navigation */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" asChild className="gap-2">
          <Link to="/help">
            <ArrowLeft className="h-4 w-4" />
            Back to Guides
          </Link>
        </Button>
      </div>

      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <BarChart3 className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-semibold text-foreground">Reports & Analytics</h1>
          <Badge className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300">
            Advanced
          </Badge>
        </div>
        <p className="text-muted-foreground">
          Learn how to generate insights, create custom reports, and analyze performance data effectively.
        </p>
      </div>

      {/* Access Alert */}
      <Alert>
        <BarChart3 className="h-4 w-4" />
        <AlertDescription>
          <strong>Manager/Admin Access:</strong> Most reporting features are available to managers and administrators. Team members may have limited access to personal performance data.
        </AlertDescription>
      </Alert>

      {/* Reports Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            Reports Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-foreground">
            The reporting system provides comprehensive analytics to help you understand performance trends, identify areas for improvement, and make data-driven decisions.
          </p>
          
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center p-4 border border-border rounded-lg">
              <BarChart3 className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <h4 className="font-medium text-foreground">Performance Analytics</h4>
              <p className="text-sm text-muted-foreground">Individual and team performance metrics</p>
            </div>
            
            <div className="text-center p-4 border border-border rounded-lg">
              <PieChart className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <h4 className="font-medium text-foreground">Goal Progress</h4>
              <p className="text-sm text-muted-foreground">Track goal completion rates and trends</p>
            </div>
            
            <div className="text-center p-4 border border-border rounded-lg">
              <Users className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <h4 className="font-medium text-foreground">Team Insights</h4>
              <p className="text-sm text-muted-foreground">Department and team-level analytics</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Available Reports */}
      <Card>
        <CardHeader>
          <CardTitle>Available Report Types</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="border border-border rounded-lg p-4">
              <h4 className="font-medium text-foreground mb-2">Performance Summary Report</h4>
              <p className="text-sm text-muted-foreground mb-2">
                Comprehensive overview of employee performance scores, trends, and comparisons.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="text-xs">Individual scores</Badge>
                <Badge variant="outline" className="text-xs">Team averages</Badge>
                <Badge variant="outline" className="text-xs">Historical trends</Badge>
              </div>
            </div>
            
            <div className="border border-border rounded-lg p-4">
              <h4 className="font-medium text-foreground mb-2">Goal Achievement Report</h4>
              <p className="text-sm text-muted-foreground mb-2">
                Track goal completion rates, success patterns, and areas needing attention.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="text-xs">Completion rates</Badge>
                <Badge variant="outline" className="text-xs">Goal categories</Badge>
                <Badge variant="outline" className="text-xs">Timeline analysis</Badge>
              </div>
            </div>
            
            <div className="border border-border rounded-lg p-4">
              <h4 className="font-medium text-foreground mb-2">Review Cycle Report</h4>
              <p className="text-sm text-muted-foreground mb-2">
                Monitor review completion status, pending items, and cycle effectiveness.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="text-xs">Completion status</Badge>
                <Badge variant="outline" className="text-xs">Overdue reviews</Badge>
                <Badge variant="outline" className="text-xs">Response rates</Badge>
              </div>
            </div>
            
            <div className="border border-border rounded-lg p-4">
              <h4 className="font-medium text-foreground mb-2">Team Analytics Report</h4>
              <p className="text-sm text-muted-foreground mb-2">
                Department-level insights including performance distributions and team dynamics.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="text-xs">Department metrics</Badge>
                <Badge variant="outline" className="text-xs">Performance distribution</Badge>
                <Badge variant="outline" className="text-xs">Engagement scores</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Generating Reports */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-green-600" />
            Generating Reports
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="border border-border rounded-lg p-4">
              <h4 className="font-medium text-foreground mb-2">Step 1: Access Reports Section</h4>
              <p className="text-sm text-muted-foreground">
                Navigate to the Reports section from the main menu.
              </p>
            </div>
            
            <div className="border border-border rounded-lg p-4">
              <h4 className="font-medium text-foreground mb-2">Step 2: Select Report Type</h4>
              <p className="text-sm text-muted-foreground">
                Choose from available report templates or create a custom report.
              </p>
            </div>
            
            <div className="border border-border rounded-lg p-4">
              <h4 className="font-medium text-foreground mb-2">Step 3: Configure Parameters</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Date range selection</li>
                <li>• Employee or department filters</li>
                <li>• Performance metrics to include</li>
                <li>• Output format (PDF, Excel, etc.)</li>
              </ul>
            </div>
            
            <div className="border border-border rounded-lg p-4">
              <h4 className="font-medium text-foreground mb-2">Step 4: Generate & Review</h4>
              <p className="text-sm text-muted-foreground">
                Run the report and review the results before sharing or downloading.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filtering and Customization */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-purple-600" />
            Filtering and Customization
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-foreground">
            Use filters and customization options to focus on specific data and create targeted insights.
          </p>
          
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <h4 className="font-medium text-foreground">Date Filters</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span className="text-sm text-muted-foreground">Custom date ranges</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span className="text-sm text-muted-foreground">Preset periods (quarterly, annual)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span className="text-sm text-muted-foreground">Review cycle periods</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium text-foreground">Organization Filters</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  <span className="text-sm text-muted-foreground">Specific employees</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  <span className="text-sm text-muted-foreground">Department selection</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  <span className="text-sm text-muted-foreground">Manager teams</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Visualization */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="h-5 w-5 text-orange-600" />
            Understanding Data Visualizations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-foreground">
            Reports include various charts and graphs to help you quickly understand performance patterns.
          </p>
          
          <div className="grid gap-4 md:grid-cols-2">
            <div className="border border-border rounded-lg p-4">
              <h4 className="font-medium text-foreground mb-2">Bar Charts</h4>
              <p className="text-sm text-muted-foreground">
                Compare performance scores across employees, departments, or time periods.
              </p>
            </div>
            
            <div className="border border-border rounded-lg p-4">
              <h4 className="font-medium text-foreground mb-2">Line Graphs</h4>
              <p className="text-sm text-muted-foreground">
                Track performance trends and goal progress over time.
              </p>
            </div>
            
            <div className="border border-border rounded-lg p-4">
              <h4 className="font-medium text-foreground mb-2">Pie Charts</h4>
              <p className="text-sm text-muted-foreground">
                Show distribution of ratings, goal categories, or completion status.
              </p>
            </div>
            
            <div className="border border-border rounded-lg p-4">
              <h4 className="font-medium text-foreground mb-2">Heat Maps</h4>
              <p className="text-sm text-muted-foreground">
                Visualize performance patterns across teams and competency areas.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Exporting and Sharing */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5 text-blue-600" />
            Exporting and Sharing Reports
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <h4 className="font-medium text-foreground">Export Formats</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• PDF for presentations</li>
                <li>• Excel for data analysis</li>
                <li>• CSV for database import</li>
                <li>• PNG/JPG for charts</li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium text-foreground">Sharing Options</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Email directly from system</li>
                <li>• Download for manual sharing</li>
                <li>• Schedule automated reports</li>
                <li>• Create shareable links</li>
              </ul>
            </div>
          </div>
          
          <Alert>
            <Download className="h-4 w-4" />
            <AlertDescription>
              <strong>Privacy Note:</strong> Always ensure you have permission to share performance data and follow your organization's privacy policies.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Best Practices */}
      <Card>
        <CardHeader>
          <CardTitle>Reporting Best Practices</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <h4 className="font-medium text-foreground">Data Analysis</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Look for trends, not just snapshots</li>
                <li>• Compare data across different periods</li>
                <li>• Consider external factors affecting performance</li>
                <li>• Focus on actionable insights</li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium text-foreground">Report Sharing</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Include context and interpretation</li>
                <li>• Highlight key findings</li>
                <li>• Provide recommendations</li>
                <li>• Respect data privacy requirements</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Related Guides */}
      <Card>
        <CardHeader>
          <CardTitle>Related Guides</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <Button asChild variant="outline" className="h-auto p-4 justify-start">
              <Link to="/help/goals" className="block text-left">
                <div className="font-medium">Setting Goals</div>
                <div className="text-sm opacity-80">Goal tracking and analysis</div>
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="h-auto p-4 justify-start">
              <Link to="/help/team" className="block text-left">
                <div className="font-medium">Team Management</div>
                <div className="text-sm opacity-80">Team performance insights</div>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}