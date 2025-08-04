import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import type { Database } from '@/integrations/supabase/types';

type ReviewRow = Database['public']['Tables']['reviews']['Row'];
type ReviewInsert = Database['public']['Tables']['reviews']['Insert'];

export interface Review {
  id: string;
  userId: string;
  managerId: string;
  templateId: string;
  type: string;
  period: string;
  status: string;
  selfReviewCompleted: boolean;
  managerReviewCompleted: boolean;
  overallOutcome?: string;
  requiresFollowUp: boolean;
  createdAt: Date;
  updatedAt: Date;
  dueDate: Date;
  completedAt?: Date;
  linkedGoals?: Array<{
    id: string;
    title: string;
    progress: number;
    status: string;
  }>;
  averageScore?: number;
}

export const useReviews = (userId?: string) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const targetUserId = userId || user?.id;

  // Fetch reviews with linked goals
  const { data: reviews = [], isLoading, error } = useQuery({
    queryKey: ['reviews', targetUserId],
    queryFn: async () => {
      if (!targetUserId) return [];

      // Fetch reviews
      const { data: reviewsData, error: reviewsError } = await supabase
        .from('reviews')
        .select(`
          *,
          review_scores (
            self_score,
            manager_score,
            final_score
          )
        `)
        .eq('user_id', targetUserId)
        .order('due_date', { ascending: false });

      if (reviewsError) throw reviewsError;

      // Fetch linked goals for each review period
      const reviewsWithGoals = await Promise.all(
        reviewsData.map(async (review): Promise<Review> => {
          // Fetch goals linked to this review or created during review period
          const { data: goalsData } = await supabase
            .from('goals')
            .select('id, title, progress, status')
            .eq('user_id', targetUserId)
            .or(`review_id.eq.${review.id},created_at.gte.${review.created_at},created_at.lte.${review.due_date}`);

          // Calculate average score from review_scores
          const scores = review.review_scores || [];
          const finalScores = scores.map(s => s.final_score || s.manager_score || s.self_score).filter(Boolean);
          const averageScore = finalScores.length > 0 
            ? finalScores.reduce((sum, score) => sum + score, 0) / finalScores.length 
            : undefined;

          return {
            id: review.id,
            userId: review.user_id,
            managerId: review.manager_id,
            templateId: review.template_id,
            type: review.type,
            period: review.period,
            status: review.status,
            selfReviewCompleted: review.self_review_completed || false,
            managerReviewCompleted: review.manager_review_completed || false,
            overallOutcome: review.overall_outcome,
            requiresFollowUp: review.requires_follow_up || false,
            createdAt: new Date(review.created_at),
            updatedAt: new Date(review.updated_at),
            dueDate: new Date(review.due_date),
            completedAt: review.completed_at ? new Date(review.completed_at) : undefined,
            linkedGoals: goalsData || [],
            averageScore,
          };
        })
      );

      return reviewsWithGoals;
    },
    enabled: !!targetUserId,
  });

  // Link goal to review
  const linkGoalToReviewMutation = useMutation({
    mutationFn: async ({ goalId, reviewId }: { goalId: string; reviewId: string }) => {
      const { data, error } = await supabase
        .from('goals')
        .update({ review_id: reviewId })
        .eq('id', goalId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews', targetUserId] });
      queryClient.invalidateQueries({ queryKey: ['goals', user?.id] });
      toast({
        title: "Goal linked to review",
        description: "Goal has been successfully linked to the review.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error linking goal",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update review status based on goal completion
  const updateReviewFromGoalProgressMutation = useMutation({
    mutationFn: async ({ reviewId, goalProgress }: { reviewId: string; goalProgress: number }) => {
      // Auto-update review status if goals are progressing well
      let status: 'not_started' | 'in_progress' | 'complete' | 'overdue' = 'in_progress';
      if (goalProgress >= 90) status = 'complete';
      else if (goalProgress < 30) status = 'overdue';

      const { data, error } = await supabase
        .from('reviews')
        .update({ 
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', reviewId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews', targetUserId] });
    },
  });

  return {
    reviews,
    isLoading,
    error,
    linkGoalToReview: linkGoalToReviewMutation.mutate,
    updateReviewFromGoalProgress: updateReviewFromGoalProgressMutation.mutate,
    isLinking: linkGoalToReviewMutation.isPending,
  };
};