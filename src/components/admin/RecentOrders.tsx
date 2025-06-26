const recentOrders = [
  {
    id: "#ORD-001",
    customer: "María González",
    total: "$129.99",
    status: "Completado",
    date: "2024-12-26",
  },
  {
    id: "#ORD-002",
    customer: "Carlos Pérez",
    total: "$89.50",
    status: "Procesando",
    date: "2024-12-26",
  },
  {
    id: "#ORD-003",
    customer: "Ana López",
    total: "$245.00",
    status: "Enviado",
    date: "2024-12-25",
  },
  {
    id: "#ORD-004",
    customer: "José Martín",
    total: "$156.75",
    status: "Completado",
    date: "2024-12-25",
  },
];

const statusColors = {
  Completado: "bg-green-100 text-green-800",
  Procesando: "bg-yellow-100 text-yellow-800",
  Enviado: "bg-blue-100 text-blue-800",
  Cancelado: "bg-red-100 text-red-800",
};

export function RecentOrders() {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">
          Pedidos Recientes
        </h3>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {recentOrders.map((order) => (
            <div
              key={order.id}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
            >
              <div>
                <p className="font-medium text-gray-900">{order.id}</p>
                <p className="text-sm text-gray-600">{order.customer}</p>
                <p className="text-xs text-gray-500">{order.date}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">{order.total}</p>
                <span
                  className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    statusColors[order.status as keyof typeof statusColors]
                  }`}
                >
                  {order.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
