"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sendResponse = (res, data) => {
    const { data: resData, statusCode, success, message } = data;
    res.status(statusCode).json({
        success: success,
        message: message,
        data: resData,
    });
};
exports.default = sendResponse;
