"use client";

import { TiendasTable } from "@/components/admin/TiendasTable";
import { AddTiendaButton } from "@/components/admin/AddTiendaButton";

export default function TiendasPage() {
  const handleTiendaSuccess = () => {
    // Recargar la página o actualizar el estado según sea necesario
    window.location.reload();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Tiendas</h1>
          <p className="mt-2 text-sm text-gray-700">
            Gestiona las tiendas registradas en la plataforma
          </p>
        </div>
        <AddTiendaButton
          onSuccess={handleTiendaSuccess}
          className="ml-4"
        />
      </div>

      <TiendasTable />
    </div>
  );
}
