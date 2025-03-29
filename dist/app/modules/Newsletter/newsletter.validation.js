"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewsletterValidationSchema = void 0;
const zod_1 = require("zod");
const createNewsletterValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().email().trim(),
        isDeleted: zod_1.z.boolean().default(false),
    }),
});
exports.NewsletterValidationSchema = {
    createNewsletterValidationSchema,
};
