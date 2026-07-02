import React, { useState } from "react";
import { Plus, Edit2, Trash2, Save, X, Tags } from "lucide-react";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { PRODUCT_CATEGORIES } from "../types/product";

interface CategoriesProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

interface Category {
  id: string;
  name: string;
  description?: string;
  productCount: number;
}

const Categories: React.FC<CategoriesProps> = ({ currentView, onNavigate }) => {
  // Initialize categories from existing product categories
  const [categories, setCategories] = useState<Category[]>(
    PRODUCT_CATEGORIES.map((cat, index) => ({
      id: (index + 1).toString(),
      name: cat,
      description: `Categoría de ${cat.toLowerCase()}`,
      productCount: Math.floor(Math.random() * 20) + 1, // Mock product count
    }))
  );

  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryDescription, setNewCategoryDescription] = useState("");
  const [errors, setErrors] = useState<{ name?: string; description?: string }>({});

  const validateCategory = (name: string, description: string) => {
    const newErrors: { name?: string; description?: string } = {};

    if (!name.trim()) {
      newErrors.name = "El nombre de la categoría es requerido";
    } else if (name.length < 2) {
      newErrors.name = "El nombre debe tener al menos 2 caracteres";
    } else if (categories.some(cat => cat.name.toLowerCase() === name.toLowerCase() && cat.id !== editingCategory)) {
      newErrors.name = "Ya existe una categoría con este nombre";
    }

    if (description && description.length > 200) {
      newErrors.description = "La descripción no puede exceder 200 caracteres";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddCategory = () => {
    if (!validateCategory(newCategoryName, newCategoryDescription)) {
      return;
    }

    const newCategory: Category = {
      id: (categories.length + 1).toString(),
      name: newCategoryName.trim(),
      description: newCategoryDescription.trim() || undefined,
      productCount: 0,
    };

    setCategories([...categories, newCategory]);
    setNewCategoryName("");
    setNewCategoryDescription("");
    setIsAddingCategory(false);
    setErrors({});
  };

  const handleEditCategory = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    if (category) {
      setEditingCategory(categoryId);
      setNewCategoryName(category.name);
      setNewCategoryDescription(category.description || "");
      setErrors({});
    }
  };

  const handleUpdateCategory = () => {
    if (!validateCategory(newCategoryName, newCategoryDescription)) {
      return;
    }

    setCategories(categories.map(cat => 
      cat.id === editingCategory 
        ? { 
            ...cat, 
            name: newCategoryName.trim(),
            description: newCategoryDescription.trim() || undefined
          }
        : cat
    ));

    setEditingCategory(null);
    setNewCategoryName("");
    setNewCategoryDescription("");
    setErrors({});
  };

  const handleDeleteCategory = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    if (category && category.productCount > 0) {
      alert(`No se puede eliminar la categoría "${category.name}" porque tiene ${category.productCount} productos asociados.`);
      return;
    }

    if (confirm(`¿Está seguro de que desea eliminar la categoría "${category?.name}"?`)) {
      setCategories(categories.filter(cat => cat.id !== categoryId));
    }
  };

  const handleCancel = () => {
    setIsAddingCategory(false);
    setEditingCategory(null);
    setNewCategoryName("");
    setNewCategoryDescription("");
    setErrors({});
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Tags className="text-primary" size={24} />
            <h1 className="text-2xl font-bold text-gray-900">Gestión de Categorías</h1>
          </div>
          <Button
            onClick={() => setIsAddingCategory(true)}
            className="flex items-center gap-2"
            disabled={isAddingCategory || editingCategory !== null}
          >
            <Plus size={18} />
            Agregar Categoría
          </Button>
        </div>

        {/* Add Category Form */}
        {isAddingCategory && (
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Nueva Categoría</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Nombre de la categoría *"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                error={errors.name}
                placeholder="Ingrese el nombre de la categoría"
                autoFocus
              />
              <Input
                label="Descripción (opcional)"
                value={newCategoryDescription}
                onChange={(e) => setNewCategoryDescription(e.target.value)}
                error={errors.description}
                placeholder="Descripción de la categoría"
              />
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button
                type="button"
                variant="ghost"
                onClick={handleCancel}
                className="flex items-center gap-2"
              >
                <X size={16} />
                Cancelar
              </Button>
              <Button
                onClick={handleAddCategory}
                className="flex items-center gap-2"
              >
                <Save size={16} />
                Guardar
              </Button>
            </div>
          </div>
        )}

        {/* Categories List */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Categoría
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Descripción
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Productos
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {categories.map((category) => (
                <tr key={category.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingCategory === category.id ? (
                      <Input
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        error={errors.name}
                        placeholder="Nombre de la categoría"
                        className="!mb-0"
                      />
                    ) : (
                      <div className="text-sm font-medium text-gray-900">{category.name}</div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {editingCategory === category.id ? (
                      <Input
                        value={newCategoryDescription}
                        onChange={(e) => setNewCategoryDescription(e.target.value)}
                        error={errors.description}
                        placeholder="Descripción"
                        className="!mb-0"
                      />
                    ) : (
                      <div className="text-sm text-gray-500 max-w-xs truncate">
                        {category.description || "Sin descripción"}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-primary/10 text-primary">
                      {category.productCount} productos
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {editingCategory === category.id ? (
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleCancel}
                          className="text-gray-600 hover:text-gray-800"
                        >
                          <X size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleUpdateCategory}
                          className="text-primary hover:text-primary/80"
                        >
                          <Save size={16} />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditCategory(category.id)}
                          className="text-primary hover:text-primary/80"
                          disabled={isAddingCategory || editingCategory !== null}
                        >
                          <Edit2 size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteCategory(category.id)}
                          className="text-error-500 hover:text-error-600"
                          disabled={isAddingCategory || editingCategory !== null}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Categories;