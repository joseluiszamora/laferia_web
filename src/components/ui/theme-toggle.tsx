"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, Monitor, Palette, ChevronDown } from "lucide-react";

interface ThemeToggleProps {
  variant?: "default" | "dropdown" | "compact" | "icon-only";
  showLabel?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function ThemeToggle({
  variant = "default",
  showLabel = false,
  className = "",
  size = "md",
}: ThemeToggleProps) {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = () => setIsOpen(false);
    if (isOpen) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [isOpen]);

  if (!mounted) {
    const sizeClasses = {
      sm: "w-7 h-7",
      md: "w-9 h-9",
      lg: "w-11 h-11",
    };
    return (
      <div
        className={`${sizeClasses[size]} rounded-lg border border-border animate-pulse bg-muted`}
      />
    );
  }

  const getIcon = (themeName: string = theme || "system") => {
    const iconSizes = {
      sm: "h-3 w-3",
      md: "h-4 w-4",
      lg: "h-5 w-5",
    };

    switch (themeName) {
      case "light":
        return <Sun className={iconSizes[size]} />;
      case "dark":
        return <Moon className={iconSizes[size]} />;
      case "system":
        return <Monitor className={iconSizes[size]} />;
      default:
        return <Palette className={iconSizes[size]} />;
    }
  };

  const getThemeLabel = (themeName: string) => {
    switch (themeName) {
      case "light":
        return "Claro";
      case "dark":
        return "Oscuro";
      case "system":
        return "Sistema";
      default:
        return "Auto";
    }
  };

  const cycleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
    } else if (theme === "dark") {
      setTheme("system");
    } else {
      setTheme("light");
    }
  };

  const baseButtonClasses =
    "transition-all duration-200 shadow-sm hover:shadow-md group focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background";

  if (variant === "dropdown") {
    return (
      <div className={`relative ${className}`}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(!isOpen);
          }}
          className={`flex items-center space-x-2 px-3 py-2 rounded-lg border border-border bg-card hover:bg-accent hover:text-accent-foreground ${baseButtonClasses}`}
          aria-label="Selector de tema"
          aria-expanded={isOpen}
          aria-haspopup="menu"
        >
          {getIcon()}
          {showLabel && (
            <span className="text-sm font-medium">
              {getThemeLabel(theme || "system")}
            </span>
          )}
          <ChevronDown
            className={`h-3 w-3 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {isOpen && (
          <div className="absolute right-0 top-full mt-2 w-40 bg-popover border border-border rounded-lg shadow-lg z-50 overflow-hidden animate-in slide-in-from-top-2 duration-200">
            {["light", "dark", "system"].map((themeName) => (
              <button
                key={themeName}
                onClick={(e) => {
                  e.stopPropagation();
                  setTheme(themeName);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 text-sm hover:bg-accent hover:text-accent-foreground transition-colors duration-150 ${
                  theme === themeName
                    ? "bg-accent text-accent-foreground font-medium"
                    : "text-popover-foreground"
                }`}
                role="menuitem"
              >
                {getIcon(themeName)}
                <span>{getThemeLabel(themeName)}</span>
                {theme === themeName && (
                  <div className="ml-auto w-2 h-2 rounded-full bg-primary" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (variant === "icon-only" || variant === "compact") {
    const sizeClasses = {
      sm: "w-7 h-7",
      md: "w-9 h-9",
      lg: "w-11 h-11",
    };

    return (
      <button
        onClick={cycleTheme}
        className={`${sizeClasses[size]} rounded-lg border border-border bg-card hover:bg-accent hover:text-accent-foreground flex items-center justify-center ${baseButtonClasses} ${className}`}
        aria-label={`Tema actual: ${getThemeLabel(
          theme || "system"
        )}. Clic para cambiar.`}
        title={`Cambiar tema (actual: ${getThemeLabel(theme || "system")})`}
      >
        <div className="transform group-hover:scale-110 transition-transform duration-200">
          {getIcon()}
        </div>
      </button>
    );
  }

  // Variant por defecto
  return (
    <button
      onClick={cycleTheme}
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg border border-border bg-card hover:bg-accent hover:text-accent-foreground ${baseButtonClasses} ${className}`}
      aria-label={`Tema actual: ${getThemeLabel(
        theme || "system"
      )}. Clic para cambiar.`}
    >
      <div className="transform group-hover:scale-110 transition-transform duration-200">
        {getIcon()}
      </div>
      {showLabel && (
        <span className="text-sm font-medium">
          {getThemeLabel(theme || "system")}
        </span>
      )}
    </button>
  );
}

// Componente alternativo con select simple
export function ThemeSelect({ className = "" }: { className?: string }) {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-24 h-9 rounded-lg border border-border animate-pulse bg-muted" />
    );
  }

  return (
    <select
      value={theme}
      onChange={(e) => setTheme(e.target.value)}
      className={`text-sm rounded-lg border border-border bg-card text-foreground px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background hover:bg-accent transition-colors ${className}`}
      aria-label="Selector de tema"
    >
      <option value="light">☀️ Claro</option>
      <option value="dark">🌙 Oscuro</option>
      <option value="system">💻 Sistema</option>
    </select>
  );
}
