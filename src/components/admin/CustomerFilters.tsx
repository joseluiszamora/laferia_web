import { Search, Filter } from "lucide-react";

export function CustomerFilters() {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar clientes..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <select className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option value="">Todos los clientes</option>
            <option value="active">Activos</option>
            <option value="inactive">Inactivos</option>
            <option value="vip">VIP</option>
          </select>
        </div>

        <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
          <Filter className="h-4 w-4" />
          <span>Más filtros</span>
        </button>
      </div>
    </div>
  );
}
