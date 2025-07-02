"use client";

import { useState, useEffect, useCallback } from "react";
import { X } from "lucide-react";
import { getProductById, updateProduct } from "@/actions/products";
import { ProductFormData } from "@/types/product";

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

    const [productResult] = await Promise.all([getProductById(productId)]);

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

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Información básica */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Nombre *
            </label>
            <input
              type="text"
              id="name"
              required
              value={formData.name}
              onChange={(e) => handleNameChange(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              placeholder="Ej: Producto"
            />
          </div>

          {/* Botones */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
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
