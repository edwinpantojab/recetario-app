/**
 * @fileoverview Componente NavButton para navegación principal
 * Botón optimizado con memoización y accesibilidad mejorada
 * @author Sistema de gestión de recetas
 * @version 1.0.0
 */

import React, { memo, useCallback, useMemo } from "react";

/**
 * Configuración de estilos para el botón de navegación
 * Constante inmutable para evitar recreación en cada render
 */
const BUTTON_STYLES = {
  base: "flex flex-1 flex-col items-center justify-center text-center px-2 py-1.5 sm:px-3 sm:py-2 rounded-xl font-semibold transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 min-h-[3rem] sm:min-h-[3.5rem] disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md",
  active:
    "bg-white text-emerald-700 shadow-lg font-bold transform scale-105 ring-2 ring-emerald-300 ring-offset-2",
  inactive:
    "text-emerald-100 hover:bg-emerald-500/80 dark:hover:bg-emerald-600/80 hover:transform hover:scale-102 hover:shadow-md bg-emerald-700/30 hover:bg-emerald-600/50 border border-emerald-500/30",
};

/**
 * Componente NavButton para la barra de navegación principal
 * Memoizado para optimizar rendimiento y evitar re-renders innecesarios
 *
 * @param {Object} props - Propiedades del componente
 * @param {React.ReactNode} props.icon - Ícono a mostrar (componente Lucide React)
 * @param {string[]} props.textLines - Array de strings para el texto del botón
 * @param {boolean} props.isActive - Indica si el botón está activo
 * @param {Function} props.onClick - Función ejecutada al hacer clic
 * @param {string} [props.ariaLabel] - Etiqueta ARIA para accesibilidad
 * @param {boolean} [props.disabled] - Si el botón está deshabilitado
 * @param {string} [props.testId] - ID para testing
 * @returns {JSX.Element} Componente NavButton
 */
const NavButton = memo(
  ({
    icon,
    textLines,
    isActive = false,
    onClick,
    ariaLabel,
    disabled = false,
    testId,
  }) => {
    // Callback memoizado para manejar clics
    const handleClick = useCallback(
      event => {
        if (disabled) {
          event.preventDefault();
          return;
        }
        onClick?.(event);
      },
      [onClick, disabled]
    );

    // Clases CSS memoizadas para evitar cálculos en cada render
    const buttonClasses = useMemo(() => {
      return `${BUTTON_STYLES.base} ${
        isActive ? BUTTON_STYLES.active : BUTTON_STYLES.inactive
      }`;
    }, [isActive]); // Etiqueta ARIA memoizada
    const buttonAriaLabel = useMemo(() => {
      return ariaLabel || textLines.join(" ");
    }, [ariaLabel, textLines]);

    // Propiedades del ícono memoizadas
    const iconProps = useMemo(
      () => ({
        size: icon.props.size || 20,
        className: `
          flex-shrink-0 transition-all duration-300 drop-shadow-sm
          ${icon.props.className || ""} 
          ${
            isActive
              ? "text-emerald-700 drop-shadow-md transform scale-110"
              : "text-emerald-50 hover:text-white hover:scale-110 hover:drop-shadow-md"
          }
        `,
        "aria-hidden": "true",
      }),
      [icon.props.size, icon.props.className, isActive]
    ); // Renderizado del texto del botón memoizado
    const textContent = useMemo(
      () => (
        <div
          className={`text-[11px] sm:text-[12px] leading-tight text-center font-bold tracking-wide transition-all duration-300 ${isActive ? "text-emerald-700 drop-shadow-sm" : "text-emerald-50 group-hover:text-white"}`}
        >
          <span className="inline-block whitespace-nowrap">
            {textLines.join(" ")}
          </span>
        </div>
      ),
      [textLines, isActive]
    );

    return (
      <button
        type="button"
        onClick={handleClick}
        disabled={disabled}
        aria-label={buttonAriaLabel}
        aria-pressed={isActive}
        data-testid={testId}
        className={`${buttonClasses} group relative overflow-hidden`}
      >
        {/* Efecto de brillo sutil en hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>{" "}
        {/* Contenido del botón */}
        <div className="relative z-10 flex flex-col items-center justify-center w-full h-full">
          {/* Ícono con props dinámicas optimizadas */}
          <div className="flex items-center justify-center mb-1">
            {React.cloneElement(icon, iconProps)}
          </div>

          {/* Texto del botón con líneas múltiples */}
          {textContent}
        </div>
      </button>
    );
  },
  (prevProps, nextProps) => {
    // Comparación personalizada para optimizar re-renders
    return (
      prevProps.isActive === nextProps.isActive &&
      prevProps.disabled === nextProps.disabled &&
      prevProps.ariaLabel === nextProps.ariaLabel &&
      prevProps.testId === nextProps.testId &&
      JSON.stringify(prevProps.textLines) ===
        JSON.stringify(nextProps.textLines) &&
      prevProps.icon.type === nextProps.icon.type
    );
  }
);

// Agregar nombre para debugging
NavButton.displayName = "NavButton";

export default NavButton;
