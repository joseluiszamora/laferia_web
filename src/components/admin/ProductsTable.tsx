"use client";

import { useState, useEffect, useCallback } from "react";
import { Edit, Trash2, Eye } from "lucide-react";
import {
  getProducts,
  deleteProduct,
  toggleProductAvailability,
  toggleProductFeatured,
  updateProductStatus,
} from "@/actions/products";
import {
  ProductsTableParams,
  ProductWithDetails,
  ProductPaginationInfo,
} from "@/types/product";
import { ProductStatus } from "@prisma/client";
import { ProductFilters } from "./ProductFilters";
import { ProductDetailsModal } from "./ProductDetailsModal";
import { EditProductModal } from "./EditProductModal";
import { Pagination } from "./Pagination";

export function ProductsTable() {
  const [products, setProducts] = useState<ProductWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState<number | null>(null);
  const [pagination, setPagination] = useState<ProductPaginationInfo>({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });

  // Estados de filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedMarca, setSelectedMarca] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<ProductStatus | "">("");
  const [isAvailable, setIsAvailable] = useState<boolean | "">("");
  const [isFeatured, setIsFeatured] = useState<boolean | "">("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Estados para modales
  const [selectedProductId, setSelectedProductId] = useState<number>(0);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const loadProducts = useCallback(
    async (
      page: number = pagination.page,
      search: string = searchTerm,
      categoriaId: string = selectedCategory,
      marcaId: string = selectedMarca,
      status: ProductStatus | "" = selectedStatus,
      available: boolean | "" = isAvailable,
      featured: boolean | "" = isFeatured,
      sortField: string = sortBy,
      sortDirection: "asc" | "desc" = sortOrder,
      limit: number = itemsPerPage
    ) => {
      setLoading(true);

      const params: ProductsTableParams = {
        page,
        limit,
        search: search || undefined,
        categoryId: categoriaId ? parseInt(categoriaId) : undefined,
        brandId: marcaId ? parseInt(marcaId) : undefined,
        status: status || undefined,
        isAvailable: available !== "" ? available : undefined,
        isFeatured: featured !== "" ? featured : undefined,
        sortBy: sortField as
          | "name"
          | "price"
          | "stock"
          | "createdAt"
          | "viewCount"
          | "saleCount",
        sortOrder: sortDirection,
      };

      const result = await getProducts(params);

      if (result.success && result.data) {
        setProducts(result.data.products as ProductWithDetails[]);
        setPagination(result.data.pagination);
      } else {
        console.error("Error loading products:", result.error);
      }

      setLoading(false);
    },
    [
      pagination.page,
      searchTerm,
      selectedCategory,
      selectedMarca,
      selectedStatus,
      isAvailable,
      isFeatured,
      sortBy,
      sortOrder,
      itemsPerPage,
    ]
  );

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // Funciones de filtro
  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
  }, []);

  const handleCategoryChange = useCallback((value: string) => {
    setSelectedCategory(value);
  }, []);

  const handleMarcaChange = useCallback((value: string) => {
    setSelectedMarca(value);
  }, []);

  const handleStatusChange = useCallback((value: ProductStatus | "") => {
    setSelectedStatus(value);
  }, []);

  const handleIsAvailableChange = useCallback((value: boolean | "") => {
    setIsAvailable(value);
  }, []);

  const handleIsFeaturedChange = useCallback((value: boolean | "") => {
    setIsFeatured(value);
  }, []);

  const handleSortByChange = useCallback((value: string) => {
    setSortBy(value);
  }, []);

  const handleSortOrderChange = useCallback((value: "asc" | "desc") => {
    setSortOrder(value);
  }, []);

  const handleItemsPerPageChange = useCallback((value: number) => {
    setItemsPerPage(value);
    setPagination((prev) => ({ ...prev, limit: value }));
  }, []);

  const handleClearFilters = useCallback(() => {
    setSearchTerm("");
    setSelectedCategory("");
    setSelectedMarca("");
    setSelectedStatus("");
    setIsAvailable("");
    setIsFeatured("");
    setSortBy("createdAt");
    setSortOrder("desc");
  }, []);

  // Funciones de acciones
  const handleDelete = async (id: number) => {
    if (!confirm("¿Estás seguro de que deseas eliminar este producto?")) {
      return;
    }

    setDeleting(id);
    const result = await deleteProduct(id);

    if (result.success) {
      await loadProducts(
        pagination.page,
        searchTerm,
        selectedCategory,
        selectedMarca,
        selectedStatus,
        isAvailable,
        isFeatured,
        sortBy,
        sortOrder,
        itemsPerPage
      );
    } else {
      alert(result.error || "Error al eliminar el producto");
    }
    setDeleting(null);
  };

  const handleStatusUpdate = async (id: number, newStatus: ProductStatus) => {
    setUpdatingStatus(id);
    const result = await updateProductStatus(id, newStatus);

    if (result.success) {
      await loadProducts(
        pagination.page,
        searchTerm,
        selectedCategory,
        selectedMarca,
        selectedStatus,
        isAvailable,
        isFeatured,
        sortBy,
        sortOrder,
        itemsPerPage
      );
    } else {
      alert(result.error || "Error al actualizar el estado");
    }
    setUpdatingStatus(null);
  };

  const handleToggleAvailability = async (id: number) => {
    const result = await toggleProductAvailability(id);
    if (result.success) {
      await loadProducts(
        pagination.page,
        searchTerm,
        selectedCategory,
        selectedMarca,
        selectedStatus,
        isAvailable,
        isFeatured,
        sortBy,
        sortOrder,
        itemsPerPage
      );
    }
  };

  const handleToggleFeatured = async (id: number) => {
    const result = await toggleProductFeatured(id);
    if (result.success) {
      await loadProducts(
        pagination.page,
        searchTerm,
        selectedCategory,
        selectedMarca,
        selectedStatus,
        isAvailable,
        isFeatured,
        sortBy,
        sortOrder,
        itemsPerPage
      );
    }
  };

  const handleViewDetails = (productId: number) => {
    setSelectedProductId(productId);
    setShowDetailsModal(true);
  };

  const handleEdit = (productId: number) => {
    setSelectedProductId(productId);
    setShowEditModal(true);
  };

  const handleEditSuccess = async () => {
    await loadProducts(
      pagination.page,
      searchTerm,
      selectedCategory,
      selectedMarca,
      selectedStatus,
      isAvailable,
      isFeatured,
      sortBy,
      sortOrder,
      itemsPerPage
    );
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CR", {
      style: "currency",
      currency: "CRC",
    }).format(price);
  };

  const getStatusColor = (status: ProductStatus) => {
    switch (status) {
      case "PUBLISHED":
        return "bg-green-100 text-green-800";
      case "DRAFT":
        return "bg-gray-100 text-gray-800";
      case "ARCHIVED":
        return "bg-purple-100 text-purple-800";
      case "EXHAUSTED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStockStatus = (product: ProductWithDetails) => {
    if (!product.isAvailable) {
      return (
        <span className="px-2 py-1 text-xs font-semibold bg-red-100 text-red-800 rounded-full">
          No disponible
        </span>
      );
    }
    if (product.stock === 0) {
      return (
        <span className="px-2 py-1 text-xs font-semibold bg-yellow-100 text-yellow-800 rounded-full">
          Sin stock
        </span>
      );
    }
    if (product.stock <= product.lowStockAlert) {
      return (
        <span className="px-2 py-1 text-xs font-semibold bg-orange-100 text-orange-800 rounded-full">
          Stock bajo
        </span>
      );
    }
    return null;
  };

  const showingFrom = (pagination.page - 1) * pagination.limit + 1;
  const showingTo = Math.min(
    pagination.page * pagination.limit,
    pagination.total
  );

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow">
        <ProductFilters
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
          selectedMarca={selectedMarca}
          onMarcaChange={handleMarcaChange}
          selectedStatus={selectedStatus}
          onStatusChange={handleStatusChange}
          isAvailable={isAvailable}
          onIsAvailableChange={handleIsAvailableChange}
          isFeatured={isFeatured}
          onIsFeaturedChange={handleIsFeaturedChange}
          sortBy={sortBy}
          onSortByChange={handleSortByChange}
          sortOrder={sortOrder}
          onSortOrderChange={handleSortOrderChange}
          itemsPerPage={itemsPerPage}
          onItemsPerPageChange={handleItemsPerPageChange}
          onClearFilters={handleClearFilters}
        />
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ProductFilters
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
        selectedMarca={selectedMarca}
        onMarcaChange={handleMarcaChange}
        selectedStatus={selectedStatus}
        onStatusChange={handleStatusChange}
        isAvailable={isAvailable}
        onIsAvailableChange={handleIsAvailableChange}
        isFeatured={isFeatured}
        onIsFeaturedChange={handleIsFeaturedChange}
        sortBy={sortBy}
        onSortByChange={handleSortByChange}
        sortOrder={sortOrder}
        onSortOrderChange={handleSortOrderChange}
        itemsPerPage={itemsPerPage}
        onItemsPerPageChange={handleItemsPerPageChange}
        onClearFilters={handleClearFilters}
      />

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Producto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Categoría
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Precio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    No se encontraron productos
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.productId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-lg bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-500 text-xs font-medium">
                              {product.name.substring(0, 2).toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
                            {product.name}
                          </div>
                          {product.sku && (
                            <div className="text-sm text-gray-500">
                              SKU: {product.sku}
                            </div>
                          )}
                          <div className="flex items-center space-x-2 mt-1">
                            {product.isFeatured && (
                              <span className="text-yellow-500 text-xs">
                                ⭐
                              </span>
                            )}
                            {getStockStatus(product)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {product.category.name}
                      </div>
                      {product.brand && (
                        <div className="text-sm text-gray-500">
                          {product.brand.name}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {formatPrice(Number(product.price))}
                      </div>
                      {product.discountedPrice && (
                        <div className="text-sm text-green-600 font-medium">
                          {formatPrice(Number(product.discountedPrice))}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {product.stock}
                        {product.stock <= product.lowStockAlert && (
                          <span className="ml-1 text-orange-500 text-xs">
                            ⚠️
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={product.status}
                        onChange={(e) =>
                          handleStatusUpdate(
                            product.productId,
                            e.target.value as ProductStatus
                          )
                        }
                        disabled={updatingStatus === product.productId}
                        className={`text-xs font-semibold rounded-full px-2 py-1 border-0 focus:ring-2 focus:ring-blue-500 ${getStatusColor(
                          product.status
                        )}`}
                      >
                        <option value="PUBLISHED">Publicado</option>
                        <option value="DRAFT">Borrador</option>
                        <option value="ARCHIVED">Archivado</option>
                        <option value="EXHAUSTED">Agotado</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleViewDetails(product.productId)}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="Ver producto"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(product.productId)}
                          className="text-green-600 hover:text-green-900"
                          title="Editar producto"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() =>
                            handleToggleAvailability(product.productId)
                          }
                          className={`${
                            product.isAvailable
                              ? "text-yellow-600 hover:text-yellow-900"
                              : "text-green-600 hover:text-green-900"
                          }`}
                          title={product.isAvailable ? "Desactivar" : "Activar"}
                        >
                          {product.isAvailable ? "⏸️" : "▶️"}
                        </button>
                        <button
                          onClick={() =>
                            handleToggleFeatured(product.productId)
                          }
                          className={`${
                            product.isFeatured
                              ? "text-yellow-500"
                              : "text-gray-400"
                          } hover:text-yellow-600`}
                          title={
                            product.isFeatured
                              ? "Quitar destacado"
                              : "Marcar como destacado"
                          }
                        >
                          ⭐
                        </button>
                        <button
                          onClick={() => handleDelete(product.productId)}
                          disabled={deleting === product.productId}
                          className="text-red-600 hover:text-red-900"
                          title="Eliminar producto"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {products.length > 0 && (
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.pages}
            totalItems={pagination.total}
            showingFrom={showingFrom}
            showingTo={showingTo}
            onPageChange={(page) => loadProducts(page)}
          />
        )}
      </div>

      {/* Modales */}
      <ProductDetailsModal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        productId={selectedProductId}
      />

      <EditProductModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        productId={selectedProductId}
        onSuccess={handleEditSuccess}
      />
    </div>
  );
}
