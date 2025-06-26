import { StatsCards } from "@/components/admin/StatsCards";
import { RecentOrders } from "@/components/admin/RecentOrders";
import { SalesChart } from "@/components/admin/SalesChart";

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Panel de Control</h1>
        <p className="text-gray-600 mt-2">
          Bienvenido al administrador de La Feria
        </p>
      </div>

      <StatsCards />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SalesChart />
        <RecentOrders />
      </div>
    </div>
  );
}
