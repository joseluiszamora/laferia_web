import { Category } from "@prisma/client";

export type CategoryWithSubcategories = Category & {
  subcategories: Category[];
  parentCategory: Category | null;
  _count?: {
    products: number;
    subcategories: number;
  };
};

export type CategoryForSelect = Category & {
  parentCategory: {
    categoryId: number;
    name: string;
  } | null;
};

export type CategoryFormData = {
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  color?: string;
  imageUrl?: string;
  parentCategoryId?: number;
};

export type CategoryTreeNode = Category & {
  children: CategoryTreeNode[];
  level: number;
};

export type CategoryPaginationInfo = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
};

export type CategoriesResponse = {
  success: boolean;
  data?: CategoryWithSubcategories[];
  pagination?: CategoryPaginationInfo;
  error?: string;
};

export type CategoryWithDetails = {
  categoryId: number;
  name: string;
  description?: string;
  slug?: string;
  imageUrl?: string;
  // Add any other fields that your categories have
};

export type { Category };
