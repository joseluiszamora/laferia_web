import { useState, useEffect } from "react";
import { X, FolderTree, Save, Loader2 } from "lucide-react";
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
    name: category?.name || "",
    slug: category?.slug || "",
    description: category?.description || "",
    icon: category?.icon || "",
    color: category?.color || "",
    imageUrl: category?.imageUrl || "",
    parentCategoryId: category?.parentCategoryId || "",
  });
  const [loading, setLoading] = useState(false);
  const [availableCategories, setAvailableCategories] = useState<
    CategoryWithSubcategories[]
  >([]);
  const [loadingCategories, setLoadingCategories] = useState(false);

  // Cargar categorías para el selector de padre
  const loadCategories = async () => {
    setLoadingCategories(true);
    const result = await getCategories();
    if (result.success) {
      // Filtrar la categoría actual y sus descendientes para evitar ciclos
      const filtered = (result.data || []).filter(
        (cat) =>
          cat.categoryId !== category?.categoryId &&
          cat.parentCategoryId !== category?.categoryId
      );
      setAvailableCategories(filtered);
    }
    setLoadingCategories(false);
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
        parentCategoryId: category.parentCategoryId || "",
      });
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!category) return;

    setLoading(true);
    const result = await updateCategory(category.categoryId, formData);

    if (result.success) {
      onCategoryUpdated();
      onClose();
    } else {
      alert(result.error || "Error al actualizar la categoría");
    }
    setLoading(false);
  };

  if (!category || !isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black bg-opacity-25 transition-opacity"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="relative w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left shadow-xl transition-all">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900 flex items-center">
              <FolderTree className="h-5 w-5 mr-2 text-green-600" />
              Editar Categoría
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              disabled={loading}
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nombre y Slug */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Nombre *
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                  disabled={loading}
                />
              </div>
              <div>
                <label
                  htmlFor="slug"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Slug *
                </label>
                <input
                  type="text"
                  id="slug"
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, slug: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* Descripción */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Descripción
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={loading}
              />
            </div>

            {/* Categoría Padre */}
            <div>
              <label
                htmlFor="parentCategory"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Categoría Padre
              </label>
              <select
                id="parentCategory"
                value={formData.parentCategoryId}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    parentCategoryId: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={loading || loadingCategories}
              >
                <option value="">Sin categoría padre (Raíz)</option>
                {availableCategories.map((cat) => (
                  <option key={cat.categoryId} value={cat.categoryId}>
                    {cat.parentCategory ? `${cat.parentCategory.name} → ` : ""}
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Icono y Color */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="icon"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Icono (Emoji)
                </label>
                <input
                  type="text"
                  id="icon"
                  value={formData.icon}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, icon: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="📱"
                  disabled={loading}
                />
              </div>
              <div>
                <label
                  htmlFor="color"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Color
                </label>
                <div className="flex space-x-2">
                  <input
                    type="color"
                    id="color"
                    value={formData.color}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        color: e.target.value,
                      }))
                    }
                    className="w-12 h-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={loading}
                  />
                  <input
                    type="text"
                    value={formData.color}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        color: e.target.value,
                      }))
                    }
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="#000000"
                    disabled={loading}
                  />
                </div>
              </div>
            </div>

            {/* URL de Imagen */}
            <div>
              <label
                htmlFor="imageUrl"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                URL de Imagen
              </label>
              <input
                type="url"
                id="imageUrl"
                value={formData.imageUrl}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, imageUrl: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://ejemplo.com/imagen.jpg"
                disabled={loading}
              />
            </div>

            {/* Botones */}
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Actualizando...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
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
