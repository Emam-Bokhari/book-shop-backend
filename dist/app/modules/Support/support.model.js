"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Support = void 0;
const mongoose_1 = require("mongoose");
const queryFilters_1 = require("../../utils/moduleSpecific/queryFilters");
const supportSchema = new mongoose_1.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
    },
    email: {
        type: String,
        trim: true,
        required: true,
    },
    phone: {
        type: String,
        trim: true,
    },
    issueType: {
        type: String,
        trim: true,
        required: true,
    },
    issueDescription: {
        type: String,
        trim: true,
        required: true,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
    versionKey: false,
});
// query middleware for soft delete by utils
supportSchema.pre('find', queryFilters_1.excludeDeletedQuery);
supportSchema.pre('findOne', queryFilters_1.excludeDeletedQuery);
// aggregate middleware for soft delete by utils
supportSchema.pre('aggregate', queryFilters_1.excludeDeletedAggregation);
exports.Support = (0, mongoose_1.model)('Support', supportSchema);
