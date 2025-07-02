"use client";

import { useState, useEffect } from "react";
import { Filter, X } from "lucide-react";
import { getCategories } from "@/actions/categories";
import { getAllMarcasForSelect } from "@/actions/marcas";
import { CategoryWithSubcategories } from "@/types/category";
import { ProductStatus } from "@prisma/client";

interface ProductFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
  selectedMarca: string;
  onMarcaChange: (value: string) => void;
  selectedStatus: ProductStatus | "";
  onStatusChange: (value: ProductStatus | "") => void;
  isAvailable?: boolean | "";
  onIsAvailableChange: (value: boolean | "") => void;
  isFeatured?: boolean | "";
  onIsFeaturedChange: (value: boolean | "") => void;
  sortBy: string;
  onSortByChange: (value: string) => void;
  sortOrder: "asc" | "desc";
  onSortOrderChange: (value: "asc" | "desc") => void;
  itemsPerPage: number;
  onItemsPerPageChange: (value: number) => void;
  onClearFilters: () => void;
}

interface MarcaOption {
  marcaId: string;
  name: string;
  slug: string;
}

export function ProductFilters({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedMarca,
  onMarcaChange,
  selectedStatus,
  onStatusChange,
  isAvailable,
  onIsAvailableChange,
  isFeatured,
  onIsFeaturedChange,
  sortBy,
  onSortByChange,
  sortOrder,
  onSortOrderChange,
  itemsPerPage,
  onItemsPerPageChange,
  onClearFilters,
}: ProductFiltersProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [categories, setCategories] = useState<CategoryWithSubcategories[]>([]);
  const [marcas, setMarcas] = useState<MarcaOption[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingMarcas, setLoadingMarcas] = useState(false);

  const hasActiveFilters =
    searchTerm ||
    selectedCategory ||
    selectedMarca ||
    selectedStatus ||
    isAvailable !== "" ||
    isFeatured !== "";

  // Cargar categorías y marcas
  useEffect(() => {
    const loadData = async () => {
      setLoadingCategories(true);
      setLoadingMarcas(true);

      const [categoriesResult, marcasResult] = await Promise.all([
        getCategories(),
        getAllMarcasForSelect(),
      ]);

      if (categoriesResult.success) {
        setCategories(categoriesResult.data || []);
      }

      if (marcasResult.success) {
        setMarcas(marcasResult.data || []);
      }

      setLoadingCategories(false);
      setLoadingMarcas(false);
    };

    loadData();
  }, []);

  const statusOptions = [
    { value: "", label: "Todos los estados" },
    {
      value: "PUBLICADO",
      label: "Publicado",
      color: "bg-green-100 text-green-800",
    },
    {
      value: "BORRADOR",
      label: "Borrador",
      color: "bg-gray-100 text-gray-800",
    },
    {
      value: "ARCHIVADO",
      label: "Archivado",
      color: "bg-purple-100 text-purple-800",
    },
    { value: "AGOTADO", label: "Agotado", color: "bg-red-100 text-red-800" },
  ];

  const availabilityOptions = [
    { value: "", label: "Todos" },
    { value: "true", label: "Disponibles" },
    { value: "false", label: "No disponibles" },
  ];

  const featuredOptions = [
    { value: "", label: "Todos" },
    { value: "true", label: "Destacados" },
    { value: "false", label: "No destacados" },
  ];

  const sortOptions = [
    { value: "createdAt", label: "Fecha de creación" },
    { value: "name", label: "Nombre" },
    { value: "price", label: "Precio" },
    { value: "stock", label: "Stock" },
    { value: "viewCount", label: "Vistas" },
    { value: "saleCount", label: "Ventas" },
  ];

  return (
    <div className="p-4 rounded-lg shadow-sm border border-gray-200 space-y-4">
      {/* Barra superior con búsqueda y botón de filtros */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-4 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-gray-900 dark:text-gray-100 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              hasActiveFilters
                ? "text-blue-700 bg-blue-50 border-blue-300"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filtros
            {hasActiveFilters && (
              <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full">
                {
                  [
                    searchTerm,
                    selectedCategory,
                    selectedMarca,
                    selectedStatus,
                    isAvailable !== "" ? "disponibilidad" : "",
                    isFeatured !== "" ? "destacado" : "",
                  ].filter(Boolean).length
                }
              </span>
            )}
          </button>

          {hasActiveFilters && (
            <button
              onClick={onClearFilters}
              className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Panel de filtros expandible */}
      {showFilters && (
        <div className="border-t border-gray-200 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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

            {/* Marca */}
            <div>
              <label
                htmlFor="marca-filter"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Marca
              </label>
              <select
                id="marca-filter"
                value={selectedMarca}
                onChange={(e) => onMarcaChange(e.target.value)}
                className="w-full border border-gray-300 rounded-md text-sm py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                disabled={loadingMarcas}
              >
                <option value="">Todas las marcas</option>
                {marcas.map((marca) => (
                  <option key={marca.marcaId} value={marca.marcaId}>
                    {marca.name}
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
                  onStatusChange(e.target.value as ProductStatus | "")
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

            {/* Disponibilidad */}
            <div>
              <label
                htmlFor="availability-filter"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Disponibilidad
              </label>
              <select
                id="availability-filter"
                value={isAvailable === "" ? "" : isAvailable ? "true" : "false"}
                onChange={(e) => {
                  const value = e.target.value;
                  onIsAvailableChange(value === "" ? "" : value === "true");
                }}
                className="w-full border border-gray-300 rounded-md text-sm py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              >
                {availabilityOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Destacado */}
            <div>
              <label
                htmlFor="featured-filter"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Destacado
              </label>
              <select
                id="featured-filter"
                value={isFeatured === "" ? "" : isFeatured ? "true" : "false"}
                onChange={(e) => {
                  const value = e.target.value;
                  onIsFeaturedChange(value === "" ? "" : value === "true");
                }}
                className="w-full border border-gray-300 rounded-md text-sm py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              >
                {featuredOptions.map((option) => (
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

            {/* Orden */}
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
                <option value="asc">Ascendente</option>
                <option value="desc">Descendente</option>
              </select>
            </div>

            {/* Elementos por página */}
            <div>
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
                <option value={10}>10</option>
                <option value={25}>25</option>
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
