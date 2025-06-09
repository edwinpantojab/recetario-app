import { useState, useEffect, useCallback } from "react";

/**
 * Hook personalizado para gestionar el sistema de likes de recetas
 * Persiste los likes en localStorage y proporciona funciones para manejar likes
 *
 * @returns {object} Estado y funciones para manejar likes
 */
const useRecipeLikes = () => {
  const [likes, setLikes] = useState({});
  const STORAGE_KEY = "recetario_recipe_likes";

  // Cargar likes del localStorage al inicializar
  useEffect(() => {
    try {
      const savedLikes = localStorage.getItem(STORAGE_KEY);
      if (savedLikes) {
        const parsedLikes = JSON.parse(savedLikes);
        setLikes(parsedLikes);
      }
    } catch (error) {
      console.warn("Error cargando likes desde localStorage:", error); // eslint-disable-line no-console
      setLikes({});
    }
  }, []);

  // Guardar likes en localStorage cuando cambien
  const saveLikes = useCallback(newLikes => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newLikes));
      setLikes(newLikes);
    } catch (error) {
      console.warn("Error guardando likes en localStorage:", error); // eslint-disable-line no-console
    }
  }, []);

  // Obtener el número de likes de una receta específica
  const getLikes = useCallback(
    recipeId => {
      return likes[recipeId] || 0;
    },
    [likes]
  );

  // Verificar si el usuario ya dio like a una receta específica
  const hasUserLiked = useCallback(recipeId => {
    const userLikesKey = `${STORAGE_KEY}_user_likes`;
    try {
      const userLikes = localStorage.getItem(userLikesKey);
      if (userLikes) {
        const parsedUserLikes = JSON.parse(userLikes);
        return parsedUserLikes[recipeId] || false;
      }
    } catch (error) {
      console.warn("Error verificando like del usuario:", error); // eslint-disable-line no-console
    }
    return false;
  }, []);

  // Alternar like de una receta (dar o quitar like)
  const toggleLike = useCallback(
    recipeId => {
      const userLikesKey = `${STORAGE_KEY}_user_likes`;
      const currentLikes = getLikes(recipeId);
      const userHasLiked = hasUserLiked(recipeId);

      try {
        // Actualizar contador de likes
        const newLikes = {
          ...likes,
          [recipeId]: userHasLiked
            ? Math.max(0, currentLikes - 1)
            : currentLikes + 1,
        };
        saveLikes(newLikes);

        // Actualizar estado de like del usuario
        const userLikes = localStorage.getItem(userLikesKey);
        const parsedUserLikes = userLikes ? JSON.parse(userLikes) : {};
        const newUserLikes = {
          ...parsedUserLikes,
          [recipeId]: !userHasLiked,
        };
        localStorage.setItem(userLikesKey, JSON.stringify(newUserLikes));

        return !userHasLiked; // Retorna el nuevo estado del like
      } catch (error) {
        console.warn("Error actualizando like:", error); // eslint-disable-line no-console
        return userHasLiked; // Retorna el estado actual si hay error
      }
    },
    [likes, getLikes, hasUserLiked, saveLikes]
  );

  // Inicializar likes para recetas que no tienen likes todavía
  const initializeRecipeLikes = useCallback(
    recipes => {
      const newLikes = { ...likes };
      let hasChanges = false;

      recipes.forEach(recipe => {
        if (!(recipe.id in newLikes)) {
          newLikes[recipe.id] = 0;
          hasChanges = true;
        }
      });

      if (hasChanges) {
        saveLikes(newLikes);
      }
    },
    [likes, saveLikes]
  );

  return {
    getLikes,
    hasUserLiked,
    toggleLike,
    initializeRecipeLikes,
    likes,
  };
};

export default useRecipeLikes;
