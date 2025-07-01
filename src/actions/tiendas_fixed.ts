"use server";

import { prisma } from "@/lib/prisma";
import { TiendaFormData, TiendasTableParams } from "@/types/tienda";
import { StoreStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function getTiendas(params?: TiendasTableParams) {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      categoryId,
      status,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = params || {};

    const skip = (page - 1) * limit;

    // Construir filtros
    const where: Record<string, unknown> = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { ownerName: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { address: { contains: search, mode: "insensitive" } },
      ];
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (status) {
      where.status = status;
    }

    // Obtener total de registros para paginación
    const total = await prisma.store.count({ where });

    // Construir ordenamiento
    const orderBy: Record<string, string> = {};
    orderBy[sortBy] = sortOrder;

    // Obtener tiendas con paginación
    const tiendas = await prisma.store.findMany({
      where,
      include: {
        category: true,
        _count: {
          select: {
            products: true,
            comments: true,
          },
        },
      },
      orderBy,
      skip,
      take: limit,
    });

    const totalPages = Math.ceil(total / limit);

    return {
      success: true,
      data: tiendas,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  } catch (error) {
    console.error("Error fetching tiendas:", error);
    return { success: false, error: "Error al obtener las tiendas" };
  }
}

export async function getTiendaById(id: string) {
  try {
    const tienda = await prisma.store.findUnique({
      where: { storeId: parseInt(id) },
      include: {
        category: true,
        _count: {
          select: {
            products: true,
            comments: true,
          },
        },
      },
    });

    if (!tienda) {
      return { success: false, error: "Tienda no encontrada" };
    }

    return { success: true, data: tienda };
  } catch (error) {
    console.error("Error fetching tienda:", error);
    return { success: false, error: "Error al obtener la tienda" };
  }
}

export async function createTienda(data: TiendaFormData) {
  try {
    // Validar que el slug no exista
    const existingSlug = await prisma.store.findUnique({
      where: { slug: data.slug },
    });

    if (existingSlug) {
      return { success: false, error: "El slug ya existe" };
    }

    // Validar que el email no exista si se proporciona
    if (data.email) {
      const existingEmail = await prisma.store.findFirst({
        where: { email: data.email },
      });

      if (existingEmail) {
        return { success: false, error: "El email ya está registrado" };
      }
    }

    // Validar categoría
    const categoriaExists = await prisma.category.findUnique({
      where: { categoryId: data.categoryId },
    });

    if (!categoriaExists) {
      return { success: false, error: "La categoría especificada no existe" };
    }

    const tienda = await prisma.store.create({
      data: {
        name: data.name,
        slug: data.slug,
        ownerName: data.ownerName,
        email: data.email,
        phone: data.phone,
        whatsapp: data.whatsapp,
        latitude: data.latitude,
        longitude: data.longitude,
        categoryId: data.categoryId,
        contact: data.contact
          ? JSON.parse(JSON.stringify(data.contact))
          : undefined,
        address: data.address,
        daysAttention: data.daysAttention,
        openingHours: data.openingHours,
        status: data.status,
        logoUrl: data.logoUrl,
        bannerUrl: data.bannerUrl,
        description: data.description,
      },
      include: {
        category: true,
        _count: {
          select: {
            products: true,
            comments: true,
          },
        },
      },
    });

    revalidatePath("/admin/tiendas");
    return { success: true, data: tienda };
  } catch (error) {
    console.error("Error creating tienda:", error);
    return { success: false, error: "Error al crear la tienda" };
  }
}

export async function updateTienda(id: string, data: TiendaFormData) {
  try {
    // Validar que la tienda existe
    const existingTienda = await prisma.store.findUnique({
      where: { storeId: parseInt(id) },
    });

    if (!existingTienda) {
      return { success: false, error: "Tienda no encontrada" };
    }

    // Validar que el slug no exista en otra tienda
    if (data.slug !== existingTienda.slug) {
      const existingSlug = await prisma.store.findUnique({
        where: { slug: data.slug },
      });

      if (existingSlug) {
        return { success: false, error: "El slug ya existe" };
      }
    }

    // Validar que el email no exista en otra tienda
    if (data.email && data.email !== existingTienda.email) {
      const existingEmail = await prisma.store.findFirst({
        where: {
          email: data.email,
          storeId: { not: parseInt(id) },
        },
      });

      if (existingEmail) {
        return { success: false, error: "El email ya está registrado" };
      }
    }

    // Validar categoría
    const categoriaExists = await prisma.category.findUnique({
      where: { categoryId: data.categoryId },
    });

    if (!categoriaExists) {
      return { success: false, error: "La categoría especificada no existe" };
    }

    const tienda = await prisma.store.update({
      where: { storeId: parseInt(id) },
      data: {
        name: data.name,
        slug: data.slug,
        ownerName: data.ownerName,
        email: data.email,
        phone: data.phone,
        whatsapp: data.whatsapp,
        latitude: data.latitude,
        longitude: data.longitude,
        categoryId: data.categoryId,
        contact: data.contact
          ? JSON.parse(JSON.stringify(data.contact))
          : undefined,
        address: data.address,
        daysAttention: data.daysAttention,
        openingHours: data.openingHours,
        status: data.status,
        logoUrl: data.logoUrl,
        bannerUrl: data.bannerUrl,
        description: data.description,
      },
      include: {
        category: true,
        _count: {
          select: {
            products: true,
            comments: true,
          },
        },
      },
    });

    revalidatePath("/admin/tiendas");
    return { success: true, data: tienda };
  } catch (error) {
    console.error("Error updating tienda:", error);
    return { success: false, error: "Error al actualizar la tienda" };
  }
}

export async function deleteTienda(id: string) {
  try {
    const existingTienda = await prisma.store.findUnique({
      where: { storeId: parseInt(id) },
      include: {
        _count: {
          select: {
            products: true,
          },
        },
      },
    });

    if (!existingTienda) {
      return { success: false, error: "Tienda no encontrada" };
    }

    // Verificar si tiene productos asociados
    if (existingTienda._count.products > 0) {
      return {
        success: false,
        error: `No se puede eliminar la tienda porque tiene ${existingTienda._count.products} productos asociados`,
      };
    }

    await prisma.store.delete({
      where: { storeId: parseInt(id) },
    });

    revalidatePath("/admin/tiendas");
    return { success: true };
  } catch (error) {
    console.error("Error deleting tienda:", error);
    return { success: false, error: "Error al eliminar la tienda" };
  }
}

export async function toggleTiendaStatus(id: string) {
  try {
    const tienda = await prisma.store.update({
      where: { storeId: parseInt(id) },
      data: {
        status: {
          equals: "ACTIVE" ? "INACTIVE" : "ACTIVE",
        },
      },
      include: {
        category: true,
        _count: {
          select: {
            products: true,
            comments: true,
          },
        },
      },
    });

    revalidatePath("/admin/tiendas");
    return { success: true, data: tienda };
  } catch (error) {
    console.error("Error toggling tienda status:", error);
    return { success: false, error: "Error al cambiar estado de la tienda" };
  }
}

export async function getTiendasStats() {
  try {
    const [total, active, pending, inactive, suspended] = await Promise.all([
      prisma.store.count(),
      prisma.store.count({ where: { status: "ACTIVE" } }),
      prisma.store.count({ where: { status: "PENDING" } }),
      prisma.store.count({ where: { status: "INACTIVE" } }),
      prisma.store.count({ where: { status: "SUSPEND" } }),
    ]);

    return {
      success: true,
      data: {
        total,
        active,
        pending,
        inactive,
        suspended,
      },
    };
  } catch (error) {
    console.error("Error fetching tiendas stats:", error);
    return {
      success: false,
      error: "Error al obtener estadísticas de tiendas",
    };
  }
}
