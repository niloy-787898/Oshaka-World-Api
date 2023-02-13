import { Product } from './product.interface';

export interface PromoOffer {
  _id?: string;
  title?: string;
  slug?: string;
  description?: string;
  bannerImage?: string;
  startDateTime?: Date;
  endDateTime?: Date;
  products?: string[] | Product[];
  createdAt?: Date;
  updatedAt?: Date;
}
