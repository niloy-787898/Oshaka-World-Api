export interface OfferProduct {
  _id?: string;
  readOnly?: boolean;
  name?: string; 
  description?: string;
  category?: string;
  promotionalOffer?: string;
  promotionalOfferSlug?: string;
  products?:[string];
}