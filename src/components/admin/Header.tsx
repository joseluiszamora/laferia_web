"use client";

import { useState } from "react";
import {
  Bell,
  Search,
  User,
  Settings,
  LogOut,
  UserCircle,
  Palette,
} from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export function Header() {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [notifications] = useState(3); // Simulado

  return (
    <header className="bg-card/95 border-b border-border shadow-sm sticky top-0 z-30 backdrop-blur-md">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-4">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder="Buscar productos, tiendas..."
              className="pl-10 pr-4 py-2.5 w-64 lg:w-80 bg-background border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-200 text-foreground placeholder:text-muted-foreground hover:border-ring/50 focus-ring"
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Theme Toggle with Dropdown */}
          <ThemeToggle variant="dropdown" className="hidden sm:block" />

          {/* Mobile Theme Toggle */}
          <ThemeToggle variant="icon-only" size="sm" className="sm:hidden" />

          {/* Settings Button */}
          <button
            className="p-2.5 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-all duration-200 focus-ring hover:scale-105"
            aria-label="Configuración"
          >
            <Settings className="h-5 w-5" />
          </button>

          {/* Notifications */}
          <button
            className="relative p-2.5 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-all duration-200 focus-ring hover:scale-105"
            aria-label={`Notificaciones ${
              notifications > 0 ? `(${notifications})` : ""
            }`}
          >
            <Bell className="h-5 w-5" />
            {notifications > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center font-medium animate-pulse">
                {notifications > 9 ? "9+" : notifications}
              </span>
            )}
          </button>

          {/* User Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center space-x-3 pl-3 border-l border-border hover:bg-accent rounded-r-lg pr-3 py-1 transition-all duration-200 focus-ring"
              aria-expanded={isUserMenuOpen}
              aria-haspopup="menu"
            >
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-foreground">
                  Admin User
                </p>
                <p className="text-xs text-muted-foreground">Administrador</p>
              </div>
              <div className="h-9 w-9 bg-gradient-primary rounded-full flex items-center justify-center shadow-sm hover:shadow-glow transition-all duration-200 ring-2 ring-transparent hover:ring-primary/20">
                <User className="h-4 w-4 text-primary-foreground" />
              </div>
            </button>

            {/* User Dropdown Menu */}
            {isUserMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsUserMenuOpen(false)}
                />
                <div className="absolute right-0 top-full mt-2 w-56 bg-popover border border-border rounded-lg shadow-xl z-50 overflow-hidden animate-in slide-in-from-top-2 duration-200">
                  <div className="px-4 py-3 border-b border-border">
                    <p className="text-sm font-medium text-popover-foreground">
                      Admin User
                    </p>
                    <p className="text-xs text-muted-foreground">
                      admin@laferia.com
                    </p>
                  </div>

                  <div className="py-1">
                    <button
                      className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-popover-foreground hover:bg-accent hover:text-accent-foreground transition-colors duration-150 focus-ring"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <UserCircle className="h-4 w-4" />
                      <span>Mi Perfil</span>
                    </button>

                    <button
                      className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-popover-foreground hover:bg-accent hover:text-accent-foreground transition-colors duration-150 focus-ring"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <Settings className="h-4 w-4" />
                      <span>Configuración</span>
                    </button>

                    {/* Mobile Theme Toggle in Menu */}
                    <div className="sm:hidden px-4 py-2.5">
                      <div className="flex items-center space-x-3">
                        <Palette className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-popover-foreground">
                          Tema
                        </span>
                        <div className="ml-auto">
                          <ThemeToggle variant="compact" size="sm" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-border py-1">
                    <button
                      className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-destructive hover:bg-destructive/10 transition-colors duration-150 focus-ring"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Cerrar Sesión</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
