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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSingleProductService = exports.getJustLandProductService = exports.getProductService = exports.insertProductService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = require("../../errors/AppError");
const products_model_1 = __importDefault(require("./products.model"));
const generateProductId_1 = require("../../utils/generateProductId");
const insertProductService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    payload.productCode = (0, generateProductId_1.generateProductId)();
    payload.offerPrice = Math.round(payload.price - (payload.price * payload.discount) / 100);
    const result = yield products_model_1.default.create(payload);
    return result;
});
exports.insertProductService = insertProductService;
const getProductService = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield products_model_1.default.find({});
    return result;
});
exports.getProductService = getProductService;
// just landed product
const getJustLandProductService = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield products_model_1.default.find({});
    return result;
});
exports.getJustLandProductService = getJustLandProductService;
// just single product
const getSingleProductService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield products_model_1.default.findById(id);
    return result;
});
exports.getSingleProductService = getSingleProductService;
// search product by name
const searchProductByNameService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Split the payload into individual words
        const words = payload.split("-").filter((word) => word.trim() !== "");
        // Create a search query that matches any word in the product name
        const searchQuery = {
            $or: words.map((word) => ({
                name: { $regex: word, $options: "i" }, // 'i' for case-insensitive
            })),
        };
        // Find products that match the query
        const result = yield products_model_1.default.find(searchQuery);
        return result;
    }
    catch (error) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, error === null || error === void 0 ? void 0 : error.message);
        // throw new AppError(httpStatus.NOT_FOUND, "Product not found");
    }
});
