"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, Monitor } from "lucide-react";

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Render a placeholder button to avoid hydration issues
    return (
      <div className="w-9 h-9 rounded-md border border-gray-300 dark:border-gray-600 animate-pulse bg-gray-100 dark:bg-gray-800" />
    );
  }

  const cycleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
    } else if (theme === "dark") {
      setTheme("system");
    } else {
      setTheme("light");
    }
  };

  const getIcon = () => {
    switch (theme) {
      case "light":
        return <Sun className="h-4 w-4" />;
      case "dark":
        return <Moon className="h-4 w-4" />;
      case "system":
        return <Monitor className="h-4 w-4" />;
      default:
        return <Sun className="h-4 w-4" />;
    }
  };

  const getTooltip = () => {
    switch (theme) {
      case "light":
        return "Cambiar a tema oscuro";
      case "dark":
        return "Cambiar a tema del sistema";
      case "system":
        return "Cambiar a tema claro";
      default:
        return "Cambiar tema";
    }
  };

  return (
    <button
      onClick={cycleTheme}
      className="inline-flex items-center justify-center rounded-md w-9 h-9 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors"
      title={getTooltip()}
      aria-label={getTooltip()}
    >
      {getIcon()}
    </button>
  );
}

// Componente alternativo con dropdown
export function ThemeSelect() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-20 h-8 rounded-md border border-gray-300 dark:border-gray-600 animate-pulse bg-gray-100 dark:bg-gray-800" />
    );
  }

  return (
    <select
      value={theme}
      onChange={(e) => setTheme(e.target.value)}
      className="text-sm rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    >
      <option value="light">Claro</option>
      <option value="dark">Oscuro</option>
      <option value="system">Sistema</option>
    </select>
  );
}
