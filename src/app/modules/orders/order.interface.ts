import { Types } from "mongoose";

export interface IOrderItem {
  size: string;
  color: string;
  price: number;
  productId: Types.ObjectId | string; // To accommodate string or ObjectId types
  name: string;
  image: string;
  quantity: number;
}

export interface IPersonInfo {
  division: string;
  district: string;
  upazila: string;
  fullName: string;
  email: string;
  mobileNumber: string;
  address: string;
  postalCode: string;
}

export interface IOrders {
  personInfo: IPersonInfo;
  order: IOrderItem[];
  paymentType: string;
  totalPrice: number;
}

export interface ICheckoutData {
  orders: IOrders;
  transaction_Id: string;
  paymentStatus: boolean;
  date: Date;
  amount: number;
  vat: number;
}
