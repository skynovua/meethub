import { z } from "zod";

export const SigninSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export type SigninPayload = z.infer<typeof SigninSchema>;

export const SignUpSchema = z.object({
  username: z.string().min(2),
}).merge(SigninSchema);

export type SignupPayload = z.infer<typeof SignUpSchema>;