-- Create enums for consistent data types
CREATE TYPE public.app_role AS ENUM ('admin', 'manager', 'team_member');
CREATE TYPE public.employment_type AS ENUM ('employee', 'contractor');
CREATE TYPE public.review_cadence AS ENUM ('monthly', 'quarterly', 'annual');
CREATE TYPE public.review_type AS ENUM ('monthly', 'quarterly', 'annual');
CREATE TYPE public.review_status AS ENUM ('not_started', 'in_progress', 'complete', 'overdue');
CREATE TYPE public.goal_category AS ENUM ('performance', 'development', 'leadership', 'technical', 'business', 'personal');
CREATE TYPE public.goal_priority AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE public.goal_status AS ENUM ('draft', 'active', 'on-track', 'at-risk', 'behind', 'completed', 'cancelled');

-- Create user_roles table for role management
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Update profiles table with additional fields
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS role app_role DEFAULT 'team_member',
ADD COLUMN IF NOT EXISTS employment_type employment_type DEFAULT 'employee',
ADD COLUMN IF NOT EXISTS review_cadence review_cadence DEFAULT 'quarterly',
ADD COLUMN IF NOT EXISTS manager_id UUID REFERENCES public.profiles(id),
ADD COLUMN IF NOT EXISTS last_login TIMESTAMP WITH TIME ZONE;

-- Create review_templates table
CREATE TABLE public.review_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    type review_type NOT NULL,
    instructions TEXT,
    is_default BOOLEAN DEFAULT false,
    created_by UUID REFERENCES public.profiles(id) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create review_categories table
CREATE TABLE public.review_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    template_id UUID REFERENCES public.review_templates(id) ON DELETE CASCADE NOT NULL,
    label TEXT NOT NULL,
    description TEXT,
    weight DECIMAL(3,2) DEFAULT 1.0,
    order_index INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create reviews table
CREATE TABLE public.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    manager_id UUID REFERENCES public.profiles(id) NOT NULL,
    template_id UUID REFERENCES public.review_templates(id) NOT NULL,
    type review_type NOT NULL,
    period TEXT NOT NULL, -- e.g., "2024-Q1", "2024-03"
    status review_status DEFAULT 'not_started',
    self_review_completed BOOLEAN DEFAULT false,
    manager_review_completed BOOLEAN DEFAULT false,
    overall_outcome TEXT,
    requires_follow_up BOOLEAN DEFAULT false,
    due_date TIMESTAMP WITH TIME ZONE NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create review_scores table
CREATE TABLE public.review_scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    review_id UUID REFERENCES public.reviews(id) ON DELETE CASCADE NOT NULL,
    category_id UUID REFERENCES public.review_categories(id) ON DELETE CASCADE NOT NULL,
    self_score INTEGER CHECK (self_score >= 1 AND self_score <= 5),
    manager_score INTEGER CHECK (manager_score >= 1 AND manager_score <= 5),
    final_score INTEGER CHECK (final_score >= 1 AND final_score <= 5),
    self_notes TEXT,
    manager_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (review_id, category_id)
);

-- Create review_attachments table
CREATE TABLE public.review_attachments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    review_id UUID REFERENCES public.reviews(id) ON DELETE CASCADE NOT NULL,
    filename TEXT NOT NULL,
    url TEXT NOT NULL,
    file_type TEXT NOT NULL,
    uploaded_by UUID REFERENCES public.profiles(id) NOT NULL,
    uploaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create goals table
