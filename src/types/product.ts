import {
  Producto,
  ProductoAtributos,
  ProductoMedias,
  Category,
  Marca,
  ProductStatus,
  MediaType,
} from "@prisma/client";

export type ProductWithDetails = Producto & {
  categoria: Category;
  marca?: Marca | null;
  atributos: ProductoAtributos[];
  medias: ProductoMedias[];
  _count?: {
    atributos: number;
    medias: number;
  };
};

export type ProductFormData = {
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  sku?: string;
  barcode?: string;
  price: number;
  discountedPrice?: number;
  costPrice?: number;
  acceptOffers: boolean;
  stock: number;
  lowStockAlert: number;
  weight?: number;
  dimensions?: {
    width: number;
    height: number;
    depth: number;
  };
  categoriaId: string;
  marcaId?: string;
  tiendaId?: string;
  status: ProductStatus;
  isAvailable: boolean;
  isFeatured: boolean;
  metaTitle?: string;
  metaDescription?: string;
  tags: string[];
};

export type ProductAttributeFormData = {
  nombre: string;
  valor: string;
  tipo?: string;
  unidad?: string;
  orden: number;
  isVisible: boolean;
};

export type ProductMediaFormData = {
  type: MediaType;
  url: string;
  thumbnailUrl?: string;
  width?: number;
  height?: number;
  fileSize?: bigint;
  duration?: number;
  orden: number;
  isMain: boolean;
  descripcion?: string;
  altText?: string;
  metadata?: Record<string, unknown>;
};

export type ProductsTableParams = {
  page?: number;
  limit?: number;
  search?: string;
  categoriaId?: string;
  marcaId?: string;
  status?: ProductStatus;
  isAvailable?: boolean;
  isFeatured?: boolean;
  sortBy?: "name" | "price" | "stock" | "createdAt" | "viewCount" | "saleCount";
  sortOrder?: "asc" | "desc";
};

export { ProductStatus, MediaType };
export type { Producto, ProductoAtributos, ProductoMedias };
