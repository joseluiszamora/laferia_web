import { SettingsForm } from "@/components/admin/SettingsForm";
import { SecuritySettings } from "@/components/admin/SecuritySettings";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Configuración</h1>
        <p className="text-gray-600 mt-2">
          Gestiona la configuración general del sistema
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SettingsForm />
        <SecuritySettings />
      </div>
    </div>
  );
}
