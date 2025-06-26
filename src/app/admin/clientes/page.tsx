import { CustomersTable } from "@/components/admin/CustomersTable";
import { CustomerFilters } from "@/components/admin/CustomerFilters";

export default function CustomersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Clientes</h1>
        <p className="text-gray-600 mt-2">
          Gestiona la base de datos de clientes
        </p>
      </div>

      <CustomerFilters />
      <CustomersTable />
    </div>
  );
}
