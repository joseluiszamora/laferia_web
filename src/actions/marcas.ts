"use server";

import { prisma } from "@/lib/prisma";
import { MarcaFormData, MarcasTableParams } from "@/types/marca";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";

export async function getMarcas(params: MarcasTableParams = {}) {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      isActive,
      sortBy = "name",
      sortOrder = "asc",
    } = params;

    const skip = (page - 1) * limit;

    // Construir filtros
    const where: Prisma.MarcaWhereInput = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    if (typeof isActive === "boolean") {
      where.isActive = isActive;
    }

    // Construir ordenamiento
    let orderBy: Prisma.MarcaOrderByWithRelationInput = {};

    if (sortBy === "productos") {
      orderBy = { productos: { _count: sortOrder } };
    } else {
      orderBy[sortBy as keyof Prisma.MarcaOrderByWithRelationInput] = sortOrder;
    }

    const [marcas, total] = await Promise.all([
      prisma.marca.findMany({
        where,
        include: {
          _count: {
            select: {
              productos: true,
            },
          },
        },
        orderBy,
        skip,
        take: limit,
      }),
      prisma.marca.count({ where }),
    ]);

    return {
      success: true,
      data: {
        marcas,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    };
  } catch (error) {
    console.error("Error fetching marcas:", error);
    return { success: false, error: "Error al obtener las marcas" };
  }
}

export async function getMarcaById(id: string) {
  try {
    const marca = await prisma.marca.findUnique({
      where: { marcaId: id },
      include: {
        productos: {
          take: 10,
          include: {
            categoria: true,
          },
        },
        _count: {
          select: {
            productos: true,
          },
        },
      },
    });

    if (!marca) {
      return { success: false, error: "Marca no encontrada" };
    }

    return { success: true, data: marca };
  } catch (error) {
    console.error("Error fetching marca:", error);
    return { success: false, error: "Error al obtener la marca" };
  }
}

export async function createMarca(data: MarcaFormData) {
  try {
    // Validar que el slug no exista
    const existingSlug = await prisma.marca.findUnique({
      where: { slug: data.slug },
    });

    if (existingSlug) {
      return { success: false, error: "El slug ya existe" };
    }

    // Validar que el nombre no exista
    const existingName = await prisma.marca.findUnique({
      where: { name: data.name },
    });

    if (existingName) {
      return { success: false, error: "El nombre ya existe" };
    }

    const marca = await prisma.marca.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        logoUrl: data.logoUrl,
        websiteUrl: data.websiteUrl,
        isActive: data.isActive,
      },
      include: {
        _count: {
          select: {
            productos: true,
          },
        },
      },
    });

    revalidatePath("/admin/marcas");
    return { success: true, data: marca };
  } catch (error) {
    console.error("Error creating marca:", error);
    return { success: false, error: "Error al crear la marca" };
  }
}

export async function updateMarca(id: string, data: MarcaFormData) {
  try {
    // Validar que la marca existe
    const existingMarca = await prisma.marca.findUnique({
      where: { marcaId: id },
    });

    if (!existingMarca) {
      return { success: false, error: "La marca no existe" };
    }

    // Validar que el slug no exista en otra marca
    if (data.slug !== existingMarca.slug) {
      const existingSlug = await prisma.marca.findUnique({
        where: { slug: data.slug },
      });

      if (existingSlug) {
        return { success: false, error: "El slug ya existe" };
      }
    }

    // Validar que el nombre no exista en otra marca
    if (data.name !== existingMarca.name) {
      const existingName = await prisma.marca.findUnique({
        where: { name: data.name },
      });

      if (existingName) {
        return { success: false, error: "El nombre ya existe" };
      }
    }

    const marca = await prisma.marca.update({
      where: { marcaId: id },
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        logoUrl: data.logoUrl,
        websiteUrl: data.websiteUrl,
        isActive: data.isActive,
      },
      include: {
        _count: {
          select: {
            productos: true,
          },
        },
      },
    });

    revalidatePath("/admin/marcas");
    return { success: true, data: marca };
  } catch (error) {
    console.error("Error updating marca:", error);
    return { success: false, error: "Error al actualizar la marca" };
  }
}

export async function deleteMarca(id: string) {
  try {
    const marca = await prisma.marca.findUnique({
      where: { marcaId: id },
      include: {
        _count: {
          select: {
            productos: true,
          },
        },
      },
    });

    if (!marca) {
      return { success: false, error: "La marca no existe" };
    }

    // Verificar si tiene productos asociados
    if (marca._count.productos > 0) {
      return {
        success: false,
        error: "No se puede eliminar la marca porque tiene productos asociados",
      };
    }

    await prisma.marca.delete({
      where: { marcaId: id },
    });

    revalidatePath("/admin/marcas");
    return { success: true };
  } catch (error) {
    console.error("Error deleting marca:", error);
    return { success: false, error: "Error al eliminar la marca" };
  }
}

export async function toggleMarcaStatus(id: string) {
  try {
    const marca = await prisma.marca.findUnique({
      where: { marcaId: id },
    });

    if (!marca) {
      return { success: false, error: "La marca no existe" };
    }

    const updatedMarca = await prisma.marca.update({
      where: { marcaId: id },
      data: {
        isActive: !marca.isActive,
      },
    });

    revalidatePath("/admin/marcas");
    return { success: true, data: updatedMarca };
  } catch (error) {
    console.error("Error toggling marca status:", error);
    return { success: false, error: "Error al cambiar el estado de la marca" };
  }
}

export async function getAllMarcasForSelect() {
  try {
    const marcas = await prisma.marca.findMany({
      where: { isActive: true },
      select: {
        marcaId: true,
        name: true,
        slug: true,
      },
      orderBy: { name: "asc" },
    });

    return { success: true, data: marcas };
  } catch (error) {
    console.error("Error fetching marcas for select:", error);
    return { success: false, error: "Error al obtener las marcas" };
  }
}
