import httpStatus from "http-status";
import { AppError } from "../../errors/AppError";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import {
  getJustLandProductService,
  getProductService,
  getSingleProductService,
  insertProductService,
} from "./products.services";

const interProductController = catchAsync(async (req, res) => {
  const body = req.body;
  const result = await insertProductService(body);
  if (!result) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Failed to insert the product. Please check the product details and try again."
    );
  } else {
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Product has been successfully inserted into the database.",
      data: result,
    });
  }
});
const getJustLandedProductController = catchAsync(async (req, res) => {
  const result = await getJustLandProductService();
  if (!result) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "No products were found. Please ensure the request is correct and try again."
    );
  } else {
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Products retrieved successfully.",
      data: result,
    });
  }
});

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
const getSingleProductController = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await getSingleProductService(id);
  if (!result) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "No product were found. Please ensure the request is correct and try again."
    );
  } else {
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Product retrieved successfully.",
      data: result,
    });
  }
});

export const productController = {
  interProductController,
  //   getProductController,
  getJustLandedProductController,
  getSingleProductController,
};
