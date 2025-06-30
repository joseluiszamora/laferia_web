import {
  X,
  FolderTree,
  Package,
  Calendar,
  Palette,
  Hash,
  Link,
  FileText,
  Eye,
  EyeOff,
} from "lucide-react";
import Image from "next/image";
import { CategoryWithSubcategories } from "@/types/category";

interface CategoryDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: CategoryWithSubcategories | null;
}

export function CategoryDetailsModal({
  isOpen,
  onClose,
  category,
}: CategoryDetailsModalProps) {
  if (!category || !isOpen) return null;

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  };

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
              <FolderTree className="h-5 w-5 mr-2 text-blue-600" />
              Detalles de Categoría
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Información básica */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center mb-4">
                {category.color && (
                  <div
                    className="w-6 h-6 rounded-full mr-3 border border-gray-300"
                    style={{ backgroundColor: category.color }}
                  />
                )}
                {category.icon && (
                  <span className="mr-3 text-2xl">{category.icon}</span>
                )}
                <div>
                  <h4 className="text-xl font-semibold text-gray-900">
                    {category.name}
                  </h4>
                  <p className="text-sm text-gray-500">/{category.slug}</p>
                </div>
              </div>

              {category.description && (
                <div className="flex items-start space-x-3">
                  <FileText className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-700">
                    {category.description}
                  </p>
                </div>
              )}
            </div>

            {/* Estado y jerarquía */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  {category.isActive ? (
                    <Eye className="h-4 w-4 text-green-600" />
                  ) : (
                    <EyeOff className="h-4 w-4 text-red-600" />
                  )}
                  <span className="text-sm font-medium text-gray-700">
                    Estado
                  </span>
                </div>
                <span
                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    category.isActive
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {category.isActive ? "Activa" : "Inactiva"}
                </span>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <FolderTree className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-gray-700">
                    Jerarquía
                  </span>
                </div>
                {category.parentCategory ? (
                  <span className="text-sm text-blue-600">
                    {category.parentCategory.name} → {category.name}
                  </span>
                ) : (
                  <span className="text-sm text-green-600 font-medium">
                    Categoría Raíz
                  </span>
                )}
              </div>
            </div>

            {/* Estadísticas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                <Package className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                <div className="text-2xl font-bold text-gray-900">
                  {category._count?.productos || 0}
                </div>
                <div className="text-sm text-gray-500">Productos</div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                <FolderTree className="h-8 w-8 mx-auto mb-2 text-green-600" />
                <div className="text-2xl font-bold text-gray-900">
                  {category._count?.subcategories || 0}
                </div>
                <div className="text-sm text-gray-500">Subcategorías</div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                <Hash className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                <div className="text-2xl font-bold text-gray-900">
                  {category.sortOrder}
                </div>
                <div className="text-sm text-gray-500">Orden</div>
              </div>
            </div>

            {/* Detalles técnicos */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h5 className="text-sm font-medium text-gray-900 mb-3">
                Información Técnica
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Hash className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">ID:</span>
                  <span className="text-gray-900 font-mono text-xs break-all">
                    {category.categoryId}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <Link className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">Slug:</span>
                  <span className="text-gray-900">/{category.slug}</span>
                </div>

                {category.color && (
                  <div className="flex items-center space-x-2">
                    <Palette className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">Color:</span>
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-4 h-4 rounded border border-gray-300"
                        style={{ backgroundColor: category.color }}
                      />
                      <span className="text-gray-900 font-mono text-xs">
                        {category.color}
                      </span>
                    </div>
                  </div>
                )}

                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">Creada:</span>
                  <span className="text-gray-900 text-xs">
                    {formatDate(category.createdAt)}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">Actualizada:</span>
                  <span className="text-gray-900 text-xs">
                    {formatDate(category.updatedAt)}
                  </span>
                </div>
              </div>
            </div>

            {/* Imagen si existe */}
            {category.imageUrl && (
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h5 className="text-sm font-medium text-gray-900 mb-3">
                  Imagen de Categoría
                </h5>
                <Image
                  src={category.imageUrl}
                  alt={category.name}
                  width={500}
                  height={200}
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>
            )}
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="button"
              className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              onClick={onClose}
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
