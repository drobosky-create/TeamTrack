import {
  users,
  reviews,
  reviewTemplates,
  goals,
  type User,
  type UpsertUser,
  type InsertUser,
  type Review,
  type InsertReview,
  type UpdateReview,
  type ReviewTemplate,
  type InsertReviewTemplate,
  type Goal,
  type InsertGoal,
  type UpdateGoal,
  type UserRole,
  type ReviewStatus,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, or, desc, asc, count, avg, sql } from "drizzle-orm";

export interface IStorage {
  // User operations (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Additional user operations
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<InsertUser>): Promise<User | undefined>;
  getUsersByRole(role: UserRole): Promise<User[]>;
  getUsersUnderManager(managerId: string): Promise<User[]>;
  getAllUsers(): Promise<User[]>;
  
  // Review operations
  createReview(review: InsertReview): Promise<Review>;
  getReview(id: string): Promise<Review | undefined>;
  getReviewsForUser(userId: string, role: UserRole): Promise<Review[]>;
  updateReview(id: string, updates: UpdateReview): Promise<Review | undefined>;
  getOverdueReviews(): Promise<Review[]>;
  getReviewsByStatus(status: ReviewStatus): Promise<Review[]>;
  getRecentReviews(limit?: number): Promise<(Review & { employee: User; manager: User; template: ReviewTemplate })[]>;
  getUpcomingReviews(limit?: number): Promise<(Review & { employee: User; manager: User; template: ReviewTemplate })[]>;
  
  // Template operations
  createTemplate(template: InsertReviewTemplate): Promise<ReviewTemplate>;
  getTemplate(id: string): Promise<ReviewTemplate | undefined>;
  getAllTemplates(): Promise<ReviewTemplate[]>;
  updateTemplate(id: string, updates: Partial<InsertReviewTemplate>): Promise<ReviewTemplate | undefined>;
  
  // Goals operations
  createGoal(goal: InsertGoal): Promise<Goal>;
  getGoal(id: string): Promise<Goal | undefined>;
  getGoalsForUser(userId: string, role: UserRole): Promise<Goal[]>;
  updateGoal(id: string, updates: UpdateGoal): Promise<Goal | undefined>;
  deleteGoal(id: string): Promise<void>;
  
  // Dashboard metrics
  getDashboardMetrics(): Promise<{
    totalTeamMembers: number;
    pendingReviews: number;
    overdueReviews: number;
    averageScore: number;
    completedThisMonth: number;
  }>;
}

export class DatabaseStorage implements IStorage {
  // User operations (required for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Additional user operations
  async createUser(user: InsertUser): Promise<User> {
    const [newUser] = await db.insert(users).values(user).returning();
    return newUser;
  }

  async updateUser(id: string, updates: Partial<InsertUser>): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async getUsersByRole(role: UserRole): Promise<User[]> {
    return await db.select().from(users).where(eq(users.role, role));
  }

