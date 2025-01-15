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
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = __importDefault(require("../../config"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const userSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true,
        minlength: [2, "Name must be at least 5 characters long"],
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        trim: true,
        match: [/.+\@.+\..+/, "Please provide a valid email address"],
    },
    phoneNumber: {
        type: String,
        required: [true, "Phone number is required"],
        trim: true,
        match: [/^\+?[1-9]\d{1,14}$/, "Please provide a valid phone number"],
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [6, "Password must be at least 6 characters long"],
    },
    image: {
        type: String,
        default: "",
        trim: true,
    },
    role: {
        type: String,
        required: [true, "Role is required"],
        enum: {
            values: ["super-admin", "admin", "moderator", "salesman", "user"],
            message: "Role must be one of 'super-admin', 'admin', 'moderator', 'salesman', or 'user'",
        },
        default: "user",
    },
    status: {
        type: String,
        required: true,
        enum: {
            values: ["In-progress", "Block"],
            message: "Status must be either 'In-progress' or 'Block'",
        },
        default: "In-progress",
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    passwordChangeAt: {
        type: Date,
        default: new Date(),
    },
}, {
    timestamps: true,
});
//  hash password
userSchema.pre("save", function () {
    return __awaiter(this, void 0, void 0, function* () {
        const password = this.password;
        this.password = yield bcrypt_1.default.hash(password, Number(config_1.default.BCRYPT_SALT));
    });
});
userSchema.post("save", function (doc, next) {
    return __awaiter(this, void 0, void 0, function* () {
        doc.password = "";
        next();
    });
});
userSchema.set("toJSON", {
    transform: (doc, ret) => {
        // Exclude the password field
        delete ret.password;
        return ret;
    },
});
//  check user exist static method
userSchema.statics.isUserExists = function (email) {
    return __awaiter(this, void 0, void 0, function* () {
        const exist = yield User.findOne({ email });
        return exist;
    });
};
//  match password static method
userSchema.statics.isPasswordMatch = function (planText, hash) {
    return __awaiter(this, void 0, void 0, function* () {
        const match = yield bcrypt_1.default.compare(planText, hash);
        return match;
    });
};
// Creating and exporting the Mongoose model
const User = mongoose_1.default.model("User", userSchema);
exports.default = User;
