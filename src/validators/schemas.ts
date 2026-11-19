import * as yup from "yup";

export const loginSchema = yup.object({
  adminId: yup.string().trim().required("ID is required"),
  password: yup.string().required("Password is required"),
});

export const eventSchema = yup.object({
  date: yup.date().typeError("Valid date is required").required("Date is required"),
  description: yup.string().trim().required("Description is required"),
});

export const eventUpdateSchema = yup.object({
  date: yup.date().typeError("Valid date is required"),
  description: yup.string().trim().min(1),
});

// Topic and media bodies are multipart (strings only); files are handled by multer.
export const topicSchema = yup.object({
  title: yup.string().trim().required("Title is required"),
  description: yup.string().trim().required("Description is required"),
  removePhotos: yup.mixed(),
});

export const topicUpdateSchema = yup.object({
  title: yup.string().trim().min(1),
  description: yup.string().trim().min(1),
  removePhotos: yup.mixed(),
});

export const mediaSchema = yup.object({
  removePhotos: yup.mixed(),
  removeVideos: yup.mixed(),
});
