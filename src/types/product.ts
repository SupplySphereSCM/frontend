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

export type IProductItem = {
  name: string;
  price: number;
  tax: number;
  images: string[];
  // available: number;
  description: string;
  subDescription: string;
  // priceSale: number | null;
  quantity: number;
  product_id: string;
  // coverUrl: string;
  // publish: string;
  // sku: string;
  // code: string;
  // tags: string[];
  // gender: string;
  // sizes: string[];
  // colors: string[];
  // category: string;
  // totalSold: number;
  // totalRatings: number;
  // totalReviews: number;
  // inventoryType: string;
  // reviews: IProductReview[];
  // createdAt: Date;
  // ratings: {
  //   name: string;
  //   starCount: number;
  //   reviewCount: number;
  // }[];
  // saleLabel: {
  //   enabled: boolean;
  //   content: string;
  // };
  // newLabel: {
  //   enabled: boolean;
  //   content: string;
  // };
};

export type IProductTableFilterValue = string | string[];

export type IProductTableFilters = {
  name: string;
  stock: string[];
  // publish: string[];
};
