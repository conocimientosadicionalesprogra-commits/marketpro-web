import React, { useState } from "react";
import ProductForm from "../components/ProductForm"; // Asegúrate de que la ruta a tu formulario sea correcta

interface Product {
  name: string; //nombre del producto//
  description: string; //descripcion del producto//
  price: number;  //precio del producto//
  stock: number;  //cantidad de stock del producto//  
  category: string; //categoria del producto//
  imageUrl: string; //url de la imagen del producto//
  // Agrega otros campos según sea necesario
}
interface CreateProductProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onAddProduct: (product: Product) => void;
}

const CreateProduct: React.FC<CreateProductProps> = ({currentView, onNavigate, onAddProduct }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: Product) => {
    setIsLoading(true);
    try {
      // 1. Enviamos el producto al estado global de App.tsx
      onAddProduct(data);
      
      // 2. Redirigimos inmediatamente a la lista
      onNavigate("list");
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <ProductForm 
        onSubmit={handleSubmit} 
        onCancel={() => onNavigate("list")}
        isLoading={isLoading}
      />
    </div>
  );
};

export default CreateProduct;
