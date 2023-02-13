export interface Order {
  _id: string;
  orderId: string;
  discountTypes: DiscountType;
  name: string;
  phoneNo: string;
  email: string;
  city: string;
  district?: string;
  thana?: string;
  shippingAddress: string;
  paymentType: string;
  orderedItems: OrderedItem[];
  subTotal: number;
  deliveryCharge: number;
  discount: number;
  grandTotal: number;
  checkoutDate: string;
  deliveryDate?: any;
  paymentStatus: string;
  orderStatus: number;
  hasOrderTimeline?: boolean;
  processingDate?: Date;
  shippingDate?: Date;
  deliveringDate?: Date;
  preferredDate?: Date;
  preferredTime?: string;
  orderTimeline?: OrderTimeline;
  user?: string;
  productDiscount?: number;
  note?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deliveringDateAdmin?: Date;
}

export interface OrderedItem {
  _id: string;
  name: string;
  slug: string;
  image: string;
  category: any;
  subCategory: any;
  brand: any;
  regularPrice: number;
  unitPrice: number;
  quantity: number;
  orderType: string;
}

export interface OrderTimeline {
  confirmed: OrderTimelineType;
  processed: OrderTimelineType;
  shipped: OrderTimelineType;
  delivered: OrderTimelineType;
  canceled: OrderTimelineType;
  refunded: OrderTimelineType;
}

export interface DiscountType {
  type: string;
  amount: number;
}

export interface OrderTimelineType {
  success: boolean;
  date?: Date;
  expectedDate?: Date;
}
