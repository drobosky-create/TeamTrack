import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Goal, GoalMilestone, GoalMetric } from '@/types/goals';
import { useToast } from '@/hooks/use-toast';
import type { Database } from '@/integrations/supabase/types';

type GoalRow = Database['public']['Tables']['goals']['Row'];
type GoalInsert = Database['public']['Tables']['goals']['Insert'];
type GoalUpdate = Database['public']['Tables']['goals']['Update'];

export interface CreateGoalData {
  title: string;
  description: string;
  category: Database['public']['Enums']['goal_category'];
  priority: Database['public']['Enums']['goal_priority'];
  target_date: string;
}

export interface UpdateGoalData {
  title?: string;
  description?: string;
  category?: Database['public']['Enums']['goal_category'];
  priority?: Database['public']['Enums']['goal_priority'];
  target_date?: string;
  progress?: number;
  status?: Database['public']['Enums']['goal_status'];
}

// Utility function to calculate progress from milestones
const calculateProgressFromMilestones = (milestones: GoalMilestone[]): number => {
  if (milestones.length === 0) return 0;
  const completedCount = milestones.filter(m => m.completed).length;
  return Math.round((completedCount / milestones.length) * 100);
};

export const useGoals = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch goals with their milestones and metrics
  const { data: goals = [], isLoading, error } = useQuery({
    queryKey: ['goals', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data: goalsData, error: goalsError } = await supabase
        .from('goals')
        .select(`
          *,
          goal_milestones (*),
          goal_metrics (*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (goalsError) throw goalsError;

      // Transform database data to match frontend types
      return goalsData.map((goal): Goal => ({
        id: goal.id,
        title: goal.title,
        description: goal.description,
        category: goal.category,
        priority: goal.priority,
        status: goal.status,
        progress: goal.progress || 0,
        targetDate: new Date(goal.target_date),
        createdDate: new Date(goal.created_at),
        updatedDate: new Date(goal.updated_at),
        userId: goal.user_id,
        assignedBy: goal.assigned_by,
        reviewId: goal.review_id,
        autoCalculateProgress: goal.auto_calculate_progress || false,
        milestones: goal.goal_milestones?.map((milestone): GoalMilestone => ({
          id: milestone.id,
          title: milestone.title,
          description: milestone.description,
          targetDate: new Date(milestone.target_date),
          completed: milestone.completed || false,
          completedDate: milestone.completed_date ? new Date(milestone.completed_date) : undefined,
        })) || [],
        metrics: goal.goal_metrics?.map((metric): GoalMetric => ({
          id: metric.id,
          name: metric.name,
          target: metric.target,
          current: metric.current || 0,
          unit: metric.unit,
        })) || [],
      }));
    },
    enabled: !!user?.id,
  });

  // Create goal mutation
  const createGoalMutation = useMutation({
    mutationFn: async (goalData: CreateGoalData) => {
      if (!user?.id) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('goals')
        .insert({
          title: goalData.title,
          description: goalData.description,
          category: goalData.category,
          priority: goalData.priority,
          target_date: goalData.target_date,
          user_id: user.id,
          status: 'draft',
          progress: 0,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals', user?.id] });
      toast({
        title: "Goal created",
        description: "Your new goal has been created successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error creating goal",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update goal mutation
  const updateGoalMutation = useMutation({
    mutationFn: async ({ id, ...updates }: UpdateGoalData & { id: string }) => {
      const { data, error } = await supabase
        .from('goals')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals', user?.id] });
      toast({
        title: "Goal updated",
        description: "Your goal has been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error updating goal",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Create milestone mutation
  const createMilestoneMutation = useMutation({
    mutationFn: async ({ goalId, title, description, targetDate }: {
      goalId: string;
      title: string;
      description?: string;
      targetDate: string;
    }) => {
      const { data, error } = await supabase
        .from('goal_milestones')
        .insert({
          goal_id: goalId,
          title,
          description,
          target_date: targetDate,
          completed: false,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals', user?.id] });
    },
  });

  // Update milestone mutation with auto-progress calculation
  const updateMilestoneMutation = useMutation({
    mutationFn: async ({ id, completed, completedDate, goalId }: {
      id: string;
      completed: boolean;
      completedDate?: string;
      goalId?: string;
    }) => {
      // Update milestone
      const { data: milestoneData, error: milestoneError } = await supabase
        .from('goal_milestones')
        .update({
          completed,
          completed_date: completedDate,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select('*, goals!inner(id, auto_calculate_progress)')
        .single();

      if (milestoneError) throw milestoneError;

      // If auto-calculation is enabled, update goal progress
      if (milestoneData.goals?.auto_calculate_progress) {
        const { data: allMilestones } = await supabase
          .from('goal_milestones')
          .select('completed')
          .eq('goal_id', milestoneData.goal_id);

        if (allMilestones) {
          const newProgress = calculateProgressFromMilestones(
            allMilestones.map(m => ({ completed: m.completed } as GoalMilestone))
          );

          await supabase
            .from('goals')
            .update({ progress: newProgress })
            .eq('id', milestoneData.goal_id);
        }
      }

      return milestoneData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals', user?.id] });
      toast({
        title: "Milestone updated",
        description: "Milestone status has been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error updating milestone",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Create metric mutation
  const createMetricMutation = useMutation({
    mutationFn: async ({ goalId, name, target, unit, current = 0 }: {
      goalId: string;
      name: string;
      target: number;
      unit: string;
      current?: number;
    }) => {
      const { data, error } = await supabase
        .from('goal_metrics')
        .insert({
          goal_id: goalId,
          name,
          target,
          unit,
          current,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals', user?.id] });
    },
  });

  // Update metric mutation
  const updateMetricMutation = useMutation({
    mutationFn: async ({ id, current }: { id: string; current: number }) => {
      const { data, error } = await supabase
        .from('goal_metrics')
        .update({
          current,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals', user?.id] });
    },
  });

  // Toggle auto-calculation mutation
  const toggleAutoCalculationMutation = useMutation({
    mutationFn: async ({ goalId, autoCalculate }: { goalId: string; autoCalculate: boolean }) => {
      const { data, error } = await supabase
        .from('goals')
        .update({ auto_calculate_progress: autoCalculate })
        .eq('id', goalId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals', user?.id] });
      toast({
        title: "Auto-calculation setting updated",
        description: "Goal progress calculation setting has been updated.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error updating setting",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    goals,
    isLoading,
    error,
    createGoal: createGoalMutation.mutate,
    updateGoal: updateGoalMutation.mutate,
    createMilestone: createMilestoneMutation.mutate,
    updateMilestone: updateMilestoneMutation.mutate,
    createMetric: createMetricMutation.mutate,
    updateMetric: updateMetricMutation.mutate,
    toggleAutoCalculation: toggleAutoCalculationMutation.mutate,
    isCreating: createGoalMutation.isPending,
    isUpdating: updateGoalMutation.isPending,
  };
};