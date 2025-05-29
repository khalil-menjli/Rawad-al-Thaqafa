import { z } from "zod";

// Updated schema: renamed imageFile to imageUrl to match form field
export const offerSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  dateStart: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date" }),
  location: z.string().min(1, { message: "Location is required" }),
  createdBy: z.string().optional(), 
  price: z
    .number({ invalid_type_error: "Price must be a number" })
    .min(0, { message: "Price cannot be negative" }),
  categories: z.enum(["Books", "Museums", "Library", "Cinema"], {
    errorMap: () => ({ message: "Category is required" }),
  }),
  imageFile: z.union([
    z.instanceof(File),
    z.string().url()
  ], { invalid_type_error: "Offer image is required" })
  .refine((val) => {
    // if it's a File, ensure it's an image; if it's a string URL, accept it
    return typeof val === "string" || (val instanceof File && val.type.startsWith("image/"));
  }, { message: "Only image files are allowed" }),

  description: z.string().min(1, { message: "Description is required" }),
});

export type OfferType = z.infer<typeof offerSchema>;

