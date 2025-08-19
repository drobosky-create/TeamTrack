import { sql } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  integer,
  boolean,
  pgEnum,
  serial,
  decimal,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Session storage table (required for Replit Auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// UI Tokens table for centralized theme management
export const uiTokens = pgTable("ui_tokens", {
  id: serial("id").primaryKey(),
  key: text("key").unique().notNull(),
  value: text("value").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

// Enums
export const userRoleEnum = pgEnum('user_role', ['admin', 'manager', 'team_member']);
export const reviewTypeEnum = pgEnum('review_type', ['monthly', 'quarterly', 'annual']);
export const reviewStatusEnum = pgEnum('review_status', ['not_started', 'in_progress', 'complete', 'overdue']);
export const employmentTypeEnum = pgEnum('employment_type', ['employee', 'contractor']);

// Goals enums
export const goalCategoryEnum = pgEnum('goal_category', ['performance', 'development', 'leadership', 'technical', 'business', 'personal']);
export const goalPriorityEnum = pgEnum('goal_priority', ['low', 'medium', 'high', 'critical']);
export const goalStatusEnum = pgEnum('goal_status', ['draft', 'active', 'on-track', 'at-risk', 'behind', 'completed', 'cancelled']);

// Documents enums  
export const documentTypeEnum = pgEnum('document_type', ['policy', 'agreement', 'guide', 'form', 'template']);
export const documentStatusEnum = pgEnum('document_status', ['draft', 'final', 'archived']);

// Branding enums
export const brandingElementEnum = pgEnum('branding_element', ['logo', 'favicon', 'banner']);

// Assessment enums
export const assessmentTierEnum = pgEnum('assessment_tier', ['free', 'growth', 'capital']);
export const gradeEnum = pgEnum('grade', ['A', 'B', 'C', 'D', 'F']);

// Users table (required for Replit Auth)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: userRoleEnum("role").default('team_member').notNull(),
  department: varchar("department"),
  managerId: varchar("manager_id"),
  employmentType: employmentTypeEnum("employment_type").default('employee'),
  reviewCadence: reviewTypeEnum("review_cadence").default('quarterly'),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Review templates
export const reviewTemplates = pgTable("review_templates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  reviewType: reviewTypeEnum("review_type").notNull(),
  templateType: varchar("template_type").default('standard').notNull(), // 'standard' or 'structured'
  categories: jsonb("categories").notNull(), // Array of category names
  instructions: text("instructions"),
  // Structured template fields (customizable for any organization)
  coreValues: jsonb("core_values"), // Array of company/organization values
  competencies: jsonb("competencies"), // Array of competencies
  sections: jsonb("sections"), // Structured template sections
  isActive: boolean("is_active").default(true),
  createdBy: varchar("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Reviews
export const reviews = pgTable("reviews", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  employeeId: varchar("employee_id").references(() => users.id).notNull(),
  managerId: varchar("manager_id").references(() => users.id).notNull(),
  templateId: varchar("template_id").references(() => reviewTemplates.id).notNull(),
  reviewType: reviewTypeEnum("review_type").notNull(),
  dueDate: timestamp("due_date").notNull(),
  status: reviewStatusEnum("status").default('not_started').notNull(),
  selfReviewNotes: text("self_review_notes"),
  managerReviewNotes: text("manager_review_notes"),
  scores: jsonb("scores"), // Object with category scores
  requiresFollowUp: boolean("requires_follow_up").default(false),
  followUpNotes: text("follow_up_notes"),
  attachments: jsonb("attachments"), // Array of file paths
  // Army-specific fields
  strengths: jsonb("strengths"), // Array of strength entries
  areasForImprovement: jsonb("areas_for_improvement"), // Array of improvement areas
  planOfAction: jsonb("plan_of_action"), // Structured plan of action
  leaderResponsibilities: text("leader_responsibilities"),
  employeeComments: text("employee_comments"),
  employeeSignatureDate: timestamp("employee_signature_date"),
  raterSignatureDate: timestamp("rater_signature_date"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Goals
export const goals = pgTable("goals", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title").notNull(),
  description: text("description"),
  category: goalCategoryEnum("category").notNull(),
  priority: goalPriorityEnum("priority").default('medium').notNull(),
  status: goalStatusEnum("status").default('draft').notNull(),
  progress: integer("progress").default(0), // 0-100
  targetDate: timestamp("target_date").notNull(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  assignedBy: varchar("assigned_by").references(() => users.id),
  reviewId: varchar("review_id").references(() => reviews.id),
  autoCalculateProgress: boolean("auto_calculate_progress").default(false),
  milestones: jsonb("milestones"), // Array of milestones
  metrics: jsonb("metrics"), // Array of metrics
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Documents
export const documents = pgTable("documents", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title").notNull(),
  description: text("description"),
  type: documentTypeEnum("type").notNull(),
  status: documentStatusEnum("status").default('draft').notNull(),
  content: text("content"), // For built documents
  filePath: varchar("file_path"), // For uploaded documents
  fileName: varchar("file_name"),
  fileSize: integer("file_size"),
  mimeType: varchar("mime_type"),
  createdBy: varchar("created_by").references(() => users.id).notNull(),
  updatedBy: varchar("updated_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Notifications
export const notifications = pgTable("notifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  title: varchar("title").notNull(),
  message: text("message").notNull(),
  type: varchar("type").default('info'), // info, success, warning, error
  isRead: boolean("is_read").default(false),
  actionUrl: varchar("action_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Organization branding and customization
export const organizationBranding = pgTable("organization_branding", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  // Organization details
  organizationName: varchar("organization_name").notNull().default('PerformanceHub'),
  organizationTagline: varchar("organization_tagline"),
  // Logo and visual assets
  logoUrl: varchar("logo_url"),
  faviconUrl: varchar("favicon_url"),
  bannerUrl: varchar("banner_url"),
  // Color scheme
  primaryColor: varchar("primary_color").default('#3b82f6'), // Blue
  secondaryColor: varchar("secondary_color").default('#64748b'), // Slate
  accentColor: varchar("accent_color").default('#10b981'), // Emerald
  backgroundColor: varchar("background_color").default('#ffffff'), // White
  textColor: varchar("text_color").default('#1f2937'), // Gray-800
  // Typography
  primaryFont: varchar("primary_font").default('Inter'),
  headingFont: varchar("heading_font").default('Inter'),
  // Layout preferences
  sidebarColor: varchar("sidebar_color").default('#f8fafc'), // Gray-50
  headerColor: varchar("header_color").default('#ffffff'), // White
  cardColor: varchar("card_color").default('#ffffff'), // White
  // Footer customization
  footerText: text("footer_text"),
  footerLinks: jsonb("footer_links"), // Array of {label, url} objects
  // Contact information
  supportEmail: varchar("support_email"),
  supportPhone: varchar("support_phone"),
  websiteUrl: varchar("website_url"),
  // Advanced customization
  customCss: text("custom_css"),
  customJs: text("custom_js"),
  // Metadata
  isActive: boolean("is_active").default(true),
  updatedBy: varchar("updated_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Assessment table (integrated from AppleBites for advanced evaluations)
export const assessments = pgTable("assessments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  reviewId: varchar("review_id").references(() => reviews.id),
  assessmentType: varchar("assessment_type").default('performance').notNull(), // 'performance', 'strategic', 'development'
  
  // Core Performance Areas (adapted from AppleBites value drivers)
  financialPerformance: text("financial_performance"), // Revenue, budget management
  customerConcentration: text("customer_concentration"), // Customer relations, satisfaction
  managementTeam: text("management_team"), // Leadership, team management
  competitivePosition: text("competitive_position"), // Innovation, market position
  growthProspects: text("growth_prospects"), // Goal achievement, growth mindset
  systemsProcesses: text("systems_processes"), // Process optimization, efficiency
  assetQuality: text("asset_quality"), // Work quality, standards
  industryOutlook: text("industry_outlook"), // Industry knowledge, awareness
  riskFactors: text("risk_factors"), // Risk management, compliance
  ownerDependency: text("owner_dependency"), // Independence, initiative
  
  // Overall Assessment
  overallScore: text("overall_score"), // A-F grade
  tier: assessmentTierEnum("tier").default('free').notNull(),
  narrativeSummary: text("narrative_summary"),
  executiveSummary: text("executive_summary"),
  
  // Processing and Status
  isProcessed: boolean("is_processed").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// AppleBites Valuation Assessment Table for business valuation integration
export const valuationAssessments = pgTable("valuation_assessments", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id),
  
  // Contact Information
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  company: text("company").notNull(),
  jobTitle: text("job_title"),
  foundingYear: integer("founding_year"),
  
  // Industry Classification
  naicsCode: text("naics_code"),
  sicCode: text("sic_code"),
  industryDescription: text("industry_description"),
  
  // Tier Information
  tier: text("tier").default("free"), // "free", "growth", "capital"
  reportTier: text("report_tier").notNull().default("free"), // "free" or "paid"
  paymentStatus: text("payment_status").default("pending"), // "pending", "completed", "failed"
  stripePaymentId: text("stripe_payment_id"),
  
  // EBITDA Components
  netIncome: decimal("net_income", { precision: 15, scale: 2 }).notNull(),
  interest: decimal("interest", { precision: 15, scale: 2 }).notNull(),
  taxes: decimal("taxes", { precision: 15, scale: 2 }).notNull(),
  depreciation: decimal("depreciation", { precision: 15, scale: 2 }).notNull(),
  amortization: decimal("amortization", { precision: 15, scale: 2 }).notNull(),
  
  // Owner Adjustments
  ownerSalary: decimal("owner_salary", { precision: 15, scale: 2 }).default("0"),
  personalExpenses: decimal("personal_expenses", { precision: 15, scale: 2 }).default("0"),
  oneTimeExpenses: decimal("one_time_expenses", { precision: 15, scale: 2 }).default("0"),
  otherAdjustments: decimal("other_adjustments", { precision: 15, scale: 2 }).default("0"),
  adjustmentNotes: text("adjustment_notes"),
  
  // Value Driver Scores (A-F grades)
  financialPerformance: text("financial_performance").notNull(),
  customerConcentration: text("customer_concentration").notNull(),
  managementTeam: text("management_team").notNull(),
  competitivePosition: text("competitive_position").notNull(),
  growthProspects: text("growth_prospects").notNull(),
  systemsProcesses: text("systems_processes").notNull(),
  assetQuality: text("asset_quality").notNull(),
  industryOutlook: text("industry_outlook").notNull(),
  riskFactors: text("risk_factors").notNull(),
  ownerDependency: text("owner_dependency").notNull(),
  
  // Follow-up and Results
  followUpIntent: text("follow_up_intent").notNull(), // "yes", "maybe", "no"
  additionalComments: text("additional_comments"),
  
  // Calculated Values
  baseEbitda: decimal("base_ebitda", { precision: 15, scale: 2 }),
  adjustedEbitda: decimal("adjusted_ebitda", { precision: 15, scale: 2 }),
  valuationMultiple: decimal("valuation_multiple", { precision: 8, scale: 2 }),
  lowEstimate: decimal("low_estimate", { precision: 15, scale: 2 }),
  midEstimate: decimal("mid_estimate", { precision: 15, scale: 2 }),
  highEstimate: decimal("high_estimate", { precision: 15, scale: 2 }),
  overallScore: text("overall_score"),
  
  // Generated Content
  narrativeSummary: text("narrative_summary"),
  executiveSummary: text("executive_summary"),
  pdfUrl: text("pdf_url"),
  
  // Processing Status
  isProcessed: boolean("is_processed").default(false),
  
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ one, many }) => ({
  manager: one(users, {
    fields: [users.managerId],
    references: [users.id],
    relationName: "manager_reports"
  }),
  directReports: many(users, { relationName: "manager_reports" }),
  employeeReviews: many(reviews, { relationName: "employee_reviews" }),
  managerReviews: many(reviews, { relationName: "manager_reviews" }),
  createdTemplates: many(reviewTemplates),
  goals: many(goals, { relationName: "user_goals" }),
  assignedGoals: many(goals, { relationName: "assigned_goals" }),
  createdDocuments: many(documents, { relationName: "created_documents" }),
  updatedDocuments: many(documents, { relationName: "updated_documents" }),
  notifications: many(notifications),
}));

export const reviewTemplatesRelations = relations(reviewTemplates, ({ one, many }) => ({
  createdBy: one(users, {
    fields: [reviewTemplates.createdBy],
    references: [users.id],
  }),
  reviews: many(reviews),
}));

export const reviewsRelations = relations(reviews, ({ one, many }) => ({
  employee: one(users, {
    fields: [reviews.employeeId],
    references: [users.id],
    relationName: "employee_reviews"
  }),
  manager: one(users, {
    fields: [reviews.managerId],
    references: [users.id],
    relationName: "manager_reviews"
  }),
  template: one(reviewTemplates, {
    fields: [reviews.templateId],
    references: [reviewTemplates.id],
  }),
  goals: many(goals),
}));

export const goalsRelations = relations(goals, ({ one }) => ({
  user: one(users, {
    fields: [goals.userId],
    references: [users.id],
    relationName: "user_goals"
  }),
  assignedBy: one(users, {
    fields: [goals.assignedBy],
    references: [users.id],
    relationName: "assigned_goals"
  }),
  review: one(reviews, {
    fields: [goals.reviewId],
    references: [reviews.id],
  }),
}));

export const documentsRelations = relations(documents, ({ one }) => ({
  createdBy: one(users, {
    fields: [documents.createdBy],
    references: [users.id],
    relationName: "created_documents"
  }),
  updatedBy: one(users, {
    fields: [documents.updatedBy],
    references: [users.id],
    relationName: "updated_documents"
  }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
}));

export const organizationBrandingRelations = relations(organizationBranding, ({ one }) => ({
  updatedBy: one(users, {
    fields: [organizationBranding.updatedBy],
    references: [users.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const upsertUserSchema = createInsertSchema(users).pick({
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  profileImageUrl: true,
});

export const insertReviewTemplateSchema = createInsertSchema(reviewTemplates).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertReviewSchema = createInsertSchema(reviews).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateReviewSchema = createInsertSchema(reviews).partial().omit({
  id: true,
  createdAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type UpsertUser = z.infer<typeof upsertUserSchema>;

export type ReviewTemplate = typeof reviewTemplates.$inferSelect;
export type InsertReviewTemplate = z.infer<typeof insertReviewTemplateSchema>;

export type Review = typeof reviews.$inferSelect;
export type InsertReview = z.infer<typeof insertReviewSchema>;
export type UpdateReview = z.infer<typeof updateReviewSchema>;

// Goals schemas
export const insertGoalSchema = createInsertSchema(goals);
export const updateGoalSchema = insertGoalSchema.partial();

export type Goal = typeof goals.$inferSelect;
export type InsertGoal = z.infer<typeof insertGoalSchema>;
export type UpdateGoal = z.infer<typeof updateGoalSchema>;

// Documents schemas
export const insertDocumentSchema = createInsertSchema(documents);
export const updateDocumentSchema = insertDocumentSchema.partial();

export type Document = typeof documents.$inferSelect;
export type InsertDocument = z.infer<typeof insertDocumentSchema>;
export type UpdateDocument = z.infer<typeof updateDocumentSchema>;

// Notifications schemas
export const insertNotificationSchema = createInsertSchema(notifications);

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;

// UI Tokens schemas
export const insertUiTokenSchema = createInsertSchema(uiTokens).omit({
  id: true,
  updatedAt: true,
});
export const updateUiTokenSchema = insertUiTokenSchema.partial();

export type UiToken = typeof uiTokens.$inferSelect;
export type InsertUiToken = z.infer<typeof insertUiTokenSchema>;
export type UpdateUiToken = z.infer<typeof updateUiTokenSchema>;

// Organization branding schemas
export const insertOrganizationBrandingSchema = createInsertSchema(organizationBranding).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export const updateOrganizationBrandingSchema = insertOrganizationBrandingSchema.partial();

export type OrganizationBranding = typeof organizationBranding.$inferSelect;
export type InsertOrganizationBranding = z.infer<typeof insertOrganizationBrandingSchema>;
export type UpdateOrganizationBranding = z.infer<typeof updateOrganizationBrandingSchema>;

export type UserRole = 'admin' | 'manager' | 'team_member';
export type ReviewType = 'monthly' | 'quarterly' | 'annual';
export type ReviewStatus = 'not_started' | 'in_progress' | 'complete' | 'overdue';
export type EmploymentType = 'employee' | 'contractor';

// Goals types
export type GoalCategory = 'performance' | 'development' | 'leadership' | 'technical' | 'business' | 'personal';
export type GoalPriority = 'low' | 'medium' | 'high' | 'critical';
export type GoalStatus = 'draft' | 'active' | 'on-track' | 'at-risk' | 'behind' | 'completed' | 'cancelled';

// Documents types
export type DocumentType = 'policy' | 'agreement' | 'guide' | 'form' | 'template';
export type DocumentStatus = 'draft' | 'final' | 'archived';

// Assessment schemas (AppleBites integration)
export const insertAssessmentSchema = createInsertSchema(assessments).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export const updateAssessmentSchema = insertAssessmentSchema.partial();

export type Assessment = typeof assessments.$inferSelect;
export type InsertAssessment = z.infer<typeof insertAssessmentSchema>;
export type UpdateAssessment = z.infer<typeof updateAssessmentSchema>;

// Valuation Assessment schemas (AppleBites integration)
export const insertValuationAssessmentSchema = createInsertSchema(valuationAssessments).omit({
  id: true,
  createdAt: true,
});

export type ValuationAssessment = typeof valuationAssessments.$inferSelect;
export type InsertValuationAssessment = z.infer<typeof insertValuationAssessmentSchema>;

// Assessment Tier types
export type AssessmentTier = 'free' | 'growth' | 'capital';
