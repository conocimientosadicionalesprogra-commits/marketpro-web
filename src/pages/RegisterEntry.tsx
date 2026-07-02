import React, { useState } from "react";
import { ArrowLeft, Save, CheckCircle, XCircle, ArrowUpCircle } from "lucide-react";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { sampleProducts } from "../data/products";
import { ENTRY_REASONS } from "../types/movement";
import type { Movement, EntryReason } from "../types/movement";

interface RegisterEntryProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

const RegisterEntry: React.FC<RegisterEntryProps> = ({ currentView, onNavigate }) => {
  const [formData, setFormData] = useState({
    productId: "",
    quantity: 0,
    reason: "purchase" as EntryReason,
    reference: "",
    supplier: "",
    notes: "",
    unitCost: 0,
  });
  
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const selectedProduct = sampleProducts.find(p => p.id === formData.productId);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.productId) {
      newErrors.productId = "Debe seleccionar un producto";
    }

    if (!formData.quantity || formData.quantity <= 0) {
      newErrors.quantity = "La cantidad debe ser mayor a 0";
    }

    if (!formData.reason) {
      newErrors.reason = "Debe seleccionar un motivo";
    }

    if (formData.reason === "purchase" && !formData.supplier.trim()) {
      newErrors.supplier = "El proveedor es requerido para compras";
    }

    if (formData.unitCost < 0) {
      newErrors.unitCost = "El costo unitario no puede ser negativo";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newEntry: Partial<Movement> = {
        type: "entry",
        productId: formData.productId,
        productName: selectedProduct?.name || "",
        productSku: selectedProduct?.sku || "",
        quantity: formData.quantity,
        reason: formData.reason,
        reference: formData.reference || undefined,
        supplier: formData.supplier || undefined,
        notes: formData.notes || undefined,
        unitCost: formData.unitCost || undefined,
        totalCost: formData.unitCost ? formData.unitCost * formData.quantity : undefined,
        createdBy: "admin",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      console.log("Registering entry:", newEntry);
      
      setMessage({
        type: "success",
        text: `Entrada registrada exitosamente. Stock actualizado: +${formData.quantity} unidades.`
      });

      // Reset form
      setFormData({
        productId: "",
        quantity: 0,
        reason: "purchase",
        reference: "",
        supplier: "",
        notes: "",
        unitCost: 0,
      });

      // Clear message after 3 seconds
      setTimeout(() => {
        setMessage(null);
      }, 3000);

    } catch (error) {
      console.error("Error registering entry:", error);
      setMessage({
        type: "error",
        text: "Error al registrar la entrada. Por favor, inténtelo de nuevo."
      });

      setTimeout(() => setMessage(null), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    onNavigate("entries-list");
  };

  const totalCost = formData.unitCost * formData.quantity;

  return (
    <div className="max-w-4xl mx-auto">
      <button
        onClick={handleBack}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft size={20} />
        Volver a Listado de Entradas
      </button>

      {/* Success/Error Messages */}
      {message && (
        <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
          message.type === "success" 
            ? "bg-success-50 border border-success-200 text-success-700" 
            : "bg-error-50 border border-error-200 text-error-700"
        }`}>
          {message.type === "success" ? (
            <CheckCircle size={20} />
          ) : (
            <XCircle size={20} />
          )}
          <span className="font-medium">{message.text}</span>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center gap-2 mb-6">
          <ArrowUpCircle className="text-accent" size={24} />
          <h1 className="text-2xl font-bold text-gray-900">Registrar Entrada de Inventario</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Product Selection */}
            <div className="form-control">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Producto *
              </label>
              <select
                value={formData.productId}
                onChange={(e) => handleInputChange("productId", e.target.value)}
                className="w-full py-2 px-4 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
              >
                <option value="">Seleccione un producto</option>
                {sampleProducts.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name} ({product.sku}) - Stock actual: {product.stock}
                  </option>
                ))}
              </select>
              {errors.productId && (
                <p className="mt-1 text-sm text-red-500">{errors.productId}</p>
              )}
            </div>

            {/* Quantity */}
            <Input
              label="Cantidad *"
              type="number"
              min="1"
              value={formData.quantity || ""}
              onChange={(e) => handleInputChange("quantity", parseInt(e.target.value) || 0)}
              error={errors.quantity}
              placeholder="Cantidad a ingresar"
            />

            {/* Reason */}
            <div className="form-control">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Motivo *
              </label>
              <select
                value={formData.reason}
                onChange={(e) => handleInputChange("reason", e.target.value)}
                className="w-full py-2 px-4 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
              >
                {ENTRY_REASONS.map((reason) => (
                  <option key={reason.value} value={reason.value}>
                    {reason.label}
                  </option>
                ))}
              </select>
              {errors.reason && (
                <p className="mt-1 text-sm text-red-500">{errors.reason}</p>
              )}
            </div>

            {/* Reference */}
            <Input
              label="Referencia/Documento"
              value={formData.reference}
              onChange={(e) => handleInputChange("reference", e.target.value)}
              error={errors.reference}
              placeholder="Número de factura, orden, etc."
            />

            {/* Supplier */}
            <Input
              label={`Proveedor ${formData.reason === "purchase" ? "*" : ""}`}
              value={formData.supplier}
              onChange={(e) => handleInputChange("supplier", e.target.value)}
              error={errors.supplier}
              placeholder="Nombre del proveedor"
            />

            {/* Unit Cost */}
            <Input
              label="Costo Unitario"
              type="number"
              step="0.01"
              min="0"
              value={formData.unitCost || ""}
              onChange={(e) => handleInputChange("unitCost", parseFloat(e.target.value) || 0)}
              error={errors.unitCost}
              placeholder="0.00"
            />
          </div>

          {/* Notes */}
          <div className="form-control">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Observaciones
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              rows={3}
              className="w-full py-2 px-4 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
              placeholder="Observaciones adicionales..."
            />
          </div>

          {/* Summary */}
          {selectedProduct && formData.quantity > 0 && (
            <div className="bg-accent/5 p-4 rounded-lg border border-accent/20">
              <h3 className="font-medium text-gray-900 mb-2">Resumen de la Entrada</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Producto:</span>
                  <span className="ml-2 font-medium">{selectedProduct.name}</span>
                </div>
                <div>
                  <span className="text-gray-600">Stock actual:</span>
                  <span className="ml-2 font-medium">{selectedProduct.stock} unidades</span>
                </div>
                <div>
                  <span className="text-gray-600">Cantidad a ingresar:</span>
                  <span className="ml-2 font-medium text-accent">+{formData.quantity} unidades</span>
                </div>
                <div>
                  <span className="text-gray-600">Nuevo stock:</span>
                  <span className="ml-2 font-medium text-accent">{selectedProduct.stock + formData.quantity} unidades</span>
                </div>
                {formData.unitCost > 0 && (
                  <>
                    <div>
                      <span className="text-gray-600">Costo unitario:</span>
                      <span className="ml-2 font-medium">${formData.unitCost.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Costo total:</span>
                      <span className="ml-2 font-medium">${totalCost.toLocaleString()}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={handleBack}
              className="flex items-center gap-2"
            >
              Cancelar
            </Button>

            <Button
              type="submit"
              isLoading={isSubmitting}
              className="flex items-center gap-2"
            >
              <Save size={18} />
              Registrar Entrada
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterEntry;