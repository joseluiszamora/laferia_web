import { TrendingUp, TrendingDown } from "lucide-react";

export function AnalyticsCharts() {
  // Datos de ejemplo para los gráficos
  const salesData = [
    { month: "Ene", sales: 25000, orders: 120 },
    { month: "Feb", sales: 28000, orders: 135 },
    { month: "Mar", sales: 32000, orders: 150 },
    { month: "Abr", sales: 29000, orders: 142 },
    { month: "May", sales: 35000, orders: 168 },
    { month: "Jun", sales: 38000, orders: 180 },
  ];

  const topProducts = [
    { name: "Smartphone Galaxy A54", sales: 1250, revenue: "$374,750" },
    { name: "Laptop HP Pavilion", sales: 89, revenue: "$62,311" },
    { name: "Auriculares Sony", sales: 234, revenue: "$58,266" },
    { name: "Camiseta Nike", sales: 456, revenue: "$13,668" },
  ];

  const maxSales = Math.max(...salesData.map((item) => item.sales));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Gráfico de Ventas */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Ventas por Mes
          </h3>
          <div className="flex items-center text-green-600">
            <TrendingUp className="h-4 w-4 mr-1" />
            <span className="text-sm">+15.3%</span>
          </div>
        </div>

        <div className="flex items-end space-x-4 h-64">
          {salesData.map((item) => (
            <div key={item.month} className="flex flex-col items-center flex-1">
              <div className="flex flex-col items-center w-full">
                <div
                  className="w-full bg-blue-500 rounded-t-lg transition-all duration-300 hover:bg-blue-600"
                  style={{
                    height: `${(item.sales / maxSales) * 200}px`,
                    minHeight: "20px",
                  }}
                ></div>
                <p className="text-xs text-gray-600 mt-2">{item.month}</p>
                <p className="text-xs text-gray-500">${item.sales / 1000}k</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Productos Más Vendidos */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          Productos Más Vendidos
        </h3>

        <div className="space-y-4">
          {topProducts.map((product, index) => (
            <div
              key={product.name}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-medium text-sm">
                      #{index + 1}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {product.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {product.sales} unidades vendidas
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p className="text-sm font-semibold text-gray-900">
                  {product.revenue}
                </p>
                <div className="flex items-center text-green-600">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  <span className="text-xs">+12%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Métricas de Conversión */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          Métricas de Conversión
        </h3>

        <div className="space-y-6">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-600">
                Tasa de Conversión
              </span>
              <span className="text-sm font-semibold text-gray-900">3.2%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full"
                style={{ width: "32%" }}
              ></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-600">
                Valor Promedio del Pedido
              </span>
              <span className="text-sm font-semibold text-gray-900">
                $127.45
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full"
                style={{ width: "68%" }}
              ></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-600">
                Tasa de Abandono del Carrito
              </span>
              <span className="text-sm font-semibold text-gray-900">24.8%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-red-500 h-2 rounded-full"
                style={{ width: "25%" }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Ingresos por Categoría */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          Ingresos por Categoría
        </h3>

        <div className="space-y-4">
          {[
            { name: "Electrónicos", percentage: 45, revenue: "$172,500" },
            { name: "Ropa", percentage: 28, revenue: "$107,200" },
            { name: "Hogar", percentage: 18, revenue: "$68,900" },
            { name: "Deportes", percentage: 9, revenue: "$34,400" },
          ].map((category) => (
            <div key={category.name}>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-600">
                  {category.name}
                </span>
                <span className="text-sm font-semibold text-gray-900">
                  {category.revenue}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${category.percentage}%` }}
                ></div>
              </div>
              <div className="text-right mt-1">
                <span className="text-xs text-gray-500">
                  {category.percentage}% del total
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
