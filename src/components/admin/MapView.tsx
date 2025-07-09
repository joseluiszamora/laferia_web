"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Loader2, Plus, X } from "lucide-react";

// Importación dinámica de Leaflet para evitar problemas de SSR
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
});

import { useMapEvents } from "react-leaflet";
import { AddStoreFromMapModal } from "./AddStoreFromMapModal";

import L from "leaflet";

// Configuración del icono por defecto de Leaflet
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Tipos para las tiendas
interface Store {
  storeId: number;
  name: string;
  ownerName: string;
  latitude: number;
  longitude: number;
  status: string;
  category: {
    name: string;
  };
  address?: string;
  phone?: string;
  email?: string;
}

export function MapView() {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddingStore, setIsAddingStore] = useState(false);
  const [newStorePosition, setNewStorePosition] = useState<
    [number, number] | null
  >(null);
  const [showAddStoreModal, setShowAddStoreModal] = useState(false);

  useEffect(() => {
    async function fetchStores() {
      try {
        const response = await fetch("/api/stores");
        if (!response.ok) {
          throw new Error("Error al cargar las tiendas");
        }
        const data = await response.json();
        setStores(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        setLoading(false);
      }
    }

    fetchStores();
  }, []);

  const refreshStores = async () => {
    try {
      const response = await fetch("/api/stores");
      if (response.ok) {
        const data = await response.json();
        setStores(data);
      }
    } catch (err) {
      console.error("Error refreshing stores:", err);
    }
  };

  if (loading) {
    return (
      <div className="h-[600px] flex items-center justify-center bg-background">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Cargando mapa...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-[600px] flex items-center justify-center bg-background border border-destructive/20 rounded-lg">
        <div className="text-center">
          <p className="text-destructive mb-2">Error al cargar el mapa</p>
          <p className="text-sm text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  // Centro del mapa (Guatemala City como referencia)
  const defaultCenter: [number, number] = [-16.4953, -68.17];
  const defaultZoom = 16;
  // Función para obtener color del marker según el status
  const getMarkerColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "#22c55e"; // green
      case "INACTIVE":
        return "#ef4444"; // red
      case "PENDING":
        return "#f59e0b"; // amber
      case "SUSPEND":
        return "#6b7280"; // gray
      default:
        return "#3b82f6"; // blue
    }
  };

  // Crear icono personalizado para cada tienda
  const createCustomIcon = (status: string) => {
    const color = getMarkerColor(status);
    return L.divIcon({
      className: "custom-marker",
      html: `
        <div style="
          background-color: ${color};
          width: 20px;
          height: 20px;
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        "></div>
      `,
      iconSize: [20, 20],
      iconAnchor: [10, 10],
    });
  };

  // Crear icono para nueva tienda (temporal)
  const createNewStoreIcon = () => {
    return L.divIcon({
      className: "new-store-marker",
      html: `
        <div style="
          background-color: #3b82f6;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.4);
          animation: pulse 2s infinite;
        "></div>
      `,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });
  };

  // Componente para manejar clics en el mapa
  function MapClickHandler() {
    useMapEvents({
      click(e) {
        if (isAddingStore) {
          setNewStorePosition([e.latlng.lat, e.latlng.lng]);
          setShowAddStoreModal(true);
          setIsAddingStore(false);
        }
      },
    });
    return null;
  }

  return (
    <div className="h-[600px] w-full relative rounded-lg overflow-hidden">
      {/* Botón para agregar tienda */}
      <div className="absolute top-4 left-4 z-10">
        <button
          onClick={() => setIsAddingStore(!isAddingStore)}
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 shadow-lg ${
            isAddingStore
              ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
              : "bg-primary text-primary-foreground hover:bg-primary/90"
          }`}
        >
          {isAddingStore ? (
            <>
              <X className="w-4 h-4 inline mr-2" />
              Cancelar
            </>
          ) : (
            <>
              <Plus className="w-4 h-4 inline mr-2" />
              Agregar Tienda
            </>
          )}
        </button>
      </div>

      {/* Instrucciones cuando está en modo agregar */}
      {isAddingStore && (
        <div className="absolute top-16 left-32 bg-primary/90 text-primary-foreground px-3 py-2 rounded-lg text-sm shadow-lg z-10">
          Haz clic en el mapa para agregar una nueva tienda
        </div>
      )}

      <MapContainer
        center={defaultCenter}
        zoom={defaultZoom}
        style={{ height: "100%", width: "100%" }}
        className={`z-0 ${isAddingStore ? "adding-store" : ""}`}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapClickHandler />

        {stores.map((store) => (
          <Marker
            key={store.storeId}
            position={[store.latitude, store.longitude]}
            icon={createCustomIcon(store.status)}
          >
            <Popup>
              <div className="p-2 min-w-[250px]">
                <h3 className="font-bold text-lg mb-2">{store.name}</h3>

                <div className="space-y-1 text-sm">
                  <div>
                    <span className="font-medium">Propietario:</span>{" "}
                    {store.ownerName}
                  </div>

                  <div>
                    <span className="font-medium">Categoría:</span>{" "}
                    {store.category.name}
                  </div>

                  <div>
                    <span className="font-medium">Estado:</span>{" "}
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        store.status === "ACTIVE"
                          ? "bg-green-100 text-green-800"
                          : store.status === "INACTIVE"
                          ? "bg-red-100 text-red-800"
                          : store.status === "PENDING"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {store.status === "ACTIVE"
                        ? "Activa"
                        : store.status === "INACTIVE"
                        ? "Inactiva"
                        : store.status === "PENDING"
                        ? "Pendiente"
                        : "Suspendida"}
                    </span>
                  </div>

                  {store.address && (
                    <div>
                      <span className="font-medium">Dirección:</span>{" "}
                      {store.address}
                    </div>
                  )}

                  {store.phone && (
                    <div>
                      <span className="font-medium">Teléfono:</span>{" "}
                      {store.phone}
                    </div>
                  )}

                  {store.email && (
                    <div>
                      <span className="font-medium">Email:</span> {store.email}
                    </div>
                  )}

                  <div className="text-xs text-gray-500 mt-2">
                    Lat: {store.latitude.toFixed(6)}, Lng:{" "}
                    {store.longitude.toFixed(6)}
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Marcador temporal para nueva tienda */}
        {newStorePosition && (
          <Marker position={newStorePosition} icon={createNewStoreIcon()}>
            <Popup>
              <div className="p-2 text-center">
                <h4 className="font-medium text-primary mb-1">Nueva Tienda</h4>
                <p className="text-xs text-muted-foreground">
                  Lat: {newStorePosition[0].toFixed(6)}
                  <br />
                  Lng: {newStorePosition[1].toFixed(6)}
                </p>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>

      {/* Leyenda */}
      <div className="absolute bottom-4 right-4 bg-background border border-border rounded-lg p-3 shadow-lg z-10">
        <h4 className="font-medium text-sm mb-2 text-foreground">
          Estado de Tiendas
        </h4>
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-muted-foreground">Activa</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <span className="text-muted-foreground">Pendiente</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-muted-foreground">Inactiva</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gray-500"></div>
            <span className="text-muted-foreground">Suspendida</span>
          </div>
        </div>
      </div>

      {/* Contador de tiendas */}
      <div className="absolute top-4 right-4 bg-background border border-border rounded-lg p-3 shadow-lg z-10">
        <div className="text-sm">
          <span className="font-medium text-foreground">Total de tiendas:</span>{" "}
          <span className="text-primary font-bold">{stores.length}</span>
        </div>
      </div>

      {/* Modal para agregar tienda */}
      {showAddStoreModal && newStorePosition && (
        <AddStoreFromMapModal
          isOpen={showAddStoreModal}
          onClose={() => {
            setShowAddStoreModal(false);
            setNewStorePosition(null);
          }}
          latitude={newStorePosition[0]}
          longitude={newStorePosition[1]}
          onSuccess={() => {
            refreshStores();
            setShowAddStoreModal(false);
            setNewStorePosition(null);
          }}
        />
      )}
    </div>
  );
}
