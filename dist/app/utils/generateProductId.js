"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateProductId = generateProductId;
function generateProductId() {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    // Generate 4 random uppercase letters
    let letterPart = "";
    for (let i = 0; i < 4; i++) {
        letterPart += letters.charAt(Math.floor(Math.random() * letters.length));
    }
    // Get the current timestamp in HHMMSS format
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");
    // Combine letters and timestamp
    return `${letterPart}${hours}${minutes}${seconds}`;
}
