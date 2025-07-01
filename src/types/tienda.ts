import { Store, StoreStatus, Category } from "@prisma/client";

export type TiendaWithDetails = Store & {
  category: Category;
  _count?: {
    products: number;
    comments: number;
  };
};

export type TiendaFormData = {
  name: string;
  slug: string;
  ownerName: string;
  email?: string;
  phone?: string;
  whatsapp?: string;
  latitude: number;
  longitude: number;
  categoryId: number;
  contact?: Record<string, unknown>;
  address?: string;
  daysAttention: string[];
  openingHours?: string;
  status: StoreStatus;
  logoUrl?: string;
  bannerUrl?: string;
  description?: string;
};

export type TiendasTableParams = {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: number;
  status?: StoreStatus;
  sortBy?: "name" | "averageRating" | "totalComments" | "createdAt";
  sortOrder?: "asc" | "desc";
};

export type TiendaPaginationInfo = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
};

export type TiendasResponse = {
  success: boolean;
  data?: TiendaWithDetails[];
  pagination?: TiendaPaginationInfo;
  error?: string;
};

export type TiendasStats = {
  total: number;
  active: number;
  pending: number;
  inactive: number;
  suspend: number;
};

export { StoreStatus };
export type { Store };
