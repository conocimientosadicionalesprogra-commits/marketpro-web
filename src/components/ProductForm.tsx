import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { Save, X, Trash2, Upload, Image as ImageIcon } from 'lucide-react';
import Input from './ui/Input';
import Button from './ui/Button';
import { Product, PRODUCT_CATEGORIES } from '../types/product';

const productSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido').max(100, 'El nombre no puede exceder 100 caracteres'),
  sku: z.string().min(1, 'El SKU es requerido').max(50, 'El SKU no puede exceder 50 caracteres'),
  category: z.enum(PRODUCT_CATEGORIES, {
    errorMap: () => ({ message: 'Seleccione una categoría válida' }),
  }),
  purchasePrice: z.number().min(0, 'El precio de compra debe ser mayor o igual a 0'),
  salePrice: z.number().min(0, 'El precio de venta debe ser mayor o igual a 0'),
  stock: z.number().int().min(0, 'El stock debe ser mayor o igual a 0'),
  expiryDate: z.string().nullable(),
  image: z.string().optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormProps {
  product?: Product;
  onSubmit: (data: ProductFormData) => void;
  onDelete?: () => void;
  onCancel: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({
  product,
  onSubmit,
  onDelete,
  onCancel,
}) => {
  const [imagePreview, setImagePreview] = useState<string | null>(product?.image || null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const defaultValues = product
    ? {
        ...product,
        expiryDate: product.expiryDate
          ? format(new Date(product.expiryDate), 'yyyy-MM-dd')
          : null,
      }
    : {
        name: '',
        sku: '',
        category: 'Otros' as const,
        purchasePrice: 0,
        salePrice: 0,
        stock: 0,
        expiryDate: null,
        image: '',
      };

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues,
  });

  const watchedSalePrice = watch('salePrice');
  const watchedPurchasePrice = watch('purchasePrice');

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Por favor seleccione un archivo de imagen válido');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('El archivo es demasiado grande. Máximo 5MB permitido');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImagePreview(result);
        setValue('image', result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setValue('image', '');
  };

  const handleFormSubmit = async (data: ProductFormData) => {
    // Additional validation
    if (data.salePrice < data.purchasePrice) {
      alert('El precio de venta no puede ser menor al precio de compra');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(data);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Image Upload Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Imagen del Producto</h3>
        <div className="flex items-start gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cargar Imagen
            </label>
            <div className="flex items-center gap-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <Upload size={18} />
                Seleccionar Imagen
              </label>
              {imagePreview && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={removeImage}
                  className="text-red-600 border-red-300 hover:bg-red-50"
                >
                  Eliminar
                </Button>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Formatos soportados: JPG, PNG, GIF. Máximo 5MB.
            </p>
          </div>
          
          {imagePreview ? (
            <div className="w-24 h-24 border border-gray-300 rounded-lg overflow-hidden">
              <img
                src={imagePreview}
                alt="Vista previa"
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
              <ImageIcon size={24} className="text-gray-400" />
            </div>
          )}
        </div>
      </div>

      {/* Product Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Nombre del producto *"
          {...register('name')}
          error={errors.name?.message}
          placeholder="Ingrese el nombre del producto"
        />

        <Input
          label="SKU *"
          {...register('sku')}
          error={errors.sku?.message}
          placeholder="Ingrese el código SKU"
        />

        <div className="form-control">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Categoría *
          </label>
          <select
            {...register('category')}
            className="w-full py-2 px-4 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
          >
            {PRODUCT_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="mt-1 text-sm text-red-500">{errors.category.message}</p>
          )}
        </div>

        <Input
          label="Precio de compra *"
          type="number"
          step="0.01"
          min="0"
          {...register('purchasePrice', { valueAsNumber: true })}
          error={errors.purchasePrice?.message}
          placeholder="0.00"
        />

        <Input
          label="Precio de venta *"
          type="number"
          step="0.01"
          min="0"
          {...register('salePrice', { valueAsNumber: true })}
          error={errors.salePrice?.message}
          placeholder="0.00"
        />

        <Input
          label="Stock inicial *"
          type="number"
          min="0"
          {...register('stock', { valueAsNumber: true })}
          error={errors.stock?.message}
          placeholder="0"
        />

        <Input
          label="Fecha de vencimiento (opcional)"
          type="date"
          {...register('expiryDate')}
          error={errors.expiryDate?.message}
          min={format(new Date(), 'yyyy-MM-dd')}
        />
      </div>

      {/* Price Validation Warning */}
      {watchedSalePrice && watchedPurchasePrice && watchedSalePrice < watchedPurchasePrice && (
        <div className="p-4 bg-warning-50 border border-warning-200 rounded-md">
          <p className="text-warning-700 text-sm">
            ⚠️ El precio de venta es menor al precio de compra. Esto resultará en pérdidas.
          </p>
        </div>
      )}

      <div className="flex justify-end gap-4 pt-4">
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          className="flex items-center gap-2"
        >
          <X size={18} />
          Cancelar
        </Button>

        {product && onDelete && (
          <Button
            type="button"
            variant="outline"
            onClick={onDelete}
            className="flex items-center gap-2 !text-error-500 !border-error-500 hover:!bg-error-50"
          >
            <Trash2 size={18} />
            Eliminar
          </Button>
        )}

        <Button
          type="submit"
          isLoading={isSubmitting}
          className="flex items-center gap-2"
        >
          <Save size={18} />
          {product ? 'Actualizar' : 'Guardar'}
        </Button>
      </div>
    </form>
  );
};

export default ProductForm;