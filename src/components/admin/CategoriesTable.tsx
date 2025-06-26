import { Edit, Trash2, Package } from "lucide-react";

const categories = [
  {
    id: 1,
    name: "Electrónicos",
    description: "Dispositivos electrónicos y gadgets",
    productsCount: 45,
    status: "Activo",
    createdDate: "2025-01-15",
  },
  {
    id: 2,
    name: "Ropa",
    description: "Vestimenta y accesorios de moda",
    productsCount: 128,
    status: "Activo",
    createdDate: "2025-01-10",
  },
  {
    id: 3,
    name: "Hogar y Jardín",
    description: "Artículos para el hogar y jardinería",
    productsCount: 67,
    status: "Activo",
    createdDate: "2025-02-01",
  },
  {
    id: 4,
    name: "Deportes",
    description: "Equipamiento deportivo y fitness",
    productsCount: 34,
    status: "Activo",
    createdDate: "2025-02-15",
  },
  {
    id: 5,
    name: "Libros",
    description: "Literatura y material educativo",
    productsCount: 12,
    status: "Inactivo",
    createdDate: "2025-03-01",
  },
];

const statusColors = {
  Activo: "bg-green-100 text-green-800",
  Inactivo: "bg-gray-100 text-gray-800",
};

export function CategoriesTable() {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Categoría
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Productos
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha Creación
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {categories.map((category) => (
              <tr key={category.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {category.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {category.description}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-gray-900">
                    <Package className="h-4 w-4 mr-2 text-gray-400" />
                    {category.productsCount} productos
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      statusColors[category.status as keyof typeof statusColors]
                    }`}
                  >
                    {category.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {category.createdDate}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button
                      className="text-green-600 hover:text-green-900"
                      title="Editar"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      className="text-red-600 hover:text-red-900"
                      title="Eliminar"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
