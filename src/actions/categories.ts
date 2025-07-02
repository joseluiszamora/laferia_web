"use server";

import { prisma } from "@/lib/prisma";
import { CategoryFormData, CategoryTreeNode } from "@/types/category";
import { revalidatePath } from "next/cache";

export async function getCategories(options?: {
  page?: number;
  limit?: number;
  search?: string;
  parentId?: number | null;
  includeInactive?: boolean;
}) {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      parentId,
      includeInactive = false,
    } = options || {};

    const skip = (page - 1) * limit;

    // Construir filtros
    const where: Record<string, unknown> = {};

    if (!includeInactive) {
      where.isActive = true;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { slug: { contains: search, mode: "insensitive" } },
      ];
    }

    if (parentId !== undefined) {
      where.parentCategoryId = parentId;
    }

    // Obtener total de registros para paginación
    const total = await prisma.category.count({ where });

    // Obtener categorías con paginación
    const categories = await prisma.category.findMany({
      where,
      include: {
        parentCategory: true,
        subcategories: {
          where: { isActive: true },
          select: { categoryId: true, name: true, slug: true },
        },
        _count: {
          select: {
            products: true,
            subcategories: true,
          },
        },
      },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      skip,
      take: limit,
    });

    const totalPages = Math.ceil(total / limit);

    return {
      success: true,
      data: categories,
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
    console.error("Error fetching categories:", error);
    return { success: false, error: "Error al obtener las categorías" };
  }
}

export async function getCategoriesForSelect() {
  try {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      include: {
        parentCategory: {
          select: { categoryId: true, name: true },
        },
      },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    });

    return {
      success: true,
      data: categories,
    };
  } catch (error) {
    console.error("Error fetching categories for select:", error);
    return { success: false, error: "Error al obtener las categorías" };
  }
}

export async function getCategoriesTree() {
  try {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      include: {
        subcategories: {
          where: { isActive: true },
          include: {
            subcategories: {
              where: { isActive: true },
              orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
            },
            _count: {
              select: { products: true },
            },
          },
          orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
        },
        _count: {
          select: { products: true },
        },
      },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    });

    // Función recursiva para construir el árbol
    const buildTree = (parentId: number | null = null): CategoryTreeNode[] => {
      return categories
        .filter((category) => category.parentCategoryId === parentId)
        .map((category) => ({
          ...category,
          children: buildTree(category.categoryId),
          level: 0, // Se puede calcular basado en la profundidad si es necesario
        }));
    };

    const tree = buildTree();

    return { success: true, data: tree };
  } catch (error) {
    console.error("Error fetching categories tree:", error);
    return { success: false, error: "Error al obtener el árbol de categorías" };
  }
}

export async function getCategoryById(id: number) {
  try {
    const category = await prisma.category.findUnique({
      where: { categoryId: id },
      include: {
        parentCategory: true,
        subcategories: {
          where: { isActive: true },
          orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
        },
        _count: {
          select: {
            products: true,
            subcategories: true,
          },
        },
      },
    });

    if (!category) {
      return { success: false, error: "Categoría no encontrada" };
    }

    return { success: true, data: category };
  } catch (error) {
    console.error("Error fetching category:", error);
    return { success: false, error: "Error al obtener la categoría" };
  }
}

export async function createCategory(data: CategoryFormData) {
  try {
    // Validar que el slug no exista
    const existingSlug = await prisma.category.findUnique({
      where: { slug: data.slug },
    });

    if (existingSlug) {
      return { success: false, error: "El slug ya existe" };
    }

    // Validar que el nombre no exista
    const existingName = await prisma.category.findUnique({
      where: { name: data.name },
    });

    if (existingName) {
      return { success: false, error: "El nombre de categoría ya existe" };
    }

    // Validar categoría padre si se especifica
    if (data.parentCategoryId) {
      const parentCategory = await prisma.category.findUnique({
        where: { categoryId: data.parentCategoryId },
      });

      if (!parentCategory) {
        return { success: false, error: "La categoría padre no existe" };
      }
    }

    const category = await prisma.category.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        icon: data.icon,
        color: data.color,
        imageUrl: data.imageUrl,
        parentCategoryId: data.parentCategoryId || null,
      },
      include: {
        parentCategory: true,
        _count: {
          select: {
            products: true,
            subcategories: true,
          },
        },
      },
    });

    revalidatePath("/admin/categorias");
    return { success: true, data: category };
  } catch (error) {
    console.error("Error creating category:", error);
    return { success: false, error: "Error al crear la categoría" };
  }
}

