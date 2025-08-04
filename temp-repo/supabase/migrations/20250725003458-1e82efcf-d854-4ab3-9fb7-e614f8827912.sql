-- Add auto calculation settings to goals table
ALTER TABLE public.goals 
ADD COLUMN auto_calculate_progress BOOLEAN DEFAULT false;