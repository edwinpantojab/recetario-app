/**
 * @fileoverview Modal para mostrar lista simplificada de ingredientes
 * Diseño atractivo que combina estética con funcionalidad de copia fácil
 * @author Sistema de gestión de recetas
 * @version 2.0.0
 */

import React, { memo } from "react";
import { X, Copy, Check, ChefHat, ShoppingCart } from "lucide-react";

/**
 * Modal que muestra una lista de ingredientes con diseño atractivo y funcional
 * @param {Object} props - Propiedades del componente
 * @param {boolean} props.isOpen - Si el modal está abierto
 * @param {Function} props.onClose - Función para cerrar el modal
 * @param {Object} props.recipe - Receta con los ingredientes
 */
const IngredientsListModal = memo(({ isOpen, onClose, recipe }) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen || !recipe) return null;

  // Crear texto simple de ingredientes para copiar
  const ingredientsText =
    recipe.ingredients && recipe.ingredients.length > 0
      ? recipe.ingredients.join("\n")
      : "No hay ingredientes disponibles";

  const handleCopyIngredients = async () => {
    try {
      await navigator.clipboard.writeText(ingredientsText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback para navegadores que no soportan clipboard API
      const textArea = document.createElement("textarea");
      textArea.value = ingredientsText;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-lg w-full max-h-[85vh] overflow-hidden shadow-2xl border dark:border-slate-600 transform transition-all">
        {/* Header con gradiente y diseño atractivo */}
        <div className="bg-gradient-to-r from-emerald-500 to-green-600 dark:from-emerald-600 dark:to-green-700 p-6 relative overflow-hidden">
          {/* Decoración de fondo */}
          <div className="absolute inset-0 bg-white/10 rounded-full -top-10 -right-10 w-32 h-32"></div>
          <div className="absolute inset-0 bg-white/5 rounded-full -bottom-8 -left-8 w-24 h-24"></div>

          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                <ShoppingCart className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">
                  Lista de Ingredientes
                </h3>
                <p className="text-emerald-100 text-sm font-medium">
                  {recipe.name}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-xl transition-colors backdrop-blur-sm"
              aria-label="Cerrar modal"
            >
              <X className="h-5 w-5 text-white" />
            </button>
          </div>
        </div>

        {/* Información de porciones */}
        {recipe.servings && (
          <div className="px-6 py-3 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-slate-700 dark:to-slate-600 border-b dark:border-slate-600">
            <div className="flex items-center justify-center gap-2">
              <ChefHat className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                Para {recipe.servings} porciones
              </span>
            </div>
          </div>
        )}

        {/* Lista de ingredientes con diseño mejorado */}
        <div className="p-6 overflow-y-auto max-h-96">
          {recipe.ingredients && recipe.ingredients.length > 0 ? (
            <div className="space-y-4">
              {/* Vista visual de ingredientes */}
              <div className="grid gap-2 mb-6">
                {recipe.ingredients.map((ingredient, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 bg-gradient-to-r from-slate-50 to-emerald-50 dark:from-slate-700 dark:to-slate-600 rounded-lg border border-emerald-100 dark:border-slate-600 hover:shadow-md transition-all"
                  >
                    <span className="flex-shrink-0 w-7 h-7 bg-gradient-to-br from-emerald-500 to-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-sm">
                      {index + 1}
                    </span>
                    <span className="text-slate-700 dark:text-slate-200 flex-1 font-medium leading-relaxed">
                      {ingredient}
                    </span>
                  </div>
                ))}
              </div>

              {/* Área de texto para copiar */}
              <div className="bg-gradient-to-br from-slate-50 to-emerald-50 dark:from-slate-800 dark:to-slate-700 rounded-xl p-4 border border-emerald-200 dark:border-slate-600">
                <div className="flex items-center gap-2 mb-3">
                  <Copy className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                    Texto para copiar:
                  </span>
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-emerald-100 dark:border-slate-600 max-h-32 overflow-y-auto">
                  <pre className="whitespace-pre-wrap text-sm text-slate-700 dark:text-slate-200 select-all font-mono leading-relaxed">
                    {ingredientsText}
                  </pre>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="p-4 bg-slate-100 dark:bg-slate-700 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                <ChefHat className="h-10 w-10 text-slate-400 dark:text-slate-500" />
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-lg font-medium">
                No hay ingredientes disponibles
              </p>
            </div>
          )}
        </div>

        {/* Footer con botones mejorados */}
        <div className="p-6 border-t border-slate-200 dark:border-slate-600 bg-gradient-to-r from-slate-50 to-emerald-50 dark:from-slate-800 dark:to-slate-700">
          <div className="flex gap-3">
            <button
              onClick={handleCopyIngredients}
              className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-semibold py-3 px-6 rounded-xl transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              {copied ? (
                <>
                  <Check className="h-5 w-5" />
                  ¡Copiado!
                </>
              ) : (
                <>
                  <Copy className="h-5 w-5" />
                  Copiar Lista
                </>
              )}
            </button>
            <button
              onClick={onClose}
              className="px-6 bg-slate-600 hover:bg-slate-700 dark:bg-slate-600 dark:hover:bg-slate-500 text-white font-semibold py-3 rounded-xl transition-all shadow-lg hover:shadow-xl"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

IngredientsListModal.displayName = "IngredientsListModal";

export default IngredientsListModal;
