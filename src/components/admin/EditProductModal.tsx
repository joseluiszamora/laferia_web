"use client";

import { useState, useEffect, useCallback } from "react";
import { X, Package, Save } from "lucide-react";
import { getProductById, updateProduct } from "@/actions/products";
import { getCategoriesForSelect } from "@/actions/categories";
import { getAllMarcasActive } from "@/actions/marcas";
import { ProductFormData } from "@/types/product";
import { CategoryForSelect } from "@/types/category";
import { ProductStatus } from "@prisma/client";

interface EditProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: number;
  onSuccess: () => void;
}

interface MarcaOption {
  brandId: number;
  name: string;
  slug: string;
}

export function EditProductModal({
  isOpen,
  onClose,
  productId,
  onSuccess,
}: EditProductModalProps) {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<CategoryForSelect[]>([]);
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

    if (categoriesResult.success) {
      setCategories(categoriesResult.data || []);
    }

    if (marcasResult.success) {
      setMarcas(marcasResult.data || []);
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
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in-0 duration-300">
      <div className="bg-background border border-border rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-lg animate-in slide-in-from-bottom-4 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground flex items-center">
            <Package className="mr-2 text-primary" size={24} />
            Editar Producto
          </h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-md hover:bg-accent"
            aria-label="Cerrar modal"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Información básica */}
              <div className="bg-accent/50 rounded-lg p-6 border border-border">
                <h3 className="text-lg font-medium text-foreground mb-4">
                  Información Básica
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">
                      Nombre *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => handleNameChange(e.target.value)}
                      className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">
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
                      className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-muted-foreground mb-1">
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
                      className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-muted-foreground mb-1">
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
                      className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring"
                    />
                  </div>
                </div>
              </div>

              {/* Códigos y SKU */}
              <div className="bg-primary/5 rounded-lg p-6 border border-border">
                <h3 className="text-lg font-medium text-foreground mb-4">
                  Códigos e Identificación
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">
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
                      className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">
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
                      className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring"
                    />
                  </div>
                </div>
              </div>

              {/* Precios e inventario */}
              <div className="bg-emerald-50 dark:bg-emerald-950/20 rounded-lg p-6 border border-border">
                <h3 className="text-lg font-medium text-foreground mb-4">
                  Precios e Inventario
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">
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
                      className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">
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
                      className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">
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
                      className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">
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
                      className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">
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
                      className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring"
                    />
                  </div>
                </div>
              </div>

              {/* Categorización */}
              <div className="bg-amber-50 dark:bg-amber-950/20 rounded-lg p-6 border border-border">
                <h3 className="text-lg font-medium text-foreground mb-4">
                  Categorización
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">
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
                      className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring"
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
                    <label className="block text-sm font-medium text-muted-foreground mb-1">
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
                      className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring"
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
              <div className="bg-violet-50 dark:bg-violet-950/20 rounded-lg p-6 border border-border">
                <h3 className="text-lg font-medium text-foreground mb-4">
                  Estado y Configuración
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">
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
                      className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring"
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
                        className="h-4 w-4 text-primary focus:ring-ring border-input rounded"
                      />
                      <label
                        htmlFor="isAvailable"
                        className="ml-2 text-sm text-foreground"
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
                        className="h-4 w-4 text-primary focus:ring-ring border-input rounded"
                      />
                      <label
                        htmlFor="isFeatured"
                        className="ml-2 text-sm text-foreground"
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
                        className="h-4 w-4 text-primary focus:ring-ring border-input rounded"
                      />
                      <label
                        htmlFor="acceptOffers"
                        className="ml-2 text-sm text-foreground"
                      >
                        Acepta ofertas
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dimensiones y peso */}
              <div className="bg-indigo-50 dark:bg-indigo-950/20 rounded-lg p-6 border border-border">
                <h3 className="text-lg font-medium text-foreground mb-4">
                  Dimensiones y Peso
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">
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
                      className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">
                      Ancho (cm)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.dimensions?.width || 0}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          dimensions: {
                            width: Number(e.target.value),
                            height: prev.dimensions?.height || 0,
                            depth: prev.dimensions?.depth || 0,
                          },
                        }))
                      }
                      className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">
                      Alto (cm)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.dimensions?.height || 0}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          dimensions: {
                            width: prev.dimensions?.width || 0,
                            height: Number(e.target.value),
                            depth: prev.dimensions?.depth || 0,
                          },
                        }))
                      }
                      className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">
                      Profundidad (cm)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.dimensions?.depth || 0}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          dimensions: {
                            width: prev.dimensions?.width || 0,
                            height: prev.dimensions?.height || 0,
                            depth: Number(e.target.value),
                          },
                        }))
                      }
                      className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring"
                    />
                  </div>
                </div>
              </div>

              {/* SEO */}
              <div className="bg-accent/30 rounded-lg p-6 border border-border">
                <h3 className="text-lg font-medium text-foreground mb-4">
                  SEO (Opcional)
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">
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
                      className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">
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
                      className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring"
                    />
                  </div>
                </div>
              </div>

              {/* Botones */}
              <div className="flex justify-end space-x-3 pt-6 border-t border-border">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-muted-foreground bg-background border border-input rounded-md hover:bg-accent hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 text-sm font-medium text-primary-foreground bg-primary border border-transparent rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {saving ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                      Guardando...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Save className="h-4 w-4 mr-2" />
                      Guardar Cambios
                    </div>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
