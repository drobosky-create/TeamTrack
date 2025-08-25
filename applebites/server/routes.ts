import type { Express, Request } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./simpleAuth";
import { insertValuationAssessmentSchema, type ValuationAssessment, loginSchema, insertTeamMemberSchema, type LoginCredentials, type InsertTeamMember, type TeamMember, registerUserSchema, loginUserSchema, type RegisterUser, type LoginUser } from "@shared/schema";
import { generateValuationNarrative, type ValuationAnalysisInput } from "./openai";
import { generateFinancialCoachingTips, generateContextualInsights, type FinancialCoachingData } from "./services/aiCoaching";
import { generateValuationPDF } from "./pdf-generator";
import { generateEnhancedValuationPDF } from "./pdf-generator-enhanced";
import { getMultiplierByNAICS, calculateWeightedMultiplier } from "./config/naicsMultipliers";
import { resendEmailService } from "./resend-service";
import { emailService } from "./email-service";
import { goHighLevelService } from "./gohighlevel-service";
import { getMultiplierForGrade, getLabelForGrade, scoreToGrade } from "./config/grade-based-multipliers";
import { naicsDatabase, getNAICSBySector, getNAICSByParentCode, getNAICSByLevel } from "./config/naics-database";
import { completeNAICSDatabase, getAllSectors, getChildrenByParentCode as getCompleteChildrenByParentCode, getNAICSByCode as getCompleteNAICSByCode, getSectorByCode, getChildrenWithEnhancedTitles } from "./config/complete-naics-database";
import { curatedNAICSDatabase, getCuratedNAICsBySector, getCuratedSectors, getCuratedNAICSByCode, calculateMultiplierFromGrade } from "./config/curated-naics-database";
import { comprehensiveNAICSMultipliers, getComprehensiveNAICSByCode, getComprehensiveNAICsBySector, getComprehensiveSectors, calculateComprehensiveMultiplierFromGrade } from "./config/paid-assessment-naics-multipliers";
import { constructionMultipliers, getConstructionMultiplierByNAICS, calculateConstructionMultiplier, qualifiesForPremium } from "./config/construction-specific-multipliers";
import fs from 'fs/promises';
import path from 'path';
import bcrypt from 'bcryptjs';
import { nanoid } from 'nanoid';

// Extend Express types
declare module 'express-session' {
  interface SessionData {
    customUserSessionId?: string;
    teamSessionId?: string;
    adminAuthenticated?: boolean;
    userId?: string;
    userEmail?: string;
    userTier?: string;
  }
}

