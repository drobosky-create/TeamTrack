import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { db } from '../db';
import { consumerUsers } from '../../shared/schema';
import { eq } from 'drizzle-orm';

export async function handleConsumerSignup(req: Request, res: Response) {
  try {
    const { firstName, lastName, email, phone, companyName, password, plan, stripeSessionId } = req.body;

    // Check if user already exists
    const existingUser = await db
      .select()
      .from(consumerUsers)
      .where(eq(consumerUsers.email, email))
      .limit(1);

    if (existingUser.length > 0) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user with plan information
    const [newUser] = await db
      .insert(consumerUsers)
      .values({
        firstName,
        lastName,
        email,
        phone,
        companyName,
        passwordHash: hashedPassword,
        plan: plan || 'free', // Default to free if no plan specified
        stripeSessionId: stripeSessionId || null, // Store session ID if provided
      })
      .returning();

    // Store user in session with plan information
    req.session.consumerUser = {
      id: newUser.id,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email,
      companyName: newUser.companyName,
      plan: newUser.plan,
    };

    res.json({
      success: true,
      user: {
        id: newUser.id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        companyName: newUser.companyName,
        phone: newUser.phone,
        plan: newUser.plan,
      },
    });
  } catch (error) {
    console.error('Consumer signup error:', error);
    res.status(500).json({ message: 'Failed to create account' });
  }
}

export async function handleConsumerLogin(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    // Find user
    const [user] = await db
      .select()
      .from(consumerUsers)
      .where(eq(consumerUsers.email, email))
      .limit(1);

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Verify password
    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Store user in session with plan information
    req.session.consumerUser = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      companyName: user.companyName,
      plan: user.plan,
    };

    res.json({
      success: true,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        companyName: user.companyName,
        phone: user.phone,
        plan: user.plan,
      },
    });
  } catch (error) {
    console.error('Consumer login error:', error);
    res.status(500).json({ message: 'Login failed' });
  }
}

export async function handleConsumerLogout(req: Request, res: Response) {
  req.session.consumerUser = undefined;
  res.json({ success: true });
}

export async function getConsumerUser(req: Request, res: Response) {
  if (!req.session.consumerUser) {
    return res.status(401).json({ message: 'Not authenticated' });
  }
  res.json({ user: req.session.consumerUser });
}