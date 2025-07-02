"use client";

import { useState, useEffect, useCallback } from "react";
import {
  X,
  MapPin,
  Phone,
  Mail,
  Clock,
  Star,
  Package,
  MessageCircle,
  Calendar,
  ExternalLink,
  Globe,
  User,
  Tag,
  MessageSquare,
} from "lucide-react";
import { TiendaWithDetails } from "@/types/tienda";
import { getTiendaById } from "@/actions/tiendas";

interface TiendaDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  tiendaId: string;
}

export function TiendaDetailsModal({
  isOpen,
  onClose,
  tiendaId,
}: TiendaDetailsModalProps) {
  const [tienda, setTienda] = useState<TiendaWithDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadTiendaDetails = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getTiendaById(tiendaId);
      if (result.success && result.data) {
        setTienda(result.data);
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

  useEffect(() => {
    if (isOpen && tiendaId) {
      loadTiendaDetails();
    }
  }, [isOpen, tiendaId, loadTiendaDetails]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-success/10 text-success border-success/20";
      case "PENDING":
        return "bg-warning/10 text-warning border-warning/20";
      case "INACTIVE":
        return "bg-muted text-muted-foreground border-border";
      case "SUSPEND":
        return "bg-destructive/10 text-destructive border-destructive/20";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  };

  const formatDiasAtencion = (dias: string[]) => {
    const diasSemana = {
      lunes: "Lun",
      martes: "Mar",
      miercoles: "Mié",
      jueves: "Jue",
      viernes: "Vie",
      sabado: "Sáb",
      domingo: "Dom",
    };
    return dias
      .map((dia) => diasSemana[dia as keyof typeof diasSemana] || dia)
      .join(", ");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in-0 duration-300">
      <div className="bg-background border border-border rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-lg animate-in slide-in-from-bottom-4 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">
            Detalles de la Tienda
          </h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-md hover:bg-accent"
            aria-label="Cerrar modal"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          )}

          {error && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-4">
              <p className="text-destructive">{error}</p>
            </div>
          )}

          {tienda && (
            <div className="space-y-6">
              {/* Información básica */}
              <div className="bg-accent/50 rounded-lg p-6 border border-border">
                <h3 className="text-lg font-medium text-foreground mb-4 flex items-center">
                  <User className="mr-2 text-primary" size={20} />
                  Información Básica
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Nombre de la Tienda
                    </p>
                    <p className="text-lg text-foreground">{tienda.name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Propietario
                    </p>
                    <p className="text-lg text-foreground">
                      {tienda.ownerName}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Slug
                    </p>
                    <p className="text-lg text-foreground font-mono">
                      {tienda.slug}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Estado
                    </p>
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(
                        tienda.status
                      )}`}
                    >
                      {tienda.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Información de contacto */}
              <div className="bg-primary/5 rounded-lg p-6 border border-border">
                <h3 className="text-lg font-medium text-foreground mb-4 flex items-center">
                  <Phone className="mr-2 text-primary" size={20} />
                  Contacto
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {tienda.email && (
                    <div className="flex items-center">
                      <Mail className="mr-2 text-primary" size={16} />
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Email
                        </p>
                        <a
                          href={`mailto:${tienda.email}`}
                          className="text-primary hover:underline"
                        >
                          {tienda.email}
                        </a>
                      </div>
                    </div>
                  )}
                  {tienda.phone && (
                    <div className="flex items-center">
                      <Phone className="mr-2 text-primary" size={16} />
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Teléfono
                        </p>
                        <a
                          href={`tel:${tienda.phone}`}
                          className="text-primary hover:underline"
                        >
                          {tienda.phone}
                        </a>
                      </div>
                    </div>
                  )}
                  {tienda.whatsapp && (
                    <div className="flex items-center">
                      <MessageSquare
                        className="mr-2 text-emerald-600"
                        size={16}
                      />
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          WhatsApp
                        </p>
                        <a
                          href={`https://wa.me/${tienda.whatsapp.replace(
                            /\D/g,
                            ""
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-600 hover:underline flex items-center"
                        >
                          {tienda.whatsapp}
                          <ExternalLink className="ml-1" size={12} />
                        </a>
                      </div>
                    </div>
                  )}
                  {tienda.address && (
                    <div className="flex items-start">
                      <MapPin className="mr-2 text-red-500 mt-1" size={16} />
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Dirección
                        </p>
                        <p className="text-foreground">{tienda.address}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Ubicación y horarios */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-emerald-50 dark:bg-emerald-950/20 rounded-lg p-6 border border-border">
                  <h3 className="text-lg font-medium text-foreground mb-4 flex items-center">
                    <MapPin className="mr-2 text-emerald-600" size={20} />
                    Ubicación
                  </h3>
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Coordenadas
                      </p>
                      <p className="text-foreground">
                        {tienda.latitude}, {tienda.longitude}
                      </p>
                      <a
                        href={`https://maps.google.com/?q=${tienda.latitude},${tienda.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline text-sm flex items-center mt-1"
                      >
                        Ver en Google Maps
                        <ExternalLink className="ml-1" size={12} />
                      </a>
                    </div>
                  </div>
                </div>
                <div className="bg-violet-50 dark:bg-violet-950/20 rounded-lg p-6 border border-border">
                  <h3 className="text-lg font-medium text-foreground mb-4 flex items-center">
                    <Clock className="mr-2 text-violet-600" size={20} />
                    Horarios
                  </h3>
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Días de atención
                      </p>
                      <p className="text-foreground">
                        {formatDiasAtencion(tienda.daysAttention)}
                      </p>
                    </div>
                    {tienda.openingHours && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Horario
                        </p>
                        <p className="text-foreground">{tienda.openingHours}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Categoría y estadísticas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-amber-50 dark:bg-amber-950/20 rounded-lg p-6 border border-border">
                  <h3 className="text-lg font-medium text-foreground mb-4 flex items-center">
                    <Tag className="mr-2 text-amber-600" size={20} />
                    Categoría
                  </h3>
                  <div>
                    <p className="text-lg text-foreground">
                      {tienda.category.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {tienda.category.description}
                    </p>
                  </div>
                </div>
                <div className="bg-indigo-50 dark:bg-indigo-950/20 rounded-lg p-6 border border-border">
                  <h3 className="text-lg font-medium text-foreground mb-4 flex items-center">
                    <Star className="mr-2 text-indigo-600" size={20} />
                    Estadísticas
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        <Package className="mr-1 text-indigo-600" size={16} />
                      </div>
                      <p className="text-2xl font-bold text-indigo-600">
                        {tienda._count?.products || 0}
                      </p>
                      <p className="text-sm text-muted-foreground">Productos</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        <MessageCircle
                          className="mr-1 text-indigo-600"
                          size={16}
                        />
                      </div>
                      <p className="text-2xl font-bold text-indigo-600">
                        {tienda._count?.comments || 0}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Comentarios
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 text-center">
                    <div className="flex items-center justify-center mb-1">
                      <Star className="mr-1 text-yellow-500" size={16} />
                    </div>
                    <p className="text-2xl font-bold text-yellow-600">
                      {tienda.averageRating
                        ? Number(tienda.averageRating).toFixed(1)
                        : "N/A"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Calificación
                    </p>
                  </div>
                </div>
              </div>

              {/* Descripción */}
              {tienda.description && (
                <div className="bg-accent/30 rounded-lg p-6 border border-border">
                  <h3 className="text-lg font-medium text-foreground mb-4">
                    Descripción
                  </h3>
                  <p className="text-foreground leading-relaxed">
                    {tienda.description}
                  </p>
                </div>
              )}

              {/* Información técnica */}
              <div className="bg-accent/30 rounded-lg p-6 border border-border">
                <h3 className="text-lg font-medium text-foreground mb-4 flex items-center">
                  <Calendar className="mr-2 text-primary" size={20} />
                  Información Técnica
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      ID de Tienda
                    </p>
                    <p className="text-sm text-foreground font-mono">
                      {tienda.storeId}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Fecha de Registro
                    </p>
                    <p className="text-sm text-foreground">
                      {formatDate(tienda.createdAt)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Última Actualización
                    </p>
                    <p className="text-sm text-foreground">
                      {formatDate(tienda.updatedAt)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Total de Comentarios
                    </p>
                    <p className="text-sm text-foreground">
                      {tienda.totalComments}
                    </p>
                  </div>
                </div>
              </div>

              {/* URLs de imágenes */}
              {(tienda.logoUrl || tienda.bannerUrl) && (
                <div className="bg-primary/5 rounded-lg p-6 border border-border">
                  <h3 className="text-lg font-medium text-foreground mb-4 flex items-center">
                    <Globe className="mr-2 text-primary" size={20} />
                    Recursos
                  </h3>
                  <div className="space-y-3">
                    {tienda.logoUrl && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Logo URL
                        </p>
                        <a
                          href={tienda.logoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline text-sm break-all flex items-center"
                        >
                          {tienda.logoUrl}
                          <ExternalLink
                            className="ml-1 flex-shrink-0"
                            size={12}
                          />
                        </a>
                      </div>
                    )}
                    {tienda.bannerUrl && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Banner URL
                        </p>
                        <a
                          href={tienda.bannerUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline text-sm break-all flex items-center"
                        >
                          {tienda.bannerUrl}
                          <ExternalLink
                            className="ml-1 flex-shrink-0"
                            size={12}
                          />
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
