"use client";

import { ProductsTable } from "@/components/admin/ProductsTable";
import { AddProductButton } from "@/components/admin/AddProductButton";

export default function ProductsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold ">Productos</h1>
          <p className="mt-2">Gestiona el inventario de productos</p>
        </div>
        <AddProductButton />
      </div>

      <ProductsTable />
    </div>
  );
}
