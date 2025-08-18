import type { Express, RequestHandler } from "express";
import session from "express-session";
import connectPg from "connect-pg-simple";

// Simple Replit Auth implementation for testing
export function setupSimpleAuth(app: Express) {
  // Only set up session if not already configured by Replit Auth
  if (!app.get('session-configured')) {
    const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
    const pgStore = connectPg(session);
    const sessionStore = new pgStore({
      conString: process.env.DATABASE_URL,
      createTableIfMissing: true,
      ttl: sessionTtl,
      tableName: "sessions",
    });
    
    app.use(session({
      secret: process.env.SESSION_SECRET!,
      store: sessionStore,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: sessionTtl,
        sameSite: 'lax',
        domain: process.env.NODE_ENV === 'production' ? '.applebites.ai' : undefined,
      },
    }));
    
    app.set('session-configured', true);
  }

  // Simplified login route that redirects to Replit OAuth
  app.get("/api/login", (req, res) => {
    // For now, just redirect to main page as logged in
    // In production, this would redirect to Replit's OAuth
    if (req.session) {
      (req.session as any).isAuthenticated = true;
      (req.session as any).user = {
        id: "demo-user",
        email: "demo@example.com", 
        firstName: "Demo",
        lastName: "User"
      };
    }
    res.redirect("/");
  });

  // Logout route
  app.get("/api/logout", (req, res) => {
    req.session?.destroy(() => {
      res.redirect("/");
    });
  });
}

// Simple auth middleware
export const isSimpleAuthenticated: RequestHandler = (req, res, next) => {
  if ((req.session as any)?.isAuthenticated) {
    return next();
  }
  return res.status(401).json({ message: "Unauthorized" });
};