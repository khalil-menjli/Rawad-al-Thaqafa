import {  z } from "zod";

const emailSchema = z.object({
    email: z.string().min(1,{message : "Email adress is required"}).email(),
});

type emailType = z.infer<typeof emailSchema>;
export {emailSchema , type emailType };