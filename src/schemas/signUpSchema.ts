import { z } from "zod";

export const userNameValidation = z
  .string()
  .min(2, "Username must be 2 character")
  .max(20, "Username must be no more than 20 character")
  .regex(/^[a-zA-Z0-9]+$/,"Username must not contain special characer");

export const signUpSchema=z.object({
    userName:userNameValidation,
    email:z.string().email("Invalid email"),
    password:z.string().min(6,"Password must be 6 character")
})
