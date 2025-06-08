import React, { useState, useCallback, useMemo, useRef } from "react";
import { Copy, Check, Share2, ExternalLink } from "lucide-react";
import Modal from "./Modal";

/**
 * @fileoverview Componente ShareModal para compartir recetas
 * Modal optimizado con sistema de copia al portapapeles y feedback visual
 * @author Sistema de gestión de recetas
 * @version 1.0.0
 */

/**
 * ShareModal
 * Componente optimizado que muestra un modal para compartir recetas.
 * Permite copiar enlaces al portapapeles con feedback visual y fallbacks.
 *
 * Características:
 * - Copia moderna con navigator.clipboard y fallback a execCommand
 * - Feedback visual inmediato con cambio de ícono
 * - Detección automática de contexto seguro
 * - Responsive design con texto truncado
 * - Memoización para evitar re-renders innecesarios
 * - Accesibilidad mejorada con ARIA labels
 *
 * @param {Object} props - Propiedades del componente
 * @param {boolean} props.isOpen - Si el modal está abierto
 * @param {Function} props.onClose - Función para cerrar el modal
 * @param {string} props.shareUrl - URL o código a compartir
 * @param {string} [props.title] - Título personalizado del modal
 * @param {Function} [props.showToast] - Función para mostrar notificaciones
 * @returns {JSX.Element} Componente de modal para compartir
 */
