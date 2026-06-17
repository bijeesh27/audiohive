import { createClient } from "redis";
import { env } from "./env.js";

const redisClient = createClient({
  url: env.REDIS_URL,
  socket: {
    reconnectStrategy: (retries) => {
      if (retries > 10) {
        console.error("[Redis] Max reconnection attempts reached");
        return new Error("Redis reconnection limit exceeded");
      }
      return Math.min(retries * 100, 3000);
    },
  },
});

redisClient.on("connect", () => console.log("[Redis] Connected"));
redisClient.on("error", (err) => console.error("[Redis] Error:", err.message));
redisClient.on("reconnecting", () => console.warn("[Redis] Reconnecting..."));

export async function connectRedis(): Promise<void> {
  try {
    await redisClient.connect();
  } catch (error) {
    console.error("[Redis] Initial connection failed:", error);
    if (env.NODE_ENV === "production") process.exit(1);
  }
}

export { redisClient };
