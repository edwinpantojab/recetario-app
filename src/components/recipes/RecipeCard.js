import React, { memo, useCallback, useMemo } from "react";
import {
  ClockIcon,
  Users,
  Edit3,
  Trash2,
  Share2,
  X,
  GripVertical,
} from "lucide-react";
import { useMobileDetection } from "../../hooks/useMobileDetection";
import { useMobileInteraction } from "../../contexts/MobileInteractionContext";

/**
 * Componente RecipeCard
 * Muestra una tarjeta compacta de una receta con sus detalles principales
 * y opciones de interacción optimizada para rendimiento.
 *
 * Características:
 * - Drag & Drop optimizado para planificador
 * - Lazy loading de imágenes con fallback
 * - Estados de selección visual
 * - Acciones contextuales (editar, eliminar, compartir)
 * - Responsive design con truncado de texto
 * - Memoización para evitar re-renders innecesarios
 *
 * @param {Object} props - Propiedades del componente
 * @param {Object} props.recipe - Objeto de la receta a mostrar
 * @param {Function} [props.onEdit] - Función para editar la receta (opcional)
 * @param {Function} [props.onDelete] - Función para eliminar la receta (opcional)
 * @param {Function} [props.onShare] - Función para compartir la receta (opcional)
 * @param {Function} [props.onSelect] - Función para seleccionar la receta (opcional)
 * @param {Function} [props.onShowDetails] - Función para mostrar detalles completos
 * @param {boolean} [props.isSelected] - Indica si la tarjeta está seleccionada
 * @param {boolean} [props.isDraggable] - Indica si la tarjeta es arrastrable
 * @param {boolean} [props.showDeleteButton] - Muestra botón de eliminar pequeño
 * @returns {JSX.Element} Componente de tarjeta de receta
 */
