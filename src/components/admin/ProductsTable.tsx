"use client";

import { useState, useEffect, useCallback } from "react";
import { Edit, Trash2, Eye } from "lucide-react";
import {
  getProducts,
  deleteProduct,
  toggleProductAvailability,
  toggleProductFeatured,
} from "@/actions/products";
import { ProductsTableParams } from "@/types/product";
import { ProductStatus } from "@prisma/client";

interface ProductsTableProps {
  searchQuery?: string;
  categoryFilter?: string;
  statusFilter?: string;
}

interface Product {
  id: string;
  name: string;
  sku?: string | null;
  price: number;
  discountedPrice?: number | null;
  stock: number;
  lowStockAlert: number;
  isAvailable: boolean;
  isFeatured: boolean;
  status: ProductStatus;
  categoria?: { name: string } | null;
  marca?: { name: string } | null;
}

export function ProductsTable({
  searchQuery = "",
  categoryFilter = "",
  statusFilter = "",
}: ProductsTableProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });

  const loadProducts = useCallback(
    async (params: ProductsTableParams = {}) => {
      setLoading(true);
      try {
        const result = await getProducts({
          ...params,
          search: searchQuery || undefined,
          categoriaId: categoryFilter || undefined,
          status: (statusFilter as ProductStatus) || undefined,
        });

        if (result.success && result.data) {
          // Convertir Decimal a number para compatibilidad
          const convertedProducts = result.data.products.map(
            (product: Record<string, unknown>) => ({
              ...product,
              price: Number(product.price),
              discountedPrice: product.discountedPrice
                ? Number(product.discountedPrice)
                : null,
            })
          );
          setProducts(convertedProducts as Product[]);
          setPagination(result.data.pagination);
        }
      } catch (error) {
        console.error("Error loading products:", error);
      } finally {
        setLoading(false);
      }
    },
    [searchQuery, categoryFilter, statusFilter]
  );

  useEffect(() => {
    loadProducts({ page: 1 });
  }, [loadProducts]);

  const handleDelete = async (id: string) => {
    if (confirm("¿Estás seguro de que deseas eliminar este producto?")) {
      const result = await deleteProduct(id);
      if (result.success) {
        loadProducts({ page: pagination.page });
      } else {
        alert(result.error || "Error al eliminar el producto");
      }
    }
  };

  const handleToggleAvailability = async (id: string) => {
    const result = await toggleProductAvailability(id);
    if (result.success) {
      loadProducts({ page: pagination.page });
    }
  };

  const handleToggleFeatured = async (id: string) => {
    const result = await toggleProductFeatured(id);
    if (result.success) {
      loadProducts({ page: pagination.page });
    }
  };

  const getStatusBadge = (product: Product) => {
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
    switch (product.status) {
      case "PUBLICADO":
        return (
          <span className="px-2 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded-full">
            Publicado
          </span>
        );
      case "BORRADOR":
        return (
          <span className="px-2 py-1 text-xs font-semibold bg-gray-100 text-gray-800 rounded-full">
            Borrador
          </span>
        );
      case "ARCHIVADO":
        return (
          <span className="px-2 py-1 text-xs font-semibold bg-purple-100 text-purple-800 rounded-full">
            Archivado
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-800 rounded-full">
            {product.status}
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }
  return (
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
                <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                  No se encontraron productos
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
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
                        <div className="text-sm text-gray-500">
                          SKU: {product.sku || "N/A"}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {product.categoria?.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {product.marca?.name || "Sin marca"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      ${product.price.toFixed(2)}
                      {product.discountedPrice && (
                        <div className="text-xs text-green-600">
                          Oferta: ${product.discountedPrice.toFixed(2)}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {product.stock}
                      {product.stock <= product.lowStockAlert && (
                        <span className="ml-1 text-orange-500 text-xs">⚠️</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(product)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        className="text-indigo-600 hover:text-indigo-900"
                        title="Ver producto"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        className="text-green-600 hover:text-green-900"
                        title="Editar producto"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleToggleAvailability(product.id)}
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
                        onClick={() => handleToggleFeatured(product.id)}
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
                        onClick={() => handleDelete(product.id)}
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

      {/* Paginación */}
      {pagination.pages > 1 && (
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => loadProducts({ page: pagination.page - 1 })}
              disabled={pagination.page === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Anterior
            </button>
            <button
              onClick={() => loadProducts({ page: pagination.page + 1 })}
              disabled={pagination.page === pagination.pages}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Siguiente
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Mostrando{" "}
                <span className="font-medium">
                  {(pagination.page - 1) * pagination.limit + 1}
                </span>{" "}
                a{" "}
                <span className="font-medium">
                  {Math.min(
                    pagination.page * pagination.limit,
                    pagination.total
                  )}
                </span>{" "}
                de <span className="font-medium">{pagination.total}</span>{" "}
                resultados
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                {[...Array(pagination.pages)].map((_, i) => {
                  const page = i + 1;
                  return (
                    <button
                      key={page}
                      onClick={() => loadProducts({ page })}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        page === pagination.page
                          ? "z-10 bg-indigo-50 border-indigo-500 text-indigo-600"
                          : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                      } ${page === 1 ? "rounded-l-md" : ""} ${
                        page === pagination.pages ? "rounded-r-md" : ""
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
