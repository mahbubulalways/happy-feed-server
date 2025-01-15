import httpStatus from "http-status";
import { AppError } from "../../errors/AppError";
import { IProduct } from "./products.interface";
import Product from "./products.model";
import { generateProductId } from "../../utils/generateProductId";

export const insertProductService = async (payload: IProduct) => {
  payload.productCode = generateProductId();
  payload.offerPrice = Math.round(
    payload.price - (payload.price * payload.discount) / 100
  );
  const result = await Product.create(payload);
  return result;
};

export const getProductService = async () => {
  const result = await Product.find({});
  return result;
};

// just landed product
export const getJustLandProductService = async () => {
  const result = await Product.find({});
  return result;
};
// just single product
export const getSingleProductService = async (id: string) => {
  const result = await Product.findById(id);
  return result;
};

// search product by name

const searchProductByNameService = async (payload: string) => {
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
    const result = await Product.find(searchQuery);

    return result;
  } catch (error: any) {
    throw new AppError(httpStatus.NOT_FOUND, error?.message);
    // throw new AppError(httpStatus.NOT_FOUND, "Product not found");
  }
};
