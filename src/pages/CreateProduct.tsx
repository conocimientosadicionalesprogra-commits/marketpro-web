import React, { useState } from 'react';
import { ArrowLeft, CheckCircle, XCircle } from 'lucide-react';
import ProductForm from '../components/ProductForm';
import type { Product } from '../types/product';

interface CreateProductProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

const CreateProduct: React.FC<CreateProductProps> = ({ currentView, onNavigate }) => {
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (data: Omit<Product, 'id'>) => {
    try {
      console.log('Creating product:', data);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate success
      setMessage({
        type: 'success',
        text: `Producto "${data.name}" creado exitosamente.`
      });

      // Clear message after 5 seconds
      setTimeout(() => {
        setMessage(null);
        onNavigate('list');
      }, 2000);

    } catch (error) {
      console.error('Error creating product:', error);
      setMessage({
        type: 'error',
        text: 'Error al crear el producto. Por favor, inténtelo de nuevo.'
      });

      // Clear error message after 5 seconds
      setTimeout(() => setMessage(null), 5000);
    }
  };

  const handleCancel = () => {
    console.log('Cancelled product creation');
    onNavigate('list');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <button
        onClick={handleCancel}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft size={20} />
        Volver a Lista de Productos
      </button>

      {/* Success/Error Messages */}
      {message && (
        <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
          message.type === 'success' 
            ? 'bg-success-50 border border-success-200 text-success-700' 
            : 'bg-error-50 border border-error-200 text-error-700'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle size={20} />
          ) : (
            <XCircle size={20} />
          )}
          <span className="font-medium">{message.text}</span>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Registrar Nuevo Producto
        </h1>

        <ProductForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
};

export default CreateProduct;