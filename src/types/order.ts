// ----------------------------------------------------------------------

import { IProductItem } from "./product";
import { IRawMaterialItem } from "./raw-materials";
import { IServiceItem, ITransporterServiceItem } from "./service";
import { IUser } from "./user";

export type IOrderTableFilterValue = string | Date | null;

export type IOrderTableFilters = {
  name: string;
  status: string;
  startDate: Date | null;
  endDate: Date | null;
};

// ----------------------------------------------------------------------

export type IOrderHistory = {
  orderTime: Date;
  paymentTime: Date;
  deliveryTime: Date;
  completionTime: Date;
  timeline: {
    title: string;
    time: Date;
  }[];
};

// export type IOrderShippingAddress = {
//   fullAddress: string;
//   phoneNumber: string;
// };

export type IOrderPayment = {
  cardType: string;
  cardNumber: string;
};

export type IOrderDelivery = {
  // shipBy: string;
  id?: string;
  name: string;
  description: string;
  priceWithinState: number;
  priceInterState: number;
  priceInternationl: number;
  createdAt: Date;
  updatedAt: Date;
  transactionHash: string;
  coverUrl: string;
  // user: IUser;
  // speedy: string;
  // trackingNumber: string;
};

export type IOrderCustomer = {
  id: string;
  // name: string;
  email: string;
  // avatarUrl: string;
  // ipAddress: string;

  firstName: string;
  lastName: string;

  password: string;
  address: string;
  phoneNumber: string;
  isEmailVerified: boolean;
  profilePictureUrl: string;
  googleId: string;
  ethAddress: string;
  roles: string[];
};

export type IOrderProductItem = {
  id: string;
  sku: string;
  name: string;
  price: number;
  coverUrl: string;
  quantity: number;
  available: number;
  discount: number;
  code: number;
  createdAt: Date;
  // ---------
  user: IUser;
  description: string;
  subDescription: string;
  images: string[];
  tax: number;
  updatedAt: Date;
  transactionHash: string;
};

export type IOrderItem = {
  discount: number;
  id: string;
  from: IUser;
  via: IUser;
  to: IUser;
  product: IProductItem;
  service: IServiceItem;
  stepType: string;
  rawMaterial: IRawMaterialItem;
  transport: ITransporterServiceItem;
  total: number;
  deliveryCharges: number;
  tax: number;
  orderStatus: string;
  quantity: number;
  subTotal: number;
  orderNumber: string;
  // shipping: number;
  // discount: number;
  // totalAmount: number;
  // totalQuantity: number;
  // history: IOrderHistory;
  // customer: IOrderCustomer;
  // delivery: IOrderDelivery;
  items: IOrderProductItem[];
  createdAt: Date;
};
