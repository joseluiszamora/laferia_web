"use client";

import { useState, useEffect } from "react";
import { Plus, X, Package, Save } from "lucide-react";
import { createProduct } from "@/actions/products";
import { getCategories } from "@/actions/categories";
import { getAllMarcasForSelect } from "@/actions/marcas";
import { ProductFormData } from "@/types/product";
import { CategoryWithSubcategories } from "@/types/category";
import { ProductStatus } from "@prisma/client";

interface MarcaOption {
  marcaId: string;
  name: string;
  slug: string;
}

export function AddProductButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<CategoryWithSubcategories[]>([]);
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
    categoriaId: "",
    marcaId: undefined,
    tiendaId: undefined,
    status: "BORRADOR",
    isAvailable: true,
    isFeatured: false,
    metaTitle: "",
    metaDescription: "",
    tags: [],
  });

  useEffect(() => {
    if (isOpen) {
      loadInitialData();
    }
  }, [isOpen]);

  const loadInitialData = async () => {
    setLoading(true);

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

    setLoading(false);
  };

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

  const resetForm = () => {
    setFormData({
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
      categoriaId: "",
      marcaId: undefined,
      tiendaId: undefined,
      status: "BORRADOR",
      isAvailable: true,
      isFeatured: false,
      metaTitle: "",
      metaDescription: "",
      tags: [],
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const result = await createProduct(formData);

    if (result.success) {
      resetForm();
      setIsOpen(false);
      // Recargar la página para mostrar el nuevo producto
      window.location.reload();
    } else {
      alert(result.error || "Error al crear el producto");
    }

    setSaving(false);
  };

  const handleClose = () => {
    setIsOpen(false);
    resetForm();
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
      >
        <Plus className="h-4 w-4" />
        <span>Agregar Producto</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[95vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <Package className="h-5 w-5 mr-2 text-blue-500" />
                Agregar Nuevo Producto
              </h2>
              <button
                onClick={handleClose}
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
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Información básica */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Información Básica
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nombre *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => handleNameChange(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
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
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
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
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
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
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Códigos y SKU */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Códigos e Identificación
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
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
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
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
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Precios e inventario */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Precios e Inventario
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
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
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
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
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
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
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
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
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
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
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Categorización */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Categorización
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Categoría *
                        </label>
                        <select
                          required
                          value={formData.categoriaId}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              categoriaId: e.target.value,
                            }))
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Marca
                        </label>
                        <select
                          value={formData.marcaId || ""}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              marcaId: e.target.value || undefined,
                            }))
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Sin marca</option>
                          {marcas.map((marca) => (
                            <option key={marca.marcaId} value={marca.marcaId}>
                              {marca.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Estado y configuración */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Estado y Configuración
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
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
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="BORRADOR">Borrador</option>
                          <option value="PUBLICADO">Publicado</option>
                          <option value="ARCHIVADO">Archivado</option>
                          <option value="AGOTADO">Agotado</option>
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
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label
                            htmlFor="isAvailable"
                            className="ml-2 text-sm text-gray-700"
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
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label
                            htmlFor="isFeatured"
                            className="ml-2 text-sm text-gray-700"
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
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label
                            htmlFor="acceptOffers"
                            className="ml-2 text-sm text-gray-700"
                          >
                            Acepta ofertas
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Botones */}
                  <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={handleClose}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={saving}
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                      {saving ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Creando...
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <Save className="h-4 w-4 mr-2" />
                          Crear Producto
                        </div>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
