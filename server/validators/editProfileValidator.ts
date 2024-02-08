import { z } from "zod";

export const editProfileValidator = z.object({
  value: z
    .string({ required_error: "Name/Username is required" })
    .trim()
    .min(5, { message: "Name/Username must be atleast 5 characters long" }),
  type: z.enum(["name", "username"]),
  id: z.string(),
});
