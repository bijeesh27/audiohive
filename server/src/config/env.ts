import dotenv from "dotenv";
dotenv.config();

interface EnvConfig {
  PORT: number;
  CLIENT_URL: string;
  MONGO_URI: string;
  JWT_ACCESS_SECRET: string;
  JWT_REFRESH_SECRET: string;
  JWT_ACCESS_EXPIRES_IN: string;
  JWT_REFRESH_EXPIRES_IN: string;
  REDIS_URL: string;
  NODE_ENV: string;
}

function validateEnv(): EnvConfig {
  const required = [
    "MONGO_URI",
    "JWT_ACCESS_SECRET",
    "JWT_REFRESH_SECRET",
    "CLIENT_URL",
  ];

  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error("missing required environment");
  }
  return {
    PORT: parseInt(process.env.PORT || "5000", 10),
    CLIENT_URL: process.env.CLIENT_URL!,
    MONGO_URI: process.env.MONGO_URI!,
    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET!,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET!,
    JWT_ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN!,
    JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN!,
    REDIS_URL: process.env.REDIS_URL!,
    NODE_ENV: process.env.NODE_ENV!,
  };
}

export const env = validateEnv();