const RecipeCard = memo(
  ({
    recipe,
    onEdit,
    onDelete,
    onShare,
    onSelect,
    onShowDetails,
    isSelected = false,
    isDraggable = false,
    showDeleteButton = false,
  }) => {
    // Detectar dispositivo móvil y obtener contexto de interacción móvil
    const { isTouchDevice } = useMobileDetection();
    const { selectedRecipeForMobile, isAddingToDay, selectRecipeForMobile } =
      useMobileInteraction();

    // Verificar si esta receta está seleccionada para móvil
    const isSelectedForMobile = selectedRecipeForMobile?.id === recipe.id;
    // URL de imagen placeholder memoizada para evitar recreación
    const placeholderImage = useMemo(() => {
      const recipeName = recipe.name || "Receta";
      return `https://placehold.co/600x300/E2E8F0/A0AEC0?text=${encodeURIComponent(
        recipeName
      )}`;
    }, [recipe.name]);

    // Manejador optimizado para inicio de arrastre
    const handleDragStart = useCallback(
      e => {
        if (isDraggable) {
          e.dataTransfer.setData("recipeId", recipe.id);
          e.dataTransfer.effectAllowed = "move";
        }
      },
      [isDraggable, recipe.id]
    ); // Manejador optimizado para clic en tarjeta
    const handleCardClick = useCallback(
      e => {
        // Evita propagación si se hace clic en botones
        if (e.target.closest("button")) return;

        // En dispositivos móviles y modo arrastrable, seleccionar para táctil
        if (isTouchDevice && isDraggable && !isAddingToDay) {
          selectRecipeForMobile(recipe);
          return;
        }

        if (onShowDetails) {
          onShowDetails(recipe);
        } else if (onSelect && !isDraggable) {
          onSelect(recipe);
        }
      },
      [
        onShowDetails,
        onSelect,
        isDraggable,
        recipe,
        isTouchDevice,
        isAddingToDay,
        selectRecipeForMobile,
      ]
    );

    // Manejador optimizado para error de imagen
    const handleImageError = useCallback(
      e => {
        e.target.onerror = null;
        e.target.src = placeholderImage;
      },
      [placeholderImage]
    );

    // Manejadores de acciones memoizados para evitar recreación
    const handleShare = useCallback(
      e => {
        e.stopPropagation();
        onShare?.(recipe);
      },
      [onShare, recipe]
    );

    const handleEdit = useCallback(
      e => {
        e.stopPropagation();
        onEdit?.(recipe);
      },
      [onEdit, recipe]
    );

    const handleDelete = useCallback(
      e => {
        e.stopPropagation();
        onDelete?.(recipe.id);
      },
      [onDelete, recipe.id]
    ); // Clases CSS memoizadas para la tarjeta
    const cardClasses = useMemo(() => {
      const baseClasses =
        "bg-white dark:bg-gradient-to-br dark:from-slate-800/90 dark:to-slate-700/70 rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 backdrop-blur-sm border dark:border-slate-600/30";
      const selectedClasses =
        isSelected || isSelectedForMobile ? "ring-2 ring-emerald-500" : "";
      const cursorClasses = isDraggable
        ? isTouchDevice
          ? "cursor-pointer"
          : "cursor-grab"
        : "cursor-pointer";
      const mobileSelectedClasses = isSelectedForMobile
        ? "bg-emerald-50 dark:bg-emerald-900/20"
        : "";

      return `${baseClasses} ${selectedClasses} ${cursorClasses} ${mobileSelectedClasses}`;
    }, [isSelected, isDraggable, isTouchDevice, isSelectedForMobile]);

    // Información de tiempo y porciones memoizada
    const recipeInfo = useMemo(
      () => (
        <div className="flex items-center text-xs text-slate-600 dark:text-slate-300 mb-2 space-x-2">
          {recipe.prepTime && (
            <div className="flex items-center recipe-action-button">
              <ClockIcon
                size={12}
                className="mr-1"
                aria-hidden="true"
                style={{
                  color: "#059669",
                  stroke: "#059669",
                  strokeWidth: 1.5,
                }}
              />
              <span>{recipe.prepTime}</span>
            </div>
          )}
          {recipe.servings && (
            <div className="flex items-center recipe-action-button">
              <Users
                size={12}
                className="mr-1"
                aria-hidden="true"
                style={{
                  color: "#059669",
                  stroke: "#059669",
                  strokeWidth: 1.5,
                }}
              />
              <span>{recipe.servings} porc.</span>
            </div>
          )}
        </div>
      ),
      [recipe.prepTime, recipe.servings]
    ); // Botones de acción memoizados
    const actionButtons = useMemo(() => {
      if (showDeleteButton || (!onEdit && !onDelete && !onShare)) return null;

      return (
        <div className="mt-3 pt-2 border-t dark:border-slate-600 flex justify-end space-x-1.5">
          {" "}
          {onShare && (
            <button
              onClick={handleShare}
              className="recipe-action-button p-1.5 rounded-full hover:bg-blue-100 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-slate-400 focus:ring-offset-2 transition-colors"
              title="Compartir Receta"
              aria-label={`Compartir receta ${recipe.name}`}
            >
              <Share2
                size={16}
                style={{ color: "#2563eb", stroke: "#2563eb", strokeWidth: 2 }}
              />
            </button>
          )}
          {onEdit && (
            <button
              onClick={handleEdit}
              className="recipe-action-button p-1.5 rounded-full hover:bg-emerald-100 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-slate-400 focus:ring-offset-2 transition-colors"
              title="Editar Receta"
              aria-label={`Editar receta ${recipe.name}`}
            >
              <Edit3
                size={16}
                style={{ color: "#16a34a", stroke: "#16a34a", strokeWidth: 2 }}
              />
            </button>
          )}
          {onDelete && (
            <button
              onClick={handleDelete}
              className="recipe-action-button p-1.5 rounded-full hover:bg-red-100 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-slate-400 focus:ring-offset-2 transition-colors"
              title="Eliminar Receta"
              aria-label={`Eliminar receta ${recipe.name}`}
            >
              <Trash2
                size={16}
                style={{ color: "#dc2626", stroke: "#dc2626", strokeWidth: 2 }}
              />
            </button>
          )}
        </div>
      );
    }, [
      showDeleteButton,
      onEdit,
      onDelete,
      onShare,
      handleShare,
      handleEdit,
      handleDelete,
      recipe.name,
    ]);

    return (
      <article
        className={cardClasses}
        onClick={handleCardClick}
        draggable={isDraggable}
        onDragStart={handleDragStart}
        role={onSelect ? "button" : undefined}
        tabIndex={onSelect ? 0 : undefined}
        aria-selected={isSelected}
        aria-label={`Receta: ${recipe.name}`}
      >
        {" "}
        {/* Imagen de la receta con optimizaciones */}
        <div className="relative bg-slate-100 dark:bg-slate-700 h-32 flex items-center justify-center pt-2">
          <img
            className="w-full h-28 object-contain"
            src={recipe.imageUrl || placeholderImage}
            alt={`Imagen de ${recipe.name}`}
            loading="lazy"
            decoding="async"
            onError={handleImageError}
          />{" "}
          {/* Ícono de arrastre si la tarjeta es arrastrable */}
          {isDraggable && !isTouchDevice && (
            <GripVertical
              size={16}
              className="absolute top-2 right-2 text-white bg-black bg-opacity-50 rounded p-0.5"
              aria-hidden="true"
            />
          )}
          {/* Indicador táctil para móviles */}
          {isDraggable && isTouchDevice && (
            <div className="absolute top-2 right-2 bg-emerald-500 text-white text-xs px-2 py-1 rounded-full font-bold">
              TOCA
            </div>
          )}
          {/* Indicador de selección para móviles */}
          {isSelectedForMobile && (
            <div className="absolute top-2 left-2 bg-emerald-500 text-white text-xs px-2 py-1 rounded-full font-bold">
              ✓ SELECCIONADA
            </div>
          )}
          {/* Botón de eliminar específico para el planificador */}
          {showDeleteButton && onDelete && (
            <button
              onClick={handleDelete}
              className="absolute top-1.5 right-1.5 p-1 bg-red-100 text-red-500 rounded-full hover:bg-red-200 dark:bg-red-800 dark:text-red-300 dark:hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
              title="Quitar receta del día"
              aria-label={`Quitar ${recipe.name} del día`}
            >
              <X size={14} />
            </button>
          )}
        </div>
        {/* Contenido de la tarjeta */}
        <div className="p-3">
          {/* Nombre de la receta */}
          <h3
            className="text-base sm:text-lg font-bold text-emerald-700 dark:text-emerald-300 mb-1 truncate tracking-tight"
            title={recipe.name}
          >
            {recipe.name}
          </h3>

          {/* Categoría de la receta */}
          {recipe.category && (
            <span className="inline-block bg-amber-200 text-amber-800 text-xs font-bold px-2 py-0.5 rounded-full mb-2 tracking-wide truncate max-w-full">
              {recipe.category}
            </span>
          )}

          {/* Información adicional: tiempo y porciones */}
          {recipeInfo}

          {/* Botones de acción */}
          {actionButtons}
        </div>
      </article>
    );
  }
);

// Nombre para debugging
RecipeCard.displayName = "RecipeCard";

// Exporta el componente memoizado con comparación personalizada
export default RecipeCard;
