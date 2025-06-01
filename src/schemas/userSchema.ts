import { z } from 'zod'
import { string } from 'zod/v4';
const passwordSchema = z.string().min(8, "Password must be at least 8 characters")
    .refine((val) => /[A-Z]/.test(val), {
        message: "Password must contain at least one uppercase letter",
    })
    .refine((val) => /[#?!$%^&*]/.test(val), {
        message: "Password must contain at least one special character",
    });
export const dataSchema = z.object({
    username: z.string().min(5, "Atleast 5 character required"),
    email: z.string().email(),
    password: passwordSchema,
})

export const LoginSchema = dataSchema.omit({ username: true })
