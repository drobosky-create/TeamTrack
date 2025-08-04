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
  categories: jsonb("categories").notNull(), // Array of category names
  instructions: text("instructions"),
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
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
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
}));

export const reviewTemplatesRelations = relations(reviewTemplates, ({ one, many }) => ({
  createdBy: one(users, {
    fields: [reviewTemplates.createdBy],
    references: [users.id],
  }),
  reviews: many(reviews),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
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

export type UserRole = 'admin' | 'manager' | 'team_member';
export type ReviewType = 'monthly' | 'quarterly' | 'annual';
export type ReviewStatus = 'not_started' | 'in_progress' | 'complete' | 'overdue';
export type EmploymentType = 'employee' | 'contractor';
