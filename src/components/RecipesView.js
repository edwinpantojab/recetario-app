import React, { useState, useEffect, useCallback, useMemo } from "react";
import RecipeCard from "./recipes/RecipeCard"; // Corregido: Se movió a la subcarpeta recipes
import RecipeForm from "./recipes/RecipeForm"; // Corregido: Se movió a la subcarpeta recipes
import Modal from "./layout/Modal"; // Corregido: Se movió a la subcarpeta layout
import CustomConfirmModal from "./ui/CustomConfirmModal"; // Corregido: Se movió a la subcarpeta ui
import SocialShareModal from "./SocialShareModal";
import IngredientsListModal from "./ui/IngredientsListModal"; // NUEVO: Modal para mostrar solo ingredientes
import LikeButton from "./ui/LikeButton";
import useRecipeLikes from "../hooks/useRecipeLikes";
import { saveData, loadData } from "../data/localStorageHelpers";
import { DEFAULT_RECIPES } from "../data/defaultRecipes";
import { PlusCircle, ClockIcon, Users, ShoppingCart } from "lucide-react";
import { CATEGORIES } from "../data/constants";
import { trackRecipeEvent } from "../utils/analytics";

/**
 * Constantes del componente
 * Definidas fuera del componente para evitar recreación
 */
const LOCAL_STORAGE_RECIPES_KEY = "recipes";
const PLACEHOLDER_IMAGE_BASE =
  "https://placehold.co/600x300/E2E8F0/A0AEC0?text=";
const ALL_CATEGORIES = "Todas las categorías";

/**
 * Helpers optimizados para localStorage
 * Memoizados para evitar recreación en cada render
 */
const recipesStorageHelpers = {
  get: async () =>
    await loadData(LOCAL_STORAGE_RECIPES_KEY, [...DEFAULT_RECIPES]),
  set: async recipes => await saveData(LOCAL_STORAGE_RECIPES_KEY, recipes),
};

/**
 * RecipesView
 * Componente principal para gestionar y visualizar recetas.
 * Incluye funcionalidades de crear, editar, eliminar, filtrar y compartir recetas.
 *
 * Características:
 * - Gestión optimizada de estado con useCallback y useMemo
 * - Filtrado en tiempo real por nombre y categoría
 * - Modal de detalles de receta con información completa
 * - Sistema de compartir con enlace generado
 * - Responsive design con grid adaptativo
 * - Persistencia en localStorage
 *
 * @param {Object} props - Propiedades del componente
 * @param {Function} [props.showToast] - Función para mostrar notificaciones
 * @param {Function} [props.setUserRecipes] - Función para actualizar recetas globales
 * @returns {JSX.Element} Componente de vista de recetas
 */
