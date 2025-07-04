"use server";

import { prisma } from "@/lib/prisma";
import { ProductFormData, ProductsTableParams } from "@/types/product";
import { revalidatePath } from "next/cache";
import { supabase } from "@/lib/supabase";

import { Prisma, ProductStatus } from "@prisma/client";

export async function getProducts(params: ProductsTableParams = {}) {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      categoryId,
      brandId,
      storeId,
      status,
      isAvailable,
      isFeatured,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = params;

    const skip = (page - 1) * limit;

    // Construir filtros
    const where: Prisma.ProductWhereInput = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { sku: { contains: search, mode: "insensitive" } },
      ];
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (brandId) {
      where.brandId = brandId;
    }

    if (storeId) {
      where.storeId = storeId;
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
      prisma.product.findMany({
        where,
        include: {
          category: true,
          brand: true,
          store: true,
          attributes: true,
          medias: {
            where: { isMain: true },
            take: 1,
          },
          _count: {
            select: {
              attributes: true,
              medias: true,
            },
          },
        },
        orderBy,
        skip,
        take: limit,
      }),
      prisma.product.count({ where }),
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

export async function getProductById(id: number) {
  try {
    const product = await prisma.product.findUnique({
      where: { productId: id },
      include: {
        category: true,
        brand: true,
        store: true,
        attributes: {
          orderBy: { productId: "asc" },
        },
        medias: {
          orderBy: { productId: "asc" },
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
    if (!data.categoryId) {
      return { success: false, error: "La categoría es requerida" };
    }

    if (!data.storeId) {
      return { success: false, error: "La tienda es requerida" };
    }

    // Validar que el slug no exista
    const existingSlug = await prisma.product.findUnique({
      where: { slug: data.slug },
    });

    if (existingSlug) {
      return { success: false, error: "El slug ya existe" };
    }

    // Validar SKU si se proporciona
    if (data.sku) {
      const existingSku = await prisma.product.findUnique({
        where: { sku: data.sku },
      });

      if (existingSku) {
        return { success: false, error: "El SKU ya existe" };
      }
    }

    // Validar código de barras si se proporciona
    if (data.barcode) {
      const existingBarcode = await prisma.product.findUnique({
        where: { barcode: data.barcode },
      });

      if (existingBarcode) {
        return { success: false, error: "El código de barras ya existe" };
      }
    }

    // Validar que la categoría existe
    const category = await prisma.category.findUnique({
      where: { categoryId: data.categoryId },
    });

    if (!category) {
      return { success: false, error: "La categoría no existe" };
    }

    // Validar marca si se proporciona
    if (data.brandId) {
      const brand = await prisma.brand.findUnique({
        where: { brandId: data.brandId },
      });

      if (!brand) {
        return { success: false, error: "La marca no existe" };
      }
    }

    // Validar tienda (es requerida)
    const store = await prisma.store.findUnique({
      where: { storeId: data.storeId },
    });

    if (!store) {
      return { success: false, error: "La tienda no existe" };
    }

    const product = await prisma.product.create({
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
        categoryId: data.categoryId,
        brandId: data.brandId || null,
        storeId: data.storeId,
        status: data.status,
        isAvailable: data.isAvailable,
        isFeatured: data.isFeatured,
        metaTitle: data.metaTitle,
        metaDescription: data.metaDescription,
        tags: data.tags,
      },
      include: {
        category: true,
        brand: true,
        store: true,
        _count: {
          select: {
            attributes: true,
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

export async function updateProduct(id: number, data: ProductFormData) {
  try {
    // Validar que el producto existe
    const existingProduct = await prisma.product.findUnique({
      where: { productId: id },
    });

    if (!existingProduct) {
      return { success: false, error: "El producto no existe" };
    }

    // Validar que la tienda existe si se proporciona
    if (data.storeId) {
      const store = await prisma.store.findUnique({
        where: { storeId: data.storeId },
      });

      if (!store) {
        return { success: false, error: "La tienda no existe" };
      }
    }

    // Validar slug único
    if (data.slug !== existingProduct.slug) {
      const existingSlug = await prisma.product.findUnique({
        where: { slug: data.slug },
      });

      if (existingSlug) {
        return { success: false, error: "El slug ya existe" };
      }
    }

    // Validar SKU único
    if (data.sku && data.sku !== existingProduct.sku) {
      const existingSku = await prisma.product.findUnique({
        where: { sku: data.sku },
      });

      if (existingSku) {
        return { success: false, error: "El SKU ya existe" };
      }
    }

    // Validar código de barras único
    if (data.barcode && data.barcode !== existingProduct.barcode) {
      const existingBarcode = await prisma.product.findUnique({
        where: { barcode: data.barcode },
      });

      if (existingBarcode) {
        return { success: false, error: "El código de barras ya existe" };
      }
    }

    const product = await prisma.product.update({
      where: { productId: id },
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
        categoryId: data.categoryId,
        brandId: data.brandId || null,
        storeId: data.storeId, // Remover el || null ya que storeId es requerido
        status: data.status,
        isAvailable: data.isAvailable,
        isFeatured: data.isFeatured,
        metaTitle: data.metaTitle,
        metaDescription: data.metaDescription,
        tags: data.tags,
      },
      include: {
        category: true,
        brand: true,
        store: true,
        _count: {
          select: {
            attributes: true,
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

export async function deleteProduct(id: number) {
  try {
    const product = await prisma.product.findUnique({
      where: { productId: id },
    });

    if (!product) {
      return { success: false, error: "El producto no existe" };
    }

    await prisma.product.delete({
      where: { productId: id },
    });

    revalidatePath("/admin/productos");
    return { success: true };
  } catch (error) {
    console.error("Error deleting product:", error);
    return { success: false, error: "Error al eliminar el producto" };
  }
}

export async function toggleProductAvailability(id: number) {
  try {
    const product = await prisma.product.findUnique({
      where: { productId: id },
    });

    if (!product) {
      return { success: false, error: "El producto no existe" };
    }

    const updatedProduct = await prisma.product.update({
      where: { productId: id },
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

export async function toggleProductFeatured(id: number) {
  try {
    const product = await prisma.product.findUnique({
      where: { productId: id },
    });

    if (!product) {
      return { success: false, error: "El producto no existe" };
    }

    const updatedProduct = await prisma.product.update({
      where: { productId: id },
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

export async function incrementProductViews(id: number) {
  try {
    await prisma.product.update({
      where: { productId: id },
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
    const [total, published, draft, exhausted, featured] = await Promise.all([
      prisma.product.count(),
      prisma.product.count({
        where: { status: "PUBLISHED", isAvailable: true },
      }),
      prisma.product.count({
        where: { status: "DRAFT" },
      }),
      prisma.product.count({
        where: { stock: { lte: 0 } },
      }),
      prisma.product.count({
        where: { isFeatured: true },
      }),
    ]);

    return {
      success: true,
      data: {
        total,
        published,
        draft,
        exhausted,
        featured,
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

export async function updateProductStatus(id: number, status: ProductStatus) {
  try {
    const product = await prisma.product.findUnique({
      where: { productId: id },
    });

    if (!product) {
      return { success: false, error: "El producto no existe" };
    }

    const updatedProduct = await prisma.product.update({
      where: { productId: id },
      data: { status },
      include: {
        category: true,
        brand: true,
        store: true,
        _count: {
          select: {
            attributes: true,
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

export async function getProductImages(productId: number) {
  return prisma.productMedias.findMany({
    where: { productId },
    orderBy: [{ isMain: "desc" }, { order: "asc" }, { createdAt: "asc" }],
  });
}

export async function addProductImage(
  productId: number,
  file: File,
  isMain: boolean = false
) {
  // Subir imagen a Supabase
  const upload = await supabaseUploadImage(
    file,
    "productos",
    String(productId)
  );
  if (upload.error || !upload.url)
    return {
      success: false,
      error: upload.error || "No se pudo obtener la URL de la imagen",
    };
  // Guardar en DB
  const media = await prisma.productMedias.create({
    data: {
      productId,
      url: upload.url,
      isMain,
      type: "IMAGE",
    },
  });
  return { success: true, data: media };
}

export async function deleteProductImage(productMediasId: number) {
  // Buscar media
  const media = await prisma.productMedias.findUnique({
    where: { productMediasId },
  });
  if (!media) return { success: false, error: "Imagen no encontrada" };
  // Eliminar de Supabase
  const url = new URL(media.url);
  const path = decodeURIComponent(
    url.pathname.replace(/^\/storage\/v1\/object\/public\/productos\//, "")
  );
  await supabase.storage.from("productos").remove([path]);
  // Eliminar de DB
  await prisma.productMedias.delete({ where: { productMediasId } });
  return { success: true };
}

// Helper para subir imagen a Supabase
async function supabaseUploadImage(
  file: File,
  bucket: string,
  folder?: string
) {
  const fileExt = file.name.split(".").pop();
  const fileName = `${Date.now()}-${Math.random()
    .toString(36)
    .substring(2)}.${fileExt}`;
  const filePath = folder ? `${folder}/${fileName}` : fileName;
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file, { cacheControl: "3600", upsert: false });
  if (error) return { error: error.message };
  const { data: urlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(data.path);
  return { url: urlData.publicUrl };
}
