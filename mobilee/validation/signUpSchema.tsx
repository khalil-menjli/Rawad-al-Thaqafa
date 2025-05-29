import { z } from 'zod';

const signUpSchema = z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    email: z.string().email('Invalid email address'),
    password: z.string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/.*[!@#$%^&*()_+{}|[\]\\:";'<>?,./].*/, 'Password needs a special character'),
    businessName: z.string().min(1, 'Business name is required'),
    location: z.string().min(1, 'Location is required'),
    websiteUrl: z.string().url('Invalid URL'),
    category: z.enum(["Books", "Museums", "Library", "Cinema"], {
        errorMap: () => ({ message: "Please select a category" }),
    }),
    description: z.string().min(1, 'Description is required'),
    // We'll treat imageUri as string URI
    imageUri: z.string().min(1, 'Image is required'),
});
type SignUpType = z.infer<typeof signUpSchema>;

export { signUpSchema, type SignUpType };