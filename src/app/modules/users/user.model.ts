import mongoose, { Schema } from "mongoose";
import { IUser, UserModel } from "./user.interface";
import config from "../../config";
import bcrypt from "bcrypt";
const userSchema = new mongoose.Schema<IUser, UserModel>(
  {
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
        message:
          "Role must be one of 'super-admin', 'admin', 'moderator', 'salesman', or 'user'",
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
  },
  {
    timestamps: true,
  }
);

//  hash password
userSchema.pre("save", async function () {
  const password = this.password;
  this.password = await bcrypt.hash(password, Number(config.BCRYPT_SALT));
});
userSchema.post("save", async function (doc, next) {
  doc.password = "";
  next();
});

userSchema.set("toJSON", {
  transform: (doc, ret) => {
    // Exclude the password field
    delete ret.password;
    return ret;
  },
});
//  check user exist static method
userSchema.statics.isUserExists = async function (email: string) {
  const exist = await User.findOne({ email });
  return exist;
};

//  match password static method
userSchema.statics.isPasswordMatch = async function (
  planText: string,
  hash: string
) {
  const match = await bcrypt.compare(planText, hash);
  return match;
};

// Creating and exporting the Mongoose model
const User = mongoose.model<IUser, UserModel>("User", userSchema);
export default User;
