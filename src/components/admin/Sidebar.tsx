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
  ChevronDown,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";

const navigation = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: Home,
    description: "Resumen general",
  },
  {
    name: "Productos",
    href: "/admin/productos",
    icon: Package,
    description: "Gestionar productos",
  },
  {
    name: "Pedidos",
    href: "/admin/pedidos",
    icon: ShoppingCart,
    description: "Gestionar pedidos",
  },
  {
    name: "Clientes",
    href: "/admin/clientes",
    icon: Users,
    description: "Base de clientes",
  },
  {
    name: "Tiendas",
    href: "/admin/tiendas",
    icon: Store,
    description: "Red de tiendas",
  },
  {
    name: "Categorías",
    href: "/admin/categorias",
    icon: FolderTree,
    description: "Organizar productos",
  },
  {
    name: "Analíticas",
    href: "/admin/analiticas",
    icon: BarChart3,
    description: "Métricas y reportes",
  },
  {
    name: "Configuración",
    href: "/admin/configuracion",
    icon: Settings,
    description: "Ajustes del sistema",
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div
      className={`bg-card border-r border-border shadow-lg transition-all duration-300 ${
        isCollapsed ? "w-16" : "w-72"
      }`}
    >
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div
            className={`flex items-center space-x-3 ${
              isCollapsed ? "justify-center" : ""
            }`}
          >
            <div className="h-8 w-8 bg-gradient-primary rounded-lg flex items-center justify-center shadow-glow">
              <Store className="h-5 w-5 text-primary-foreground" />
            </div>
            {!isCollapsed && (
              <div>
                <h1 className="text-lg font-bold text-foreground text-gradient">
                  La Feria
                </h1>
                <p className="text-xs text-muted-foreground">Panel Admin</p>
              </div>
            )}
          </div>

          {!isCollapsed && (
            <button
              onClick={() => setIsCollapsed(true)}
              className="p-1 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors duration-200"
              aria-label="Contraer sidebar"
            >
              <ChevronDown className="h-4 w-4 rotate-90" />
            </button>
          )}
        </div>

        {isCollapsed && (
          <button
            onClick={() => setIsCollapsed(false)}
            className="mt-2 w-full p-1 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors duration-200"
            aria-label="Expandir sidebar"
          >
            <ChevronDown className="h-4 w-4 -rotate-90 mx-auto" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="p-4">
        <ul className="space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`group flex items-center px-3 py-3 rounded-lg transition-all duration-200 relative overflow-hidden ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  }`}
                  title={isCollapsed ? item.name : undefined}
                >
                  {/* Active indicator */}
                  {isActive && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary-foreground rounded-r-full" />
                  )}

                  <div
                    className={`flex items-center ${
                      isCollapsed ? "justify-center w-full" : "space-x-3"
                    }`}
                  >
                    <item.icon
                      className={`h-5 w-5 ${
                        isActive ? "text-primary-foreground" : ""
                      } transition-transform duration-200 group-hover:scale-110`}
                    />

                    {!isCollapsed && (
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">
                          {item.name}
                        </div>
                        <div
                          className={`text-xs truncate ${
                            isActive
                              ? "text-primary-foreground/80"
                              : "text-muted-foreground"
                          }`}
                        >
                          {item.description}
                        </div>
                      </div>
                    )}
                  </div>

                  {!isCollapsed && !isActive && (
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <TrendingUp className="h-3 w-3 text-muted-foreground" />
                    </div>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      {!isCollapsed && (
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border bg-muted/30">
          <div className="flex items-center space-x-3 p-3 rounded-lg bg-card border border-border">
            <div className="h-8 w-8 bg-success rounded-full flex items-center justify-center">
              <div className="h-2 w-2 bg-success-foreground rounded-full" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-foreground">
                Sistema Activo
              </p>
              <p className="text-xs text-muted-foreground">
                Todos los servicios operativos
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
