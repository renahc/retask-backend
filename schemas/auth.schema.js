import { z } from "zod";

export const RegisterSchema = z.object({
  username: z
    .string("Username must be a text")
    .trim()
    .min(1, "Username is required"),
  email: z
    .string("Email must be a text")
    .trim()
    .min(1, "Email is required")
    .email("Invalid email"),
  password: z
    .string("Password must be a text")
    .min(6, "Password must be a least 6 characters"),
});

export const LoginSchema = z.object({
  email: z
    .string("Email must be a text")
    .trim()
    .min(1, "Email is required")
    .email("Invalid email"),
  password: z.string("Password must be a text").min(1, "Password is required"),
});
