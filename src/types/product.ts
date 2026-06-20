export interface Product {
  id?: string;
  name: string;
  sku: string;
  category: string;
  purchasePrice: number;
  salePrice: number;
  stock: number;
  expiryDate?: Date | null;
  image?: string;
}

export const PRODUCT_CATEGORIES = [
  'Electrónicos',
  'Ropa',
  'Alimentos',
  'Bebidas',
  'Hogar',
  'Oficina',
  'Otros'
] as const;