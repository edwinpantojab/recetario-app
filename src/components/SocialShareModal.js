import React, { useState, useCallback, useMemo, useRef } from "react";
import {
  Copy,
  Check,
  Share2,
  ExternalLink,
  Facebook,
  Hash,
  MessageCircle,
  Send,
  Smartphone,
} from "lucide-react";
import Modal from "./layout/Modal";

/**
 * @fileoverview Componente SocialShareModal para compartir recetas en redes sociales
 * Modal optimizado con botones para compartir en múltiples plataformas
 * @author Sistema de gestión de recetas
 * @version 2.0.0
 */

/**
 * SocialShareModal
 * Componente avanzado para compartir recetas en redes sociales y apps de mensajería.
 * Incluye botones específicos para cada plataforma con URLs optimizadas.
 *
 * Características:
 * - Compartir en Facebook, Twitter, WhatsApp, Telegram
 * - Copia optimizada al portapapeles
 * - Texto personalizado para cada plataforma
 * - Diseño responsive y accesible
 * - Feedback visual inmediato
 * - URLs con parámetros UTM para tracking
 *
 * @param {Object} props - Propiedades del componente
 * @param {boolean} props.isOpen - Si el modal está abierto
 * @param {Function} props.onClose - Función para cerrar el modal
 * @param {Object} props.recipe - Objeto de la receta a compartir
 * @param {string} props.shareUrl - URL base para compartir
 * @param {Function} [props.showToast] - Función para mostrar notificaciones
 * @returns {JSX.Element} Componente de modal para compartir en redes sociales
 */
