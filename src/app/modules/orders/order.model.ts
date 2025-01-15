import { Schema, model, Types } from "mongoose";

// Define the schema for IOrderItem
const orderItemSchema = new Schema({
  size: { type: String, required: true },
  color: { type: String, required: true },
  price: { type: Number, required: true },
  productId: { type: Types.ObjectId, ref: "Product", required: true },
  name: { type: String, required: true },
  image: { type: String, required: true },
  quantity: { type: Number, required: true },
});

// Define the schema for IPersonInfo
const personInfoSchema = new Schema({
  division: { type: String, required: true },
  district: { type: String, required: true },
  upazila: { type: String, required: true },
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  mobileNumber: { type: String, required: true },
  address: { type: String, required: true },
  postalCode: { type: String, required: true },
});

// Define the schema for IOrders
const ordersSchema = new Schema({
  personInfo: { type: personInfoSchema, required: true },
  order: { type: [orderItemSchema], required: true },
  paymentType: { type: String, required: true },
  totalPrice: { type: Number, required: true },
});

// Define the schema for ICheckoutData
const checkoutDataSchema = new Schema({
  orders: { type: ordersSchema, required: true },
  transaction_Id: { type: String, required: true },
  paymentStatus: { type: Boolean, required: true },
  date: { type: Date, default: Date.now, required: true },
  amount: { type: Number, required: true },
  vat: { type: Number, required: true },
});

// Create and export the model
export const Order = model("CheckoutData", checkoutDataSchema);
