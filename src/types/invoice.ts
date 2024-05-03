import { IAddressItem } from "./address";
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
  cgst: number;
  sgst: number;
  total: number;

  title: string;
  price: number;

  service: string;
  quantity: number;
  description: string;
};

export type IInvoice = {
  id: string;
  from: IUser;
  to?: IUser;
  cgst: number;
  sgst: number;
  total: number;

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
