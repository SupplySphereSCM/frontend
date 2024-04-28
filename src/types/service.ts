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
};

export type IServiceSchema = {
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

export type IServiceItem = {
  id: string;

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

export type IServiceTableFilterValue = string | string[];

export type IServiceTableFilters = {
  name: string;
  stock: string[];
  // publish: string[];
};
