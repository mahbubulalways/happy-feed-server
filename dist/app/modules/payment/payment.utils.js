"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTransactionId = void 0;
const generateTransactionId = (productId) => {
    // Extract the last 4 characters of the user's ID
    const productIdSuffix = productId.slice(-6);
    // Get today's date in the format YYYYMMDD
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    const date = `${year}${month}${day}`;
    // Get the current time in the format HHMMSS
    const hours = String(today.getHours()).padStart(2, "0");
    const minutes = String(today.getMinutes()).padStart(2, "0");
    const seconds = String(today.getSeconds()).padStart(2, "0");
    const time = `${hours}${minutes}${seconds}`;
    // Combine the components to form the transaction ID
    const transactionId = `${productIdSuffix}${date}${time}`;
    return transactionId;
};
exports.generateTransactionId = generateTransactionId;
