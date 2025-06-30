import { Search, Filter, X } from "lucide-react";
import { useState, useEffect } from "react";
import { TiendaStatus } from "@prisma/client";
import { getCategories } from "@/actions/categories";
import { CategoryWithSubcategories } from "@/types/category";

interface TiendaFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
  selectedStatus: TiendaStatus | "";
  onStatusChange: (value: TiendaStatus | "") => void;
  sortBy: string;
  onSortByChange: (value: string) => void;
  sortOrder: "asc" | "desc";
  onSortOrderChange: (value: "asc" | "desc") => void;
  itemsPerPage: number;
  onItemsPerPageChange: (value: number) => void;
  onClearFilters: () => void;
}

export function TiendaFilters({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedStatus,
  onStatusChange,
  sortBy,
  onSortByChange,
  sortOrder,
  onSortOrderChange,
  itemsPerPage,
  onItemsPerPageChange,
  onClearFilters,
}: TiendaFiltersProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [categories, setCategories] = useState<CategoryWithSubcategories[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);

  const hasActiveFilters = searchTerm || selectedCategory || selectedStatus;

  // Cargar categorías
  useEffect(() => {
    const loadCategories = async () => {
      setLoadingCategories(true);
      const result = await getCategories();
      if (result.success) {
        setCategories(result.data || []);
      }
      setLoadingCategories(false);
    };

    loadCategories();
  }, []);

  const statusOptions = [
    { value: "", label: "Todos los estados" },
    { value: "ACTIVA", label: "Activa", color: "bg-green-100 text-green-800" },
    {
      value: "PENDIENTE",
      label: "Pendiente",
      color: "bg-yellow-100 text-yellow-800",
    },
    {
      value: "INACTIVA",
      label: "Inactiva",
      color: "bg-gray-100 text-gray-800",
    },
    {
      value: "SUSPENDIDA",
      label: "Suspendida",
      color: "bg-red-100 text-red-800",
    },
  ];

  const sortOptions = [
    { value: "fechaRegistro", label: "Fecha de registro" },
    { value: "nombre", label: "Nombre" },
    { value: "calificacionPromedio", label: "Calificación" },
    { value: "totalComentarios", label: "Total comentarios" },
  ];

  return (
    <div className="bg-white p-4 border-b border-gray-200">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Barra de búsqueda */}
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Buscar tiendas por nombre, propietario, email o dirección..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        {/* Botón de filtros */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
            hasActiveFilters
              ? "text-blue-700 bg-blue-50 border-blue-300"
              : "text-gray-700 bg-white hover:bg-gray-50"
          }`}
        >
          <Filter className="h-4 w-4 mr-2" />
          Filtros
          {hasActiveFilters && (
            <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full">
              {
                [searchTerm, selectedCategory, selectedStatus].filter(Boolean)
                  .length
              }
            </span>
          )}
        </button>

        {/* Limpiar filtros */}
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Panel de filtros expandible */}
      {showFilters && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Categoría */}
            <div>
              <label
                htmlFor="category-filter"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Categoría
              </label>
              <select
                id="category-filter"
                value={selectedCategory}
                onChange={(e) => onCategoryChange(e.target.value)}
                className="w-full border border-gray-300 rounded-md text-sm py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                disabled={loadingCategories}
              >
                <option value="">Todas las categorías</option>
                {categories.map((category) => (
                  <option key={category.categoryId} value={category.categoryId}>
                    {category.parentCategory
                      ? `${category.parentCategory.name} → `
                      : ""}
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Estado */}
            <div>
              <label
                htmlFor="status-filter"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Estado
              </label>
              <select
                id="status-filter"
                value={selectedStatus}
                onChange={(e) =>
                  onStatusChange(e.target.value as TiendaStatus | "")
                }
                className="w-full border border-gray-300 rounded-md text-sm py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Ordenar por */}
            <div>
              <label
                htmlFor="sort-by"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Ordenar por
              </label>
              <select
                id="sort-by"
                value={sortBy}
                onChange={(e) => onSortByChange(e.target.value)}
                className="w-full border border-gray-300 rounded-md text-sm py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Orden y Items por página */}
            <div className="space-y-2">
              <div>
                <label
                  htmlFor="sort-order"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Orden
                </label>
                <select
                  id="sort-order"
                  value={sortOrder}
                  onChange={(e) =>
                    onSortOrderChange(e.target.value as "asc" | "desc")
                  }
                  className="w-full border border-gray-300 rounded-md text-sm py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="desc">Descendente</option>
                  <option value="asc">Ascendente</option>
                </select>
              </div>
            </div>

            {/* Items por página */}
            <div className="sm:col-span-2 lg:col-span-1">
              <label
                htmlFor="items-per-page"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Por página
              </label>
              <select
                id="items-per-page"
                value={itemsPerPage}
                onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
                className="w-full border border-gray-300 rounded-md text-sm py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
