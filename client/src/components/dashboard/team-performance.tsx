import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Lightbulb } from "lucide-react";

export default function TeamPerformance() {
  // Mock performance data - in real app this would come from API
  const performanceData = [
    { category: 'Communication', score: 4.2, percentage: 84 },
    { category: 'Technical Skills', score: 4.6, percentage: 92 },
    { category: 'Problem Solving', score: 3.9, percentage: 78 },
    { category: 'Team Collaboration', score: 4.4, percentage: 88 },
    { category: 'Leadership', score: 3.6, percentage: 72 },
  ];

  const getProgressColor = (percentage: number) => {
    if (percentage >= 85) return 'bg-green-500';
    if (percentage >= 70) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Team Performance Overview</CardTitle>
          <Select defaultValue="3months">
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3months">Last 3 Months</SelectItem>
              <SelectItem value="6months">Last 6 Months</SelectItem>
              <SelectItem value="1year">Last Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Performance Categories */}
          <div className="space-y-4">
            {performanceData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700" data-testid={`category-${index}`}>
                  {item.category}
                </span>
                <div className="flex items-center space-x-3">
                  <Progress 
                    value={item.percentage} 
                    className="w-24 h-2"
                    data-testid={`progress-${index}`}
                  />
                  <span className="text-sm font-medium text-gray-900 w-8" data-testid={`score-${index}`}>
                    {item.score}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Insight */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
            <div className="flex items-start space-x-3">
              <Lightbulb className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="text-sm font-medium text-primary">Insight</p>
                <p className="text-sm text-gray-700 mt-1" data-testid="performance-insight">
                  Technical skills are performing above average. Consider leadership development programs for team growth.
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
