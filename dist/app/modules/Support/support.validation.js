"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupportValidationSchema = void 0;
const zod_1 = require("zod");
const createSupportValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z
            .string()
            .min(2, { message: 'Name must be at least 2 characters long.' })
            .max(50, { message: 'Name must not exceed 50 characters.' })
            .trim(),
        email: zod_1.z
            .string()
            .email({ message: 'Please enter a valid email address.' })
            .trim(),
        phone: zod_1.z
            .string()
            .regex(/^\+?[0-9]{7,15}$/, {
            message: 'Please enter a valid phone number.',
        })
            .optional()
            .or(zod_1.z.literal('')),
        issueType: zod_1.z.string().min(1, 'Issue type is required'),
        issueDescription: zod_1.z
            .string()
            .min(10, {
            message: 'Issue description must be at least 10 characters long.',
        })
            .max(1000, {
            message: 'Issue description must not exceed 1000 characters.',
        })
            .trim(),
        isDeleted: zod_1.z.boolean().default(false),
    }),
});
exports.SupportValidationSchema = {
    createSupportValidationSchema,
};
