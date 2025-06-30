"use client";

import { ProductsTable } from "@/components/admin/ProductsTable";
import { AddProductButton } from "@/components/admin/AddProductButton";

export default function ProductsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Productos</h1>
          <p className="text-gray-600 mt-2">
            Gestiona el inventario de productos
          </p>
        </div>
        <AddProductButton />
      </div>

      <ProductsTable />
    </div>
  );
}
