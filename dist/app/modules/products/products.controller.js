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
exports.productController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = require("../../errors/AppError");
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const products_services_1 = require("./products.services");
const interProductController = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const result = yield (0, products_services_1.insertProductService)(body);
    if (!result) {
        throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, "Failed to insert the product. Please check the product details and try again.");
    }
    else {
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: "Product has been successfully inserted into the database.",
            data: result,
        });
    }
}));
const getJustLandedProductController = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield (0, products_services_1.getJustLandProductService)();
    if (!result) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, "No products were found. Please ensure the request is correct and try again.");
    }
    else {
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: "Products retrieved successfully.",
            data: result,
        });
    }
}));
// const getProductController = catchAsync(async (req, res) => {
//   const result = await getProductService();
//   if (!result) {
//     throw new AppError(
//       httpStatus.NOT_FOUND,
//       "No products were found. Please ensure the request is correct and try again."
//     );
//   } else {
//     sendResponse(res, {
//       statusCode: httpStatus.OK,
//       success: true,
//       message: "Products retrieved successfully.",
//       data: result,
//     });
//   }
// });
//  get single product
const getSingleProductController = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const result = yield (0, products_services_1.getSingleProductService)(id);
    if (!result) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, "No product were found. Please ensure the request is correct and try again.");
    }
    else {
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: "Product retrieved successfully.",
            data: result,
        });
    }
}));
exports.productController = {
    interProductController,
    //   getProductController,
    getJustLandedProductController,
    getSingleProductController,
};
