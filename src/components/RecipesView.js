import React, { useState, useEffect, useCallback, useMemo } from "react";
import RecipeCard from "./recipes/RecipeCard"; // Corregido: Se movió a la subcarpeta recipes
import RecipeForm from "./recipes/RecipeForm"; // Corregido: Se movió a la subcarpeta recipes
import Modal from "./layout/Modal"; // Corregido: Se movió a la subcarpeta layout
import CustomConfirmModal from "./ui/CustomConfirmModal"; // Corregido: Se movió a la subcarpeta ui
import SocialShareModal from "./SocialShareModal";
import { saveData, loadData } from "../data/localStorageHelpers";
import { DEFAULT_RECIPES } from "../data/defaultRecipes";
import { Plus, PlusCircle, ClockIcon, Users } from "lucide-react";
import { CATEGORIES } from "../data/constants";

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
  const [recipeToDelete, setRecipeToDelete] = useState(null);  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [recipeLinkToShare, setRecipeLinkToShare] = useState("");
  const [recipeToShare, setRecipeToShare] = useState(null);
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
  }, []);
  // Manejador optimizado para guardar/editar receta
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
        showToast?.("Receta actualizada exitosamente", "success");
      } else {
        // Modo creación
        newRecipes = [
          ...recipes,
          {
            ...recipeData,
            id: generateRecipeId(),
            createdAt: new Date().toISOString(),
          },
        ];
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
  }, []);
  // Manejador para confirmar eliminación
  const handleDeleteRecipe = useCallback(async () => {
    if (!recipeToDelete) return;

    const newRecipes = recipes.filter(recipe => recipe.id !== recipeToDelete);
    await saveRecipes(newRecipes);
    showToast?.("Receta eliminada exitosamente", "success");

    // Resetear estado del modal
    setIsConfirmDeleteModalOpen(false);
    setRecipeToDelete(null);
  }, [recipeToDelete, recipes, saveRecipes, showToast]);

  // Manejador para cancelar eliminación
  const handleCancelDelete = useCallback(() => {
    setIsConfirmDeleteModalOpen(false);
    setRecipeToDelete(null);
  }, []);  // Manejador optimizado para compartir receta
  const handleShareRecipe = useCallback(
    recipe => {
      const shareLink = `${window.location.origin}/recipe/${recipe.id}`;
      setRecipeLinkToShare(shareLink);
      setRecipeToShare(recipe);
      setIsShareModalOpen(true);
      showToast?.("¡Comparte esta deliciosa receta!", "info");
    },
    [showToast]
  );

  // Manejador para abrir formulario de nueva receta
  const handleCreateNewRecipe = useCallback(() => {
    setEditingRecipe(null);
    setIsFormOpen(true);
  }, []);

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
  }, []);

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
                <div className="bg-gradient-to-br from-slate-50 to-emerald-50 dark:from-slate-800/60 dark:to-slate-700/40 rounded-lg p-3 flex items-center gap-2 border dark:border-emerald-400/20 backdrop-blur-sm">
                  <ClockIcon
                    size={18}
                    className="text-emerald-500 flex-shrink-0"
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
                    className="text-emerald-500 flex-shrink-0"
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
                    <li className="text-slate-400 italic">
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
                    <li className="text-slate-400 italic">
                      Sin instrucciones especificadas
                    </li>
                  )}
                </ol>
              </div>
            </div>
          </Modal>
        );
      },
    [getPlaceholderImage]
  );

  // Mensaje de recetas vacías memoizado
  const EmptyState = useMemo(
    () => (
      <div className="col-span-full text-center text-slate-500 py-8 sm:py-10">
        <div className="text-base sm:text-lg mb-4">
          {filter || category !== ALL_CATEGORIES
            ? "No hay recetas que coincidan con tu búsqueda."
            : "No tienes recetas guardadas aún."}
        </div>
        {!filter && category === ALL_CATEGORIES && (
          <button
            onClick={handleCreateNewRecipe}
            className="inline-flex items-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors"
          >
            <PlusCircle size={18} className="mr-2" />
            Crear tu primera receta
          </button>
        )}
      </div>
    ),
    [filter, category, handleCreateNewRecipe]
  );

  return (
    <div className="w-full px-1 sm:px-2 md:px-4">
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
      </div>

      {/* Grid de recetas */}
      <div className="mt-4 sm:mt-6">
        <div className="w-full px-1 sm:px-3">
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-3 gap-y-5 sm:gap-x-4 sm:gap-y-6">
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
              : EmptyState}

            {/* Botón de nueva receta integrado en el grid */}
            {filteredRecipes.length > 0 && (
              <button
                onClick={handleCreateNewRecipe}
                className="flex items-center justify-center px-4 py-8 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-base font-semibold shadow-lg transition-all hover:shadow-xl hover:-translate-y-1 border-2 border-dashed border-emerald-400 hover:border-emerald-300"
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
      />      {/* Modal para compartir receta */}
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
      />

      {/* Botón flotante para crear receta */}
      <button
        onClick={handleCreateNewRecipe}
        className="fixed bottom-8 right-8 z-50 bg-gradient-to-br from-pink-400 to-emerald-500 hover:from-pink-500 hover:to-emerald-600 text-white rounded-full shadow-lg w-14 h-14 flex items-center justify-center transition-all hover:shadow-xl hover:scale-110 focus:outline-none focus:ring-4 focus:ring-emerald-500 focus:ring-offset-2"
        title="Crear nueva receta"
        aria-label="Crear nueva receta"
      >
        <Plus size={28} aria-hidden="true" />
      </button>
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
