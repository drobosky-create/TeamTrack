import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  ArrowLeft, 
  Users, 
  Search,
  UserPlus,
  Building2,
  Mail,
  Phone,
  MapPin,
  Edit,
  Eye
} from "lucide-react";
import { Link } from "react-router-dom";

export function TeamGuide() {
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
          <Users className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-semibold text-foreground">Team Management</h1>
          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300">
            Intermediate
          </Badge>
        </div>
        <p className="text-muted-foreground">
          Learn how to manage your team directory, view organizational structure, and maintain employee profiles.
        </p>
      </div>

      {/* Permission Alert */}
      <Alert>
        <Users className="h-4 w-4" />
        <AlertDescription>
          <strong>Access Level:</strong> Team management features are typically available to managers and administrators. Regular team members may have limited access to view-only functions.
        </AlertDescription>
      </Alert>

      {/* Team Directory Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-blue-600" />
            Team Directory Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-foreground">
            The team directory provides a comprehensive view of all employees in your organization, with detailed profiles and contact information.
          </p>
          
          <div className="grid gap-4 md:grid-cols-2">
            <div className="border border-border rounded-lg p-4">
              <h4 className="font-medium text-foreground mb-2">Directory Features</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Complete employee listings</li>
                <li>• Profile photos and contact details</li>
                <li>• Department and role information</li>
                <li>• Manager relationships</li>
                <li>• Search and filter capabilities</li>
              </ul>
            </div>
            
            <div className="border border-border rounded-lg p-4">
              <h4 className="font-medium text-foreground mb-2">Quick Actions</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• View detailed employee profiles</li>
                <li>• Contact employees directly</li>
                <li>• Start performance reviews</li>
                <li>• View reporting structure</li>
                <li>• Access organizational chart</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Searching and Filtering */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5 text-green-600" />
            Searching and Filtering
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-foreground">
            Efficiently find team members using the built-in search and filtering tools.
          </p>
          
          <div className="space-y-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <h4 className="font-medium text-foreground mb-2">Search Options</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• <strong>Name Search:</strong> Type employee names for instant results</li>
                <li>• <strong>Department Filter:</strong> Filter by specific departments</li>
                <li>• <strong>Role Filter:</strong> Filter by job titles or roles</li>
                <li>• <strong>Manager Filter:</strong> View direct reports by manager</li>
              </ul>
            </div>
            
            <div className="grid gap-3 md:grid-cols-3">
              <div className="text-center p-3 border border-border rounded-lg">
                <Search className="h-6 w-6 text-primary mx-auto mb-2" />
                <h4 className="font-medium text-foreground text-sm">Quick Search</h4>
                <p className="text-xs text-muted-foreground">Type to search names</p>
              </div>
              
              <div className="text-center p-3 border border-border rounded-lg">
                <Building2 className="h-6 w-6 text-primary mx-auto mb-2" />
                <h4 className="font-medium text-foreground text-sm">Department</h4>
                <p className="text-xs text-muted-foreground">Filter by department</p>
              </div>
              
              <div className="text-center p-3 border border-border rounded-lg">
                <Users className="h-6 w-6 text-primary mx-auto mb-2" />
                <h4 className="font-medium text-foreground text-sm">Team View</h4>
                <p className="text-xs text-muted-foreground">View by team structure</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Employee Profiles */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-purple-600" />
            Viewing Employee Profiles
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-foreground">
            Employee profiles contain detailed information and provide quick access to common actions.
          </p>
          
          <div className="space-y-4">
            <div className="border border-border rounded-lg p-4">
              <h4 className="font-medium text-foreground mb-3">Profile Information Includes:</h4>
              <div className="grid gap-3 md:grid-cols-2">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-primary" />
                  <span className="text-sm text-muted-foreground">Email address</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-primary" />
                  <span className="text-sm text-muted-foreground">Phone number</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-primary" />
                  <span className="text-sm text-muted-foreground">Department & role</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span className="text-sm text-muted-foreground">Office location</span>
                </div>
              </div>
            </div>
            
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <h4 className="font-medium text-foreground mb-2">Quick Actions from Profile</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Send email directly from the profile</li>
                <li>• Start a new performance review</li>
                <li>• View review history</li>
                <li>• Check goal progress</li>
                <li>• View organizational relationships</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Organizational Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-orange-600" />
            Organizational Chart
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-foreground">
            The organizational chart provides a visual representation of your company's structure and reporting relationships.
          </p>
          
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <h4 className="font-medium text-foreground">Chart Features</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Hierarchical team structure</li>
                <li>• Manager-employee relationships</li>
                <li>• Interactive employee nodes</li>
                <li>• Expandable team branches</li>
                <li>• Quick profile access</li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium text-foreground">Navigation Tips</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Click nodes to view profiles</li>
                <li>• Expand/collapse team sections</li>
                <li>• Use zoom controls for large teams</li>
                <li>• Find specific employees with search</li>
                <li>• Follow reporting lines visually</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Managing Team Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5 text-red-600" />
            Managing Team Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <Edit className="h-4 w-4" />
            <AlertDescription>
              <strong>Manager/Admin Only:</strong> The following actions are typically restricted to managers and administrators.
            </AlertDescription>
          </Alert>
          
          <div className="space-y-4">
            <div className="border border-border rounded-lg p-4">
              <h4 className="font-medium text-foreground mb-2">Profile Updates</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Managers can update certain profile information for their direct reports:
              </p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Job title changes</li>
                <li>• Department transfers</li>
                <li>• Manager assignments</li>
                <li>• Contact information updates</li>
              </ul>
            </div>
            
            <div className="border border-border rounded-lg p-4">
              <h4 className="font-medium text-foreground mb-2">Team Actions</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Available actions for team management:
              </p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Create performance reviews for team members</li>
                <li>• View team performance summaries</li>
                <li>• Update reporting relationships</li>
                <li>• Manage team goals and objectives</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Best Practices */}
      <Card>
        <CardHeader>
          <CardTitle>Best Practices</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <h4 className="font-medium text-foreground">For Managers</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Keep team information current</li>
                <li>• Regular profile reviews</li>
                <li>• Clear reporting structures</li>
                <li>• Accessible contact information</li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium text-foreground">For All Users</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Update your own profile regularly</li>
                <li>• Use search effectively</li>
                <li>• Respect privacy settings</li>
                <li>• Report profile errors to managers</li>
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
                <div className="text-sm opacity-80">Create reviews for team members</div>
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="h-auto p-4 justify-start">
              <Link to="/help/getting-started" className="block text-left">
                <div className="font-medium">Getting Started</div>
                <div className="text-sm opacity-80">Basic navigation and setup</div>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}