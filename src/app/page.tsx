import Link from "next/link";
import {
  Store,
  ArrowRight,
  ShoppingCart,
  Users,
  BarChart3,
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <Store className="h-16 w-16 text-blue-600" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">La Feria</h1>
          <p className="text-xl text-gray-600 mb-8">
            Tu marketplace de confianza
          </p>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Plataforma de ecommerce completa con panel de administración
            avanzado para gestionar productos, pedidos, clientes y analíticas en
            tiempo real.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <ShoppingCart className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Gestión de Pedidos
            </h3>
            <p className="text-gray-600">
              Administra todos los pedidos desde un panel centralizado
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <Users className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Base de Clientes
            </h3>
            <p className="text-gray-600">
              Mantén un registro completo de todos tus clientes
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <BarChart3 className="h-12 w-12 text-purple-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Analíticas Avanzadas
            </h3>
            <p className="text-gray-600">
              Visualiza el rendimiento de tu negocio
            </p>
          </div>
        </div>

        <div className="text-center">
          <Link
            href="/admin"
            className="inline-flex items-center justify-center bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-colors font-medium text-lg gap-2"
          >
            Acceder al Panel de Administración
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
