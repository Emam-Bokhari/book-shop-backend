"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductValidationSchema = void 0;
const zod_1 = require("zod");
const createProductValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().trim().max(50, 'Title can not exceed 50 characters'),
        category: zod_1.z.enum([
            'fiction',
            'nonFiction',
            'academic',
            'philosophy',
            'children',
            'science',
            'religion',
            'history',
            'biography',
            'art',
            'poetry',
            'romance',
            'mystery',
            'fantasy',
            'travel',
            'selfHelp',
            'psychology',
            'politics',
            'cookbook',
            'humor',
            'graphicNovels',
            'health',
            'technology',
            'business',
            'education',
            'sports',
        ]),
        author: zod_1.z.string().trim().max(50, 'Author can not exceed 50 characters'),
        aboutAuthor: zod_1.z.string().trim(),
        shipping: zod_1.z.string().trim(),
        returnsPolicy: zod_1.z.string().trim(),
        termsOfSale: zod_1.z.string().trim(),
        description: zod_1.z
            .string()
            .trim()
            .max(1000, 'Description can not exceed 1000 characters'),
        price: zod_1.z
            .number()
            .int()
            .min(1, 'Price is required and must be price at least 1')
            .max(10000, 'Price can not exceed 10000'),
        images: zod_1.z.array(zod_1.z.string()),
        publisher: zod_1.z
            .string()
            .trim()
            .max(100, 'Publisher can not exceed 100 characters'),
        publishedDate: zod_1.z.string(),
        edition: zod_1.z
            .string()
            .trim()
            .max(50, 'Edition can not exceed 50 characters')
            .optional(),
        language: zod_1.z.enum([
            'bengali',
            'english',
            'arabic',
            'hindi',
            'spanish',
            'french',
            'german',
            'italian',
            'portuguese',
            'russian',
            'chinese',
            'japanese',
            'korean',
            'turkish',
            'urdu',
            'swedish',
            'dutch',
            'polish',
            'greek',
            'hebrew',
            'persian',
            'thai',
            'vietnamese',
        ]),
        pages: zod_1.z.number().nullable().optional(),
        rating: zod_1.z
            .number()
            .int()
            .min(1, 'Rating is required and must be at least 1')
            .max(5, 'Rating can not exceed 5'),
        // discount: z
        //   .number()
        //   .int()
        //   .min(0, 'Discount cannot be negative')
        //   .max(100, 'Discount cannot exceed 100')
        //   .optional(),
        format: zod_1.z.enum([
            'hardcover',
            'paperback',
            'eBook',
            'audioBook',
            'pdf',
            'audiobookMP3',
            'audiobookCD',
            'comicBook',
            'interactiveBook',
            'flipBook',
            'boxSet',
            'deluxeEdition',
        ]),
        quantity: zod_1.z
            .number()
            .int()
            .min(0, 'Quantity cannot be negative')
            .max(10000, 'Quantity cannot exceed 10,000'),
        isDeleted: zod_1.z.boolean().default(false),
    }),
});
const updateProductValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z
            .string()
            .trim()
            .max(50, 'Title can not exceed 50 characters')
            .optional(),
        category: zod_1.z
            .enum([
            'fiction',
            'nonFiction',
            'academic',
            'philosophy',
            'children',
            'science',
            'religion',
            'history',
            'biography',
            'art',
            'poetry',
            'romance',
            'mystery',
            'fantasy',
            'travel',
            'selfHelp',
            'psychology',
            'politics',
            'cookbook',
            'humor',
            'graphicNovels',
            'health',
            'technology',
            'business',
            'education',
            'sports',
        ])
            .optional(),
        author: zod_1.z
            .string()
            .trim()
            .max(50, 'Author can not exceed 50 characters')
            .optional(),
        aboutAuthor: zod_1.z.string().trim().optional(),
        shipping: zod_1.z.string().trim().optional(),
        returnsPolicy: zod_1.z.string().trim().optional(),
        termsOfSale: zod_1.z.string().trim().optional(),
        description: zod_1.z
            .string()
            .trim()
            .max(1000, 'Description can not exceed 1000 characters')
            .optional(),
        price: zod_1.z.number().int().max(10000, 'Price can not exceed 10000').optional(),
        images: zod_1.z.array(zod_1.z.string()).optional(),
        publisher: zod_1.z
            .string()
            .trim()
            .max(100, 'Publisher can not exceed 100 characters')
            .optional(),
        publishedDate: zod_1.z.string().optional(),
        edition: zod_1.z
            .string()
            .trim()
            .max(50, 'Edition can not exceed 50 characters')
            .optional(),
        language: zod_1.z
            .enum([
            'bengali',
            'english',
            'arabic',
            'hindi',
            'spanish',
            'french',
            'german',
            'italian',
            'portuguese',
            'russian',
            'chinese',
            'japanese',
            'korean',
            'turkish',
            'urdu',
            'swedish',
            'dutch',
            'polish',
            'greek',
            'hebrew',
            'persian',
            'thai',
            'vietnamese',
        ])
            .optional(),
        pages: zod_1.z.number().nullable().optional(),
        rating: zod_1.z.number().int().max(5, 'Rating can not exceed 5').optional(),
        // discount: z
        //   .number()
        //   .int()
        //   .max(100, 'Discount cannot exceed 100')
        //   .optional(),
        format: zod_1.z
            .enum([
            'hardcover',
            'paperback',
            'eBook',
            'audioBook',
            'pdf',
            'audiobookMP3',
            'audiobookCD',
            'comicBook',
            'interactiveBook',
            'flipBook',
            'boxSet',
            'deluxeEdition',
        ])
            .optional(),
        quantity: zod_1.z
            .number()
            .int()
            .max(10000, 'Quantity cannot exceed 10,000')
            .optional(),
        isDeleted: zod_1.z.boolean().default(false),
    }),
});
exports.ProductValidationSchema = {
    createProductValidationSchema,
    updateProductValidationSchema,
};
