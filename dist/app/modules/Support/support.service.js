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
exports.SupportServices = void 0;
const HttpError_1 = require("../../errors/HttpError");
const support_model_1 = require("./support.model");
const createSupport = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const createdSupport = yield support_model_1.Support.create(payload);
    return createdSupport;
});
const getAllSupports = () => __awaiter(void 0, void 0, void 0, function* () {
    const supports = yield support_model_1.Support.find();
    if (supports.length === 0) {
        throw new HttpError_1.HttpError(404, 'No support were found in the database');
    }
    return supports;
});
const getSupportById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const support = yield support_model_1.Support.findById(id);
    if (!support) {
        throw new HttpError_1.HttpError(404, 'The requested support could not be found.');
    }
    return support;
});
const deleteSupportById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const deletedSupport = yield support_model_1.Support.findOneAndUpdate({ _id: id, isDeleted: false }, { isDeleted: true }, { new: true });
    if (!deletedSupport) {
        throw new HttpError_1.HttpError(404, 'The requested support could not be found.');
    }
    return deletedSupport;
});
exports.SupportServices = {
    createSupport,
    getAllSupports,
    getSupportById,
    deleteSupportById,
};
