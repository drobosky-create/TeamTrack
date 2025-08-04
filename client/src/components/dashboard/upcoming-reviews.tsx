import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Eye, Edit, Filter, Download } from "lucide-react";
import { format } from "date-fns";
import type { ReviewWithDetails } from "@/types";

export default function UpcomingReviews() {
  const { data: upcomingReviews, isLoading } = useQuery<ReviewWithDetails[]>({
    queryKey: ["/api/dashboard/upcoming-reviews"],
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
          <CardTitle>Upcoming Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Upcoming Reviews</CardTitle>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" data-testid="button-filter">
              <Filter className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" data-testid="button-export">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {upcomingReviews && upcomingReviews.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Review Type</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Manager</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {upcomingReviews.map((review) => (
                    <TableRow key={review.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={review.employee?.profileImageUrl} />
                            <AvatarFallback>
                              {review.employee?.firstName?.[0]}{review.employee?.lastName?.[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="text-sm font-medium text-gray-900" data-testid={`employee-${review.id}`}>
                              {review.employee?.firstName} {review.employee?.lastName}
                            </div>
                            <div className="text-sm text-gray-500" data-testid={`department-${review.id}`}>
                              {review.employee?.department || 'No Department'}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="capitalize" data-testid={`type-${review.id}`}>
                        {review.reviewType}
                      </TableCell>
                      <TableCell data-testid={`due-date-${review.id}`}>
                        {format(new Date(review.dueDate), 'MMM dd, yyyy')}
                      </TableCell>
                      <TableCell data-testid={`manager-${review.id}`}>
                        {review.manager?.firstName} {review.manager?.lastName}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          className={getStatusColor(review.status)}
                          data-testid={`status-${review.id}`}
                        >
                          {getStatusLabel(review.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            data-testid={`view-${review.id}`}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            data-testid={`edit-${review.id}`}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="flex items-center justify-between mt-4 pt-4 border-t">
              <div className="text-sm text-gray-700">
                Showing <span className="font-medium">1</span> to{" "}
                <span className="font-medium">{Math.min(upcomingReviews.length, 10)}</span> of{" "}
                <span className="font-medium">{upcomingReviews.length}</span> results
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" disabled>
                  Previous
                </Button>
                <Button variant="outline" size="sm" disabled>
                  Next
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Eye className="h-12 w-12 mx-auto mb-2 text-gray-300" />
            <p>No upcoming reviews found</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
