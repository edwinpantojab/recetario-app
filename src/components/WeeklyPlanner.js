import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Utensils,
  RotateCcw,
  AlertTriangle,
  ClockIcon,
  Users,
} from "lucide-react";
import RecipeCard from "./recipes/RecipeCard"; // Corregido: Se movió a la subcarpeta recipes
import Modal from "./layout/Modal"; // Corregido: Se movió a la subcarpeta layout
import { saveData, loadData } from "../data/localStorageHelpers";
import { useMobileDetection } from "../hooks/useMobileDetection";
import { useMobileInteraction } from "../contexts/MobileInteractionContext";
import MobileInstructions from "./mobile/MobileInstructions";
import { trackRecipeEvent } from "../utils/analytics";

// Constantes optimizadas para mejor rendimiento
const DAYS_OF_WEEK = [
  "lunes",
  "martes",
  "miercoles",
  "jueves",
  "viernes",
  "sabado",
  "domingo",
];

const DAY_TRANSLATIONS = {
  lunes: "Lunes",
  martes: "Martes",
  miercoles: "Miércoles",
  jueves: "Jueves",
  viernes: "Viernes",
  sabado: "Sábado",
  domingo: "Domingo",
};

const LOCAL_STORAGE_KEY = "weeklyPlan";

/**
 * Utilidades para localStorage optimizadas
 * Evita recreaciones innecesarias del plan vacío
 */
const getEmptyPlan = () => {
  const emptyPlan = {};
  DAYS_OF_WEEK.forEach(day => {
    emptyPlan[day] = [];
  });
  return emptyPlan;
};

const getLocalWeeklyPlan = () => loadData(LOCAL_STORAGE_KEY, getEmptyPlan());
const setLocalWeeklyPlan = plan => saveData(LOCAL_STORAGE_KEY, plan);

/**
 * Componente DayColumn memoizado para evitar renders innecesarios
 * Representa una columna de día en el planificador semanal
 */
