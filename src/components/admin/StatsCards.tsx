import { DollarSign, Package, ShoppingCart, Users } from "lucide-react";

const stats = [
  {
    name: "Ventas Totales",
    value: "$45,231.89",
    change: "+20.1% del mes pasado",
    changeType: "positive",
    icon: DollarSign,
  },
  {
    name: "Pedidos",
    value: "156",
    change: "+12% del mes pasado",
    changeType: "positive",
    icon: ShoppingCart,
  },
  {
    name: "Productos",
    value: "847",
    change: "+5 productos nuevos",
    changeType: "positive",
    icon: Package,
  },
  {
    name: "Clientes",
    value: "2,350",
    change: "+18% del mes pasado",
    changeType: "positive",
    icon: Users,
  },
];

export function StatsCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <div key={stat.name} className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <stat.icon className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">{stat.name}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </div>
          <div className="mt-4">
            <p
              className={`text-sm ${
                stat.changeType === "positive"
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {stat.change}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
