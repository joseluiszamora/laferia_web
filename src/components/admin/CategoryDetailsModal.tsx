"use client";

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
          className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity animate-in fade-in-0 duration-300"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="relative w-full max-w-2xl transform overflow-hidden rounded-2xl bg-background border border-border p-6 text-left shadow-xl transition-all animate-in slide-in-from-bottom-4 duration-300">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium leading-6 text-foreground flex items-center">
              <FolderTree className="h-5 w-5 mr-2 text-primary" />
              Detalles de Categoría
            </h3>
            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-md hover:bg-accent"
              aria-label="Cerrar modal"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Información básica */}
            <div className="bg-accent/50 rounded-lg p-4 border border-border">
              <div className="flex items-center mb-4">
                {category.color && (
                  <div
                    className="w-6 h-6 rounded-full mr-3 border border-border"
                    style={{ backgroundColor: category.color }}
                  />
                )}
                {category.icon && (
                  <span className="mr-3 text-2xl">{category.icon}</span>
                )}
                <div>
                  <h4 className="text-xl font-semibold text-foreground">
                    {category.name}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    /{category.slug}
                  </p>
                </div>
              </div>

              {category.description && (
                <div className="flex items-start space-x-3">
                  <FileText className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-foreground">
                    {category.description}
                  </p>
                </div>
              )}
            </div>

            {/* Estado y jerarquía */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-background border border-border rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  {category.isActive ? (
                    <Eye className="h-4 w-4 text-success" />
                  ) : (
                    <EyeOff className="h-4 w-4 text-destructive" />
                  )}
                  <span className="text-sm font-medium text-foreground">
                    Estado
                  </span>
                </div>
                <span
                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${
                    category.isActive
                      ? "bg-success/10 text-success border-success/20"
                      : "bg-destructive/10 text-destructive border-destructive/20"
                  }`}
                >
                  {category.isActive ? "Activa" : "Inactiva"}
                </span>
              </div>

              <div className="bg-background border border-border rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <FolderTree className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-foreground">
                    Jerarquía
                  </span>
                </div>
                {category.parentCategory ? (
                  <span className="text-sm text-primary">
                    {category.parentCategory.name} → {category.name}
                  </span>
                ) : (
                  <span className="text-sm text-success font-medium">
                    Categoría Raíz
                  </span>
                )}
              </div>
            </div>

            {/* Estadísticas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-primary/5 border border-border rounded-lg p-4 text-center">
                <Package className="h-8 w-8 mx-auto mb-2 text-primary" />
                <div className="text-2xl font-bold text-foreground">
                  {category._count?.products || 0}
                </div>
                <div className="text-sm text-muted-foreground">Productos</div>
              </div>

              <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-border rounded-lg p-4 text-center">
                <FolderTree className="h-8 w-8 mx-auto mb-2 text-emerald-600" />
                <div className="text-2xl font-bold text-foreground">
                  {category._count?.subcategories || 0}
                </div>
                <div className="text-sm text-muted-foreground">
                  Subcategorías
                </div>
              </div>

              <div className="bg-violet-50 dark:bg-violet-950/20 border border-border rounded-lg p-4 text-center">
                <Hash className="h-8 w-8 mx-auto mb-2 text-violet-600" />
                <div className="text-2xl font-bold text-foreground">
                  {category.sortOrder}
                </div>
                <div className="text-sm text-muted-foreground">Orden</div>
              </div>
            </div>

            {/* Detalles técnicos */}
            <div className="bg-accent/30 rounded-lg p-4 border border-border">
              <h5 className="text-sm font-medium text-foreground mb-3 flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-primary" />
                Información Técnica
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Hash className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">ID:</span>
                  <span className="text-foreground font-mono text-xs break-all">
                    {category.categoryId}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <Link className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Slug:</span>
                  <span className="text-foreground">/{category.slug}</span>
                </div>

                {category.color && (
                  <div className="flex items-center space-x-2">
                    <Palette className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Color:</span>
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-4 h-4 rounded border border-border"
                        style={{ backgroundColor: category.color }}
                      />
                      <span className="text-foreground font-mono text-xs">
                        {category.color}
                      </span>
                    </div>
                  </div>
                )}

                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Creada:</span>
                  <span className="text-foreground text-xs">
                    {formatDate(category.createdAt)}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Actualizada:</span>
                  <span className="text-foreground text-xs">
                    {formatDate(category.updatedAt)}
                  </span>
                </div>
              </div>
            </div>

            {/* Imagen si existe */}
            {category.imageUrl && (
              <div className="bg-background border border-border rounded-lg p-4">
                <h5 className="text-sm font-medium text-foreground mb-3">
                  Imagen de Categoría
                </h5>
                <Image
                  src={category.imageUrl}
                  alt={category.name}
                  width={500}
                  height={200}
                  className="w-full h-48 object-cover rounded-lg border border-border"
                />
              </div>
            )}
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="button"
              className="inline-flex justify-center rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-accent focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors"
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
