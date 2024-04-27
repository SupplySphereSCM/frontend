// ----------------------------------------------------------------------

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

  name: string;
  subDescription: string;
  description: string;
  images: string[] | File[];

  code: string;
  quantity: number;

  price: number;
  tax: number;
};

export type IProductItem = {
  id: string;

  name: string;
  description: string;
  subDescription: string;
  images: string[];

  code: string;
  quantity: number;

  price: number;
  tax: number;

  available: number;
  coverUrl: string;
  createdAt: Date;

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
