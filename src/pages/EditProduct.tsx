import React from 'react';
import { ArrowLeft } from 'lucide-react';
import ProductForm from '../components/ProductForm';
import type { Product } from '../types/product';

interface EditProductProps {
  product?: Product;
  onBack: () => void;
  currentView: string;
  onNavigate: (view: string) => void;
}

const EditProduct: React.FC<EditProductProps> = ({ product, onBack, currentView, onNavigate }) => {
  const handleSubmit = (data: Product) => {
    console.log('Updating product:', data);
    // Here you would typically make an API call to update the product
    onBack();
  };

  const handleDelete = () => {
    if (confirm('¿Está seguro de que desea eliminar este producto?')) {
      console.log('Deleting product:', product?.id);
      // Here you would typically make an API call to delete the product
      onBack();
    }
  };

  if (!product) {
    return <div>Producto no encontrado</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft size={20} />
        Volver
      </button>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Editar Producto: {product.name}
        </h1>

        <ProductForm
          product={product}
          onSubmit={handleSubmit}
          onDelete={handleDelete}
          onCancel={onBack}
        />
      </div>
    </div>
  );
};

export default EditProduct;