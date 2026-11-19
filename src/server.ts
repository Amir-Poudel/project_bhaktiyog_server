import app from "./app";
import { env } from "./config/env";
import { connectDB } from "./config/db";
import { seedAdmin } from "./utils/seedAdmin";

const start = async () => {
  await connectDB();
  await seedAdmin();
  app.listen(env.port, () => console.log(`API running on http://localhost:${env.port}/api`));
};

start().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
