const SSLCommerzPayment = require("sslcommerz-lts");
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { generateTransactionId } from "./payment.utils";
import config from "../../config";
import { Order } from "../orders/order.model";
import { AppError } from "../../errors/AppError";
import { sendMail } from "../../utils/sendMail";
import purchaseHtmlContent, {
  TPurchaseHtml,
} from "../../utils/purchasedHtmlContent";
const createOrderController = catchAsync(async (req, res) => {
  const body = req.body;
  const transactionId = generateTransactionId(body?.order[0]?.productId);
  const data = {
    total_amount: body.totalPrice,
    currency: "BDT",
    tran_id: transactionId, // use unique tran_id for each api call
    success_url: `${config?.PAYMENT_STATUS_URL}/success/${transactionId}`,
    fail_url: `${config?.PAYMENT_STATUS_URL}/fail/${transactionId}`,
    cancel_url: `${config?.PAYMENT_STATUS_URL}/cancel/${transactionId}`,
    ipn_url: "http://localhost:3030/ipn",
    shipping_method: "Courier",
    product_name: "Computer.",
    product_category: "Electronic",
    product_profile: "general",
    cus_name: body.personInfo.fullName,
    cus_email: body.personInfo.email,
    cus_add1: body.personInfo.address,
    cus_add2: body.personInfo.address,
    cus_city: body.personInfo.district,
    cus_state: body.personInfo.division,
    cus_postcode: body.personInfo.postalCode,
    cus_country: "Bangladesh",
    cus_phone: body.personInfo.mobileNumber,
    cus_fax: "01711111111",
    ship_name: "Customer Name",
    ship_add1: "Dhaka",
    ship_add2: "Dhaka",
    ship_city: "Dhaka",
    ship_state: "Dhaka",
    ship_postcode: 1000,
    ship_country: "Bangladesh",
  };

  const sslcz = new SSLCommerzPayment(
    config.SSL_STORE_ID,
    config.SSS_STORE_PASSWORD,
    config.SSS_IS_LIVE
  );
  sslcz.init(data).then(async (apiResponse: any) => {
    // Redirect the user to payment gateway
    let GatewayPageURL = apiResponse.GatewayPageURL;
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Order initialized",
      data: { url: GatewayPageURL },
    });

    const finalOrder = {
      orders: body,
      transaction_Id: transactionId,
      paymentStatus: false,
      amount: body?.totalPrice,
      vat: "00.00",
    };

    await Order.create(finalOrder);
  });
});

// success
const paymentSuccessController = catchAsync(async (req, res) => {
  const transaction_Id = req.params.transactionId;
  const updateOrder = await Order.findOneAndUpdate(
    { transaction_Id },
    { paymentStatus: true },
    { new: true, upsert: true }
  );

  const order = await Order.findOne({ transaction_Id });
  const showingOrderStatus = `${config?.PAYMENT_REDIRECT_URL}/order/order-status/${transaction_Id}`;
  const info: TPurchaseHtml = {
    payload: {
      name: order?.orders?.personInfo?.fullName || "Customer",
      paymentDate: order?.date || new Date(),
      transaction_Id: order?.transaction_Id || "N/A",
      amount: order?.amount ?? 0,
      vat: order?.vat ?? 0,
      orderStatusLink: showingOrderStatus,
    },
  };

  const htmlData = purchaseHtmlContent(info);
  const mailInfo = {
    email: "Mahbubul Hasan",
    subject: "Purchased from Greensteps",
    htmlData: htmlData,
  };
  await sendMail(mailInfo);
  res.redirect(
    `${config?.PAYMENT_REDIRECT_URL}/order/payment/success/${transaction_Id}`
  );
});

const paymentFailedController = catchAsync(async (req, res) => {
  const transaction_Id = req.params.transactionId;
  await Order.findOneAndUpdate(
    { transaction_Id },
    { paymentStatus: false },
    { new: true, upsert: true }
  );
});

const paymentCancelController = catchAsync(async (req, res) => {
  const transaction_Id = req.params.transactionId;
  const updateOrder = await Order.findOneAndUpdate(
    { transaction_Id },
    { paymentStatus: false },
    { new: true, upsert: true }
  );
  res.redirect(`${config?.PAYMENT_REDIRECT_URL}`);
});

const getPaymentOrderInfoController = catchAsync(async (req, res) => {
  const transactionId = req.params.transactionId;
  const result = await Order.findOne({ transaction_Id: transactionId }).select(
    "-orders"
  );
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Payment history not found");
  } else {
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Payment successfully",
      data: result,
    });
  }
});

export const orderController = {
  createOrderController,
  paymentSuccessController,
  paymentFailedController,
  paymentCancelController,
  getPaymentOrderInfoController,
};
