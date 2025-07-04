"use client";

import { useState, useEffect, useCallback } from "react";
import { X } from "lucide-react";
import { getProductById, updateProduct } from "@/actions/products";
import { getCategoriesForSelect } from "@/actions/categories";
import { getAllMarcasActive } from "@/actions/marcas";
import { ProductFormData } from "@/types/product";
import { ProductStatus } from "@prisma/client";

interface MarcaOption {
  brandId: number;
  name: string;
  slug: string;
}

interface CategoryOption {
  categoryId: number;
  name: string;
  parentCategory?: {
    categoryId: number;
    name: string;
  } | null;
}

interface EditProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: number;
  onSuccess: () => void;
}

export function EditProductModal({
  isOpen,
  onClose,
  productId,
  onSuccess,
}: EditProductModalProps) {
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [marcas, setMarcas] = useState<MarcaOption[]>([]);
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    slug: "",
    description: "",
    shortDescription: "",
    sku: "",
    barcode: "",
    price: 0,
    discountedPrice: 0,
    costPrice: 0,
    acceptOffers: false,
    stock: 0,
    lowStockAlert: 5,
    weight: 0,
    dimensions: {
      width: 0,
      height: 0,
      depth: 0,
    },
    categoryId: 0,
    brandId: undefined,
    storeId: 0,
    status: "DRAFT",
    isAvailable: true,
    isFeatured: false,
    metaTitle: "",
    metaDescription: "",
    tags: [],
  });

  const loadInitialData = useCallback(async () => {
    if (!productId) return;

    setLoading(true);

    const [productResult, categoriesResult, marcasResult] = await Promise.all([
      getProductById(productId),
      getCategoriesForSelect(),
      getAllMarcasActive(),
    ]);

    if (productResult.success && productResult.data) {
      const product = productResult.data;
      setFormData({
        name: product.name,
        slug: product.slug,
        description: product.description,
        shortDescription: product.shortDescription || "",
        sku: product.sku || "",
        barcode: product.barcode || "",
        price: Number(product.price),
        discountedPrice: Number(product.discountedPrice || 0),
        costPrice: Number(product.costPrice || 0),
        acceptOffers: product.acceptOffers,
        stock: product.stock,
        lowStockAlert: product.lowStockAlert,
        weight: Number(product.weight || 0),
        dimensions: {
          width:
            (
              product.dimensions as {
                width?: number;
                height?: number;
                depth?: number;
              }
            )?.width || 0,
          height:
            (
              product.dimensions as {
                width?: number;
                height?: number;
                depth?: number;
              }
            )?.height || 0,
          depth:
            (
              product.dimensions as {
                width?: number;
                height?: number;
                depth?: number;
              }
            )?.depth || 0,
        },
        categoryId: product.categoryId,
        brandId: product.brandId || undefined,
        storeId: product.storeId,
        status: product.status,
        isAvailable: product.isAvailable,
        isFeatured: product.isFeatured,
        metaTitle: product.metaTitle || "",
        metaDescription: product.metaDescription || "",
        tags: product.tags,
      });
    }

    if (categoriesResult.success && categoriesResult.data) {
      setCategories(categoriesResult.data as CategoryOption[]);
    }

    if (marcasResult.success && marcasResult.data) {
      setMarcas(marcasResult.data as MarcaOption[]);
    }

    setLoading(false);
  }, [productId]);

  useEffect(() => {
    if (isOpen && productId) {
      loadInitialData();
    }
  }, [isOpen, productId, loadInitialData]);

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[áàäâ]/g, "a")
      .replace(/[éèëê]/g, "e")
      .replace(/[íìïî]/g, "i")
      .replace(/[óòöô]/g, "o")
      .replace(/[úùüû]/g, "u")
      .replace(/[ñ]/g, "n")
      .replace(/[^a-z0-9]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
  };

  const handleNameChange = (name: string) => {
    setFormData((prev) => ({
      ...prev,
      name,
      slug: generateSlug(name),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const result = await updateProduct(productId, formData);

    if (result.success) {
      onSuccess();
      onClose();
    } else {
      alert(result.error || "Error al actualizar el producto");
    }

    setSaving(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Editar Producto
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-400"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <>
              {/* Información básica */}
              <div>
                <h3 className="text-lg font-semibold mb-4">
                  Información Básica
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Nombre *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => handleNameChange(e.target.value)}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Slug *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.slug}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          slug: e.target.value,
                        }))
                      }
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Descripción corta
                    </label>
                    <textarea
                      value={formData.shortDescription}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          shortDescription: e.target.value,
                        }))
                      }
                      rows={2}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Descripción *
                    </label>
                    <textarea
                      required
                      value={formData.description}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      rows={4}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                </div>
              </div>

              {/* Códigos y SKU */}
              <div>
                <h3 className="text-lg font-semibold mb-4">
                  Códigos e Identificación
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      SKU
                    </label>
                    <input
                      type="text"
                      value={formData.sku}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          sku: e.target.value,
                        }))
                      }
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Código de barras
                    </label>
                    <input
                      type="text"
                      value={formData.barcode}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          barcode: e.target.value,
                        }))
                      }
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                </div>
              </div>

              {/* Precios e inventario */}
              <div>
                <h3 className="text-lg font-semibold mb-4">
                  Precios e Inventario
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Precio *
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          price: Number(e.target.value),
                        }))
                      }
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Precio con descuento
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.discountedPrice}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          discountedPrice: Number(e.target.value),
                        }))
                      }
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Precio de costo
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.costPrice}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          costPrice: Number(e.target.value),
                        }))
                      }
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Stock *
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={formData.stock}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          stock: Number(e.target.value),
                        }))
                      }
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Alerta stock bajo
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.lowStockAlert}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          lowStockAlert: Number(e.target.value),
                        }))
                      }
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Peso (kg)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.weight}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          weight: Number(e.target.value),
                        }))
                      }
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                </div>
              </div>

              {/* Categorización */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Categorización</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Categoría *
                    </label>
                    <select
                      required
                      value={formData.categoryId}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          categoryId: Number(e.target.value),
                        }))
                      }
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    >
                      <option value="">Seleccionar categoría</option>
                      {categories.map((category) => (
                        <option
                          key={category.categoryId}
                          value={category.categoryId}
                        >
                          {category.parentCategory
                            ? `${category.parentCategory.name} → `
                            : ""}
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Marca
                    </label>
                    <select
                      value={formData.brandId || ""}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          brandId: e.target.value
                            ? Number(e.target.value)
                            : undefined,
                        }))
                      }
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    >
                      <option value="">Sin marca</option>
                      {marcas.map((marca) => (
                        <option key={marca.brandId} value={marca.brandId}>
                          {marca.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Estado y configuración */}
              <div>
                <h3 className="text-lg font-semibold mb-4">
                  Estado y Configuración
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Estado
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          status: e.target.value as ProductStatus,
                        }))
                      }
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    >
                      <option value="DRAFT">Borrador</option>
                      <option value="PUBLISHED">Publicado</option>
                      <option value="ARCHIVED">Archivado</option>
                      <option value="EXHAUSTED">Agotado</option>
                    </select>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="isAvailable"
                        checked={formData.isAvailable}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            isAvailable: e.target.checked,
                          }))
                        }
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800"
                      />
                      <label
                        htmlFor="isAvailable"
                        className="ml-2 text-sm text-gray-700 dark:text-gray-300"
                      >
                        Disponible para venta
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="isFeatured"
                        checked={formData.isFeatured}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            isFeatured: e.target.checked,
                          }))
                        }
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800"
                      />
                      <label
                        htmlFor="isFeatured"
                        className="ml-2 text-sm text-gray-700 dark:text-gray-300"
                      >
                        Producto destacado
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="acceptOffers"
                        checked={formData.acceptOffers}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            acceptOffers: e.target.checked,
                          }))
                        }
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800"
                      />
                      <label
                        htmlFor="acceptOffers"
                        className="ml-2 text-sm text-gray-700 dark:text-gray-300"
                      >
                        Acepta ofertas
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* SEO y Meta información */}
              <div>
                <h3 className="text-lg font-semibold mb-4">
                  SEO y Metainformación
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Meta título
                    </label>
                    <input
                      type="text"
                      value={formData.metaTitle}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          metaTitle: e.target.value,
                        }))
                      }
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Meta descripción
                    </label>
                    <textarea
                      value={formData.metaDescription}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          metaDescription: e.target.value,
                        }))
                      }
                      rows={3}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Botones */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving || loading}
              className="px-4 py-2 bg-blue-600 text-white dark:bg-blue-500 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 disabled:opacity-50"
            >
              {saving ? "Guardando..." : "Guardar Cambios"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
