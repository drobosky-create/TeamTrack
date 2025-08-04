import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  ArrowLeft, 
  Settings, 
  FileText, 
  Bell,
  Users,
  Shield,
  Palette,
  Globe
} from "lucide-react";
import { Link } from "react-router-dom";

export function SettingsGuide() {
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
          <Settings className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-semibold text-foreground">System Settings</h1>
          <Badge className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300">
            Advanced
          </Badge>
        </div>
        <p className="text-muted-foreground">
          Configure review templates, notifications, user permissions, and system preferences to customize your performance management experience.
        </p>
      </div>

      {/* Admin Access Alert */}
      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          <strong>Administrator Access Required:</strong> Most system settings are restricted to administrators and system managers. Contact your IT or HR team if you need access.
        </AlertDescription>
      </Alert>

      {/* Settings Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-blue-600" />
            Settings Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-foreground">
            The settings area allows administrators to customize the performance management system to match organizational needs and preferences.
          </p>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="text-center p-4 border border-border rounded-lg">
              <FileText className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <h4 className="font-medium text-foreground">Review Templates</h4>
              <p className="text-sm text-muted-foreground">Customize review forms and criteria</p>
            </div>
            
            <div className="text-center p-4 border border-border rounded-lg">
              <Bell className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <h4 className="font-medium text-foreground">Notifications</h4>
              <p className="text-sm text-muted-foreground">Configure alerts and reminders</p>
            </div>
            
            <div className="text-center p-4 border border-border rounded-lg">
              <Users className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <h4 className="font-medium text-foreground">User Management</h4>
              <p className="text-sm text-muted-foreground">Manage roles and permissions</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Review Templates */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-green-600" />
            Review Templates Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-foreground">
            Create and customize review templates to match your organization's performance evaluation criteria.
          </p>
          
          <div className="space-y-4">
            <div className="border border-border rounded-lg p-4">
              <h4 className="font-medium text-foreground mb-2">Creating Templates</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Define review categories and competencies</li>
                <li>• Set scoring scales and criteria</li>
                <li>• Add custom questions and prompts</li>
                <li>• Configure template visibility and access</li>
              </ul>
            </div>
            
            <div className="border border-border rounded-lg p-4">
              <h4 className="font-medium text-foreground mb-2">Template Types</h4>
              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <h5 className="font-medium text-foreground text-sm">Annual Reviews</h5>
                  <p className="text-xs text-muted-foreground">Comprehensive yearly assessments</p>
                </div>
                <div>
                  <h5 className="font-medium text-foreground text-sm">Quarterly Check-ins</h5>
                  <p className="text-xs text-muted-foreground">Regular progress reviews</p>
                </div>
                <div>
                  <h5 className="font-medium text-foreground text-sm">Project Reviews</h5>
                  <p className="text-xs text-muted-foreground">Specific project evaluations</p>
                </div>
                <div>
                  <h5 className="font-medium text-foreground text-sm">360-Degree Reviews</h5>
                  <p className="text-xs text-muted-foreground">Multi-source feedback</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-orange-600" />
            Notification Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-foreground">
            Configure when and how users receive notifications about reviews, deadlines, and system updates.
          </p>
          
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <h4 className="font-medium text-foreground">Notification Types</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Review Due Reminders</span>
                  <Badge variant="outline" className="text-xs">Email + In-app</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">New Review Assignments</span>
                  <Badge variant="outline" className="text-xs">Email + In-app</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Goal Deadlines</span>
                  <Badge variant="outline" className="text-xs">In-app</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">System Updates</span>
                  <Badge variant="outline" className="text-xs">Email</Badge>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium text-foreground">Timing Settings</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Initial notification: 2 weeks before due</li>
                <li>• First reminder: 1 week before due</li>
                <li>• Final reminder: 2 days before due</li>
                <li>• Overdue notifications: Daily</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* User Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-purple-600" />
            User Management & Permissions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-foreground">
            Manage user accounts, roles, and access permissions throughout the system.
          </p>
          
          <div className="space-y-4">
            <div className="border border-border rounded-lg p-4">
              <h4 className="font-medium text-foreground mb-2">User Roles</h4>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Badge className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300">Admin</Badge>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Full system access, user management, settings configuration</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300">Manager</Badge>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Team management, review creation, reporting access</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300">Employee</Badge>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Personal reviews, goal setting, profile management</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="border border-border rounded-lg p-4">
              <h4 className="font-medium text-foreground mb-2">Permission Management</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Assign and modify user roles</li>
                <li>• Control access to sensitive data</li>
                <li>• Configure department-level permissions</li>
                <li>• Set up delegation permissions</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-blue-600" />
            System Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <h4 className="font-medium text-foreground">General Settings</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Company information and branding</li>
                <li>• Default review cycles and periods</li>
                <li>• Scoring scales and criteria</li>
                <li>• Data retention policies</li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium text-foreground">Display Settings</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Date and time formats</li>
                <li>• Language preferences</li>
                <li>• Dashboard layout options</li>
                <li>• Report formatting defaults</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Integration Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-green-600" />
            Integration & API Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-foreground">
            Configure integrations with HR systems, calendar applications, and other business tools.
          </p>
          
          <div className="space-y-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <h4 className="font-medium text-foreground mb-2">Available Integrations</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• HRIS systems for employee data sync</li>
                <li>• Calendar integration for review scheduling</li>
                <li>• Email systems for notifications</li>
                <li>• Single Sign-On (SSO) providers</li>
                <li>• Business intelligence tools</li>
              </ul>
            </div>
            
            <Alert>
              <Globe className="h-4 w-4" />
              <AlertDescription>
                <strong>Technical Setup Required:</strong> Integration configurations typically require IT support and may involve API keys or technical implementation.
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>

      {/* Backup and Security */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-red-600" />
            Security & Backup Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <h4 className="font-medium text-foreground">Security Settings</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Password policy configuration</li>
                <li>• Session timeout settings</li>
                <li>• Two-factor authentication</li>
                <li>• Access logging and monitoring</li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium text-foreground">Data Management</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Automated backup schedules</li>
                <li>• Data export capabilities</li>
                <li>• Archive and retention policies</li>
                <li>• Compliance reporting</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Best Practices */}
      <Card>
        <CardHeader>
          <CardTitle>Settings Management Best Practices</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <h4 className="font-medium text-foreground">Configuration</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Document all setting changes</li>
                <li>• Test changes in staging environment</li>
                <li>• Train users on new features</li>
                <li>• Regular review of permissions</li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium text-foreground">Maintenance</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Regular backup verification</li>
                <li>• Monitor system performance</li>
                <li>• Update security settings</li>
                <li>• Review user access regularly</li>
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
              <Link to="/help/reviews" className="block text-left">
                <div className="font-medium">Managing Reviews</div>
                <div className="text-sm opacity-80">Review template implementation</div>
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="h-auto p-4 justify-start">
              <Link to="/help/team" className="block text-left">
                <div className="font-medium">Team Management</div>
                <div className="text-sm opacity-80">User roles and permissions</div>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}