import 'express-session';

declare module 'express-session' {
  interface SessionData {
    consumerUser?: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      companyName: string;
      plan?: 'free' | 'growth' | 'capital';
    };
  }
}