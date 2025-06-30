"use client";

import { useState, useEffect, useCallback } from "react";
import { X, Package, Star, Eye, ShoppingCart, Tag, Truck } from "lucide-react";
import { getProductById } from "@/actions/products";
import { ProductWithDetails } from "@/types/product";

interface ProductDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string;
}

export function ProductDetailsModal({
  isOpen,
  onClose,
  productId,
}: ProductDetailsModalProps) {
  const [product, setProduct] = useState<ProductWithDetails | null>(null);
  const [loading, setLoading] = useState(false);

  const loadProductDetails = useCallback(async () => {
    if (!productId) return;

    setLoading(true);
    const result = await getProductById(productId);

    if (result.success && result.data) {
      setProduct(result.data);
    } else {
      console.error("Error loading product:", result.error);
    }
    setLoading(false);
  }, [productId]);

  useEffect(() => {
    if (isOpen && productId) {
      loadProductDetails();
    }
  }, [isOpen, productId, loadProductDetails]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PUBLICADO":
        return "bg-green-100 text-green-800";
      case "BORRADOR":
        return "bg-gray-100 text-gray-800";
      case "ARCHIVADO":
        return "bg-purple-100 text-purple-800";
      case "AGOTADO":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CR", {
      style: "currency",
      currency: "CRC",
    }).format(price);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <Package className="h-5 w-5 mr-2 text-blue-500" />
            Detalles del Producto
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : product ? (
            <div className="space-y-6">
              {/* Información básica */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      Información General
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-500">
                          Nombre
                        </label>
                        <p className="text-gray-900 font-medium">
                          {product.name}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">
                          Slug
                        </label>
                        <p className="text-gray-700 font-mono text-sm">
                          {product.slug}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">
                          Descripción corta
                        </label>
                        <p className="text-gray-700">
                          {product.shortDescription || "Sin descripción corta"}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">
                          Estado
                        </label>
                        <div className="mt-1">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                              product.status
                            )}`}
                          >
                            {product.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      Códigos y SKU
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-500">
                          SKU
                        </label>
                        <p className="text-gray-700 font-mono">
                          {product.sku || "Sin SKU"}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">
                          Código de barras
                        </label>
                        <p className="text-gray-700 font-mono">
                          {product.barcode || "Sin código de barras"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      Precios e Inventario
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-500">
                          Precio
                        </label>
                        <p className="text-lg font-bold text-gray-900">
                          {formatPrice(Number(product.price))}
                        </p>
                      </div>
                      {product.discountedPrice && (
                        <div>
                          <label className="text-sm font-medium text-gray-500">
                            Precio con descuento
                          </label>
                          <p className="text-lg font-bold text-green-600">
                            {formatPrice(Number(product.discountedPrice))}
                          </p>
                        </div>
                      )}
                      {product.costPrice && (
                        <div>
                          <label className="text-sm font-medium text-gray-500">
                            Precio de costo
                          </label>
                          <p className="text-gray-700">
                            {formatPrice(Number(product.costPrice))}
                          </p>
                        </div>
                      )}
                      <div>
                        <label className="text-sm font-medium text-gray-500">
                          Stock
                        </label>
                        <div className="flex items-center space-x-2">
                          <p className="text-gray-900 font-medium">
                            {product.stock} unidades
                          </p>
                          {product.stock <= product.lowStockAlert && (
                            <span className="text-orange-500 text-sm">
                              ⚠️ Stock bajo
                            </span>
                          )}
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">
                          Alerta de stock bajo
                        </label>
                        <p className="text-gray-700">
                          {product.lowStockAlert} unidades
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      Configuración
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-gray-500">
                          Disponible
                        </label>
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            product.isAvailable
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {product.isAvailable ? "Sí" : "No"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-gray-500">
                          Destacado
                        </label>
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            product.isFeatured
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {product.isFeatured ? "Sí" : "No"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-gray-500">
                          Acepta ofertas
                        </label>
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            product.acceptOffers
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {product.acceptOffers ? "Sí" : "No"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Categorización */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Categorización
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Categoría
                      </label>
                      <p className="text-gray-900">{product.categoria.name}</p>
                    </div>
                    {product.marca && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">
                          Marca
                        </label>
                        <p className="text-gray-900">{product.marca.name}</p>
                      </div>
                    )}
                    {product.tags.length > 0 && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">
                          Etiquetas
                        </label>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {product.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800"
                            >
                              <Tag className="h-3 w-3 mr-1" />
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Estadísticas
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Eye className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-500">Vistas:</span>
                      <span className="font-medium">{product.viewCount}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <ShoppingCart className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-500">Ventas:</span>
                      <span className="font-medium">{product.saleCount}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Package className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-500">Atributos:</span>
                      <span className="font-medium">
                        {product._count?.atributos || 0}
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Star className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-500">Medias:</span>
                      <span className="font-medium">
                        {product._count?.medias || 0}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dimensiones y peso */}
              {(product.weight || product.dimensions) && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Dimensiones y Peso
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {product.weight && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">
                          Peso
                        </label>
                        <div className="flex items-center space-x-2">
                          <Truck className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-700">
                            {Number(product.weight)} kg
                          </span>
                        </div>
                      </div>
                    )}
                    {product.dimensions && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">
                          Dimensiones
                        </label>
                        <p className="text-gray-700">
                          {(
                            product.dimensions as {
                              width?: number;
                              height?: number;
                              depth?: number;
                            }
                          )?.width || 0}{" "}
                          x{" "}
                          {(
                            product.dimensions as {
                              width?: number;
                              height?: number;
                              depth?: number;
                            }
                          )?.height || 0}{" "}
                          x{" "}
                          {(
                            product.dimensions as {
                              width?: number;
                              height?: number;
                              depth?: number;
                            }
                          )?.depth || 0}{" "}
                          cm
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Descripción completa */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Descripción
                </h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {product.description}
                  </p>
                </div>
              </div>

              {/* SEO */}
              {(product.metaTitle || product.metaDescription) && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    SEO
                  </h3>
                  <div className="space-y-3">
                    {product.metaTitle && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">
                          Meta título
                        </label>
                        <p className="text-gray-700">{product.metaTitle}</p>
                      </div>
                    )}
                    {product.metaDescription && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">
                          Meta descripción
                        </label>
                        <p className="text-gray-700">
                          {product.metaDescription}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Información técnica */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Información Técnica
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-500">ID:</span>
                    <span className="ml-2 font-mono text-gray-700">
                      {product.id}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-500">Creado:</span>
                    <span className="ml-2 text-gray-700">
                      {formatDate(product.createdAt)}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-500">
                      Actualizado:
                    </span>
                    <span className="ml-2 text-gray-700">
                      {formatDate(product.updatedAt)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">
                No se pudo cargar la información del producto
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
