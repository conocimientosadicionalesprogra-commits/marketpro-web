import React from "react";
import { AlertTriangle, ExternalLink, PackagePlus } from "lucide-react";
import Button from "../components/ui/Button";
import { sampleProducts } from "../data/products";

interface StockAlertsProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

const StockAlerts: React.FC<StockAlertsProps> = ({ currentView, onNavigate }) => {
  // Filter products with low stock (less than 50 units)
  const lowStockProducts = sampleProducts.map(product => ({
    ...product,
    minStock: 50, // Example minimum stock level
    status: product.stock < 30 ? "critical" : product.stock < 50 ? "warning" : "ok"
  })).filter(product => product.stock < product.minStock);

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-2 text-gray-900">
          <AlertTriangle className="text-error-500" size={24} />
          <h1 className="text-2xl font-bold">Alertas de Stock Bajo</h1>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Producto</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock Actual</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock Mínimo</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {lowStockProducts.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`
                    px-2 py-1 inline-flex items-center gap-1 text-xs leading-5 font-semibold rounded-full
                    ${product.status === "critical" ? "bg-error-100 text-error-700" : "bg-warning-100 text-warning-700"}
                  `}>
                    <AlertTriangle size={12} />
                    {product.status === "critical" ? "Crítico" : "Bajo" }
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{product.name}</div>
                  <div className="text-sm text-gray-500">{product.sku}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`text-sm font-medium ${
                    product.status === "critical" ? "text-error-600" : "text-warning-600"
                  }`}>
                    {product.stock} unidades
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {product.minStock} unidades
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => console.log("View details:", product.id)}
                      className="text-primary hover:text-primary/80"
                    >
                      <ExternalLink size={16} />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => console.log("Restock:", product.id)}
                      className="flex items-center gap-1"
                    >
                      <PackagePlus size={16} />
                      Reabastecer
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StockAlerts;