import { OrdersTable } from "@/components/admin/OrdersTable";
import { OrderFilters } from "@/components/admin/OrderFilters";

export default function OrdersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Pedidos</h1>
        <p className="text-gray-600 mt-2">
          Gestiona los pedidos de los clientes
        </p>
      </div>

      <OrderFilters />
      <OrdersTable />
    </div>
  );
}
