import { updateProduct } from "src/api/product";
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
};

export type IServiceItem = {
  id: string;
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
  name: string;
  description: string;
  priceWithinState: number;
  priceInterState: number;
  priceInternationl: number;
  createdAt: Date;
  updatedAt: Date;
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
  name: string;
  description: string;
  priceWithinState: number;
  priceInterState: number;
  priceInternationl: number;
  createdAt: Date;
  updatedAt: Date;
};

export type IServiceTableFilterValue = string | string[];

export type IServiceTableFilters = {
  name: string;
  stock: string[];
  // publish: string[];
};
