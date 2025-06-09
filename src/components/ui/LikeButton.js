import React, { memo, useCallback } from "react";
import { Star } from "lucide-react";

/**
 * Componente LikeButton
 * Botón interactivo para dar like a recetas con icono de estrella y contador
 *
 * @param {Object} props - Propiedades del componente
 * @param {string} props.recipeId - ID único de la receta
 * @param {number} props.likesCount - Número de likes de la receta
 * @param {boolean} props.isLiked - Si el usuario ya dio like
 * @param {Function} props.onToggleLike - Función para alternar el like
 * @param {string} [props.size] - Tamaño del botón ('sm', 'md', 'lg')
 * @param {boolean} [props.showCount] - Si mostrar el contador de likes
 * @returns {JSX.Element} Componente de botón de like
 */
const LikeButton = memo(
  ({
    recipeId,
    likesCount,
    isLiked,
    onToggleLike,
    size = "md",
    showCount = true,
  }) => {
    // Configuraciones de tamaño
    const sizeConfig = {
      sm: {
        icon: 14,
        padding: "p-1",
        text: "text-xs",
        gap: "gap-1",
      },
      md: {
        icon: 16,
        padding: "p-1.5",
        text: "text-sm",
        gap: "gap-1.5",
      },
      lg: {
        icon: 18,
        padding: "p-2",
        text: "text-base",
        gap: "gap-2",
      },
    };

    const config = sizeConfig[size];

    // Manejador optimizado para el toggle de like
    const handleToggleLike = useCallback(
      e => {
        e.preventDefault();
        e.stopPropagation();
        if (onToggleLike) {
          onToggleLike(recipeId);
        }
      },
      [recipeId, onToggleLike]
    );

    // Clases CSS dinámicas para el estado del like
    const buttonClasses = `
    recipe-action-button inline-flex items-center ${config.gap} ${config.padding}
    rounded-full transition-all duration-200 focus:outline-none focus:ring-2 
    focus:ring-offset-2 transform hover:scale-110 active:scale-95
    ${
      isLiked
        ? "bg-yellow-100 hover:bg-yellow-200 dark:bg-yellow-800/30 dark:hover:bg-yellow-700/40 focus:ring-yellow-500"
        : "bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 focus:ring-slate-500"
    }
  `.trim();

    const starClasses = `
    transition-all duration-200
    ${
      isLiked
        ? "text-yellow-500 fill-current drop-shadow-sm"
        : "text-slate-400 dark:text-slate-500 hover:text-yellow-400"
    }
  `;

    const countClasses = `
    font-medium transition-colors duration-200 ${config.text}
    ${
      isLiked
        ? "text-yellow-700 dark:text-yellow-300"
        : "text-slate-600 dark:text-slate-400"
    }
  `;

    return (
      <button
        onClick={handleToggleLike}
        className={buttonClasses}
        title={isLiked ? "Quitar me gusta" : "Me gusta"}
        aria-label={`${isLiked ? "Quitar" : "Dar"} me gusta a la receta. ${likesCount} likes actuales`}
        type="button"
      >
        {/* Icono de estrella con animaciones */}
        <Star
          size={config.icon}
          className={starClasses}
          style={{
            filter: isLiked
              ? "drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))"
              : "none",
          }}
        />

        {/* Contador de likes */}
        {showCount && (
          <span className={countClasses} aria-hidden="true">
            {likesCount}
          </span>
        )}
      </button>
    );
  }
);

LikeButton.displayName = "LikeButton";

export default LikeButton;
