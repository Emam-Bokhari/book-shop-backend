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
exports.NewsletterServices = void 0;
const HttpError_1 = require("../../errors/HttpError");
const newsletter_model_1 = require("./newsletter.model");
const createNewsletter = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const createdNewsletter = yield newsletter_model_1.Newsletter.create(payload);
    return createdNewsletter;
});
const getAllNewsletters = () => __awaiter(void 0, void 0, void 0, function* () {
    const newsletters = yield newsletter_model_1.Newsletter.find();
    if (newsletters.length === 0) {
        throw new HttpError_1.HttpError(404, 'No newsletter record were found in the database');
    }
    return newsletters;
});
const deleteNewsletterById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const deletedNewsletter = yield newsletter_model_1.Newsletter.findOneAndUpdate({ _id: id, isDeleted: false }, { isDeleted: true }, { new: true });
    if (!deletedNewsletter) {
        throw new HttpError_1.HttpError(404, 'The requested newsletter could not be found.');
    }
    return deletedNewsletter;
});
exports.NewsletterServices = {
    createNewsletter,
    getAllNewsletters,
    deleteNewsletterById,
};
