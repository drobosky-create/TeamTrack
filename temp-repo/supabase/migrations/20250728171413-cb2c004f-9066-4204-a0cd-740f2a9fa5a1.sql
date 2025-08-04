-- Create company_settings table for storing company information
CREATE TABLE public.company_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT,
  address TEXT,
  phone TEXT,
  email TEXT,
  website TEXT,
  logo_url TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.company_settings ENABLE ROW LEVEL SECURITY;

-- Only admins can manage company settings
CREATE POLICY "Admins can manage company settings" 
ON public.company_settings 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Everyone can view company settings (for display purposes)
CREATE POLICY "Everyone can view company settings" 
ON public.company_settings 
FOR SELECT 
USING (true);

-- Add trigger for timestamp updates
CREATE TRIGGER update_company_settings_updated_at
BEFORE UPDATE ON public.company_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default company settings row (there should only be one)
INSERT INTO public.company_settings (name) VALUES ('Your Company Name');