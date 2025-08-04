import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  Users, 
  Target, 
  BarChart3, 
  Settings, 
  LayoutDashboard,
  BookOpen,
  Clock,
  UserCheck
} from "lucide-react";
import { Link } from "react-router-dom";

const guides = [
  {
    title: "Getting Started",
    description: "Learn the basics of navigating and using the performance review system",
    icon: LayoutDashboard,
    link: "/help/getting-started",
    difficulty: "Beginner",
    estimatedTime: "5 min",
    topics: ["Dashboard overview", "Navigation", "Profile setup"]
  },
  {
    title: "Managing Reviews",
    description: "Complete guide to creating, conducting, and managing performance reviews",
    icon: FileText,
    link: "/help/reviews",
    difficulty: "Intermediate",
    estimatedTime: "10 min",
    topics: ["Creating reviews", "Review forms", "Scoring", "Submissions"]
  },
  {
    title: "Team Management",
    description: "How to manage your team directory and organizational structure",
    icon: Users,
    link: "/help/team",
    difficulty: "Intermediate",
    estimatedTime: "8 min",
    topics: ["Team directory", "Org chart", "Employee profiles"]
  },
  {
    title: "Setting Goals",
    description: "Create and track performance goals for individuals and teams",
    icon: Target,
    link: "/help/goals",
    difficulty: "Beginner",
    estimatedTime: "7 min",
    topics: ["Goal creation", "Progress tracking", "Goal types"]
  },
  {
    title: "Reports & Analytics",
    description: "Generate insights and reports from performance data",
    icon: BarChart3,
    link: "/help/reports",
    difficulty: "Advanced",
    estimatedTime: "12 min",
    topics: ["Performance analytics", "Custom reports", "Data visualization"]
  },
  {
    title: "System Settings",
    description: "Configure review templates, notifications, and system preferences",
    icon: Settings,
    link: "/help/settings",
    difficulty: "Advanced",
    estimatedTime: "15 min",
    topics: ["Review templates", "Notification settings", "User permissions"]
  }
];

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case "Beginner": return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300";
    case "Intermediate": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300";
    case "Advanced": return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300";
    default: return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300";
  }
};

export function HowToPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <BookOpen className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-semibold text-foreground">How-To Guides</h1>
        </div>
        <p className="text-muted-foreground">
          Learn how to make the most of your performance review system with these step-by-step guides.
        </p>
      </div>

      {/* Quick Tips */}
      <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <UserCheck className="h-5 w-5" />
            Quick Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-foreground">
            <li>• Start with "Getting Started" if you're new to the system</li>
            <li>• Each guide includes estimated completion time and difficulty level</li>
            <li>• Use the search function in your browser (Ctrl/Cmd + F) to find specific topics</li>
            <li>• Bookmark frequently used guides for quick access</li>
          </ul>
        </CardContent>
      </Card>

      {/* Guides Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {guides.map((guide) => (
          <Card key={guide.title} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <guide.icon className="h-8 w-8 text-primary" />
                <div className="flex gap-2">
                  <Badge className={getDifficultyColor(guide.difficulty)}>
                    {guide.difficulty}
                  </Badge>
                </div>
              </div>
              <CardTitle className="text-lg">{guide.title}</CardTitle>
              <CardDescription className="text-sm">
                {guide.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Estimated Time */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{guide.estimatedTime} read</span>
              </div>

              {/* Topics Covered */}
              <div>
                <p className="text-sm font-medium text-foreground mb-2">Topics covered:</p>
                <ul className="space-y-1">
                  {guide.topics.map((topic, index) => (
                    <li key={index} className="text-sm text-muted-foreground">
                      • {topic}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <Button asChild className="w-full">
                <Link to={guide.link}>
                  Read Guide
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Additional Resources */}
      <Card>
        <CardHeader>
          <CardTitle>Need More Help?</CardTitle>
          <CardDescription>
            Additional resources and support options
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h4 className="font-medium text-foreground">Contact Support</h4>
              <p className="text-sm text-muted-foreground">
                Reach out to your system administrator or HR team for personalized assistance.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-foreground">System Updates</h4>
              <p className="text-sm text-muted-foreground">
                Check the notifications panel for system updates and new feature announcements.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}