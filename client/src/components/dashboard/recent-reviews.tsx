import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { format } from "date-fns";
import type { ReviewWithDetails } from "@/types";

export default function RecentReviews() {
  const { data: recentReviews, isLoading } = useQuery<ReviewWithDetails[]>({
    queryKey: ["/api/dashboard/recent-reviews"],
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'complete': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getStatusLabel = (status: string) => {
    return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4 p-4 rounded-lg bg-gray-50 animate-pulse">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-24"></div>
                </div>
                <div className="h-6 w-20 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Recent Reviews</CardTitle>
          <Button variant="link" size="sm" data-testid="link-view-all-recent">
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentReviews && recentReviews.length > 0 ? (
            recentReviews.map((review) => (
              <div key={review.id} className="flex items-center space-x-4 p-4 rounded-lg bg-gray-50">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={review.employee?.profileImageUrl} />
                  <AvatarFallback>
                    {review.employee?.firstName?.[0]}{review.employee?.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-medium text-gray-900" data-testid={`text-employee-${review.id}`}>
                    {review.employee?.firstName} {review.employee?.lastName}
                  </p>
                  <p className="text-sm text-gray-600 capitalize" data-testid={`text-type-${review.id}`}>
                    {review.reviewType} Review
                  </p>
                </div>
                <div className="text-right">
                  <Badge 
                    className={getStatusColor(review.status)}
                    data-testid={`badge-status-${review.id}`}
                  >
                    {getStatusLabel(review.status)}
                  </Badge>
                  <p className="text-xs text-gray-500 mt-1">
                    {review.completedAt 
                      ? format(new Date(review.completedAt), 'MMM dd')
                      : format(new Date(review.updatedAt), 'MMM dd')
                    }
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Eye className="h-12 w-12 mx-auto mb-2 text-gray-300" />
              <p>No recent reviews found</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
