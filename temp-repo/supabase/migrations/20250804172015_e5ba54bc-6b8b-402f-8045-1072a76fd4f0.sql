-- Fix security warnings by setting search_path on functions
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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = 'public';

-- Fix the trigger function with proper search_path
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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = 'public';