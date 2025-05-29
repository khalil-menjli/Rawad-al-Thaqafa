import { z } from "zod";


const signUpSchema = z.object({
  // Personal Info
  firstName: z.string().min(1, { message: "First name is required",  }),
  lastName:  z.string().min(1, { message: "Last name is required" }),
  email:     z
    .string()
    .min(1, { message: "Email address is required" })
    .email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .regex(/.*[!@#$%^&*()_+{}|\[\]\\:";'<>?,./].*/, {
      message: "Password should contain at least one special character",
    }),

  // Business Basics
  businessName: z.string().min(1, { message: "Business name is required" }),
  description:  z.string().min(1, { message: "Business description is required" }),
  location:     z.string().min(1, { message: "Location is required" }),
  websiteUrl:   z
    .string()
    .min(1, { message: "Website URL is required" })
    .url({ message: "Invalid URL format" }),

  // Business Details
  category: z.enum(["Books", "Museums", "Library", "Cinema"], {
    errorMap: () => ({ message: "Please select a category" }),
  }),

  // Image file (drag & drop or upload)
  imageFile: z
    .instanceof(File, { message: "Business image is required" })
    .refine((file) => file.type.startsWith("image/"), {
      message: "Only image files are allowed",
    }),
});

type signUpType = z.infer<typeof signUpSchema>;

export { signUpSchema, type signUpType };