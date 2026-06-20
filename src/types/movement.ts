export type MovementType = 'entry' | 'exit' | 'return';

export type EntryReason = 'purchase' | 'donation' | 'production' | 'adjustment' | 'other';
export type ExitReason = 'sale' | 'internal_use' | 'damage' | 'obsolescence' | 'theft' | 'adjustment' | 'other';
export type ReturnReason = 'customer_return' | 'supplier_return' | 'quality_issue' | 'defective' | 'other';

export interface Movement {
  id: string;
  type: MovementType;
  productId: string;
  productName: string;
  productSku: string;
  quantity: number;
  reason: EntryReason | ExitReason | ReturnReason;
  reference?: string; // Document number, invoice, etc.
  supplier?: string;
  customer?: string;
  notes?: string;
  unitCost?: number;
  totalCost?: number;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export const ENTRY_REASONS: { value: EntryReason; label: string }[] = [
  { value: 'purchase', label: 'Compra' },
  { value: 'donation', label: 'Donación' },
  { value: 'production', label: 'Producción' },
  { value: 'adjustment', label: 'Ajuste de Inventario' },
  { value: 'other', label: 'Otro' },
];

export const EXIT_REASONS: { value: ExitReason; label: string }[] = [
  { value: 'sale', label: 'Venta' },
  { value: 'internal_use', label: 'Uso Interno' },
  { value: 'damage', label: 'Daño' },
  { value: 'obsolescence', label: 'Obsolescencia' },
  { value: 'theft', label: 'Robo/Pérdida' },
  { value: 'adjustment', label: 'Ajuste de Inventario' },
  { value: 'other', label: 'Otro' },
];

export const RETURN_REASONS: { value: ReturnReason; label: string }[] = [
  { value: 'customer_return', label: 'Devolución de Cliente' },
  { value: 'supplier_return', label: 'Devolución a Proveedor' },
  { value: 'quality_issue', label: 'Problema de Calidad' },
  { value: 'defective', label: 'Producto Defectuoso' },
  { value: 'other', label: 'Otro' },
];