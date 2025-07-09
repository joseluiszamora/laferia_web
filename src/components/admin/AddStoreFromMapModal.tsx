"use client";

import { useState, useEffect } from "react";
import { X, Save, Loader2, MapPin } from "lucide-react";
import { StoreStatus } from "@prisma/client";
import { createTienda } from "@/actions/tiendas";
import { getCategories } from "@/actions/categories";
import { CategoryWithSubcategories } from "@/types/category";

interface AddStoreFromMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  latitude: number;
  longitude: number;
  onSuccess: () => void;
}

export function AddStoreFromMapModal({
  isOpen,
  onClose,
  latitude,
  longitude,
  onSuccess,
}: AddStoreFromMapModalProps) {
  const [categories, setCategories] = useState<CategoryWithSubcategories[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    ownerName: "",
    email: "",
    phone: "",
    whatsapp: "",
    categoryId: 0,
    address: "",
    daysAttention: [] as string[],
    openingHours: "08:00 - 18:00",
    status: "PENDING" as StoreStatus,
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

  useEffect(() => {
    async function loadCategories() {
      if (isOpen) {
        setLoading(true);
        try {
          const result = await getCategories();
          if (result.success) {
            setCategories(result.data as CategoryWithSubcategories[]);
          }
        } catch (err) {
          console.error("Error loading categories:", err);
        } finally {
          setLoading(false);
        }
      }
    }

    loadCategories();
  }, [isOpen]);

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
    field: string,
    value: string | number | StoreStatus
  ) => {
    setFormData((prev) => {
      const newData = { ...prev, [field]: value };

      if (field === "name") {
        newData.slug = generateSlug(value as string);
      }

      return newData;
    });
  };

  const handleDaysChange = (day: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      daysAttention: checked
        ? [...prev.daysAttention, day]
        : prev.daysAttention.filter((d) => d !== day),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const tiendaData = {
        ...formData,
        latitude,
        longitude,
        contact: {},
        logoUrl: "",
        bannerUrl: "",
      };

      const result = await createTienda(tiendaData);

      if (result.success) {
        onSuccess();
        onClose();
        // Reset form
        setFormData({
          name: "",
          slug: "",
          ownerName: "",
          email: "",
          phone: "",
          whatsapp: "",
          categoryId: 0,
          address: "",
          daysAttention: [],
          openingHours: "08:00 - 18:00",
          status: "PENDING",
          description: "",
        });
      } else {
        setError(result.error || "Error al crear la tienda");
      }
    } catch (err) {
      console.error("Error saving tienda:", err);
      setError("Error inesperado al guardar la tienda");
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in-0 duration-300">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-xl animate-in slide-in-from-bottom-4 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border bg-accent/20">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <MapPin className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">
                Agregar Nueva Tienda
              </h2>
              <p className="text-sm text-muted-foreground">
                Ubicación: {latitude.toFixed(6)}, {longitude.toFixed(6)}
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
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Información básica */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-foreground">
              Información Básica
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Nombre de la Tienda *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="w-full px-3 py-2 border border-input bg-background text-foreground rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Slug (URL amigable)
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => handleInputChange("slug", e.target.value)}
                  className="w-full px-3 py-2 border border-input bg-background text-foreground rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Nombre del Propietario *
                </label>
                <input
                  type="text"
                  value={formData.ownerName}
                  onChange={(e) =>
                    handleInputChange("ownerName", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-input bg-background text-foreground rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Categoría *
                </label>
                <select
                  value={formData.categoryId}
                  onChange={(e) =>
                    handleInputChange("categoryId", parseInt(e.target.value))
                  }
                  className="w-full px-3 py-2 border border-input bg-background text-foreground rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
                  required
                  disabled={loading}
                >
                  <option value={0}>Seleccionar categoría</option>
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
            </div>
          </div>

          {/* Información de contacto */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-foreground">
              Información de Contacto
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="w-full px-3 py-2 border border-input bg-background text-foreground rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Teléfono
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className="w-full px-3 py-2 border border-input bg-background text-foreground rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  WhatsApp
                </label>
                <input
                  type="tel"
                  value={formData.whatsapp}
                  onChange={(e) =>
                    handleInputChange("whatsapp", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-input bg-background text-foreground rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Dirección
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                className="w-full px-3 py-2 border border-input bg-background text-foreground rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
              />
            </div>
          </div>

          {/* Horarios y estado */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-foreground">
              Horarios y Estado
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Horarios de Atención
                </label>
                <input
                  type="text"
                  value={formData.openingHours}
                  onChange={(e) =>
                    handleInputChange("openingHours", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-input bg-background text-foreground rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
                  placeholder="08:00 - 18:00"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Estado
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    handleInputChange("status", e.target.value as StoreStatus)
                  }
                  className="w-full px-3 py-2 border border-input bg-background text-foreground rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
                >
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Días de Atención
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
                {diasSemana.map((dia) => (
                  <label
                    key={dia.value}
                    className="flex items-center space-x-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={formData.daysAttention.includes(dia.value)}
                      onChange={(e) =>
                        handleDaysChange(dia.value, e.target.checked)
                      }
                      className="rounded border-input text-primary focus:ring-ring"
                    />
                    <span className="text-sm text-foreground">{dia.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Descripción */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Descripción
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-input bg-background text-foreground rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
              placeholder="Describe brevemente la tienda..."
            />
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-3 pt-6 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-muted-foreground hover:text-foreground transition-colors"
              disabled={saving}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={
                saving ||
                !formData.name ||
                !formData.ownerName ||
                !formData.categoryId
              }
              className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Crear Tienda
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
