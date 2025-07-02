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
  toggleTiendaStatus,
} from "@/actions/tiendas";
import { TiendaWithDetails, TiendaPaginationInfo } from "@/types/tienda";
import { StoreStatus } from "@prisma/client";
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
  const [selectedStatus, setSelectedStatus] = useState<StoreStatus | "">("");
  const [sortBy, setSortBy] = useState("createdAt");
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
      status: StoreStatus | "" = "",
      sortByField: string = "fechaRegistro",
      sortOrderField: "asc" | "desc" = "desc",
      limit: number = 10
    ) => {
      setLoading(true);
      const result = await getTiendas({
        page,
        limit,
        search: search.trim(),
        categoryId: categoriaId ? parseInt(categoriaId) : undefined,
        status: status || undefined,
        sortBy: sortByField as
          | "name"
          | "averageRating"
          | "totalComments"
          | "createdAt",
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

  const handleStatusChange = (value: StoreStatus | "") => {
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
    setSortBy("createdAt");
    setSortOrder("desc");
    setItemsPerPage(10);
  };

  const handleDelete = async (id: number, name: string) => {
    if (
      !confirm(`¿Estás seguro de que quieres eliminar la tienda "${name}"?`)
    ) {
      return;
    }

    setDeleting(id.toString());
    const result = await deleteTienda(id.toString());

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

  const handleStatusUpdate = async (id: number) => {
    setUpdatingStatus(id.toString());
    const result = await toggleTiendaStatus(id.toString());

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

  const handleViewDetails = (storeId: number) => {
    setSelectedTiendaId(storeId.toString());
    setDetailsModalOpen(true);
  };

  const handleEdit = (storeId: number) => {
    setSelectedTiendaId(storeId.toString());
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

  const getStatusColor = (status: StoreStatus) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "INACTIVE":
        return "bg-gray-100 text-gray-800";
      case "SUSPEND":
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
    <div className="rounded-lg shadow overflow-hidden">
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
          <thead className="">
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
          <tbody className="divide-y divide-gray-200">
            {tiendas.map((tienda) => (
              <tr key={tienda.storeId} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {tienda.logoUrl && (
                      <Image
                        className="h-10 w-10 rounded-full mr-3 object-cover"
                        src={tienda.logoUrl}
                        alt={tienda.name}
                        width={40}
                        height={40}
                      />
                    )}
                    <div>
                      <div className="text-sm font-medium ">{tienda.name}</div>
                      <div className="text-sm text-gray-500">
                        /{tienda.slug}
                      </div>
                      {tienda.address && (
                        <div className="flex items-center text-xs text-gray-400 mt-1">
                          <MapPin className="h-3 w-3 mr-1" />
                          {tienda.address.length > 30
                            ? `${tienda.address.substring(0, 30)}...`
                            : tienda.address}
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm">{tienda.ownerName}</div>
                  {tienda.email && (
                    <div className="flex items-center text-xs text-gray-500 mt-1">
                      <Mail className="h-3 w-3 mr-1" />
                      {tienda.email}
                    </div>
                  )}
                  {tienda.phone && (
                    <div className="flex items-center text-xs text-gray-500 mt-1">
                      <Phone className="h-3 w-3 mr-1" />
                      {tienda.phone}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm">{tienda.category.name}</div>
                  <div className="text-xs text-gray-500">
                    ID: {tienda.categoryId}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm">
                    {tienda.openingHours || "No especificado"}
                  </div>
                  <div className="text-xs text-gray-500">
                    {tienda.daysAttention?.length > 0
                      ? tienda.daysAttention.join(", ")
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
                  <div className="flex items-center text-sm">
                    <Star className="h-4 w-4 text-yellow-400 mr-1" />
                    {Number(tienda.averageRating || 0).toFixed(1)}
                  </div>
                  <div className="text-xs text-gray-500">
                    {tienda.totalComments} comentarios
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    value={tienda.status}
                    onChange={() => handleStatusUpdate(tienda.storeId)}
                    disabled={updatingStatus === tienda.storeId.toString()}
                    className={`text-xs font-semibold rounded-full px-2 py-1 border-0 focus:ring-2 focus:ring-blue-500 ${getStatusColor(
                      tienda.status
                    )}`}
                  >
                    <option value="ACTIVE">Activa</option>
                    <option value="PENDING">Pendiente</option>
                    <option value="INACTIVE">Inactiva</option>
                    <option value="SUSPEND">Suspendida</option>
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm">
                    <Package className="h-4 w-4 mr-1 text-blue-500" />
                    {tienda._count?.products || 0}
                  </div>
                  <div className="flex items-center text-xs text-gray-500 mt-1">
                    <MessageCircle className="h-3 w-3 mr-1" />
                    {tienda._count?.comments || 0} reseñas
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                    {formatDate(tienda.createdAt)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button
                      className="text-blue-600 hover:text-blue-900 transition-colors"
                      title="Ver detalles"
                      onClick={() => handleViewDetails(tienda.storeId)}
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      className="text-green-600 hover:text-green-900 transition-colors"
                      title="Editar"
                      onClick={() => handleEdit(tienda.storeId)}
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      className="text-purple-600 hover:text-purple-900 transition-colors"
                      title="Ver en mapa"
                      onClick={() =>
                        window.open(
                          `https://maps.google.com/?q=${tienda.latitude},${tienda.longitude}`,
                          "_blank"
                        )
                      }
                    >
                      <ExternalLink className="h-4 w-4" />
                    </button>
                    <button
                      className="text-red-600 hover:text-red-900 transition-colors"
                      title="Eliminar"
                      disabled={deleting === tienda.storeId.toString()}
                      onClick={() => handleDelete(tienda.storeId, tienda.name)}
                    >
                      <Trash2
                        className={`h-4 w-4 ${
                          deleting === tienda.storeId.toString()
                            ? "animate-spin"
                            : ""
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
            <h3 className="mt-2 text-sm font-medium">
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
