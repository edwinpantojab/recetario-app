import React, { useMemo } from "react";
import { ChefHat } from "lucide-react";

/**
 * Footer
 * Componente de pie de página optimizado que muestra información de copyright
 * y branding de la aplicación Recetario Mágico.
 *
 * Características:
 * - Posición fija en la parte inferior de la pantalla
 * - Responsive design para móviles y desktop
 * - Año dinámico actualizado automáticamente
 * - Optimizado para evitar re-renders innecesarios
 * - Soporte para modo oscuro
 *
 * @returns {JSX.Element} Componente de pie de página
 */
const Footer = () => {
  // Año actual memoizado para evitar cálculos innecesarios en cada render
  const currentYear = useMemo(() => new Date().getFullYear(), []);

  return (
    <footer
      className="w-full bg-slate-900 border-t border-emerald-700 py-2 fixed bottom-0 left-0 z-40"
      role="contentinfo"
      aria-label="Pie de página de la aplicación"
    >
      <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 text-emerald-400 font-semibold text-xs sm:text-sm tracking-wide select-none px-2 text-center break-words">
        {/* Ícono principal de la aplicación */}
        <ChefHat
          size={22}
          className="text-emerald-400 drop-shadow"
          aria-hidden="true"
        />

        {/* Texto de copyright y créditos */}
        <span className="font-semibold text-emerald-200 dark:text-emerald-400">
          © {currentYear} derechos reservados | Recetario Mágico by{" "}
          <span className="text-white dark:text-emerald-300 font-bold">
            Axon.net &amp; IA
          </span>
        </span>
      </div>
    </footer>
  );
};

// Exporta el componente memoizado para prevenir re-renders innecesarios
// cuando las props del componente padre no han cambiado
export default React.memo(Footer);
