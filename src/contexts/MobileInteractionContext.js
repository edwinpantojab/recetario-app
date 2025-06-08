import React, { createContext, useContext, useState, useCallback } from "react";
import { trackMobileInteraction } from "../utils/analytics";

const MobileInteractionContext = createContext();

/**
 * Proveedor de contexto para manejar las interacciones móviles
 * Gestiona el estado de selección de recetas y modo de adición táctil
 */
export const MobileInteractionProvider = ({ children }) => {
  const [selectedRecipeForMobile, setSelectedRecipeForMobile] = useState(null);
  const [isAddingToDay, setIsAddingToDay] = useState(false);
  const [showMobileInstructions, setShowMobileInstructions] = useState(false);
  const selectRecipeForMobile = useCallback(recipe => {
    setSelectedRecipeForMobile(recipe);
    setIsAddingToDay(true);
    setShowMobileInstructions(true);

    // Track mobile recipe selection
    trackMobileInteraction.touch(recipe.id, {
      recipeName: recipe.name,
      actionType: "recipe_selection",
    });
  }, []);

  const clearMobileSelection = useCallback(() => {
    setSelectedRecipeForMobile(null);
    setIsAddingToDay(false);
    setShowMobileInstructions(false);
  }, []);

  const value = {
    selectedRecipeForMobile,
    isAddingToDay,
    showMobileInstructions,
    selectRecipeForMobile,
    clearMobileSelection,
    setShowMobileInstructions,
  };

  return (
    <MobileInteractionContext.Provider value={value}>
      {children}
    </MobileInteractionContext.Provider>
  );
};

/**
 * Hook para usar el contexto de interacciones móviles
 */
export const useMobileInteraction = () => {
  const context = useContext(MobileInteractionContext);
  if (!context) {
    throw new Error(
      "useMobileInteraction debe usarse dentro de MobileInteractionProvider"
    );
  }
  return context;
};
