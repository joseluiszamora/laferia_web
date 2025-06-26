export function SalesChart() {
  // Datos de ejemplo para el gráfico
  const salesData = [
    { month: "Ene", sales: 12000 },
    { month: "Feb", sales: 15000 },
    { month: "Mar", sales: 18000 },
    { month: "Abr", sales: 16000 },
    { month: "May", sales: 22000 },
    { month: "Jun", sales: 25000 },
  ];

  const maxSales = Math.max(...salesData.map((item) => item.sales));

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">
          Ventas Mensuales
        </h3>
      </div>
      <div className="p-6">
        <div className="flex items-end space-x-4 h-64">
          {salesData.map((item) => (
            <div key={item.month} className="flex flex-col items-center flex-1">
              <div
                className="w-full bg-blue-500 rounded-t-lg transition-all duration-300 hover:bg-blue-600"
                style={{
                  height: `${(item.sales / maxSales) * 200}px`,
                  minHeight: "20px",
                }}
              ></div>
              <p className="text-sm text-gray-600 mt-2">{item.month}</p>
              <p className="text-xs text-gray-500">${item.sales / 1000}k</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
