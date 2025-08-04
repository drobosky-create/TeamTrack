import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useGoals } from './useGoals';
import { useReviews } from './useReviews';

export interface PerformanceInsight {
  type: 'goal' | 'review' | 'milestone' | 'metric';
  title: string;
  description: string;
  status: 'positive' | 'neutral' | 'negative';
  data?: any;
}

export interface PerformanceMetrics {
  goalsCompleted: number;
  goalsOnTrack: number;
  goalsAtRisk: number;
  averageGoalProgress: number;
  reviewsCompleted: number;
  averageReviewScore: number;
  milestonesCompleted: number;
  totalMilestones: number;
  insights: PerformanceInsight[];
  trendData: Array<{
    date: string;
    goalProgress: number;
    reviewScore?: number;
    milestonesCompleted: number;
  }>;
}

export const usePerformanceData = (userId?: string) => {
  const { user } = useAuth();
  const targetUserId = userId || user?.id;
  
  const { goals } = useGoals();
  const { reviews } = useReviews(targetUserId);

  const { data: performanceMetrics, isLoading } = useQuery({
    queryKey: ['performanceMetrics', targetUserId, goals?.length, reviews?.length],
    queryFn: async (): Promise<PerformanceMetrics> => {
      if (!targetUserId || !goals || !reviews) {
        return {
          goalsCompleted: 0,
          goalsOnTrack: 0,
          goalsAtRisk: 0,
          averageGoalProgress: 0,
          reviewsCompleted: 0,
          averageReviewScore: 0,
          milestonesCompleted: 0,
          totalMilestones: 0,
          insights: [],
          trendData: [],
        };
      }

      // Calculate goal metrics
      const goalsCompleted = goals.filter(g => g.status === 'completed').length;
      const goalsOnTrack = goals.filter(g => g.status === 'on-track' || g.status === 'active').length;
      const goalsAtRisk = goals.filter(g => g.status === 'at-risk' || g.status === 'behind').length;
      const averageGoalProgress = goals.length > 0 
        ? goals.reduce((sum, goal) => sum + goal.progress, 0) / goals.length 
        : 0;

      // Calculate milestone metrics
      const allMilestones = goals.flatMap(g => g.milestones);
      const milestonesCompleted = allMilestones.filter(m => m.completed).length;
      const totalMilestones = allMilestones.length;

      // Calculate review metrics
      const reviewsCompleted = reviews.filter(r => r.status === 'completed').length;
      const averageReviewScore = reviews
        .filter(r => r.averageScore)
        .reduce((sum, review) => sum + (review.averageScore || 0), 0) / 
        Math.max(reviews.filter(r => r.averageScore).length, 1);

      // Generate insights
      const insights: PerformanceInsight[] = [];

      // Goal completion insight
      if (goalsCompleted > 0) {
        insights.push({
          type: 'goal',
          title: 'Goal Achievement',
          description: `Completed ${goalsCompleted} goal${goalsCompleted > 1 ? 's' : ''} this period`,
          status: 'positive',
          data: { completed: goalsCompleted }
        });
      }

      // Progress insight
      if (averageGoalProgress >= 80) {
        insights.push({
          type: 'goal',
          title: 'Strong Progress',
          description: `Maintaining ${Math.round(averageGoalProgress)}% average progress across all goals`,
          status: 'positive'
        });
      } else if (averageGoalProgress < 50) {
        insights.push({
          type: 'goal',
          title: 'Progress Attention Needed',
          description: `Goal progress at ${Math.round(averageGoalProgress)}% - consider review and adjustment`,
          status: 'negative'
        });
      }

      // Review performance insight
      if (averageReviewScore >= 4) {
        insights.push({
          type: 'review',
          title: 'Excellent Performance',
          description: `Strong review scores averaging ${averageReviewScore.toFixed(1)}/5`,
          status: 'positive'
        });
      }

      // Milestone completion insight
      const milestoneCompletionRate = totalMilestones > 0 ? (milestonesCompleted / totalMilestones) * 100 : 0;
      if (milestoneCompletionRate >= 75) {
        insights.push({
          type: 'milestone',
          title: 'Milestone Success',
          description: `${Math.round(milestoneCompletionRate)}% milestone completion rate`,
          status: 'positive'
        });
      }

      // Goal-review alignment insight
      const reviewsWithLinkedGoals = reviews.filter(r => r.linkedGoals && r.linkedGoals.length > 0);
      if (reviewsWithLinkedGoals.length > 0) {
        insights.push({
          type: 'review',
          title: 'Goal-Review Alignment',
          description: `${reviewsWithLinkedGoals.length} review${reviewsWithLinkedGoals.length > 1 ? 's' : ''} connected to specific goals`,
          status: 'positive'
        });
      }

      // Generate trend data (simplified - last 6 months)
      const trendData = [];
      const now = new Date();
      for (let i = 5; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthGoals = goals.filter(g => g.createdDate <= date);
        const monthReviews = reviews.filter(r => r.dueDate <= date && r.completedAt);
        
        trendData.push({
          date: date.toISOString().split('T')[0],
          goalProgress: monthGoals.length > 0 
            ? monthGoals.reduce((sum, g) => sum + g.progress, 0) / monthGoals.length 
            : 0,
          reviewScore: monthReviews.length > 0 
            ? monthReviews.reduce((sum, r) => sum + (r.averageScore || 0), 0) / monthReviews.length 
            : undefined,
          milestonesCompleted: monthGoals
            .flatMap(g => g.milestones)
            .filter(m => m.completed && m.completedDate && m.completedDate <= date).length
        });
      }

      return {
        goalsCompleted,
        goalsOnTrack,
        goalsAtRisk,
        averageGoalProgress: Math.round(averageGoalProgress),
        reviewsCompleted,
        averageReviewScore: Math.round(averageReviewScore * 10) / 10,
        milestonesCompleted,
        totalMilestones,
        insights,
        trendData,
      };
    },
    enabled: !!targetUserId && !!goals && !!reviews,
  });

  return {
    performanceMetrics,
    isLoading,
  };
};