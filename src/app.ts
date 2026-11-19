import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { env } from "./config/env";
import routes from "./routes";
import { errorHandler, notFound } from "./middleware/error";

const app = express();

// Allow the Next.js site (another origin) to display uploaded images/videos.
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(cors({ origin: env.clientUrl, credentials: true }));
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());

app.use("/uploads", express.static(env.uploadDir, { maxAge: "7d", index: false }));
app.use("/api", routes);

app.use(notFound);
app.use(errorHandler);

export default app;
