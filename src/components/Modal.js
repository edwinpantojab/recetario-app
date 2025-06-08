import React, { useCallback, useEffect } from "react";
import { X } from "lucide-react";

/**
 * Modal
 * Componente modal genérico y reutilizable optimizado.
 * Muestra contenido en una ventana emergente centrada con funcionalidades avanzadas.
 *
 * Características:
 * - Renderizado condicional optimizado
 * - Manejo de teclado (Escape para cerrar)
 * - Prevención de scroll del body cuando está abierto
 * - Cierre al hacer clic en el overlay
 * - Accesibilidad mejorada con ARIA
 * - Animaciones suaves
 *
 * @param {Object} props - Propiedades del componente
 * @param {boolean} props.isOpen - Controla la visibilidad del modal
 * @param {Function} props.onClose - Función para cerrar el modal
 * @param {string} props.title - Título mostrado en el encabezado
 * @param {React.ReactNode} props.children - Contenido del modal
 * @param {Function} [props.onKeyDown] - Manejador adicional de teclas (opcional)
 * @returns {JSX.Element|null} El componente modal o null si está cerrado
 */
const Modal = ({ isOpen, onClose, title, children, onKeyDown }) => {
  // Manejador optimizado para cerrar el modal
  const handleClose = useCallback(() => {
    if (onClose) {
      onClose();
    }
  }, [onClose]);

  // Manejador para cerrar al hacer clic en el overlay
  const handleOverlayClick = useCallback(
    event => {
      // Solo cierra si se hace clic directamente en el overlay, no en el contenido
      if (event.target === event.currentTarget) {
        handleClose();
      }
    },
    [handleClose]
  );

  // Manejador de teclado para accesibilidad
  const handleKeyDown = useCallback(
    event => {
      // Maneja la tecla Escape para cerrar el modal
      if (event.key === "Escape") {
        handleClose();
      }

      // Ejecuta manejador adicional si se proporciona
      if (onKeyDown) {
        onKeyDown(event);
      }
    },
    [handleClose, onKeyDown]
  );
  // Efecto para manejar el scroll del body y eventos de teclado
  useEffect(() => {
    if (isOpen) {
      // Guarda el estado actual del overflow del body
      const originalOverflow = document.body.style.overflow;

      // Previene el scroll del body cuando el modal está abierto
      document.body.style.overflow = "hidden";

      // Añade listener para el teclado
      document.addEventListener("keydown", handleKeyDown);

      // Función de limpieza que restaura el estado original
      return () => {
        document.body.style.overflow = originalOverflow || "auto";
        document.removeEventListener("keydown", handleKeyDown);
      };
    } else {
      // Asegura que el scroll esté habilitado cuando el modal no está abierto
      document.body.style.overflow = "auto";
    }
  }, [isOpen, handleKeyDown]);

  // Renderizado condicional optimizado
  if (!isOpen) return null;
  return (
    // Overlay principal con backdrop blur y centrado
    <div
      className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex justify-center items-center z-50 p-4 animate-in fade-in duration-200"
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby="modal-content"
    >
      {" "}
      {/* Contenedor del modal con animación de entrada y scroll mejorado */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] min-h-0 flex flex-col animate-in zoom-in-95 duration-200 overflow-hidden">
        {/* Encabezado del modal - fijo en la parte superior */}
        <header className="flex justify-between items-center p-6 pb-4 border-b border-slate-200 dark:border-slate-600 flex-shrink-0">
          <h2
            id="modal-title"
            className="text-2xl font-bold text-emerald-700 dark:text-emerald-400 pr-8"
          >
            {title}
          </h2>

          {/* Botón de cierre optimizado */}
          <button
            type="button"
            onClick={handleClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-all duration-200 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 flex-shrink-0"
            aria-label="Cerrar modal"
          >
            <X size={24} />
          </button>
        </header>

        {/* Contenido principal del modal - con scroll independiente mejorado */}
        <main
          id="modal-content"
          className="flex-1 min-h-0 p-6 pt-4 overflow-y-auto overflow-x-hidden custom-scrollbar focus:outline-none"
          tabIndex={-1}
          style={{
            maxHeight: "calc(90vh - 100px)",
            overflowY: "auto",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
};

// Exporta el componente memoizado con comparación personalizada
export default React.memo(Modal, (prevProps, nextProps) => {
  // Comparación optimizada para evitar re-renders innecesarios
  return (
    prevProps.isOpen === nextProps.isOpen &&
    prevProps.title === nextProps.title &&
    prevProps.children === nextProps.children
  );
});
