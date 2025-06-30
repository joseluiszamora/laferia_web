import { Marca, Producto } from "@prisma/client";

export type MarcaWithProducts = Marca & {
  productos: Producto[];
  _count?: {
    productos: number;
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
  sortBy?: "name" | "createdAt" | "productos";
  sortOrder?: "asc" | "desc";
};

export type { Marca };