const DayColumn = React.memo(
  ({
    day,
    recipesForThisDay,
    allUserRecipes,
    onDropRecipe,
    onDragOverDay,
    onRemoveRecipeFromDay,
    onRotateRecipeForDay,
    onShowRecipeDetails,
    onMobileTapDay,
    isHighlightedForMobile,
  }) => {
    const dayKey = day.toLowerCase();
    const { isTouchDevice } = useMobileDetection();

    // Manejador optimizado para el evento 'drop'
    const handleDrop = useCallback(
      e => {
        e.preventDefault();
        const recipeId = e.dataTransfer.getData("recipeId");
        if (recipeId) {
          onDropRecipe(dayKey, recipeId);
        }
      },
      [dayKey, onDropRecipe]
    ); // Manejador optimizado para rotar recetas
    const handleRotateClick = useCallback(() => {
      onRotateRecipeForDay(dayKey);
    }, [dayKey, onRotateRecipeForDay]);

    // Manejador para toque en dispositivos móviles
    const handleMobileTap = useCallback(() => {
      if (isTouchDevice && onMobileTapDay) {
        onMobileTapDay(dayKey);
      }
    }, [dayKey, onMobileTapDay, isTouchDevice]);

    // Memoiza la traducción del día
    const dayTitle = useMemo(() => DAY_TRANSLATIONS[dayKey], [dayKey]);

    // Clases CSS dinámicas para el día
    const dayColumnClasses = useMemo(() => {
      const baseClasses =
        "bg-slate-50 dark:bg-slate-800 p-4 rounded-xl shadow-md min-h-[250px] flex flex-col border dark:border-slate-700 hover:shadow-lg transition-all duration-200";
      const highlightClasses = isHighlightedForMobile
        ? "ring-2 ring-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 transform scale-105"
        : "";
      const mobileClasses =
        isTouchDevice && isHighlightedForMobile ? "cursor-pointer" : "";

      return `${baseClasses} ${highlightClasses} ${mobileClasses}`;
    }, [isHighlightedForMobile, isTouchDevice]);
    return (
      <div
        className={dayColumnClasses}
        onDrop={handleDrop}
        onDragOver={onDragOverDay}
        onClick={handleMobileTap}
      >
        {" "}
        {/* Encabezado optimizado de la columna del día */}
        <div className="flex justify-between items-center mb-4 pb-2 border-b-2 border-emerald-200 dark:border-emerald-700">
          <h3 className="text-xl font-semibold text-emerald-700 dark:text-emerald-400">
            {dayTitle}
            {isHighlightedForMobile && (
              <span className="ml-2 text-sm bg-emerald-500 text-white px-2 py-1 rounded-full">
                TOCA AQUÍ
              </span>
            )}
          </h3>
          <button
            onClick={handleRotateClick}
            title={`Rotar receta para ${dayTitle}`}
            className="p-1.5 text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 rounded-full hover:bg-indigo-100 dark:hover:bg-slate-700 transition-colors duration-150"
            disabled={allUserRecipes.length === 0}
            type="button"
          >
            <RotateCcw size={18} />
          </button>
        </div>
        {/* Contenedor optimizado de recetas */}
        <div className="space-y-3 flex-grow custom-scrollbar overflow-y-auto max-h-[400px] p-1 -m-1">
          {recipesForThisDay.length > 0 ? (
            recipesForThisDay.map(recipeId => {
              const recipeDetails = allUserRecipes.find(r => r.id === recipeId);

              if (!recipeDetails) {
                return (
                  <div
                    key={recipeId}
                    className="text-xs text-red-500 p-2 bg-red-50 dark:bg-red-900/50 rounded-md flex items-center"
                  >
                    <AlertTriangle size={16} className="mr-2 flex-shrink-0" />
                    <span>
                      ID de receta no encontrado: {recipeId.substring(0, 8)}...
                    </span>
                  </div>
                );
              }

              return (
                <RecipeCard
                  key={recipeId}
                  recipe={recipeDetails}
                  onShowDetails={onShowRecipeDetails}
                  isDraggable={false}
                  showDeleteButton={true}
                  onDelete={() => onRemoveRecipeFromDay(dayKey, recipeId)}
                />
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center py-8">
              <Utensils
                size={32}
                className="text-slate-400 dark:text-slate-500 mb-2"
              />
              <p className="text-sm text-slate-400 dark:text-slate-500">
                {isTouchDevice
                  ? "Toca una receta y luego este día"
                  : "Arrastra recetas aquí"}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }
);

/**
 * Modal de detalles de receta optimizado
 * Componente reutilizable para mostrar información detallada de recetas
 */
const RecipeDetailsModal = React.memo(({ recipe, onClose }) => {
  // Función auxiliar para crear placeholder (movida fuera del useMemo)
  const createPlaceholderImage = useCallback(recipeName => {
    return `https://placehold.co/600x300/E2E8F0/A0AEC0?text=${encodeURIComponent(
      recipeName || "Receta"
    )}`;
  }, []);

  // Memoiza la imagen placeholder para evitar recreaciones
  const placeholderImage = useMemo(
    () => (recipe ? createPlaceholderImage(recipe.name) : ""),
    [recipe, createPlaceholderImage]
  );

  // Manejador optimizado para errores de imagen
  const handleImageError = useCallback(
    e => {
      e.target.onerror = null;
      e.target.src = placeholderImage;
    },
    [placeholderImage]
  );

  // Early return DESPUÉS de todos los hooks
  if (!recipe) return null;

  return (
    <Modal isOpen={!!recipe} onClose={onClose} title="">
      <div className="flex flex-col items-center">
        <h2 className="text-2xl font-bold text-emerald-700 dark:text-emerald-300 mb-2 text-center">
          {recipe.name}
        </h2>
        <span className="inline-block bg-amber-200 dark:bg-amber-800 text-amber-800 dark:text-amber-200 text-xs font-semibold px-3 py-1 rounded-full mb-3">
          {recipe.category}
        </span>{" "}
        <div className="w-full h-48 bg-slate-100 dark:bg-slate-700 rounded-xl mb-4 flex items-center justify-center overflow-hidden">
          <img
            src={recipe.imageUrl || placeholderImage}
            alt={recipe.name}
            className="w-full h-48 object-contain"
            style={{ objectPosition: "center" }}
            loading="lazy"
            decoding="async"
            onError={handleImageError}
          />
        </div>
        {/* Grid optimizado de información */}{" "}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mb-4">
          <div className="bg-gradient-to-br from-slate-50 to-emerald-50 dark:from-slate-800/60 dark:to-slate-700/40 rounded-lg p-3 flex items-center gap-2 border dark:border-emerald-400/20 backdrop-blur-sm">
            <ClockIcon size={18} className="text-emerald-500 flex-shrink-0" />
            <span className="font-semibold">Tiempo:</span>
            <span className="text-sm">{recipe.prepTime || "—"}</span>
          </div>
          <div className="bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-800/60 dark:to-slate-700/40 rounded-lg p-3 flex items-center gap-2 border dark:border-blue-400/20 backdrop-blur-sm">
            <Users size={18} className="text-emerald-500 flex-shrink-0" />
            <span className="font-semibold">Porciones:</span>
            <span className="text-sm">
              {recipe.servings ? `${recipe.servings} personas` : "—"}
            </span>
          </div>
        </div>
        {/* Sección de ingredientes optimizada */}
        <div className="w-full mb-4">
          <h3 className="text-lg font-bold text-emerald-700 dark:text-emerald-300 mb-2 flex items-center">
            <span className="mr-2">📝</span>
            <span>Ingredientes</span>
          </h3>
          <ul className="list-disc list-inside text-left space-y-1">
            {recipe.ingredients && recipe.ingredients.length > 0 ? (
              recipe.ingredients.map((ingredient, idx) => (
                <li
                  key={idx}
                  className="text-slate-700 dark:text-slate-200 text-sm"
                >
                  {ingredient}
                </li>
              ))
            ) : (
              <li className="text-slate-400 italic">Sin ingredientes</li>
            )}
          </ul>
        </div>
        {/* Sección de instrucciones optimizada */}
        <div className="w-full mb-2">
          <h3 className="text-lg font-bold text-emerald-700 dark:text-emerald-300 mb-2 flex items-center">
            <span className="mr-2">👨‍🍳</span>
            <span>Instrucciones</span>
          </h3>
          <ol className="list-decimal list-inside text-left space-y-2">
            {recipe.instructions && recipe.instructions.length > 0 ? (
              recipe.instructions.map((step, idx) => (
                <li
                  key={idx}
                  className="text-slate-700 dark:text-slate-200 text-sm leading-relaxed"
                >
                  {step}
                </li>
              ))
            ) : (
              <li className="text-slate-400 italic">Sin instrucciones</li>
            )}
          </ol>
        </div>
      </div>
    </Modal>
  );
});

/**
 * Componente WeeklyPlanner optimizado
 * Gestiona y muestra el plan de comidas semanal con funcionalidad de drag & drop
 */
const WeeklyPlanner = ({
  allUserRecipes,
  recipes,
  showToast,
  onShowRecipeDetails,
}) => {
  // Estados optimizados
  const [weeklyPlan, setWeeklyPlan] = useState(getLocalWeeklyPlan);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  // Hooks para funcionalidad móvil
  const { isTouchDevice } = useMobileDetection();
  const {
    selectedRecipeForMobile,
    isAddingToDay,
    showMobileInstructions,
    clearMobileSelection,
    setShowMobileInstructions,
  } = useMobileInteraction();

  // Sincronización optimizada con localStorage
  useEffect(() => {
    setWeeklyPlan(getLocalWeeklyPlan());
  }, []);

  // Actualización optimizada del plan semanal
  const updateWeeklyPlan = useCallback(newPlan => {
    setLocalWeeklyPlan(newPlan);
    setWeeklyPlan({ ...newPlan });
  }, []);

  // Manejador optimizado para drag over
  const handleDragOverDay = useCallback(e => {
    e.preventDefault();
  }, []);
  // Manejador optimizado para añadir receta a un día
  const handleDropRecipeOnDay = useCallback(
    (dayKey, recipeId) => {
      if (!recipeId) return;

      const updatedPlan = { ...weeklyPlan };
      if (!updatedPlan[dayKey]) updatedPlan[dayKey] = [];

      if (!updatedPlan[dayKey].includes(recipeId)) {
        updatedPlan[dayKey].push(recipeId);
        updateWeeklyPlan(updatedPlan);

        // Track recipe added to planner
        const recipe = allUserRecipes.find(r => r.id === recipeId);
        if (recipe) {
          trackRecipeEvent.addToPlanner(recipeId, {
            recipeName: recipe.name,
            day: dayKey,
            plannerSize: updatedPlan[dayKey].length,
          });
        }

        showToast?.("Receta añadida al planificador.", "success");
      }
    },
    [weeklyPlan, updateWeeklyPlan, showToast, allUserRecipes]
  );

  // Manejador optimizado para eliminar receta de un día
  const handleRemoveRecipeFromDay = useCallback(
    (dayKey, recipeIdToRemove) => {
      const updatedPlan = { ...weeklyPlan };
      if (updatedPlan[dayKey]) {
        updatedPlan[dayKey] = updatedPlan[dayKey].filter(
          id => id !== recipeIdToRemove
        );
        updateWeeklyPlan(updatedPlan);
        showToast?.("Receta eliminada del planificador.", "success");
      }
    },
    [weeklyPlan, updateWeeklyPlan, showToast]
  );

  // Manejador optimizado para rotar recetas
  const handleRotateRecipeForDay = useCallback(
    dayKey => {
      if (!allUserRecipes || allUserRecipes.length === 0) return;

      const availableIds = allUserRecipes.map(r => r.id);
      const randomId =
        availableIds[Math.floor(Math.random() * availableIds.length)];

      const updatedPlan = { ...weeklyPlan };
      updatedPlan[dayKey] = [randomId];
      updateWeeklyPlan(updatedPlan);
      showToast?.("Receta rotada para el día.", "success");
    },
    [allUserRecipes, weeklyPlan, updateWeeklyPlan, showToast]
  );
  // Manejador optimizado para cerrar modal
  const handleCloseModal = useCallback(() => {
    setSelectedRecipe(null);
  }, []);
  // Manejador para toque en día (dispositivos móviles)
  const handleMobileTapDay = useCallback(
    dayKey => {
      if (selectedRecipeForMobile && isAddingToDay) {
        handleDropRecipeOnDay(dayKey, selectedRecipeForMobile.id);
        clearMobileSelection();

        // Track mobile interaction
        trackRecipeEvent.addToPlanner(selectedRecipeForMobile.id, {
          recipeName: selectedRecipeForMobile.name,
          day: dayKey,
          interactionType: "mobile_tap",
        });

        showToast?.("Receta añadida mediante toque.", "success");
      }
    },
    [
      selectedRecipeForMobile,
      isAddingToDay,
      handleDropRecipeOnDay,
      clearMobileSelection,
      showToast,
    ]
  );

  // Manejador para cancelar selección móvil
  const handleCancelMobileSelection = useCallback(() => {
    clearMobileSelection();
  }, [clearMobileSelection]);

  // Manejador para cerrar instrucciones móviles
  const handleCloseMobileInstructions = useCallback(() => {
    setShowMobileInstructions(false);
  }, [setShowMobileInstructions]);

  // Memoización de recetas disponibles ordenadas
  const availableRecipesSorted = useMemo(
    () =>
      [...recipes].sort((a, b) => (a.name || "").localeCompare(b.name || "")),
    [recipes]
  );
  return (
    <div className="flex flex-col lg:flex-row gap-4 lg:gap-8 pb-4 lg:pb-8">
      {/* Sección del Plan Semanal optimizada */}
      <div className="lg:w-3/5 xl:w-2/3">
        <h2 className="text-2xl sm:text-3xl font-bold text-emerald-700 dark:text-emerald-400 mb-4 lg:mb-6 break-words">
          🗓️ Plan Semanal
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
          {DAYS_OF_WEEK.map(day => (
            <DayColumn
              key={day}
              day={day}
              recipesForThisDay={weeklyPlan[day.toLowerCase()] || []}
              allUserRecipes={allUserRecipes}
              onDropRecipe={handleDropRecipeOnDay}
              onDragOverDay={handleDragOverDay}
              onRemoveRecipeFromDay={handleRemoveRecipeFromDay}
              onRotateRecipeForDay={handleRotateRecipeForDay}
              onShowRecipeDetails={setSelectedRecipe}
              onMobileTapDay={handleMobileTapDay}
              isHighlightedForMobile={isAddingToDay}
            />
          ))}{" "}
        </div>
      </div>
      {/* Sección de Recetas Disponibles optimizada */}
      <div className="lg:w-2/5 xl:w-1/3 space-y-2 lg:space-y-3 p-3 lg:p-4 bg-white dark:bg-slate-800 rounded-xl shadow-xl border dark:border-slate-700">
        <h2 className="text-xl lg:text-2xl xl:text-3xl font-bold text-emerald-700 dark:text-emerald-400 mb-2 break-words">
          📚 Recetas Disponibles
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-300 mb-2 lg:mb-3">
          {isTouchDevice
            ? "Toca una receta para seleccionarla, luego toca un día."
            : "Arrastra una receta a un día."}{" "}
        </p>
        <div className="max-h-[50vh] lg:max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar grid grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-3 lg:gap-4 pb-1 lg:pb-2">
          {availableRecipesSorted.length > 0 ? (
            availableRecipesSorted.map(recipe => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onShowDetails={setSelectedRecipe}
                isDraggable={true}
                showDeleteButton={false}
              />
            ))
          ) : (
            <p className="text-sm py-8 text-center col-span-full text-slate-500 dark:text-slate-400">
              🍲 No hay recetas. ¡Crea algunas!
            </p>
          )}
        </div>
      </div>
      {/* Modal de detalles optimizado */}
      <RecipeDetailsModal recipe={selectedRecipe} onClose={handleCloseModal} />
      {/* Instrucciones móviles */}
      <MobileInstructions
        isVisible={showMobileInstructions}
        onClose={handleCloseMobileInstructions}
        selectedRecipe={selectedRecipeForMobile}
        onCancel={handleCancelMobileSelection}
      />
    </div>
  );
};

// Memoización optimizada del componente principal
export default React.memo(WeeklyPlanner, (prevProps, nextProps) => {
  return (
    prevProps.allUserRecipes === nextProps.allUserRecipes &&
    prevProps.recipes === nextProps.recipes &&
    prevProps.showToast === nextProps.showToast &&
    prevProps.onShowRecipeDetails === nextProps.onShowRecipeDetails
  );
});
