import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  ArrowLeft, 
  Target, 
  Plus, 
  TrendingUp,
  Calendar,
  CheckCircle,
  AlertTriangle,
  BarChart
} from "lucide-react";
import { Link } from "react-router-dom";

export function GoalsGuide() {
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
          <Target className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-semibold text-foreground">Setting Goals</h1>
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300">
            Beginner
          </Badge>
        </div>
        <p className="text-muted-foreground">
          Learn how to create, track, and achieve performance goals using the goal management system.
        </p>
      </div>

      {/* Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Goal Management Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-foreground">
            Goals are the foundation of performance management. They provide clear direction, measurable outcomes, and help align individual achievements with organizational objectives.
          </p>
          
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center p-4 border border-border rounded-lg">
              <Plus className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <h4 className="font-medium text-foreground">Create Goals</h4>
              <p className="text-sm text-muted-foreground">Set specific, measurable objectives</p>
            </div>
            
            <div className="text-center p-4 border border-border rounded-lg">
              <TrendingUp className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <h4 className="font-medium text-foreground">Track Progress</h4>
              <p className="text-sm text-muted-foreground">Monitor achievement over time</p>
            </div>
            
            <div className="text-center p-4 border border-border rounded-lg">
              <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <h4 className="font-medium text-foreground">Achieve Results</h4>
              <p className="text-sm text-muted-foreground">Celebrate completed objectives</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SMART Goals Framework */}
      <Card>
        <CardHeader>
          <CardTitle>SMART Goals Framework</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-foreground">
            Use the SMART criteria to create effective goals that are more likely to be achieved.
          </p>
          
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h4 className="font-bold text-blue-700 dark:text-blue-300 text-lg">S</h4>
                <p className="font-medium text-foreground">Specific</p>
                <p className="text-xs text-muted-foreground">Clear and well-defined</p>
              </div>
              
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <h4 className="font-bold text-green-700 dark:text-green-300 text-lg">M</h4>
                <p className="font-medium text-foreground">Measurable</p>
                <p className="text-xs text-muted-foreground">Quantifiable outcomes</p>
              </div>
              
              <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <h4 className="font-bold text-purple-700 dark:text-purple-300 text-lg">A</h4>
                <p className="font-medium text-foreground">Achievable</p>
                <p className="text-xs text-muted-foreground">Realistic and attainable</p>
              </div>
              
              <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <h4 className="font-bold text-orange-700 dark:text-orange-300 text-lg">R</h4>
                <p className="font-medium text-foreground">Relevant</p>
                <p className="text-xs text-muted-foreground">Aligned with objectives</p>
              </div>
              
              <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <h4 className="font-bold text-red-700 dark:text-red-300 text-lg">T</h4>
                <p className="font-medium text-foreground">Time-bound</p>
                <p className="text-xs text-muted-foreground">Has a deadline</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Creating Goals */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5 text-green-600" />
            Creating New Goals
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="border border-border rounded-lg p-4">
              <h4 className="font-medium text-foreground mb-2">Step 1: Navigate to Goals</h4>
              <p className="text-sm text-muted-foreground">
                Go to the Goals section from the main navigation menu.
              </p>
            </div>
            
            <div className="border border-border rounded-lg p-4">
              <h4 className="font-medium text-foreground mb-2">Step 2: Click "Create Goal"</h4>
              <p className="text-sm text-muted-foreground">
                Start the goal creation process by clicking the "Create Goal" button.
              </p>
            </div>
            
            <div className="border border-border rounded-lg p-4">
              <h4 className="font-medium text-foreground mb-2">Step 3: Fill Goal Details</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Goal title and description</li>
                <li>• Category (Performance, Development, Project, etc.)</li>
                <li>• Priority level (High, Medium, Low)</li>
                <li>• Target completion date</li>
                <li>• Success criteria and metrics</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Goal Types */}
      <Card>
        <CardHeader>
          <CardTitle>Types of Goals</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <div className="border border-border rounded-lg p-4">
                <h4 className="font-medium text-foreground mb-2">Performance Goals</h4>
                <p className="text-sm text-muted-foreground">
                  Focus on improving job performance, productivity, or quality of work output.
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Example: "Increase sales by 15% over the next quarter"
                </p>
              </div>
              
              <div className="border border-border rounded-lg p-4">
                <h4 className="font-medium text-foreground mb-2">Development Goals</h4>
                <p className="text-sm text-muted-foreground">
                  Aimed at learning new skills, gaining certifications, or professional growth.
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Example: "Complete project management certification by year-end"
                </p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="border border-border rounded-lg p-4">
                <h4 className="font-medium text-foreground mb-2">Project Goals</h4>
                <p className="text-sm text-muted-foreground">
                  Specific to completing projects, initiatives, or special assignments.
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Example: "Launch new customer portal by Q2"
                </p>
              </div>
              
              <div className="border border-border rounded-lg p-4">
                <h4 className="font-medium text-foreground mb-2">Behavioral Goals</h4>
                <p className="text-sm text-muted-foreground">
                  Focus on improving communication, leadership, or interpersonal skills.
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Example: "Improve team collaboration scores by 20%"
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tracking Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart className="h-5 w-5 text-blue-600" />
            Tracking Goal Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-foreground">
            Regular progress tracking helps you stay on course and make adjustments when needed.
          </p>
          
          <div className="space-y-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <h4 className="font-medium text-foreground mb-2">Progress Updates</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Update progress percentage regularly</li>
                <li>• Add notes about achievements and challenges</li>
                <li>• Upload supporting documents or evidence</li>
                <li>• Set milestone markers for complex goals</li>
              </ul>
            </div>
            
            <div className="grid gap-3 md:grid-cols-3">
              <div className="text-center p-3 border border-green-200 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600 mx-auto mb-2" />
                <h4 className="font-medium text-foreground text-sm">On Track</h4>
                <p className="text-xs text-muted-foreground">Progress as expected</p>
              </div>
              
              <div className="text-center p-3 border border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-yellow-600 mx-auto mb-2" />
                <h4 className="font-medium text-foreground text-sm">At Risk</h4>
                <p className="text-xs text-muted-foreground">May need intervention</p>
              </div>
              
              <div className="text-center p-3 border border-red-200 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <Calendar className="h-6 w-6 text-red-600 mx-auto mb-2" />
                <h4 className="font-medium text-foreground text-sm">Behind</h4>
                <p className="text-xs text-muted-foreground">Requires action</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Goal Reviews */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-purple-600" />
            Goal Reviews & Check-ins
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-foreground">
            Regular reviews with your manager help ensure goals remain relevant and achievable.
          </p>
          
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <h4 className="font-medium text-foreground">Preparation Tips</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Review progress before meetings</li>
                <li>• Prepare specific examples</li>
                <li>• Identify obstacles and solutions</li>
                <li>• Come with questions or requests</li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium text-foreground">Discussion Topics</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Current progress status</li>
                <li>• Challenges and roadblocks</li>
                <li>• Resource needs</li>
                <li>• Timeline adjustments</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Best Practices */}
      <Card>
        <CardHeader>
          <CardTitle>Goal Setting Best Practices</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <h4 className="font-medium text-foreground">Do's</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>✓ Start with 3-5 key goals maximum</li>
                <li>✓ Align goals with company objectives</li>
                <li>✓ Break large goals into smaller milestones</li>
                <li>✓ Review and update progress regularly</li>
                <li>✓ Celebrate achievements along the way</li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium text-foreground">Don'ts</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>✗ Set too many goals at once</li>
                <li>✗ Make goals vague or unmeasurable</li>
                <li>✗ Ignore progress tracking</li>
                <li>✗ Set unrealistic deadlines</li>
                <li>✗ Work on goals in isolation</li>
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
                <div className="text-sm opacity-80">Goals and performance reviews</div>
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="h-auto p-4 justify-start">
              <Link to="/help/reports" className="block text-left">
                <div className="font-medium">Reports & Analytics</div>
                <div className="text-sm opacity-80">Track goal performance</div>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}