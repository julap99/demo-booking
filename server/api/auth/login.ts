import db from "../../utils/knex";
import crypto from "crypto";
import jwt from "jsonwebtoken";

// JWT secret should be in environment variables in production
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const JWT_REFRESH_SECRET =
  process.env.JWT_REFRESH_SECRET || "your-refresh-secret-key";

// Token expiration times
const ACCESS_TOKEN_EXPIRY = "15m";
const REFRESH_TOKEN_EXPIRY = "7d";

function generateTokens(user: any) {
  // Create access token
  const accessToken = jwt.sign(
    {
      userId: user.id,
      username: user.username,
      type: "access",
    },
    JWT_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRY }
  );

  // Create refresh token
  const refreshToken = jwt.sign(
    {
      userId: user.id,
      type: "refresh",
    },
    JWT_REFRESH_SECRET,
    { expiresIn: REFRESH_TOKEN_EXPIRY }
  );

  return { accessToken, refreshToken };
}

export default defineEventHandler(async (event) => {
  try {
    const { username, password } = await readBody(event);

    // Input validation
    if (!username || !password) {
      throw createError({
        statusCode: 400,
        message: "Username and password are required",
      });
    }

    const hashedPassword = crypto
      .createHash("sha256")
      .update(password)
      .digest("hex");

    console.log("Hashed Password: ", hashedPassword);

    const user = await db("user")
      .where("username", username)
      .where("password", hashedPassword)
      .first();

    if (!user) {
      throw createError({
        statusCode: 401,
        message: "Invalid username or password",
      });
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user);

    // Prepare user data (excluding sensitive information)
    const userData = {
      id: user.id,
      username: user.username,
      email: user.email,
      // Add other non-sensitive user fields as needed
    };

    // Set HTTP-only cookie for refresh token
    setCookie(event, "refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
      path: "/",
    });

    return {
      statusCode: 200,
      status: "success",
      message: "Login successful",
      data: {
        user: userData,
        token: accessToken,
      },
    };
  } catch (error: any) {
    console.error("Login error:", error);
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Failed to login",
    });
  }
});
