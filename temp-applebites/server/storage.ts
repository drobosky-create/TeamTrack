import { 
  valuationAssessments, 
  leads,
  leadActivities,
  teamMembers,
  teamSessions,
  users,
  type ValuationAssessment, 
  type InsertValuationAssessment,
  type Lead,
  type InsertLead,
  type LeadActivity,
  type InsertLeadActivity,
  type TeamMember,
  type InsertTeamMember,
  type TeamSession,
  type User,
  type InsertUser,
  type UpsertUser
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, inArray } from "drizzle-orm";

export interface IStorage {
  // Valuation Assessment methods
  createValuationAssessment(assessment: InsertValuationAssessment): Promise<ValuationAssessment>;
  getValuationAssessment(id: number): Promise<ValuationAssessment | undefined>;
  updateValuationAssessment(id: number, updates: Partial<ValuationAssessment>): Promise<ValuationAssessment>;
  getAllValuationAssessments(): Promise<ValuationAssessment[]>;

  // Lead management methods
  createLead(lead: InsertLead): Promise<Lead>;
  getLeadByEmail(email: string): Promise<Lead | undefined>;
  getLeadById(id: number): Promise<Lead | undefined>;
  updateLead(id: number, updates: Partial<Lead>): Promise<Lead>;
  deleteLead(id: number): Promise<void>;
  getAllLeads(): Promise<Lead[]>;
  getLeadsByStatus(status: string): Promise<Lead[]>;
  searchLeads(query: string): Promise<Lead[]>;

  // Lead activity methods
  createLeadActivity(activity: InsertLeadActivity): Promise<LeadActivity>;
  getLeadActivities(leadId: number): Promise<LeadActivity[]>;

  // User management methods (for both Replit Auth and custom auth)
  getUser(id: string): Promise<User | undefined>;
  getUserById(id: string): Promise<User | undefined>;
  createUser(userData: Partial<User>): Promise<User>;
  upsertUser(user: UpsertUser): Promise<User>;
  getUserByEmail(email: string): Promise<User | undefined>;
  updateUser(id: string, updates: Partial<User>): Promise<User>;
  updateUserTier(id: string, tier: string): Promise<User>;
  deleteUser(id: string): Promise<void>;
  deleteAllUsers(): Promise<void>;
  deleteMultipleUsers(userIds: string[]): Promise<void>;
  createCustomUser(userData: { firstName: string; lastName: string; email: string; passwordHash: string }): Promise<User>;
  validateUserCredentials(email: string, password: string): Promise<User | null>;

  // Team management methods
  createTeamMember(member: InsertTeamMember & { hashedPassword: string }): Promise<TeamMember>;
  getTeamMemberByEmail(email: string): Promise<TeamMember | undefined>;
  getTeamMemberById(id: number): Promise<TeamMember | undefined>;
  getAllTeamMembers(): Promise<TeamMember[]>;
  getAllUsers(): Promise<User[]>;
  updateTeamMember(id: number, updates: Partial<TeamMember>): Promise<TeamMember>;
  deleteTeamMember(id: number): Promise<void>;
  createTeamSession(teamMemberId: number, sessionId: string, expiresAt: Date): Promise<TeamSession>;
  getTeamSession(sessionId: string): Promise<TeamSession | undefined>;
  updateTeamSession(sessionId: string, expiresAt: Date): Promise<void>;
  deleteTeamSession(sessionId: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async createValuationAssessment(insertAssessment: InsertValuationAssessment): Promise<ValuationAssessment> {
    const [assessment] = await db
      .insert(valuationAssessments)
      .values(insertAssessment)
      .returning();
    return assessment;
  }

  async getValuationAssessment(id: number): Promise<ValuationAssessment | undefined> {
    const [assessment] = await db.select().from(valuationAssessments).where(eq(valuationAssessments.id, id));
    return assessment || undefined;
  }

  async updateValuationAssessment(id: number, updates: Partial<ValuationAssessment>): Promise<ValuationAssessment> {
    const [assessment] = await db
      .update(valuationAssessments)
      .set(updates)
      .where(eq(valuationAssessments.id, id))
      .returning();
    
    if (!assessment) {
      throw new Error(`Assessment with id ${id} not found`);
    }
    
    return assessment;
  }

  async getAllValuationAssessments(): Promise<ValuationAssessment[]> {
    return await db.select().from(valuationAssessments);
  }

  // Lead management methods
  async createLead(insertLead: InsertLead): Promise<Lead> {
    const [lead] = await db
      .insert(leads)
      .values(insertLead)
      .returning();
    return lead;
  }

  async getLeadByEmail(email: string): Promise<Lead | undefined> {
    const [lead] = await db.select().from(leads).where(eq(leads.email, email));
    return lead || undefined;
  }

  async getLeadById(id: number): Promise<Lead | undefined> {
    const [lead] = await db.select().from(leads).where(eq(leads.id, id));
    return lead || undefined;
  }

  async updateLead(id: number, updates: Partial<Lead>): Promise<Lead> {
    const [lead] = await db
      .update(leads)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(leads.id, id))
      .returning();
    
    if (!lead) {
      throw new Error(`Lead with id ${id} not found`);
    }
    
    return lead;
  }

  async getAllLeads(): Promise<Lead[]> {
    return await db.select().from(leads).orderBy(desc(leads.createdAt));
  }

  async getLeadsByStatus(status: string): Promise<Lead[]> {
    return await db.select().from(leads).where(eq(leads.leadStatus, status)).orderBy(desc(leads.createdAt));
  }

