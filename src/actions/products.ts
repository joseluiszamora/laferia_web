"use server";

import { prisma } from "@/lib/prisma";
import { ProductFormData, ProductsTableParams } from "@/types/product";
import { revalidatePath } from "next/cache";

import { Prisma, ProductStatus } from "@prisma/client";

export async function getProducts(params: ProductsTableParams = {}) {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      categoriaId,
      marcaId,
      status,
      isAvailable,
      isFeatured,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = params;

    const skip = (page - 1) * limit;

    // Construir filtros
    const where: Prisma.ProductoWhereInput = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { sku: { contains: search, mode: "insensitive" } },
      ];
    }

    if (categoriaId) {
      where.categoriaId = categoriaId;
    }

    if (marcaId) {
      where.marcaId = marcaId;
    }

    if (status) {
      where.status = status;
    }

    if (typeof isAvailable === "boolean") {
      where.isAvailable = isAvailable;
    }

    if (typeof isFeatured === "boolean") {
      where.isFeatured = isFeatured;
    }

    // Construir ordenamiento
    const orderBy: Record<string, "asc" | "desc"> = {};
    orderBy[sortBy] = sortOrder;

    const [products, total] = await Promise.all([
      prisma.producto.findMany({
        where,
        include: {
          categoria: true,
          marca: true,
          _count: {
            select: {
              atributos: true,
              medias: true,
            },
          },
        },
        orderBy,
        skip,
        take: limit,
      }),
      prisma.producto.count({ where }),
    ]);

    return {
      success: true,
      data: {
        products,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    };
  } catch (error) {
    console.error("Error fetching products:", error);
    return { success: false, error: "Error al obtener los productos" };
  }
}

export async function getProductById(id: string) {
  try {
    const product = await prisma.producto.findUnique({
      where: { id },
      include: {
        categoria: true,
        marca: true,
        atributos: {
          orderBy: { orden: "asc" },
        },
        medias: {
          orderBy: { orden: "asc" },
        },
      },
    });

    if (!product) {
      return { success: false, error: "Producto no encontrado" };
    }

    return { success: true, data: product };
  } catch (error) {
    console.error("Error fetching product:", error);
    return { success: false, error: "Error al obtener el producto" };
  }
}

export async function createProduct(data: ProductFormData) {
  try {
    console.log("Creating product with data:", JSON.stringify(data, null, 2));

    // Validar campos requeridos
    if (!data.categoriaId || data.categoriaId.trim() === "") {
      return { success: false, error: "La categoría es requerida" };
    }

    // Validar que el slug no exista
    const existingSlug = await prisma.producto.findUnique({
      where: { slug: data.slug },
    });

    if (existingSlug) {
      return { success: false, error: "El slug ya existe" };
    }

    // Validar SKU si se proporciona
    if (data.sku) {
      const existingSku = await prisma.producto.findUnique({
        where: { sku: data.sku },
      });

      if (existingSku) {
        return { success: false, error: "El SKU ya existe" };
      }
    }

    // Validar código de barras si se proporciona
    if (data.barcode) {
      const existingBarcode = await prisma.producto.findUnique({
        where: { barcode: data.barcode },
      });

      if (existingBarcode) {
        return { success: false, error: "El código de barras ya existe" };
      }
    }

    // Validar que la categoría existe
    const category = await prisma.category.findUnique({
      where: { categoryId: data.categoriaId },
    });

    if (!category) {
      return { success: false, error: "La categoría no existe" };
    }

    // Validar marca si se proporciona
    if (data.marcaId && data.marcaId.trim() !== "") {
      const marca = await prisma.marca.findUnique({
        where: { marcaId: data.marcaId },
      });

      if (!marca) {
        return { success: false, error: "La marca no existe" };
      }
    }

    // Validar tienda si se proporciona
    if (data.tiendaId && data.tiendaId.trim() !== "") {
      const tienda = await prisma.tienda.findUnique({
        where: { tiendaId: data.tiendaId },
      });

      if (!tienda) {
        return { success: false, error: "La tienda no existe" };
      }
    }

    const product = await prisma.producto.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        shortDescription: data.shortDescription,
        sku: data.sku,
        barcode: data.barcode,
        price: data.price,
        discountedPrice: data.discountedPrice,
        costPrice: data.costPrice,
        acceptOffers: data.acceptOffers,
        stock: data.stock,
        lowStockAlert: data.lowStockAlert,
        weight: data.weight,
        dimensions: data.dimensions,
        categoriaId: data.categoriaId,
        marcaId:
          data.marcaId && data.marcaId.trim() !== "" ? data.marcaId : null,
        tiendaId:
          data.tiendaId && data.tiendaId.trim() !== "" ? data.tiendaId : null,
        status: data.status,
        isAvailable: data.isAvailable,
        isFeatured: data.isFeatured,
        metaTitle: data.metaTitle,
        metaDescription: data.metaDescription,
        tags: data.tags,
      },
      include: {
        categoria: true,
        marca: true,
        _count: {
          select: {
            atributos: true,
            medias: true,
          },
        },
      },
    });

    revalidatePath("/admin/productos");
    return { success: true, data: product };
  } catch (error) {
    console.error("Error creating product:", error);
    return { success: false, error: "Error al crear el producto" };
  }
}