const ShareModal = ({
  isOpen,
  onClose,
  shareUrl,
  title = "Compartir Receta",
  showToast,
}) => {
  // Estado para feedback visual del botón de copia
  const [isCopied, setIsCopied] = useState(false);

  // Referencia para limpiar timeout
  const timeoutRef = useRef(null);

  // Función helper para fallback de copia
  const copyTextFallback = useCallback(text => {
    return new Promise((resolve, reject) => {
      // Crear elemento textarea temporal
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      textArea.setAttribute("readonly", "");
      textArea.setAttribute("contenteditable", "true");

      document.body.appendChild(textArea);

      try {
        // Seleccionar y copiar texto
        textArea.select();
        textArea.setSelectionRange(0, text.length);

        const successful = document.execCommand("copy");
        if (!successful) {
          throw new Error("execCommand falló");
        }
        resolve();
      } catch (error) {
        reject(error);
      } finally {
        // Limpiar elemento temporal
        document.body.removeChild(textArea);
      }
    });
  }, []);

  // Función optimizada para copiar al portapapeles
  const handleCopyToClipboard = useCallback(async () => {
    if (!shareUrl?.trim()) {
      showToast?.("No hay contenido para copiar", "warning");
      return;
    }

    try {
      // Método moderno: Clipboard API (contextos seguros)
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        // Fallback para navegadores antiguos o contextos no seguros
        await copyTextFallback(shareUrl);
      }

      // Feedback visual y notificación de éxito
      setIsCopied(true);
      showToast?.("¡Enlace copiado al portapapeles!", "success");

      // Limpiar timeout anterior si existe
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Resetear estado visual después de 2 segundos
      timeoutRef.current = setTimeout(() => {
        setIsCopied(false);
        timeoutRef.current = null;
      }, 2000);
    } catch (error) {
      console.error("Error copiando al portapapeles:", error); // eslint-disable-line no-console
      showToast?.("No se pudo copiar el enlace", "error");
    }
  }, [shareUrl, showToast, copyTextFallback]);

  // Función para abrir enlace en nueva pestaña
  const handleOpenLink = useCallback(() => {
    if (shareUrl?.trim()) {
      window.open(shareUrl, "_blank", "noopener,noreferrer");
    }
  }, [shareUrl]);

  // Determinar si el shareUrl es una URL válida
  const isValidUrl = useMemo(() => {
    if (!shareUrl) return false;
    try {
      new URL(shareUrl);
      return true;
    } catch {
      return false;
    }
  }, [shareUrl]);

  // Ícono del botón de copia memoizado
  const copyButtonIcon = useMemo(() => {
    return isCopied ? (
      <Check size={16} className="text-green-600" aria-hidden="true" />
    ) : (
      <Copy size={16} aria-hidden="true" />
    );
  }, [isCopied]);

  // Texto del botón de copia memoizado
  const copyButtonText = useMemo(() => {
    return isCopied ? "¡Copiado!" : "Copiar";
  }, [isCopied]);

  // Clases del botón de copia memoizadas
  const copyButtonClasses = useMemo(() => {
    const baseClasses =
      "flex items-center gap-2 px-3 py-2 rounded-md font-medium text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";
    const stateClasses = isCopied
      ? "bg-green-100 text-green-700 hover:bg-green-200 focus:ring-green-500"
      : "bg-emerald-500 text-white hover:bg-emerald-600 focus:ring-emerald-500";

    return `${baseClasses} ${stateClasses}`;
  }, [isCopied]);

  // Contenido principal del modal memoizado
  const modalContent = useMemo(
    () => (
      <div className="space-y-4">
        {/* Descripción del modal */}
        <div className="text-center text-slate-700 dark:text-slate-300">
          <div className="flex items-center justify-center mb-3">
            <Share2
              size={24}
              className="text-emerald-500 mr-2"
              aria-hidden="true"
            />
            <p className="text-lg font-medium">
              {isValidUrl ? "Comparte este enlace" : "Comparte este código"}
            </p>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {isValidUrl
              ? "Otros usuarios podrán ver tu receta directamente"
              : "Otros usuarios podrán importar tu receta con este código"}
          </p>
        </div>
        {/* Área del enlace/código */}{" "}
        <div className="bg-gradient-to-br from-slate-50 to-emerald-50 dark:from-slate-800/60 dark:to-slate-700/40 border border-slate-200 dark:border-emerald-400/30 rounded-lg p-4 backdrop-blur-sm">
          <div className="flex items-center justify-between gap-3">
            {/* Contenido del enlace */}
            <div className="flex-1 min-w-0">
              <p className="font-mono text-sm text-slate-800 dark:text-slate-200 break-all leading-relaxed">
                {shareUrl}
              </p>
            </div>

            {/* Botones de acción */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {/* Botón para abrir enlace (solo si es URL válida) */}
              {isValidUrl && (
                <button
                  onClick={handleOpenLink}
                  className="p-2 text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
                  title="Abrir enlace en nueva pestaña"
                  aria-label="Abrir enlace en nueva pestaña"
                >
                  <ExternalLink size={16} />
                </button>
              )}

              {/* Botón de copia */}
              <button
                onClick={handleCopyToClipboard}
                className={copyButtonClasses}
                disabled={isCopied}
                aria-label={
                  isCopied ? "Enlace copiado" : "Copiar enlace al portapapeles"
                }
              >
                {copyButtonIcon}
                <span>{copyButtonText}</span>
              </button>
            </div>
          </div>
        </div>
        {/* Nota informativa */}
        <div className="text-xs text-slate-500 dark:text-slate-400 text-center bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
          <p className="flex items-center justify-center">
            <span className="mr-2" aria-hidden="true">
              💡
            </span>
            {isValidUrl
              ? "Asegúrate de que la receta esté disponible públicamente"
              : "El destinatario necesitará la función de importar para usar este código"}
          </p>
        </div>
        {/* Botones de acción del modal */}
        <div className="flex justify-end pt-2 border-t border-slate-200 dark:border-slate-600">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-medium rounded-lg shadow-sm bg-slate-200 hover:bg-slate-300 dark:bg-slate-600 dark:text-slate-200 dark:hover:bg-slate-500 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
          >
            Cerrar
          </button>
        </div>
      </div>
    ),
    [
      isValidUrl,
      shareUrl,
      copyButtonClasses,
      copyButtonIcon,
      copyButtonText,
      isCopied,
      handleCopyToClipboard,
      handleOpenLink,
      onClose,
    ]
  );

  // Limpiar timeout al desmontar el componente
  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      {modalContent}
    </Modal>
  );
};

// Memoización con comparación personalizada para optimizar renders
export default React.memo(ShareModal, (prevProps, nextProps) => {
  return (
    prevProps.isOpen === nextProps.isOpen &&
    prevProps.shareUrl === nextProps.shareUrl &&
    prevProps.title === nextProps.title
  );
});
