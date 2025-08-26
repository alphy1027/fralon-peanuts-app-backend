const { z } = require("zod");

const signupRequestSchema = z
  .object({
    username: z.string().min(3, "Username must be at least 3 characters long"),
    email: z.email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters").max(20),
    confirmPassword: z.string().min(6, "Password confirmation must be at least 6 characters").max(20),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

module.exports = signupRequestSchema;
