import { Eye, Edit, Mail, Phone } from "lucide-react";

const customers = [
  {
    id: 1,
    name: "María González",
    email: "maria.gonzalez@email.com",
    phone: "+34 612 345 678",
    totalOrders: 12,
    totalSpent: "$1,245.67",
    status: "Activo",
    joinDate: "2025-01-15",
    lastOrder: "2025-06-20",
  },
  {
    id: 2,
    name: "Carlos Pérez",
    email: "carlos.perez@email.com",
    phone: "+34 698 765 432",
    totalOrders: 8,
    totalSpent: "$567.89",
    status: "Activo",
    joinDate: "2025-02-10",
    lastOrder: "2025-06-25",
  },
  {
    id: 3,
    name: "Ana López",
    email: "ana.lopez@email.com",
    phone: "+34 645 123 789",
    totalOrders: 25,
    totalSpent: "$3,456.78",
    status: "VIP",
    joinDate: "2024-11-05",
    lastOrder: "2025-06-24",
  },
  {
    id: 4,
    name: "José Martín",
    email: "jose.martin@email.com",
    phone: "+34 687 456 123",
    totalOrders: 3,
    totalSpent: "$189.45",
    status: "Nuevo",
    joinDate: "2025-06-01",
    lastOrder: "2025-06-15",
  },
];

const statusColors = {
  Activo: "bg-green-100 text-green-800",
  Inactivo: "bg-gray-100 text-gray-800",
  VIP: "bg-purple-100 text-purple-800",
  Nuevo: "bg-blue-100 text-blue-800",
};

export function CustomersTable() {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cliente
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contacto
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Pedidos
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Gastado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Último Pedido
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {customers.map((customer) => (
              <tr key={customer.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                        <span className="text-gray-600 font-medium">
                          {customer.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {customer.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        Cliente desde {customer.joinDate}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{customer.email}</div>
                  <div className="text-sm text-gray-500">{customer.phone}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {customer.totalOrders}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {customer.totalSpent}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      statusColors[customer.status as keyof typeof statusColors]
                    }`}
                  >
                    {customer.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {customer.lastOrder}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button
                      className="text-blue-600 hover:text-blue-900"
                      title="Ver perfil"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      className="text-green-600 hover:text-green-900"
                      title="Editar"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      className="text-purple-600 hover:text-purple-900"
                      title="Enviar email"
                    >
                      <Mail className="h-4 w-4" />
                    </button>
                    <button
                      className="text-orange-600 hover:text-orange-900"
                      title="Llamar"
                    >
                      <Phone className="h-4 w-4" />
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
