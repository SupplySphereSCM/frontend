import { updateProduct } from "src/api/product";
import { IUser } from "./user";
// ----------------------------------------------------------------------

export type IServiceFilterValue = string | string[] | number | number[];

export type IServiceFilters = {
  rating: string;
  gender: string[];
  category: string;
  colors: string[];
  priceRange: number[];
};

// ----------------------------------------------------------------------

export type IServiceReviewNewForm = {
  rating: number | null;
  review: string;
  name: string;
  email: string;
};

export type IServiceReview = {
  id: string;
  name: string;
  rating: number;
  comment: string;
  helpful: number;
  avatarUrl: string;
  isPurchased: boolean;
  attachments?: string[];
  postedAt: Date;
  createdAt: Date;
  updatedAt: Date;
};

export type IServiceSchema = {
  id?: string;
  eid: string;
  type: string;
  name: string;
  subDescription: string;
  description: string;
  images: string;
  code: string;
  quantity: number;
  volume: number;
  price: number;
  tax: number;
  createdAt: Date;
  updatedAt: Date;
  user: IUser;
  transactionHash: string;
};

export type IServiceItem = {
  length: any;
  id: string;
  eid: string;
  type: string;
  name: string;
  description: string;
  subDescription: string;
  images: string;
  code: string;
  quantity: number;
  volume: number;
  available: number;
  price: number;
  tax: number;
  coverUrl: string;
  createdAt: Date;
  updatedAt: Date;
  transactionHash: string;
  user: IUser;
  // totalSold: number;
  // totalRatings: number;
  // totalReviews: number;
  // inventoryType: string;
  // reviews: IServiceReview[];
  // ratings: {
  //   name: string;
  //   starCount: number;
  //   reviewCount: number;
  // }[];
};

export type ITransporterServiceItem = {
  id?: string;
  eid: string;
  name: string;
  description: string;
  priceWithinState: number;
  priceInterState: number;
  priceInternationl: number;
  createdAt: Date;
  updatedAt: Date;
  coverUrl: string;
  user: IUser;
  transactionHash: string;
  // totalSold: number;
  // totalRatings: number;
  // totalReviews: number;
  // inventoryType: string;
  // reviews: IServiceReview[];
  // ratings: {
  //   name: string;
  //   starCount: number;
  //   reviewCount: number;
  // }[];
};

export type ITransporterServiceSchema = {
  id?: string;
  eid: string;
  name: string;
  description: string;
  priceWithinState: number;
  priceInterState: number;
  priceInternationl: number;
  createdAt: Date;
  updatedAt: Date;
  transactionHash: string;
  coverUrl: string;
  user: IUser;
};

export type IServiceTableFilterValue = string | string[];

export type IServiceTableFilters = {
  name: string;
  stock: string[];
  // publish: string[];
};
