import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { 
  insertUserSchema, 
  insertReviewSchema, 
  updateReviewSchema, 
  insertReviewTemplateSchema,
  insertOrganizationBrandingSchema,
  updateOrganizationBrandingSchema,
  insertAssessmentSchema,
  insertValuationAssessmentSchema,
  type UserRole 
} from "@shared/schema";
import * as schema from "@shared/schema";
import { ZodError } from "zod";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Dashboard metrics
  app.get('/api/dashboard/metrics', isAuthenticated, async (req, res) => {
    try {
      const metrics = await storage.getDashboardMetrics();
      res.json(metrics);
    } catch (error) {
      console.error("Error fetching dashboard metrics:", error);
      res.status(500).json({ message: "Failed to fetch metrics" });
    }
  });

  app.get('/api/dashboard/recent-reviews', isAuthenticated, async (req, res) => {
    try {
      const recentReviews = await storage.getRecentReviews(5);
      res.json(recentReviews);
    } catch (error) {
      console.error("Error fetching recent reviews:", error);
      res.status(500).json({ message: "Failed to fetch recent reviews" });
    }
  });

  app.get('/api/dashboard/upcoming-reviews', isAuthenticated, async (req, res) => {
    try {
      const upcomingReviews = await storage.getUpcomingReviews(10);
      res.json(upcomingReviews);
    } catch (error) {
      console.error("Error fetching upcoming reviews:", error);
      res.status(500).json({ message: "Failed to fetch upcoming reviews" });
    }
  });

  // User management routes
  app.get('/api/users', isAuthenticated, async (req: any, res) => {
    try {
      const currentUser = await storage.getUser(req.user.claims.sub);
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }

      let users;
      if (currentUser.role === 'admin') {
        users = await storage.getAllUsers();
      } else if (currentUser.role === 'manager') {
        users = await storage.getUsersUnderManager(currentUser.id);
      } else if (currentUser.role === 'team_member') {
        // Team members can view all users but with limited information
        users = await storage.getAllUsers();
      } else {
        return res.status(403).json({ message: "Insufficient permissions" });
      }

      res.json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  app.post('/api/users', isAuthenticated, async (req: any, res) => {
    try {
      const currentUser = await storage.getUser(req.user.claims.sub);
      if (currentUser?.role !== 'admin') {
        return res.status(403).json({ message: "Only admins can create users" });
      }

      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      res.status(201).json(user);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: "Invalid user data", errors: error.errors });
      }
      console.error("Error creating user:", error);
      res.status(500).json({ message: "Failed to create user" });
    }
  });

  app.put('/api/users/:id', isAuthenticated, async (req: any, res) => {
    try {
      const currentUser = await storage.getUser(req.user.claims.sub);
      if (currentUser?.role !== 'admin') {
        return res.status(403).json({ message: "Only admins can update users" });
      }

      const userData = insertUserSchema.partial().parse(req.body);
      const user = await storage.updateUser(req.params.id, userData);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json(user);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: "Invalid user data", errors: error.errors });
      }
      console.error("Error updating user:", error);
      res.status(500).json({ message: "Failed to update user" });
    }
  });

  // Review routes
  app.get('/api/reviews', isAuthenticated, async (req: any, res) => {
    try {
      const currentUser = await storage.getUser(req.user.claims.sub);
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }

      const reviews = await storage.getReviewsForUser(currentUser.id, currentUser.role);
      res.json(reviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      res.status(500).json({ message: "Failed to fetch reviews" });
    }
  });

  app.post('/api/reviews', isAuthenticated, async (req: any, res) => {
    try {
      const currentUser = await storage.getUser(req.user.claims.sub);
      if (currentUser?.role === 'team_member') {
        return res.status(403).json({ message: "Team members cannot create reviews" });
      }

      const reviewData = insertReviewSchema.parse(req.body);
      const review = await storage.createReview(reviewData);
      res.status(201).json(review);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: "Invalid review data", errors: error.errors });
      }
      console.error("Error creating review:", error);
      res.status(500).json({ message: "Failed to create review" });
    }
  });

  app.get('/api/reviews/:id', isAuthenticated, async (req: any, res) => {
    try {
      const review = await storage.getReview(req.params.id);
      if (!review) {
        return res.status(404).json({ message: "Review not found" });
      }

      const currentUser = await storage.getUser(req.user.claims.sub);
      
      // Check permissions
      if (currentUser?.role !== 'admin' && 
          currentUser?.id !== review.employeeId && 
          currentUser?.id !== review.managerId) {
        return res.status(403).json({ message: "Access denied" });
      }

      res.json(review);
    } catch (error) {
      console.error("Error fetching review:", error);
      res.status(500).json({ message: "Failed to fetch review" });
    }
  });

  app.put('/api/reviews/:id', isAuthenticated, async (req: any, res) => {
    try {
      const review = await storage.getReview(req.params.id);
      if (!review) {
        return res.status(404).json({ message: "Review not found" });
      }

      const currentUser = await storage.getUser(req.user.claims.sub);
      
      // Check permissions
      if (currentUser?.role !== 'admin' && 
          currentUser?.id !== review.employeeId && 
          currentUser?.id !== review.managerId) {
        return res.status(403).json({ message: "Access denied" });
      }

      const updateData = updateReviewSchema.parse(req.body);
      const updatedReview = await storage.updateReview(req.params.id, updateData);
      
      res.json(updatedReview);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: "Invalid review data", errors: error.errors });
      }
      console.error("Error updating review:", error);
      res.status(500).json({ message: "Failed to update review" });
    }
  });

  // Template routes
  app.get('/api/templates', isAuthenticated, async (req, res) => {
    try {
      const { type } = req.query;
      let templates;
      
      if (type === 'structured' || type === 'standard') {
        templates = await storage.getTemplatesByType(type as 'structured' | 'standard');
      } else {
        templates = await storage.getAllTemplates();
      }
      
      res.json(templates);
    } catch (error) {
      console.error("Error fetching templates:", error);
      res.status(500).json({ message: "Failed to fetch templates" });
    }
  });

  // Goals routes
  app.get("/api/goals", isAuthenticated, async (req: any, res) => {
    try {
      const currentUser = await storage.getUser(req.user.claims.sub);
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }

      const goals = await storage.getGoalsForUser(currentUser.id, currentUser.role);
      res.json(goals);
    } catch (error) {
      console.error("Error fetching goals:", error);
      res.status(500).json({ message: "Failed to fetch goals" });
    }
  });

  app.post("/api/goals", isAuthenticated, async (req: any, res) => {
    try {
      const goalData = req.body;
      goalData.userId = req.user.claims.sub;
      const goal = await storage.createGoal(goalData);
      res.json(goal);
    } catch (error) {
      console.error("Error creating goal:", error);
      res.status(500).json({ message: "Failed to create goal" });
    }
  });

  app.put("/api/goals/:id", isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const goalData = req.body;
      const goal = await storage.updateGoal(id, goalData);
      res.json(goal);
    } catch (error) {
      console.error("Error updating goal:", error);
      res.status(500).json({ message: "Failed to update goal" });
    }
  });

  app.delete("/api/goals/:id", isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      await storage.deleteGoal(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting goal:", error);
      res.status(500).json({ message: "Failed to delete goal" });
    }
  });

  app.post('/api/templates', isAuthenticated, async (req: any, res) => {
    try {
      const currentUser = await storage.getUser(req.user.claims.sub);
      if (currentUser?.role !== 'admin') {
        return res.status(403).json({ message: "Only admins can create templates" });
      }

      const templateData = insertReviewTemplateSchema.parse(req.body);
      const template = await storage.createTemplate({
        ...templateData,
        createdBy: currentUser.id,
      });
      res.status(201).json(template);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: "Invalid template data", errors: error.errors });
      }
      console.error("Error creating template:", error);
      res.status(500).json({ message: "Failed to create template" });
    }
  });

  app.put('/api/templates/:id', isAuthenticated, async (req: any, res) => {
    try {
      const currentUser = await storage.getUser(req.user.claims.sub);
      if (currentUser?.role !== 'admin') {
        return res.status(403).json({ message: "Only admins can update templates" });
      }

      const templateData = insertReviewTemplateSchema.partial().parse(req.body);
      const template = await storage.updateTemplate(req.params.id, templateData);
      
      if (!template) {
        return res.status(404).json({ message: "Template not found" });
      }

      res.json(template);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: "Invalid template data", errors: error.errors });
      }
      console.error("Error updating template:", error);
      res.status(500).json({ message: "Failed to update template" });
    }
  });

  app.delete('/api/templates/:id', isAuthenticated, async (req: any, res) => {
    try {
      const currentUser = await storage.getUser(req.user.claims.sub);
      if (currentUser?.role !== 'admin') {
        return res.status(403).json({ message: "Only admins can delete templates" });
      }

      await storage.deleteTemplate(req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting template:", error);
      res.status(500).json({ message: "Failed to delete template" });
    }
  });

  // Organization Branding routes
  app.get('/api/branding', async (req, res) => {
    try {
      const branding = await storage.getOrganizationBranding();
      res.json(branding);
    } catch (error) {
      console.error("Error fetching branding:", error);
      res.status(500).json({ message: "Failed to fetch branding" });
    }
  });

  app.put('/api/branding', isAuthenticated, async (req: any, res) => {
    try {
      const currentUser = await storage.getUser(req.user.claims.sub);
      if (currentUser?.role !== 'admin') {
        return res.status(403).json({ message: "Only admins can update branding" });
      }

      const validatedData = updateOrganizationBrandingSchema.parse(req.body);
      const branding = await storage.updateOrganizationBranding(validatedData, currentUser.id);
      res.json(branding);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: "Invalid branding data", errors: error.errors });
      }
      console.error("Error updating branding:", error);
      res.status(500).json({ message: "Failed to update branding" });
    }
  });

  // AppleBites Assessment Routes
  app.get('/api/assessments', isAuthenticated, async (req: any, res) => {
    try {
      const currentUser = await storage.getUser(req.user.claims.sub);
      if (!currentUser) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const userAssessments = await db.query.assessments.findMany({
        where: eq(schema.assessments.userId, currentUser.id),
        orderBy: [desc(schema.assessments.createdAt)],
      });

      res.json(userAssessments);
    } catch (error) {
      console.error('Error fetching assessments:', error);
      res.status(500).json({ message: 'Failed to fetch assessments' });
    }
  });

  app.post('/api/assessments', isAuthenticated, async (req: any, res) => {
    try {
      const currentUser = await storage.getUser(req.user.claims.sub);
      if (!currentUser) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const validatedData = insertAssessmentSchema.parse({
        ...req.body,
        userId: currentUser.id,
      });

      const [assessment] = await db.insert(schema.assessments)
        .values(validatedData)
        .returning();

      res.json(assessment);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: "Invalid assessment data", errors: error.errors });
      }
      console.error('Error creating assessment:', error);
      res.status(500).json({ message: 'Failed to create assessment' });
    }
  });

  // Valuation Assessment Routes (AppleBites business valuation)
  app.get('/api/valuations', isAuthenticated, async (req: any, res) => {
    try {
      const currentUser = await storage.getUser(req.user.claims.sub);
      if (!currentUser) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const valuations = await db.query.valuationAssessments.findMany({
        where: eq(schema.valuationAssessments.userId, currentUser.id),
        orderBy: [desc(schema.valuationAssessments.createdAt)],
      });

      res.json(valuations);
    } catch (error) {
      console.error('Error fetching valuations:', error);
      res.status(500).json({ message: 'Failed to fetch valuations' });
    }
  });

  app.post('/api/valuations', isAuthenticated, async (req: any, res) => {
    try {
      const currentUser = await storage.getUser(req.user.claims.sub);
      if (!currentUser) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const validatedData = insertValuationAssessmentSchema.parse({
        ...req.body,
        userId: currentUser.id,
      });

      const [valuation] = await db.insert(schema.valuationAssessments)
        .values(validatedData)
        .returning();

      res.json(valuation);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: "Invalid valuation data", errors: error.errors });
      }
      console.error('Error creating valuation:', error);
      res.status(500).json({ message: 'Failed to create valuation' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
