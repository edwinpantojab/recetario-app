/**
 * @fileoverview Componente Toast para notificaciones temporales
 * Muestra mensajes de éxito, error, advertencia e información al usuario
 * @author Sistema de gestión de recetas
 * @version 2.0.0
 */

import React, { useEffect, useCallback, useMemo } from "react";
import { CheckCircle, AlertCircle, Info, X } from "lucide-react";

/**
 * Configuración centralizada de estilos para cada tipo de toast
 * Mejora el rendimiento al calcular estos valores una sola vez
 */
const TOAST_CONFIG = {
  success: {
    bgColor: "bg-emerald-50 dark:bg-emerald-900/20",
    borderColor: "border-emerald-200 dark:border-emerald-700",
    textColor: "text-emerald-800 dark:text-emerald-200",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    icon: CheckCircle,
  },
  error: {
    bgColor: "bg-red-50 dark:bg-red-900/20",
    borderColor: "border-red-200 dark:border-red-700",
    textColor: "text-red-800 dark:text-red-200",
    iconColor: "text-red-600 dark:text-red-400",
    icon: AlertCircle,
  },
  warning: {
    bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
    borderColor: "border-yellow-200 dark:border-yellow-700",
    textColor: "text-yellow-800 dark:text-yellow-200",
    iconColor: "text-yellow-600 dark:text-yellow-400",
    icon: AlertCircle,
  },
  info: {
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
    borderColor: "border-blue-200 dark:border-blue-700",
    textColor: "text-blue-800 dark:text-blue-200",
    iconColor: "text-blue-600 dark:text-blue-400",
    icon: Info,
  },
};

/**
 * Componente Toast optimizado para mostrar notificaciones temporales
 *
 * @param {Object} props - Propiedades del componente
 * @param {string} props.message - Mensaje a mostrar en el toast
 * @param {'success'|'error'|'warning'|'info'} props.type - Tipo de toast que determina el estilo
 * @param {number} props.duration - Duración en ms antes de auto-ocultarse (0 = no auto-ocultar)
 * @param {Function} props.onHide - Callback ejecutado cuando el toast se oculta
 * @returns {JSX.Element|null} Componente Toast o null si no hay mensaje
 */
const Toast = ({ message, type = "success", duration = 2500, onHide }) => {
  // Optimización: Memoiza la función de cierre para evitar recreaciones
  const handleClose = useCallback(() => {
    onHide?.();
  }, [onHide]);

  // Optimización: Memoiza la configuración del toast para evitar recálculos
  const config = useMemo(() => {
    return TOAST_CONFIG[type] || TOAST_CONFIG.success;
  }, [type]);

  // Optimización: Memoiza las clases CSS para evitar concatenaciones repetidas
  const containerClasses = useMemo(() => {
    return `fixed top-4 right-4 z-50 flex items-center p-4 rounded-lg border shadow-lg
            ${config.bgColor} ${config.borderColor} ${config.textColor}
            transform transition-all duration-300 ease-in-out max-w-sm min-w-[280px]
            animate-in slide-in-from-right-full fade-in-0`;
  }, [config]);

  // Optimización: Memoiza las clases del botón de cerrar
  const buttonClasses = useMemo(() => {
    return `ml-3 flex-shrink-0 p-1 rounded-md hover:bg-black/10 dark:hover:bg-white/10
            transition-colors duration-150 ${config.iconColor} focus:outline-none 
            focus:ring-2 focus:ring-offset-1 focus:ring-current`;
  }, [config.iconColor]);

  // Efecto optimizado para auto-ocultar el toast
  useEffect(() => {
    // Solo configura el timer si hay mensaje y duración válida
    if (!message || duration <= 0) return;

    const timer = setTimeout(handleClose, duration);

    // Cleanup del timer al desmontar o cambiar dependencias
    return () => clearTimeout(timer);
  }, [message, duration, handleClose]);

  // Early return optimizado - evita renderizado innecesario
  if (!message) return null;

  // Destructuring optimizado del componente de ícono
  const IconComponent = config.icon;

  return (
    <div
      className={containerClasses}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      {/* Ícono del tipo de mensaje - optimizado con flex-shrink-0 */}
      <IconComponent
        size={20}
        className={`mr-3 flex-shrink-0 ${config.iconColor}`}
        aria-hidden="true"
      />

      {/* Contenido del mensaje - optimizado para accesibilidad */}
      <div
        className="flex-1 text-sm font-medium break-words"
        id="toast-message"
      >
        {message}
      </div>

      {/* Botón de cerrar optimizado con mejor accesibilidad */}
      <button
        onClick={handleClose}
        className={buttonClasses}
        aria-label="Cerrar notificación"
        aria-describedby="toast-message"
        type="button"
      >
        <X size={16} aria-hidden="true" />
      </button>
    </div>
  );
};

// Memoización del componente para optimización de rendimiento
// Solo se re-renderiza si cambian las props relevantes
export default React.memo(Toast, (prevProps, nextProps) => {
  return (
    prevProps.message === nextProps.message &&
    prevProps.type === nextProps.type &&
    prevProps.duration === nextProps.duration &&
    prevProps.onHide === nextProps.onHide
  );
});
