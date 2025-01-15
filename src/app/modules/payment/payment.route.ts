import { Router } from "express";
import { orderController } from "./payment.controller";

const router = Router();

router.post("/create-order", orderController.createOrderController);
router.post(
  "/payment/success/:transactionId",
  orderController.paymentSuccessController
);
router.post(
  "/payment/fail/:transactionId",
  orderController.paymentFailedController
);
router.post(
  "/payment/cancel/:transactionId",
  orderController.paymentCancelController
);
router.get(
  "/payment/get-payment-info/:transactionId",
  orderController.getPaymentOrderInfoController
);

export default router;
