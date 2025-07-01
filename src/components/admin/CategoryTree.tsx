"use client";

import { useState, useEffect } from "react";
import { FolderTree, Package, ChevronRight, ChevronDown } from "lucide-react";
import { getCategoryTree } from "@/actions/categories";

interface CategoryNode {
  categoryId: string;
  name: string;
  slug: string;
  description?: string | null;
  icon?: string | null;
  color?: string | null;
  imageUrl?: string | null;
  parentCategoryId?: string | null;
  createdAt?: Date;
  _count?: {
    productos: number;
  };
  subcategories?: CategoryNode[];
}

export function CategoryTree() {
  const [categories, setCategories] = useState<CategoryNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadCategoryTree();
  }, []);

  const loadCategoryTree = async () => {
    setLoading(true);
    const result = await getCategoryTree();
    if (result.success) {
      setCategories((result.data as unknown as CategoryNode[]) || []);
    }
    setLoading(false);
  };

  const toggleNode = (categoryId: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedNodes(newExpanded);
  };

  const renderCategory = (category: CategoryNode, level = 0) => {
    const isExpanded = expandedNodes.has(category.categoryId);
    const hasChildren =
      category.subcategories && category.subcategories.length > 0;

    return (
      <div key={category.categoryId}>
        <div
          className={`flex items-center py-2 px-4 hover:bg-gray-50 cursor-pointer ${
            level > 0 ? "ml-6 border-l border-gray-200" : ""
          }`}
          onClick={() => hasChildren && toggleNode(category.categoryId)}
        >
          <div className="flex items-center flex-1">
            {hasChildren ? (
              isExpanded ? (
                <ChevronDown className="h-4 w-4 text-gray-400 mr-2" />
              ) : (
                <ChevronRight className="h-4 w-4 text-gray-400 mr-2" />
              )
            ) : (
              <div className="w-6 h-4 mr-2" />
            )}

            {category.color && (
              <div
                className="w-3 h-3 rounded-full mr-3 border border-gray-300 dark:border-gray-600"
                style={{ backgroundColor: category.color }}
              />
            )}

            {category.icon && (
              <span className="mr-2 text-sm">{category.icon}</span>
            )}

            <span className="font-medium text-gray-900 dark:text-gray-100">
              {category.name}
            </span>

            <div className="flex items-center ml-auto space-x-4">
              <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                <Package className="h-3 w-3 mr-1" />
                {category._count?.productos || 0}
              </div>

              {hasChildren && (
                <div className="text-xs text-blue-600">
                  {category.subcategories?.length || 0} sub.
                </div>
              )}
            </div>
          </div>
        </div>

        {isExpanded && hasChildren && (
          <div className="ml-4">
            {category.subcategories?.map((subcategory) =>
              renderCategory(subcategory, level + 1)
            )}
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-8 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <FolderTree className="h-5 w-5 mr-2" />
          Árbol de Categorías
        </h3>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {categories.length > 0 ? (
          categories.map((category) => renderCategory(category))
        ) : (
          <div className="text-center py-8">
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
