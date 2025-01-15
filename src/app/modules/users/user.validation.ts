import { z } from "zod";

// Zod schema for user validation with Bangladeshi phone number validation
const createUserValidationSchema = z.object({
  body: z.object({
    name: z
      .string({ required_error: "Name is required" })
      .min(5, { message: "Name must be at least 5 characters long" }),

    email: z
      .string({ required_error: "Email is required" })
      .email({ message: "Please provide a valid email address" }),
    phoneNumber: z
      .string({ required_error: "Phone number is required" })
      .regex(/^(?:\+88|01)?(?:\d{9,10})$/, {
        message: "Please provide a valid  phone number",
      }),
    password: z
      .string({ required_error: "Password is required" })
      .min(6, { message: "Password must be at least 6 characters long" }),
    image: z.string().optional().default(""),
  }),
});

export default createUserValidationSchema;
