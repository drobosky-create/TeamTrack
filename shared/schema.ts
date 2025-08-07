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
