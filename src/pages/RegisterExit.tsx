import React, { useState } from "react";
import { ArrowLeft, Save, CheckCircle, XCircle, ArrowDownCircle } from "lucide-react";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { sampleProducts } from "../data/products";
import { EXIT_REASONS } from "../types/movement";
import type { Movement, ExitReason } from "../types/movement";

interface RegisterExitProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

const RegisterExit: React.FC<RegisterExitProps> = ({ currentView, onNavigate }) => {
  const [formData, setFormData] = useState({
    productId: "",
    quantity: 0,
    reason: "sale" as ExitReason,
    reference: "",
    customer: "",
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

    if (selectedProduct && formData.quantity > selectedProduct.stock) {
      newErrors.quantity = `Stock insuficiente. Disponible: ${selectedProduct.stock}`;
    }

    if (!formData.reason) {
      newErrors.reason = "Debe seleccionar un motivo";
    }

    if (formData.reason === "sale" && !formData.customer.trim()) {
      newErrors.customer = "El cliente es requerido para ventas";
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
      
      const newExit: Partial<Movement> = {
        type: "exit",
        productId: formData.productId,
        productName: selectedProduct?.name || "",
        productSku: selectedProduct?.sku || "",
        quantity: formData.quantity,
        reason: formData.reason,
        reference: formData.reference || undefined,
        customer: formData.customer || undefined,
        notes: formData.notes || undefined,
        unitCost: formData.unitCost || undefined,
        totalCost: formData.unitCost ? formData.unitCost * formData.quantity : undefined,
        createdBy: "admin",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      console.log("Registering exit:", newExit);
      
      setMessage({
        type: "success",
        text: `Salida registrada exitosamente. Stock actualizado: -${formData.quantity} unidades.`
      });

      // Reset form
      setFormData({
        productId: "",
        quantity: 0,
        reason: "sale",
        reference: "",
        customer: "",
        notes: "",
        unitCost: 0,
      });

      // Clear message after 3 seconds
      setTimeout(() => {
        setMessage(null);
      }, 3000);

    } catch (error) {
      console.error("Error registering exit:", error);
      setMessage({
        type: "error",
        text: "Error al registrar la salida. Por favor, inténtelo de nuevo."
      });

      setTimeout(() => setMessage(null), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    onNavigate("exits-list");
  };

  const totalCost = formData.unitCost * formData.quantity;

  return (
    <div className="max-w-4xl mx-auto">
      <button
        onClick={handleBack}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft size={20} />
        Volver a Listado de Salidas
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
          <ArrowDownCircle className="text-primary" size={24} />
          <h1 className="text-2xl font-bold text-gray-900">Registrar Salida de Inventario</h1>
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
                <p className="mt-1 text-sm text-red-500">{errors.productId}</p>
              )}
            </div>

            {/* Quantity */}
            <Input
              label="Cantidad *"
              type="number"
              min="1"
              max={selectedProduct?.stock || undefined}
              value={formData.quantity || ""}
              onChange={(e) => handleInputChange("quantity", parseInt(e.target.value) || 0)}
              error={errors.quantity}
              placeholder="Cantidad a retirar"
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
                {EXIT_REASONS.map((reason) => (
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
              placeholder="Número de venta, orden, etc."
            />

            {/* Customer */}
            <Input
              label={`Cliente ${formData.reason === "sale" ? "*" : ""}`}
              value={formData.customer}
              onChange={(e) => handleInputChange("customer", e.target.value)}
              error={errors.customer}
              placeholder="Nombre del cliente"
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
            <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
              <h3 className="font-medium text-gray-900 mb-2">Resumen de la Salida</h3>
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
                  <span className="text-gray-600">Cantidad a retirar:</span>
                  <span className="ml-2 font-medium text-primary">-{formData.quantity} unidades</span>
                </div>
                <div>
                  <span className="text-gray-600">Nuevo stock:</span>
                  <span className={`ml-2 font-medium ${
                    selectedProduct.stock - formData.quantity < 20 ? "text-error-500" : "text-primary"
                  }`}>
                    {selectedProduct.stock - formData.quantity} unidades
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
              {selectedProduct.stock - formData.quantity < 20 && (
                <div className="mt-3 p-2 bg-warning-50 border border-warning-200 rounded text-warning-700 text-sm">
                  ⚠️ Advertencia: El stock resultante será crítico (menos de 20 unidades)
                </div>
              )}
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
              Registrar Salida
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterExit;