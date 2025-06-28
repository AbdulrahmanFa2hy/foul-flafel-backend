"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.params = exports.validateMongoDBId = exports.MONGODBObjectId = void 0;
const zod_1 = require("zod");
exports.MONGODBObjectId = /^[0-9a-fA-F]{24}$/;
const validateMongoDBId = (id) => {
    return exports.MONGODBObjectId.test(id);
};
exports.validateMongoDBId = validateMongoDBId;
exports.params = zod_1.z.object({
    id: zod_1.z.string().refine(exports.validateMongoDBId, { message: "Invalid MongoDB ID" })
});