const RecipesView = ({ showToast, setUserRecipes }) => {
  // Estados principales del componente
  const [recipes, setRecipes] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState(null);
  const [filter, setFilter] = useState("");
  const [category, setCategory] = useState(ALL_CATEGORIES);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] =
    useState(false);
  const [recipeToDelete, setRecipeToDelete] = useState(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [recipeLinkToShare, setRecipeLinkToShare] = useState("");
  const [recipeToShare, setRecipeToShare] = useState(null);

  // NUEVO: Estados para el modal de ingredientes
  const [isIngredientsModalOpen, setIsIngredientsModalOpen] = useState(false);
  const [recipeForIngredients, setRecipeForIngredients] = useState(null);
  // Cargar recetas al montar el componente
  useEffect(() => {
    const loadRecipes = async () => {
      try {
        const loadedRecipes = await recipesStorageHelpers.get();
        // Asegurar que loadedRecipes es un array
        const recipesArray = Array.isArray(loadedRecipes)
          ? loadedRecipes
          : [...DEFAULT_RECIPES];
        setRecipes(recipesArray);
      } catch (error) {
        console.error("Error cargando recetas:", error); // eslint-disable-line no-console
        setRecipes([...DEFAULT_RECIPES]);
        showToast?.(
          "Error cargando recetas, usando valores por defecto",
          "warning"
        );
      }
    };

    loadRecipes();
  }, [showToast]);
  // Función optimizada para guardar recetas
  const saveRecipes = useCallback(
    async newRecipes => {
      try {
        // Asegurar que newRecipes es un array válido
        const recipesArray = Array.isArray(newRecipes) ? newRecipes : [];
        await recipesStorageHelpers.set(recipesArray);
        setRecipes(recipesArray);
        setUserRecipes?.(recipesArray);
      } catch (error) {
        console.error("Error guardando recetas:", error); // eslint-disable-line no-console
        showToast?.("Error guardando recetas", "error");
      }
    },
    [setUserRecipes, showToast]
  );

  // Generar ID único optimizado
  const generateRecipeId = useCallback(() => {
    return `receta-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }, []); // Manejador optimizado para guardar/editar receta
  const handleSaveRecipe = useCallback(
    async recipeData => {
      let newRecipes;

      if (editingRecipe) {
        // Modo edición
        newRecipes = recipes.map(recipe =>
          recipe.id === editingRecipe.id
            ? {
                ...editingRecipe,
                ...recipeData,
                updatedAt: new Date().toISOString(),
              }
            : recipe
        );

        // Track recipe edit event
        trackRecipeEvent.edit(editingRecipe.id, {
          name: recipeData.name,
          category: recipeData.category,
          time: recipeData.time,
          servings: recipeData.servings,
        });

        showToast?.("Receta actualizada exitosamente", "success");
      } else {
        // Modo creación
        const newRecipe = {
          ...recipeData,
          id: generateRecipeId(),
          createdAt: new Date().toISOString(),
        };

        newRecipes = [...recipes, newRecipe];

        // Track recipe creation event
        trackRecipeEvent.create(newRecipe.id, {
          name: recipeData.name,
          category: recipeData.category,
          time: recipeData.time,
          servings: recipeData.servings,
        });

        showToast?.("Receta creada exitosamente", "success");
      }

      await saveRecipes(newRecipes);
      setIsFormOpen(false);
      setEditingRecipe(null);
    },
    [editingRecipe, recipes, saveRecipes, showToast, generateRecipeId]
  );

  // Manejador para solicitud de eliminación (abre modal)
  const handleDeleteRecipeRequest = useCallback(id => {
    setRecipeToDelete(id);
    setIsConfirmDeleteModalOpen(true);
  }, []); // Manejador para confirmar eliminación
  const handleDeleteRecipe = useCallback(async () => {
    if (!recipeToDelete) return;

    // Find recipe to track before deletion
    const recipeToDeleteData = recipes.find(
      recipe => recipe.id === recipeToDelete
    );

    const newRecipes = recipes.filter(recipe => recipe.id !== recipeToDelete);
    await saveRecipes(newRecipes);

    // Track recipe deletion event
    if (recipeToDeleteData) {
      trackRecipeEvent.delete(recipeToDelete, {
        name: recipeToDeleteData.name,
        category: recipeToDeleteData.category,
      });
    }

    showToast?.("Receta eliminada exitosamente", "success");

    // Resetear estado del modal
    setIsConfirmDeleteModalOpen(false);
    setRecipeToDelete(null);
  }, [recipeToDelete, recipes, saveRecipes, showToast]);

  // Manejador para cancelar eliminación
  const handleCancelDelete = useCallback(() => {
    setIsConfirmDeleteModalOpen(false);
    setRecipeToDelete(null);
  }, []); // Manejador optimizado para compartir receta
  const handleShareRecipe = useCallback(
    recipe => {
      // Crear una URL que apunte a la aplicación principal con información de la receta
      const shareLink = `${window.location.origin}${window.location.pathname}?recipe=${encodeURIComponent(recipe.name)}&id=${recipe.id}`;
      setRecipeLinkToShare(shareLink);
      setRecipeToShare(recipe);
      setIsShareModalOpen(true);

      // Track recipe share event
      trackRecipeEvent.share(recipe.id, {
        name: recipe.name,
        category: recipe.category,
        shareMethod: "modal",
      });

      showToast?.("¡Comparte esta deliciosa receta!", "info");
    },
    [showToast]
  );
  // Manejador para toggle del formulario de nueva receta
  const handleToggleNewRecipe = useCallback(() => {
    if (isFormOpen) {
      // Si el formulario está abierto, cerrarlo
      setIsFormOpen(false);
      setEditingRecipe(null);
    } else {
      // Si el formulario está cerrado, abrirlo para nueva receta
      setEditingRecipe(null);
      setIsFormOpen(true);
    }
  }, [isFormOpen]);
  // Manejador para editar receta
  const handleEditRecipe = useCallback(recipe => {
    setEditingRecipe(recipe);
    setIsFormOpen(true);
  }, []);

  // Manejador para cerrar formulario
  const handleCloseForm = useCallback(() => {
    setIsFormOpen(false);
    setEditingRecipe(null);
  }, []);

  // NUEVO: Manejadores para el modal de ingredientes
  const handleShowIngredients = useCallback(
    recipe => {
      setRecipeForIngredients(recipe);
      setIsIngredientsModalOpen(true);

      // Track ingredients view event
      trackRecipeEvent.viewIngredients?.(recipe.id, {
        name: recipe.name,
        category: recipe.category,
        ingredientsCount: recipe.ingredients?.length || 0,
      });

      showToast?.("📝 Lista de ingredientes lista para usar", "info");
    },
    [showToast]
  );

  const handleCloseIngredientsModal = useCallback(() => {
    setIsIngredientsModalOpen(false);
    setRecipeForIngredients(null);
  }, []);

  // Recetas filtradas memoizadas
  const filteredRecipes = useMemo(() => {
    return recipes.filter(recipe => {
      const matchName = recipe.name
        .toLowerCase()
        .includes(filter.toLowerCase());
      const matchCategory =
        category === ALL_CATEGORIES || recipe.category === category;
      return matchName && matchCategory;
    });
  }, [recipes, filter, category]);

  // Componente memoizado para imagen placeholder
  const getPlaceholderImage = useCallback(recipeName => {
    return `${PLACEHOLDER_IMAGE_BASE}${encodeURIComponent(
      recipeName || "Receta"
    )}`;
  }, []); // Hook para gestionar likes (a nivel de componente)
  const { getLikes, hasUserLiked, toggleLike } = useRecipeLikes();

  // Componente de detalles de receta memoizado
  const RecipeDetailsModal = useMemo(
    () =>
      ({ recipe, onClose }) => {
        if (!recipe) return null;

        const placeholderImage = getPlaceholderImage(recipe.name);

        return (
          <Modal isOpen={!!recipe} onClose={onClose} title="">
            <div className="flex flex-col items-center">
              {/* Encabezado de la receta */}
              <h2 className="text-2xl font-extrabold text-emerald-700 dark:text-emerald-300 tracking-tight mb-2 text-center">
                {recipe.name}
              </h2>
              {/* Categoría */}
              {recipe.category && (
                <span className="inline-block bg-amber-200 text-amber-800 text-xs font-bold px-3 py-1 rounded-full mb-3 tracking-wide">
                  {recipe.category}
                </span>
              )}{" "}
              {/* Imagen de la receta */}
              <div className="w-full h-48 bg-slate-100 dark:bg-slate-700 rounded-xl mb-4 flex items-center justify-center overflow-hidden">
                <img
                  src={recipe.imageUrl || placeholderImage}
                  alt={`Imagen de ${recipe.name}`}
                  className="w-full h-48 object-contain"
                  style={{ objectPosition: "center" }}
                  loading="lazy"
                  decoding="async"
                  onError={e => {
                    e.target.onerror = null;
                    e.target.src = placeholderImage;
                  }}
                />
              </div>
              {/* Información de tiempo y porciones */}{" "}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mb-4">
                {" "}
                <div className="bg-gradient-to-br from-slate-50 to-emerald-50 dark:from-slate-800/60 dark:to-slate-700/40 rounded-lg p-3 flex items-center gap-2 border dark:border-emerald-400/20 backdrop-blur-sm">
                  <ClockIcon
                    size={18}
                    className="text-emerald-500 dark:text-slate-300 flex-shrink-0"
                    aria-hidden="true"
                  />
                  <span className="font-semibold">Tiempo:</span>
                  <span className="truncate">
                    {recipe.prepTime || "No especificado"}
                  </span>
                </div>{" "}
                <div className="bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-800/60 dark:to-slate-700/40 rounded-lg p-3 flex items-center gap-2 border dark:border-blue-400/20 backdrop-blur-sm">
                  <Users
                    size={18}
                    className="text-emerald-500 dark:text-slate-300 flex-shrink-0"
                    aria-hidden="true"
                  />
                  <span className="font-semibold">Porciones:</span>
                  <span className="truncate">
                    {recipe.servings
                      ? `${recipe.servings} personas`
                      : "No especificado"}
                  </span>
                </div>
              </div>
              {/* Like button section */}
              <div className="w-full flex justify-center mb-4">
                <LikeButton
                  recipeId={recipe.id}
                  likesCount={getLikes(recipe.id)}
                  isLiked={hasUserLiked(recipe.id)}
                  onToggleLike={toggleLike}
                  size="lg"
                  showCount={true}
                />
              </div>
              {/* NUEVO: Botón para ver solo ingredientes */}
              <div className="w-full mb-4">
                <button
                  onClick={() => handleShowIngredients(recipe)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <ShoppingCart size={20} />
                  Ver Solo Lista de Ingredientes
                </button>
              </div>
              {/* Ingredientes */}
              <div className="w-full mb-4">
                <h3 className="text-lg font-bold text-emerald-700 dark:text-emerald-300 mb-2 flex items-center">
                  <span className="mr-2" aria-hidden="true">
                    📝
                  </span>
                  Ingredientes
                </h3>
                <ul className="list-disc list-inside text-left space-y-1 bg-gradient-to-br from-emerald-50 to-slate-50 dark:from-slate-800/60 dark:to-slate-700/40 rounded-lg p-3 border dark:border-emerald-400/20 backdrop-blur-sm">
                  {" "}
                  {recipe.ingredients?.length > 0 ? (
                    recipe.ingredients.map((ingredient, idx) => (
                      <li
                        key={`${recipe.id}-ingredient-${idx}-${ingredient.slice(0, 10)}`}
                        className="text-slate-700 dark:text-slate-200"
                      >
                        {ingredient}
                      </li>
                    ))
                  ) : (
                    <li className="text-slate-400 dark:text-slate-300 italic">
                      Sin ingredientes especificados
                    </li>
                  )}
                </ul>
              </div>
              {/* Instrucciones */}
              <div className="w-full mb-2">
                <h3 className="text-lg font-bold text-emerald-700 dark:text-emerald-300 mb-2 flex items-center">
                  <span className="mr-2" aria-hidden="true">
                    👨‍🍳
                  </span>
                  Instrucciones
                </h3>
                <ol className="list-decimal list-inside text-left space-y-2 bg-gradient-to-br from-blue-50 to-slate-50 dark:from-slate-800/60 dark:to-slate-700/40 rounded-lg p-3 border dark:border-blue-400/20 backdrop-blur-sm">
                  {" "}
                  {recipe.instructions?.length > 0 ? (
                    recipe.instructions.map((step, idx) => (
                      <li
                        key={`${recipe.id}-instruction-${idx}-${step.slice(0, 10)}`}
                        className="text-slate-700 dark:text-slate-200"
                      >
                        {step}
                      </li>
                    ))
                  ) : (
                    <li className="text-slate-400 dark:text-slate-300 italic">
                      Sin instrucciones especificadas
                    </li>
                  )}
                </ol>
              </div>
            </div>
          </Modal>
        );
      },
    [
      getPlaceholderImage,
      handleShowIngredients,
      getLikes,
      hasUserLiked,
      toggleLike,
    ]
  );
  // Mensaje de recetas vacías memoizado
  const EmptyState = useMemo(
    () => (
      <div className="col-span-full text-center text-slate-500 dark:text-slate-300 py-8 sm:py-10">
        <div className="text-base sm:text-lg mb-4">
          {filter || category !== ALL_CATEGORIES
            ? "No hay recetas que coincidan con tu búsqueda."
            : "No tienes recetas guardadas aún."}
        </div>{" "}
        {!filter && category === ALL_CATEGORIES && (
          <button
            onClick={handleToggleNewRecipe}
            className="inline-flex items-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors recipe-action-button"
          >
            <PlusCircle size={18} className="mr-2" />
            Crear tu primera receta
          </button>
        )}
      </div>
    ),
    [filter, category, handleToggleNewRecipe]
  );

  // Detectar y manejar parámetros de URL para recetas compartidas
  useEffect(() => {
    const checkSharedRecipe = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const sharedRecipeId = urlParams.get("id");
      const sharedRecipeName = urlParams.get("recipe");

      if (sharedRecipeId && recipes.length > 0) {
        // Buscar la receta por ID
        const sharedRecipe = recipes.find(
          recipe => recipe.id === sharedRecipeId
        );

        if (sharedRecipe) {
          // Mostrar la receta automáticamente
          setSelectedRecipe(sharedRecipe);
          showToast?.(`¡Receta "${sharedRecipe.name}" encontrada!`, "success");

          // Limpiar la URL sin recargar la página
          const url = new URL(window.location);
          url.searchParams.delete("id");
          url.searchParams.delete("recipe");
          window.history.replaceState({}, "", url);
        } else if (sharedRecipeName) {
          // Si no se encuentra por ID, buscar por nombre
          const recipeByName = recipes.find(recipe =>
            recipe.name
              .toLowerCase()
              .includes(decodeURIComponent(sharedRecipeName).toLowerCase())
          );

          if (recipeByName) {
            setSelectedRecipe(recipeByName);
            showToast?.(
              `¡Receta "${recipeByName.name}" encontrada!`,
              "success"
            );
          } else {
            showToast?.(
              `No se encontró la receta "${decodeURIComponent(sharedRecipeName)}"`,
              "warning"
            );
          }

          // Limpiar la URL
          const url = new URL(window.location);
          url.searchParams.delete("id");
          url.searchParams.delete("recipe");
          window.history.replaceState({}, "", url);
        }
      }
    };

    // Verificar después de que las recetas se hayan cargado
    if (recipes.length > 0) {
      checkSharedRecipe();
    }
  }, [recipes, showToast]);
  return (
    <div className="w-full px-1 sm:px-2 md:px-4 pb-2">
      {/* Sección de búsqueda y filtros */}
      <div className="px-1 sm:px-0">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
          <div className="w-full flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center">
            {/* Campo de búsqueda */}
            <div className="flex-1 min-w-0">
              {" "}
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow p-1.5 flex items-center">
                <input
                  type="text"
                  placeholder="Buscar recetas por nombre..."
                  value={filter}
                  onChange={e => setFilter(e.target.value)}
                  className="w-full p-1.5 rounded-md border border-emerald-200 dark:border-emerald-400/30 focus:border-emerald-700 dark:focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400/50 focus:ring-offset-2 text-sm bg-white dark:bg-gradient-to-br dark:from-slate-800/50 dark:to-slate-700/30 dark:text-slate-100 transition-all duration-200 outline-none backdrop-blur-sm"
                  aria-label="Buscar recetas por nombre"
                />
              </div>
            </div>

            {/* Selector de categoría */}
            <div className="flex-shrink-0 min-w-[160px]">
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow p-1.5 flex items-center">
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full p-1.5 rounded-md border border-emerald-200 dark:border-emerald-400/30 focus:border-emerald-700 dark:focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400/50 focus:ring-offset-2 text-sm bg-white dark:bg-gradient-to-br dark:from-slate-800/50 dark:to-slate-700/30 dark:text-slate-100 transition-all duration-200 outline-none backdrop-blur-sm"
                  aria-label="Filtrar por categoría"
                >
                  <option value={ALL_CATEGORIES}>{ALL_CATEGORIES}</option>
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>{" "}
      {/* Grid de recetas */}
      <div className="mt-3 sm:mt-4">
        <div className="w-full px-1 sm:px-3">
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-2 gap-y-3 sm:gap-x-3 sm:gap-y-4">
            {filteredRecipes.length > 0
              ? filteredRecipes.map(recipe => (
                  <RecipeCard
                    key={recipe.id}
                    recipe={recipe}
                    onEdit={() => handleEditRecipe(recipe)}
                    onDelete={handleDeleteRecipeRequest}
                    onShowDetails={() => setSelectedRecipe(recipe)}
                    onShare={() => handleShareRecipe(recipe)}
                  />
                ))
              : EmptyState}{" "}
            {/* Botón de nueva receta integrado en el grid */}
            {filteredRecipes.length > 0 && (
              <button
                onClick={handleToggleNewRecipe}
                className="flex items-center justify-center px-4 py-8 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-base font-semibold shadow-lg transition-all hover:shadow-xl hover:-translate-y-1 border-2 border-dashed border-emerald-400 hover:border-emerald-300 recipe-action-button"
                aria-label="Crear nueva receta"
              >
                <div className="text-center">
                  <PlusCircle size={24} className="mx-auto mb-2" />
                  <span>Nueva Receta</span>
                </div>
              </button>
            )}
          </div>
        </div>
      </div>
      {/* Modales del componente */}
      {/* Modal para crear/editar receta */}
      <RecipeForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSave={handleSaveRecipe}
        initialRecipe={editingRecipe}
      />
      {/* Modal de detalles de receta */}
      <RecipeDetailsModal
        recipe={selectedRecipe}
        onClose={() => setSelectedRecipe(null)}
      />
      {/* Modal de confirmación para eliminar receta */}
      <CustomConfirmModal
        isOpen={isConfirmDeleteModalOpen}
        onClose={handleCancelDelete}
        onConfirm={handleDeleteRecipe}
        title="🗑️ Confirmar Eliminación"
        message="¿Estás seguro de que quieres eliminar esta receta? También se quitará del planificador y esta acción no se puede deshacer."
        confirmButtonText="Eliminar"
        cancelButtonText="Cancelar"
        variant="danger"
      />{" "}
      {/* Modal para compartir receta */}
      <SocialShareModal
        isOpen={isShareModalOpen}
        onClose={() => {
          setIsShareModalOpen(false);
          setRecipeToShare(null);
          setRecipeLinkToShare("");
        }}
        recipe={recipeToShare}
        shareUrl={recipeLinkToShare}
        showToast={showToast}
      />{" "}
      {/* NUEVO: Modal para mostrar solo ingredientes */}
      <IngredientsListModal
        isOpen={isIngredientsModalOpen}
        onClose={handleCloseIngredientsModal}
        recipe={recipeForIngredients}
        showToast={showToast}
      />{" "}
      {/* Botón flotante para crear receta */}
      <div className="fixed bottom-16 sm:bottom-20 right-4 sm:right-8 z-50">
        {/* Efecto de resplandor exterior para estado cerrado */}
        {!isFormOpen && (
          <div className="absolute inset-0 -m-2 rounded-full bg-gradient-to-r from-emerald-400/30 via-green-400/30 to-teal-400/30 blur-lg animate-pulse"></div>
        )}

        <button
          onClick={handleToggleNewRecipe}
          className={`group relative text-white rounded-full w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center transition-all duration-500 focus:outline-none focus:ring-4 focus:ring-offset-2 recipe-action-button ${
            isFormOpen
              ? "bg-gradient-to-br from-red-500 via-red-600 to-red-700 hover:from-red-600 hover:via-red-700 hover:to-red-800 focus:ring-red-500/50 animate-none shadow-xl hover:shadow-2xl hover:scale-110"
              : "bg-gradient-to-br from-emerald-400 via-emerald-500 to-emerald-600 hover:from-emerald-500 hover:via-emerald-600 hover:to-emerald-700 focus:ring-emerald-400/60 shadow-lg shadow-emerald-500/50 hover:shadow-xl hover:shadow-emerald-400/60 hover:scale-125 transform hover:-translate-y-1"
          }`}
          title={isFormOpen ? "Cerrar formulario" : "Crear nueva receta"}
          aria-label={isFormOpen ? "Cerrar formulario" : "Crear nueva receta"}
        >
          {/* Efecto de brillo interno mejorado para estado cerrado */}
          <div
            className={`absolute inset-0 rounded-full transition-all duration-500 ${
              isFormOpen
                ? "bg-gradient-to-t from-transparent via-white/20 to-white/30 opacity-0 group-hover:opacity-100"
                : "bg-gradient-to-tr from-transparent via-white/30 to-white/40 opacity-50 group-hover:opacity-80"
            }`}
          ></div>
          {/* Anillo brillante para estado cerrado */}
          {!isFormOpen && (
            <div className="absolute inset-0 rounded-full border-2 border-white/20 group-hover:border-white/40 transition-all duration-300"></div>
          )}{" "}
          {/* Ícono principal - cambia según el estado */}
          {isFormOpen ? (
            /* Ícono X para cerrar */
            <>
              <div className="sm:hidden relative z-10 drop-shadow-sm w-6 h-6 flex items-center justify-center">
                <div className="absolute w-4 h-0.5 bg-white rounded-full rotate-45"></div>
                <div className="absolute w-4 h-0.5 bg-white rounded-full -rotate-45"></div>
              </div>
              <div className="hidden sm:flex relative z-10 drop-shadow-sm w-7 h-7 items-center justify-center">
                <div className="absolute w-5 h-0.5 bg-white rounded-full rotate-45"></div>
                <div className="absolute w-5 h-0.5 bg-white rounded-full -rotate-45"></div>
              </div>
            </>
          ) : (
            /* Ícono + mejorado para crear */
            <>
              {/* Versión móvil */}
              <div className="sm:hidden relative z-10 w-7 h-7 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <div className="absolute w-5 h-0.5 bg-white rounded-full drop-shadow-lg group-hover:w-6 transition-all duration-300"></div>
                <div className="absolute w-0.5 h-5 bg-white rounded-full drop-shadow-lg group-hover:h-6 transition-all duration-300"></div>
                {/* Resplandor del ícono */}
                <div className="absolute w-5 h-0.5 bg-white/60 rounded-full blur-sm"></div>
                <div className="absolute w-0.5 h-5 bg-white/60 rounded-full blur-sm"></div>
              </div>

              {/* Versión desktop */}
              <div className="hidden sm:flex relative z-10 w-8 h-8 items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <div className="absolute w-6 h-0.5 bg-white rounded-full drop-shadow-lg group-hover:w-7 transition-all duration-300"></div>
                <div className="absolute w-0.5 h-6 bg-white rounded-full drop-shadow-lg group-hover:h-7 transition-all duration-300"></div>
                {/* Resplandor del ícono */}
                <div className="absolute w-6 h-0.5 bg-white/60 rounded-full blur-sm"></div>
                <div className="absolute w-0.5 h-6 bg-white/60 rounded-full blur-sm"></div>
              </div>
            </>
          )}
          {/* Círculo de pulso animado mejorado - solo cuando está cerrado */}
          {!isFormOpen && (
            <>
              <div className="absolute inset-0 rounded-full bg-emerald-300/40 animate-ping"></div>
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-300/20 via-green-300/30 to-teal-300/20 animate-pulse"></div>
            </>
          )}{" "}
          {/* Borde brillante mejorado */}
          <div
            className={`absolute inset-0 rounded-full border transition-all duration-500 ${
              isFormOpen
                ? "border-red-300/50 group-hover:border-red-200/70"
                : "border-emerald-200/60 group-hover:border-white/80 group-hover:shadow-[0_0_20px_rgba(16,185,129,0.5)]"
            }`}
          ></div>
          {/* Efecto de partículas flotantes para estado cerrado */}
          {!isFormOpen && (
            <>
              <div className="absolute -top-1 -right-1 w-1 h-1 bg-white/80 rounded-full animate-bounce delay-100"></div>
              <div className="absolute -top-2 right-2 w-0.5 h-0.5 bg-emerald-200/90 rounded-full animate-pulse delay-300"></div>
              <div className="absolute top-1 -right-2 w-0.5 h-0.5 bg-white/70 rounded-full animate-bounce delay-500"></div>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

// Memoización con comparación personalizada para optimizar renders
export default React.memo(RecipesView, (prevProps, nextProps) => {
  return (
    prevProps.showToast === nextProps.showToast &&
    prevProps.setUserRecipes === nextProps.setUserRecipes
  );
});
