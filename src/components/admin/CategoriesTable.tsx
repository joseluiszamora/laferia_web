"use client";

import { useState, useEffect, useCallback } from "react";
import { Edit, Trash2, Package, FolderTree, Eye } from "lucide-react";
import { getCategories, deleteCategory } from "@/actions/categories";
import {
  CategoryWithSubcategories,
  CategoryPaginationInfo,
} from "@/types/category";
import { CategoryFilters } from "./CategoryFilters";
import { Pagination } from "./Pagination";
import { CategoryDetailsModal } from "./CategoryDetailsModal";
import { EditCategoryModal } from "./EditCategoryModal";

export function CategoriesTable() {
  const [categories, setCategories] = useState<CategoryWithSubcategories[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [pagination, setPagination] = useState<CategoryPaginationInfo>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  });

  // Estados de filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [showOnlyRoot, setShowOnlyRoot] = useState(false);
  const [includeInactive, setIncludeInactive] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Estados para modales
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryWithSubcategories | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const loadCategories = useCallback(
    async (
      page: number = 1,
      search: string = "",
      onlyRoot: boolean = false,
      includeInactiveItems: boolean = false,
      limit: number = 10
    ) => {
      setLoading(true);
      const result = await getCategories({
        page,
        limit,
        search: search.trim(),
        parentId: onlyRoot ? null : undefined,
        includeInactive: includeInactiveItems,
      });

      if (result.success) {
        setCategories(result.data || []);
        if (result.pagination) {
          setPagination(result.pagination);
        }
      } else {
        console.error("Error loading categories:", result.error);
      }
      setLoading(false);
    },
    []
  );

  useEffect(() => {
    loadCategories(1, searchTerm, showOnlyRoot, includeInactive, itemsPerPage);
  }, [loadCategories, searchTerm, showOnlyRoot, includeInactive, itemsPerPage]);

  const handlePageChange = (page: number) => {
    loadCategories(
      page,
      searchTerm,
      showOnlyRoot,
      includeInactive,
      itemsPerPage
    );
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  const handleShowOnlyRootChange = (value: boolean) => {
    setShowOnlyRoot(value);
  };

  const handleIncludeInactiveChange = (value: boolean) => {
    setIncludeInactive(value);
  };

  const handleItemsPerPageChange = (value: number) => {
    setItemsPerPage(value);
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setShowOnlyRoot(false);
    setIncludeInactive(false);
    setItemsPerPage(10);
  };

  const handleViewCategory = (category: CategoryWithSubcategories) => {
    setSelectedCategory(category);
    setShowDetailsModal(true);
  };

  const handleEditCategory = (category: CategoryWithSubcategories) => {
    setSelectedCategory(category);
    setShowEditModal(true);
  };

  const handleCategoryUpdated = () => {
    loadCategories(
      pagination.page,
      searchTerm,
      showOnlyRoot,
      includeInactive,
      itemsPerPage
    );
  };

  const handleCloseModals = () => {
    setSelectedCategory(null);
    setShowDetailsModal(false);
    setShowEditModal(false);
  };

  const handleDelete = async (id: number, name: string) => {
    if (
      !confirm(`¿Estás seguro de que quieres eliminar la categoría "${name}"?`)
    ) {
      return;
    }

    setDeleting(id.toString());
    const result = await deleteCategory(id);

    if (result.success) {
      await loadCategories(
        pagination.page,
        searchTerm,
        showOnlyRoot,
        includeInactive,
        itemsPerPage
      );
    } else {
      alert(result.error || "Error al eliminar la categoría");
    }
    setDeleting(null);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("es-ES", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date(date));
  };

  const showingFrom = (pagination.page - 1) * pagination.limit + 1;
  const showingTo = Math.min(
    pagination.page * pagination.limit,
    pagination.total
  );

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow">
        <CategoryFilters
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          showOnlyRoot={showOnlyRoot}
          onShowOnlyRootChange={handleShowOnlyRootChange}
          includeInactive={includeInactive}
          onIncludeInactiveChange={handleIncludeInactiveChange}
          itemsPerPage={itemsPerPage}
          onItemsPerPageChange={handleItemsPerPageChange}
          onClearFilters={handleClearFilters}
        />
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-12 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <CategoryFilters
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        showOnlyRoot={showOnlyRoot}
        onShowOnlyRootChange={handleShowOnlyRootChange}
        includeInactive={includeInactive}
        onIncludeInactiveChange={handleIncludeInactiveChange}
        itemsPerPage={itemsPerPage}
        onItemsPerPageChange={handleItemsPerPageChange}
        onClearFilters={handleClearFilters}
      />

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Categoría
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Jerarquía
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Productos
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Subcategorías
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha Creación
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {categories.map((category) => (
              <tr key={category.categoryId} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {category.color && (
                      <div
                        className="w-4 h-4 rounded-full mr-3 border border-gray-300"
                        style={{ backgroundColor: category.color }}
                      ></div>
                    )}
                    {category.icon && (
                      <span className="mr-3 text-lg">{category.icon}</span>
                    )}
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {category.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        /{category.slug}
                      </div>
                      {category.description && (
                        <div className="text-xs text-gray-400 mt-1 max-w-xs truncate">
                          {category.description}
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-gray-900">
                    <FolderTree className="h-4 w-4 mr-2 text-gray-400" />
                    {category.parentCategory ? (
                      <span className="text-blue-600">
                        {category.parentCategory.name} → {category.name}
                      </span>
                    ) : (
                      <span className="text-green-600 font-medium">Raíz</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-gray-900">
                    <Package className="h-4 w-4 mr-2 text-gray-400" />
                    {category._count?.products || 0}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {category._count?.subcategories || 0}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      category.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {category.isActive ? "Activa" : "Inactiva"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatDate(category.createdAt)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button
                      className="text-blue-600 hover:text-blue-900 transition-colors"
                      title="Ver detalles"
                      onClick={() => handleViewCategory(category)}
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      className="text-green-600 hover:text-green-900 transition-colors"
                      title="Editar"
                      onClick={() => handleEditCategory(category)}
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      className="text-red-600 hover:text-red-900 transition-colors"
                      title="Eliminar"
                      disabled={deleting === category.categoryId.toString()}
                      onClick={() =>
                        handleDelete(category.categoryId, category.name)
                      }
                    >
                      <Trash2
                        className={`h-4 w-4 ${
                          deleting === category.categoryId.toString()
                            ? "animate-spin"
                            : ""
                        }`}
                      />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {categories.length === 0 && !loading && (
          <div className="text-center py-12">
            <FolderTree className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No se encontraron categorías
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || showOnlyRoot || includeInactive
                ? "Intenta ajustar los filtros o crear una nueva categoría."
                : "Comienza creando tu primera categoría."}
            </p>
          </div>
        )}
      </div>

      {pagination.total > 0 && (
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          onPageChange={handlePageChange}
          showingFrom={showingFrom}
          showingTo={showingTo}
          totalItems={pagination.total}
        />
      )}

      {/* Modales */}
      <CategoryDetailsModal
        isOpen={showDetailsModal}
        onClose={handleCloseModals}
        category={selectedCategory}
      />

      <EditCategoryModal
        isOpen={showEditModal}
        onClose={handleCloseModals}
        category={selectedCategory}
        onCategoryUpdated={handleCategoryUpdated}
      />
    </div>
  );
}
