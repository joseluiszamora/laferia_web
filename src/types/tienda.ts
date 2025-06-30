import { Tienda, TiendaStatus, Category } from "@prisma/client";

export type TiendaWithDetails = Tienda & {
  categoria: Category;
  _count?: {
    productos: number;
    comentarios: number;
  };
};

export type TiendaFormData = {
  nombre: string;
  slug: string;
  nombrePropietario: string;
  email?: string;
  telefono?: string;
  whatsapp?: string;
  latitud: number;
  longitud: number;
  categoriaId: string;
  contacto?: Record<string, unknown>;
  direccion?: string;
  diasAtencion: string[];
  horarioAtencion?: string;
  status: TiendaStatus;
  logoUrl?: string;
  bannerUrl?: string;
  descripcion?: string;
};

export type TiendasTableParams = {
  page?: number;
  limit?: number;
  search?: string;
  categoriaId?: string;
  status?: TiendaStatus;
  sortBy?:
    | "nombre"
    | "calificacionPromedio"
    | "totalComentarios"
    | "fechaRegistro";
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
  activas: number;
  pendientes: number;
  inactivas: number;
  suspendidas: number;
};

export { TiendaStatus };
export type { Tienda };