  async getUsersUnderManager(managerId: string): Promise<User[]> {
    return await db.select().from(users).where(eq(users.managerId, managerId));
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users).orderBy(asc(users.firstName), asc(users.lastName));
  }

  // Review operations
  async createReview(review: InsertReview): Promise<Review> {
    const [newReview] = await db.insert(reviews).values(review).returning();
    return newReview;
  }

  async getReview(id: string): Promise<Review | undefined> {
    const [review] = await db.select().from(reviews).where(eq(reviews.id, id));
    return review;
  }

  async getReviewsForUser(userId: string, role: UserRole): Promise<Review[]> {
    if (role === 'admin') {
      return await db.select().from(reviews).orderBy(desc(reviews.createdAt));
    } else if (role === 'manager') {
      return await db.select().from(reviews)
        .where(or(eq(reviews.managerId, userId), eq(reviews.employeeId, userId)))
        .orderBy(desc(reviews.createdAt));
    } else {
      return await db.select().from(reviews)
        .where(eq(reviews.employeeId, userId))
        .orderBy(desc(reviews.createdAt));
    }
  }

  async updateReview(id: string, updates: UpdateReview): Promise<Review | undefined> {
    const [review] = await db
      .update(reviews)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(reviews.id, id))
      .returning();
    return review;
  }

  async getOverdueReviews(): Promise<Review[]> {
    return await db.select().from(reviews)
      .where(and(
        eq(reviews.status, 'not_started'),
        sql`${reviews.dueDate} < NOW()`
      ))
      .orderBy(asc(reviews.dueDate));
  }

  async getReviewsByStatus(status: ReviewStatus): Promise<Review[]> {
    return await db.select().from(reviews)
      .where(eq(reviews.status, status))
      .orderBy(desc(reviews.createdAt));
  }

  async getRecentReviews(limit: number = 10): Promise<(Review & { employee: User; manager: User; template: ReviewTemplate })[]> {
    return await db.select({
      id: reviews.id,
      employeeId: reviews.employeeId,
      managerId: reviews.managerId,
      templateId: reviews.templateId,
      reviewType: reviews.reviewType,
      dueDate: reviews.dueDate,
      status: reviews.status,
      selfReviewNotes: reviews.selfReviewNotes,
      managerReviewNotes: reviews.managerReviewNotes,
      scores: reviews.scores,
      requiresFollowUp: reviews.requiresFollowUp,
      followUpNotes: reviews.followUpNotes,
      attachments: reviews.attachments,
      completedAt: reviews.completedAt,
      createdAt: reviews.createdAt,
      updatedAt: reviews.updatedAt,
      employee: users,
      manager: {
        id: sql`manager.id`,
        email: sql`manager.email`,
        firstName: sql`manager.first_name`,
        lastName: sql`manager.last_name`,
        profileImageUrl: sql`manager.profile_image_url`,
        role: sql`manager.role`,
        department: sql`manager.department`,
        managerId: sql`manager.manager_id`,
        employmentType: sql`manager.employment_type`,
        reviewCadence: sql`manager.review_cadence`,
        createdAt: sql`manager.created_at`,
        updatedAt: sql`manager.updated_at`,
      },
      template: reviewTemplates,
    })
    .from(reviews)
    .leftJoin(users, eq(reviews.employeeId, users.id))
    .leftJoin(sql`users manager`, sql`${reviews.managerId} = manager.id`)
    .leftJoin(reviewTemplates, eq(reviews.templateId, reviewTemplates.id))
    .orderBy(desc(reviews.updatedAt))
    .limit(limit) as any;
  }

  async getUpcomingReviews(limit: number = 10): Promise<(Review & { employee: User; manager: User; template: ReviewTemplate })[]> {
    return await db.select({
      id: reviews.id,
      employeeId: reviews.employeeId,
      managerId: reviews.managerId,
      templateId: reviews.templateId,
      reviewType: reviews.reviewType,
      dueDate: reviews.dueDate,
      status: reviews.status,
      selfReviewNotes: reviews.selfReviewNotes,
      managerReviewNotes: reviews.managerReviewNotes,
      scores: reviews.scores,
      requiresFollowUp: reviews.requiresFollowUp,
      followUpNotes: reviews.followUpNotes,
      attachments: reviews.attachments,
      completedAt: reviews.completedAt,
      createdAt: reviews.createdAt,
      updatedAt: reviews.updatedAt,
      employee: users,
      manager: {
        id: sql`manager.id`,
        email: sql`manager.email`,
        firstName: sql`manager.first_name`,
        lastName: sql`manager.last_name`,
        profileImageUrl: sql`manager.profile_image_url`,
        role: sql`manager.role`,
        department: sql`manager.department`,
        managerId: sql`manager.manager_id`,
        employmentType: sql`manager.employment_type`,
        reviewCadence: sql`manager.review_cadence`,
        createdAt: sql`manager.created_at`,
        updatedAt: sql`manager.updated_at`,
      },
      template: reviewTemplates,
    })
    .from(reviews)
    .leftJoin(users, eq(reviews.employeeId, users.id))
    .leftJoin(sql`users manager`, sql`${reviews.managerId} = manager.id`)
    .leftJoin(reviewTemplates, eq(reviews.templateId, reviewTemplates.id))
    .where(sql`${reviews.dueDate} >= NOW()`)
    .orderBy(asc(reviews.dueDate))
    .limit(limit) as any;
  }

  // Template operations
  async createTemplate(template: InsertReviewTemplate): Promise<ReviewTemplate> {
    const [newTemplate] = await db.insert(reviewTemplates).values(template).returning();
    return newTemplate;
  }

  async getTemplate(id: string): Promise<ReviewTemplate | undefined> {
    const [template] = await db.select().from(reviewTemplates).where(eq(reviewTemplates.id, id));
    return template;
  }

  async getAllTemplates(): Promise<ReviewTemplate[]> {
    return await db.select().from(reviewTemplates)
      .where(eq(reviewTemplates.isActive, true))
      .orderBy(asc(reviewTemplates.name));
  }

  async updateTemplate(id: string, updates: Partial<InsertReviewTemplate>): Promise<ReviewTemplate | undefined> {
    const [template] = await db
      .update(reviewTemplates)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(reviewTemplates.id, id))
      .returning();
    return template;
  }

  // Goals operations
  async createGoal(goalData: InsertGoal): Promise<Goal> {
    const [goal] = await db
      .insert(goals)
      .values(goalData)
      .returning();
    return goal;
  }

  async getGoal(id: string): Promise<Goal | undefined> {
    const [goal] = await db.select().from(goals).where(eq(goals.id, id));
    return goal;
  }

  async getGoalsForUser(userId: string, role: UserRole): Promise<Goal[]> {
    if (role === 'admin') {
      // Admin can see all goals
      return await db.select().from(goals).orderBy(desc(goals.createdAt));
    } else if (role === 'manager') {
      // Manager can see their own goals and their team's goals
      const managedUsers = await this.getUsersUnderManager(userId);
      const managedUserIds = managedUsers.map(u => u.id);
      const allUserIds = [userId, ...managedUserIds];
      
      return await db.select()
        .from(goals)
        .where(or(...allUserIds.map(id => eq(goals.userId, id))))
        .orderBy(desc(goals.createdAt));
    } else {
      // Team member can only see their own goals
      return await db.select()
        .from(goals)
        .where(eq(goals.userId, userId))
        .orderBy(desc(goals.createdAt));
    }
  }

  async updateGoal(id: string, updates: UpdateGoal): Promise<Goal | undefined> {
    const [goal] = await db
      .update(goals)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(goals.id, id))
      .returning();
    return goal;
  }

  async deleteGoal(id: string): Promise<void> {
    await db.delete(goals).where(eq(goals.id, id));
  }

  // Dashboard metrics
  async getDashboardMetrics(): Promise<{
    totalTeamMembers: number;
    pendingReviews: number;
    overdueReviews: number;
    averageScore: number;
    completedThisMonth: number;
  }> {
    // Total team members
    const [{ count: totalTeamMembers }] = await db
      .select({ count: count() })
      .from(users);

    // Pending reviews
    const [{ count: pendingReviews }] = await db
      .select({ count: count() })
      .from(reviews)
      .where(eq(reviews.status, 'in_progress'));

    // Overdue reviews
    const [{ count: overdueReviews }] = await db
      .select({ count: count() })
      .from(reviews)
      .where(and(
        eq(reviews.status, 'not_started'),
        sql`${reviews.dueDate} < NOW()`
      ));

    // Completed this month
    const [{ count: completedThisMonth }] = await db
      .select({ count: count() })
      .from(reviews)
      .where(and(
        eq(reviews.status, 'complete'),
        sql`${reviews.completedAt} >= date_trunc('month', CURRENT_DATE)`
      ));

    // Average score (simplified - would need to parse JSON scores in real implementation)
    const averageScore = 4.2; // Placeholder for complex JSON aggregation

    return {
      totalTeamMembers,
      pendingReviews,
      overdueReviews,
      averageScore,
      completedThisMonth,
    };
  }
}

export const storage = new DatabaseStorage();
