import { Product } from "../types/product";

export const sampleProducts: Product[] = [
  {
    id: "1",
    name: "Arroz Diana Premium",
    sku: "ALI-ARR-001",
    category: "Alimentos",
    purchasePrice: 1800,
    salePrice: 2200,
    stock: 150,
    expiryDate: new Date("2025-12-31")
  },
  {
    id: "2",
    name: "Leche Alpina Deslactosada",
    sku: "LAC-LEC-001",
    category: "Bebidas",
    purchasePrice: 2500,
    salePrice: 3200,
    stock: 25, // Low stock example
    expiryDate: new Date("2024-04-15")
  },
  {
    id: "3",
    name: "Papel Higiénico Familia",
    sku: "HOG-PAP-001",
    category: "Hogar",
    purchasePrice: 8500,
    salePrice: 10500,
    stock: 45,
    expiryDate: null
  },
  {
    id: "4",
    name: "Coca-Cola 3L",
    sku: "BEB-COC-001",
    category: "Bebidas",
    purchasePrice: 4500,
    salePrice: 5800,
    stock: 60,
    expiryDate: new Date("2024-06-30")
  },
  {
    id: "5",
    name: "Detergente en Polvo",
    sku: "HOG-DET-001",
    category: "Hogar",
    purchasePrice: 12000,
    salePrice: 15000,
    stock: 15, // Critical stock example
    expiryDate: null
  },
  {
    id: "6",
    name: "Atún en Lata",
    sku: "ALI-ATU-001",
    category: "Alimentos",
    purchasePrice: 3200,
    salePrice: 4500,
    stock: 100,
    expiryDate: new Date("2025-08-15")
  },
  {
    id: "7",
    name: "Jabón de Baño",
    sku: "HOG-JAB-001",
    category: "Hogar",
    purchasePrice: 1500,
    salePrice: 2000,
    stock: 120,
    expiryDate: new Date("2025-03-20")
  },
  {
    id: "8",
    name: "Galletas Festival",
    sku: "ALI-GAL-001",
    category: "Alimentos",
    purchasePrice: 800,
    salePrice: 1200,
    stock: 200,
    expiryDate: new Date("2024-09-10")
  },
  {
    id: "9",
    name: "Aceite Vegetal",
    sku: "ALI-ACE-001",
    category: "Alimentos",
    purchasePrice: 7500,
    salePrice: 9000,
    stock: 75,
    expiryDate: new Date("2024-12-31")
  },
  {
    id: "10",
    name: "Papel Toalla",
    sku: "HOG-TOA-001",
    category: "Hogar",
    purchasePrice: 4000,
    salePrice: 5500,
    stock: 35, // Low stock example
    expiryDate: null
  }
];