import { Category } from "@prisma/client";

export type CategoryWithSubcategories = Category & {
  subcategories: Category[];
  parentCategory: Category | null;
  _count?: {
    productos: number;
    subcategories: number;
  };
};

export type CategoryFormData = {
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  color?: string;
  imageUrl?: string;
  parentCategoryId?: string;
};

export type CategoryTreeNode = Category & {
  children: CategoryTreeNode[];
  level: number;
};
export type { Category };
