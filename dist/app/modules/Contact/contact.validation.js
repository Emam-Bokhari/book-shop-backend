"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactValidationSchema = void 0;
const zod_1 = require("zod");
const createContactValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string(),
        email: zod_1.z.string().email('Invalid email format'),
        message: zod_1.z.string(),
        isDeleted: zod_1.z.boolean().default(false),
    }),
});
exports.ContactValidationSchema = {
    createContactValidationSchema,
};
