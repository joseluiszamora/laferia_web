"use server";

import { prisma } from "@/lib/prisma";
import { CategoryFormData } from "@/types/category";
import { revalidatePath } from "next/cache";

export async function getCategories(options?: {
  page?: number;
  limit?: number;
  search?: string;
  parentId?: string | null;
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
        subcategories: true,
        _count: {
          select: {
            productos: true,
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

export async function getCategoryTree() {
  try {
    // Función recursiva para obtener todas las categorías con anidamiento completo
    const getCategoriesWithChildren = async (
      parentId: string | null = null
    ): Promise<unknown[]> => {
      const categories = await prisma.category.findMany({
        where: {
          parentCategoryId: parentId,
          isActive: true,
        },
        include: {
          _count: {
            select: { productos: true },
          },
        },
        orderBy: {
          sortOrder: "asc",
        },
      });

      // Para cada categoría, obtener sus subcategorías recursivamente
      const categoriesWithChildren = await Promise.all(
        categories.map(async (category) => {
          const subcategories = await getCategoriesWithChildren(
            category.categoryId
          );
          return {
            ...category,
            subcategories,
          };
        })
      );

      return categoriesWithChildren;
    };

    // Obtener solo las categorías raíz (sin padre) y sus descendientes
    const rootCategories = await getCategoriesWithChildren(null);

    return { success: true, data: rootCategories };
  } catch (error) {
    console.error("Error fetching category tree:", error);
    return { success: false, error: "Error al obtener el árbol de categorías" };
  }
}

export async function getCategoryTreeLimited(maxLevels: number = 3) {
  try {
    // Función recursiva con límite de niveles
    const getCategoriesWithChildren = async (
      parentId: string | null = null,
      currentLevel: number = 0
    ): Promise<unknown[]> => {
      if (currentLevel >= maxLevels) {
        return [];
      }

      const categories = await prisma.category.findMany({
        where: {
          parentCategoryId: parentId,
          isActive: true,
        },
        include: {
          _count: {
            select: { productos: true },
          },
        },
        orderBy: {
          sortOrder: "asc",
        },
      });

      // Para cada categoría, obtener sus subcategorías recursivamente
      const categoriesWithChildren = await Promise.all(
        categories.map(async (category) => {
          const subcategories = await getCategoriesWithChildren(
            category.categoryId,
            currentLevel + 1
          );
          return {
            ...category,
            subcategories,
            hasMoreChildren:
              currentLevel + 1 >= maxLevels && subcategories.length === 0
                ? (await prisma.category.count({
                    where: {
                      parentCategoryId: category.categoryId,
                      isActive: true,
                    },
                  })) > 0
                : false,
          };
        })
      );

      return categoriesWithChildren;
    };

    // Obtener solo las categorías raíz (sin padre) y sus descendientes
    const rootCategories = await getCategoriesWithChildren(null, 0);

    return { success: true, data: rootCategories };
  } catch (error) {
    console.error("Error fetching limited category tree:", error);
    return {
      success: false,
      error: "Error al obtener el árbol de categorías limitado",
    };
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
      return { success: false, error: "El nombre ya existe" };
    }

    // Validar categoría padre si se especifica
    if (data.parentCategoryId) {
      const parentExists = await prisma.category.findUnique({
        where: { categoryId: data.parentCategoryId },
      });

      if (!parentExists) {
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
        parentCategoryId: data.parentCategoryId,
      },
      include: {
        parentCategory: true,
        _count: {
          select: {
            productos: true,
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

export async function updateCategory(id: string, data: CategoryFormData) {
  try {
    // Validar que la categoría existe
    const existingCategory = await prisma.category.findUnique({
      where: { categoryId: id },
    });

    if (!existingCategory) {
      return { success: false, error: "La categoría no existe" };
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
        return { success: false, error: "El nombre ya existe" };
      }
    }

    // Validar categoría padre si se especifica
    if (data.parentCategoryId && data.parentCategoryId !== id) {
      const parentExists = await prisma.category.findUnique({
        where: { categoryId: data.parentCategoryId },
      });

      if (!parentExists) {
        return { success: false, error: "La categoría padre no existe" };
      }
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
        parentCategoryId:
          data.parentCategoryId === id ? null : data.parentCategoryId,
      },
      include: {
        parentCategory: true,
        _count: {
          select: {
            productos: true,
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

export async function deleteCategory(id: string) {
  try {
    // Verificar que la categoría existe
    const category = await prisma.category.findUnique({
      where: { categoryId: id },
      include: {
        _count: {
          select: {
            productos: true,
            subcategories: true,
          },
        },
      },
    });

    if (!category) {
      return { success: false, error: "La categoría no existe" };
    }

    // Verificar si tiene productos asociados
    if (category._count.productos > 0) {
      return {
        success: false,
        error:
          "No se puede eliminar la categoría porque tiene productos asociados",
      };
    }

    // Verificar si tiene subcategorías
    if (category._count.subcategories > 0) {
      return {
        success: false,
        error: "No se puede eliminar la categoría porque tiene subcategorías",
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
