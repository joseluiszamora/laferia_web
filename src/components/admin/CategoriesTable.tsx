"use client";

import { useState, useEffect } from "react";
import { Edit, Trash2, Package, FolderTree, Eye } from "lucide-react";
import { getCategories, deleteCategory } from "@/actions/categories";
import { CategoryWithSubcategories } from "@/types/category";

export function CategoriesTable() {
  const [categories, setCategories] = useState<CategoryWithSubcategories[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setLoading(true);
    const result = await getCategories();
    if (result.success) {
      setCategories(result.data || []);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string, name: string) => {
    if (
      !confirm(`¿Estás seguro de que quieres eliminar la categoría "${name}"?`)
    ) {
      return;
    }

    setDeleting(id);
    const result = await deleteCategory(id);

    if (result.success) {
      await loadCategories();
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

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
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
                    {category._count?.productos || 0} productos
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {category._count?.subcategories || 0} subcategorías
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatDate(category.createdAt)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button
                      className="text-blue-600 hover:text-blue-900"
                      title="Ver detalles"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      className="text-green-600 hover:text-green-900"
                      title="Editar"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      className="text-red-600 hover:text-red-900"
                      title="Eliminar"
                      disabled={deleting === category.categoryId}
                      onClick={() =>
                        handleDelete(category.categoryId, category.name)
                      }
                    >
                      <Trash2
                        className={`h-4 w-4 ${
                          deleting === category.categoryId ? "animate-spin" : ""
                        }`}
                      />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {categories.length === 0 && (
          <div className="text-center py-12">
            <FolderTree className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No hay categorías
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Comienza creando tu primera categoría.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
