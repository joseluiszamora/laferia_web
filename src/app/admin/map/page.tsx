import { MapView } from "../../../components/admin/MapView";

export default function MapPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">Mapa de Tiendas</h1>
        <p className="text-muted-foreground mt-2">
          Visualiza la ubicación de todas las tiendas registradas en la
          plataforma
        </p>
      </div>

      <div className="bg-background border border-border rounded-lg shadow-sm">
        <MapView />
      </div>
    </div>
  );
}
