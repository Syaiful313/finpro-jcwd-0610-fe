// types/laundry-item.ts
export interface LaundryItem {
  id: number;
  name: string;
  category: string;
  basePrice: number;
  pricingType: "PER_PIECE" | "PER_KG";
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  _count?: {
    orderItems: number;
  };
}