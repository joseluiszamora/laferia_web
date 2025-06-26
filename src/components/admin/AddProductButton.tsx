import { Plus } from "lucide-react";

export function AddProductButton() {
  return (
    <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
      <Plus className="h-4 w-4" />
      <span>Agregar Producto</span>
    </button>
  );
}
