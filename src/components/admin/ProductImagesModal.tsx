"use client";

import { useState, useEffect } from "react";
import { X, Trash2 } from "lucide-react";
import Image from "next/image";
import { ImageUpload } from "@/components/ui/image-upload";
import {
  getProductImages,
  addProductImage,
  deleteProductImage,
} from "@/actions/products";

interface ProductMedia {
  productMediasId: number;
  url: string;
  isMain: boolean;
  type: string;
  order: number;
}

interface ProductImagesModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: number;
}

export function ProductImagesModal({
  isOpen,
  onClose,
  productId,
}: ProductImagesModalProps) {
  const [images, setImages] = useState<ProductMedia[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadImages = async () => {
    setLoading(true);
    const imgs = await getProductImages(productId);
    setImages(imgs);
    setLoading(false);
  };

  useEffect(() => {
    if (isOpen) loadImages();
    // eslint-disable-next-line
  }, [isOpen, productId]);

  const handleImageUpload = async (url: string, file?: File) => {
    setUploading(true);
    setError(null);
    // Lógica para guardar en DB
    const result = await addProductImage(productId, file!, false);
    if (result.success) {
      loadImages();
    } else {
      setError(result.error || "Error al subir imagen");
    }
    setUploading(false);
  };

  const handleDelete = async (id: number) => {
    setError(null);
    const result = await deleteProductImage(id);
    if (result.success) {
      setImages((prev) => prev.filter((img) => img.productMediasId !== id));
    } else {
      setError(result.error || "Error al eliminar imagen");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">Imágenes del Producto</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-4 space-y-4">
          {error && (
            <div className="bg-red-100 text-red-700 p-2 rounded">{error}</div>
          )}

          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {images.map((img) => (
                <div
                  key={img.productMediasId}
                  className="relative group border rounded-lg overflow-hidden"
                >
                  <Image
                    src={img.url}
                    alt="Imagen producto"
                    width={200}
                    height={128}
                    className="w-full h-32 object-cover"
                    unoptimized
                  />
                  <button
                    type="button"
                    onClick={() => handleDelete(img.productMediasId)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-80 hover:bg-red-600"
                    title="Eliminar imagen"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                  {img.isMain && (
                    <span className="absolute bottom-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                      Principal
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="mt-4">
            <label className="block text-sm font-medium mb-2">
              Agregar nueva imagen
            </label>
            <ImageUpload
              onImageUpload={(url, file) => handleImageUpload(url, file)}
              bucket="productos"
              disabled={uploading}
              className="w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
