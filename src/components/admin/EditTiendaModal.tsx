"use client";

import { useState, useEffect, useCallback } from "react";
import {
  X,
  Save,
  Loader2,
  Store,
  User,
  MapPin,
  Clock,
  Globe,
} from "lucide-react";
import { TiendaWithDetails, TiendaFormData } from "@/types/tienda";
import { StoreStatus } from "@prisma/client";
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
    { label: "Lunes", value: "monday" },
    { label: "Martes", value: "tuesday" },
    { label: "Miércoles", value: "wednesday" },
    { label: "Jueves", value: "thursday" },
    { label: "Viernes", value: "friday" },
    { label: "Sábado", value: "saturday" },
    { label: "Domingo", value: "sunday" },
  ];

  const statusOptions = [
    { label: "Pendiente", value: "PENDING" },
    { label: "Activo", value: "ACTIVE" },
    { label: "Inactivo", value: "INACTIVE" },
    { label: "Suspendido", value: "SUSPEND" },
  ];

  const loadTiendaDetails = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getTiendaById(tiendaId);
      if (result.success && result.data) {
        const tiendaData = result.data;
        setTienda(tiendaData);
        setFormData({
          name: tiendaData.name,
          slug: tiendaData.slug,
          ownerName: tiendaData.ownerName,
          email: tiendaData.email || "",
          phone: tiendaData.phone || "",
          whatsapp: tiendaData.whatsapp || "",
          latitude: tiendaData.latitude,
          longitude: tiendaData.longitude,
          categoryId: tiendaData.categoryId,
          contact: (tiendaData.contact as Record<string, unknown>) || {},
          address: tiendaData.address || "",
          daysAttention: tiendaData.daysAttention,
          openingHours: tiendaData.openingHours || "",
          status: tiendaData.status,
          logoUrl: tiendaData.logoUrl || "",
          bannerUrl: tiendaData.bannerUrl || "",
          description: tiendaData.description || "",
        });
      } else {
        setError(result.error || "Error al cargar los detalles de la tienda");
      }
    } catch (err) {
      console.error("Error loading tienda details:", err);
      setError("Error inesperado al cargar la tienda");
    } finally {
      setLoading(false);
    }
  }, [tiendaId]);

  const loadCategories = useCallback(async () => {
    setLoadingCategories(true);
    try {
      const result = await getCategories();
      if (result.success) {
        setCategories(result.data as CategoryWithSubcategories[]);
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

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  const handleInputChange = (
    field: keyof TiendaFormData,
    value: string | number | StoreStatus
  ) => {
    setFormData((prev) => {
      const newData = { ...prev, [field]: value };

      // Auto-generar slug cuando cambia el nombre
      if (field === "name" && typeof value === "string") {
        newData.slug = generateSlug(value);
      }

      return newData;
    });
  };

  const handleDayToggle = (dia: string) => {
    setFormData((prev) => ({
      ...prev,
      daysAttention: prev.daysAttention.includes(dia)
        ? prev.daysAttention.filter((d: string) => d !== dia)
        : [...prev.daysAttention, dia],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tienda) return;

    setSaving(true);
    setError(null);

    try {
      const result = await updateTienda(tienda.storeId.toString(), formData);
      if (result.success) {
        onSuccess();
        onClose();
      } else {
        setError(result.error || "Error al actualizar la tienda");
      }
    } catch (err) {
      console.error("Error updating tienda:", err);
      setError("Error inesperado al actualizar la tienda");
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in-0 duration-300">
      <div className="bg-background border border-border rounded-lg w-full max-w-4xl max-h-[95vh] overflow-hidden shadow-xl animate-in slide-in-from-bottom-4 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border bg-accent/20">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Store className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">
                Editar Tienda
              </h2>
              <p className="text-sm text-muted-foreground">
                {tienda?.name || "Cargando..."}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-accent rounded-lg transition-colors text-muted-foreground hover:text-foreground"
            disabled={saving}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(95vh-120px)]">
          {loading ? (
            <div className="flex items-center justify-center p-12">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
                <p className="text-muted-foreground">
                  Cargando datos de la tienda...
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Error Message */}
              {error && (
                <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              {/* Información Básica */}
              <div className="bg-primary/5 rounded-lg p-6 border border-border">
                <h3 className="text-lg font-medium text-foreground mb-4 flex items-center">
                  <Store className="h-5 w-5 mr-2 text-primary" />
                  Información Básica
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      Nombre de la Tienda
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-input bg-background text-foreground rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring"
                      placeholder="Nombre de la tienda"
                      required
                      disabled={saving}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      Slug
                    </label>
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={(e) =>
                        handleInputChange("slug", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-input bg-background text-foreground rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring"
                      placeholder="slug-tienda"
                      required
                      disabled={saving}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      Categoría
                    </label>
                    <select
                      value={formData.categoryId}
                      onChange={(e) =>
                        handleInputChange(
                          "categoryId",
                          parseInt(e.target.value)
                        )
                      }
                      className="w-full px-3 py-2 border border-input bg-background text-foreground rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring"
                      required
                      disabled={saving || loadingCategories}
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
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      Estado
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) =>
                        handleInputChange(
                          "status",
                          e.target.value as StoreStatus
                        )
                      }
                      className="w-full px-3 py-2 border border-input bg-background text-foreground rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring"
                      required
                      disabled={saving}
                    >
                      {statusOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Descripción
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    rows={3}
                    className="w-full px-3 py-2 border border-input bg-background text-foreground rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring resize-none"
                    placeholder="Descripción de la tienda"
                    disabled={saving}
                  />
                </div>
              </div>

              {/* Información del Propietario */}
              <div className="bg-accent/50 rounded-lg p-6 border border-border">
                <h3 className="text-lg font-medium text-foreground mb-4 flex items-center">
                  <User className="h-5 w-5 mr-2 text-primary" />
                  Información del Propietario
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      Nombre del Propietario
                    </label>
                    <input
                      type="text"
                      value={formData.ownerName}
                      onChange={(e) =>
                        handleInputChange("ownerName", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-input bg-background text-foreground rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring"
                      placeholder="Nombre completo"
                      required
                      disabled={saving}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-input bg-background text-foreground rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring"
                      placeholder="correo@ejemplo.com"
                      disabled={saving}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        handleInputChange("phone", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-input bg-background text-foreground rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring"
                      placeholder="+1234567890"
                      disabled={saving}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      WhatsApp
                    </label>
                    <input
                      type="tel"
                      value={formData.whatsapp}
                      onChange={(e) =>
                        handleInputChange("whatsapp", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-input bg-background text-foreground rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring"
                      placeholder="+1234567890"
                      disabled={saving}
                    />
                  </div>
                </div>
              </div>

              {/* Ubicación */}
              <div className="bg-emerald-50 dark:bg-emerald-950/20 rounded-lg p-6 border border-border">
                <h3 className="text-lg font-medium text-foreground mb-4 flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-primary" />
                  Ubicación
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      Latitud
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={formData.latitude}
                      onChange={(e) =>
                        handleInputChange(
                          "latitude",
                          parseFloat(e.target.value)
                        )
                      }
                      className="w-full px-3 py-2 border border-input bg-background text-foreground rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring"
                      placeholder="-34.123456"
                      required
                      disabled={saving}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      Longitud
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={formData.longitude}
                      onChange={(e) =>
                        handleInputChange(
                          "longitude",
                          parseFloat(e.target.value)
                        )
                      }
                      className="w-full px-3 py-2 border border-input bg-background text-foreground rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring"
                      placeholder="-58.123456"
                      required
                      disabled={saving}
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Dirección
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) =>
                      handleInputChange("address", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-input bg-background text-foreground rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring"
                    placeholder="Dirección completa"
                    disabled={saving}
                  />
                </div>
              </div>

              {/* Horarios */}
              <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-6 border border-border">
                <h3 className="text-lg font-medium text-foreground mb-4 flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-primary" />
                  Horarios de Atención
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-3">
                      Días de Atención
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {diasSemana.map((dia) => (
                        <label
                          key={dia.value}
                          className="flex items-center space-x-2 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={formData.daysAttention.includes(dia.value)}
                            onChange={() => handleDayToggle(dia.value)}
                            className="rounded border-input text-primary focus:ring-ring"
                            disabled={saving}
                          />
                          <span className="text-sm text-foreground">
                            {dia.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      Horario de Atención
                    </label>
                    <input
                      type="text"
                      value={formData.openingHours}
                      onChange={(e) =>
                        handleInputChange("openingHours", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-input bg-background text-foreground rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring"
                      placeholder="08:00 - 18:00"
                      disabled={saving}
                    />
                  </div>
                </div>
              </div>

              {/* Imágenes */}
              <div className="bg-purple-50 dark:bg-purple-950/20 rounded-lg p-6 border border-border">
                <h3 className="text-lg font-medium text-foreground mb-4 flex items-center">
                  <Globe className="h-5 w-5 mr-2 text-primary" />
                  Imágenes y Multimedia
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      URL del Logo
                    </label>
                    <input
                      type="url"
                      value={formData.logoUrl}
                      onChange={(e) =>
                        handleInputChange("logoUrl", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-input bg-background text-foreground rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring"
                      placeholder="https://ejemplo.com/logo.jpg"
                      disabled={saving}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      URL del Banner
                    </label>
                    <input
                      type="url"
                      value={formData.bannerUrl}
                      onChange={(e) =>
                        handleInputChange("bannerUrl", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-input bg-background text-foreground rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring"
                      placeholder="https://ejemplo.com/banner.jpg"
                      disabled={saving}
                    />
                  </div>
                </div>
              </div>

              {/* Botones */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-input rounded-md bg-background text-foreground text-sm font-medium hover:bg-accent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring transition-colors"
                  disabled={saving}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary border border-transparent rounded-md text-sm font-medium text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring disabled:opacity-50 disabled:cursor-not-allowed flex items-center transition-colors"
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
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
