"use server";

import { prisma } from "@/lib/prisma";
import { CategoryFormData } from "@/types/category";
import { revalidatePath } from "next/cache";

export async function getCategories() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        parentCategory: true,
        subcategories: true,
        _count: {
          select: {
            products: true,
            subcategories: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return { success: true, data: categories };
  } catch (error) {
    console.error("Error fetching categories:", error);
    return { success: false, error: "Error al obtener las categorías" };
  }
}

export async function getCategoryTree() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        subcategories: {
          include: {
            subcategories: true,
            _count: {
              select: { products: true },
            },
          },
        },
        _count: {
          select: { products: true },
        },
      },
      where: {
        parentCategoryId: null,
      },
      orderBy: {
        name: "asc",
      },
    });
    return { success: true, data: categories };
  } catch (error) {
    console.error("Error fetching category tree:", error);
    return { success: false, error: "Error al obtener el árbol de categorías" };
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

export async function deleteCategory(id: string) {
  try {
    // Verificar que la categoría existe
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
      return { success: false, error: "La categoría no existe" };
    }

    // Verificar si tiene productos asociados
    if (category._count.products > 0) {
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