declare global {
  namespace Express {
    interface Request {
      user?: any;
      currentUser?: any;
      authType?: string;
    }
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Setup simple email/password authentication
  await setupAuth(app);
  console.log('Simple authentication configured successfully');

  // Simple email/password authentication routes
  
  // User registration
  app.post('/api/signup', async (req, res) => {
    try {
      const validatedData = registerUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(validatedData.email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists with this email" });
      }

      // Hash password
      const saltRounds = 12;
      const passwordHash = await bcrypt.hash(validatedData.password, saltRounds);

      // Create user
      const user = await storage.createUser({
        firstName: validatedData.firstName || '',
        lastName: validatedData.lastName || '',
        email: validatedData.email,
        passwordHash,
        tier: 'free',
        authProvider: 'email',
        isActive: true
      });

      // Create contact in GoHighLevel immediately upon account creation
      try {
        const ghlContactData = {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          tags: ['applebites-signup', 'new-user', 'free-tier'],
          customFields: {
            signupDate: new Date().toISOString(),
            tier: 'free',
            authProvider: 'email',
            source: 'applebites_signup'
          }
        };
        
        const ghlResult = await goHighLevelService.createOrUpdateContact(ghlContactData);
        console.log(`Created GHL contact for new user ${user.id}:`, ghlResult.contactId);
        
        // Store GHL contact ID for future updates
        if (ghlResult.contactId) {
          await storage.updateUser(user.id, { ghlContactId: ghlResult.contactId });
        }
      } catch (ghlError) {
        console.error('Failed to create GHL contact during signup:', ghlError);
        // Don't fail signup if GHL fails - user account is still created
      }

      // Create session
      req.session.userId = user.id;
      req.session.userEmail = user.email;
      req.session.userTier = user.tier;

      // Save session explicitly for production
      req.session.save((err: any) => {
        if (err) {
          console.error('Session save error:', err);
          return res.status(500).json({ message: "Session save failed" });
        }

        console.log('Session saved successfully for new user:', user.id);
        res.json({
          message: "Account created successfully",
          user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            tier: user.tier,
          },
        });
      });
    } catch (error: any) {
      console.error("Registration error:", error);
      res.status(400).json({ message: error.message || "Registration failed" });
    }
  });

  // User login
  app.post('/api/login', async (req, res) => {
    try {
      const validatedData = loginUserSchema.parse(req.body);
      
      const user = await storage.getUserByEmail(validatedData.email);
      if (!user || !user.passwordHash) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const isValidPassword = await bcrypt.compare(validatedData.password, user.passwordHash);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      // Create session
      req.session.userId = user.id;
      req.session.userEmail = user.email;
      req.session.userTier = user.tier;

      // Save session explicitly for production
      req.session.save((err: any) => {
        if (err) {
          console.error('Session save error:', err);
          return res.status(500).json({ message: "Session save failed" });
        }

        console.log('Session saved successfully for user:', user.id);
        res.json({
          message: "Login successful",
          user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            tier: user.tier,
          },
        });
      });
    } catch (error: any) {
      console.error("Login error:", error);
      res.status(400).json({ message: error.message || "Login failed" });
    }
  });

  // User logout - unified endpoint
  app.post('/api/logout', (req, res) => {
    // Clear all session data
    req.session.userId = null;
    req.session.userEmail = null;
    req.session.userTier = null;
    req.session.customUserSessionId = null;
    req.session.teamSessionId = null;
    req.session.adminAuthenticated = null;
    
    req.session.destroy((err) => {
      if (err) {
        console.error('Logout error:', err);
        return res.status(500).json({ message: 'Logout failed' });
      }
      
      // Clear all possible cookie names
      res.clearCookie('applebites.session');
      res.clearCookie('connect.sid');
      res.clearCookie('session');
      
      res.json({ message: "Logged out successfully" });
    });
  });

  // Demo login for development testing
  app.post('/api/demo-login', async (req, res) => {
    if (process.env.NODE_ENV !== 'development') {
      return res.status(403).json({ error: 'Demo login only available in development' });
    }
    
    try {
      // Create or get demo user
      let demoUser = await storage.getUserByEmail('demo@applebites.ai');
      if (!demoUser) {
        demoUser = await storage.createUser({
          email: 'demo@applebites.ai',
          firstName: 'Demo',
          lastName: 'User',
          tier: 'free',
          authProvider: 'demo'
        });
      }
      
      // Set session to mimic Replit Auth
      (req as any).session.passport = {
        user: {
          claims: {
            sub: demoUser.id,
            email: demoUser.email,
            first_name: demoUser.firstName,
            last_name: demoUser.lastName
          }
        }
      };
      
      res.json({ success: true, user: demoUser });
    } catch (error) {
      console.error('Demo login error:', error);
      res.status(500).json({ error: 'Failed to create demo session' });
    }
  });

  // Custom user authentication middleware
  const isCustomUserAuthenticated = async (req: any, res: any, next: any) => {
    const sessionId = req.session?.customUserSessionId;
    if (!sessionId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const user = await storage.getUser(sessionId);
      if (!user || !user.isActive) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      req.customUser = user;
      return next();
    } catch (error) {
      return res.status(401).json({ message: "Unauthorized" });
    }
  };

  // Simple authentication middleware
  const isUserAuthenticated = async (req: any, res: any, next: any) => {
    // Check both session formats for compatibility
    const userId = req.session?.customUserSessionId || req.session?.userId;
    
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const user = await storage.getUser(userId);
      
      if (!user || !user.isActive) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      req.currentUser = user;
      return next();
    } catch (error) {
      return res.status(401).json({ message: "Unauthorized" });
    }
  };

  // Authentication endpoint for useAuth hook  
  app.get('/api/auth/user', isUserAuthenticated, async (req, res) => {
    try {
      const user = req.currentUser;
      res.json({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        tier: user.tier,
        authProvider: user.authProvider
      });
    } catch (error) {
      console.error('Get user error:', error);
      res.status(500).json({ message: 'Failed to get user information' });
    }
  });

  // Custom user registration
  app.post('/api/users/register', async (req, res) => {
    try {
      const validatedData = registerUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(validatedData.email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists with this email" });
      }

      // Hash password
      const saltRounds = 12;
      const passwordHash = await bcrypt.hash(validatedData.password, saltRounds);

      // Create user
      const user = await storage.createCustomUser({
        firstName: validatedData.firstName || '',
        lastName: validatedData.lastName || '',
        email: validatedData.email,
        passwordHash,
      });

      // Create session
      req.session.customUserSessionId = user.id;

      res.json({
        message: "Account created successfully",
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          tier: user.tier,
          authProvider: user.authProvider,
        },
      });
    } catch (error: any) {
      console.error("Registration error:", error);
      res.status(400).json({ message: error.message || "Registration failed" });
    }
  });

  // Custom user login
  app.post('/api/users/login', async (req, res) => {
    try {
      const validatedData = loginUserSchema.parse(req.body);
      
      const user = await storage.validateUserCredentials(validatedData.email, validatedData.password);
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      // Create session
      req.session.customUserSessionId = user.id;

      res.json({
        message: "Login successful",
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          tier: user.tier,
          authProvider: user.authProvider,
        },
      });
    } catch (error: any) {
      console.error("Login error:", error);
      res.status(400).json({ message: error.message || "Login failed" });
    }
  });

  // Custom user logout - redirect to main logout
  app.post('/api/users/logout', (req, res) => {
    // Clear all session data
    req.session.userId = null;
    req.session.userEmail = null;
    req.session.userTier = null;
    req.session.customUserSessionId = null;
    req.session.teamSessionId = null;
    req.session.adminAuthenticated = null;
    
    req.session.destroy((err) => {
      if (err) {
        console.error('Logout error:', err);
        return res.status(500).json({ message: 'Logout failed' });
      }
      
      // Clear all possible cookie names
      res.clearCookie('applebites.session');
      res.clearCookie('connect.sid');
      res.clearCookie('session');
      
      res.json({ message: "Logged out successfully" });
    });
  });





  // Admin authentication middleware - requires explicit admin login
  const isAdminAuthenticated = async (req: any, res: any, next: any) => {
    // Check if admin is authenticated via admin login ONLY
    if ((req.session as any)?.adminAuthenticated) {
      return next();
    }

    return res.status(401).json({ error: 'Admin authentication required' });
  };

  // Team authentication middleware
  const isTeamAuthenticated = async (req: any, res: any, next: any) => {
    const sessionId = (req.session as any)?.teamSessionId;
    if (!sessionId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    try {
      const session = await storage.getTeamSession(sessionId);
      if (!session || session.expiresAt < new Date()) {
        // Clean up expired session
        if (session) {
          await storage.deleteTeamSession(sessionId);
        }
        (req.session as any).teamSessionId = null;
        return res.status(401).json({ error: 'Session expired' });
      }

      const teamMember = await storage.getTeamMemberById(session.teamMemberId!);
      if (!teamMember || !teamMember.isActive) {
        return res.status(401).json({ error: 'Account inactive' });
      }

      // Extend session on each request
      const newExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
      await storage.updateTeamSession(sessionId, newExpiresAt);

      req.user = teamMember;
      return next();
    } catch (error) {
      console.error('Authentication middleware error:', error);
      return res.status(401).json({ error: 'Authentication failed' });
    }
  };

  // Combined authentication middleware - accepts both admin and team auth
  const isAdminOrTeamAuthenticated = async (req: any, res: any, next: any) => {
    // First try admin authentication
    if ((req.session as any)?.adminAuthenticated) {
      req.user = { role: 'admin' }; // Set admin user context
      return next();
    }

    // If not admin, try team authentication
    const sessionId = (req.session as any)?.teamSessionId;
    if (!sessionId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    try {
      const session = await storage.getTeamSession(sessionId);
      if (!session || session.expiresAt < new Date()) {
        if (session) {
          await storage.deleteTeamSession(sessionId);
        }
        (req.session as any).teamSessionId = null;
        return res.status(401).json({ error: 'Session expired' });
      }

      const teamMember = await storage.getTeamMemberById(session.teamMemberId!);
      if (!teamMember || !teamMember.isActive) {
        return res.status(401).json({ error: 'Account inactive' });
      }

      // Extend session on each request
      const newExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      await storage.updateTeamSession(sessionId, newExpiresAt);

      req.user = teamMember;
      return next();
    } catch (error) {
      console.error('Authentication middleware error:', error);
      return res.status(401).json({ error: 'Authentication failed' });
    }
  };

  // Role-based access control middleware
  const requireRole = (roles: string[]) => {
    return (req: any, res: any, next: any) => {
      if (!req.user || !roles.includes(req.user.role)) {
        return res.status(403).json({ error: 'Insufficient permissions' });
      }
      return next();
    };
  };
  
  // Calculate lead score based on assessment data and metrics
  function calculateLeadScore(assessment: any, metrics: any): number {
    let score = 0;
    
    // Base score from follow-up intent (0-40 points)
    switch (assessment.followUpIntent) {
      case 'yes': score += 40; break;
      case 'maybe': score += 20; break;
      case 'no': score += 5; break;
    }
    
    // Business size score based on adjusted EBITDA (0-30 points)
    const ebitda = metrics.adjustedEbitda;
    if (ebitda >= 10000000) score += 30; // $10M+
    else if (ebitda >= 5000000) score += 25; // $5M+
    else if (ebitda >= 1000000) score += 20; // $1M+
    else if (ebitda >= 500000) score += 15; // $500K+
    else if (ebitda >= 100000) score += 10; // $100K+
    else score += 5;
    
    // Overall grade score (0-20 points)
    const gradeScore = assessment.valueDrivers ? 
      Object.values(assessment.valueDrivers).reduce((sum: number, grade: any) => {
        const gradeValue = grade === 'A' ? 5 : grade === 'B' ? 4 : grade === 'C' ? 3 : grade === 'D' ? 2 : 1;
        return sum + gradeValue;
      }, 0) / Object.keys(assessment.valueDrivers).length : 3;
    
    score += Math.round((gradeScore / 5) * 20);
    
    // Contact completeness (0-10 points)
    if (assessment.phone) score += 5;
    if (assessment.jobTitle) score += 5;
    
    return Math.min(100, Math.max(0, score));
  }
  
  // Calculate valuation metrics
  function calculateValuationMetrics(formData: any) {
    // Calculate base EBITDA
    const baseEbitda = 
      parseFloat(formData.ebitda.netIncome || "0") +
      parseFloat(formData.ebitda.interest || "0") +
      parseFloat(formData.ebitda.taxes || "0") +
      parseFloat(formData.ebitda.depreciation || "0") +
      parseFloat(formData.ebitda.amortization || "0");

    // Calculate adjusted EBITDA
    const adjustedEbitda = baseEbitda +
      parseFloat(formData.adjustments.ownerSalary || "0") +
      parseFloat(formData.adjustments.personalExpenses || "0") +
      parseFloat(formData.adjustments.oneTimeExpenses || "0") +
      parseFloat(formData.adjustments.otherAdjustments || "0");

    // Convert grades to numeric scores for average calculation
    const gradeToScoreValue = (grade: string): number => {
      switch (grade) {
        case 'A': return 5;
        case 'B': return 4;
        case 'C': return 3;
        case 'D': return 2;
        case 'F': return 1;
        default: return 3;
      }
    };

    // Calculate weighted average score
    const scores = Object.values(formData.valueDrivers).map((grade: any) => gradeToScoreValue(grade));
    const averageScore = scores.reduce((sum: number, score: number) => sum + score, 0) / scores.length;
    
    // Determine overall letter grade using centralized function
    const overallGrade = scoreToGrade(averageScore);

    // Use centralized multiplier scale
    const valuationMultiple = getMultiplierForGrade(overallGrade);

    // Calculate valuation estimates (±20% range)
    const midEstimate = adjustedEbitda * valuationMultiple;
    const lowEstimate = midEstimate * 0.8;
    const highEstimate = midEstimate * 1.2;

    // Add grade modifier for display (+ or -)
    const gradeModifier = averageScore > (gradeToScoreValue(overallGrade) + 0.3) ? '+' :
                         averageScore < (gradeToScoreValue(overallGrade) - 0.3) ? '-' : '';

    return {
      baseEbitda,
      adjustedEbitda,
      valuationMultiple: parseFloat(valuationMultiple.toFixed(1)),
      lowEstimate: Math.round(lowEstimate),
      midEstimate: Math.round(midEstimate),
      highEstimate: Math.round(highEstimate),
      overallScore: overallGrade + gradeModifier
    };
  }

  // POST /api/valuation - Submit valuation assessment
  app.post("/api/valuation", async (req, res) => {
    try {
      const formData = req.body;
      
      // Validate the request structure
      if (!formData.contact || !formData.ebitda || !formData.valueDrivers || !formData.followUp) {
        return res.status(400).json({ message: "Missing required form data sections" });
      }

      // Helper function to validate and cap numeric values
      const validateNumeric = (value: string | number, max: number = 999999999): string => {
        const num = parseFloat(value.toString());
        if (isNaN(num)) return "0";
        return Math.min(Math.abs(num), max).toFixed(2);
      };

      // Prepare the data for database insertion
      const assessmentData = {
        // Contact info
        firstName: formData.contact.firstName,
        lastName: formData.contact.lastName,
        email: formData.contact.email,
        phone: formData.contact.phone,
        company: formData.contact.company,
        jobTitle: formData.contact.jobTitle || "",
        
        // EBITDA components - validate to prevent overflow
        netIncome: validateNumeric(formData.ebitda.netIncome),
        interest: validateNumeric(formData.ebitda.interest),
        taxes: validateNumeric(formData.ebitda.taxes),
        depreciation: validateNumeric(formData.ebitda.depreciation),
        amortization: validateNumeric(formData.ebitda.amortization),
        
        // Adjustments (now part of EBITDA form) - validate to prevent overflow
        ownerSalary: validateNumeric(formData.ebitda.ownerSalary || "0"),
        personalExpenses: validateNumeric(formData.ebitda.personalExpenses || "0"),
        oneTimeExpenses: validateNumeric(formData.ebitda.oneTimeExpenses || "0"),
        otherAdjustments: validateNumeric(formData.ebitda.otherAdjustments || "0"),
        adjustmentNotes: formData.ebitda.adjustmentNotes || "",
        
        // Value drivers
        financialPerformance: formData.valueDrivers.financialPerformance,
        customerConcentration: formData.valueDrivers.customerConcentration,
        managementTeam: formData.valueDrivers.managementTeam,
        competitivePosition: formData.valueDrivers.competitivePosition,
        growthProspects: formData.valueDrivers.growthProspects,
        systemsProcesses: formData.valueDrivers.systemsProcesses,
        assetQuality: formData.valueDrivers.assetQuality,
        industryOutlook: formData.valueDrivers.industryOutlook,
        riskFactors: formData.valueDrivers.riskFactors,
        ownerDependency: formData.valueDrivers.ownerDependency,
        
        // Follow-up
        followUpIntent: formData.followUp.followUpIntent,
        additionalComments: formData.followUp.additionalComments || "",
      };

      // Validate with Zod schema
      const validatedData = insertValuationAssessmentSchema.parse(assessmentData);
      
      // Create initial assessment record
      let assessment = await storage.createValuationAssessment(validatedData);
      
      // Calculate valuation metrics
      const metrics = calculateValuationMetrics(formData);
      
      let narrativeAnalysis = {
        narrativeSummary: `Based on the comprehensive analysis of ${assessment.company}, the business demonstrates ${metrics.overallScore} operational performance across key value drivers. With an adjusted EBITDA of $${metrics.adjustedEbitda.toLocaleString()} and an applied multiple of ${metrics.valuationMultiple}x, the estimated valuation range is $${metrics.lowEstimate.toLocaleString()} to $${metrics.highEstimate.toLocaleString()}.`,
        keyStrengths: ['Established business operations', 'Positive EBITDA performance', 'Market presence'],
        areasForImprovement: ['Operational efficiency optimization', 'Growth strategy enhancement', 'Risk mitigation'],
        recommendations: ['Focus on improving value driver scores', 'Consider strategic growth initiatives', 'Enhance operational systems']
      };

      try {
        // Generate AI narrative
        const analysisInput: ValuationAnalysisInput = {
          companyName: assessment.company,
          adjustedEbitda: metrics.adjustedEbitda,
          valuationMultiple: metrics.valuationMultiple,
          overallScore: metrics.overallScore,
          valueDriverScores: {
            financialPerformance: assessment.financialPerformance,
            customerConcentration: assessment.customerConcentration,
            managementTeam: assessment.managementTeam,
            competitivePosition: assessment.competitivePosition,
            growthProspects: assessment.growthProspects,
            systemsProcesses: assessment.systemsProcesses,
            assetQuality: assessment.assetQuality,
            industryOutlook: assessment.industryOutlook,
            riskFactors: assessment.riskFactors,
            ownerDependency: assessment.ownerDependency,
          },
          adjustmentNotes: assessment.adjustmentNotes || undefined,
          additionalComments: assessment.additionalComments || undefined,
        };

        const aiNarrative = await Promise.race([
          generateValuationNarrative(analysisInput),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('AI generation timeout')), 25000)
          )
        ]) as { narrativeSummary: string; keyStrengths: string[]; areasForImprovement: string[]; recommendations: string[]; };
        narrativeAnalysis = aiNarrative;
      } catch (aiError) {
        console.error('AI narrative generation failed, using fallback:', aiError);
        // Use fallback narrative - already set above
      }
        
      try {
        // Generate concise executive summary
        const gradeToScore = (grade: string): number => {
          switch (grade) {
            case 'A': return 10; case 'B': return 8; case 'C': return 6; 
            case 'D': return 4; case 'F': return 2; default: return 6;
          }
        };
        
        const driverScores = {
          financialPerformance: gradeToScore(assessment.financialPerformance),
          customerConcentration: gradeToScore(assessment.customerConcentration),
          managementTeam: gradeToScore(assessment.managementTeam),
          competitivePosition: gradeToScore(assessment.competitivePosition),
          growthProspects: gradeToScore(assessment.growthProspects),
          systemsProcesses: gradeToScore(assessment.systemsProcesses),
          assetQuality: gradeToScore(assessment.assetQuality),
          industryOutlook: gradeToScore(assessment.industryOutlook),
          riskFactors: gradeToScore(assessment.riskFactors),
          ownerDependency: gradeToScore(assessment.ownerDependency)
        };
        
        // Generate executive summary with timeout
        let executiveSummary = '';
        const gradeLabel = getLabelForGrade(metrics.overallScore);
        const fallbackSummary = `Executive Summary: ${assessment.company} shows an adjusted EBITDA of $${metrics.adjustedEbitda.toLocaleString()} with an estimated valuation of $${metrics.midEstimate.toLocaleString()}. Based on your Operational Grade of ${metrics.overallScore} ("${gradeLabel}"), a multiplier of ${metrics.valuationMultiple}x was applied to your Adjusted EBITDA to generate the valuation estimate. The analysis indicates ${metrics.overallScore} overall performance across key business drivers.`;
        
        // Use fallback summary for now to prevent timeouts
        executiveSummary = fallbackSummary;
        
        // Update assessment with calculated values, narrative, and summary - validate to prevent overflow
        assessment = await storage.updateValuationAssessment(assessment.id, {
          ...metrics,
          baseEbitda: validateNumeric(metrics.baseEbitda),
          adjustedEbitda: validateNumeric(metrics.adjustedEbitda),
          valuationMultiple: validateNumeric(metrics.valuationMultiple, 99.99),
          lowEstimate: validateNumeric(metrics.lowEstimate),
          midEstimate: validateNumeric(metrics.midEstimate),
          highEstimate: validateNumeric(metrics.highEstimate),
          overallScore: metrics.overallScore,
          narrativeSummary: narrativeAnalysis.narrativeSummary,
          executiveSummary: executiveSummary,
        });

        // Create or update lead record for CRM integration
        try {
          let lead = await storage.getLeadByEmail(assessment.email);
          
          if (lead) {
            // Update existing lead with latest assessment data
            lead = await storage.updateLead(lead.id, {
              firstName: assessment.firstName,
              lastName: assessment.lastName,
              phone: assessment.phone,
              company: assessment.company,
              jobTitle: assessment.jobTitle || undefined,
              valuationAssessmentId: assessment.id,
              estimatedValue: validateNumeric(metrics.midEstimate),
              overallGrade: metrics.overallScore,
              followUpIntent: assessment.followUpIntent,
              totalInteractions: (lead.totalInteractions || 0) + 1,
              leadScore: calculateLeadScore(assessment, metrics),
              lastContactDate: new Date(),
            });
          } else {
            // Create new lead record
            lead = await storage.createLead({
              firstName: assessment.firstName,
              lastName: assessment.lastName,
              email: assessment.email,
              phone: assessment.phone,
              company: assessment.company,
              jobTitle: assessment.jobTitle || undefined,
              leadSource: "valuation_form",
              leadStatus: "new",
              leadScore: calculateLeadScore(assessment, metrics),
              valuationAssessmentId: assessment.id,
              estimatedValue: validateNumeric(metrics.midEstimate),
              overallGrade: metrics.overallScore,
              followUpIntent: assessment.followUpIntent,
              totalInteractions: 1,
              lastContactDate: new Date(),
              tags: [],
            });
          }

          // Log assessment completion activity
          await storage.createLeadActivity({
            leadId: lead.id,
            activityType: "assessment_completed",
            description: `Completed business valuation assessment with ${metrics.overallScore} grade and $${metrics.midEstimate.toLocaleString()} valuation`,
            activityData: JSON.stringify({
              assessmentId: assessment.id,
              valuation: metrics.midEstimate,
              grade: metrics.overallScore,
              followUpIntent: assessment.followUpIntent,
            }),
          });

        } catch (leadError) {
          console.error('Error managing lead data:', leadError);
          // Continue with the rest of the flow even if lead creation fails
        }

        // Generate PDF report with timeout
        console.log('Starting PDF generation...');
        const pdfBuffer = await Promise.race([
          generateValuationPDF(assessment),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('PDF generation timeout')), 15000)
          )
        ]) as Buffer;
        console.log('PDF generated successfully');
        
        // Save PDF file (in a real app, you'd use cloud storage)
        const pdfDir = path.join(process.cwd(), 'pdfs');
        await fs.mkdir(pdfDir, { recursive: true });
        const pdfFileName = `valuation_${assessment.id}_${Date.now()}.pdf`;
        const pdfPath = path.join(pdfDir, pdfFileName);
        await fs.writeFile(pdfPath, pdfBuffer);
        console.log('PDF saved to:', pdfPath);
        
        // Update with PDF URL
        const pdfUrl = `/api/pdf/${pdfFileName}`;
        assessment = await storage.updateValuationAssessment(assessment.id, {
          pdfUrl,
          isProcessed: true,
        });
        console.log('Assessment updated with PDF URL');

        // Send email through GoHighLevel and create contact
        try {
          const ghlResult = await goHighLevelService.processValuationAssessment(assessment, pdfBuffer);
          console.log(`GoHighLevel processing completed:`, {
            contactCreated: ghlResult.contactCreated,
            emailSent: ghlResult.emailSent,
            webhookSent: ghlResult.webhookSent,
            email: assessment.email
          });
        } catch (ghlError) {
          console.error('GoHighLevel processing failed, but continuing:', ghlError);
          // Don't fail the entire request if GoHighLevel fails
        }

      } catch (pdfError) {
        console.error('PDF generation failed, but continuing with webhook:', pdfError);
        
        // Update assessment without PDF
        assessment = await storage.updateValuationAssessment(assessment.id, {
          isProcessed: true,
        });
      }

      // Send additional webhook for legacy compatibility (direct webhook call)
      try {
        // Determine which webhook URL to use based on assessment tier
        let webhookUrl = process.env.GHL_WEBHOOK_FREE_RESULTS; // Default to free results
        
        if (assessment.tier === 'growth' || assessment.tier === 'paid') {
          webhookUrl = process.env.GHL_WEBHOOK_GROWTH_RESULTS;
        } else if (assessment.tier === 'capital') {
          webhookUrl = process.env.GHL_WEBHOOK_CAPITAL_PURCHASE;
        }

        const webhookData = {
          name: `${assessment.firstName} ${assessment.lastName}`,
          email: assessment.email,
          phone: assessment.phone,
          company: assessment.company,
          jobTitle: assessment.jobTitle || '',
          tier: assessment.tier || 'free',
          adjustedEBITDA: metrics.adjustedEbitda,
          valuationEstimate: metrics.midEstimate,
          valuationLow: metrics.lowEstimate,
          valuationHigh: metrics.highEstimate,
          overallScore: metrics.overallScore,
          financialPerformanceGrade: assessment.financialPerformance,
          customerConcentrationGrade: assessment.customerConcentration,
          managementTeamGrade: assessment.managementTeam,
          competitivePositionGrade: assessment.competitivePosition,
          growthProspectsGrade: assessment.growthProspects,
          systemsProcessesGrade: assessment.systemsProcesses,
          assetQualityGrade: assessment.assetQuality,
          industryOutlookGrade: assessment.industryOutlook,
          riskFactorsGrade: assessment.riskFactors,
          ownerDependencyGrade: assessment.ownerDependency,
          followUpIntent: assessment.followUpIntent,
          executiveSummary: assessment.executiveSummary || '',
          submissionDate: new Date().toISOString(),
          leadSource: 'Business Valuation Calculator',
          pdfLink: assessment.pdfUrl ? `${req.protocol}://${req.get('host')}${assessment.pdfUrl}` : null
        };

        console.log(`Sending webhook data to ${assessment.tier || 'free'} tier:`, JSON.stringify(webhookData, null, 2));
        
        // Send to GoHighLevel webhook
        if (webhookUrl) {
          const webhookResponse = await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(webhookData)
          });
          
          console.log('GHL Webhook response status:', webhookResponse.status);
          console.log('GHL Webhook response:', await webhookResponse.text());
          console.log(`Lead data sent to GHL CRM for ${assessment.email} (${assessment.tier || 'free'} tier)`);
        } else {
          console.error('No GHL webhook URL configured for tier:', assessment.tier || 'free');
        }

        // Send to n8n webhook (same data as GHL_WEBHOOK_FREE_RESULTS)
        try {
          const n8nWebhookUrl = 'https://drobosky.app.n8n.cloud/webhook-test/replit-lead';
          const n8nResponse = await fetch(n8nWebhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(webhookData)
          });
          
          console.log('n8n Webhook response status:', n8nResponse.status);
          console.log('n8n Webhook response:', await n8nResponse.text());
          console.log(`Lead data sent to n8n webhook for ${assessment.email}`);
        } catch (n8nError) {
          console.error('n8n webhook failed:', n8nError);
          // Continue even if n8n webhook fails
        }
      } catch (webhookError) {
        console.error('Failed to send lead data to CRM, but continuing:', webhookError);
        // Don't fail the entire request if webhook fails
      }

      res.json(assessment);
    } catch (error) {
      console.error("Error processing valuation:", error);
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Internal server error" 
      });
    }
  });

  // User signup endpoint
  app.post("/api/signup", async (req, res) => {
    try {
      const validatedData = registerUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(validatedData.email);
      if (existingUser) {
        return res.status(400).json({ error: "User already exists with this email" });
      }

      // Hash password
      const saltRounds = 12;
      const passwordHash = await bcrypt.hash(validatedData.password, saltRounds);

      // Create user
      const user = await storage.createCustomUser({
        firstName: validatedData.firstName || '',
        lastName: validatedData.lastName || '',
        email: validatedData.email,
        passwordHash,
      });

      // Create session
      req.session.customUserSessionId = user.id;

      res.json({
        success: true,
        message: "Account created successfully",
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          tier: user.tier,
          authProvider: user.authProvider,
        },
      });
    } catch (error: any) {
      console.error("Signup error:", error);
      res.status(400).json({ error: error.message || "Registration failed" });
    }
  });

  // User login endpoint  
  app.post("/api/login", async (req, res) => {
    try {
      const validatedData = loginUserSchema.parse(req.body);
      
      const user = await storage.validateUserCredentials(validatedData.email, validatedData.password);
      if (!user) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      // Create session
      req.session.customUserSessionId = user.id;

      res.json({
        success: true,
        message: "Login successful",
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          tier: user.tier,
          authProvider: user.authProvider,
        },
      });
    } catch (error: any) {
      console.error("Login error:", error);
      res.status(400).json({ error: error.message || "Login failed" });
    }
  });

  // Admin authentication routes
  app.post("/api/admin/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      // Trim whitespace from inputs
      const trimmedUsername = username?.trim();
      const trimmedPassword = password?.trim();
      
      console.log('Admin login attempt:', { 
        username: trimmedUsername, 
        passwordLength: trimmedPassword?.length 
      });
      
      // Check multiple admin credentials
      const adminCredentials = [
        // Primary admin (Meritage email) 
        { username: 'drobosky@meritage-partners.com', password: 'Cooper12!!' },
        // Fallback admin credentials
        { username: process.env.ADMIN_USERNAME || 'admin', password: process.env.ADMIN_PASSWORD || 'admin123' }
      ];
      
      const isValidAdmin = adminCredentials.some(cred => 
        trimmedUsername === cred.username && trimmedPassword === cred.password
      );
      
      if (isValidAdmin) {
        (req.session as any).adminAuthenticated = true;
        console.log('Admin authentication successful');
        res.json({ success: true, message: 'Authentication successful' });
      } else {
        console.log('Admin authentication failed - invalid credentials');
        res.status(401).json({ error: 'Invalid credentials' });
      }
    } catch (error) {
      console.error('Admin login error:', error);
      res.status(500).json({ error: 'Authentication failed' });
    }
  });

  app.get("/api/admin/status", async (req, res) => {
    // Check if admin is authenticated via admin login ONLY
    if ((req.session as any)?.adminAuthenticated) {
      return res.json({ authenticated: true });
    }

    // No fallback - admin access requires explicit admin login
    res.json({ authenticated: false });
  });

  app.post("/api/admin/logout", (req, res) => {
    (req.session as any).adminAuthenticated = false;
    res.json({ success: true });
  });

  // Team authentication routes
  app.post("/api/team/login", async (req, res) => {
    try {
      const validatedData = loginSchema.parse(req.body);
      const { email, password } = validatedData;

      const teamMember = await storage.getTeamMemberByEmail(email);
      if (!teamMember || !teamMember.isActive) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const isValidPassword = await bcrypt.compare(password, teamMember.hashedPassword);
      if (!isValidPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Create session
      const sessionId = nanoid();
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
      await storage.createTeamSession(teamMember.id, sessionId, expiresAt);

      // Update last login
      await storage.updateTeamMember(teamMember.id, { lastLoginAt: new Date() });

      (req.session as any).teamSessionId = sessionId;

      // Return user without password
      const { hashedPassword, ...userWithoutPassword } = teamMember;
      res.json({ 
        success: true, 
        user: userWithoutPassword,
        mustChangePassword: teamMember.mustChangePassword,
        message: 'Login successful' 
      });
    } catch (error) {
      res.status(400).json({ error: 'Invalid request data' });
    }
  });

  app.get("/api/team/me", isTeamAuthenticated, (req: any, res) => {
    if (!req.user) {
      return res.status(401).json({ error: 'User not found' });
    }
    const { hashedPassword, ...userWithoutPassword } = req.user;
    res.json({ user: userWithoutPassword });
  });

  app.post("/api/team/logout", isTeamAuthenticated, async (req, res) => {
    try {
      const sessionId = (req.session as any)?.teamSessionId;
      if (sessionId) {
        await storage.deleteTeamSession(sessionId);
      }
      (req.session as any).teamSessionId = null;
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Logout failed' });
    }
  });

  // Team management routes (admin only)
  app.get("/api/team/members", isAdminOrTeamAuthenticated, requireRole(['admin']), async (req, res) => {
    try {
      const members = await storage.getAllTeamMembers();
      const membersWithoutPasswords = members.map(({ hashedPassword, ...member }) => member);
      res.json(membersWithoutPasswords);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch team members' });
    }
  });

  app.post("/api/team/members", isAdminOrTeamAuthenticated, requireRole(['admin']), async (req, res) => {
    try {
      const validatedData = insertTeamMemberSchema.parse(req.body);
      const { password, ...memberData } = validatedData;

      // Check if email already exists
      const existingMember = await storage.getTeamMemberByEmail(memberData.email);
      if (existingMember) {
        return res.status(400).json({ error: 'Email already exists' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12);

      const newMember = await storage.createTeamMember({
        ...memberData,
        hashedPassword,
      } as any);

      // Send welcome email via GoHighLevel
      try {
        const welcomeEmailData = {
          contactId: null, // Will create contact if needed
          email: memberData.email,
          firstName: memberData.firstName,
          lastName: memberData.lastName,
          phone: '', // Optional for team members
          subject: 'Welcome to Apple Bites Business Assessment - Team Account Created',
          emailContent: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #1e40af;">Welcome to Apple Bites Business Assessment</h2>
              <p>Hello ${memberData.firstName} ${memberData.lastName},</p>
              <p>Your team account has been successfully created! You now have access to the Apple Bites Business Assessment admin dashboard.</p>
              
              <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #334155; margin-top: 0;">Account Details:</h3>
                <ul style="list-style: none; padding: 0;">
                  <li style="margin: 8px 0;"><strong>Email:</strong> ${memberData.email}</li>
                  <li style="margin: 8px 0;"><strong>Role:</strong> ${memberData.role}</li>
                  <li style="margin: 8px 0;"><strong>Temporary Password:</strong> ${password}</li>
                </ul>
              </div>
              
              <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; border-left: 4px solid #f59e0b;">
                <p style="margin: 0;"><strong>Important:</strong> Please log in at your earliest convenience and change your password for security. You'll be prompted to update your password on first login.</p>
              </div>
              
              <p style="margin-top: 20px;">You can access the admin dashboard at: <a href="https://applebites.ai/admin" style="color: #1e40af;">https://applebites.ai/admin</a></p>
              
              <p>Best regards,<br>
              <strong>Meritage Partners Team</strong><br>
              Apple Bites Business Assessment</p>
            </div>
          `,
          isTeamMember: true
        };

        const ghlResult = await goHighLevelService.sendTeamWelcomeEmail(welcomeEmailData);
        console.log(`Welcome email sent to team member ${memberData.email}:`, {
          emailSent: ghlResult.emailSent,
          contactCreated: ghlResult.contactCreated
        });
      } catch (emailError) {
        console.error('Failed to send welcome email via GHL:', emailError);
        // Don't fail the entire operation if email fails
      }

      const { hashedPassword: _, ...memberWithoutPassword } = newMember;
      res.status(201).json(memberWithoutPassword);
    } catch (error) {
      res.status(400).json({ error: 'Failed to create team member' });
    }
  });

  app.put("/api/team/members/:id", isTeamAuthenticated, requireRole(['admin']), async (req, res) => {
    try {
      const memberId = parseInt(req.params.id);
      const updates = req.body;

      // Don't allow updating password through this endpoint
      delete updates.hashedPassword;
      delete updates.password;

      const updatedMember = await storage.updateTeamMember(memberId, updates);
      const { hashedPassword, ...memberWithoutPassword } = updatedMember;
      res.json(memberWithoutPassword);
    } catch (error) {
      res.status(400).json({ error: 'Failed to update team member' });
    }
  });

  app.delete("/api/team/members/:id", isTeamAuthenticated, requireRole(['admin']), async (req: any, res) => {
    try {
      const memberId = parseInt(req.params.id);
      
      // Don't allow deleting yourself
      if (req.user && memberId === req.user.id) {
        return res.status(400).json({ error: 'Cannot delete your own account' });
      }

      await storage.deleteTeamMember(memberId);
      res.json({ success: true });
    } catch (error) {
      res.status(400).json({ error: 'Failed to delete team member' });
    }
  });

  // Password change endpoint
  app.post("/api/team/change-password", isTeamAuthenticated, async (req: any, res) => {
    try {
      const { currentPassword, newPassword } = req.body;
      if (!req.user) {
        return res.status(401).json({ error: 'User not found' });
      }
      const userId = req.user.id;

      if (!currentPassword || !newPassword) {
        return res.status(400).json({ error: 'Current password and new password are required' });
      }

      // Get current user
      const user = await storage.getTeamMemberById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Verify current password
      const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.hashedPassword);
      if (!isCurrentPasswordValid) {
        return res.status(400).json({ error: 'Current password is incorrect' });
      }

      // Hash new password
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);

      // Update password and clear mustChangePassword flag
      await storage.updateTeamMember(userId, { 
        hashedPassword: hashedNewPassword,
        mustChangePassword: false
      });

      res.json({ success: true, message: 'Password changed successfully' });
    } catch (error) {
      console.error('Error changing password:', error);
      res.status(500).json({ error: 'Failed to change password' });
    }
  });

  // Lead management routes (protected)
  app.get("/api/leads", isAdminAuthenticated, async (req, res) => {
    try {
      const { status, search } = req.query;
      
      let leads;
      if (search) {
        leads = await storage.searchLeads(search as string);
      } else if (status) {
        leads = await storage.getLeadsByStatus(status as string);
      } else {
        leads = await storage.getAllLeads();
      }
      
      res.json(leads);
    } catch (error) {
      console.error('Error fetching leads:', error);
      res.status(500).json({ error: "Failed to fetch leads" });
    }
  });

  // GET /api/users - Get all users (consumers)
  app.get("/api/users", isAdminAuthenticated, async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      // Remove sensitive information like password hashes
      const safeUsers = users.map(({ passwordHash, ...user }) => user);
      res.json(safeUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });

  // Delete single user
  app.delete("/api/users/:id", isAdminAuthenticated, async (req, res) => {
    try {
      const userId = req.params.id;
      await storage.deleteUser(userId);
      res.json({ success: true, message: "User deleted successfully" });
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ error: "Failed to delete user" });
    }
  });

  // Delete all users (bulk cleanup)
  app.delete("/api/users", isAdminAuthenticated, async (req, res) => {
    try {
      await storage.deleteAllUsers();
      res.json({ success: true, message: "All users deleted successfully" });
    } catch (error) {
      console.error("Error deleting all users:", error);
      res.status(500).json({ error: "Failed to delete all users" });
    }
  });

  // Delete multiple users
  app.post("/api/users/delete-multiple", isAdminAuthenticated, async (req, res) => {
    try {
      const { userIds } = req.body;
      if (!Array.isArray(userIds) || userIds.length === 0) {
        return res.status(400).json({ error: "userIds array is required and must not be empty" });
      }
      await storage.deleteMultipleUsers(userIds);
      res.json({ success: true, message: `${userIds.length} users deleted successfully` });
    } catch (error) {
      console.error("Error deleting multiple users:", error);
      res.status(500).json({ error: "Failed to delete multiple users" });
    }
  });

  // Update user tier
  app.patch("/api/users/:id/tier", isAdminAuthenticated, async (req, res) => {
    try {
      const userId = req.params.id;
      const { tier } = req.body;
      
      if (!tier || !['free', 'growth', 'capital'].includes(tier)) {
        return res.status(400).json({ error: "Valid tier is required (free, growth, capital)" });
      }
      
      const updatedUser = await storage.updateUserTier(userId, tier);
      res.json({ success: true, user: updatedUser });
    } catch (error) {
      console.error("Error updating user tier:", error);
      res.status(500).json({ error: "Failed to update user tier" });
    }
  });

  app.get("/api/leads/:id", isAdminAuthenticated, async (req, res) => {
    try {
      const leadId = parseInt(req.params.id);
      const lead = await storage.getLeadById(leadId);
      
      if (!lead) {
        return res.status(404).json({ error: "Lead not found" });
      }
      
      res.json(lead);
    } catch (error) {
      console.error('Error fetching lead:', error);
      res.status(500).json({ error: "Failed to fetch lead" });
    }
  });

  app.put("/api/leads/:id", isAdminAuthenticated, async (req, res) => {
    try {
      const leadId = parseInt(req.params.id);
      const updates = req.body;
      
      const lead = await storage.updateLead(leadId, updates);
      res.json(lead);
    } catch (error) {
      console.error('Error updating lead:', error);
      res.status(500).json({ error: "Failed to update lead" });
    }
  });

  app.patch("/api/leads/:id", isAdminAuthenticated, async (req, res) => {
    try {
      const leadId = parseInt(req.params.id);
      const { status } = req.body;
      
      const lead = await storage.updateLead(leadId, { leadStatus: status });
      res.json(lead);
    } catch (error) {
      console.error('Error updating lead status:', error);
      res.status(500).json({ error: "Failed to update lead status" });
    }
  });

  app.delete("/api/leads/:id", isAdminAuthenticated, async (req, res) => {
    try {
      const leadId = parseInt(req.params.id);
      
      // Check if lead exists
      const lead = await storage.getLeadById(leadId);
      if (!lead) {
        return res.status(404).json({ error: "Lead not found" });
      }
      
      await storage.deleteLead(leadId);
      res.json({ success: true, message: "Lead deleted successfully" });
    } catch (error) {
      console.error('Error deleting lead:', error);
      res.status(500).json({ error: "Failed to delete lead" });
    }
  });

  app.get("/api/leads/:id/activities", isAdminAuthenticated, async (req, res) => {
    try {
      const leadId = parseInt(req.params.id);
      const activities = await storage.getLeadActivities(leadId);
      res.json(activities);
    } catch (error) {
      console.error('Error fetching lead activities:', error);
      res.status(500).json({ error: "Failed to fetch lead activities" });
    }
  });

  app.post("/api/leads/:id/activities", isAdminAuthenticated, async (req, res) => {
    try {
      const leadId = parseInt(req.params.id);
      const activityData = { ...req.body, leadId };
      
      const activity = await storage.createLeadActivity(activityData);
      res.json(activity);
    } catch (error) {
      console.error('Error creating lead activity:', error);
      res.status(500).json({ error: "Failed to create lead activity" });
    }
  });

  // GET /api/analytics/assessments - Get all assessments for analytics
  app.get("/api/analytics/assessments", async (req, res) => {
    try {
      const assessments = await storage.getAllValuationAssessments();
      res.json(assessments);
    } catch (error) {
      console.error("Error fetching analytics data:", error);
      res.status(500).json({ message: "Failed to fetch analytics data" });
    }
  })

  // GET /api/assessments - Get user-specific assessments for dashboard and past assessments
  app.get("/api/assessments", async (req, res) => {
    try {
      // Check if user is authenticated (either system)
      const userId = req.session.userId || req.session.customUserSessionId;
      if (!userId) {
        return res.status(401).json({ error: "Authentication required" });
      }

      // Get user's email from session to filter assessments
      let user;
      if (req.session.userId) {
        user = await storage.getUserById(req.session.userId);
      } else {
        user = await storage.getUserById(req.session.customUserSessionId);
      }
      
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const assessments = await storage.getAllValuationAssessments();
      
      // Filter assessments by user's email
      const userAssessments = assessments.filter(assessment => 
        assessment.email === user.email
      );

      // Sort by creation date, newest first
      const sortedAssessments = userAssessments
        .sort((a, b) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime())
        .map(assessment => ({
          id: assessment.id,
          firstName: assessment.firstName || 'Unknown',
          lastName: assessment.lastName || 'User',
          company: assessment.company || 'Business Assessment',
          email: assessment.email,
          adjustedEbitda: assessment.adjustedEbitda,
          midEstimate: assessment.midEstimate,
          lowEstimate: assessment.lowEstimate,
          highEstimate: assessment.highEstimate,
          valuationMultiple: assessment.valuationMultiple,
          overallScore: assessment.overallScore,
          tier: assessment.tier || 'free',
          reportTier: assessment.reportTier || 'free',
          createdAt: assessment.createdAt,
          pdfUrl: assessment.pdfUrl,
          isProcessed: assessment.isProcessed,
          executiveSummary: assessment.executiveSummary
        }));
      
      res.json(sortedAssessments);
    } catch (error) {
      console.error("Error fetching user assessments:", error);
      res.status(500).json({ error: "Failed to fetch assessments" });
    }
  });



  // GET /api/analytics/metrics - Get summary metrics
  app.get("/api/analytics/metrics", async (req, res) => {
    try {
      const assessments = await storage.getAllValuationAssessments();
      
      const metrics = {
        totalAssessments: assessments.length,
        completedAssessments: assessments.filter(a => a.isProcessed).length,
        averageValuation: assessments.length > 0 
          ? assessments.reduce((sum, a) => sum + parseFloat(a.midEstimate || "0"), 0) / assessments.length 
          : 0,
        totalEbitda: assessments.reduce((sum, a) => sum + parseFloat(a.adjustedEbitda || "0"), 0),
        followUpDistribution: assessments.reduce((acc, a) => {
          acc[a.followUpIntent] = (acc[a.followUpIntent] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
        scoreDistribution: assessments.reduce((acc, a) => {
          const score = a.overallScore?.charAt(0) || 'C';
          acc[score] = (acc[score] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
        monthlyTrends: assessments.reduce((acc, a) => {
          const month = new Date(a.createdAt || '').toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
          acc[month] = (acc[month] || 0) + 1;
          return acc;
        }, {} as Record<string, number>)
      };
      
      res.json(metrics);
    } catch (error) {
      console.error("Error calculating metrics:", error);
      res.status(500).json({ message: "Failed to calculate metrics" });
    }
  });

  // GET /api/test-n8n-webhook - Test n8n webhook specifically
  app.get("/api/test-n8n-webhook", async (req, res) => {
    try {
      const testData = {
        name: "n8n Test User",
        email: "n8n-test@example.com",
        phone: "555-0123",
        company: "n8n Test Company",
        jobTitle: "CEO",
        tier: "free",
        adjustedEBITDA: 100000,
        valuationEstimate: 500000,
        valuationLow: 400000,
        valuationHigh: 600000,
        overallScore: "B+",
        financialPerformanceGrade: "A",
        customerConcentrationGrade: "B", 
        managementTeamGrade: "A",
        competitivePositionGrade: "B",
        growthProspectsGrade: "A",
        systemsProcessesGrade: "C",
        assetQualityGrade: "B",
        industryOutlookGrade: "B",
        riskFactorsGrade: "B",
        ownerDependencyGrade: "C",
        followUpIntent: "yes",
        executiveSummary: "Test summary for n8n webhook integration",
        submissionDate: new Date().toISOString(),
        leadSource: "Business Valuation Calculator",
        pdfLink: null
      };

      console.log('Testing n8n webhook with complete field data:', JSON.stringify(testData, null, 2));
      
      const n8nWebhookUrl = 'https://drobosky.app.n8n.cloud/webhook-test/replit-lead';
      const n8nResponse = await fetch(n8nWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testData)
      });
      
      const responseText = await n8nResponse.text();
      console.log('n8n webhook test response status:', n8nResponse.status);
      console.log('n8n webhook test response:', responseText);
      
      res.json({
        status: n8nResponse.status,
        response: responseText,
        success: n8nResponse.ok,
        sentData: testData
      });
    } catch (error) {
      console.error('n8n webhook test failed:', error);
      res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
  });

  // GET /api/test-webhook-new - Test webhook with new field structure
  app.get("/api/test-webhook-new", async (req, res) => {
    try {
      const testData = {
        name: "Email Template Test",
        email: "email-template-test@example.com",
        phone: "555-0123",
        company: "Email Test Company",
        jobTitle: "CEO",
        adjustedEBITDA: 100000,
        valuationEstimate: 500000,
        valuationLow: 400000,
        valuationHigh: 600000,
        overallScore: "B+",
        financialPerformanceGrade: "A",
        customerConcentrationGrade: "B", 
        managementTeamGrade: "A",
        competitivePositionGrade: "B",
        growthProspectsGrade: "A",
        systemsProcessesGrade: "C",
        assetQualityGrade: "B",
        industryOutlookGrade: "B",
        riskFactorsGrade: "B",
        ownerDependencyGrade: "C",
        followUpIntent: "yes",
        executiveSummary: "Test summary with complete field mapping for GoHighLevel integration",
        submissionDate: new Date().toISOString(),
        leadSource: "Business Valuation Calculator",
        pdfLink: null
      };

      console.log('Testing NEW webhook with complete field data:', JSON.stringify(testData, null, 2));
      
      const webhookUrl = process.env.GHL_WEBHOOK_FREE_RESULTS || 'https://services.leadconnectorhq.com/hooks/QNFFrENaRuI2JhldFd0Z/webhook-trigger/dc1a8a7f-47ee-4c9a-b474-e1aeb21af3e3';
      const webhookResponse = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testData)
      });
      
      const responseText = await webhookResponse.text();
      console.log('NEW webhook test response status:', webhookResponse.status);
      console.log('NEW webhook test response:', responseText);
      
      res.json({
        status: webhookResponse.status,
        response: responseText,
        success: webhookResponse.ok,
        sentData: testData
      });
    } catch (error) {
      console.error('NEW webhook test failed:', error);
      res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
  });

  // GET /api/test-webhook-purchase - Test purchase webhook
  app.get("/api/test-webhook-purchase", async (req, res) => {
    try {
      const { tier = 'growth' } = req.query;
      
      const testPurchaseData = {
        email: "test-purchase@example.com",
        firstName: "Test",
        lastName: "Purchaser",
        phone: "555-0123",
        company: "Test Purchase Company",
        tier: tier as 'growth' | 'capital',
        amount: tier === 'capital' ? 2500 : 795,
        transactionId: `test_${Date.now()}`
      };

      console.log(`Testing ${tier} purchase webhook:`, JSON.stringify(testPurchaseData, null, 2));
      
      const result = await goHighLevelService.processPurchaseEvent(testPurchaseData);
      
      res.json({
        success: true,
        tier,
        result,
        testData: testPurchaseData
      });
    } catch (error) {
      console.error('Purchase webhook test failed:', error);
      res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
  });

  // GET /api/test-webhook - Test webhook connection with all fields
  app.get("/api/test-webhook", async (req, res) => {
    try {
      const testData = {
        name: "Test User",
        email: "test@example.com",
        phone: "555-0123",
        company: "Test Company",
        jobTitle: "CEO",
        adjustedEBITDA: 100000,
        valuationEstimate: 500000,
        valuationLow: 400000,
        valuationHigh: 600000,
        overallScore: "B+",
        driverGrades: {
          "Financial Performance": "A",
          "Customer Concentration": "B",
          "Management Team": "A"
        },
        followUpIntent: "yes",
        executiveSummary: "Test summary",
        pdfLink: null
      };

      console.log('Testing webhook with complete field data:', JSON.stringify(testData, null, 2));
      
      const webhookUrl = process.env.GHL_WEBHOOK_FREE_RESULTS || 'https://services.leadconnectorhq.com/hooks/QNFFrENaRuI2JhldFd0Z/webhook-trigger/dc1a8a7f-47ee-4c9a-b474-e1aeb21af3e3';
      const webhookResponse = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testData)
      });
      
      const responseText = await webhookResponse.text();
      console.log('Webhook test response status:', webhookResponse.status);
      console.log('Webhook test response:', responseText);
      
      res.json({
        status: webhookResponse.status,
        response: responseText,
        success: webhookResponse.ok
      });
    } catch (error) {
      console.error('Webhook test failed:', error);
      res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
  });

  // GET /api/pdf/:filename - Serve PDF files
  app.get("/api/pdf/:filename", async (req, res) => {
    try {
      const { filename } = req.params;
      const pdfPath = path.join(process.cwd(), 'pdfs', filename);
      
      const fileExists = await fs.access(pdfPath).then(() => true).catch(() => false);
      if (!fileExists) {
        return res.status(404).json({ message: "PDF not found" });
      }

      const pdfBuffer = await fs.readFile(pdfPath);
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.send(pdfBuffer);
    } catch (error) {
      console.error("Error serving PDF:", error);
      res.status(500).json({ message: "Error retrieving PDF" });
    }
  });

  // GET /api/assessments - Get all assessments (for admin/debugging)
  app.get("/api/assessments", async (req, res) => {
    try {
      const assessments = await storage.getAllValuationAssessments();
      res.json(assessments);
    } catch (error) {
      console.error("Error fetching assessments:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // GET /api/assessment/:id - Get specific assessment
  app.get("/api/assessment/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const assessment = await storage.getValuationAssessment(id);
      
      if (!assessment) {
        return res.status(404).json({ message: "Assessment not found" });
      }
      
      res.json(assessment);
    } catch (error) {
      console.error("Error fetching assessment:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // User Authentication and Management Routes

  // POST /api/auth/login - User login with email/password
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
      }

      // Get user by email
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      // Check if user needs to create password
      if (!user.passwordHash) {
        return res.status(200).json({ 
          needsPasswordCreation: true,
          userId: user.id,
          email: user.email,
          tier: user.tier
        });
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
      if (!isPasswordValid) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      // Create session
      req.session.userId = user.id;
      req.session.userEmail = user.email;
      req.session.userTier = user.tier;

      res.json({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          tier: user.tier,
          resultReady: user.resultReady
        },
        redirectTo: `/dashboard/${user.tier}`
      });

    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // POST /api/auth/create-password - Create password for new user
  app.post("/api/auth/create-password", async (req, res) => {
    try {
      const { email, password, confirmPassword } = req.body;

      if (!email || !password || !confirmPassword) {
        return res.status(400).json({ error: "All fields are required" });
      }

      if (password !== confirmPassword) {
        return res.status(400).json({ error: "Passwords don't match" });
      }

      if (password.length < 8) {
        return res.status(400).json({ error: "Password must be at least 8 characters" });
      }

      // Get user by email
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      if (user.passwordHash) {
        return res.status(400).json({ error: "User already has a password" });
      }

      // Hash password and update user
      const passwordHash = await bcrypt.hash(password, 12);
      await storage.updateUser(user.id, {
        passwordHash,
        awaitingPasswordCreation: false
      });

      // Create session using customUserSessionId for consistency
      req.session.customUserSessionId = user.id;
      req.session.userEmail = user.email;
      req.session.userTier = user.tier;

      res.json({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          tier: user.tier,
          resultReady: user.resultReady
        },
        redirectTo: `/dashboard/${user.tier}`
      });

    } catch (error) {
      console.error('Create password error:', error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // GET /api/auth/me - Get current user info
  app.get("/api/auth/me", async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ error: "Not authenticated" });
      }

      const user = await storage.getUserById(req.session.userId);
      if (!user) {
        return res.status(401).json({ error: "User not found" });
      }

      res.json({
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        tier: user.tier,
        resultReady: user.resultReady,
        awaitingPasswordCreation: user.awaitingPasswordCreation
      });

    } catch (error) {
      console.error('Get user error:', error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // POST /api/auth/logout - Logout user
  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error('Logout error:', err);
        return res.status(500).json({ error: "Failed to logout" });
      }
      res.json({ success: true });
    });
  });

  // Webhook endpoint to receive growth purchase data FROM GoHighLevel (v2.0)
  app.post("/api/webhook/growth-purchase", async (req, res) => {
    try {
      console.log('Received Growth Purchase webhook (v2.0):', JSON.stringify(req.body, null, 2));
      
      const webhookData = req.body;
      
      // Extract purchase information from webhook payload
      const purchaseData = {
        firstName: webhookData.contact?.first_name || webhookData.first_name || webhookData.firstName,
        lastName: webhookData.contact?.last_name || webhookData.last_name || webhookData.lastName,
        email: webhookData.contact?.email || webhookData.email,
        phone: webhookData.contact?.phone || webhookData.phone,
        company: webhookData.contact?.company_name || webhookData.company || webhookData.companyName,
        amount: webhookData.amount || webhookData.purchase_amount || 795,
        transactionId: webhookData.transaction_id || webhookData.transactionId || webhookData.id,
        ghlContactId: webhookData.contact?.id || webhookData.ghl_contact_id,
        tier: 'growth' as const
      };

      // Only process if we have valid purchase data
      if (!purchaseData.email) {
        console.log('No email found in growth purchase webhook data, skipping...');
        return res.status(200).json({ message: 'No email provided, skipped' });
      }

      // Check if user already exists
      const existingUser = await storage.getUserByEmail(purchaseData.email);
      
      if (existingUser) {
        // Update existing user with purchase information
        await storage.updateUser(existingUser.id, {
          tier: 'growth',
          ghlContactId: purchaseData.ghlContactId,
          resultReady: false, // Will be set to true when results are processed
          awaitingPasswordCreation: !existingUser.passwordHash
        });
        
        console.log(`Updated existing user ${existingUser.id} with growth purchase`);
        
        // Update GoHighLevel contact with purchase information
        try {
          const ghlContactData = {
            firstName: existingUser.firstName,
            lastName: existingUser.lastName,
            email: existingUser.email,
            phone: purchaseData.phone,
            companyName: purchaseData.company,
            tags: ['applebites-user', 'growth-tier', 'ghl-purchase'],
            customFields: {
              tier: 'growth',
              purchaseDate: new Date().toISOString(),
              purchaseAmount: purchaseData.amount,
              transactionId: purchaseData.transactionId,
              source: 'ghl_webhook_purchase'
            }
          };
          
          await goHighLevelService.createOrUpdateContact(ghlContactData);
          console.log(`Updated GHL contact for user ${existingUser.id} via webhook purchase`);
        } catch (ghlError) {
          console.error('Failed to update GHL contact during webhook purchase:', ghlError);
        }
      } else {
        // Create new user for the purchase
        const fullName = `${purchaseData.firstName || ''} ${purchaseData.lastName || ''}`.trim();
        const newUser = await storage.createUser({
          email: purchaseData.email,
          fullName: fullName || purchaseData.email,
          passwordHash: null,
          tier: 'growth',
          ghlContactId: purchaseData.ghlContactId,
          awaitingPasswordCreation: true,
          resultReady: false
        });
        
        console.log(`Created new user ${newUser.id} for growth purchase`);
        
        // Update GoHighLevel contact with purchase information
        try {
          const ghlContactData = {
            firstName: purchaseData.firstName,
            lastName: purchaseData.lastName,
            email: purchaseData.email,
            phone: purchaseData.phone,
            companyName: purchaseData.company,
            tags: ['applebites-user', 'growth-tier', 'ghl-purchase', 'new-customer'],
            customFields: {
              tier: 'growth',
              signupDate: new Date().toISOString(),
              purchaseDate: new Date().toISOString(),
              purchaseAmount: purchaseData.amount,
              transactionId: purchaseData.transactionId,
              source: 'ghl_webhook_purchase'
            }
          };
          
          await goHighLevelService.createOrUpdateContact(ghlContactData);
          console.log(`Updated GHL contact for new user ${newUser.id} via webhook purchase`);
        } catch (ghlError) {
          console.error('Failed to update GHL contact for new webhook purchase user:', ghlError);
        }
      }

      // Also create/update lead record for tracking
      const existingLead = await storage.getLeadByEmail(purchaseData.email);
      let leadId = existingLead?.id;
      
      if (existingLead) {
        await storage.updateLead(existingLead.id, {
          leadStatus: 'purchased',
          tags: [...(existingLead.tags || []), 'Growth Tier Purchase'],
          notes: `${existingLead.notes || ''}\n[${new Date().toISOString()}] Growth tier purchased via GoHighLevel webhook - Amount: $${purchaseData.amount}`.trim()
        });
      } else {
        const newLead = await storage.createLead({
          firstName: purchaseData.firstName || '',
          lastName: purchaseData.lastName || '',
          email: purchaseData.email,
          phone: purchaseData.phone || '',
          company: purchaseData.company || '',
          leadSource: 'growth_tier_purchase',
          leadStatus: 'purchased',
          tags: ['Growth Tier Purchase'],
          notes: `[${new Date().toISOString()}] Growth tier purchased via GoHighLevel webhook - Amount: $${purchaseData.amount}`
        });
        leadId = newLead.id;
      }

      // Log the purchase activity
      if (leadId) {
        await storage.createLeadActivity({
          leadId,
          activityType: 'purchase',
          description: `Growth tier purchased - Amount: $${purchaseData.amount}`,
          metadata: {
            tier: 'growth',
            amount: purchaseData.amount,
            transactionId: purchaseData.transactionId,
            source: 'gohighlevel_webhook'
          }
        });
      }

      res.status(200).json({ 
        message: 'Growth purchase webhook processed successfully',
        userCreated: !existingUser,
        leadId: leadId,
        purchaseAmount: purchaseData.amount
      });
      
    } catch (error) {
      console.error('Growth purchase webhook processing failed:', error);
      res.status(500).json({ error: 'Failed to process growth purchase webhook' });
    }
  });

  // Webhook endpoint to receive capital purchase data FROM GoHighLevel (v3.0)
  app.post("/api/webhook/capital-purchase", async (req, res) => {
    try {
      console.log('Received Capital Purchase webhook (v3.0):', JSON.stringify(req.body, null, 2));
      
      const webhookData = req.body;
      
      // Extract purchase information from webhook payload
      const purchaseData = {
        firstName: webhookData.contact?.first_name || webhookData.first_name || webhookData.firstName,
        lastName: webhookData.contact?.last_name || webhookData.last_name || webhookData.lastName,
        email: webhookData.contact?.email || webhookData.email,
        phone: webhookData.contact?.phone || webhookData.phone,
        company: webhookData.contact?.company_name || webhookData.company || webhookData.companyName,
        amount: webhookData.amount || webhookData.purchase_amount || 2500,
        transactionId: webhookData.transaction_id || webhookData.transactionId || webhookData.id,
        ghlContactId: webhookData.contact?.id || webhookData.ghl_contact_id,
        tier: 'capital' as const
      };

      // Only process if we have valid purchase data
      if (!purchaseData.email) {
        console.log('No email found in capital purchase webhook data, skipping...');
        return res.status(200).json({ message: 'No email provided, skipped' });
      }

      // Check if user already exists
      const existingUser = await storage.getUserByEmail(purchaseData.email);
      
      if (existingUser) {
        // Update existing user with purchase information
        await storage.updateUser(existingUser.id, {
          tier: 'capital',
          ghlContactId: purchaseData.ghlContactId,
          resultReady: false,
          awaitingPasswordCreation: !existingUser.passwordHash
        });
        
        console.log(`Updated existing user ${existingUser.id} with capital purchase`);
      } else {
        // Create new user for the purchase
        const fullName = `${purchaseData.firstName || ''} ${purchaseData.lastName || ''}`.trim();
        const newUser = await storage.createUser({
          email: purchaseData.email,
          fullName: fullName || purchaseData.email,
          passwordHash: null,
          tier: 'capital',
          ghlContactId: purchaseData.ghlContactId,
          awaitingPasswordCreation: true,
          resultReady: false
        });
        
        console.log(`Created new user ${newUser.id} for capital purchase`);
      }

      // Also create/update lead record for tracking
      const existingLead = await storage.getLeadByEmail(purchaseData.email);
      let leadId = existingLead?.id;
      
      if (existingLead) {
        await storage.updateLead(existingLead.id, {
          leadStatus: 'purchased',
          tags: [...(existingLead.tags || []), 'Capital Tier Purchase'],
          notes: `${existingLead.notes || ''}\n[${new Date().toISOString()}] Capital tier purchased via GoHighLevel webhook - Amount: $${purchaseData.amount}`.trim()
        });
      } else {
        const newLead = await storage.createLead({
          firstName: purchaseData.firstName || '',
          lastName: purchaseData.lastName || '',
          email: purchaseData.email,
          phone: purchaseData.phone || '',
          company: purchaseData.company || '',
          leadSource: 'capital_tier_purchase',
          leadStatus: 'purchased',
          tags: ['Capital Tier Purchase'],
          notes: `[${new Date().toISOString()}] Capital tier purchased via GoHighLevel webhook - Amount: $${purchaseData.amount}`
        });
        leadId = newLead.id;
      }

      // Log the purchase activity
      if (leadId) {
        await storage.createLeadActivity({
          leadId,
          activityType: 'purchase',
          description: `Capital tier purchased - Amount: $${purchaseData.amount}`,
          metadata: {
            tier: 'capital',
            amount: purchaseData.amount,
            transactionId: purchaseData.transactionId,
            source: 'gohighlevel_webhook'
          }
        });
      }

      res.status(200).json({ 
        message: 'Capital purchase webhook processed successfully',
        userCreated: !existingUser,
        leadId: leadId,
        purchaseAmount: purchaseData.amount
      });
      
    } catch (error) {
      console.error('Capital purchase webhook processing failed:', error);
      res.status(500).json({ error: 'Failed to process capital purchase webhook' });
    }
  });

  // Webhook endpoint to receive valuation assessment data FROM GoHighLevel
  app.post("/api/webhook/gohighlevel", async (req, res) => {
    try {
      console.log('Received GoHighLevel webhook:', JSON.stringify(req.body, null, 2));
      
      const webhookData = req.body;
      
      // Only process valuation-related contacts (check for specific tags or event types)
      const hasValuationEvent = webhookData.event === 'valuation_completed';
      const hasValuationTag = (webhookData.contact?.tags && Array.isArray(webhookData.contact.tags) && webhookData.contact.tags.includes('Business Valuation Lead')) ||
                             (webhookData.tags && Array.isArray(webhookData.tags) && webhookData.tags.includes('Business Valuation Lead'));
      const hasValuationSource = webhookData.contact?.leadSource === 'valuation_form' ||
                                 webhookData.leadSource === 'valuation_form';
      
      const isValuationLead = hasValuationEvent || hasValuationTag || hasValuationSource;
      

      
      if (!isValuationLead) {
        console.log('Not a valuation lead, skipping webhook processing...');
        return res.status(200).json({ message: 'Not a valuation lead, skipped' });
      }
      
      // Extract contact information from webhook payload
      const contactData = {
        firstName: webhookData.contact?.first_name || webhookData.first_name || webhookData.firstName,
        lastName: webhookData.contact?.last_name || webhookData.last_name || webhookData.lastName,
        email: webhookData.contact?.email || webhookData.email,
        phone: webhookData.contact?.phone || webhookData.phone,
        company: webhookData.contact?.company_name || webhookData.company || webhookData.companyName,
        jobTitle: webhookData.contact?.job_title || webhookData.jobTitle || '',
        leadSource: 'valuation_form',
        leadStatus: 'new'
      };

      // Only process if we have valid contact data
      if (!contactData.email) {
        console.log('No email found in webhook data, skipping...');
        return res.status(200).json({ message: 'No email provided, skipped' });
      }

      // Check if lead already exists by email
      const existingLead = await storage.getLeadByEmail(contactData.email);

      if (existingLead) {
        console.log(`Lead already exists for ${contactData.email}, updating...`);
        // Update existing lead with any new information
        const updatedLead = await storage.updateLead(existingLead.id, {
          firstName: contactData.firstName,
          lastName: contactData.lastName,
          phone: contactData.phone,
          company: contactData.company,
          jobTitle: contactData.jobTitle,
          notes: `${existingLead.notes || ''}\n[${new Date().toISOString()}] Updated via GoHighLevel webhook`.trim()
        });
        
        return res.status(200).json({ 
          message: 'Lead updated successfully', 
          leadId: updatedLead.id,
          action: 'updated'
        });
      } else {
        console.log(`Creating new lead for ${contactData.email}...`);
        // Create new lead
        const newLead = await storage.createLead({
          firstName: contactData.firstName,
          lastName: contactData.lastName,
          email: contactData.email,
          phone: contactData.phone,
          company: contactData.company,
          jobTitle: contactData.jobTitle,
          leadSource: contactData.leadSource,
          leadStatus: contactData.leadStatus,
          notes: `[${new Date().toISOString()}] Created via GoHighLevel webhook`
        });
        
        return res.status(200).json({ 
          message: 'Lead created successfully', 
          leadId: newLead.id,
          action: 'created'
        });
      }
      
    } catch (error) {
      console.error('GoHighLevel webhook processing failed:', error);
      res.status(500).json({
        error: 'Webhook processing failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });



  // POST /api/report/generate-enhanced - Generate paid tier PDF with NAICS-specific multipliers
  app.post("/api/report/generate-enhanced", async (req, res) => {
    try {
      const { assessmentId, naicsCode, sicCode, industryDescription, foundingYear, sendEmail = false } = req.body;
      
      const assessment = await storage.getValuationAssessment(assessmentId);
      if (!assessment) {
        return res.status(404).json({ message: "Assessment not found" });
      }

      // Update assessment with industry data for paid tier
      const updatedData: any = {
        reportTier: 'paid',
        naicsCode,
        sicCode,
        industryDescription,
        foundingYear
      };

      // For paid tier, recalculate with comprehensive NAICS-specific multipliers
      if (naicsCode) {
        const comprehensiveNAICS = getComprehensiveNAICSByCode(naicsCode);
        
        if (comprehensiveNAICS) {
          // Convert grade to numeric score for calculation
          const gradeToScore = { 'A': 95, 'B': 85, 'C': 75, 'D': 65, 'F': 50 };
          const overallGrade = assessment.overallScore || 'C';
          const gradeScore = gradeToScore[overallGrade as keyof typeof gradeToScore] || 75;
          
          // Calculate multiplier based on grade and comprehensive range
          const enhancedMultiple = calculateComprehensiveMultiplierFromGrade(comprehensiveNAICS, gradeScore);
          
          // Recalculate valuation with industry-specific multiplier
          const adjustedEbitda = parseFloat(assessment.adjustedEbitda || '0');
          const lowEstimate = adjustedEbitda * comprehensiveNAICS.minMultiplier;
          const midEstimate = adjustedEbitda * enhancedMultiple;
          const highEstimate = adjustedEbitda * comprehensiveNAICS.maxMultiplier;
          
          updatedData.valuationMultiple = enhancedMultiple.toFixed(2);
          updatedData.lowEstimate = lowEstimate.toFixed(2);
          updatedData.midEstimate = midEstimate.toFixed(2);
          updatedData.highEstimate = highEstimate.toFixed(2);
        } else {
          // Fallback to default multipliers if NAICS not found in comprehensive database
          const adjustedEbitda = parseFloat(assessment.adjustedEbitda || '0');
          const defaultMultiplier = 4.0;
          const midEstimate = adjustedEbitda * defaultMultiplier;
          const lowEstimate = midEstimate * 0.8;
          const highEstimate = midEstimate * 1.2;
          
          updatedData.valuationMultiple = defaultMultiplier.toFixed(2);
          updatedData.lowEstimate = lowEstimate.toFixed(2);
          updatedData.midEstimate = midEstimate.toFixed(2);
          updatedData.highEstimate = highEstimate.toFixed(2);
        }
      }
      
      // Update assessment with enhanced data
      await storage.updateValuationAssessment(assessmentId, updatedData);
      
      // Get refreshed assessment
      const enhancedAssessment = await storage.getValuationAssessment(assessmentId);
      if (!enhancedAssessment) {
        return res.status(404).json({ message: "Assessment not found after update" });
      }
      
      // Generate enhanced PDF
      const pdfBuffer = await generateEnhancedValuationPDF(enhancedAssessment, 'paid');
      
      // Save PDF to filesystem
      const pdfDir = path.join(process.cwd(), 'pdfs');
      await fs.mkdir(pdfDir, { recursive: true });
      const pdfFileName = `strategic_valuation_${enhancedAssessment.id}_${Date.now()}.pdf`;
      const pdfPath = path.join(pdfDir, pdfFileName);
      await fs.writeFile(pdfPath, pdfBuffer);
      
      // Update assessment with PDF URL
      await storage.updateValuationAssessment(assessmentId, {
        pdfUrl: `/api/pdf/${pdfFileName}`
      });
      
      // Send email if requested
      let emailResult = null;
      if (sendEmail) {
        emailResult = await resendEmailService.sendValuationReport({
          assessment: enhancedAssessment,
          pdfBuffer,
          tier: 'paid'
        });
      }
      
      res.json({
        success: true,
        pdfUrl: `/api/pdf/${pdfFileName}`,
        downloadUrl: `/api/pdf/${pdfFileName}`,
        message: "Strategic report generated successfully",
        emailSent: emailResult?.success || false,
        emailMessageId: emailResult?.messageId
      });
      
    } catch (error) {
      console.error("Error generating enhanced PDF:", error);
      res.status(500).json({ message: "Error generating strategic report" });
    }
  });

  // POST /api/report/generate-free - Generate free tier PDF (current system)
  app.post("/api/report/generate-free", async (req, res) => {
    try {
      const { assessmentId, sendEmail = false } = req.body;
      
      const assessment = await storage.getValuationAssessment(assessmentId);
      if (!assessment) {
        return res.status(404).json({ message: "Assessment not found" });
      }

      // Mark as free tier
      await storage.updateValuationAssessment(assessmentId, {
        reportTier: 'free'
      });
      
      // Generate free tier PDF using enhanced generator
      const pdfBuffer = await generateEnhancedValuationPDF(assessment, 'free');
      
      // Send email if requested
      if (sendEmail) {
        const emailResult = await resendEmailService.sendValuationReport({
          assessment,
          pdfBuffer,
          tier: 'free'
        });
        
        return res.json({
          success: true,
          message: "Starter report generated and emailed successfully",
          emailSent: emailResult.success,
          emailMessageId: emailResult.messageId
        });
      }
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${assessment.company}_Starter_Valuation_Report.pdf"`);
      res.send(pdfBuffer);
      
    } catch (error) {
      console.error("Error generating free PDF:", error);
      res.status(500).json({ message: "Error generating starter report" });
    }
  });

  // POST /api/email/send-report - Send existing report via email
  app.post("/api/email/send-report", async (req, res) => {
    try {
      const { assessmentId, tier = 'free', recipientEmail } = req.body;
      
      const assessment = await storage.getValuationAssessment(assessmentId);
      if (!assessment) {
        return res.status(404).json({ message: "Assessment not found" });
      }

      // Generate PDF for email
      const pdfBuffer = await generateEnhancedValuationPDF(assessment, tier);
      
      // Send email
      const emailResult = await resendEmailService.sendValuationReport({
        assessment,
        pdfBuffer,
        tier,
        recipientEmail
      });
      
      if (emailResult.success) {
        res.json({
          success: true,
          message: "Report sent successfully",
          messageId: emailResult.messageId
        });
      } else {
        res.status(500).json({
          success: false,
          message: "Failed to send email",
          error: emailResult.error
        });
      }
      
    } catch (error) {
      console.error("Error sending report email:", error);
      res.status(500).json({ message: "Error sending report email" });
    }
  });

  // POST /api/email/send-follow-up - Send follow-up email
  app.post("/api/email/send-follow-up", async (req, res) => {
    try {
      const { assessmentId, followUpType } = req.body;
      
      const assessment = await storage.getValuationAssessment(assessmentId);
      if (!assessment) {
        return res.status(404).json({ message: "Assessment not found" });
      }

      const emailResult = await resendEmailService.sendFollowUpEmail(assessment, followUpType);
      
      if (emailResult.success) {
        res.json({
          success: true,
          message: "Follow-up email sent successfully",
          messageId: emailResult.messageId
        });
      } else {
        res.status(500).json({
          success: false,
          message: "Failed to send follow-up email",
          error: emailResult.error
        });
      }
      
    } catch (error) {
      console.error("Error sending follow-up email:", error);
      res.status(500).json({ message: "Error sending follow-up email" });
    }
  });

  // Test endpoint for GoHighLevel integration
  app.post("/api/test-gohighlevel", async (req, res) => {
    try {
      const testContact = {
        firstName: "Test",
        lastName: "User",
        email: "test@example.com",
        phone: "555-123-4567",
        companyName: "Test Company"
      };

      // Test contact creation
      const contactResult = await goHighLevelService.createOrUpdateContact(testContact);
      
      // Test webhook
      const webhookResult = await goHighLevelService.sendWebhook({
        event: "test_integration",
        contact: testContact,
        timestamp: new Date().toISOString()
      });

      res.json({
        success: true,
        results: {
          contactCreated: !!contactResult,
          webhookSent: webhookResult
        }
      });
    } catch (error) {
      console.error("GoHighLevel test failed:", error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // AI Coaching API endpoints
  app.post("/api/ai-coaching/tips", async (req, res) => {
    try {
      const coachingData: FinancialCoachingData = req.body;
      
      // Validate required fields
      if (!coachingData.revenue || !coachingData.ebitda || !coachingData.naicsCode) {
        return res.status(400).json({ error: "Missing required financial data" });
      }
      
      const tips = await generateFinancialCoachingTips(coachingData);
      res.json({ tips });
    } catch (error) {
      console.error("Error generating coaching tips:", error);
      res.status(500).json({ error: "Failed to generate coaching tips" });
    }
  });

  app.post("/api/ai-coaching/insights", async (req, res) => {
    try {
      const coachingData: FinancialCoachingData = req.body;
      
      // Validate required fields
      if (!coachingData.revenue || !coachingData.ebitda || !coachingData.naicsCode) {
        return res.status(400).json({ error: "Missing required financial data" });
      }
      
      const insights = await generateContextualInsights(coachingData);
      res.json({ insights });
    } catch (error) {
      console.error("Error generating contextual insights:", error);
      res.status(500).json({ error: "Failed to generate contextual insights" });
    }
  });

  // NAICS Industry Data API endpoints
  app.get("/api/naics/sectors", async (req, res) => {
    try {
      // Use complete official NAICS database for sectors
      const sectors = getAllSectors();
      const sectorTitles = sectors.map(sector => sector.title);
      res.json(sectorTitles);
    } catch (error) {
      console.error('Error fetching NAICS sectors:', error);
      res.status(500).json({ error: "Failed to fetch NAICS sectors" });
    }
  });

  app.get("/api/naics/industries/:sector", async (req, res) => {
    try {
      const sectorTitle = req.params.sector;
      // Find sector by title in complete database
      const allSectors = getAllSectors();
      const sector = allSectors.find(s => s.title === sectorTitle);
      
      if (sector) {
        const subsectors = getChildrenWithEnhancedTitles(sector.code);
        res.json(subsectors);
      } else {
        res.json([]);
      }
    } catch (error) {
      console.error('Error fetching NAICS industries:', error);
      res.status(500).json({ error: "Failed to fetch NAICS industries" });
    }
  });

  app.get("/api/naics/all", async (req, res) => {
    try {
      res.json(naicsDatabase);
    } catch (error) {
      console.error('Error fetching NAICS database:', error);
      res.status(500).json({ error: "Failed to fetch NAICS database" });
    }
  });

  app.get("/api/naics/by-parent/:parentCode", async (req, res) => {
    try {
      const parentCode = req.params.parentCode;
      const childIndustries = getChildrenWithEnhancedTitles(parentCode);
      res.json(childIndustries);
    } catch (error) {
      console.error('Error fetching NAICS by parent code:', error);
      res.status(500).json({ error: "Failed to fetch NAICS industries by parent code" });
    }
  });

  // New endpoint for sectors with codes (using curated database)
  app.get("/api/naics/sectors-with-codes", async (req, res) => {
    try {
      const curatedSectors = getCuratedSectors();
      res.json(curatedSectors);
    } catch (error) {
      console.error('Error fetching NAICS sectors with codes:', error);
      res.status(500).json({ error: "Failed to fetch NAICS sectors with codes" });
    }
  });

  // New endpoint for 6-digit industries by 2-digit sector (using curated database)
  app.get("/api/naics/by-sector/:sectorCode", async (req, res) => {
    try {
      const sectorCode = req.params.sectorCode;
      
      // Get curated 6-digit industries for this sector
      const curatedIndustries = getCuratedNAICsBySector(sectorCode);
      
      const formattedIndustries = curatedIndustries.map(industry => ({
        code: industry.code,
        title: `${industry.code} – ${industry.label}`,
        label: industry.label,
        multiplier: industry.multiplier,
        level: 6,
        sectorCode: sectorCode
      }));
      
      res.json(formattedIndustries);
    } catch (error) {
      console.error('Error fetching NAICS industries by sector:', error);
      res.status(500).json({ error: "Failed to fetch NAICS industries by sector" });
    }
  });

  app.get("/api/naics/by-level/:level", async (req, res) => {
    try {
      const level = parseInt(req.params.level);
      const industries = getNAICSByLevel(level);
      res.json(industries);
    } catch (error) {
      console.error('Error fetching NAICS by level:', error);
      res.status(500).json({ error: "Failed to fetch NAICS industries by level" });
    }
  });

  // API endpoints for comprehensive NAICS database
  app.get("/api/naics/comprehensive/sectors", async (req, res) => {
    try {
      const sectors = getComprehensiveSectors();
      res.json(sectors);
    } catch (error) {
      console.error('Error fetching comprehensive NAICS sectors:', error);
      res.status(500).json({ error: "Failed to fetch comprehensive NAICS sectors" });
    }
  });

  app.get("/api/naics/comprehensive/by-sector/:sectorCode", async (req, res) => {
    try {
      const sectorCode = req.params.sectorCode;
      const industries = getComprehensiveNAICsBySector(sectorCode);
      
      const formattedIndustries = industries.map(industry => ({
        code: industry.code,
        title: `${industry.code} – ${industry.label}`,
        label: industry.label,
        multiplier: {
          min: industry.minMultiplier,
          avg: industry.avgMultiplier,
          max: industry.maxMultiplier
        },
        level: 6,
        sectorCode: industry.sectorCode
      }));
      
      res.json(formattedIndustries);
    } catch (error) {
      console.error('Error fetching comprehensive NAICS by sector:', error);
      res.status(500).json({ error: "Failed to fetch comprehensive NAICS by sector" });
    }
  });

  app.get("/api/naics/comprehensive/:code", async (req, res) => {
    try {
      const code = req.params.code;
      const industry = getComprehensiveNAICSByCode(code);
      
      if (!industry) {
        return res.status(404).json({ error: "NAICS code not found" });
      }
      
      res.json({
        code: industry.code,
        label: industry.label,
        sectorCode: industry.sectorCode,
        multiplier: {
          min: industry.minMultiplier,
          avg: industry.avgMultiplier,
          max: industry.maxMultiplier
        }
      });
    } catch (error) {
      console.error('Error fetching comprehensive NAICS by code:', error);
      res.status(500).json({ error: "Failed to fetch comprehensive NAICS by code" });
    }
  });

  // Test endpoint for multiplier ranges
  app.get("/api/test/multiplier-ranges", async (req, res) => {
    try {
      const testResults = [];
      
      // Test all curated NAICS codes with different grades
      const grades = ['A', 'B', 'C', 'D', 'F'];
      
      for (const [sectorCode, industries] of Object.entries(curatedNAICSDatabase)) {
        for (const industry of industries) {
          const gradeResults = grades.map(grade => {
            const multiplier = calculateMultiplierFromGrade(industry.multiplier, grade);
            return { grade, multiplier: parseFloat(multiplier.toFixed(3)) };
          });
          
          testResults.push({
            sector: sectorCode,
            code: industry.code,
            label: industry.label,
            range: industry.multiplier,
            gradeResults
          });
        }
      }
      
      res.json({
        success: true,
        testResults,
        summary: {
          totalIndustries: testResults.length,
          sectors: Object.keys(curatedNAICSDatabase).length
        }
      });
    } catch (error) {
      console.error('Error testing multiplier ranges:', error);
      res.status(500).json({ error: "Failed to test multiplier ranges" });
    }
  });

  // Test endpoint for comprehensive multiplier ranges
  app.get("/api/test/comprehensive-multipliers", async (req, res) => {
    try {
      const testResults = [];
      
      // Test comprehensive NAICS codes with different grades
      const grades = ['A', 'B', 'C', 'D', 'F'];
      
      for (const industry of comprehensiveNAICSMultipliers.slice(0, 10)) { // Limit for testing
        const gradeResults = grades.map(grade => {
          const multiplier = calculateComprehensiveMultiplierFromGrade(industry, grade);
          return { grade, multiplier: parseFloat(multiplier.toFixed(3)) };
        });
        
        testResults.push({
          sector: industry.sectorCode,
          code: industry.code,
          label: industry.label,
          range: {
            min: industry.minMultiplier,
            avg: industry.avgMultiplier,
            max: industry.maxMultiplier
          },
          gradeResults
        });
      }
      
      res.json({
        success: true,
        testResults,
        summary: {
          totalIndustries: comprehensiveNAICSMultipliers.length,
          sectors: getComprehensiveSectors().length,
          tested: testResults.length
        }
      });
    } catch (error) {
      console.error('Error testing comprehensive multiplier ranges:', error);
      res.status(500).json({ error: "Failed to test comprehensive multiplier ranges" });
    }
  });

  // Profile update endpoint
  app.put("/api/profile", async (req, res) => {
    try {
      // Check if user is authenticated (works with both Replit Auth and custom auth)
      const isReplitAuth = req.isAuthenticated && req.isAuthenticated() && (req.user as any)?.claims?.sub;
      const isCustomAuth = req.session?.customUserSessionId;
      const isDemoAuth = (req.session as any)?.isAuthenticated && (req.session as any)?.user;

      if (!isReplitAuth && !isCustomAuth && !isDemoAuth) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const profileData = req.body;
      
      // For demo sessions, update the session data
      if (isDemoAuth && (req.session as any)?.user) {
        const sessionUser = (req.session as any).user;
        
        // Parse name into first and last name
        const nameParts = profileData.name ? profileData.name.trim().split(' ') : [];
        const firstName = nameParts[0] || sessionUser.firstName;
        const lastName = nameParts.slice(1).join(' ') || sessionUser.lastName;
        
        // Update session user data
        (req.session as any).user = {
          ...sessionUser,
          firstName,
          lastName,
          email: profileData.email || sessionUser.email,
          phone: profileData.phone || sessionUser.phone,
          company: profileData.company || sessionUser.company,
          jobTitle: profileData.title || sessionUser.jobTitle,
          // Store additional profile data
          about: profileData.about,
          facebook: profileData.facebook,
          twitter: profileData.twitter,
          instagram: profileData.instagram,
          linkedin: profileData.linkedin,
          // Notification preferences
          emailResults: profileData.emailResults,
          textResults: profileData.textResults,
          monthlyWebinars: profileData.monthlyWebinars,
          marketUpdates: profileData.marketUpdates,
          newFeatures: profileData.newFeatures,
        };
        
        return res.json({ 
          success: true, 
          message: "Profile updated successfully",
          user: (req.session as any).user 
        });
      }

      // For authenticated users, you would update the database here
      // This is a placeholder for when real user management is implemented
      return res.json({ 
        success: true, 
        message: "Profile updated successfully" 
      });

    } catch (error) {
      console.error('Profile update failed:', error);
      res.status(500).json({ error: 'Failed to update profile' });
    }
  });

  // Demo setup endpoint for testing user flow
  app.get("/api/setup-demo", async (req, res) => {
    try {
      // Set up demo session with complete user data
      (req.session as any).isAuthenticated = true;
      (req.session as any).user = {
        id: "demo-user-123",
        email: "sarah.johnson@democorp.com",
        firstName: "Sarah",
        lastName: "Johnson",
        phone: "(555) 123-4567",
        company: "Demo Manufacturing Co",
        jobTitle: "Chief Executive Officer",
        tier: "free",
        authProvider: "demo"
      };

      res.json({ 
        success: true, 
        message: "Demo user session created with complete profile",
        user: (req.session as any).user 
      });
    } catch (error) {
      console.error('Demo setup failed:', error);
      res.status(500).json({ error: 'Failed to setup demo session' });
    }
  });

  // Stripe integration
  if (!process.env.STRIPE_SECRET_KEY) {
    console.warn('STRIPE_SECRET_KEY not provided - payment features disabled');
  } else {
    const Stripe = (await import('stripe')).default;
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-06-30.basil',
    });

    // Get Stripe products and pricing
    app.get("/api/stripe/products", async (req, res) => {
      try {
        const products = await stripe.products.list({
          active: true
        });

        // Known price mappings from our checkout configuration
        const priceMapping = {
          'prod_Sddbk2RWzr8kyL': 'price_1RqzLKAYDUS7LgRZj5ujxTbw', // Growth & Exit - $795 (updated)
          'prod_Sdvq23217qaGhp': 'price_1RqZhaAYDUS7LgRZfYL9gP1H', // Capital Market - $3495
        };

        const formattedProducts = await Promise.all(products.data.map(async (product) => {
          let price = null;
          
          // Get the specific price for this product if we have it mapped
          const priceId = priceMapping[product.id as keyof typeof priceMapping];
          console.log(`Processing product ${product.name} (${product.id}) with price ID: ${priceId}`);
          
          if (priceId) {
            try {
              const priceObj = await stripe.prices.retrieve(priceId);
              console.log(`Retrieved price for ${product.name}:`, {
                id: priceObj.id,
                amount: priceObj.unit_amount,
                currency: priceObj.currency
              });
              
              price = {
                id: priceObj.id,
                amount: priceObj.unit_amount,
                currency: priceObj.currency
              };
            } catch (priceError: any) {
              console.error(`Failed to fetch price ${priceId} for product ${product.id}:`, priceError.message);
            }
          }

          return {
            id: product.id,
            name: product.name,
            description: product.description,
            price
          };
        }));

        res.json({ products: formattedProducts });
      } catch (error: any) {
        console.error('Error fetching Stripe products:', error);
        res.status(500).json({ error: 'Failed to fetch products' });
      }
    });

    // Stripe coupon validation endpoint with demo fallback
    app.post('/api/validate-coupon', async (req, res) => {
      try {
        const { couponCode } = req.body;
        
        // First try to retrieve coupon from Stripe
        try {
          console.log('Validating Stripe coupon:', couponCode);
          const coupon = await stripe.coupons.retrieve(couponCode);
          console.log('Stripe coupon retrieved:', coupon.id, coupon.valid);
          
          if (!coupon.valid) {
            return res.status(400).json({ 
              valid: false, 
              message: 'Coupon is not valid or has expired' 
            });
          }
          
          // Return Stripe coupon details
          return res.json({
            valid: true,
            source: 'stripe',
            coupon: {
              id: coupon.id,
              name: coupon.name,
              percent_off: coupon.percent_off,
              amount_off: coupon.amount_off,
              currency: coupon.currency,
              duration: coupon.duration,
              duration_in_months: coupon.duration_in_months,
              max_redemptions: coupon.max_redemptions,
              times_redeemed: coupon.times_redeemed,
              valid: coupon.valid
            }
          });
        } catch (stripeError: any) {
          console.log('Stripe coupon error for code "' + couponCode + '":', stripeError.code, stripeError.message);
          
          // Return invalid for any Stripe error
          return res.status(400).json({ 
            valid: false, 
            message: 'Invalid coupon code' 
          });
        }
      } catch (error: any) {
        console.error('Coupon validation error:', error);
        res.status(500).json({ 
          valid: false,
          message: 'Error validating coupon' 
        });
      }
    });

    // Create payment intent for one-time payments (Growth/Capital tiers)
    app.post("/api/create-payment-intent", async (req, res) => {
      try {
        const { tier, priceId } = req.body;
        
        // Validate tier
        const validTiers = ['growth', 'capital'];
        if (!validTiers.includes(tier)) {
          return res.status(400).json({ error: 'Invalid tier' });
        }

        // Get the price from Stripe to ensure it's valid
        const price = await stripe.prices.retrieve(priceId);
        if (!price.active) {
          return res.status(400).json({ error: 'Price not active' });
        }

        const paymentIntent = await stripe.paymentIntents.create({
          amount: price.unit_amount!,
          currency: price.currency,
          metadata: {
            tier,
            priceId,
            userId: req.session?.customUserSessionId || 'anonymous',
          },
        });

        res.json({ clientSecret: paymentIntent.client_secret });
      } catch (error: any) {
        console.error('Payment intent creation error:', error);
        res.status(500).json({ error: 'Failed to create payment intent' });
      }
    });

    // Test endpoint to check Stripe products
    app.get("/api/test-stripe-products", async (req, res) => {
      try {
        console.log('Testing Stripe products with live API key...');
        
        // Test Growth product
        const growthPrices = await stripe.prices.list({
          product: 'prod_Sddbk2RWzr8kyL',
          active: true
        });
        
        // Test Capital product  
        const capitalPrices = await stripe.prices.list({
          product: 'prod_Sdvq23217qaGhp',
          active: true
        });
        
        res.json({
          growth: {
            productId: 'prod_Sddbk2RWzr8kyL',
            prices: growthPrices.data.map(p => ({ id: p.id, amount: p.unit_amount, currency: p.currency }))
          },
          capital: {
            productId: 'prod_Sdvq23217qaGhp', 
            prices: capitalPrices.data.map(p => ({ id: p.id, amount: p.unit_amount, currency: p.currency }))
          }
        });
      } catch (error: any) {
        console.error('Stripe product test error:', error);
        res.status(500).json({ error: error.message });
      }
    });

    // Create Stripe Checkout Session (Official Prebuilt Implementation)
    app.post("/api/create-checkout-session", async (req, res) => {
      try {
        const { lookup_key, couponId } = req.body;
        
        console.log('Creating checkout session with lookup_key:', lookup_key, 'couponId:', couponId);
        
        // Map lookup keys to live price IDs with mode detection
        const priceConfig = {
          'growth_exit_assessment': { 
            priceId: 'price_1RqzLKAYDUS7LgRZj5ujxTbw', // Growth - $795 (updated)
            mode: 'payment' // One-time payment
          },
          'basic_assessment': { 
            priceId: 'price_1RqzLKAYDUS7LgRZj5ujxTbw', // Same as growth (updated)
            mode: 'payment' // One-time payment
          },
          'capital_market_plan': { 
            priceId: 'price_1RqZhaAYDUS7LgRZfYL9gP1H', // Capital One-Time - $3,495
            mode: 'payment' // One-time payment
          },
          'capital_monthly': { 
            priceId: 'price_1RqZi5AYDUS7LgRZFoyi63cy', // Capital Monthly - recurring
            mode: 'subscription' // Subscription mode for recurring prices
          }
        };

        const config = priceConfig[lookup_key as keyof typeof priceConfig];
        if (!config) {
          return res.status(400).json({ error: 'Invalid product lookup key' });
        }

        console.log('Using price config:', config, 'for lookup key:', lookup_key);

        const YOUR_DOMAIN = `${req.protocol}://${req.get('host')}`;
        
        // Build checkout session data
        const sessionData: any = {
          billing_address_collection: 'auto',
          line_items: [
            {
              price: config.priceId,
              quantity: 1,
            },
          ],
          mode: config.mode,
          success_url: `${YOUR_DOMAIN}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${YOUR_DOMAIN}/checkout?canceled=true`,
          metadata: {
            lookup_key,
            priceId: config.priceId,
            mode: config.mode,
            userId: req.session?.customUserSessionId || 'anonymous',
          },
        };

        // Add coupon/discount if provided
        if (couponId) {
          try {
            const coupon = await stripe.coupons.retrieve(couponId);
            if (coupon.valid) {
              sessionData.discounts = [{ coupon: couponId }];
              sessionData.metadata.couponId = couponId;
              console.log('Applied valid Stripe coupon:', couponId);
            }
          } catch (couponError) {
            console.warn('Invalid Stripe coupon provided:', couponId);
            // Continue without coupon if invalid
          }
        }

        const session = await stripe.checkout.sessions.create(sessionData);

        console.log('Checkout session created successfully:', session.id);
        console.log('Redirecting to:', session.url);

        // Redirect to Stripe Checkout (like the official example)
        if (session.url) {
          res.redirect(303, session.url);
        } else {
          res.status(500).json({ error: 'Failed to create checkout session URL' });
        }
      } catch (error: any) {
        console.error('Checkout session creation error:', error);
        res.status(500).json({ error: 'Failed to create checkout session' });
      }
    });

    // Verify Stripe Checkout Session
    app.post("/api/verify-checkout-session", async (req, res) => {
      try {
        const { sessionId } = req.body;
        
        if (!sessionId) {
          return res.status(400).json({ error: 'Session ID required' });
        }

        // Retrieve the session from Stripe
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        
        if (session.payment_status === 'paid') {
          const userId = session.metadata?.userId;
          const customerEmail = session.customer_details?.email;
          const customerName = session.customer_details?.name;
          let newTier = 'growth'; // Default to growth for paid purchases
          let createdNewUser = false;
          let finalUserId = userId;
          
          // Determine tier based on the purchased product
          const lookupKey = session.metadata?.lookup_key;
          if (lookupKey === 'capital_market_plan' || lookupKey === 'capital_monthly') {
            newTier = 'capital';
          } else if (lookupKey === 'growth_exit_assessment' || lookupKey === 'basic_assessment') {
            newTier = 'growth';
          }
          
          // Handle user creation for anonymous purchases
          if (!userId || userId === 'anonymous') {
            if (customerEmail) {
              try {
                // Check if user already exists
                const existingUser = await storage.getUserByEmail(customerEmail);
                
                if (existingUser) {
                  // Update existing user's tier
                  await storage.updateUserTier(existingUser.id, newTier);
                  finalUserId = existingUser.id;
                  console.log(`Updated existing user ${existingUser.id} to tier ${newTier} after purchase`);
                  
                  // Update GoHighLevel contact with new tier
                  try {
                    const ghlContactData = {
                      firstName: existingUser.firstName,
                      lastName: existingUser.lastName,
                      email: existingUser.email,
                      tags: ['applebites-user', `${newTier}-tier`, 'stripe-purchase'],
                      customFields: {
                        tier: newTier,
                        purchaseDate: new Date().toISOString(),
                        stripeSessionId: session.id,
                        purchaseAmount: session.amount_total,
                        source: 'stripe_upgrade'
                      }
                    };
                    
                    await goHighLevelService.createOrUpdateContact(ghlContactData);
                    console.log(`Updated GHL contact for user ${existingUser.id} with tier ${newTier}`);
                  } catch (ghlError) {
                    console.error('Failed to update GHL contact during Stripe purchase:', ghlError);
                  }
                } else {
                  // Create new user account with purchased tier
                  const nameParts = customerName?.split(' ') || ['', ''];
                  const firstName = nameParts[0] || '';
                  const lastName = nameParts.slice(1).join(' ') || '';
                  
                  const newUser = await storage.createUser({
                    email: customerEmail,
                    firstName,
                    lastName,
                    tier: newTier,
                    passwordHash: null, // User will need to set password later
                    authProvider: 'stripe_purchase',
                    awaitingPasswordCreation: true
                  });
                  
                  finalUserId = newUser.id;
                  createdNewUser = true;
                  console.log(`Created new user ${newUser.id} with tier ${newTier} after purchase`);
                  
                  // Create GoHighLevel contact for new purchase user
                  try {
                    const ghlContactData = {
                      firstName,
                      lastName,
                      email: customerEmail,
                      tags: ['applebites-user', `${newTier}-tier`, 'stripe-purchase', 'new-customer'],
                      customFields: {
                        tier: newTier,
                        signupDate: new Date().toISOString(),
                        purchaseDate: new Date().toISOString(),
                        stripeSessionId: session.id,
                        purchaseAmount: session.amount_total,
                        authProvider: 'stripe_purchase',
                        source: 'stripe_purchase'
                      }
                    };
                    
                    const ghlResult = await goHighLevelService.createOrUpdateContact(ghlContactData);
                    if (ghlResult.contactId) {
                      await storage.updateUser(newUser.id, { ghlContactId: ghlResult.contactId });
                    }
                    console.log(`Created GHL contact for new purchase user ${newUser.id}`);
                  } catch (ghlError) {
                    console.error('Failed to create GHL contact for new purchase user:', ghlError);
                  }
                }
              } catch (error) {
                console.error('Error creating/updating user during payment verification:', error);
              }
            }
          } else {
            // Update existing authenticated user
            try {
              const user = await storage.getUser(userId);
              await storage.updateUserTier(userId, newTier);
              finalUserId = userId;
              console.log(`Updated user ${userId} to tier ${newTier} after payment verification`);
              
              // Update GoHighLevel contact with new tier
              if (user) {
                try {
                  const ghlContactData = {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    tags: ['applebites-user', `${newTier}-tier`, 'stripe-purchase'],
                    customFields: {
                      tier: newTier,
                      purchaseDate: new Date().toISOString(),
                      stripeSessionId: session.id,
                      purchaseAmount: session.amount_total,
                      source: 'stripe_upgrade'
                    }
                  };
                  
                  await goHighLevelService.createOrUpdateContact(ghlContactData);
                  console.log(`Updated GHL contact for user ${userId} with tier ${newTier}`);
                } catch (ghlError) {
                  console.error('Failed to update GHL contact during authenticated user purchase:', ghlError);
                }
              }
            } catch (error) {
              console.error('Error updating user tier during verification:', error);
            }
          }

          // Payment was successful
          res.json({
            success: true,
            sessionId: session.id,
            amount: session.amount_total,
            productName: session.metadata?.productId || 'Growth & Exit Assessment',
            tier: newTier,
            customerEmail: customerEmail,
            userId: finalUserId,
            createdNewUser,
            updatedTier: true, // Flag to indicate tier was updated
          });
        } else {
          res.status(400).json({ 
            success: false, 
            error: 'Payment not completed' 
          });
        }
      } catch (error: any) {
        console.error('Session verification error:', error);
        res.status(500).json({ error: 'Failed to verify session' });
      }
    });

    // Stripe webhook handler for payment confirmation
    app.post("/api/webhooks/stripe", async (req, res) => {
      try {
        const sig = req.headers['stripe-signature'] as string;
        let event;
        
        // If webhook secret is configured, verify the signature
        if (process.env.STRIPE_WEBHOOK_SECRET) {
          try {
            event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
            console.log('Webhook signature verified successfully');
          } catch (err: any) {
            console.error('Webhook signature verification failed:', err.message);
            return res.status(400).send(`Webhook Error: ${err.message}`);
          }
        } else {
          // For development - log warning but process anyway
          console.warn('STRIPE_WEBHOOK_SECRET not set - processing webhook without verification (INSECURE)');
          event = req.body;
        }

        console.log('Processing Stripe webhook event:', event.type);

        // Handle different event types
        switch (event.type) {
          case 'payment_intent.succeeded':
            const paymentIntent = event.data.object;
            console.log('Payment succeeded:', paymentIntent.id, paymentIntent.amount);
            
            const { tier, userId } = paymentIntent.metadata;
            if (userId && userId !== 'anonymous') {
              try {
                await storage.updateUserTier(userId, tier);
                console.log(`Updated user ${userId} to tier ${tier}`);

                // Send webhook to N8N for GHL integration
                const webhookData = {
                  type: 'tierUpgrade', 
                  userId,
                  tier,
                  amount: paymentIntent.amount / 100,
                  timestamp: new Date().toISOString(),
                  paymentIntentId: paymentIntent.id,
                };

                const n8nWebhookUrl = 'https://drobosky.app.n8n.cloud/webhook-test/replit-lead';
                const response = await fetch(n8nWebhookUrl, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(webhookData),
                });
                console.log('N8N webhook response:', response.status);

              } catch (error) {
                console.error('Error updating user tier:', error);
              }
            }
            break;

          case 'checkout.session.completed':
            const session = event.data.object;
            console.log('Checkout session completed:', session.id);
            // Handle checkout completion if needed
            break;

          case 'invoice.payment_succeeded':
            const invoice = event.data.object;
            console.log('Invoice payment succeeded:', invoice.id);
            // Handle subscription payments
            break;

          default:
            console.log('Unhandled event type:', event.type);
        }

        res.json({ received: true });
      } catch (error: any) {
        console.error('Stripe webhook error:', error);
        res.status(400).send(`Webhook Error: ${error.message}`);
      }
    });
  }

  const httpServer = createServer(app);
  return httpServer;
}
