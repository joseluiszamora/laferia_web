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
    const where: Prisma.BrandWhereInput = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { slug: { contains: search, mode: "insensitive" } },
      ];
    }

    if (typeof isActive === "boolean") {
      where.isActive = isActive;
    }

    // Construir ordenamiento
    let orderBy: Prisma.BrandOrderByWithRelationInput = {};
    if (sortBy === "products") {
      orderBy = { products: { _count: sortOrder } };
    } else {
      orderBy[sortBy as keyof Prisma.BrandOrderByWithRelationInput] = sortOrder;
    }

    const [marcas, total] = await Promise.all([
      prisma.brand.findMany({
        where,
        include: {
          _count: {
            select: {
              products: true,
            },
          },
        },
        orderBy,
        skip,
        take: limit,
      }),
      prisma.brand.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      success: true,
      data: marcas,
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
    console.error("Error fetching marcas:", error);
    return { success: false, error: "Error al obtener las marcas" };
  }
}

export async function getMarcaById(id: number) {
  try {
    const marca = await prisma.brand.findUnique({
      where: { brandId: id },
      include: {
        products: {
          take: 10,
          orderBy: { createdAt: "desc" },
        },
        _count: {
          select: {
            products: true,
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
    const existingSlug = await prisma.brand.findUnique({
      where: { slug: data.slug },
    });

    if (existingSlug) {
      return { success: false, error: "El slug ya existe" };
    }

    // Validar que el nombre no exista
    const existingName = await prisma.brand.findUnique({
      where: { name: data.name },
    });

    if (existingName) {
      return { success: false, error: "El nombre de marca ya existe" };
    }

    const marca = await prisma.brand.create({
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
            products: true,
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

export async function updateMarca(id: number, data: MarcaFormData) {
  try {
    // Validar que la marca existe
    const existingMarca = await prisma.brand.findUnique({
      where: { brandId: id },
    });

    if (!existingMarca) {
      return { success: false, error: "Marca no encontrada" };
    }

    // Validar que el slug no exista en otra marca
    if (data.slug !== existingMarca.slug) {
      const existingSlug = await prisma.brand.findUnique({
        where: { slug: data.slug },
      });

      if (existingSlug) {
        return { success: false, error: "El slug ya existe" };
      }
    }

    // Validar que el nombre no exista en otra marca
    if (data.name !== existingMarca.name) {
      const existingName = await prisma.brand.findUnique({
        where: { name: data.name },
      });

      if (existingName) {
        return { success: false, error: "El nombre de marca ya existe" };
      }
    }

    const marca = await prisma.brand.update({
      where: { brandId: id },
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
            products: true,
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

export async function deleteMarca(id: number) {
  try {
    const marca = await prisma.brand.findUnique({
      where: { brandId: id },
      include: {
        _count: {
          select: {
            products: true,
          },
        },
      },
    });

    if (!marca) {
      return { success: false, error: "Marca no encontrada" };
    }

    // Verificar que no tenga productos asociados
    if (marca._count.products > 0) {
      return {
        success: false,
        error: `No se puede eliminar la marca porque tiene ${marca._count.products} productos asociados`,
      };
    }

    await prisma.brand.delete({
      where: { brandId: id },
    });

    revalidatePath("/admin/marcas");
    return { success: true };
  } catch (error) {
    console.error("Error deleting marca:", error);
    return { success: false, error: "Error al eliminar la marca" };
  }
}

export async function toggleMarcaStatus(id: number) {
  try {
    const marca = await prisma.brand.findUnique({
      where: { brandId: id },
    });

    if (!marca) {
      return { success: false, error: "Marca no encontrada" };
    }

    const updatedMarca = await prisma.brand.update({
      where: { brandId: id },
      data: {
        isActive: !marca.isActive,
      },
      include: {
        _count: {
          select: {
            products: true,
          },
        },
      },
    });

    revalidatePath("/admin/marcas");
    return { success: true, data: updatedMarca };
  } catch (error) {
    console.error("Error toggling marca status:", error);
    return { success: false, error: "Error al cambiar el estado de la marca" };
  }
}

export async function getAllMarcasActive() {
  try {
    const marcas = await prisma.brand.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
      select: {
        brandId: true,
        name: true,
        slug: true,
        logoUrl: true,
      },
    });

    return { success: true, data: marcas };
  } catch (error) {
    console.error("Error fetching active marcas:", error);
    return { success: false, error: "Error al obtener las marcas activas" };
  }
}
