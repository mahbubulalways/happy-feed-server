"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("../config"));
const handleZodError_1 = require("../errors/handleZodError");
const zod_1 = require("zod");
const globalErrorHandler = (
// eslint-disable-next-line @typescript-eslint/no-explicit-any
error, req, res, 
// eslint-disable-next-line @typescript-eslint/no-unused-vars
next) => {
    let message = error.message || 'Something went wrong';
    let statusCode = error.statusCode || 500;
    let errorSources = [
        {
            path: '',
            message: 'Something went wrong',
        },
    ];
    if (error instanceof zod_1.ZodError) {
        const simplifiedError = (0, handleZodError_1.handleZodError)(error);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorSources = simplifiedError.errorSources;
    }
    res.status(statusCode).json({
        success: false,
        message,
        errorSources,
        stack: config_1.default.NODE_ENV === 'development' && error.stack,
    });
};
exports.default = globalErrorHandler;
