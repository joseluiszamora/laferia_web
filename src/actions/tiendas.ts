"use server";

import { prisma } from "@/lib/prisma";
import { TiendaFormData, TiendasTableParams } from "@/types/tienda";
import { TiendaStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function getTiendas(params?: TiendasTableParams) {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      categoriaId,
      status,
      sortBy = "fechaRegistro",
      sortOrder = "desc",
    } = params || {};

    const skip = (page - 1) * limit;

    // Construir filtros
    const where: Record<string, unknown> = {};

    if (search) {
      where.OR = [
        { nombre: { contains: search, mode: "insensitive" } },
        { nombrePropietario: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { descripcion: { contains: search, mode: "insensitive" } },
        { direccion: { contains: search, mode: "insensitive" } },
      ];
    }

    if (categoriaId) {
      where.categoriaId = categoriaId;
    }

    if (status) {
      where.status = status;
    }

    // Obtener total de registros para paginación
    const total = await prisma.tienda.count({ where });

    // Construir ordenamiento
    const orderBy: Record<string, string> = {};
    orderBy[sortBy] = sortOrder;

    // Obtener tiendas con paginación
    const tiendas = await prisma.tienda.findMany({
      where,
      include: {
        categoria: true,
        _count: {
          select: {
            productos: true,
            comentarios: true,
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
    const tienda = await prisma.tienda.findUnique({
      where: { tiendaId: id },
      include: {
        categoria: true,
        _count: {
          select: {
            productos: true,
            comentarios: true,
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
    const existingSlug = await prisma.tienda.findUnique({
      where: { slug: data.slug },
    });

    if (existingSlug) {
      return { success: false, error: "El slug ya existe" };
    }

    // Validar que el email no exista si se proporciona
    if (data.email) {
      const existingEmail = await prisma.tienda.findFirst({
        where: { email: data.email },
      });

      if (existingEmail) {
        return { success: false, error: "El email ya está registrado" };
      }
    }

    // Validar categoría
    const categoriaExists = await prisma.category.findUnique({
      where: { categoryId: data.categoriaId },
    });

    if (!categoriaExists) {
      return { success: false, error: "La categoría especificada no existe" };
    }

    const tienda = await prisma.tienda.create({
      data: {
        nombre: data.nombre,
        slug: data.slug,
        nombrePropietario: data.nombrePropietario,
        email: data.email,
        telefono: data.telefono,
        whatsapp: data.whatsapp,
        latitud: data.latitud,
        longitud: data.longitud,
        categoriaId: data.categoriaId,
        contacto: data.contacto
          ? JSON.parse(JSON.stringify(data.contacto))
          : undefined,
        direccion: data.direccion,
        diasAtencion: data.diasAtencion,
        horarioAtencion: data.horarioAtencion,
        status: data.status,
        logoUrl: data.logoUrl,
        bannerUrl: data.bannerUrl,
        descripcion: data.descripcion,
      },
      include: {
        categoria: true,
        _count: {
          select: {
            productos: true,
            comentarios: true,
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
    const existingTienda = await prisma.tienda.findUnique({
      where: { tiendaId: id },
    });

    if (!existingTienda) {
      return { success: false, error: "Tienda no encontrada" };
    }

    // Validar que el slug no exista en otra tienda
    if (data.slug !== existingTienda.slug) {
      const existingSlug = await prisma.tienda.findUnique({
        where: { slug: data.slug },
      });

      if (existingSlug) {
        return { success: false, error: "El slug ya existe" };
      }
    }

    // Validar que el email no exista en otra tienda
    if (data.email && data.email !== existingTienda.email) {
      const existingEmail = await prisma.tienda.findFirst({
        where: {
          email: data.email,
          tiendaId: { not: id },
        },
      });

      if (existingEmail) {
        return { success: false, error: "El email ya está registrado" };
      }
    }

    // Validar categoría
    const categoriaExists = await prisma.category.findUnique({
      where: { categoryId: data.categoriaId },
    });

    if (!categoriaExists) {
      return { success: false, error: "La categoría especificada no existe" };
    }

    const tienda = await prisma.tienda.update({
      where: { tiendaId: id },
      data: {
        nombre: data.nombre,
        slug: data.slug,
        nombrePropietario: data.nombrePropietario,
        email: data.email,
        telefono: data.telefono,
        whatsapp: data.whatsapp,
        latitud: data.latitud,
        longitud: data.longitud,
        categoriaId: data.categoriaId,
        contacto: data.contacto
          ? JSON.parse(JSON.stringify(data.contacto))
          : undefined,
        direccion: data.direccion,
        diasAtencion: data.diasAtencion,
        horarioAtencion: data.horarioAtencion,
        status: data.status,
        logoUrl: data.logoUrl,
        bannerUrl: data.bannerUrl,
        descripcion: data.descripcion,
      },
      include: {
        categoria: true,
        _count: {
          select: {
            productos: true,
            comentarios: true,
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
    // Verificar que la tienda existe
    const existingTienda = await prisma.tienda.findUnique({
      where: { tiendaId: id },
      include: {
        _count: {
          select: {
            productos: true,
            comentarios: true,
          },
        },
      },
    });

    if (!existingTienda) {
      return { success: false, error: "Tienda no encontrada" };
    }

    // Verificar si tiene productos asociados
    if (existingTienda._count.productos > 0) {
      return {
        success: false,
        error: `No se puede eliminar la tienda porque tiene ${existingTienda._count.productos} productos asociados`,
      };
    }

    // Verificar si tiene comentarios asociados
    if (existingTienda._count.comentarios > 0) {
      return {
        success: false,
        error: `No se puede eliminar la tienda porque tiene ${existingTienda._count.comentarios} comentarios asociados`,
      };
    }

    await prisma.tienda.delete({
      where: { tiendaId: id },
    });

    revalidatePath("/admin/tiendas");
    return { success: true };
  } catch (error) {
    console.error("Error deleting tienda:", error);
    return { success: false, error: "Error al eliminar la tienda" };
  }
}

export async function updateTiendaStatus(id: string, status: TiendaStatus) {
  try {
    const tienda = await prisma.tienda.update({
      where: { tiendaId: id },
      data: { status },
      include: {
        categoria: true,
        _count: {
          select: {
            productos: true,
            comentarios: true,
          },
        },
      },
    });

    revalidatePath("/admin/tiendas");
    return { success: true, data: tienda };
  } catch (error) {
    console.error("Error updating tienda status:", error);
    return {
      success: false,
      error: "Error al actualizar el estado de la tienda",
    };
  }
}

export async function getTiendasStats() {
  try {
    const [
      totalTiendas,
      tiendasActivas,
      tiendasPendientes,
      tiendasInactivas,
      tiendasSuspendidas,
    ] = await Promise.all([
      prisma.tienda.count(),
      prisma.tienda.count({ where: { status: "ACTIVA" } }),
      prisma.tienda.count({ where: { status: "PENDIENTE" } }),
      prisma.tienda.count({ where: { status: "INACTIVA" } }),
      prisma.tienda.count({ where: { status: "SUSPENDIDA" } }),
    ]);

    return {
      success: true,
      data: {
        total: totalTiendas,
        activas: tiendasActivas,
        pendientes: tiendasPendientes,
        inactivas: tiendasInactivas,
        suspendidas: tiendasSuspendidas,
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
