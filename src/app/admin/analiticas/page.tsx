import { AnalyticsCharts } from "@/components/admin/AnalyticsCharts";
import { AnalyticsFilters } from "@/components/admin/AnalyticsFilters";

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Analíticas</h1>
        <p className="text-gray-600 mt-2">
          Visualiza el rendimiento de tu ecommerce
        </p>
      </div>

      <AnalyticsFilters />
      <AnalyticsCharts />
    </div>
  );
}
