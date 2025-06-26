import { Eye, Edit, Package } from "lucide-react";

const orders = [
  {
    id: "#ORD-001",
    customer: "María González",
    email: "maria@email.com",
    total: "$129.99",
    items: 3,
    status: "Entregado",
    date: "2025-06-25",
    paymentMethod: "Tarjeta",
  },
  {
    id: "#ORD-002",
    customer: "Carlos Pérez",
    email: "carlos@email.com",
    total: "$89.50",
    items: 2,
    status: "Procesando",
    date: "2025-06-26",
    paymentMethod: "PayPal",
  },
  {
    id: "#ORD-003",
    customer: "Ana López",
    email: "ana@email.com",
    total: "$245.00",
    items: 5,
    status: "Enviado",
    date: "2025-06-24",
    paymentMethod: "Transferencia",
  },
  {
    id: "#ORD-004",
    customer: "José Martín",
    email: "jose@email.com",
    total: "$156.75",
    items: 1,
    status: "Pendiente",
    date: "2025-06-26",
    paymentMethod: "Tarjeta",
  },
];

const statusColors = {
  Entregado: "bg-green-100 text-green-800",
  Procesando: "bg-yellow-100 text-yellow-800",
  Enviado: "bg-blue-100 text-blue-800",
  Pendiente: "bg-orange-100 text-orange-800",
  Cancelado: "bg-red-100 text-red-800",
};

export function OrdersTable() {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Pedido
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cliente
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Items
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {order.id}
                  </div>
                  <div className="text-sm text-gray-500">
                    {order.paymentMethod}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {order.customer}
                  </div>
                  <div className="text-sm text-gray-500">{order.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {order.total}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {order.items} productos
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      statusColors[order.status as keyof typeof statusColors]
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {order.date}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button
                      className="text-blue-600 hover:text-blue-900"
                      title="Ver detalles"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      className="text-green-600 hover:text-green-900"
                      title="Editar estado"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      className="text-purple-600 hover:text-purple-900"
                      title="Gestionar envío"
                    >
                      <Package className="h-4 w-4" />
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