CREATE TABLE public.goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category goal_category NOT NULL,
    priority goal_priority NOT NULL,
    status goal_status DEFAULT 'draft',
    progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    target_date DATE NOT NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    assigned_by UUID REFERENCES public.profiles(id),
    review_id UUID REFERENCES public.reviews(id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create goal_milestones table
CREATE TABLE public.goal_milestones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    goal_id UUID REFERENCES public.goals(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    target_date DATE NOT NULL,
    completed BOOLEAN DEFAULT false,
    completed_date DATE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create goal_metrics table
CREATE TABLE public.goal_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    goal_id UUID REFERENCES public.goals(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    target DECIMAL(10,2) NOT NULL,
    current DECIMAL(10,2) DEFAULT 0,
    unit TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.review_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.review_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.review_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.review_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goal_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goal_metrics ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check user roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  ) OR EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = _user_id
      AND role = _role
  )
$$;

-- Create function to check if user is manager of another user
CREATE OR REPLACE FUNCTION public.is_manager_of(_manager_id uuid, _user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = _user_id
      AND manager_id = _manager_id
  )
$$;

-- RLS Policies for user_roles
CREATE POLICY "Users can view their own roles" ON public.user_roles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles" ON public.user_roles
    FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage all roles" ON public.user_roles
    FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for review_templates
CREATE POLICY "Everyone can view templates" ON public.review_templates
    FOR SELECT USING (true);

CREATE POLICY "Admins and managers can create templates" ON public.review_templates
    FOR INSERT WITH CHECK (
        public.has_role(auth.uid(), 'admin') OR 
        public.has_role(auth.uid(), 'manager')
    );

CREATE POLICY "Admins and template creators can update templates" ON public.review_templates
    FOR UPDATE USING (
        public.has_role(auth.uid(), 'admin') OR 
        created_by = auth.uid()
    );

-- RLS Policies for review_categories
CREATE POLICY "Everyone can view categories" ON public.review_categories
    FOR SELECT USING (true);

CREATE POLICY "Admins and managers can manage categories" ON public.review_categories
    FOR ALL USING (
        public.has_role(auth.uid(), 'admin') OR 
        public.has_role(auth.uid(), 'manager')
    );

-- RLS Policies for reviews
CREATE POLICY "Users can view their own reviews" ON public.reviews
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Managers can view their team's reviews" ON public.reviews
    FOR SELECT USING (public.is_manager_of(auth.uid(), user_id));

CREATE POLICY "Admins can view all reviews" ON public.reviews
    FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Managers can create reviews for their team" ON public.reviews
    FOR INSERT WITH CHECK (
        public.has_role(auth.uid(), 'manager') OR 
        public.has_role(auth.uid(), 'admin')
    );

CREATE POLICY "Users and managers can update reviews" ON public.reviews
    FOR UPDATE USING (
        auth.uid() = user_id OR 
        public.is_manager_of(auth.uid(), user_id) OR
        public.has_role(auth.uid(), 'admin')
    );

-- RLS Policies for review_scores
CREATE POLICY "Users can view scores for their reviews" ON public.review_scores
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.reviews r 
            WHERE r.id = review_id AND (
                r.user_id = auth.uid() OR 
                public.is_manager_of(auth.uid(), r.user_id) OR
                public.has_role(auth.uid(), 'admin')
            )
        )
    );

CREATE POLICY "Users and managers can manage scores" ON public.review_scores
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.reviews r 
            WHERE r.id = review_id AND (
                r.user_id = auth.uid() OR 
                public.is_manager_of(auth.uid(), r.user_id) OR
                public.has_role(auth.uid(), 'admin')
            )
        )
    );

-- RLS Policies for goals
CREATE POLICY "Users can view their own goals" ON public.goals
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Managers can view their team's goals" ON public.goals
    FOR SELECT USING (public.is_manager_of(auth.uid(), user_id));

CREATE POLICY "Admins can view all goals" ON public.goals
    FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can create their own goals" ON public.goals
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Managers can create goals for their team" ON public.goals
    FOR INSERT WITH CHECK (
        public.is_manager_of(auth.uid(), user_id) OR
        public.has_role(auth.uid(), 'admin')
    );

CREATE POLICY "Users and managers can update goals" ON public.goals
    FOR UPDATE USING (
        auth.uid() = user_id OR 
        public.is_manager_of(auth.uid(), user_id) OR
        public.has_role(auth.uid(), 'admin')
    );

-- RLS Policies for goal_milestones
CREATE POLICY "Users can manage milestones for their goals" ON public.goal_milestones
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.goals g 
            WHERE g.id = goal_id AND (
                g.user_id = auth.uid() OR 
                public.is_manager_of(auth.uid(), g.user_id) OR
                public.has_role(auth.uid(), 'admin')
            )
        )
    );

-- RLS Policies for goal_metrics
CREATE POLICY "Users can manage metrics for their goals" ON public.goal_metrics
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.goals g 
            WHERE g.id = goal_id AND (
                g.user_id = auth.uid() OR 
                public.is_manager_of(auth.uid(), g.user_id) OR
                public.has_role(auth.uid(), 'admin')
            )
        )
    );

-- Add triggers for updated_at timestamps
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
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

CREATE TRIGGER update_review_scores_updated_at
    BEFORE UPDATE ON public.review_scores
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_goals_updated_at
    BEFORE UPDATE ON public.goals
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_goal_milestones_updated_at
    BEFORE UPDATE ON public.goal_milestones
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_goal_metrics_updated_at
    BEFORE UPDATE ON public.goal_metrics
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX idx_profiles_manager_id ON public.profiles(manager_id);
CREATE INDEX idx_reviews_user_id ON public.reviews(user_id);
CREATE INDEX idx_reviews_manager_id ON public.reviews(manager_id);
CREATE INDEX idx_reviews_status ON public.reviews(status);
CREATE INDEX idx_reviews_due_date ON public.reviews(due_date);
CREATE INDEX idx_goals_user_id ON public.goals(user_id);
CREATE INDEX idx_goals_status ON public.goals(status);
CREATE INDEX idx_goal_milestones_goal_id ON public.goal_milestones(goal_id);
CREATE INDEX idx_goal_metrics_goal_id ON public.goal_metrics(goal_id);