export async function updateCategory(id: number, data: CategoryFormData) {
  try {
    // Validar que la categoría existe
    const existingCategory = await prisma.category.findUnique({
      where: { categoryId: id },
    });

    if (!existingCategory) {
      return { success: false, error: "Categoría no encontrada" };
    }

    // Validar que el slug no exista en otra categoría
    if (data.slug !== existingCategory.slug) {
      const existingSlug = await prisma.category.findUnique({
        where: { slug: data.slug },
      });

      if (existingSlug) {
        return { success: false, error: "El slug ya existe" };
      }
    }

    // Validar que el nombre no exista en otra categoría
    if (data.name !== existingCategory.name) {
      const existingName = await prisma.category.findUnique({
        where: { name: data.name },
      });

      if (existingName) {
        return { success: false, error: "El nombre de categoría ya existe" };
      }
    }

    // Validar que no se esté asignando como padre de sí misma
    if (data.parentCategoryId && data.parentCategoryId === id) {
      return {
        success: false,
        error: "Una categoría no puede ser padre de sí misma",
      };
    }

    const category = await prisma.category.update({
      where: { categoryId: id },
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        icon: data.icon,
        color: data.color,
        imageUrl: data.imageUrl,
        parentCategoryId: data.parentCategoryId || null,
      },
      include: {
        parentCategory: true,
        _count: {
          select: {
            products: true,
            subcategories: true,
          },
        },
      },
    });

    revalidatePath("/admin/categorias");
    return { success: true, data: category };
  } catch (error) {
    console.error("Error updating category:", error);
    return { success: false, error: "Error al actualizar la categoría" };
  }
}

export async function deleteCategory(id: number) {
  try {
    const category = await prisma.category.findUnique({
      where: { categoryId: id },
      include: {
        _count: {
          select: {
            products: true,
            subcategories: true,
          },
        },
      },
    });

    if (!category) {
      return { success: false, error: "Categoría no encontrada" };
    }

    // Verificar que no tenga productos asociados
    if (category._count.products > 0) {
      return {
        success: false,
        error:
          "No se puede eliminar una categoría que tiene productos asociados",
      };
    }

    // Verificar que no tenga subcategorías
    if (category._count.subcategories > 0) {
      return {
        success: false,
        error: "No se puede eliminar una categoría que tiene subcategorías",
      };
    }

    await prisma.category.delete({
      where: { categoryId: id },
    });

    revalidatePath("/admin/categorias");
    return { success: true };
  } catch (error) {
    console.error("Error deleting category:", error);
    return { success: false, error: "Error al eliminar la categoría" };
  }
}

export async function toggleCategoryStatus(id: number) {
  try {
    const category = await prisma.category.findUnique({
      where: { categoryId: id },
    });

    if (!category) {
      return { success: false, error: "Categoría no encontrada" };
    }

    const updatedCategory = await prisma.category.update({
      where: { categoryId: id },
      data: {
        isActive: !category.isActive,
      },
      include: {
        parentCategory: true,
        _count: {
          select: {
            products: true,
            subcategories: true,
          },
        },
      },
    });

    revalidatePath("/admin/categorias");
    return { success: true, data: updatedCategory };
  } catch (error) {
    console.error("Error toggling category status:", error);
    return {
      success: false,
      error: "Error al cambiar el estado de la categoría",
    };
  }
}

export async function updateCategorySortOrder(id: number, sortOrder: number) {
  try {
    const category = await prisma.category.findUnique({
      where: { categoryId: id },
    });

    if (!category) {
      return { success: false, error: "Categoría no encontrada" };
    }

    const updatedCategory = await prisma.category.update({
      where: { categoryId: id },
      data: { sortOrder },
    });

    revalidatePath("/admin/categorias");
    return { success: true, data: updatedCategory };
  } catch (error) {
    console.error("Error updating category sort order:", error);
    return {
      success: false,
      error: "Error al actualizar el orden de la categoría",
    };
  }
}

export async function getCategoriesStats() {
  try {
    const [total, active, withProducts] = await Promise.all([
      prisma.category.count(),
      prisma.category.count({ where: { isActive: true } }),
      prisma.category.count({
        where: {
          products: {
            some: {},
          },
        },
      }),
    ]);

    return {
      success: true,
      data: {
        total,
        active,
        inactive: total - active,
        withProducts,
        withoutProducts: total - withProducts,
      },
    };
  } catch (error) {
    console.error("Error fetching categories stats:", error);
    return {
      success: false,
      error: "Error al obtener estadísticas de categorías",
    };
  }
}
