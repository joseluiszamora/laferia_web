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
      case "ACTIVA":
        return "bg-green-100 text-green-800";
      case "PENDIENTE":
        return "bg-yellow-100 text-yellow-800";
      case "INACTIVA":
        return "bg-gray-100 text-gray-800";
      case "SUSPENDIDA":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            Detalles de la Tienda
          </h2>
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
            <div className="space-y-6">
              {/* Información básica */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <User className="mr-2" size={20} />
                  Información Básica
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Nombre de la Tienda
                    </p>
                    <p className="text-lg text-gray-900">{tienda.nombre}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Propietario
                    </p>
                    <p className="text-lg text-gray-900">
                      {tienda.nombrePropietario}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Slug</p>
                    <p className="text-lg text-gray-900 font-mono">
                      {tienda.slug}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Estado</p>
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                        tienda.status
                      )}`}
                    >
                      {tienda.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Información de contacto */}
              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <Phone className="mr-2" size={20} />
                  Contacto
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {tienda.email && (
                    <div className="flex items-center">
                      <Mail className="mr-2 text-blue-600" size={16} />
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Email
                        </p>
                        <a
                          href={`mailto:${tienda.email}`}
                          className="text-blue-600 hover:underline"
                        >
                          {tienda.email}
                        </a>
                      </div>
                    </div>
                  )}
                  {tienda.telefono && (
                    <div className="flex items-center">
                      <Phone className="mr-2 text-blue-600" size={16} />
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Teléfono
                        </p>
                        <a
                          href={`tel:${tienda.telefono}`}
                          className="text-blue-600 hover:underline"
                        >
                          {tienda.telefono}
                        </a>
                      </div>
                    </div>
                  )}
                  {tienda.whatsapp && (
                    <div className="flex items-center">
                      <MessageSquare
                        className="mr-2 text-green-600"
                        size={16}
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          WhatsApp
                        </p>
                        <a
                          href={`https://wa.me/${tienda.whatsapp.replace(
                            /\D/g,
                            ""
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-600 hover:underline flex items-center"
                        >
                          {tienda.whatsapp}
                          <ExternalLink className="ml-1" size={12} />
                        </a>
                      </div>
                    </div>
                  )}
                  {tienda.direccion && (
                    <div className="flex items-start">
                      <MapPin className="mr-2 text-red-600 mt-1" size={16} />
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Dirección
                        </p>
                        <p className="text-gray-900">{tienda.direccion}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Ubicación y horarios */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-green-50 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <MapPin className="mr-2" size={20} />
                    Ubicación
                  </h3>
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Coordenadas
                      </p>
                      <p className="text-gray-900">
                        {tienda.latitud}, {tienda.longitud}
                      </p>
                      <a
                        href={`https://maps.google.com/?q=${tienda.latitud},${tienda.longitud}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-sm flex items-center mt-1"
                      >
                        Ver en Google Maps
                        <ExternalLink className="ml-1" size={12} />
                      </a>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-50 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <Clock className="mr-2" size={20} />
                    Horarios
                  </h3>
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Días de atención
                      </p>
                      <p className="text-gray-900">
                        {formatDiasAtencion(tienda.diasAtencion)}
                      </p>
                    </div>
                    {tienda.horarioAtencion && (
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Horario
                        </p>
                        <p className="text-gray-900">
                          {tienda.horarioAtencion}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Categoría y estadísticas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-yellow-50 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <Tag className="mr-2" size={20} />
                    Categoría
                  </h3>
                  <div>
                    <p className="text-lg text-gray-900">
                      {tienda.categoria.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {tienda.categoria.description}
                    </p>
                  </div>
                </div>

                <div className="bg-indigo-50 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <Star className="mr-2" size={20} />
                    Estadísticas
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        <Package className="mr-1 text-indigo-600" size={16} />
                      </div>
                      <p className="text-2xl font-bold text-indigo-600">
                        {tienda._count?.productos || 0}
                      </p>
                      <p className="text-sm text-gray-500">Productos</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        <MessageCircle
                          className="mr-1 text-indigo-600"
                          size={16}
                        />
                      </div>
                      <p className="text-2xl font-bold text-indigo-600">
                        {tienda._count?.comentarios || 0}
                      </p>
                      <p className="text-sm text-gray-500">Comentarios</p>
                    </div>
                  </div>
                  <div className="mt-4 text-center">
                    <div className="flex items-center justify-center mb-1">
                      <Star className="mr-1 text-yellow-500" size={16} />
                    </div>
                    <p className="text-2xl font-bold text-yellow-600">
                      {tienda.calificacionPromedio
                        ? tienda.calificacionPromedio.toFixed(1)
                        : "N/A"}
                    </p>
                    <p className="text-sm text-gray-500">Calificación</p>
                  </div>
                </div>
              </div>

              {/* Descripción */}
              {tienda.descripcion && (
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Descripción
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {tienda.descripcion}
                  </p>
                </div>
              )}

              {/* Información técnica */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <Calendar className="mr-2" size={20} />
                  Información Técnica
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      ID de Tienda
                    </p>
                    <p className="text-sm text-gray-900 font-mono">
                      {tienda.tiendaId}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Fecha de Registro
                    </p>
                    <p className="text-sm text-gray-900">
                      {formatDate(tienda.fechaRegistro)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Última Actualización
                    </p>
                    <p className="text-sm text-gray-900">
                      {formatDate(tienda.fechaActualizacion)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Total de Comentarios
                    </p>
                    <p className="text-sm text-gray-900">
                      {tienda.totalComentarios}
                    </p>
                  </div>
                </div>
              </div>

              {/* URLs de imágenes */}
              {(tienda.logoUrl || tienda.bannerUrl) && (
                <div className="bg-blue-50 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <Globe className="mr-2" size={20} />
                    Recursos
                  </h3>
                  <div className="space-y-3">
                    {tienda.logoUrl && (
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Logo URL
                        </p>
                        <a
                          href={tienda.logoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline text-sm break-all flex items-center"
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
                        <p className="text-sm font-medium text-gray-500">
                          Banner URL
                        </p>
                        <a
                          href={tienda.bannerUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline text-sm break-all flex items-center"
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
