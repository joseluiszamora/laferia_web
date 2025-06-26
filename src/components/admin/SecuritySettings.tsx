import { Shield, Key, Lock } from "lucide-react";

export function SecuritySettings() {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">
        Configuración de Seguridad
      </h3>

      <div className="space-y-6">
        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <div className="flex items-center space-x-3">
            <Shield className="h-5 w-5 text-green-600" />
            <div>
              <p className="text-sm font-medium text-gray-900">
                Autenticación de Dos Factores
              </p>
              <p className="text-xs text-gray-500">Protege tu cuenta con 2FA</p>
            </div>
          </div>
          <button className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
            Activado
          </button>
        </div>

        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <div className="flex items-center space-x-3">
            <Key className="h-5 w-5 text-blue-600" />
            <div>
              <p className="text-sm font-medium text-gray-900">
                Cambiar Contraseña
              </p>
              <p className="text-xs text-gray-500">
                Actualiza tu contraseña regularmente
              </p>
            </div>
          </div>
          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
            Cambiar
          </button>
        </div>

        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <div className="flex items-center space-x-3">
            <Lock className="h-5 w-5 text-orange-600" />
            <div>
              <p className="text-sm font-medium text-gray-900">
                Sesiones Activas
              </p>
              <p className="text-xs text-gray-500">
                Gestiona tus sesiones activas
              </p>
            </div>
          </div>
          <button className="text-orange-600 hover:text-orange-800 text-sm font-medium">
            Ver (3)
          </button>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-yellow-800 mb-2">
            Recomendaciones de Seguridad
          </h4>
          <ul className="text-xs text-yellow-700 space-y-1">
            <li>• Usa contraseñas únicas y complejas</li>
            <li>• Activa la autenticación de dos factores</li>
            <li>• Revisa regularmente las sesiones activas</li>
            <li>• Mantén el software actualizado</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
