import { CategoriesTable } from "@/components/admin/CategoriesTable";
import { AddCategoryButton } from "@/components/admin/AddCategoryButton";

export default function CategoriesPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Categorías</h1>
          <p className="text-gray-600 mt-2">
            Organiza los productos por categorías
          </p>
        </div>
        <AddCategoryButton />
      </div>

      <CategoriesTable />
    </div>
  );
}
