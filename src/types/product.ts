// ----------------------------------------------------------------------

import { IUser } from "./user";

export type IProductFilterValue = string | string[] | number | number[];

export type IProductFilters = {
  rating: string;
  gender: string[];
  category: string;
  colors: string[];
  priceRange: number[];
};

// ----------------------------------------------------------------------

export type IProductReviewNewForm = {
  rating: number | null;
  review: string;
  name: string;
  email: string;
};

export type IProductReview = {
  id: string;
  name: string;
  rating: number;
  comment: string;
  helpful: number;
  avatarUrl: string;
  isPurchased: boolean;
  attachments?: string[];
  postedAt: Date;
};

export type IProductSchema = {
  id?: string;
  user: IUser;
  name: string;
  subDescription: string;
  description: string;
  images: string[] | File[];
  coverUrl: string;
  code: string;
  quantity: number;
  available: number;
  price: number;
  tax: number;
  transactionHash: string;
  createdAt: Date;
  updatedAt: Date;
};

export type IProductItem = {
  id: string;
  user: IUser;
  name: string;
  description: string;
  subDescription: string;
  images: string[];
  code: string;
  quantity: number;
  available: number;
  price: number;
  tax: number;
  coverUrl: string;
  createdAt: Date;
  updatedAt: Date;
  transactionHash: string;
  // totalSold: number;
  // totalRatings: number;
  // totalReviews: number;
  // inventoryType: string;
  // reviews: IProductReview[];
  // ratings: {
  //   name: string;
  //   starCount: number;
  //   reviewCount: number;
  // }[];
};

export type IProductTableFilterValue = string | string[];

export type IProductTableFilters = {
  name: string;
  stock: string[];
  // publish: string[];
};
