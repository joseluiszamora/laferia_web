"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  Edit,
  Trash2,
  Eye,
  Star,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Package,
  MessageCircle,
  ExternalLink,
} from "lucide-react";
import {
  getTiendas,
  deleteTienda,
  updateTiendaStatus,
} from "@/actions/tiendas";
import { TiendaWithDetails, TiendaPaginationInfo } from "@/types/tienda";
import { TiendaStatus } from "@prisma/client";
import { TiendaFilters } from "./TiendaFilters";
import { Pagination } from "./Pagination";
import { TiendaDetailsModal } from "./TiendaDetailsModal";
import { EditTiendaModal } from "./EditTiendaModal";

export function TiendasTable() {
  const [tiendas, setTiendas] = useState<TiendaWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const [pagination, setPagination] = useState<TiendaPaginationInfo>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  });

  // Estados de filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<TiendaStatus | "">("");
  const [sortBy, setSortBy] = useState("fechaRegistro");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Estados para modales
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedTiendaId, setSelectedTiendaId] = useState<string | null>(null);

  const loadTiendas = useCallback(
    async (
      page: number = 1,
      search: string = "",
      categoriaId: string = "",
      status: TiendaStatus | "" = "",
      sortByField: string = "fechaRegistro",
      sortOrderField: "asc" | "desc" = "desc",
      limit: number = 10
    ) => {
      setLoading(true);
      const result = await getTiendas({
        page,
        limit,
        search: search.trim(),
        categoriaId: categoriaId || undefined,
        status: status || undefined,
        sortBy: sortByField as
          | "nombre"
          | "calificacionPromedio"
          | "totalComentarios"
          | "fechaRegistro",
        sortOrder: sortOrderField,
      });

      if (result.success) {
        setTiendas(result.data || []);
        if (result.pagination) {
          setPagination(result.pagination);
        }
      } else {
        console.error("Error loading tiendas:", result.error);
      }
      setLoading(false);
    },
    []
  );

  useEffect(() => {
    loadTiendas(
      1,
      searchTerm,
      selectedCategory,
      selectedStatus,
      sortBy,
      sortOrder,
      itemsPerPage
    );
  }, [
    loadTiendas,
    searchTerm,
    selectedCategory,
    selectedStatus,
    sortBy,
    sortOrder,
    itemsPerPage,
  ]);

  const handlePageChange = (page: number) => {
    loadTiendas(
      page,
      searchTerm,
      selectedCategory,
      selectedStatus,
      sortBy,
      sortOrder,
      itemsPerPage
    );
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
  };

  const handleStatusChange = (value: TiendaStatus | "") => {
    setSelectedStatus(value);
  };

  const handleSortByChange = (value: string) => {
    setSortBy(value);
  };

  const handleSortOrderChange = (value: "asc" | "desc") => {
    setSortOrder(value);
  };

  const handleItemsPerPageChange = (value: number) => {
    setItemsPerPage(value);
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setSelectedStatus("");
    setSortBy("fechaRegistro");
    setSortOrder("desc");
    setItemsPerPage(10);
  };

  const handleDelete = async (id: string, nombre: string) => {
    if (
      !confirm(`¿Estás seguro de que quieres eliminar la tienda "${nombre}"?`)
    ) {
      return;
    }

    setDeleting(id);
    const result = await deleteTienda(id);

    if (result.success) {
      await loadTiendas(
        pagination.page,
        searchTerm,
        selectedCategory,
        selectedStatus,
        sortBy,
        sortOrder,
        itemsPerPage
      );
    } else {
      alert(result.error || "Error al eliminar la tienda");
    }
    setDeleting(null);
  };

  const handleStatusUpdate = async (id: string, newStatus: TiendaStatus) => {
    setUpdatingStatus(id);
    const result = await updateTiendaStatus(id, newStatus);

    if (result.success) {
      await loadTiendas(
        pagination.page,
        searchTerm,
        selectedCategory,
        selectedStatus,
        sortBy,
        sortOrder,
        itemsPerPage
      );
    } else {
      alert(result.error || "Error al actualizar el estado");
    }
    setUpdatingStatus(null);
  };

  const handleViewDetails = (tiendaId: string) => {
    setSelectedTiendaId(tiendaId);
    setDetailsModalOpen(true);
  };

  const handleEdit = (tiendaId: string) => {
    setSelectedTiendaId(tiendaId);
    setEditModalOpen(true);
  };

  const handleModalClose = () => {
    setDetailsModalOpen(false);
    setEditModalOpen(false);
    setSelectedTiendaId(null);
  };

  const handleEditSuccess = () => {
    loadTiendas(
      pagination.page,
      searchTerm,
      selectedCategory,
      selectedStatus,
      sortBy,
      sortOrder,
      itemsPerPage
    );
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("es-ES", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date(date));
  };

  const getStatusColor = (status: TiendaStatus) => {
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

  const showingFrom = (pagination.page - 1) * pagination.limit + 1;
  const showingTo = Math.min(
    pagination.page * pagination.limit,
    pagination.total
  );

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow">
        <TiendaFilters
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
          selectedStatus={selectedStatus}
          onStatusChange={handleStatusChange}
          sortBy={sortBy}
          onSortByChange={handleSortByChange}
          sortOrder={sortOrder}
          onSortOrderChange={handleSortOrderChange}
          itemsPerPage={itemsPerPage}
          onItemsPerPageChange={handleItemsPerPageChange}
          onClearFilters={handleClearFilters}
        />
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <TiendaFilters
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
        selectedStatus={selectedStatus}
        onStatusChange={handleStatusChange}
        sortBy={sortBy}
        onSortByChange={handleSortByChange}
        sortOrder={sortOrder}
        onSortOrderChange={handleSortOrderChange}
        itemsPerPage={itemsPerPage}
        onItemsPerPageChange={handleItemsPerPageChange}
        onClearFilters={handleClearFilters}
      />

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tienda
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Propietario
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Categoría
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contacto
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Calificación
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estadísticas
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha Registro
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tiendas.map((tienda) => (
              <tr key={tienda.tiendaId} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {tienda.logoUrl && (
                      <Image
                        className="h-10 w-10 rounded-full mr-3 object-cover"
                        src={tienda.logoUrl}
                        alt={tienda.nombre}
                        width={40}
                        height={40}
                      />
                    )}
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {tienda.nombre}
                      </div>
                      <div className="text-sm text-gray-500">
                        /{tienda.slug}
                      </div>
                      {tienda.direccion && (
                        <div className="flex items-center text-xs text-gray-400 mt-1">
                          <MapPin className="h-3 w-3 mr-1" />
                          {tienda.direccion.length > 30
                            ? `${tienda.direccion.substring(0, 30)}...`
                            : tienda.direccion}
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {tienda.nombrePropietario}
                  </div>
                  {tienda.email && (
                    <div className="flex items-center text-xs text-gray-500 mt-1">
                      <Mail className="h-3 w-3 mr-1" />
                      {tienda.email}
                    </div>
                  )}
                  {tienda.telefono && (
                    <div className="flex items-center text-xs text-gray-500 mt-1">
                      <Phone className="h-3 w-3 mr-1" />
                      {tienda.telefono}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {tienda.categoria.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    ID: {tienda.categoriaId.substring(0, 8)}...
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {tienda.horarioAtencion || "No especificado"}
                  </div>
                  <div className="text-xs text-gray-500">
                    {tienda.diasAtencion?.length > 0
                      ? tienda.diasAtencion.join(", ")
                      : "No especificado"}
                  </div>
                  {tienda.whatsapp && (
                    <div className="flex items-center text-xs text-green-600 mt-1">
                      <Phone className="h-3 w-3 mr-1" />
                      WhatsApp
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-gray-900">
                    <Star className="h-4 w-4 text-yellow-400 mr-1" />
                    {Number(tienda.calificacionPromedio || 0).toFixed(1)}
                  </div>
                  <div className="text-xs text-gray-500">
                    {tienda.totalComentarios} comentarios
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    value={tienda.status}
                    onChange={(e) =>
                      handleStatusUpdate(
                        tienda.tiendaId,
                        e.target.value as TiendaStatus
                      )
                    }
                    disabled={updatingStatus === tienda.tiendaId}
                    className={`text-xs font-semibold rounded-full px-2 py-1 border-0 focus:ring-2 focus:ring-blue-500 ${getStatusColor(
                      tienda.status
                    )}`}
                  >
                    <option value="ACTIVA">Activa</option>
                    <option value="PENDIENTE">Pendiente</option>
                    <option value="INACTIVA">Inactiva</option>
                    <option value="SUSPENDIDA">Suspendida</option>
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-gray-900">
                    <Package className="h-4 w-4 mr-1 text-blue-500" />
                    {tienda._count?.productos || 0}
                  </div>
                  <div className="flex items-center text-xs text-gray-500 mt-1">
                    <MessageCircle className="h-3 w-3 mr-1" />
                    {tienda._count?.comentarios || 0} reseñas
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                    {formatDate(tienda.fechaRegistro)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button
                      className="text-blue-600 hover:text-blue-900 transition-colors"
                      title="Ver detalles"
                      onClick={() => handleViewDetails(tienda.tiendaId)}
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      className="text-green-600 hover:text-green-900 transition-colors"
                      title="Editar"
                      onClick={() => handleEdit(tienda.tiendaId)}
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      className="text-purple-600 hover:text-purple-900 transition-colors"
                      title="Ver en mapa"
                      onClick={() =>
                        window.open(
                          `https://maps.google.com/?q=${tienda.latitud},${tienda.longitud}`,
                          "_blank"
                        )
                      }
                    >
                      <ExternalLink className="h-4 w-4" />
                    </button>
                    <button
                      className="text-red-600 hover:text-red-900 transition-colors"
                      title="Eliminar"
                      disabled={deleting === tienda.tiendaId}
                      onClick={() =>
                        handleDelete(tienda.tiendaId, tienda.nombre)
                      }
                    >
                      <Trash2
                        className={`h-4 w-4 ${
                          deleting === tienda.tiendaId ? "animate-spin" : ""
                        }`}
                      />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {tiendas.length === 0 && !loading && (
          <div className="text-center py-12">
            <MapPin className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No se encontraron tiendas
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || selectedCategory || selectedStatus
                ? "Intenta ajustar los filtros o crear una nueva tienda."
                : "Comienza registrando tu primera tienda."}
            </p>
          </div>
        )}
      </div>

      {pagination.total > 0 && (
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          onPageChange={handlePageChange}
          showingFrom={showingFrom}
          showingTo={showingTo}
          totalItems={pagination.total}
        />
      )}

      {/* Modales */}
      {selectedTiendaId && (
        <>
          <TiendaDetailsModal
            isOpen={detailsModalOpen}
            onClose={handleModalClose}
            tiendaId={selectedTiendaId}
          />
          <EditTiendaModal
            isOpen={editModalOpen}
            onClose={handleModalClose}
            tiendaId={selectedTiendaId}
            onSuccess={handleEditSuccess}
          />
        </>
      )}
    </div>
  );
}
