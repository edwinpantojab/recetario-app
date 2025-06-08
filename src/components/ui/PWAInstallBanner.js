import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Download, X, Shield, Smartphone, Sparkles } from "lucide-react";

/**
 * PWAInstallBanner
 * Banner de bienvenida que aparece como ventana flotante para invitar
 * a los usuarios a instalar la PWA. Se muestra solo en la primera visita
 * o si el usuario no ha tomado una decisión previamente.
 *
 * @param {Object} props - Propiedades del componente
 * @param {boolean} props.isOpen - Controla la visibilidad del banner
 * @param {Function} props.onClose - Función que cierra el banner
 * @param {Function} props.onInstall - Función que maneja la instalación de la PWA
 * @returns {JSX.Element|null} El banner de instalación o null si no está abierto
 */
const PWAInstallBanner = ({ isOpen, onClose, onInstall }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Efecto para manejar la animación de entrada
  useEffect(() => {
    if (isOpen) {
      // Pequeño delay para la animación de entrada
      const timer = setTimeout(() => {
        setIsVisible(true);
        setIsAnimating(true);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setIsAnimating(false);
      // Delay para permitir animación de salida
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Manejadores de eventos optimizados
  const handleInstall = useCallback(() => {
    if (onInstall) {
      onInstall();
    }
  }, [onInstall]);

  const handleClose = useCallback(() => {
    if (onClose) {
      onClose();
    }
  }, [onClose]);

  const handleNotNow = useCallback(() => {
    handleClose();
  }, [handleClose]);

  // Manejo de teclas para accesibilidad
  const handleKeyDown = useCallback(
    event => {
      if (event.key === "Escape") {
        handleClose();
      }
    },
    [handleClose]
  );

  // Estilos memorizados para mejor rendimiento
  const overlayStyles = useMemo(
    () =>
      `fixed inset-0 z-50 flex items-center justify-center p-4 
     bg-black/30 backdrop-blur-sm transition-all duration-300 ease-in-out
     ${isAnimating ? "opacity-100" : "opacity-0 pointer-events-none"}`,
    [isAnimating]
  );

  const bannerStyles = useMemo(
    () =>
      `relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl 
     max-w-md w-full mx-auto transform transition-all duration-300 ease-out
     border border-slate-200 dark:border-slate-700
     ${
       isAnimating
         ? "translate-y-0 scale-100 opacity-100"
         : "translate-y-8 scale-95 opacity-0"
     }`,
    [isAnimating]
  );

  // Prevenir scroll del body cuando el modal está abierto
  useEffect(() => {
    if (isVisible) {
      document.body.style.overflow = "hidden";
      document.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "unset";
      document.removeEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.body.style.overflow = "unset";
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isVisible, handleKeyDown]);

  // No renderizar si no está visible
  if (!isVisible && !isOpen) return null;

  return (
    <div className={overlayStyles} onClick={handleClose}>
      <div
        className={bannerStyles}
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="pwa-banner-title"
        aria-describedby="pwa-banner-description"
      >
        {/* Botón de cerrar */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-full 
                     text-slate-400 hover:text-slate-600 hover:bg-slate-100
                     dark:text-slate-500 dark:hover:text-slate-300 dark:hover:bg-slate-700
                     transition-colors duration-200 focus:outline-none focus:ring-2 
                     focus:ring-emerald-500 focus:ring-offset-2"
          aria-label="Cerrar banner de bienvenida"
        >
          <X size={20} />
        </button>

        {/* Contenido principal */}
        <div className="p-6 pt-12">
          {/* Encabezado con icono */}
          <div className="text-center mb-6">
            <div
              className="inline-flex items-center justify-center w-16 h-16 
                            bg-gradient-to-br from-emerald-500 to-emerald-600 
                            rounded-full mb-4 shadow-lg"
            >
              <Sparkles size={28} className="text-white" />
            </div>
            <h2
              id="pwa-banner-title"
              className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2"
            >
              ¡Bienvenido a Recetario Mágico!
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
              Tu asistente personal de cocina ahora disponible en tu dispositivo
            </p>
          </div>

          {/* Características destacadas */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center space-x-3">
              <div
                className="flex-shrink-0 w-8 h-8 bg-emerald-100 dark:bg-emerald-900/30 
                              rounded-full flex items-center justify-center"
              >
                <Smartphone
                  size={16}
                  className="text-emerald-600 dark:text-emerald-400"
                />
              </div>
              <p className="text-sm text-slate-700 dark:text-slate-300">
                Acceso rápido desde tu pantalla de inicio
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <div
                className="flex-shrink-0 w-8 h-8 bg-emerald-100 dark:bg-emerald-900/30 
                              rounded-full flex items-center justify-center"
              >
                <Download
                  size={16}
                  className="text-emerald-600 dark:text-emerald-400"
                />
              </div>
              <p className="text-sm text-slate-700 dark:text-slate-300">
                Funciona sin conexión, siempre disponible
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <div
                className="flex-shrink-0 w-8 h-8 bg-emerald-100 dark:bg-emerald-900/30 
                              rounded-full flex items-center justify-center"
              >
                <Shield
                  size={16}
                  className="text-emerald-600 dark:text-emerald-400"
                />
              </div>
              <p className="text-sm text-slate-700 dark:text-slate-300">
                <strong>No recopilamos datos personales</strong> - Tu privacidad
                es importante
              </p>
            </div>
          </div>

          {/* Mensaje principal */}
          <div
            id="pwa-banner-description"
            className="bg-gradient-to-r from-emerald-50 to-emerald-100 
                       dark:from-emerald-900/20 dark:to-emerald-800/20 
                       rounded-lg p-4 mb-6 border border-emerald-200 dark:border-emerald-700/30"
          >
            <p className="text-sm text-emerald-800 dark:text-emerald-200 text-center leading-relaxed">
              ¿Te gustaría instalar la aplicación en tu dispositivo para tener
              acceso rápido y una experiencia mejorada?
            </p>
          </div>

          {/* Botones de acción */}
          <div className="space-y-3">
            <button
              onClick={handleInstall}
              className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 
                         hover:from-emerald-700 hover:to-emerald-800 
                         text-white font-medium py-3 px-4 rounded-lg 
                         shadow-lg hover:shadow-xl transform hover:scale-[1.02]
                         transition-all duration-200 ease-out
                         focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2
                         flex items-center justify-center space-x-2"
              aria-label="Instalar aplicación"
            >
              <Download size={18} />
              <span>Sí, instalar aplicación</span>
            </button>

            <button
              onClick={handleNotNow}
              className="w-full bg-slate-100 hover:bg-slate-200 
                         dark:bg-slate-700 dark:hover:bg-slate-600
                         text-slate-700 dark:text-slate-300 
                         font-medium py-3 px-4 rounded-lg 
                         transition-all duration-200
                         focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
              aria-label="Continuar sin instalar"
            >
              Ahora no, continuar en el navegador
            </button>
          </div>

          {/* Nota adicional */}
          <p className="text-xs text-slate-500 dark:text-slate-400 text-center mt-4">
            Puedes instalar la aplicación más tarde desde el menú de tu
            navegador
          </p>
        </div>
      </div>
    </div>
  );
};

export default React.memo(PWAInstallBanner);
