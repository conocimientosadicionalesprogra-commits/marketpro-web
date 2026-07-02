import React, { useState, useMemo } from "react";
import { Search, Filter, ArrowDownCircle, Eye } from "lucide-react";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { sampleMovements } from "../data/movements";
import { EXIT_REASONS } from "../types/movement";
import { formatDate } from "../utils/formatDate";

interface ExitsListProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

const ExitsList: React.FC<ExitsListProps> = ({ currentView, onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedReason, setSelectedReason] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Filter only exit movements
  const exits = sampleMovements.filter(movement => movement.type === "exit");

  // Filter and search logic
  const filteredExits = useMemo(() => {
    return exits.filter(exit => {
      // Search filter
      const matchesSearch = !searchQuery || 
        exit.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exit.productSku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exit.reference?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exit.customer?.toLowerCase().includes(searchQuery.toLowerCase());

      // Reason filter
      const matchesReason = !selectedReason || exit.reason === selectedReason;

      // Date filter
      const exitDate = new Date(exit.createdAt);
      const matchesStartDate = !startDate || exitDate >= new Date(startDate);
      const matchesEndDate = !endDate || exitDate <= new Date(endDate);

      return matchesSearch && matchesReason && matchesStartDate && matchesEndDate;
    });
  }, [exits, searchQuery, selectedReason, startDate, endDate]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedReason("");
    setStartDate("");
    setEndDate("");
  };

  const getReasonLabel = (reason: string) => {
    const reasonObj = EXIT_REASONS.find(r => r.value === reason);
    return reasonObj ? reasonObj.label : reason;
  };

  const getReasonColor = (reason: string) => {
    switch (reason) {
      case "sale":
        return "bg-success-100 text-success-700";
      case "internal_use":
        return "bg-primary/10 text-primary";
      case "damage":
        return "bg-error-100 text-error-700";
      case "obsolescence":
        return "bg-warning-100 text-warning-700";
      case "theft":
        return "bg-error-100 text-error-700";
      case "adjustment":
        return "bg-accent/10 text-accent";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const totalQuantity = filteredExits.reduce((sum, exit) => sum + exit.quantity, 0);
  const totalValue = filteredExits.reduce((sum, exit) => sum + (exit.totalCost || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <ArrowDownCircle className="text-primary" size={24} />
            <h1 className="text-2xl font-bold text-gray-900">Salidas de Inventario</h1>
          </div>
          <Button
            onClick={() => onNavigate("register-exit")}
            className="flex items-center gap-2"
          >
            <ArrowDownCircle size={18} />
            Registrar Salida
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
            <div className="text-sm text-gray-600">Total de Salidas</div>
            <div className="text-2xl font-bold text-primary">{filteredExits.length}</div>
          </div>
          <div className="bg-error-50 p-4 rounded-lg border border-error-200">
            <div className="text-sm text-gray-600">Cantidad Total</div>
            <div className="text-2xl font-bold text-error-700">{totalQuantity.toLocaleString()}</div>
          </div>
          <div className="bg-warning-50 p-4 rounded-lg border border-warning-200">
            <div className="text-sm text-gray-600">Valor Total</div>
            <div className="text-2xl font-bold text-warning-700">${totalValue.toLocaleString()}</div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 mb-4">
          <Filter className="text-primary" size={20} />
          <h2 className="text-lg font-semibold text-gray-900">Filtros</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Input
            label="Buscar"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Producto, SKU, referencia..."
            icon={<Search size={18} />}
            className="!mb-0"
          />
          
          <div className="form-control">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Motivo
            </label>
            <select
              value={selectedReason}
              onChange={(e) => setSelectedReason(e.target.value)}
              className="w-full py-2 px-4 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
            >
              <option value="">Todos los motivos</option>
              {EXIT_REASONS.map((reason) => (
                <option key={reason.value} value={reason.value}>
                  {reason.label}
                </option>
              ))}
            </select>
          </div>

          <Input
            label="Fecha Inicio"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="!mb-0"
          />

          <Input
            label="Fecha Fin"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="!mb-0"
          />

          <div className="flex items-end">
            <Button
              variant="outline"
              onClick={clearFilters}
              className="w-full"
            >
              Limpiar Filtros
            </Button>
          </div>
        </div>

        <div className="mt-4 text-sm text-gray-600">
          Mostrando {filteredExits.length} de {exits.length} salidas
        </div>
      </div>

      {/* Exits Table */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Producto</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cantidad</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Motivo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Referencia</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Costo Total</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredExits.length > 0 ? (
                filteredExits.map((exit) => (
                  <tr key={exit.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatDate(exit.createdAt)}</div>
                      <div className="text-xs text-gray-500">{exit.createdAt.toLocaleTimeString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{exit.productName}</div>
                      <div className="text-sm text-gray-500">{exit.productSku}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-error-600">-{exit.quantity}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getReasonColor(exit.reason)}`}>
                        {getReasonLabel(exit.reason)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{exit.reference || "-"}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{exit.customer || "-"}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {exit.totalCost ? `$${exit.totalCost.toLocaleString()}` : "-"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => console.log("View details:", exit.id)}
                        className="text-primary hover:text-primary/80"
                      >
                        <Eye size={16} />
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                    No se encontraron salidas que coincidan con los filtros aplicados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ExitsList;