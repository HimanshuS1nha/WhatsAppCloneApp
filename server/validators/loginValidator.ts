import { z } from "zod";

export const loginValidator = z.object({
  username: z
    .string({ required_error: "Username is required" })
    .trim()
    .min(5, { message: "Username must be atleast 5 characters long" }),
  password: z
    .string({ required_error: "Password is required" })
    .trim()
    .min(8, { message: "Password must be atleast 8 characters" }),
});
