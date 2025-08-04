import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Clock, Star, CheckCircle, ArrowUp, AlertTriangle } from "lucide-react";
import type { DashboardMetrics } from "@/types";

export default function MetricsCards() {
  const { data: metrics, isLoading } = useQuery<DashboardMetrics>({
    queryKey: ["/api/dashboard/metrics"],
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-16 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-gray-500">Failed to load metrics</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Team Members</p>
              <p className="text-3xl font-bold text-gray-900 mt-2" data-testid="metric-total-members">
                {metrics.totalTeamMembers}
              </p>
            </div>
            <div className="w-12 h-12 bg-primary bg-opacity-10 rounded-lg flex items-center justify-center">
              <Users className="h-6 w-6 text-primary" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-green-600 text-sm font-medium">
              <ArrowUp className="h-4 w-4 inline mr-1" />
              Active team
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Reviews</p>
              <p className="text-3xl font-bold text-gray-900 mt-2" data-testid="metric-pending-reviews">
                {metrics.pendingReviews}
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Clock className="h-6 w-6 text-orange-600" />
            </div>
          </div>
          <div className="mt-4">
            {metrics.overdueReviews > 0 ? (
              <span className="text-orange-600 text-sm font-medium">
                <AlertTriangle className="h-4 w-4 inline mr-1" />
                {metrics.overdueReviews} overdue
              </span>
            ) : (
              <span className="text-green-600 text-sm font-medium">
                <CheckCircle className="h-4 w-4 inline mr-1" />
                On track
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg. Performance Score</p>
              <p className="text-3xl font-bold text-gray-900 mt-2" data-testid="metric-avg-score">
                {metrics.averageScore.toFixed(1)}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Star className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-green-600 text-sm font-medium">
              <ArrowUp className="h-4 w-4 inline mr-1" />
              Above baseline
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed This Month</p>
              <p className="text-3xl font-bold text-gray-900 mt-2" data-testid="metric-completed-month">
                {metrics.completedThisMonth}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-green-600 text-sm font-medium">
              <ArrowUp className="h-4 w-4 inline mr-1" />
              Good progress
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
