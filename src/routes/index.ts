import { Router } from "express";
import rateLimit from "express-rate-limit";
import { protect } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { topicUpload, mediaUpload } from "../middleware/upload";
import { loginSchema, eventSchema, eventUpdateSchema, topicSchema, topicUpdateSchema, mediaSchema } from "../validators/schemas";
import { login, logout, me } from "../controllers/auth.controller";
import { listEvents, getEvent, createEvent, updateEvent, deleteEvent } from "../controllers/event.controller";
import { listTopics, getTopic, createTopic, updateTopic, deleteTopic } from "../controllers/topic.controller";
import { listMedia, getMedia, createMedia, updateMedia, deleteMedia } from "../controllers/media.controller";
import { getPrograms, getGallery } from "../controllers/public.controller";

const router = Router();

router.get("/health", (_req, res) => res.json({ success: true, message: "OK" }));

// ---------- Public (main website) ----------
router.get("/programs", getPrograms); // events + topics  -> /programs page
router.get("/gallery", getGallery);   // media            -> /gallery page

// ---------- Auth ----------
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many login attempts. Try again later." },
});
router.post("/auth/login", loginLimiter, validate(loginSchema), login);
router.post("/auth/logout", logout);
router.get("/auth/me", protect, me);

// ---------- Admin: add new event ----------
router.get("/events", protect, listEvents);
router.get("/events/:id", protect, getEvent);
router.post("/events", protect, validate(eventSchema), createEvent);
router.put("/events/:id", protect, validate(eventUpdateSchema), updateEvent);
router.delete("/events/:id", protect, deleteEvent);

// ---------- Admin: add new topic (multipart: title, description, photos[]) ----------
router.get("/topics", protect, listTopics);
router.get("/topics/:id", protect, getTopic);
router.post("/topics", protect, topicUpload, validate(topicSchema), createTopic);
router.put("/topics/:id", protect, topicUpload, validate(topicUpdateSchema), updateTopic);
router.delete("/topics/:id", protect, deleteTopic);

// ---------- Admin: add new media (multipart: photos[], videos[]) ----------
router.get("/media", protect, listMedia);
router.get("/media/:id", protect, getMedia);
router.post("/media", protect, mediaUpload, validate(mediaSchema), createMedia);
router.put("/media/:id", protect, mediaUpload, validate(mediaSchema), updateMedia);
router.delete("/media/:id", protect, deleteMedia);

export default router;
