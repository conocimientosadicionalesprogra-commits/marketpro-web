import React from "react";
import {
  Package,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  PlusCircle,
  Search,
  FileText,
  Settings,
  BarChart3,
  PieChart,
} from "lucide-react";
import { sampleProducts } from "../data/products";
import { PRODUCT_CATEGORIES } from "../types/product";

interface DashboardProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

interface MetricCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, icon, color, bgColor }) => (
  <div className={`${bgColor} rounded-lg p-6 shadow-sm border border-gray-200`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className={`text-3xl font-bold ${color} mt-2`}>{value.toLocaleString()}</p>
      </div>
      <div className={`${color} opacity-80`}>
        {icon}
      </div>
    </div>
  </div>
);

interface QuickActionProps {
  title: string;
  icon: React.ReactNode;
  onClick: () => void;
  color: string;
}

const QuickAction: React.FC<QuickActionProps> = ({ title, icon, onClick, color }) => (
  <button
    onClick={onClick}
    className={`${color} rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 text-left w-full`}
  >
    <div className="flex flex-col items-center text-center">
      <div className="text-primary mb-3">
        {icon}
      </div>
      <p className="text-sm font-medium text-gray-700">{title}</p>
    </div>
  </button>
);

const Dashboard: React.FC<DashboardProps> = ({ currentView, onNavigate }) => {
  // Calculate metrics from sample data
  const totalProducts = sampleProducts.length;
  const lowStockProducts = sampleProducts.filter(p => p.stock < 50).length;
  
  // Mock data for entries and exits
  const recentEntries = 45;
  const recentExits = 32;

  // Calculate category distribution
  const categoryData = PRODUCT_CATEGORIES.map(category => ({
    category,
    count: sampleProducts.filter(p => p.category === category).length
  })).filter(item => item.count > 0);

  // Mock data for monthly movements
  const monthlyMovements = [
    { label: "Entradas", value: 156, color: "bg-accent" },
    { label: "Salidas", value: 124, color: "bg-primary" },
    { label: "Devoluciones", value: 12, color: "bg-warning-500" },
  ];

  const total = monthlyMovements.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Panel de Control</h1>
        <p className="text-gray-600">Resumen general del sistema de inventarios</p>
      </div>

      {/* Row 1: Total Products and Low Stock */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <MetricCard
          title="Total de Productos"
          value={totalProducts}
          icon={<Package size={32} />}
          color="text-primary"
          bgColor="bg-white"
        />
        <MetricCard
          title="Stock Bajo"
          value={lowStockProducts}
          icon={<AlertTriangle size={32} />}
          color="text-error-500"
          bgColor="bg-white"
        />
      </div>

      {/* Row 2: Recent Entries and Exits */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <MetricCard
          title="Entradas Recientes"
          value={recentEntries}
          icon={<TrendingUp size={32} />}
          color="text-accent"
          bgColor="bg-white"
        />
        <MetricCard
          title="Salidas Recientes"
          value={recentExits}
          icon={<TrendingDown size={32} />}
          color="text-primary"
          bgColor="bg-white"
        />
      </div>

      {/* Row 3: Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Inventory by Category - Bar Chart */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 className="text-primary" size={24} />
            <h2 className="text-xl font-semibold text-gray-900">Inventario por Categoría</h2>
          </div>
          <div className="space-y-4">
            {categoryData.map((item, index) => (
              <div key={item.category} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">{item.category}</span>
                  <span className="text-sm text-gray-500">{item.count}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-primary h-3 rounded-full transition-all duration-300"
                    style={{
                      width: `${(item.count / Math.max(...categoryData.map(d => d.count))) * 100}%`
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Movements - Pie Chart */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center gap-2 mb-6">
            <PieChart className="text-primary" size={24} />
            <h2 className="text-xl font-semibold text-gray-900">Movimientos del Mes</h2>
          </div>
          <div className="flex flex-col items-center">
            {/* Simple pie chart representation */}
            <div className="relative w-40 h-40 mb-6">
              <div className="w-full h-full rounded-full border-8 border-gray-200 relative overflow-hidden">
                <div 
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: `conic-gradient(
                      #003366 0deg ${(monthlyMovements[0].value / total) * 360}deg,
                      #0E8B83 ${(monthlyMovements[0].value / total) * 360}deg ${((monthlyMovements[0].value + monthlyMovements[1].value) / total) * 360}deg,
                      #F59E0B ${((monthlyMovements[0].value + monthlyMovements[1].value) / total) * 360}deg 360deg
                    )`
                  }}
                ></div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white rounded-full w-20 h-20 flex items-center justify-center shadow-sm">
                  <span className="text-lg font-bold text-gray-700">{total}</span>
                </div>
              </div>
            </div>
            
            {/* Legend */}
            <div className="space-y-2 w-full">
              {monthlyMovements.map((item, index) => (
                <div key={item.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div 
                      className={`w-3 h-3 rounded-full ${
                        index === 0 ? "bg-primary" : 
                        index === 1 ? "bg-accent" : 
                        "bg-warning-500"
                      }`}
                    ></div>
                    <span className="text-sm text-gray-700">{item.label}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Row 4: Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <QuickAction
          title="Registrar Producto"
          icon={<PlusCircle size={32} />}
          onClick={() => onNavigate("create")}
          color="bg-white hover:bg-primary/5"
        />
        <QuickAction
          title="Buscar Producto"
          icon={<Search size={32} />}
          onClick={() => onNavigate("list")}
          color="bg-white hover:bg-accent/5"
        />
        <QuickAction
          title="Generar Reporte"
          icon={<FileText size={32} />}
          onClick={() => onNavigate("reports")}
          color="bg-white hover:bg-primary/5"
        />
        <QuickAction
          title="Configuración"
          icon={<Settings size={32} />}
          onClick={() => onNavigate("settings")}
          color="bg-white hover:bg-accent/5"
        />
      </div>
    </div>
  );
};

export default Dashboard;