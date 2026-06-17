import { createApp } from "./app.js";
import { connectDB, disconnectDB } from "./config/database.js";
import { connectRedis, redisClient } from "./config/redis.js";
import { setupProcessErrorHandlers } from "./middleware/error.js";
import { env } from "./config/env.js";

setupProcessErrorHandlers();

async function startServer(): Promise<void> {
  await connectDB();
  await connectRedis();

  const app = createApp();
  app.listen(env.PORT, () => {
    console.log(`Server running on port : ${env.PORT}`);
  });
}
startServer().catch((err) => {
  console.error("start server failed :", err);
  process.exit(1);
});
