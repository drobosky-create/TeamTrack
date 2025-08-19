import type { Express } from "express";
import Stripe from "stripe";

// Extend session type for admin authentication
declare module 'express-session' {
  interface SessionData {
    adminUser?: {
      id: string;
      email: string;
      role: string;
      firstName?: string;
      lastName?: string;
    };
  }
}
import { createServer, type Server } from "http";
import { storage } from "./storage";
import assessmentRoutes from "./routes/assessments";
import { 
  handleConsumerSignup, 
  handleConsumerLogin, 
  handleConsumerLogout,
  getConsumerUser 
} from "./routes/consumer-auth";
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
  insertConsumerUserSchema,
  consumerLoginSchema,
  consumerSignupSchema,
  type UserRole 
} from "@shared/schema";
import * as schema from "@shared/schema";
import { ZodError } from "zod";
import { db } from "./db";
import { eq, desc, and } from "drizzle-orm";
import bcrypt from "bcryptjs";
import express from "express";

// Initialize Stripe
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-07-30.basil",
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup session middleware first (needed for consumer auth)
  await setupAuth(app);
  
  // Register assessment routes (public endpoints for consumer assessments)
  app.use(assessmentRoutes);
  
  // Consumer authentication routes
  app.post('/api/auth/consumer-signup', handleConsumerSignup);
  app.post('/api/auth/consumer-login', handleConsumerLogin);
  app.post('/api/auth/consumer-logout', handleConsumerLogout);
  app.get('/api/auth/consumer-user', getConsumerUser);

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

  // UI Tokens routes
  app.get('/api/ui-tokens', async (req, res) => {
    try {
      const tokens = await db.select().from(schema.uiTokens);
      
      // Convert to key-value object for easier frontend consumption
      const tokenMap = tokens.reduce((acc, token) => {
        acc[token.key] = token.value;
        return acc;
      }, {} as Record<string, string>);
      
      res.json(tokenMap);
    } catch (error) {
      console.error("Error fetching UI tokens:", error);
      res.status(500).json({ message: "Failed to fetch UI tokens" });
    }
  });

  app.put('/api/ui-tokens/:key', isAuthenticated, async (req: any, res) => {
    try {
      const currentUser = await storage.getUser(req.user.claims.sub);
      if (!currentUser || currentUser.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      const { key } = req.params;
      const { value } = req.body;

      if (!value) {
        return res.status(400).json({ message: "Value is required" });
      }

      await db
        .insert(schema.uiTokens)
        .values({ key, value })
        .onConflictDoUpdate({
          target: schema.uiTokens.key,
          set: { value, updatedAt: new Date() }
        });

      res.json({ success: true });
    } catch (error) {
      console.error("Error updating UI token:", error);
      res.status(500).json({ message: "Failed to update UI token" });
    }
  });

  // Consumer Authentication Routes
  app.post('/api/consumer/signup', async (req, res) => {
    try {
      const validatedData = consumerSignupSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await db.query.consumerUsers.findFirst({
        where: eq(schema.consumerUsers.email, validatedData.email)
      });
      
      if (existingUser) {
        return res.status(400).json({ message: "User already exists with this email" });
      }
      
      // Hash password
      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(validatedData.password, saltRounds);
      
      // Create user
      const [newUser] = await db.insert(schema.consumerUsers)
        .values({
          email: validatedData.email,
          firstName: validatedData.firstName,
          lastName: validatedData.lastName,
          companyName: validatedData.companyName,
          phone: validatedData.phone || null,
          passwordHash,
        })
        .returning();
      
      // Remove password hash from response
      const { passwordHash: _, ...userResponse } = newUser;
      
      res.status(201).json({ 
        message: "Account created successfully",
        user: userResponse 
      });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: "Invalid signup data", errors: error.errors });
      }
      console.error('Error creating consumer account:', error);
      res.status(500).json({ message: 'Failed to create account' });
    }
  });

  app.post('/api/consumer/login', async (req, res) => {
    try {
      const validatedData = consumerLoginSchema.parse(req.body);
      
      // Find user by email
      const user = await db.query.consumerUsers.findFirst({
        where: eq(schema.consumerUsers.email, validatedData.email)
      });
      
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
      
      // Check password
      const isValid = await bcrypt.compare(validatedData.password, user.passwordHash);
      
      if (!isValid) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
      
      // Update last login
      await db.update(schema.consumerUsers)
        .set({ lastLoginAt: new Date() })
        .where(eq(schema.consumerUsers.id, user.id));
      
      // Remove password hash from response
      const { passwordHash: _, ...userResponse } = user;
      
      res.json({ 
        message: "Login successful",
        user: userResponse 
      });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: "Invalid login data", errors: error.errors });
      }
      console.error('Error during consumer login:', error);
      res.status(500).json({ message: 'Login failed' });
    }
  });

  // Admin authentication routes
  app.post('/api/admin/login', async (req, res) => {
    try {
      const validatedData = schema.adminLoginSchema.parse(req.body);
      
      // Find admin user by email
      const user = await db.query.users.findFirst({
        where: and(
          eq(schema.users.email, validatedData.email),
          eq(schema.users.role, 'admin')
        )
      });
      
      if (!user || !user.passwordHash) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
      
      // Check password
      const isValid = await bcrypt.compare(validatedData.password, user.passwordHash);
      
      if (!isValid) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
      
      // Create session - store user info in session
      req.session.adminUser = {
        id: user.id,
        email: user.email || '',
        role: user.role,
        firstName: user.firstName || undefined,
        lastName: user.lastName || undefined
      };
      
      // Remove password hash from response
      const { passwordHash: _, ...userResponse } = user;
      
      res.json({ 
        message: "Admin login successful",
        user: userResponse 
      });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: "Invalid login data", errors: error.errors });
      }
      console.error('Error during admin login:', error);
      res.status(500).json({ message: 'Admin login failed' });
    }
  });

  app.post('/api/admin/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: 'Logout failed' });
      }
      res.clearCookie('connect.sid');
      res.json({ message: 'Logout successful' });
    });
  });

  app.get('/api/admin/user', (req, res) => {
    if (req.session.adminUser) {
      res.json(req.session.adminUser);
    } else {
      res.status(401).json({ message: 'Not authenticated' });
    }
  });

  // Create Stripe Checkout Session for AppleBites
  app.post("/api/payments/create-checkout-session", async (req, res) => {
    try {
      const { 
        productName = 'AppleBites Growth & Exit Plan',
        amount = 795,
        successUrl,
        cancelUrl
      } = req.body;
      
      // Ensure URLs are provided from client with proper protocol
      if (!successUrl || !cancelUrl) {
        return res.status(400).json({ 
          message: "Success and cancel URLs are required" 
        });
      }

      const session = await stripe.checkout.sessions.create({
        line_items: [{
          price_data: {
            currency: 'usd',
            product_data: {
              name: productName,
              description: 'Complete business valuation assessment with growth strategies and exit planning tools',
            },
            unit_amount: Math.round(amount * 100), // Convert to cents
          },
          quantity: 1,
        }],
        mode: 'payment',
        allow_promotion_codes: true, // Enable native Stripe promotion codes
        success_url: successUrl,
        cancel_url: cancelUrl,
        metadata: {
          product: 'applebites_growth',
        },
      });

      res.json({ 
        sessionId: session.id,
        url: session.url 
      });
    } catch (error: any) {
      console.error('Checkout session creation error:', error);
      res.status(500).json({ 
        message: "Error creating checkout session: " + error.message 
      });
    }
  });

  // Create promotion codes (admin endpoint)
  app.post("/api/admin/create-promotion-code", async (req, res) => {
    try {
      const { code, percentOff, amountOff, maxRedemptions, expiresInDays = 30 } = req.body;

      // Create a coupon first
      const couponData: any = {
        duration: 'once', // For one-time payments
        name: code,
      };

      if (percentOff) {
        couponData.percent_off = percentOff;
      } else if (amountOff) {
        couponData.amount_off = Math.round(amountOff * 100); // Convert to cents
        couponData.currency = 'usd';
      } else {
        return res.status(400).json({ 
          message: "Either percentOff or amountOff must be provided" 
        });
      }

      const coupon = await stripe.coupons.create(couponData);

      // Create the promotion code
      const promotionCode = await stripe.promotionCodes.create({
        coupon: coupon.id,
        code: code.toUpperCase(),
        max_redemptions: maxRedemptions,
        expires_at: Math.floor(Date.now() / 1000) + (expiresInDays * 24 * 60 * 60),
      });

      res.json({ 
        success: true,
        promotionCode: promotionCode.code,
        couponId: coupon.id,
        expiresAt: new Date(promotionCode.expires_at! * 1000).toISOString(),
      });
    } catch (error: any) {
      console.error('Promotion code creation error:', error);
      res.status(500).json({ 
        message: "Error creating promotion code: " + error.message 
      });
    }
  });

  // Stripe payment routes for one-time payments
  app.post("/api/payments/create-payment-intent", async (req, res) => {
    try {
      const { amount, currency = 'usd', metadata = {} } = req.body;
      
      if (!amount || amount < 0.50) { // Minimum 50 cents
        return res.status(400).json({ 
          message: "Invalid amount. Minimum amount is $0.50" 
        });
      }

      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency,
        metadata,
        automatic_payment_methods: {
          enabled: true,
        },
      });

      res.json({ 
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      });
    } catch (error: any) {
      console.error('Payment intent creation error:', error);
      res.status(500).json({ 
        message: "Error creating payment intent: " + error.message 
      });
    }
  });

  // Stripe subscription routes
  app.post('/api/payments/create-subscription', async (req, res) => {
    try {
      const { priceId, customerEmail, customerName, userId } = req.body;

      if (!priceId) {
        return res.status(400).json({ message: "Price ID is required" });
      }

      let customer;
      let user = null;

      // If userId provided, get user and check for existing Stripe customer
      if (userId) {
        user = await db.query.users.findFirst({
          where: eq(schema.users.id, userId)
        });

        if (user?.stripeCustomerId) {
          customer = await stripe.customers.retrieve(user.stripeCustomerId);
        }
      }

      // Create new customer if none exists
      if (!customer) {
        customer = await stripe.customers.create({
          email: customerEmail,
          name: customerName,
        });

        // Update user with Stripe customer ID if user exists
        if (user) {
          await db.update(schema.users)
            .set({ stripeCustomerId: customer.id })
            .where(eq(schema.users.id, userId));
        }
      }

      const subscription = await stripe.subscriptions.create({
        customer: customer.id,
        items: [{ price: priceId }],
        payment_behavior: 'default_incomplete',
        payment_settings: { save_default_payment_method: 'on_subscription' },
        expand: ['latest_invoice.payment_intent'],
      });

      // Update user with subscription ID if user exists
      if (user) {
        await db.update(schema.users)
          .set({ stripeSubscriptionId: subscription.id })
          .where(eq(schema.users.id, userId));
      }

      const invoice = subscription.latest_invoice as Stripe.Invoice;
      const paymentIntent = invoice.payment_intent as Stripe.PaymentIntent;

      res.json({
        subscriptionId: subscription.id,
        clientSecret: paymentIntent.client_secret,
      });
    } catch (error: any) {
      console.error('Subscription creation error:', error);
      res.status(500).json({ 
        message: "Error creating subscription: " + error.message 
      });
    }
  });

  // Cancel subscription
  app.post('/api/payments/cancel-subscription', async (req, res) => {
    try {
      const { subscriptionId, userId } = req.body;

      if (!subscriptionId) {
        return res.status(400).json({ message: "Subscription ID is required" });
      }

      const subscription = await stripe.subscriptions.cancel(subscriptionId);

      // Clear subscription ID from user if provided
      if (userId) {
        await db.update(schema.users)
          .set({ stripeSubscriptionId: null })
          .where(eq(schema.users.id, userId));
      }

      res.json({ 
        message: "Subscription cancelled successfully",
        subscription 
      });
    } catch (error: any) {
      console.error('Subscription cancellation error:', error);
      res.status(500).json({ 
        message: "Error cancelling subscription: " + error.message 
      });
    }
  });

  // Get subscription status
  app.get('/api/payments/subscription-status/:userId', async (req, res) => {
    try {
      const { userId } = req.params;

      const user = await db.query.users.findFirst({
        where: eq(schema.users.id, userId)
      });

      if (!user || !user.stripeSubscriptionId) {
        return res.json({ 
          hasActiveSubscription: false,
          subscription: null 
        });
      }

      const subscription = await stripe.subscriptions.retrieve(user.stripeSubscriptionId);

      res.json({
        hasActiveSubscription: ['active', 'trialing'].includes(subscription.status),
        subscription: {
          id: subscription.id,
          status: subscription.status,
          current_period_end: subscription.current_period_end,
          cancel_at_period_end: subscription.cancel_at_period_end,
        }
      });
    } catch (error: any) {
      console.error('Subscription status error:', error);
      res.status(500).json({ 
        message: "Error fetching subscription status: " + error.message 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
