"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Package,
  ShoppingCart,
  Users,
  FolderTree,
  BarChart3,
  Settings,
  Store,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/admin", icon: Home },
  { name: "Productos", href: "/admin/productos", icon: Package },
  { name: "Pedidos", href: "/admin/pedidos", icon: ShoppingCart },
  { name: "Clientes", href: "/admin/clientes", icon: Users },
  { name: "Categorías", href: "/admin/categorias", icon: FolderTree },
  { name: "Analíticas", href: "/admin/analiticas", icon: BarChart3 },
  { name: "Configuración", href: "/admin/configuracion", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-white shadow-lg">
      <div className="p-6">
        <div className="flex items-center space-x-3">
          <Store className="h-8 w-8 text-blue-600" />
          <h1 className="text-xl font-bold text-gray-900">La Feria Admin</h1>
        </div>
      </div>

      <nav className="px-4 pb-4">
        <ul className="space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
