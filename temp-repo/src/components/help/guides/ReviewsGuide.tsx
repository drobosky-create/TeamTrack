import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  ArrowLeft, 
  FileText, 
  Plus, 
  Edit, 
  Send,
  AlertCircle,
  CheckCircle2,
  Clock,
  Users
} from "lucide-react";
import { Link } from "react-router-dom";

export function ReviewsGuide() {
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
          <FileText className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-semibold text-foreground">Managing Reviews</h1>
          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300">
            Intermediate
          </Badge>
        </div>
        <p className="text-muted-foreground">
          Complete guide to creating, conducting, and managing performance reviews in the system.
        </p>
      </div>

      {/* Overview */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Important:</strong> Review permissions vary by role. Managers can create reviews for their team members, while team members primarily complete assigned reviews.
        </AlertDescription>
      </Alert>

      {/* Creating Reviews */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5 text-green-600" />
            Creating New Reviews
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-foreground">
            As a manager or admin, you can create performance reviews for team members.
          </p>
          
          <div className="space-y-4">
            <div className="border border-border rounded-lg p-4">
              <h4 className="font-medium text-foreground mb-2">Step 1: Navigate to Reviews</h4>
              <p className="text-sm text-muted-foreground">
                Go to the Reviews section from the main navigation sidebar.
              </p>
            </div>
            
            <div className="border border-border rounded-lg p-4">
              <h4 className="font-medium text-foreground mb-2">Step 2: Click "Create Review"</h4>
              <p className="text-sm text-muted-foreground">
                Click the "Create Review" button to start the review creation process.
              </p>
            </div>
            
            <div className="border border-border rounded-lg p-4">
              <h4 className="font-medium text-foreground mb-2">Step 3: Fill Review Details</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Select the employee being reviewed</li>
                <li>• Choose the review type (Annual, Semi-annual, Monthly, etc.)</li>
                <li>• Set the review period and due date</li>
                <li>• Select appropriate review template</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Conducting Reviews */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5 text-blue-600" />
            Conducting Reviews
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-foreground">
            Whether you're completing a self-review or reviewing a team member, here's how to fill out the review form.
          </p>
          
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <h4 className="font-medium text-foreground">Scoring Guidelines</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Exceeds Expectations</span>
                  <Badge variant="outline">5</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Meets Expectations</span>
                  <Badge variant="outline">4</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Partially Meets</span>
                  <Badge variant="outline">3</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Below Expectations</span>
                  <Badge variant="outline">2</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Unsatisfactory</span>
                  <Badge variant="outline">1</Badge>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium text-foreground">Best Practices</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Provide specific examples</li>
                <li>• Be constructive and actionable</li>
                <li>• Focus on behaviors and outcomes</li>
                <li>• Use the full rating scale appropriately</li>
                <li>• Include development suggestions</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Review Status & Workflow */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-orange-600" />
            Review Status & Workflow
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-foreground">
            Reviews progress through several stages from creation to completion.
          </p>
          
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900/20 rounded-lg">
              <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
              <div>
                <span className="font-medium text-foreground">Draft</span>
                <p className="text-sm text-muted-foreground">Review is created but not yet started</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <div>
                <span className="font-medium text-foreground">In Progress</span>
                <p className="text-sm text-muted-foreground">Review is being completed by reviewer</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div>
                <span className="font-medium text-foreground">Under Review</span>
                <p className="text-sm text-muted-foreground">Submitted and awaiting manager approval</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <div>
                <span className="font-medium text-foreground">Completed</span>
                <p className="text-sm text-muted-foreground">Review is finalized and archived</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Review Types */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-purple-600" />
            Types of Reviews
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <h4 className="font-medium text-foreground">Self-Review</h4>
              <p className="text-sm text-muted-foreground">
                Employees evaluate their own performance, providing self-assessment and reflection on achievements and areas for improvement.
              </p>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium text-foreground">Manager Review</h4>
              <p className="text-sm text-muted-foreground">
                Direct managers evaluate their team members' performance based on observations, achievements, and goal completion.
              </p>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium text-foreground">360-Degree Review</h4>
              <p className="text-sm text-muted-foreground">
                Comprehensive feedback from multiple sources including peers, direct reports, and managers for a well-rounded view.
              </p>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium text-foreground">Project Review</h4>
              <p className="text-sm text-muted-foreground">
                Focused evaluation on specific projects or assignments, typically shorter-term and goal-specific.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Submitting Reviews */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="h-5 w-5 text-green-600" />
            Submitting & Finalizing Reviews
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-foreground">Before Submitting</h4>
                <ul className="text-sm text-muted-foreground space-y-1 mt-1">
                  <li>• Review all sections for completeness</li>
                  <li>• Ensure all ratings are justified with comments</li>
                  <li>• Save as draft to review later if needed</li>
                  <li>• Check spelling and grammar</li>
                </ul>
              </div>
            </div>
          </div>
          
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Note:</strong> Once submitted, you may not be able to edit the review depending on your organization's settings. Always save as draft first to review your work.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Card>
        <CardHeader>
          <CardTitle>Related Guides</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Button asChild variant="outline" className="h-auto p-4 justify-start">
              <Link to="/help/goals" className="block text-left">
                <div className="font-medium">Setting Goals</div>
                <div className="text-sm opacity-80">Learn about goal management</div>
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="h-auto p-4 justify-start">
              <Link to="/help/reports" className="block text-left">
                <div className="font-medium">Reports & Analytics</div>
                <div className="text-sm opacity-80">View performance insights</div>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}