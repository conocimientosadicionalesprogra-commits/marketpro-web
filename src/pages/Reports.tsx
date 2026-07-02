import React, { useState } from "react";
import { FileSpreadsheet, Download, Search } from "lucide-react";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { sampleProducts } from "../data/products";
import { PRODUCT_CATEGORIES } from "../types/product";
import { formatDate } from "../utils/formatDate";

/**
 * PÁGINA DE REPORTES DE INVENTARIO
 * 
 * Esta página permite generar y exportar reportes del inventario con las siguientes funcionalidades:
 * 
 * FUNCIONALIDADES PRINCIPALES:
 * 1. Filtrado de productos por categoría, fechas y búsqueda de texto
 * 2. Generación de reportes en formato PDF y Excel
 * 3. Vista previa de los datos que se incluirán en el reporte
 * 4. Interfaz intuitiva con filtros y controles de exportación
 * 
 * FILTROS DISPONIBLES:
 * - Fecha de inicio y fin (para filtrar por rango de fechas)
 * - Categoría de productos (o "todas las categorías")
 * - Búsqueda por nombre de producto
 * 
 * FORMATOS DE EXPORTACIÓN:
 * - PDF: Para visualización e impresión
 * - Excel: Para análisis de datos y manipulación
 */

interface ReportsProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