export async function updateProduct(id: string, data: ProductFormData) {
  try {
    // Validar que el producto existe
    const existingProduct = await prisma.producto.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      return { success: false, error: "El producto no existe" };
    }

    // Validar slug único
    if (data.slug !== existingProduct.slug) {
      const existingSlug = await prisma.producto.findUnique({
        where: { slug: data.slug },
      });

      if (existingSlug) {
        return { success: false, error: "El slug ya existe" };
      }
    }

    // Validar SKU único
    if (data.sku && data.sku !== existingProduct.sku) {
      const existingSku = await prisma.producto.findUnique({
        where: { sku: data.sku },
      });

      if (existingSku) {
        return { success: false, error: "El SKU ya existe" };
      }
    }

    // Validar código de barras único
    if (data.barcode && data.barcode !== existingProduct.barcode) {
      const existingBarcode = await prisma.producto.findUnique({
        where: { barcode: data.barcode },
      });

      if (existingBarcode) {
        return { success: false, error: "El código de barras ya existe" };
      }
    }

    const product = await prisma.producto.update({
      where: { id },
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        shortDescription: data.shortDescription,
        sku: data.sku,
        barcode: data.barcode,
        price: data.price,
        discountedPrice: data.discountedPrice,
        costPrice: data.costPrice,
        acceptOffers: data.acceptOffers,
        stock: data.stock,
        lowStockAlert: data.lowStockAlert,
        weight: data.weight,
        dimensions: data.dimensions,
        categoriaId: data.categoriaId,
        marcaId:
          data.marcaId && data.marcaId.trim() !== "" ? data.marcaId : null,
        tiendaId:
          data.tiendaId && data.tiendaId.trim() !== "" ? data.tiendaId : null,
        status: data.status,
        isAvailable: data.isAvailable,
        isFeatured: data.isFeatured,
        metaTitle: data.metaTitle,
        metaDescription: data.metaDescription,
        tags: data.tags,
      },
      include: {
        categoria: true,
        marca: true,
        _count: {
          select: {
            atributos: true,
            medias: true,
          },
        },
      },
    });

    revalidatePath("/admin/productos");
    return { success: true, data: product };
  } catch (error) {
    console.error("Error updating product:", error);
    return { success: false, error: "Error al actualizar el producto" };
  }
}

export async function deleteProduct(id: string) {
  try {
    const product = await prisma.producto.findUnique({
      where: { id },
    });

    if (!product) {
      return { success: false, error: "El producto no existe" };
    }

    await prisma.producto.delete({
      where: { id },
    });

    revalidatePath("/admin/productos");
    return { success: true };
  } catch (error) {
    console.error("Error deleting product:", error);
    return { success: false, error: "Error al eliminar el producto" };
  }
}

export async function toggleProductAvailability(id: string) {
  try {
    const product = await prisma.producto.findUnique({
      where: { id },
    });

    if (!product) {
      return { success: false, error: "El producto no existe" };
    }

    const updatedProduct = await prisma.producto.update({
      where: { id },
      data: {
        isAvailable: !product.isAvailable,
      },
    });

    revalidatePath("/admin/productos");
    return { success: true, data: updatedProduct };
  } catch (error) {
    console.error("Error toggling product availability:", error);
    return {
      success: false,
      error: "Error al cambiar la disponibilidad del producto",
    };
  }
}

export async function toggleProductFeatured(id: string) {
  try {
    const product = await prisma.producto.findUnique({
      where: { id },
    });

    if (!product) {
      return { success: false, error: "El producto no existe" };
    }

    const updatedProduct = await prisma.producto.update({
      where: { id },
      data: {
        isFeatured: !product.isFeatured,
      },
    });

    revalidatePath("/admin/productos");
    return { success: true, data: updatedProduct };
  } catch (error) {
    console.error("Error toggling product featured:", error);
    return {
      success: false,
      error: "Error al cambiar el estado destacado del producto",
    };
  }
}

export async function incrementProductViews(id: string) {
  try {
    await prisma.producto.update({
      where: { id },
      data: {
        viewCount: {
          increment: 1,
        },
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Error incrementing product views:", error);
    return {
      success: false,
      error: "Error al incrementar las vistas del producto",
    };
  }
}

export async function getProductsStats() {
  try {
    const [total, publicados, borradores, agotados, destacados] =
      await Promise.all([
        prisma.producto.count(),
        prisma.producto.count({
          where: { status: "PUBLICADO", isAvailable: true },
        }),
        prisma.producto.count({
          where: { status: "BORRADOR" },
        }),
        prisma.producto.count({
          where: { stock: { lte: 0 } },
        }),
        prisma.producto.count({
          where: { isFeatured: true },
        }),
      ]);

    return {
      success: true,
      data: {
        total,
        publicados,
        borradores,
        agotados,
        destacados,
      },
    };
  } catch (error) {
    console.error("Error fetching products stats:", error);
    return {
      success: false,
      error: "Error al obtener estadísticas de productos",
    };
  }
}

export async function updateProductStatus(id: string, status: ProductStatus) {
  try {
    const product = await prisma.producto.findUnique({
      where: { id },
    });

    if (!product) {
      return { success: false, error: "El producto no existe" };
    }

    const updatedProduct = await prisma.producto.update({
      where: { id },
      data: { status },
      include: {
        categoria: true,
        marca: true,
        _count: {
          select: {
            atributos: true,
            medias: true,
          },
        },
      },
    });

    revalidatePath("/admin/productos");
    return { success: true, data: updatedProduct };
  } catch (error) {
    console.error("Error updating product status:", error);
    return {
      success: false,
      error: "Error al actualizar el estado del producto",
    };
  }
}
