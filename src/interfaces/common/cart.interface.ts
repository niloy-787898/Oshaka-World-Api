import { Product } from './product.interface';
import { User } from '../user/user.interface';

export interface Cart {
  _id?: string;
  product?: string | Product;
  user?: string | User;
  selectedQty?: Number;
  createdAt?: Date;
  updatedAt?: Date;
}
