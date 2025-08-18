import { pgTable, text, varchar, serial, integer, decimal, timestamp, boolean, jsonb, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table for both Replit Auth and custom auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(), // Replit user ID or generated ID for custom users
  email: varchar("email").unique().notNull(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  fullName: varchar("full_name"), // For custom registrations
  profileImageUrl: varchar("profile_image_url"),
  passwordHash: varchar("password_hash"), // For custom auth users (null for Replit users)
  authProvider: text("auth_provider").notNull().default("custom"), // "replit" or "custom"
  replitUserId: varchar("replit_user_id"), // Original Replit ID if auth provider is replit
  tier: text("tier").notNull().default("free"), // "free", "growth", "capital"
  ghlContactId: text("ghl_contact_id"),
  resultReady: boolean("result_ready").default(false),
  awaitingPasswordCreation: boolean("awaiting_password_creation").default(false),
  isActive: boolean("is_active").default(true),
  emailVerified: boolean("email_verified").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const valuationAssessments = pgTable("valuation_assessments", {
  id: serial("id").primaryKey(),
  
  // Contact Information
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  company: text("company").notNull(),
  jobTitle: text("job_title"),
  foundingYear: integer("founding_year"),
  
  // Industry Classification (for paid tier)
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

// Dedicated leads table for CRM integration and lead tracking
export const leads = pgTable("leads", {
  id: serial("id").primaryKey(),
  
  // Basic Contact Information
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone"),
  company: text("company").notNull(),
  jobTitle: text("job_title"),
  
  // Lead Source and Classification
  leadSource: text("lead_source").default("valuation_form"), // "valuation_form", "calculator", "direct", etc.
  leadStatus: text("lead_status").default("new"), // "new", "contacted", "qualified", "converted", "closed"
  leadScore: integer("lead_score").default(0), // 0-100 scoring system
  
  // Business Information
  industry: text("industry"),
  companySize: text("company_size"), // "1-10", "11-50", "51-200", "200+"
  annualRevenue: decimal("annual_revenue", { precision: 12, scale: 2 }),
  
  // Assessment Results
  valuationAssessmentId: integer("valuation_assessment_id"),
  estimatedValue: decimal("estimated_value", { precision: 12, scale: 2 }),
  overallGrade: text("overall_grade"),
  followUpIntent: text("follow_up_intent"), // "yes", "maybe", "no"
  
  // CRM Integration
  crmId: text("crm_id"), // External CRM system ID
  lastCrmSync: timestamp("last_crm_sync"),
  crmSyncStatus: text("crm_sync_status").default("pending"), // "pending", "synced", "failed"
  
  // Engagement Tracking
  lastContactDate: timestamp("last_contact_date"),
  nextFollowUpDate: timestamp("next_follow_up_date"),
  totalInteractions: integer("total_interactions").default(0),
  emailsSent: integer("emails_sent").default(0),
  
  // Additional Data
  notes: text("notes"),
  tags: text("tags").array(), // For categorization and filtering
  
  // Timestamps
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Lead interactions/activities log
export const leadActivities = pgTable("lead_activities", {
  id: serial("id").primaryKey(),
  leadId: integer("lead_id").notNull(),
  
  activityType: text("activity_type").notNull(), // "assessment_completed", "email_sent", "call_made", "meeting_scheduled", etc.
  activityData: text("activity_data"), // JSON string for additional data
  description: text("description"),
  metadata: jsonb("metadata"), // Additional structured data
  
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const leadsRelations = relations(leads, ({ one, many }) => ({
  valuationAssessment: one(valuationAssessments, {
    fields: [leads.valuationAssessmentId],
    references: [valuationAssessments.id],
  }),
  activities: many(leadActivities),
}));

export const leadActivitiesRelations = relations(leadActivities, ({ one }) => ({
  lead: one(leads, {
    fields: [leadActivities.leadId],
    references: [leads.id],
  }),
}));

export const valuationAssessmentsRelations = relations(valuationAssessments, ({ many }) => ({
  leads: many(leads),
}));

export const insertValuationAssessmentSchema = createInsertSchema(valuationAssessments).omit({
  id: true,
  baseEbitda: true,
  adjustedEbitda: true,
  valuationMultiple: true,
  lowEstimate: true,
  midEstimate: true,
  highEstimate: true,
  overallScore: true,
  narrativeSummary: true,
  executiveSummary: true,
  pdfUrl: true,
  isProcessed: true,
  createdAt: true,
});

export type InsertValuationAssessment = z.infer<typeof insertValuationAssessmentSchema>;
export type ValuationAssessment = typeof valuationAssessments.$inferSelect;

// Lead schemas
export const insertLeadSchema = createInsertSchema(leads).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertLeadActivitySchema = createInsertSchema(leadActivities).omit({
  id: true,
  createdAt: true,
});

export type InsertLead = z.infer<typeof insertLeadSchema>;
export type Lead = typeof leads.$inferSelect;
export type InsertLeadActivity = z.infer<typeof insertLeadActivitySchema>;
export type LeadActivity = typeof leadActivities.$inferSelect;

// Team management tables
export const teamMembers = pgTable("team_members", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  firstName: varchar("first_name", { length: 100 }).notNull(),
  lastName: varchar("last_name", { length: 100 }).notNull(),
  role: varchar("role", { length: 50 }).notNull().default("member"), // admin, manager, member
  hashedPassword: varchar("hashed_password", { length: 255 }).notNull(),
  isActive: boolean("is_active").default(true),
  mustChangePassword: boolean("must_change_password").default(true),
  lastLoginAt: timestamp("last_login_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const teamSessions = pgTable("team_sessions", {
  id: varchar("id", { length: 128 }).primaryKey(),
  teamMemberId: integer("team_member_id").references(() => teamMembers.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const teamMembersRelations = relations(teamMembers, ({ many }) => ({
  sessions: many(teamSessions),
}));

export const teamSessionsRelations = relations(teamSessions, ({ one }) => ({
  teamMember: one(teamMembers, {
    fields: [teamSessions.teamMemberId],
    references: [teamMembers.id],
  }),
}));

// Schema types
export const insertTeamMemberSchema = createInsertSchema(teamMembers).omit({
  id: true,
  hashedPassword: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const createPasswordSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export type InsertTeamMember = z.infer<typeof insertTeamMemberSchema>;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type UpsertUser = typeof users.$inferInsert;
export type TeamMember = typeof teamMembers.$inferSelect;
export type TeamSession = typeof teamSessions.$inferSelect;
export type User = typeof users.$inferSelect;
export type LoginCredentials = z.infer<typeof loginSchema>;

// Custom user registration/login schemas
export const registerUserSchema = createInsertSchema(users).pick({
  firstName: true,
  lastName: true,
  email: true,
}).extend({
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
});

export const loginUserSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export type RegisterUser = z.infer<typeof registerUserSchema>;
export type LoginUser = z.infer<typeof loginUserSchema>;
export type CreatePasswordData = z.infer<typeof createPasswordSchema>;

// Form step schemas for validation
export const contactInfoSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(1, "Phone number is required"),
  company: z.string().min(1, "Company name is required"),
  jobTitle: z.string().optional(),
});

export const ebitdaSchema = z.object({
  netIncome: z.string().optional().default("0"),
  interest: z.string().optional().default("0"),
  taxes: z.string().optional().default("0"),
  depreciation: z.string().optional().default("0"),
  amortization: z.string().optional().default("0"),
  adjustmentNotes: z.string().optional(),
});

export const adjustmentsSchema = z.object({
  ownerSalary: z.string().optional(),
  personalExpenses: z.string().optional(),
  oneTimeExpenses: z.string().optional(),
  otherAdjustments: z.string().optional(),
  adjustmentNotes: z.string().optional(),
});

export const valueDriversSchema = z.object({
  financialPerformance: z.enum(["A", "B", "C", "D", "F"]),
  customerConcentration: z.enum(["A", "B", "C", "D", "F"]),
  managementTeam: z.enum(["A", "B", "C", "D", "F"]),
  competitivePosition: z.enum(["A", "B", "C", "D", "F"]),
  growthProspects: z.enum(["A", "B", "C", "D", "F"]),
  systemsProcesses: z.enum(["A", "B", "C", "D", "F"]),
  assetQuality: z.enum(["A", "B", "C", "D", "F"]),
  industryOutlook: z.enum(["A", "B", "C", "D", "F"]),
  riskFactors: z.enum(["A", "B", "C", "D", "F"]),
  ownerDependency: z.enum(["A", "B", "C", "D", "F"]),
});

export const followUpSchema = z.object({
  followUpIntent: z.enum(["yes", "maybe", "no"]),
  additionalComments: z.string().optional(),
});

export type ContactInfo = z.infer<typeof contactInfoSchema>;
export type EbitdaData = z.infer<typeof ebitdaSchema>;
export type AdjustmentsData = z.infer<typeof adjustmentsSchema>;
export type ValueDriversData = z.infer<typeof valueDriversSchema>;
export type FollowUpData = z.infer<typeof followUpSchema>;
