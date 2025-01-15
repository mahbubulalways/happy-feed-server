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
exports.orderController = void 0;
const SSLCommerzPayment = require("sslcommerz-lts");
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const payment_utils_1 = require("./payment.utils");
const config_1 = __importDefault(require("../../config"));
const order_model_1 = require("../orders/order.model");
const AppError_1 = require("../../errors/AppError");
const sendMail_1 = require("../../utils/sendMail");
const purchasedHtmlContent_1 = __importDefault(require("../../utils/purchasedHtmlContent"));
const createOrderController = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const body = req.body;
    const transactionId = (0, payment_utils_1.generateTransactionId)((_a = body === null || body === void 0 ? void 0 : body.order[0]) === null || _a === void 0 ? void 0 : _a.productId);
    const data = {
        total_amount: body.totalPrice,
        currency: "BDT",
        tran_id: transactionId, // use unique tran_id for each api call
        success_url: `${config_1.default === null || config_1.default === void 0 ? void 0 : config_1.default.PAYMENT_STATUS_URL}/success/${transactionId}`,
        fail_url: `${config_1.default === null || config_1.default === void 0 ? void 0 : config_1.default.PAYMENT_STATUS_URL}/fail/${transactionId}`,
        cancel_url: `${config_1.default === null || config_1.default === void 0 ? void 0 : config_1.default.PAYMENT_STATUS_URL}/cancel/${transactionId}`,
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
    const sslcz = new SSLCommerzPayment(config_1.default.SSL_STORE_ID, config_1.default.SSS_STORE_PASSWORD, config_1.default.SSS_IS_LIVE);
    sslcz.init(data).then((apiResponse) => __awaiter(void 0, void 0, void 0, function* () {
        // Redirect the user to payment gateway
        let GatewayPageURL = apiResponse.GatewayPageURL;
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: "Order initialized",
            data: { url: GatewayPageURL },
        });
        const finalOrder = {
            orders: body,
            transaction_Id: transactionId,
            paymentStatus: false,
            amount: body === null || body === void 0 ? void 0 : body.totalPrice,
            vat: "00.00",
        };
        yield order_model_1.Order.create(finalOrder);
    }));
}));
// success
const paymentSuccessController = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    const transaction_Id = req.params.transactionId;
    const updateOrder = yield order_model_1.Order.findOneAndUpdate({ transaction_Id }, { paymentStatus: true }, { new: true, upsert: true });
    const order = yield order_model_1.Order.findOne({ transaction_Id });
    const showingOrderStatus = `${config_1.default === null || config_1.default === void 0 ? void 0 : config_1.default.PAYMENT_REDIRECT_URL}/order/order-status/${transaction_Id}`;
    const info = {
        payload: {
            name: ((_b = (_a = order === null || order === void 0 ? void 0 : order.orders) === null || _a === void 0 ? void 0 : _a.personInfo) === null || _b === void 0 ? void 0 : _b.fullName) || "Customer",
            paymentDate: (order === null || order === void 0 ? void 0 : order.date) || new Date(),
            transaction_Id: (order === null || order === void 0 ? void 0 : order.transaction_Id) || "N/A",
            amount: (_c = order === null || order === void 0 ? void 0 : order.amount) !== null && _c !== void 0 ? _c : 0,
            vat: (_d = order === null || order === void 0 ? void 0 : order.vat) !== null && _d !== void 0 ? _d : 0,
            orderStatusLink: showingOrderStatus,
        },
    };
    const htmlData = (0, purchasedHtmlContent_1.default)(info);
    const mailInfo = {
        email: "Mahbubul Hasan",
        subject: "Purchased from Greensteps",
        htmlData: htmlData,
    };
    yield (0, sendMail_1.sendMail)(mailInfo);
    res.redirect(`${config_1.default === null || config_1.default === void 0 ? void 0 : config_1.default.PAYMENT_REDIRECT_URL}/order/payment/success/${transaction_Id}`);
}));
const paymentFailedController = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const transaction_Id = req.params.transactionId;
    yield order_model_1.Order.findOneAndUpdate({ transaction_Id }, { paymentStatus: false }, { new: true, upsert: true });
}));
const paymentCancelController = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const transaction_Id = req.params.transactionId;
    const updateOrder = yield order_model_1.Order.findOneAndUpdate({ transaction_Id }, { paymentStatus: false }, { new: true, upsert: true });
    res.redirect(`${config_1.default === null || config_1.default === void 0 ? void 0 : config_1.default.PAYMENT_REDIRECT_URL}`);
}));
const getPaymentOrderInfoController = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const transactionId = req.params.transactionId;
    const result = yield order_model_1.Order.findOne({ transaction_Id: transactionId }).select("-orders");
    if (!result) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, "Payment history not found");
    }
    else {
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: "Payment successfully",
            data: result,
        });
    }
}));
exports.orderController = {
    createOrderController,
    paymentSuccessController,
    paymentFailedController,
    paymentCancelController,
    getPaymentOrderInfoController,
};
