import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  LayoutDashboard, 
  User, 
  Bell, 
  Search,
  Menu,
  CheckCircle
} from "lucide-react";
import { Link } from "react-router-dom";

export function GettingStartedGuide() {
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
          <LayoutDashboard className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-semibold text-foreground">Getting Started</h1>
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300">
            Beginner
          </Badge>
        </div>
        <p className="text-muted-foreground">
          Welcome to the Performance Review System! This guide will help you navigate the platform and get up to speed quickly.
        </p>
      </div>

      {/* Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            What You'll Learn
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li>• How to navigate the dashboard and main interface</li>
            <li>• Understanding your role and permissions</li>
            <li>• Setting up your profile information</li>
            <li>• Managing notifications and preferences</li>
            <li>• Finding help and support resources</li>
          </ul>
        </CardContent>
      </Card>

      {/* Step 1: Dashboard Overview */}
      <Card>
        <CardHeader>
          <CardTitle>1. Dashboard Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-foreground">
            The dashboard is your central hub for all performance-related activities. Here's what you'll find:
          </p>
          
          <div className="space-y-3">
            <div className="border-l-4 border-primary pl-4">
              <h4 className="font-medium text-foreground">Main Navigation</h4>
              <p className="text-sm text-muted-foreground">
                Use the sidebar on the left to navigate between different sections like Reviews, Team, Goals, and Reports.
              </p>
            </div>
            
            <div className="border-l-4 border-blue-500 pl-4">
              <h4 className="font-medium text-foreground">Quick Actions</h4>
              <p className="text-sm text-muted-foreground">
                The dashboard displays quick action cards for common tasks like starting a new review or checking pending items.
              </p>
            </div>
            
            <div className="border-l-4 border-green-500 pl-4">
              <h4 className="font-medium text-foreground">Status Overview</h4>
              <p className="text-sm text-muted-foreground">
                Get a snapshot of your current reviews, goals progress, and upcoming deadlines.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Step 2: Navigation */}
      <Card>
        <CardHeader>
          <CardTitle>2. Navigation & Layout</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Menu className="h-4 w-4 text-primary" />
                <h4 className="font-medium">Sidebar Menu</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                Click the hamburger menu icon to collapse/expand the sidebar. This gives you more screen space when needed.
              </p>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-primary" />
                <h4 className="font-medium">Search Function</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                Use the search bar in the header to quickly find employees, reviews, or specific information.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Step 3: Profile Setup */}
      <Card>
        <CardHeader>
          <CardTitle>3. Setting Up Your Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-foreground">
            A complete profile helps your colleagues and managers identify you and ensures accurate reporting.
          </p>
          
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <h4 className="font-medium text-foreground mb-2">Profile Information to Update:</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Profile photo</li>
              <li>• Full name and contact information</li>
              <li>• Department and job title</li>
              <li>• Manager relationship (if applicable)</li>
            </ul>
          </div>
          
          <div className="flex items-center gap-2 mt-4">
            <User className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Access your profile by clicking your avatar in the sidebar footer.</span>
          </div>
        </CardContent>
      </Card>

      {/* Step 4: Notifications */}
      <Card>
        <CardHeader>
          <CardTitle>4. Managing Notifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-foreground">
            Stay informed about important deadlines, review requests, and system updates.
          </p>
          
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Bell className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h4 className="font-medium text-foreground">Notification Types</h4>
                <ul className="text-sm text-muted-foreground space-y-1 mt-1">
                  <li>• Review deadline reminders</li>
                  <li>• New review assignments</li>
                  <li>• Goal progress updates</li>
                  <li>• System announcements</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
            <p className="text-sm text-foreground">
              💡 <strong>Tip:</strong> Check the notifications panel regularly to stay on top of your responsibilities and deadlines.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Card>
        <CardHeader>
          <CardTitle>Next Steps</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-foreground">
            Now that you're familiar with the basics, here are some recommended next actions:
          </p>
          
          <div className="grid gap-4 md:grid-cols-2">
            <Button asChild className="h-auto p-4 justify-start">
              <Link to="/help/reviews" className="block text-left">
                <div className="font-medium">Learn About Reviews</div>
                <div className="text-sm opacity-80">Understand the review process</div>
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="h-auto p-4 justify-start">
              <Link to="/help/goals" className="block text-left">
                <div className="font-medium">Setting Goals</div>
                <div className="text-sm opacity-80">Create and track objectives</div>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}