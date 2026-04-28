import type { Role } from "./common";

declare global {
  namespace Express {
    interface User {
      userId: string;
      role: Role;
      googleId?: string;
      email?: string;
      name?: string;
      avatarUrl?: string;
    }

    interface Request {
      authUser?: {
        userId: string;
        role: Role;
      };
      requestId?: string;
    }
  }
}

export {};
