import mongoose from "mongoose";
import { IProduct } from "./products.interface";

const ColorSchema = new mongoose.Schema({
  colorName: { type: String, required: [true, "Color name is required."] },
  colorCode: { type: String, required: [true, "Color code is required."] },
});
const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required."],
    },
    brand: {
      type: String,
      required: [true, "Brand is required."],
    },
    productCode: {
      type: String,
    },
    image: {
      type: String,
      required: [true, "Main product image is required."],
    },
    images: {
      type: [String],
      required: [true, "Product images are required."],
      validate: {
        validator: (v: string[]) => v.length > 0,
        message: "At least one product image is required.",
      },
    },
    availability: {
      type: String,
      enum: {
        values: ["In stock", "Out of stock"],
        message: 'Availability must be either "In stock" or "Out of stock".',
      },
      required: [true, "Availability is required."],
    },
    price: {
      type: Number,
      required: [true, "Price is required."],
      min: [0, "Price must be a positive number."],
    },
    discount: {
      type: Number,
      required: [true, "Discount is required."],
      min: [0, "Discount must be a positive number."],
    },
    offerPrice: {
      type: Number,
      required: [true, "Offer price is required."],
      min: [0, "Offer price must be a positive number."],
    },
    productType: {
      type: String,
      required: [true, "Product type is required."],
    },
    category: {
      type: String,
      required: [true, "Category is required."],
    },
    colors: {
      type: [ColorSchema],
      required: [true, "Colors are required."],
    },
    size: {
      type: [String],
      required: [true, "Size is required."],
      validate: {
        validator: (v: string[]) => v.length > 0,
        message: "At least one size is required.",
      },
    },
    features: {
      type: [String],
      required: [true, "Features are required."],
      validate: {
        validator: (v: string[]) => v.length > 0,
        message: "At least one feature is required.",
      },
    },
    mainCategory: {
      type: String,
      required: [true, "Main Category is required."],
    },
    sellCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Create and export the Mongoose model
const Product = mongoose.model<IProduct>("Product", ProductSchema);

export default Product;
