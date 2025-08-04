-- Add triggers for automatic timestamp updates on all tables
CREATE TRIGGER update_company_settings_updated_at
  BEFORE UPDATE ON public.company_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_goal_metrics_updated_at
  BEFORE UPDATE ON public.goal_metrics
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_goal_milestones_updated_at
  BEFORE UPDATE ON public.goal_milestones
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_goals_updated_at
  BEFORE UPDATE ON public.goals
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_review_scores_updated_at
  BEFORE UPDATE ON public.review_scores
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_review_templates_updated_at
  BEFORE UPDATE ON public.review_templates
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at
  BEFORE UPDATE ON public.reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Add indexes for better performance
CREATE INDEX idx_goals_user_id ON public.goals(user_id);
CREATE INDEX idx_goals_status ON public.goals(status);
CREATE INDEX idx_goals_target_date ON public.goals(target_date);
CREATE INDEX idx_goal_milestones_goal_id ON public.goal_milestones(goal_id);
CREATE INDEX idx_goal_metrics_goal_id ON public.goal_metrics(goal_id);
CREATE INDEX idx_reviews_user_id ON public.reviews(user_id);
CREATE INDEX idx_reviews_manager_id ON public.reviews(manager_id);
CREATE INDEX idx_reviews_status ON public.reviews(status);
CREATE INDEX idx_reviews_due_date ON public.reviews(due_date);
CREATE INDEX idx_review_scores_review_id ON public.review_scores(review_id);
CREATE INDEX idx_profiles_manager_id ON public.profiles(manager_id);
CREATE INDEX idx_profiles_role ON public.profiles(role);

-- Add function to automatically calculate goal progress from milestones
CREATE OR REPLACE FUNCTION public.calculate_goal_progress_from_milestones(goal_id_param uuid)
RETURNS integer AS $$
DECLARE
  total_milestones integer;
  completed_milestones integer;
  progress_percentage integer;
BEGIN
  -- Count total milestones for the goal
  SELECT COUNT(*) INTO total_milestones
  FROM public.goal_milestones
  WHERE goal_id = goal_id_param;
  
  -- Count completed milestones
  SELECT COUNT(*) INTO completed_milestones
  FROM public.goal_milestones
  WHERE goal_id = goal_id_param AND completed = true;
  
  -- Calculate percentage (avoid division by zero)
  IF total_milestones = 0 THEN
    progress_percentage := 0;
  ELSE
    progress_percentage := ROUND((completed_milestones::decimal / total_milestones::decimal) * 100);
  END IF;
  
  RETURN progress_percentage;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add trigger to automatically update goal progress when milestones change
CREATE OR REPLACE FUNCTION public.update_goal_progress_on_milestone_change()
RETURNS TRIGGER AS $$
BEGIN
  -- Update the goal's progress if auto_calculate_progress is enabled
  UPDATE public.goals
  SET progress = public.calculate_goal_progress_from_milestones(NEW.goal_id),
      updated_at = now()
  WHERE id = NEW.goal_id 
    AND auto_calculate_progress = true;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_update_goal_progress_on_milestone_change
  AFTER INSERT OR UPDATE OR DELETE ON public.goal_milestones
  FOR EACH ROW
  EXECUTE FUNCTION public.update_goal_progress_on_milestone_change();