"use client";

import { useState } from "react";
import { Plus, Save, Loader2 } from "lucide-react";
import { TiendaFormData } from "@/types/tienda";
import { StoreStatus } from "@prisma/client";
import { createTienda } from "@/actions/tiendas";
import { getCategoriesForSelect } from "@/actions/categories";
import { CategoryForSelect } from "@/types/category";
import { useEffect } from "react";

interface AddTiendaButtonProps {
  onSuccess: () => void;
  className?: string;
}

export function AddTiendaButton({
  onSuccess,
  className = "",
}: AddTiendaButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categories, setCategories] = useState<CategoryForSelect[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<TiendaFormData>({
    name: "",
    slug: "",
    ownerName: "",
    email: "",
    phone: "",
    whatsapp: "",
    latitude: 0,
    longitude: 0,
    categoryId: 0,
    contact: {},
    address: "",
    daysAttention: [],
    openingHours: "",
    status: "PENDING",
    logoUrl: "",
    bannerUrl: "",
    description: "",
  });

  const diasSemana = [
    { value: "lunes", label: "Lunes" },
    { value: "martes", label: "Martes" },
    { value: "miercoles", label: "Miércoles" },
    { value: "jueves", label: "Jueves" },
    { value: "viernes", label: "Viernes" },
    { value: "sabado", label: "Sábado" },
    { value: "domingo", label: "Domingo" },
  ];

  useEffect(() => {
    if (isModalOpen) {
      loadCategories();
    }
  }, [isModalOpen]);

  const loadCategories = async () => {
    setLoadingCategories(true);
    try {
      const result = await getCategoriesForSelect();
      if (result.success && result.data) {
        setCategories(result.data);
      }
    } catch (err) {
      console.error("Error loading categories:", err);
    } finally {
      setLoadingCategories(false);
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[áàäâ]/g, "a")
      .replace(/[éèëê]/g, "e")
      .replace(/[íìïî]/g, "i")
      .replace(/[óòöô]/g, "o")
      .replace(/[úùüû]/g, "u")
      .replace(/[ñ]/g, "n")
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const resetForm = () => {
    setFormData({
      name: "",
      slug: "",
      ownerName: "",
      email: "",
      phone: "",
      whatsapp: "",
      latitude: 0,
      longitude: 0,
      categoryId: 0,
      contact: {},
      address: "",
      daysAttention: [],
      openingHours: "",
      status: "PENDING",
      logoUrl: "",
      bannerUrl: "",
      description: "",
    });
    setError(null);
  };

  const handleOpen = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const handleInputChange = (
    field: keyof TiendaFormData,
    value: string | number | string[] | Record<string, unknown>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Auto-generar slug cuando cambia el nombre
    if (field === "name" && typeof value === "string") {
      const newSlug = generateSlug(value);
      setFormData((prev) => ({
        ...prev,
        slug: newSlug,
      }));
    }
  };

  const handleDiasAtencionChange = (dia: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      daysAttention: checked
        ? [...prev.daysAttention, dia]
        : prev.daysAttention.filter((d: string) => d !== dia),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const result = await createTienda(formData);
      if (result.success) {
        onSuccess();
        handleClose();
      } else {
        setError(result.error || "Error al crear la tienda");
      }
    } catch (err) {
      console.error("Error creating tienda:", err);
      setError("Error inesperado al crear la tienda");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <button
        onClick={handleOpen}
        className={`inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors ${className}`}
      >
        <Plus className="mr-2" size={16} />
        Nueva Tienda
      </button>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">
                Nueva Tienda
              </h2>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <Plus className="rotate-45" size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                  <p className="text-red-800">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Información básica */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre de la Tienda *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Slug *
                    </label>
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={(e) =>
                        handleInputChange("slug", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre del Propietario *
                    </label>
                    <input
                      type="text"
                      value={formData.ownerName}
                      onChange={(e) =>
                        handleInputChange("ownerName", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Estado *
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) =>
                        handleInputChange(
                          "status",
                          e.target.value as StoreStatus
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="PENDING">Pendiente</option>
                      <option value="ACTIVE">Activa</option>
                      <option value="INACTIVE">Inactiva</option>
                      <option value="SUSPEND">Suspendida</option>
                    </select>
                  </div>
                </div>

                {/* Información de contacto */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        handleInputChange("phone", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      WhatsApp
                    </label>
                    <input
                      type="tel"
                      value={formData.whatsapp}
                      onChange={(e) =>
                        handleInputChange("whatsapp", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Categoría y ubicación */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Categoría *
                    </label>
                    <select
                      value={formData.categoryId}
                      onChange={(e) =>
                        handleInputChange("categoryId", Number(e.target.value))
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Seleccionar categoría</option>
                      {categories.map((category) => (
                        <option
                          key={category.categoryId}
                          value={category.categoryId}
                        >
                          {category.name}
                        </option>
                      ))}
                    </select>
                    {loadingCategories && (
                      <p className="text-sm text-gray-500 mt-1">
                        Cargando categorías...
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Latitud *
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={formData.latitude}
                      onChange={(e) =>
                        handleInputChange(
                          "latitude",
                          parseFloat(e.target.value) || 0
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Longitud *
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={formData.longitude}
                      onChange={(e) =>
                        handleInputChange(
                          "longitude",
                          parseFloat(e.target.value) || 0
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                {/* Dirección */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Dirección
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) =>
                      handleInputChange("address", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Días de atención */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Días de Atención *
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {diasSemana.map((dia) => (
                      <label key={dia.value} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.daysAttention.includes(dia.value)}
                          onChange={(e) =>
                            handleDiasAtencionChange(
                              dia.value,
                              e.target.checked
                            )
                          }
                          className="mr-2"
                        />
                        <span className="text-sm">{dia.label}</span>
                      </label>
                    ))}
                  </div>
                  {formData.daysAttention.length === 0 && (
                    <p className="text-sm text-red-600 mt-1">
                      Debe seleccionar al menos un día de atención
                    </p>
                  )}
                </div>

                {/* Horario de atención */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Horario de Atención
                  </label>
                  <input
                    type="text"
                    value={formData.openingHours}
                    onChange={(e) =>
                      handleInputChange("openingHours", e.target.value)
                    }
                    placeholder="Ej: 8:00 AM - 6:00 PM"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* URLs de imágenes */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      URL del Logo
                    </label>
                    <input
                      type="url"
                      value={formData.logoUrl}
                      onChange={(e) =>
                        handleInputChange("logoUrl", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      URL del Banner
                    </label>
                    <input
                      type="url"
                      value={formData.bannerUrl}
                      onChange={(e) =>
                        handleInputChange("bannerUrl", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Descripción */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descripción
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Botones */}
                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={saving || formData.daysAttention.length === 0}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="animate-spin mr-2" size={16} />
                        Creando...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2" size={16} />
                        Crear Tienda
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
