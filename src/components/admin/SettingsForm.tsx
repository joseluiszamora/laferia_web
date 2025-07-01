import { Save } from "lucide-react";

export function SettingsForm() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">
        Configuración General
      </h3>

      <form className="space-y-6">
        <div>
          <label
            htmlFor="siteName"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Nombre del Sitio
          </label>
          <input
            type="text"
            id="siteName"
            defaultValue="La Feria"
            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label
            htmlFor="siteDescription"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Descripción del Sitio
          </label>
          <textarea
            id="siteDescription"
            rows={3}
            defaultValue="Tu marketplace de confianza"
            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label
            htmlFor="contactEmail"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Email de Contacto
          </label>
          <input
            type="email"
            id="contactEmail"
            defaultValue="contacto@laferia.com"
            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label
            htmlFor="currency"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Moneda
          </label>
          <select
            id="currency"
            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="EUR">Euro (€)</option>
            <option value="USD">Dólar (USD)</option>
            <option value="GBP">Libra (£)</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="timezone"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Zona Horaria
          </label>
          <select
            id="timezone"
            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="Europe/Madrid">Madrid (GMT+1)</option>
            <option value="Europe/London">Londres (GMT+0)</option>
            <option value="America/New_York">Nueva York (GMT-5)</option>
          </select>
        </div>

        <button
          type="submit"
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Save className="h-4 w-4" />
          <span>Guardar Cambios</span>
        </button>
      </form>
    </div>
  );
}
