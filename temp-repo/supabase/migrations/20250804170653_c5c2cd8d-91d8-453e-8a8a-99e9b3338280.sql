-- Add indexes for better performance (only if they don't exist)
CREATE INDEX IF NOT EXISTS idx_goals_user_id ON public.goals(user_id);
CREATE INDEX IF NOT EXISTS idx_goals_status ON public.goals(status);
CREATE INDEX IF NOT EXISTS idx_goals_target_date ON public.goals(target_date);
CREATE INDEX IF NOT EXISTS idx_goal_milestones_goal_id ON public.goal_milestones(goal_id);
CREATE INDEX IF NOT EXISTS idx_goal_metrics_goal_id ON public.goal_metrics(goal_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON public.reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_manager_id ON public.reviews(manager_id);
CREATE INDEX IF NOT EXISTS idx_reviews_status ON public.reviews(status);
CREATE INDEX IF NOT EXISTS idx_reviews_due_date ON public.reviews(due_date);
CREATE INDEX IF NOT EXISTS idx_review_scores_review_id ON public.review_scores(review_id);
CREATE INDEX IF NOT EXISTS idx_profiles_manager_id ON public.profiles(manager_id);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

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

-- Add trigger function to automatically update goal progress when milestones change
CREATE OR REPLACE FUNCTION public.update_goal_progress_on_milestone_change()
RETURNS TRIGGER AS $$
BEGIN
  -- Handle DELETE case
  IF TG_OP = 'DELETE' THEN
    UPDATE public.goals
    SET progress = public.calculate_goal_progress_from_milestones(OLD.goal_id),
        updated_at = now()
    WHERE id = OLD.goal_id 
      AND auto_calculate_progress = true;
    RETURN OLD;
  END IF;
  
  -- Handle INSERT and UPDATE cases
  UPDATE public.goals
  SET progress = public.calculate_goal_progress_from_milestones(NEW.goal_id),
      updated_at = now()
  WHERE id = NEW.goal_id 
    AND auto_calculate_progress = true;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger (drop first if exists)
DROP TRIGGER IF EXISTS trigger_update_goal_progress_on_milestone_change ON public.goal_milestones;
CREATE TRIGGER trigger_update_goal_progress_on_milestone_change
  AFTER INSERT OR UPDATE OR DELETE ON public.goal_milestones
  FOR EACH ROW
  EXECUTE FUNCTION public.update_goal_progress_on_milestone_change();