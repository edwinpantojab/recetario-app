import React, { useCallback } from "react";
import { Sun, Moon } from "lucide-react";

/**
 * Componente ThemeToggle - Botón para alternar entre tema claro y oscuro.
 *
 * Características:
 * - Optimizado con React.memo para evitar re-renders innecesarios
 * - Usa useCallback para optimizar la función de toggle
 * - Transiciones suaves CSS para mejor UX
 * - Accesibilidad mejorada con ARIA
 * - Estilos condicionales optimizados
 *
 * @param {Object} props - Propiedades del componente
 * @param {'light' | 'dark'} props.theme - Tema actual de la aplicación
 * @param {Function} props.toggleTheme - Función para cambiar el tema
 * @returns {JSX.Element} Botón de toggle de tema
 */
const ThemeToggle = ({ theme, toggleTheme }) => {
  // Optimización: Envolver toggleTheme en useCallback para evitar recreaciones
  const handleToggle = useCallback(() => {
    toggleTheme?.();
  }, [toggleTheme]);

  // Determinar si el tema actual es oscuro
  const isDarkTheme = theme === "dark";

  // Configuración de estilos optimizada - evita duplicación de clases
  const baseClasses =
    "p-2 rounded-full transition-all duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1";

  const themeClasses = isDarkTheme
    ? "bg-emerald-800 text-yellow-300 hover:bg-emerald-700 hover:shadow-lg"
    : "bg-white text-emerald-700 hover:bg-emerald-100 border border-emerald-200 hover:shadow-lg";

  return (
    <button
      onClick={handleToggle}
      aria-label={`Cambiar a tema ${isDarkTheme ? "claro" : "oscuro"}`}
      aria-pressed={isDarkTheme}
      className={`${baseClasses} ${themeClasses}`}
      type="button"
    >
      {/* 
        Renderizado condicional del ícono:
        - Sol: cuando el tema es oscuro (indica que al hacer clic cambiará a claro)
        - Luna: cuando el tema es claro (indica que al hacer clic cambiará a oscuro)
      */}
      {isDarkTheme ? (
        <Sun
          size={18}
          aria-hidden="true"
          className="transition-transform duration-200 hover:scale-110"
        />
      ) : (
        <Moon
          size={18}
          aria-hidden="true"
          className="transition-transform duration-200 hover:scale-110"
        />
      )}
    </button>
  );
};

// Memoización del componente para optimización de rendimiento
// Solo se re-renderiza si 'theme' o 'toggleTheme' cambian
export default React.memo(ThemeToggle, (prevProps, nextProps) => {
  return (
    prevProps.theme === nextProps.theme &&
    prevProps.toggleTheme === nextProps.toggleTheme
  );
});
