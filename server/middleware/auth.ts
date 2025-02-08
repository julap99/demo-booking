import jwt from "jsonwebtoken";
import { H3Event } from "h3";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "your-refresh-secret-key";

interface JWTPayload {
  userId: number;
  username?: string;
  type: "access" | "refresh";
  exp?: number;
}

// Define public routes that don't require authentication
const PUBLIC_ROUTES = [
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/refresh',
  '/api/auth/verify',
  '/api/booking/get-config',
  '/api/booking/get-themes',
  '/api/booking/get-addons',
  '/api/booking/get-slots',
  '/api/booking/get-available-slots',
  '/api/booking/proceed'
];

export default defineEventHandler(async (event: H3Event) => {
  // Skip auth for public routes
  if (PUBLIC_ROUTES.includes(event.path)) {
    return;
  }

  // Skip auth for non-API routes
  if (!event.path.startsWith('/api/')) {
    return;
  }

  try {
    // Get token from Authorization header
    const authHeader = getHeader(event, "Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      throw createError({
        statusCode: 401,
        message: "No token provided",
      });
    }

    const token = authHeader.split(" ")[1];

    try {
      // Verify token
      const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;

      // Check token type
      if (decoded.type !== "access") {
        throw createError({
          statusCode: 401,
          message: "Invalid token type",
        });
      }

      // Check token expiration
      if (decoded.exp && decoded.exp < Date.now() / 1000) {
        throw createError({
          statusCode: 401,
          message: "Token expired",
        });
      }

      // Add user info to event context
      event.context.auth = {
        userId: decoded.userId,
        username: decoded.username,
      };
    } catch (jwtError) {
      throw createError({
        statusCode: 401,
        message: "Invalid or expired token",
      });
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Authentication failed",
    });
  }
}); 