import { CategoriesTable } from "@/components/admin/CategoriesTable";
import { AddCategoryButton } from "@/components/admin/AddCategoryButton";
import { CategoryTree } from "@/components/admin/CategoryTree";

export default function CategoriesPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Categorías</h1>
          <p className="mt-2">Organiza los productos por categorías</p>
        </div>
        <AddCategoryButton />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <CategoriesTable />
        </div>
        <div>
          <CategoryTree />
        </div>
      </div>
    </div>
  );
}
