CREATE TYPE "public"."assessment_tier" AS ENUM('free', 'growth', 'capital');--> statement-breakpoint
CREATE TYPE "public"."branding_element" AS ENUM('logo', 'favicon', 'banner');--> statement-breakpoint
CREATE TYPE "public"."document_status" AS ENUM('draft', 'final', 'archived');--> statement-breakpoint
CREATE TYPE "public"."document_type" AS ENUM('policy', 'agreement', 'guide', 'form', 'template');--> statement-breakpoint
CREATE TYPE "public"."employment_type" AS ENUM('employee', 'contractor');--> statement-breakpoint
CREATE TYPE "public"."goal_category" AS ENUM('performance', 'development', 'leadership', 'technical', 'business', 'personal');--> statement-breakpoint
CREATE TYPE "public"."goal_priority" AS ENUM('low', 'medium', 'high', 'critical');--> statement-breakpoint
CREATE TYPE "public"."goal_status" AS ENUM('draft', 'active', 'on-track', 'at-risk', 'behind', 'completed', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."grade" AS ENUM('A', 'B', 'C', 'D', 'F');--> statement-breakpoint
CREATE TYPE "public"."review_status" AS ENUM('not_started', 'in_progress', 'complete', 'overdue');--> statement-breakpoint
CREATE TYPE "public"."review_type" AS ENUM('monthly', 'quarterly', 'annual');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('admin', 'manager', 'team_member');--> statement-breakpoint
CREATE TABLE "assessments" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"review_id" varchar,
	"assessment_type" varchar DEFAULT 'performance' NOT NULL,
	"financial_performance" text,
	"customer_concentration" text,
	"management_team" text,
	"competitive_position" text,
	"growth_prospects" text,
	"systems_processes" text,
	"asset_quality" text,
	"industry_outlook" text,
	"risk_factors" text,
	"owner_dependency" text,
	"overall_score" text,
	"tier" "assessment_tier" DEFAULT 'free' NOT NULL,
	"narrative_summary" text,
	"executive_summary" text,
	"is_processed" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "documents" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar NOT NULL,
	"description" text,
	"type" "document_type" NOT NULL,
	"status" "document_status" DEFAULT 'draft' NOT NULL,
	"content" text,
	"file_path" varchar,
	"file_name" varchar,
	"file_size" integer,
	"mime_type" varchar,
	"created_by" varchar NOT NULL,
	"updated_by" varchar,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "goals" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar NOT NULL,
	"description" text,
	"category" "goal_category" NOT NULL,
	"priority" "goal_priority" DEFAULT 'medium' NOT NULL,
	"status" "goal_status" DEFAULT 'draft' NOT NULL,
	"progress" integer DEFAULT 0,
	"target_date" timestamp NOT NULL,
	"user_id" varchar NOT NULL,
	"assigned_by" varchar,
	"review_id" varchar,
	"auto_calculate_progress" boolean DEFAULT false,
	"milestones" jsonb,
	"metrics" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"title" varchar NOT NULL,
	"message" text NOT NULL,
	"type" varchar DEFAULT 'info',
	"is_read" boolean DEFAULT false,
	"action_url" varchar,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "organization_branding" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_name" varchar DEFAULT 'PerformanceHub' NOT NULL,
	"organization_tagline" varchar,
	"logo_url" varchar,
	"favicon_url" varchar,
	"banner_url" varchar,
	"primary_color" varchar DEFAULT '#3b82f6',
	"secondary_color" varchar DEFAULT '#64748b',
	"accent_color" varchar DEFAULT '#10b981',
	"background_color" varchar DEFAULT '#ffffff',
	"text_color" varchar DEFAULT '#1f2937',
	"primary_font" varchar DEFAULT 'Inter',
	"heading_font" varchar DEFAULT 'Inter',
	"sidebar_color" varchar DEFAULT '#f8fafc',
	"header_color" varchar DEFAULT '#ffffff',
	"card_color" varchar DEFAULT '#ffffff',
	"footer_text" text,
	"footer_links" jsonb,
	"support_email" varchar,
	"support_phone" varchar,
	"website_url" varchar,
	"custom_css" text,
	"custom_js" text,
	"is_active" boolean DEFAULT true,
	"updated_by" varchar,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "review_templates" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar NOT NULL,
	"review_type" "review_type" NOT NULL,
	"template_type" varchar DEFAULT 'standard' NOT NULL,
	"categories" jsonb NOT NULL,
	"instructions" text,
	"core_values" jsonb,
	"competencies" jsonb,
	"sections" jsonb,
	"is_active" boolean DEFAULT true,
	"created_by" varchar,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "reviews" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"employee_id" varchar NOT NULL,
	"manager_id" varchar NOT NULL,
	"template_id" varchar NOT NULL,
	"review_type" "review_type" NOT NULL,
	"due_date" timestamp NOT NULL,
	"status" "review_status" DEFAULT 'not_started' NOT NULL,
	"self_review_notes" text,
	"manager_review_notes" text,
	"scores" jsonb,
	"requires_follow_up" boolean DEFAULT false,
	"follow_up_notes" text,
	"attachments" jsonb,
	"strengths" jsonb,
	"areas_for_improvement" jsonb,
	"plan_of_action" jsonb,
	"leader_responsibilities" text,
	"employee_comments" text,
	"employee_signature_date" timestamp,
	"rater_signature_date" timestamp,
	"completed_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"sid" varchar PRIMARY KEY NOT NULL,
	"sess" jsonb NOT NULL,
	"expire" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ui_tokens" (
	"id" serial PRIMARY KEY NOT NULL,
	"key" text NOT NULL,
	"value" text NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "ui_tokens_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar,
	"first_name" varchar,
	"last_name" varchar,
	"profile_image_url" varchar,
	"role" "user_role" DEFAULT 'team_member' NOT NULL,
	"department" varchar,
	"manager_id" varchar,
	"employment_type" "employment_type" DEFAULT 'employee',
	"review_cadence" "review_type" DEFAULT 'quarterly',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "valuation_assessments" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text NOT NULL,
	"company" text NOT NULL,
	"job_title" text,
	"founding_year" integer,
	"naics_code" text,
	"sic_code" text,
	"industry_description" text,
	"tier" text DEFAULT 'free',
	"report_tier" text DEFAULT 'free' NOT NULL,
	"payment_status" text DEFAULT 'pending',
	"stripe_payment_id" text,
	"net_income" numeric(15, 2) NOT NULL,
	"interest" numeric(15, 2) NOT NULL,
	"taxes" numeric(15, 2) NOT NULL,
	"depreciation" numeric(15, 2) NOT NULL,
	"amortization" numeric(15, 2) NOT NULL,
	"owner_salary" numeric(15, 2) DEFAULT '0',
	"personal_expenses" numeric(15, 2) DEFAULT '0',
	"one_time_expenses" numeric(15, 2) DEFAULT '0',
	"other_adjustments" numeric(15, 2) DEFAULT '0',
	"adjustment_notes" text,
	"financial_performance" text NOT NULL,
	"customer_concentration" text NOT NULL,
	"management_team" text NOT NULL,
	"competitive_position" text NOT NULL,
	"growth_prospects" text NOT NULL,
	"systems_processes" text NOT NULL,
	"asset_quality" text NOT NULL,
	"industry_outlook" text NOT NULL,
	"risk_factors" text NOT NULL,
	"owner_dependency" text NOT NULL,
	"follow_up_intent" text NOT NULL,
	"additional_comments" text,
	"base_ebitda" numeric(15, 2),
	"adjusted_ebitda" numeric(15, 2),
	"valuation_multiple" numeric(8, 2),
	"low_estimate" numeric(15, 2),
	"mid_estimate" numeric(15, 2),
	"high_estimate" numeric(15, 2),
	"overall_score" text,
	"narrative_summary" text,
	"executive_summary" text,
	"pdf_url" text,
	"is_processed" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "assessments" ADD CONSTRAINT "assessments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assessments" ADD CONSTRAINT "assessments_review_id_reviews_id_fk" FOREIGN KEY ("review_id") REFERENCES "public"."reviews"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "documents" ADD CONSTRAINT "documents_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "documents" ADD CONSTRAINT "documents_updated_by_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "goals" ADD CONSTRAINT "goals_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "goals" ADD CONSTRAINT "goals_assigned_by_users_id_fk" FOREIGN KEY ("assigned_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "goals" ADD CONSTRAINT "goals_review_id_reviews_id_fk" FOREIGN KEY ("review_id") REFERENCES "public"."reviews"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organization_branding" ADD CONSTRAINT "organization_branding_updated_by_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "review_templates" ADD CONSTRAINT "review_templates_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_employee_id_users_id_fk" FOREIGN KEY ("employee_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_manager_id_users_id_fk" FOREIGN KEY ("manager_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_template_id_review_templates_id_fk" FOREIGN KEY ("template_id") REFERENCES "public"."review_templates"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "valuation_assessments" ADD CONSTRAINT "valuation_assessments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "IDX_session_expire" ON "sessions" USING btree ("expire");