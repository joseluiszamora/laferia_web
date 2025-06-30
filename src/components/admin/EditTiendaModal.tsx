"use client";

import { useState, useEffect, useCallback } from "react";
import { X, Save, Loader2 } from "lucide-react";
import { TiendaWithDetails, TiendaFormData } from "@/types/tienda";
import { TiendaStatus } from "@prisma/client";
import { getTiendaById, updateTienda } from "@/actions/tiendas";
import { getCategories } from "@/actions/categories";
import { CategoryWithSubcategories } from "@/types/category";

interface EditTiendaModalProps {
  isOpen: boolean;
  onClose: () => void;
  tiendaId: string;
  onSuccess: () => void;
}

export function EditTiendaModal({
  isOpen,
  onClose,
  tiendaId,
  onSuccess,
}: EditTiendaModalProps) {
  const [tienda, setTienda] = useState<TiendaWithDetails | null>(null);
  const [categories, setCategories] = useState<CategoryWithSubcategories[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<TiendaFormData>({
    nombre: "",
    slug: "",
    nombrePropietario: "",
    email: "",
    telefono: "",
    whatsapp: "",
    latitud: 0,
    longitud: 0,
    categoriaId: "",
    contacto: {},
    direccion: "",
    diasAtencion: [],
    horarioAtencion: "",
    status: "PENDIENTE",
    logoUrl: "",
    bannerUrl: "",
    descripcion: "",
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

  const loadTiendaDetails = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await getTiendaById(tiendaId);
      if (result.success && result.data) {
        const tienda = result.data;
        setTienda(tienda);
        setFormData({
          nombre: tienda.nombre,
          slug: tienda.slug,
          nombrePropietario: tienda.nombrePropietario,
          email: tienda.email || "",
          telefono: tienda.telefono || "",
          whatsapp: tienda.whatsapp || "",
          latitud: tienda.latitud,
          longitud: tienda.longitud,
          categoriaId: tienda.categoriaId,
          contacto: (tienda.contacto as Record<string, unknown>) || {},
          direccion: tienda.direccion || "",
          diasAtencion: tienda.diasAtencion,
          horarioAtencion: tienda.horarioAtencion || "",
          status: tienda.status,
          logoUrl: tienda.logoUrl || "",
          bannerUrl: tienda.bannerUrl || "",
          descripcion: tienda.descripcion || "",
        });
      } else {
        setError(result.error || "Error al cargar los detalles de la tienda");
      }
    } catch (err) {
      console.error("Error al cargar la tienda:", err);
      setError("Error inesperado al cargar la tienda");
    } finally {
      setLoading(false);
    }
  }, [tiendaId]);

  const loadCategories = useCallback(async () => {
    setLoadingCategories(true);
    try {
      const result = await getCategories();
      if (result.success && result.data) {
        setCategories(result.data);
      }
    } catch (err) {
      console.error("Error loading categories:", err);
    } finally {
      setLoadingCategories(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen && tiendaId) {
      loadTiendaDetails();
      loadCategories();
    }
  }, [isOpen, tiendaId, loadTiendaDetails, loadCategories]);

  const generateSlug = (nombre: string) => {
    return nombre
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

  const handleInputChange = (
    field: keyof TiendaFormData,
    value: string | number | string[] | Record<string, unknown>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Auto-generar slug cuando cambia el nombre
    if (field === "nombre" && typeof value === "string") {
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
      diasAtencion: checked
        ? [...prev.diasAtencion, dia]
        : prev.diasAtencion.filter((d) => d !== dia),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const result = await updateTienda(tiendaId, formData);
      if (result.success) {
        onSuccess();
        onClose();
      } else {
        setError(result.error || "Error al actualizar la tienda");
      }
    } catch (err) {
      console.error("Error al actualizar la tienda:", err);
      setError("Error inesperado al actualizar la tienda");
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Editar Tienda</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {tienda && (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Información básica */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre de la Tienda *
                  </label>
                  <input
                    type="text"
                    value={formData.nombre}
                    onChange={(e) =>
                      handleInputChange("nombre", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    onChange={(e) => handleInputChange("slug", e.target.value)}
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
                    value={formData.nombrePropietario}
                    onChange={(e) =>
                      handleInputChange("nombrePropietario", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                        e.target.value as TiendaStatus
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="PENDIENTE">Pendiente</option>
                    <option value="ACTIVA">Activa</option>
                    <option value="INACTIVA">Inactiva</option>
                    <option value="SUSPENDIDA">Suspendida</option>
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
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    value={formData.telefono}
                    onChange={(e) =>
                      handleInputChange("telefono", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    value={formData.categoriaId}
                    onChange={(e) =>
                      handleInputChange("categoriaId", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    value={formData.latitud}
                    onChange={(e) =>
                      handleInputChange(
                        "latitud",
                        parseFloat(e.target.value) || 0
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    value={formData.longitud}
                    onChange={(e) =>
                      handleInputChange(
                        "longitud",
                        parseFloat(e.target.value) || 0
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  value={formData.direccion}
                  onChange={(e) =>
                    handleInputChange("direccion", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                        checked={formData.diasAtencion.includes(dia.value)}
                        onChange={(e) =>
                          handleDiasAtencionChange(dia.value, e.target.checked)
                        }
                        className="mr-2"
                      />
                      <span className="text-sm">{dia.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Horario de atención */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Horario de Atención
                </label>
                <input
                  type="text"
                  value={formData.horarioAtencion}
                  onChange={(e) =>
                    handleInputChange("horarioAtencion", e.target.value)
                  }
                  placeholder="Ej: 8:00 AM - 6:00 PM"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Descripción */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción
                </label>
                <textarea
                  value={formData.descripcion}
                  onChange={(e) =>
                    handleInputChange("descripcion", e.target.value)
                  }
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Botones */}
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {saving ? (
                    <>
                      <Loader2 className="animate-spin mr-2" size={16} />
                      Guardando...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2" size={16} />
                      Guardar Cambios
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
