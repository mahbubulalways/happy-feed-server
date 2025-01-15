import { Router } from "express";
import { productController } from "./products.controller";

const router = Router();

router.post("/insert-product", productController.interProductController);
// router.get("/get-products", productController.getProductController);
router.get(
  "/get-just-landed-products",
  productController.getJustLandedProductController
);
router.get(
  "/get-single-product/:id",
  productController.getSingleProductController
);

export default router;
