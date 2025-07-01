import { Brand, Product } from "@prisma/client";

export type MarcaWithProducts = Brand & {
  products: Product[];
  _count?: {
    products: number;
  };
};

export type MarcaFormData = {
  name: string;
  slug: string;
  description?: string;
  logoUrl?: string;
  websiteUrl?: string;
  isActive: boolean;
};

export type MarcasTableParams = {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
  sortBy?: "name" | "createdAt" | "products";
  sortOrder?: "asc" | "desc";
};

export type { Brand };
