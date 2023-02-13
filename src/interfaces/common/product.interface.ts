export interface Product {
  _id?: string;
  name: string;
  slug?: string;
  description?: string;
  costPrice?: number;
  salePrice: number;
  hasTax?: boolean;
  tax?: number;
  sku: string;
  emiMonth?: number[];
  discountType?: number;
  discountAmount?: number;
  images?: string[];
  trackQuantity?: boolean;
  quantity?: number;
  category?: CatalogInfo;
  subCategory?: CatalogInfo;
  brand?: CatalogInfo;
  tags?: string[];
  status?: string;
  // Seo
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  // Point
  earnPoint?: boolean;
  pointType?: number;
  pointValue?: number;
  redeemPoint?: boolean;
  redeemType?: number;
  redeemValue?: number;
  // Discount Date Time
  discountStartDateTime?: Date;
  discountEndDateTime?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  select?: boolean;
}

interface CatalogInfo {
  _id: string;
  name: string;
  slug: string;
}
