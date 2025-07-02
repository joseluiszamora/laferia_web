"use client";

import { useState, useEffect } from "react";
import {
  X,
  FolderTree,
  Save,
  Loader2,
  Palette,
  ImageIcon,
  Hash,
} from "lucide-react";
import { CategoryWithSubcategories, CategoryFormData } from "@/types/category";
import { updateCategory, getCategories } from "@/actions/categories";

interface EditCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: CategoryWithSubcategories | null;
  onCategoryUpdated: () => void;
}

export function EditCategoryModal({
  isOpen,
  onClose,
  category,
  onCategoryUpdated,
}: EditCategoryModalProps) {
  const [formData, setFormData] = useState<CategoryFormData>({
    name: "",
    slug: "",
    description: "",
    icon: "",
    color: "",
    imageUrl: "",
    parentCategoryId: undefined,
  });
  const [loading, setLoading] = useState(false);
  const [availableCategories, setAvailableCategories] = useState<
    CategoryWithSubcategories[]
  >([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar categorías para el selector de padre
  const loadCategories = async () => {
    setLoadingCategories(true);
    try {
      const result = await getCategories();
      if (result.success) {
        // Filtrar la categoría actual y sus descendientes para evitar ciclos
        const filtered = (result.data || []).filter(
          (cat) =>
            cat.categoryId !== category?.categoryId &&
            cat.parentCategoryId !== category?.categoryId
        );
        setAvailableCategories(filtered as CategoryWithSubcategories[]);
      }
    } catch (err) {
      console.error("Error loading categories:", err);
    } finally {
      setLoadingCategories(false);
    }
  };

  // Cargar categorías cuando se abre el modal
  useEffect(() => {
    if (isOpen && category) {
      setFormData({
        name: category.name,
        slug: category.slug,
        description: category.description || "",
        icon: category.icon || "",
        color: category.color || "",
        imageUrl: category.imageUrl || "",
        parentCategoryId: category.parentCategoryId || undefined,
      });
      setError(null);
      loadCategories();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, category]);

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  const handleNameChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      name: value,
      slug: generateSlug(value),
    }));
  };

  const handleInputChange = (
    field: keyof CategoryFormData,
    value: string | number | undefined
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!category) return;

    setLoading(true);
    setError(null);

    try {
      const result = await updateCategory(category.categoryId, formData);

      if (result.success) {
        onCategoryUpdated();
        onClose();
      } else {
        setError(result.error || "Error al actualizar la categoría");
      }
    } catch (err) {
      console.error("Error updating category:", err);
      setError("Error inesperado al actualizar la categoría");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in-0 duration-300">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-xl animate-in slide-in-from-bottom-4 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border bg-accent/20">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <FolderTree className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">
                Editar Categoría
              </h2>
              <p className="text-sm text-muted-foreground">
                Modifica los datos de la categoría
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-accent rounded-lg transition-colors text-muted-foreground hover:text-foreground"
            disabled={loading}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Error Message */}
            {error && (
              <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Información Básica */}
            <div className="bg-primary/5 rounded-lg p-6 border border-border">
              <h3 className="text-lg font-medium text-foreground mb-4 flex items-center">
                <Hash className="h-5 w-5 mr-2 text-primary" />
                Información Básica
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Nombre
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="Nombre de la categoría"
                    required
                    disabled={loading}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Slug
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => handleInputChange("slug", e.target.value)}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="slug-categoria"
                    required
                    disabled={loading}
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Descripción
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  rows={3}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 resize-none"
                  placeholder="Descripción de la categoría (opcional)"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Configuración Visual */}
            <div className="bg-accent/50 rounded-lg p-6 border border-border">
              <h3 className="text-lg font-medium text-foreground mb-4 flex items-center">
                <Palette className="h-5 w-5 mr-2 text-primary" />
                Configuración Visual
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Icono
                  </label>
                  <input
                    type="text"
                    value={formData.icon || ""}
                    onChange={(e) => handleInputChange("icon", e.target.value)}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="Nombre del icono (ej: ShoppingBag)"
                    disabled={loading}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Color
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="color"
                      value={formData.color || "#3B82F6"}
                      onChange={(e) =>
                        handleInputChange("color", e.target.value)
                      }
                      className="flex-5 h-10 cursor-pointer disabled:cursor-not-allowed"
                      disabled={loading}
                    />
                    <input
                      type="text"
                      value={formData.color || ""}
                      onChange={(e) =>
                        handleInputChange("color", e.target.value)
                      }
                      className="flex-1 px-3 py-2 border border-input bg-background text-foreground rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring"
                      placeholder="#3B82F6"
                      disabled={loading}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Configuración Avanzada */}
            <div className="bg-emerald-50 dark:bg-emerald-950/20 rounded-lg p-6 border border-border">
              <h3 className="text-lg font-medium text-foreground mb-4 flex items-center">
                <ImageIcon className="h-5 w-5 mr-2 text-primary" />
                Configuración Avanzada
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Categoría Padre
                  </label>
                  <select
                    value={formData.parentCategoryId || ""}
                    onChange={(e) =>
                      handleInputChange(
                        "parentCategoryId",
                        e.target.value ? parseInt(e.target.value) : undefined
                      )
                    }
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    disabled={loading || loadingCategories}
                  >
                    <option value="">Sin categoría padre</option>
                    {availableCategories.map((cat) => (
                      <option key={cat.categoryId} value={cat.categoryId}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  {loadingCategories && (
                    <p className="text-sm text-muted-foreground mt-1">
                      Cargando categorías...
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    URL de Imagen
                  </label>
                  <input
                    type="url"
                    value={formData.imageUrl || ""}
                    onChange={(e) =>
                      handleInputChange("imageUrl", e.target.value)
                    }
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="https://ejemplo.com/imagen.jpg"
                    disabled={loading}
                  />
                </div>
              </div>
            </div>

            {/* Botones */}
            <div className="flex justify-end space-x-5 pt-4 border-t border-border">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-2 py-2 bg-blue-600 text-white dark:bg-blue-500 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 disabled:opacity-50"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Actualizando...
                  </>
                ) : (
                  <>
                    {/* <Save className="h-4 w-6 mr-2" /> */}
                    Actualizar Categoría
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
