// ----------------------------------------------------------------------

export type IRawMaterialFilterValue = string | string[] | number | number[];

export type IRawMaterialFilters = {
  rating: string;
  gender: string[];
  category: string;
  colors: string[];
  priceRange: number[];
};

// ----------------------------------------------------------------------

export type IRawMaterialReviewNewForm = {
  rating: number | null;
  review: string;
  name: string;
  email: string;
};

export type IRawMaterialReview = {
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

export type IRawMaterialSchema = {
  id?: string;
  name: string;
  description: string;
  subDescription: string;
  images: string[] | File[];
  code: string;
  quantity: number;
  price: number;
  tax: number;
  createdAt: Date;
  updatedAt: Date;
};

export type IRawMaterialItem = {
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
  updatedAt: Date;

  // totalSold: number;
  // totalRatings: number;
  // totalReviews: number;
  // inventoryType: string;
  // reviews: IRawMaterialReview[];
  // ratings: {
  //   name: string;
  //   starCount: number;
  //   reviewCount: number;
  // }[];
};

export type IRawMaterialTableFilterValue = string | string[];

export type IRawMaterialTableFilters = {
  name: string;
  stock: string[];
  // publish: string[];
};
