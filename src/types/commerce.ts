export interface CartItemCustomization {
  size?: string;
  milk?: string;
  roast?: string;
  temperature?: string;
  extraShot?: boolean;
  grind?: string;
  warmed?: boolean;
  notes?: string;
}

export interface CartItem {
  cartId: string;
  menuId: string;
  name: string;
  image: string;
  unitPrice: number;
  quantity: number;
  summary: string;
  customization: CartItemCustomization;
}

export type OrderStage = 0 | 1 | 2 | 3;

export interface ConfirmedOrder {
  orderNumber: string;
  createdAt: string;
  customerName: string;
  customerPhone: string;
  fulfillment: 'pickup' | 'table';
  tableNumber?: string;
  pickupWindow: string;
  paymentMethod: 'card' | 'counter';
  items: CartItem[];
  subtotal: number;
  discount: number;
  tax: number;
  tip: number;
  total: number;
  stage: OrderStage;
}

export interface ReservationRecord {
  code: string;
  tableId: string;
  tableLabel: string;
  zone: string;
  date: string;
  timeSlot: string;
  guests: number;
  guestName: string;
  guestEmail: string;
  note: string;
  createdAt: string;
}
