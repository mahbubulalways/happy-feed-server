"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
// Zod schema for user validation with Bangladeshi phone number validation
const createUserValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z
            .string({ required_error: "Name is required" })
            .min(5, { message: "Name must be at least 5 characters long" }),
        email: zod_1.z
            .string({ required_error: "Email is required" })
            .email({ message: "Please provide a valid email address" }),
        phoneNumber: zod_1.z
            .string({ required_error: "Phone number is required" })
            .regex(/^(?:\+88|01)?(?:\d{9,10})$/, {
            message: "Please provide a valid  phone number",
        }),
        password: zod_1.z
            .string({ required_error: "Password is required" })
            .min(6, { message: "Password must be at least 6 characters long" }),
        image: zod_1.z.string().optional().default(""),
    }),
});
exports.default = createUserValidationSchema;
