import {  z } from "zod";

const signInSchema = z.object({
    email: z.string().min(1,{message : "Email adress is required"}).email(),
    password: z.string().min(1,{message : "Password adress is required"})
});

type signInType = z.infer<typeof signInSchema>;
export {signInSchema , type signInType };