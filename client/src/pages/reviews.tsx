import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ReviewFormModal from "@/components/reviews/review-form-modal";
import { Plus, Eye, Edit, Calendar, User } from "lucide-react";
import type { Review } from "@shared/schema";
import { format } from "date-fns";

export default function Reviews() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading, user } = useAuth();
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);

  const { data: reviews, isLoading: reviewsLoading, refetch } = useQuery<Review[]>({
    queryKey: ["/api/reviews"],
    enabled: !!user,
  });

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
    }
  }, [isAuthenticated, isLoading, toast]);

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

  const handleCreateReview = () => {
    setSelectedReview(null);
    setShowReviewModal(true);
  };

  const handleViewReview = (review: Review) => {
    setSelectedReview(review);
    setShowReviewModal(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          title="Performance Reviews" 
          subtitle="Manage and track performance reviews across your team"
        >
          {(user.role === 'admin' || user.role === 'manager') && (
            <Button onClick={handleCreateReview} data-testid="button-create-review">
              <Plus className="h-4 w-4 mr-2" />
              New Review
            </Button>
          )}
        </Header>

        <main className="flex-1 overflow-y-auto p-6">
          {reviewsLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : reviews && reviews.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {reviews.map((review: Review) => (
                <Card key={review.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg" data-testid={`text-review-${review.id}`}>
                          {review.reviewType?.charAt(0).toUpperCase() + review.reviewType?.slice(1)} Review
                        </CardTitle>
                        <div className="flex items-center space-x-2 mt-1 text-sm text-gray-600">
                          <User className="h-4 w-4" />
                          <span data-testid={`text-employee-${review.id}`}>
                            Employee ID: {review.employeeId}
                          </span>
                        </div>
                      </div>
                      <Badge 
                        className={getStatusColor(review.status)} 
                        data-testid={`badge-status-${review.id}`}
                      >
                        {getStatusLabel(review.status)}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Calendar className="h-4 w-4" />
                        <span>Due: {format(new Date(review.dueDate), 'MMM dd, yyyy')}</span>
                      </div>

                      {review.requiresFollowUp && (
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="text-orange-600 border-orange-200">
                            Follow-up Required
                          </Badge>
                        </div>
                      )}

                      <div className="flex justify-end space-x-2 pt-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewReview(review)}
                          data-testid={`button-view-${review.id}`}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        
                        {(user.role === 'admin' || 
                          user.id === review.managerId || 
                          user.id === review.employeeId) && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewReview(review)}
                            data-testid={`button-edit-${review.id}`}
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <div className="text-gray-400 mb-4">
                  <Eye className="h-16 w-16 mx-auto" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Reviews Found</h3>
                <p className="text-gray-600 mb-6">
                  {user.role === 'team_member' 
                    ? "You don't have any reviews assigned yet."
                    : "No reviews have been created yet. Create your first review to get started."
                  }
                </p>
                {(user.role === 'admin' || user.role === 'manager') && (
                  <Button onClick={handleCreateReview} data-testid="button-create-first-review">
                    <Plus className="h-4 w-4 mr-2" />
                    Create First Review
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </main>
      </div>

      <ReviewFormModal
        open={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        review={selectedReview}
        onSuccess={() => {
          refetch();
          setShowReviewModal(false);
        }}
      />
    </div>
  );
}
