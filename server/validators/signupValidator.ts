import { z } from "zod";

export const signupValidator = z.object({
  name: z
    .string({ required_error: "Name is required" })
    .trim()
    .min(5, { message: "Name must be atleast 5 characters long" }),
  username: z
    .string({ required_error: "Username is required" })
    .trim()
    .min(5, { message: "Name must be atleast 5 characters long" }),
  image: z
    .string({ required_error: "Profile picture url is required" })
    .url({ message: "Image must be a url and it must contain the protocol" }),
  password: z
    .string({ required_error: "Password is required" })
    .trim()
    .min(8, { message: "Password must be atleast 8 characters long" }),
});
