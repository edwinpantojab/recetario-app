import React, { useCallback, useMemo } from "react";
import Modal from "./Modal";
import { AlertTriangle } from "lucide-react";

/**
 * CustomConfirmModal
 * Modal de confirmación reutilizable para acciones críticas.
 * Permite al usuario confirmar o cancelar una acción peligrosa.
 * Utiliza el componente Modal como contenedor base.
 *
 * @param {Object} props - Propiedades del componente
 * @param {boolean} props.isOpen - Controla la visibilidad del modal
 * @param {Function} props.onClose - Función que cierra el modal (cancelar)
 * @param {Function} props.onConfirm - Función que ejecuta la acción de confirmación
 * @param {string} [props.title="Confirmación"] - Título del modal (opcional)
 * @param {string} [props.message="¿Estás seguro?"] - Mensaje de confirmación (opcional)
 * @param {string} [props.confirmButtonText="Confirmar"] - Texto del botón de confirmación (opcional)
 * @param {string} [props.cancelButtonText="Cancelar"] - Texto del botón de cancelar (opcional)
 * @param {string} [props.variant="danger"] - Variante del modal (danger, warning, info)
 * @returns {JSX.Element|null} El modal de confirmación o null si no está abierto
 */
const CustomConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirmación",
  message = "¿Estás seguro?",
  confirmButtonText = "Confirmar",
  cancelButtonText = "Cancelar",
  variant = "danger",
}) => {
  // Estilos memoizados basados en la variante del modal
  const buttonStyles = useMemo(() => {
    const variants = {
      danger: "bg-red-600 hover:bg-red-700 focus:ring-red-500",
      warning: "bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500",
      info: "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500",
    };

    return {
      confirm: `px-4 py-2 text-sm font-medium text-white rounded-lg shadow-sm 
                flex items-center transition-all duration-200 
                focus:outline-none focus:ring-2 focus:ring-offset-2 
                ${variants[variant] || variants.danger}`,
      cancel: `px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 
               hover:bg-slate-200 dark:bg-gradient-to-br dark:from-slate-800/70 dark:to-slate-700/50 dark:text-slate-200 
               dark:hover:bg-slate-600 rounded-lg shadow-sm transition-all 
               duration-200 focus:outline-none focus:ring-2 focus:ring-slate-500 
               focus:ring-offset-2 backdrop-blur-sm border dark:border-slate-600/30`,
    };
  }, [variant]);

  // Manejadores de eventos optimizados con useCallback
  const handleConfirm = useCallback(() => {
    if (onConfirm) {
      onConfirm();
    }
  }, [onConfirm]);

  const handleCancel = useCallback(() => {
    if (onClose) {
      onClose();
    }
  }, [onClose]);

  // Manejo de teclas para accesibilidad
  const handleKeyDown = useCallback(
    event => {
      if (event.key === "Enter") {
        handleConfirm();
      } else if (event.key === "Escape") {
        handleCancel();
      }
    },
    [handleConfirm, handleCancel]
  );

  // Renderizado condicional optimizado
  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      onKeyDown={handleKeyDown}
    >
      {/* Contenedor del mensaje de confirmación con mejor estructura semántica */}
      <div className="text-slate-700 dark:text-slate-300 mb-6">
        <div className="flex items-start space-x-3">
          {/* Ícono de advertencia según la variante */}
          <div className="flex-shrink-0">
            <AlertTriangle
              size={20}
              className={`${
                variant === "danger"
                  ? "text-red-500"
                  : variant === "warning"
                    ? "text-yellow-500"
                    : "text-blue-500"
              }`}
              aria-hidden="true"
            />
          </div>
          {/* Mensaje principal */}
          <div className="flex-1">
            <p className="text-sm leading-relaxed">{message}</p>
          </div>
        </div>
      </div>

      {/* Contenedor de botones de acción con mejor accesibilidad */}
      <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200 dark:border-slate-600">
        {/* Botón Cancelar */}
        <button
          type="button"
          onClick={handleCancel}
          className={buttonStyles.cancel}
          aria-label="Cancelar acción"
        >
          {cancelButtonText}
        </button>

        {/* Botón Confirmar */}
        <button
          type="button"
          onClick={handleConfirm}
          className={buttonStyles.confirm}
          aria-label={`Confirmar: ${message}`}
          autoFocus
        >
          <AlertTriangle size={16} className="mr-2" aria-hidden="true" />
          {confirmButtonText}
        </button>
      </div>
    </Modal>
  );
};

// Exporta el componente memoizado con comparación profunda para optimizar renders
export default React.memo(CustomConfirmModal);
