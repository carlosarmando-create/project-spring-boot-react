export type Category = {
  id: number;
  name: string;
  slug: string;
  description: string;
  active: boolean;
};

export type Plant = {
  id: number;
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  price: number;
  stock: number;
  botanicalName: string | null;
  sizeLabel: string | null;
  featured: boolean;
  active: boolean;
  categoryId: number;
  categoryName: string;
  imageUrl: string | null;
};

export type AuthSession = {
  token: string;
  tokenType: string;
  userId: number;
  fullName: string;
  email: string;
  roles: string[];
};

export type ContactMessage = {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: string;
  createdAt: string;
};

export type OrderItem = {
  plantId: number;
  plantName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
};

export type Order = {
  id: number;
  status: string;
  totalAmount: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  paymentMethod: string;
  notes: string;
  createdAt: string;
  items: OrderItem[];
};

export type UserSummary = {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  enabled: boolean;
  roles: string[];
};
