import { IAddressItem } from "./address";
import { IOrderItem } from "./order";
import { IUser } from "./user";

// ----------------------------------------------------------------------

export type IInvoiceTableFilterValue = string | string[] | Date | null;

export type IInvoiceTableFilters = {
  name: string;
  service: string[];
  status: string;
  startDate: Date | null;
  endDate: Date | null;
};

// ----------------------------------------------------------------------

export type IInvoiceItem = {
  id: string;
  from: IUser;
  to?: IUser;
  total: number;
  order: IOrderItem;
  logistics: string;
  particular: string;
  quantity: number;
  price: number;
  deliveryCharges: number;
  tax: number;
  createdAt: Date;
  updateAt: Date;

  // -------------------------------
  cgst: number;
  sgst: number;
  title: string;
  service: string;
  description: string;
};

export type IInvoice = {
  id: string;
  from: IUser;
  to?: IUser;
  total: number;
  order: IOrderItem;
  // -------------------------------
  logistics: string;
  particular: string;
  quantity: number;
  price: number;
  deliveryCharges: number;
  tax: number;
  createdAt: Date;
  updateAt: Date;

  cgst: number;
  sgst: number;
  sent: number;
  dueDate: Date;
  taxes: number;
  status: string;
  subTotal: number;
  createDate: Date;
  discount: number;
  shipping: number;
  totalAmount: number;
  invoiceNumber: string;
  items: IInvoiceItem[];
  invoiceTo: IAddressItem;
  invoiceFrom: IAddressItem;
};
