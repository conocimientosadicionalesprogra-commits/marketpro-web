import React, { useState } from "react";
import { ArrowLeft, Save, CheckCircle, XCircle, RotateCcw } from "lucide-react";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { sampleProducts } from "../data/products";
import { RETURN_REASONS } from "../types/movement";
import type { Movement, ReturnReason } from "../types/movement";

interface RegisterReturnProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

const RegisterReturn: React.FC<RegisterReturnProps> = ({ currentView, onNavigate }) => {
  const [formData, setFormData] = useState({
    productId: "",
    quantity: 0,
    reason: "customer_return" as ReturnReason,
    reference: "",
    customer: "",
    supplier: "",
    notes: "",
    unitCost: 0,
    returnType: "increase", // "increase" or "decrease"
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

    if (["customer_return"].includes(formData.reason) && !formData.customer.trim()) {
      newErrors.customer = "El cliente es requerido para este tipo de devolución";
    }

    if (["supplier_return"].includes(formData.reason) && !formData.supplier.trim()) {
      newErrors.supplier = "El proveedor es requerido para este tipo de devolución";
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
      
      const newReturn: Partial<Movement> = {
        type: "return",
        productId: formData.productId,
        productName: selectedProduct?.name || "",
        productSku: selectedProduct?.sku || "",
        quantity: formData.quantity,
        reason: formData.reason,
        reference: formData.reference || undefined,
        customer: formData.customer || undefined,
        supplier: formData.supplier || undefined,
        notes: formData.notes || undefined,
        unitCost: formData.unitCost || undefined,
        totalCost: formData.unitCost ? formData.unitCost * formData.quantity : undefined,
        createdBy: "admin",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      console.log("Registering return:", newReturn);

      const stockChange = formData.returnType === "increase" ? "+" : "-";
      setMessage({
        type: "success",
        text: `Devolución registrada exitosamente. Stock actualizado: ${stockChange}${formData.quantity} unidades.`
      });

      // Reset form
      setFormData({
        productId: "",
        quantity: 0,
        reason: "customer_return",
        reference: "",
        customer: "",
        supplier: "",
        notes: "",
        unitCost: 0,
        returnType: "increase",
      });

      // Clear message after 3 seconds
      setTimeout(() => {
        setMessage(null);
      }, 3000);

    } catch (error) {
      console.error("Error registering return:", error);
      setMessage({
        type: "error",
        text: "Error al registrar la devolución. Por favor, inténtelo de nuevo."
      });

      setTimeout(() => setMessage(null), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    onNavigate("returns-list");
  };

  const totalCost = formData.unitCost * formData.quantity;

  // Determine if this return increases or decreases stock based on reason
  React.useEffect(() => {
    if (formData.reason === "customer_return" || formData.reason === "quality_issue") {
      setFormData(prev => ({ ...prev, returnType: "increase" }));
    } else if (formData.reason === "supplier_return") {
      setFormData(prev => ({ ...prev, returnType: "decrease" }));
    }
  }, [formData.reason]);

  return (
    <div className="max-w-4xl mx-auto">
      <button
        onClick={handleBack}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft size={20} />
        Volver a Listado de Devoluciones
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
          <RotateCcw className="text-warning-500" size={24} />
          <h1 className="text-2xl font-bold text-gray-900">Registrar Devolución</h1>
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
                    {product.name} ({product.sku}) - Stock: {product.stock}
                  </option>
                ))}
              </select>
              {errors.productId && (
                <div className="text-sm text-gray-900">{returnItem.reference || "-"}</div>
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
              placeholder="Cantidad devuelta"
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
                {RETURN_REASONS.map((reason) => (
                  <option key={reason.value} value={reason.value}>
                    {reason.label}
                  </option>
                ))}
              </select>
              {errors.reason && (
                <p className="mt-1 text-sm text-red-500">{errors.reason}</p>
              )}
            </div>

            {/* Return Type */}
            <div className="form-control">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Efecto en Inventario *
              </label>
              <select
                value={formData.returnType}
                onChange={(e) => handleInputChange("returnType", e.target.value)}
                className="w-full py-2 px-4 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
              >
                <option value="increase">Aumentar Stock (Devolución de Cliente)</option>
                <option value="decrease">Disminuir Stock (Devolución a Proveedor)</option>
              </select>
            </div>

            {/* Reference */}
            <Input
              label="Referencia/Documento"
              value={formData.reference}
              onChange={(e) => handleInputChange("reference", e.target.value)}
              error={errors.reference}
              placeholder="Número de devolución, orden, etc."
            />

            {/* Customer - Show only for customer returns */}
            {["customer_return", "quality_issue", "defective"].includes(formData.reason) && (
              <Input
                label="Cliente *"
                value={formData.customer}
                onChange={(e) => handleInputChange("customer", e.target.value)}
                error={errors.customer}
                placeholder="Nombre del cliente"
              />
            )}

            {/* Supplier - Show only for supplier returns */}
            {["supplier_return"].includes(formData.reason) && (
              <Input
                label="Proveedor *"
                value={formData.supplier}
                onChange={(e) => handleInputChange("supplier", e.target.value)}
                error={errors.supplier}
                placeholder="Nombre del proveedor"
              />
            )}

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
              Observaciones *
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              rows={3}
              className="w-full py-2 px-4 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
              placeholder="Describa el motivo de la devolución, estado del producto, etc."
              required
            />
          </div>

          {/* Summary */}
          {selectedProduct && formData.quantity > 0 && (
            <div className="bg-warning-50 p-4 rounded-lg border border-warning-200">
              <h3 className="font-medium text-gray-900 mb-2">Resumen de la Devolución</h3>
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
                  <span className="text-gray-600">Cantidad devuelta:</span>
                  <span className="ml-2 font-medium text-warning-700">
                    {formData.returnType === "increase" ? "+" : "-"}{formData.quantity} unidades
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Nuevo stock:</span>
                  <span className="ml-2 font-medium text-warning-700">
                    {formData.returnType === "increase" 
                      ? selectedProduct.stock + formData.quantity 
                      : selectedProduct.stock - formData.quantity
                    } unidades
                  </span>
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
              Registrar Devolución
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterReturn;