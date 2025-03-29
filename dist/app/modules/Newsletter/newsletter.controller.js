"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewsLetterControllers = void 0;
const asyncHandler_1 = require("../../utils/global/asyncHandler");
const sendResponse_1 = require("../../utils/global/sendResponse");
const newsletter_service_1 = require("./newsletter.service");
const createNewsletterController = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const newsletterPayload = req.body;
    const createdNewsletter = yield newsletter_service_1.NewsletterServices.createNewsletter(newsletterPayload);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        message: 'Newsletter is created successfully',
        statusCode: 201,
        data: createdNewsletter,
    });
}));
const getAllNewslettersController = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const newsletters = yield newsletter_service_1.NewsletterServices.getAllNewsletters();
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        message: 'NewsLetters are retrieved successfully',
        statusCode: 200,
        data: newsletters,
    });
}));
const deleteNewsletterController = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    yield newsletter_service_1.NewsletterServices.deleteNewsletterById(id);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: 'Newsletter is deleted successfully',
        data: {},
    });
}));
exports.NewsLetterControllers = {
    createNewsletterController,
    getAllNewslettersController,
    deleteNewsletterController,
};
