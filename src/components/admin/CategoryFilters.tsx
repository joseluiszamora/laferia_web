import { Search, Filter, X } from "lucide-react";
import { useState } from "react";

interface CategoryFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  showOnlyRoot: boolean;
  onShowOnlyRootChange: (value: boolean) => void;
  includeInactive: boolean;
  onIncludeInactiveChange: (value: boolean) => void;
  itemsPerPage: number;
  onItemsPerPageChange: (value: number) => void;
  onClearFilters: () => void;
}

export function CategoryFilters({
  searchTerm,
  onSearchChange,
  showOnlyRoot,
  onShowOnlyRootChange,
  includeInactive,
  onIncludeInactiveChange,
  itemsPerPage,
  onItemsPerPageChange,
  onClearFilters,
}: CategoryFiltersProps) {
  const [showFilters, setShowFilters] = useState(false);

  const hasActiveFilters = searchTerm || showOnlyRoot || includeInactive;

  return (
    <div className="p-4 border-b border-gray-200">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Barra de búsqueda */}
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Buscar categorías por nombre, descripción o slug..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border rounded-md leading-5 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300 dark:border-gray-600"
            //   bg-white dark:bg-gray-800
          />
        </div>

        {/* Botón de filtros */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm  text-gray-900 dark:text-gray-500 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
            hasActiveFilters
              ? "text-blue-700 bg-blue-50 border-blue-300"
              : "text-gray-700  hover:bg-gray-50"
          }`}
        >
          <Filter className="h-4 w-4 mr-2" />
          Filtros
          {hasActiveFilters && (
            <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full">
              {
                [searchTerm, showOnlyRoot, includeInactive].filter(Boolean)
                  .length
              }
            </span>
          )}
        </button>

        {/* Limpiar filtros */}
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-800 dark:text-gray-100 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Panel de filtros expandible */}
      {showFilters && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Mostrar solo categorías raíz */}
            <div className="flex items-center">
              <input
                id="show-only-root"
                type="checkbox"
                checked={showOnlyRoot}
                onChange={(e) => onShowOnlyRootChange(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label
                htmlFor="show-only-root"
                className="ml-2 text-sm text-gray-700"
              >
                Solo categorías raíz
              </label>
            </div>

            {/* Incluir inactivas */}
            <div className="flex items-center">
              <input
                id="include-inactive"
                type="checkbox"
                checked={includeInactive}
                onChange={(e) => onIncludeInactiveChange(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label
                htmlFor="include-inactive"
                className="ml-2 text-sm text-gray-700"
              >
                Incluir inactivas
              </label>
            </div>

            {/* Items por página */}
            <div className="flex items-center space-x-2">
              <label htmlFor="items-per-page" className="text-sm text-gray-700">
                Por página:
              </label>
              <select
                id="items-per-page"
                value={itemsPerPage}
                onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
                className="border border-gray-300 rounded-md text-sm py-1 px-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
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