const SocialShareModal = ({ isOpen, onClose, recipe, shareUrl, showToast }) => {
  // Estado para feedback visual del botón de copia
  const [isCopied, setIsCopied] = useState(false);
  const timeoutRef = useRef(null);

  // Función helper para fallback de copia
  const copyTextFallback = useCallback(text => {
    return new Promise((resolve, reject) => {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      textArea.setAttribute("readonly", "");

      document.body.appendChild(textArea);

      try {
        textArea.select();
        textArea.setSelectionRange(0, text.length);
        const successful = document.execCommand("copy");
        if (!successful) throw new Error("execCommand falló");
        resolve();
      } catch (error) {
        reject(error);
      } finally {
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
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        await copyTextFallback(shareUrl);
      }

      setIsCopied(true);
      showToast?.("¡Enlace copiado al portapapeles!", "success");

      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setIsCopied(false);
        timeoutRef.current = null;
      }, 2000);
    } catch (error) {
      // Error handling sin console
      showToast?.("No se pudo copiar el enlace", "error");
    }
  }, [shareUrl, showToast, copyTextFallback]);

  // Generar URLs y textos optimizados para cada plataforma
  const socialPlatforms = useMemo(() => {
    if (!recipe || !shareUrl) return [];
    const recipeTitle = recipe.name || "Receta deliciosa";
    const recipeDescription = `${recipeTitle} - Preparación: ${recipe.prepTime || "N/A"} | Porciones: ${recipe.servings || "N/A"}`;
    const encodedDescription = encodeURIComponent(recipeDescription);
    const encodedUrl = encodeURIComponent(shareUrl);

    return [
      {
        name: "Facebook",
        icon: Facebook,
        color: "bg-blue-600 hover:bg-blue-700",
        url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedDescription}`,
        description: "Compartir en Facebook",
      },
      {
        name: "X (Twitter)",
        icon: Hash,
        color: "bg-black hover:bg-gray-800",
        url: `https://x.com/intent/tweet?text=${encodedDescription}&url=${encodedUrl}&hashtags=receta,cocina,RecetarioMagico`,
        description: "Compartir en X",
      },
      {
        name: "WhatsApp",
        icon: MessageCircle,
        color: "bg-green-600 hover:bg-green-700",
        url: `https://wa.me/?text=${encodeURIComponent(`¡Mira esta receta de ${recipeTitle}! ${shareUrl} #receta #cocina #RecetarioMagico`)}`,
        description: "Compartir en WhatsApp",
      },
      {
        name: "Telegram",
        icon: Send,
        color: "bg-blue-500 hover:bg-blue-600",
        url: `https://t.me/share/url?url=${encodedUrl}&text=${encodedDescription}`,
        description: "Compartir en Telegram",
      },
    ];
  }, [recipe, shareUrl]);

  // Función para abrir plataforma social
  const handleSocialShare = useCallback(
    platform => {
      if (platform.url) {
        window.open(
          platform.url,
          "_blank",
          "noopener,noreferrer,width=600,height=400"
        );
        showToast?.(`Compartiendo en ${platform.name}...`, "info");
      }
    },
    [showToast]
  );

  // Función para compartir nativo (Web Share API)
  const handleNativeShare = useCallback(async () => {
    if (!navigator.share) {
      showToast?.("Compartir nativo no disponible", "warning");
      return;
    }

    try {
      await navigator.share({
        title: recipe?.name || "Receta del Recetario Mágico",
        text: `¡Mira esta deliciosa receta de ${recipe?.name || "cocina"}! Preparación: ${recipe?.prepTime || "N/A"} | Porciones: ${recipe?.servings || "N/A"}`,
        url: shareUrl,
      });
      showToast?.("¡Receta compartida exitosamente!", "success");
    } catch (error) {
      if (error.name !== "AbortError") {
        // Error handling sin console
        showToast?.("Error al compartir", "error");
      }
    }
  }, [recipe, shareUrl, showToast]);

  // Verificar si Web Share API está disponible
  const hasNativeShare = useMemo(() => {
    return (
      navigator.share &&
      /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )
    );
  }, []);

  // Limpiar timeout al desmontar
  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  if (!recipe) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Compartir Receta">
      <div className="space-y-6">
        {/* Header con información de la receta */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-3">
            <Share2 size={24} className="text-emerald-500 mr-2" />
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
              {recipe.name}
            </h3>
          </div>{" "}
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Comparte esta deliciosa receta - se abrirá en el Recetario Mágico
          </p>
        </div>
        {/* Botones de redes sociales */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 text-center">
            Compartir en redes sociales
          </h4>

          <div className="grid grid-cols-2 gap-3">
            {socialPlatforms.map(platform => (
              <button
                key={platform.name}
                onClick={() => handleSocialShare(platform)}
                className={`${platform.color} text-white p-3 rounded-lg font-medium text-sm transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-800 flex items-center justify-center gap-2 shadow-md`}
                aria-label={platform.description}
              >
                <platform.icon size={18} />
                <span>{platform.name}</span>
              </button>
            ))}
          </div>

          {/* Botón de compartir nativo para móviles */}
          {hasNativeShare && (
            <button
              onClick={handleNativeShare}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white p-3 rounded-lg font-medium text-sm transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 flex items-center justify-center gap-2 shadow-md"
            >
              <Smartphone size={18} />
              <span>Compartir (Nativo)</span>
            </button>
          )}
        </div>
        {/* Área de enlace directo */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 text-center">
            O copia el enlace directo
          </h4>

          <div className="bg-gradient-to-br from-slate-50 to-emerald-50 dark:from-slate-800/60 dark:to-slate-700/40 border border-slate-200 dark:border-emerald-400/30 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <p className="font-mono text-xs text-slate-700 dark:text-slate-300 break-all leading-relaxed">
                  {shareUrl}
                </p>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => window.open(shareUrl, "_blank")}
                  className="p-2 text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500"
                  title="Abrir enlace"
                >
                  <ExternalLink size={16} />
                </button>

                <button
                  onClick={handleCopyToClipboard}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md font-medium text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    isCopied
                      ? "bg-green-100 text-green-700 hover:bg-green-200 focus:ring-green-500"
                      : "bg-emerald-500 text-white hover:bg-emerald-600 focus:ring-emerald-500"
                  }`}
                  disabled={isCopied}
                >
                  {isCopied ? (
                    <Check size={16} className="text-green-600" />
                  ) : (
                    <Copy size={16} />
                  )}
                  <span>{isCopied ? "¡Copiado!" : "Copiar"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* Información adicional */}{" "}
        <div className="text-xs text-slate-500 dark:text-slate-400 text-center bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
          <p className="flex items-center justify-center">
            <span className="mr-2">🔗</span>
            El enlace abrirá el Recetario Mágico y mostrará automáticamente esta
            receta
          </p>
        </div>
        {/* Botones de acción */}
        <div className="flex justify-end pt-4 border-t border-slate-200 dark:border-slate-600">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-medium rounded-lg shadow-sm bg-slate-200 hover:bg-slate-300 dark:bg-slate-600 dark:text-slate-200 dark:hover:bg-slate-500 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
          >
            Cerrar
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default React.memo(SocialShareModal);