  async searchLeads(query: string): Promise<Lead[]> {
    // Note: This is a simple search implementation. In production, you might want to use full-text search
    const lowerQuery = query.toLowerCase();
    const allLeads = await db.select().from(leads);
    
    return allLeads.filter(lead => 
      lead.firstName?.toLowerCase().includes(lowerQuery) ||
      lead.lastName?.toLowerCase().includes(lowerQuery) ||
      lead.email?.toLowerCase().includes(lowerQuery) ||
      lead.company?.toLowerCase().includes(lowerQuery)
    );
  }

  async deleteLead(id: number): Promise<void> {
    await db.delete(leads).where(eq(leads.id, id));
  }

  // Lead activity methods
  async createLeadActivity(insertActivity: InsertLeadActivity): Promise<LeadActivity> {
    const [activity] = await db
      .insert(leadActivities)
      .values(insertActivity)
      .returning();
    return activity;
  }

  async getLeadActivities(leadId: number): Promise<LeadActivity[]> {
    return await db
      .select()
      .from(leadActivities)
      .where(eq(leadActivities.leadId, leadId))
      .orderBy(desc(leadActivities.createdAt));
  }

  // User management methods (for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserById(id: string): Promise<User | undefined> {
    return this.getUser(id);
  }

  async createUser(userData: Partial<User>): Promise<User> {
    const userId = userData.id || `user_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    
    const [user] = await db
      .insert(users)
      .values({
        id: userId,
        email: userData.email!,
        firstName: userData.firstName || null,
        lastName: userData.lastName || null,
        fullName: userData.fullName || null,
        profileImageUrl: userData.profileImageUrl || null,
        passwordHash: userData.passwordHash || null,
        authProvider: userData.authProvider || 'custom',
        replitUserId: userData.replitUserId || null,
        tier: userData.tier || 'free',
        ghlContactId: userData.ghlContactId || null,
        resultReady: userData.resultReady || false,
        isActive: userData.isActive !== false,
        emailVerified: userData.emailVerified || false,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();
    
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

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    
    if (!user) {
      throw new Error(`User with id ${id} not found`);
    }
    
    return user;
  }

  async updateUserTier(id: string, tier: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ tier, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    
    if (!user) {
      throw new Error(`User with id ${id} not found`);
    }
    
    return user;
  }

  async deleteUser(id: string): Promise<void> {
    await db.delete(users).where(eq(users.id, id));
  }

  async deleteAllUsers(): Promise<void> {
    await db.delete(users);
  }

  async deleteMultipleUsers(userIds: string[]): Promise<void> {
    if (userIds.length === 0) return;
    await db.delete(users).where(inArray(users.id, userIds));
  }

  // Team management methods
  async createTeamMember(member: InsertTeamMember & { hashedPassword: string }): Promise<TeamMember> {
    const [teamMember] = await db
      .insert(teamMembers)
      .values(member)
      .returning();
    return teamMember;
  }

  async getTeamMemberByEmail(email: string): Promise<TeamMember | undefined> {
    const [member] = await db.select().from(teamMembers).where(eq(teamMembers.email, email));
    return member;
  }

  async getTeamMemberById(id: number): Promise<TeamMember | undefined> {
    const [member] = await db.select().from(teamMembers).where(eq(teamMembers.id, id));
    return member;
  }

  async getAllTeamMembers(): Promise<TeamMember[]> {
    return await db.select().from(teamMembers).orderBy(desc(teamMembers.createdAt));
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users).orderBy(desc(users.createdAt));
  }

  async updateTeamMember(id: number, updates: Partial<TeamMember>): Promise<TeamMember> {
    const [member] = await db
      .update(teamMembers)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(teamMembers.id, id))
      .returning();
    return member;
  }

  async deleteTeamMember(id: number): Promise<void> {
    await db.delete(teamMembers).where(eq(teamMembers.id, id));
  }

  async createTeamSession(teamMemberId: number, sessionId: string, expiresAt: Date): Promise<TeamSession> {
    const [session] = await db
      .insert(teamSessions)
      .values({ id: sessionId, teamMemberId, expiresAt })
      .returning();
    return session;
  }

  async getTeamSession(sessionId: string): Promise<TeamSession | undefined> {
    const [session] = await db.select().from(teamSessions).where(eq(teamSessions.id, sessionId));
    return session;
  }

  async updateTeamSession(sessionId: string, expiresAt: Date): Promise<void> {
    await db.update(teamSessions)
      .set({ expiresAt })
      .where(eq(teamSessions.id, sessionId));
  }

  async deleteTeamSession(sessionId: string): Promise<void> {
    await db.delete(teamSessions).where(eq(teamSessions.id, sessionId));
  }

  // Custom user authentication methods
  async createCustomUser(userData: { firstName: string; lastName: string; email: string; passwordHash: string }): Promise<User> {
    const userId = `custom_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    
    const [user] = await db
      .insert(users)
      .values({
        id: userId,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        passwordHash: userData.passwordHash,
        authProvider: 'custom',
        emailVerified: false,
        tier: 'free',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();
    
    return user;
  }

  async validateUserCredentials(email: string, password: string): Promise<User | null> {
    const user = await this.getUserByEmail(email);
    
    if (!user || !user.passwordHash) {
      return null;
    }

    // Allow login for users with password-based auth providers
    if (!['email', 'custom'].includes(user.authProvider || '')) {
      return null;
    }

    const bcrypt = await import('bcryptjs');
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    
    if (!isValidPassword || !user.isActive) {
      return null;
    }

    return user;
  }
}

export const storage = new DatabaseStorage();
