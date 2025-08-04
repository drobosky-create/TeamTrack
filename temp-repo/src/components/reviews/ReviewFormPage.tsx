import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { ReviewForm } from './ReviewForm';
import { useAuth } from '@/contexts/AuthContext';

export const ReviewFormPage: React.FC = () => {
  const { reviewId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Mock data - would come from API based on reviewId
  const mockReviewData = {
    id: reviewId || '1',
    userId: '3',
    userName: 'Alex Rivera',
    reviewType: 'monthly' as const,
    period: '2024-12',
    dueDate: new Date('2024-12-31'),
    isManagerReview: user?.role === 'manager' || user?.role === 'admin',
    existingScores: []
  };

  const handleSave = (scores: any) => {
    console.log('Saving scores:', scores);
    // API call to save draft
  };

  const handleSubmit = (scores: any) => {
    console.log('Submitting scores:', scores);
    // API call to submit review
    navigate('/reviews');
  };

  return (
    <div className="space-y-6">
      {/* Back Navigation */}
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/reviews')}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Reviews
        </Button>
      </div>

      {/* Review Form */}
      <ReviewForm
        reviewId={mockReviewData.id}
        userId={mockReviewData.userId}
        userName={mockReviewData.userName}
        reviewType={mockReviewData.reviewType}
        period={mockReviewData.period}
        dueDate={mockReviewData.dueDate}
        isManagerReview={mockReviewData.isManagerReview}
        existingScores={mockReviewData.existingScores}
        onSave={handleSave}
        onSubmit={handleSubmit}
      />
    </div>
  );
};