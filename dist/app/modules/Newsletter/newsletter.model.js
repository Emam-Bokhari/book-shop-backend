"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Newsletter = void 0;
const mongoose_1 = require("mongoose");
const queryFilters_1 = require("../../utils/moduleSpecific/queryFilters");
const newsletterSchema = new mongoose_1.Schema({
    email: {
        type: String,
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
newsletterSchema.pre('find', queryFilters_1.excludeDeletedQuery);
newsletterSchema.pre('findOne', queryFilters_1.excludeDeletedQuery);
// aggregate middleware for soft delete by utils
newsletterSchema.pre('aggregate', queryFilters_1.excludeDeletedAggregation);
exports.Newsletter = (0, mongoose_1.model)('Newsletter', newsletterSchema);
