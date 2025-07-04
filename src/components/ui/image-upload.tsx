"use client";

import { useState, useRef } from "react";
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";
import Image from "next/image";
import { uploadImage } from "@/lib/supabase";

interface ImageUploadProps {
  onImageUpload: (url: string, file?: File) => void;
  currentImageUrl?: string;
  bucket: string;
  folder?: string;
  disabled?: boolean;
  className?: string;
}

export function ImageUpload({
  onImageUpload,
  currentImageUrl,
  bucket,
  folder,
  disabled = false,
  className = "",
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(currentImageUrl || "");
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Por favor selecciona un archivo de imagen válido");
      return;
    }

    // Validar tamaño (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("El archivo es demasiado grande. Máximo 5MB permitido");
      return;
    }

    setUploading(true);

    try {
      // Crear preview local
      const localPreviewUrl = URL.createObjectURL(file);
      setPreviewUrl(localPreviewUrl);

      // Subir a Supabase
      const result = await uploadImage(file, bucket, folder);

      if (result.error) {
        alert(result.error);
        setPreviewUrl(currentImageUrl || "");
      } else if (result.url) {
        setPreviewUrl(result.url);
        onImageUpload(result.url, file);
      }

      // Limpiar preview local
      URL.revokeObjectURL(localPreviewUrl);
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Error al subir la imagen");
      setPreviewUrl(currentImageUrl || "");
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);

    if (disabled || uploading) return;

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled && !uploading) {
      setDragOver(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleRemoveImage = () => {
    setPreviewUrl("");
    onImageUpload("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const openFileDialog = () => {
    if (!disabled && !uploading && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className={`relative ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInputChange}
        className="hidden"
        disabled={disabled || uploading}
      />

      {previewUrl ? (
        // Preview de imagen existente
        <div className="relative">
          <div className="w-full h-40 rounded-lg overflow-hidden border-2 border-gray-300 dark:border-gray-600">
            <Image
              src={previewUrl}
              alt="Preview"
              width={400}
              height={160}
              className="w-full h-full object-cover"
              unoptimized={previewUrl.startsWith("blob:")}
            />
          </div>
          {!disabled && !uploading && (
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          {uploading && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
              <Loader2 className="h-8 w-8 text-white animate-spin" />
            </div>
          )}
        </div>
      ) : (
        // Área de drop y selección
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={openFileDialog}
          className={`
            w-full h-40 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors
            ${
              dragOver
                ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20"
                : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
            }
            ${disabled || uploading ? "opacity-50 cursor-not-allowed" : ""}
            bg-white dark:bg-gray-700
          `}
        >
          {uploading ? (
            <div className="flex flex-col items-center">
              <Loader2 className="h-8 w-8 text-blue-500 animate-spin mb-2" />
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Subiendo imagen...
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="flex items-center mb-2">
                <Upload className="h-6 w-6 text-gray-400 mr-2" />
                <ImageIcon className="h-6 w-6 text-gray-400" />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                Arrastra una imagen aquí o haz clic para seleccionar
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                PNG, JPG, JPEG (máx. 5MB)
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