const Reports: React.FC<ReportsProps> = ({ currentView, onNavigate }) => {
  // ESTADOS DEL COMPONENTE
  // Estos estados controlan los filtros y la funcionalidad de la página
  
  const [startDate, setStartDate] = useState(""); // Fecha de inicio para el filtro
  const [endDate, setEndDate] = useState(""); // Fecha de fin para el filtro
  const [selectedCategory, setSelectedCategory] = useState(""); // Categoría seleccionada (vacío = todas)
  const [searchQuery, setSearchQuery] = useState(""); // Texto de búsqueda para filtrar productos

  /**
   * FUNCIÓN PARA FILTRAR PRODUCTOS
   * 
   * Esta función aplica todos los filtros seleccionados por el usuario:
   * - Si no hay categoría seleccionada, incluye todas las categorías
   * - Si no hay búsqueda, incluye todos los productos
   * - Si hay búsqueda, busca en el nombre del producto (insensible a mayúsculas)
   * 
   * @returns Array de productos filtrados según los criterios
   */
  const getFilteredProducts = () => {
    return sampleProducts.filter(product => {
      // FILTRO POR CATEGORÍA
      // Si selectedCategory está vacío, incluye todas las categorías
      const matchesCategory = !selectedCategory || product.category === selectedCategory;

      // FILTRO POR BÚSQUEDA DE TEXTO
      // Si searchQuery está vacío, incluye todos los productos
      // Si hay texto, busca en el nombre del producto (insensible a mayúsculas)
      const matchesSearch = !searchQuery || 
        product.name.toLowerCase().includes(searchQuery.toLowerCase());

      // RETORNA TRUE SOLO SI EL PRODUCTO CUMPLE TODOS LOS FILTROS
      return matchesCategory && matchesSearch;
    });
  };

  /**
   * FUNCIÓN PARA GENERAR REPORTES
   * 
   * Esta función maneja la generación de reportes en diferentes formatos.
   * Obtiene los productos filtrados y simula la generación del archivo.
   * 
   * @param format - Formato del reporte ("pdf" o "excel")
   */
  const handleGenerateReport = (format: "pdf" | "excel") => {
    // OBTENER PRODUCTOS FILTRADOS
    const filteredProducts = getFilteredProducts();
    
    // VALIDAR QUE HAY PRODUCTOS PARA REPORTAR
    if (filteredProducts.length === 0) {
      alert("No hay productos que coincidan con los filtros seleccionados.");
      return;
    }

    // PREPARAR DATOS DEL REPORTE
    const reportData = {
      // Información de filtros aplicados
      filters: {
        startDate: startDate || "No especificada",
        endDate: endDate || "No especificada",
        category: selectedCategory || "Todas las categorías",
        searchQuery: searchQuery || "Sin búsqueda específica"
      },
      // Productos que se incluirán en el reporte
      products: filteredProducts,
      // Metadatos del reporte
      metadata: {
        totalProducts: filteredProducts.length,
        generatedAt: new Date().toLocaleString("es-ES"),
        format: format.toUpperCase()
      }
    };

    // SIMULAR GENERACIÓN DEL ARCHIVO
    // En una implementación real, aquí se llamaría a una API o librería de generación
    console.log(`Generando reporte en formato ${format.toUpperCase()}:`, reportData);
    
    // MOSTRAR CONFIRMACIÓN AL USUARIO
    const message = `Reporte ${format.toUpperCase()} generado exitosamente.\n` +
                   `Productos incluidos: ${filteredProducts.length}\n` +
                   `Filtros aplicados:\n` +
                   `- Categoría: ${reportData.filters.category}\n` +
                   `- Búsqueda: ${reportData.filters.searchQuery}`;
    
    alert(message);

    // SIMULAR DESCARGA DEL ARCHIVO
    // En una implementación real, aquí se descargaría el archivo generado
    simulateFileDownload(format, reportData);
  };

  /**
   * FUNCIÓN PARA SIMULAR DESCARGA DE ARCHIVO
   * 
   * Esta función simula la descarga de un archivo de reporte.
   * En una implementación real, se generaría el archivo real y se descargaría.
   * 
   * @param format - Formato del archivo
   * @param data - Datos del reporte
   */
  const simulateFileDownload = (format: "pdf" | "excel", data: any) => {
    // CREAR NOMBRE DEL ARCHIVO CON TIMESTAMP
    const timestamp = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    const fileName = `reporte_inventario_${timestamp}.${format === "excel" ? "xlsx" : "pdf"}`;
    
    // SIMULAR PROCESO DE DESCARGA
    console.log(`Descargando archivo: ${fileName}`);
    console.log("Contenido del archivo:", data);
    
    // En una implementación real, aquí se usaría algo como:
    // - Para PDF: jsPDF, PDFKit, o una API backend
    // - Para Excel: SheetJS, ExcelJS, o una API backend
  };

  /**
   * FUNCIÓN PARA LIMPIAR TODOS LOS FILTROS
   * 
   * Resetea todos los filtros a sus valores por defecto
   */
  const clearAllFilters = () => {
    setStartDate("");
    setEndDate("");
    setSelectedCategory("");
    setSearchQuery("");
  };

  // OBTENER PRODUCTOS FILTRADOS PARA MOSTRAR EN LA VISTA PREVIA
  const filteredProducts = getFilteredProducts();

  return (
    <div className="space-y-6">
      {/* SECCIÓN DE CONTROLES Y FILTROS */}
      <div className="bg-white rounded-lg shadow-md p-6">
        {/* ENCABEZADO DE LA PÁGINA */}
        <div className="flex items-center gap-2 text-gray-900 mb-6">
          <FileSpreadsheet size={24} />
          <h1 className="text-2xl font-bold">Reportes de Inventario</h1>
        </div>

        {/* CONTROLES DE FILTRADO */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* FILTRO POR FECHA DE INICIO */}
          <Input
            type="date"
            label="Fecha Inicio"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          
          {/* FILTRO POR FECHA DE FIN */}
          <Input
            type="date"
            label="Fecha Fin"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
          
          {/* FILTRO POR CATEGORÍA */}
          <div className="form-control">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Categoría
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full py-2 px-4 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
            >
              {/* OPCIÓN PARA TODAS LAS CATEGORÍAS */}
              <option value="">Todas las categorías</option>
              {/* OPCIONES PARA CADA CATEGORÍA ESPECÍFICA */}
              {PRODUCT_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          
          {/* FILTRO POR BÚSQUEDA DE TEXTO */}
          <Input
            type="text"
            label="Buscar producto"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Nombre del producto..."
            icon={<Search size={18} />}
          />
        </div>

        {/* INFORMACIÓN DE RESULTADOS FILTRADOS */}
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            <strong>Productos encontrados:</strong> {filteredProducts.length} de {sampleProducts.length} total
            {selectedCategory && (
              <span className="ml-2">
                | <strong>Categoría:</strong> {selectedCategory}
              </span>
            )}
            {searchQuery && (
              <span className="ml-2">
                | <strong>Búsqueda:</strong> "{searchQuery}"
              </span>
            )}
          </p>
        </div>

        {/* BOTONES DE ACCIÓN */}
        <div className="flex justify-between items-center">
          {/* BOTÓN PARA LIMPIAR FILTROS */}
          <Button
            variant="outline"
            onClick={clearAllFilters}
          >
            Limpiar Filtros
          </Button>

          {/* BOTONES DE EXPORTACIÓN */}
          <div className="flex gap-3">
            {/* BOTÓN PARA EXPORTAR A PDF */}
            <Button
              variant="outline"
              onClick={() => handleGenerateReport("pdf")}
              className="flex items-center gap-2"
              disabled={filteredProducts.length === 0}
            >
              <Download size={18} />
              Exportar PDF
            </Button>
            
            {/* BOTÓN PARA EXPORTAR A EXCEL */}
            <Button
              onClick={() => handleGenerateReport("excel")}
              className="flex items-center gap-2"
              disabled={filteredProducts.length === 0}
            >
              <Download size={18} />
              Exportar Excel
            </Button>
          </div>
        </div>
      </div>

      {/* SECCIÓN DE VISTA PREVIA DE DATOS */}
      <div className="bg-white rounded-lg shadow-md">
        {/* ENCABEZADO DE LA TABLA */}
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Vista Previa del Reporte
          </h2>
          <p className="text-sm text-gray-600">
            Estos son los productos que se incluirán en el reporte
          </p>
        </div>

        {/* TABLA DE PRODUCTOS */}
        <div className="overflow-x-auto">
          <table className="w-full">
            {/* ENCABEZADOS DE LA TABLA */}
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Producto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Categoría
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Precio Compra
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Precio Venta
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vencimiento
                </th>
              </tr>
            </thead>
            
            {/* CONTENIDO DE LA TABLA */}
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.length > 0 ? (
                // MOSTRAR PRODUCTOS FILTRADOS
                filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    {/* INFORMACIÓN DEL PRODUCTO */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{product.name}</div>
                      <div className="text-sm text-gray-500">{product.sku}</div>
                    </td>
                    
                    {/* CATEGORÍA DEL PRODUCTO */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-primary/10 text-primary">
                        {product.category}
                      </span>
                    </td>
                    
                    {/* STOCK ACTUAL */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{product.stock}</div>
                    </td>
                    
                    {/* PRECIO DE COMPRA */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        ${product.purchasePrice.toLocaleString()}
                      </div>
                    </td>
                    
                    {/* PRECIO DE VENTA */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        ${product.salePrice.toLocaleString()}
                      </div>
                    </td>
                    
                    {/* FECHA DE VENCIMIENTO */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {product.expiryDate ? formatDate(product.expiryDate) : "N/A"}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                // MENSAJE CUANDO NO HAY PRODUCTOS
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center">
                      <FileSpreadsheet size={48} className="text-gray-300 mb-4" />
                      <p className="text-lg font-medium">No hay productos para mostrar</p>
                      <p className="text-sm">
                        {searchQuery || selectedCategory 
                          ? "Intenta ajustar los filtros para ver más resultados"
                          : "No hay productos registrados en el sistema"
                        }
                      </p>
                    </div>
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

export default Reports;