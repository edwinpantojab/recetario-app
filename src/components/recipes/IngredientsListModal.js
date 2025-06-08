import React, { memo } from "react";
import Modal from "../layout/Modal";
import { ShoppingCart, Copy } from "lucide-react";

/**
 * Modal para mostrar solo la lista de ingredientes de una receta
 * Útil para cuando solo necesitas ver qué comprar o qué ingredientes usar
 *
 * @param {Object} props - Propiedades del componente
 * @param {boolean} props.isOpen - Si el modal está abierto
 * @param {Function} props.onClose - Función para cerrar el modal
 * @param {Object} props.recipe - Receta con los ingredientes
 * @param {Function} props.showToast - Función para mostrar notificaciones
 * @returns {JSX.Element} Modal con lista de ingredientes
 */
const IngredientsListModal = memo(({ isOpen, onClose, recipe, showToast }) => {
  if (!recipe) return null;

  // Función para copiar la lista de ingredientes al portapapeles
  const handleCopyIngredients = async () => {
    try {
      const ingredientsList = recipe.ingredients?.join("\n• ") || "";
      const textToCopy = `📝 Ingredientes para: ${recipe.name}\n\n• ${ingredientsList}`;

      await navigator.clipboard.writeText(textToCopy);
      showToast?.("Lista de ingredientes copiada al portapapeles", "success");
    } catch (error) {
      showToast?.("Error al copiar la lista", "error");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`📝 Ingredientes - ${recipe.name}`}
    >
      <div className="flex flex-col">
        {/* Información de la receta */}
        <div className="mb-4 p-4 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-slate-700/50 dark:to-slate-600/50 rounded-xl border border-emerald-200 dark:border-slate-600">
          <h3 className="text-lg font-bold text-emerald-700 dark:text-emerald-300 mb-2">
            {recipe.name}
          </h3>
          <div className="flex flex-wrap gap-2 text-sm">
            {recipe.category && (
              <span className="bg-amber-200 text-amber-800 px-2 py-1 rounded-full text-xs font-semibold">
                {recipe.category}
              </span>
            )}
            {recipe.servings && (
              <span className="bg-blue-200 text-blue-800 px-2 py-1 rounded-full text-xs font-semibold">
                {recipe.servings} porciones
              </span>
            )}
            {recipe.prepTime && (
              <span className="bg-purple-200 text-purple-800 px-2 py-1 rounded-full text-xs font-semibold">
                {recipe.prepTime}
              </span>
            )}
          </div>
        </div>

        {/* Lista de ingredientes */}
        <div className="mb-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl border-2 border-emerald-200 dark:border-emerald-600 p-4">
            {recipe.ingredients?.length > 0 ? (
              <ul className="space-y-3">
                {recipe.ingredients.map((ingredient, idx) => (
                  <li
                    key={`ingredient-${idx}`}
                    className="flex items-start gap-3 p-3 bg-gradient-to-r from-slate-50 to-emerald-50 dark:from-slate-700/50 dark:to-slate-600/50 rounded-lg border border-slate-200 dark:border-slate-600"
                  >
                    <div className="flex-shrink-0 w-6 h-6 bg-emerald-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {idx + 1}
                    </div>
                    <span className="text-slate-700 dark:text-slate-200 font-medium flex-1">
                      {ingredient}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-8 text-slate-400">
                <ShoppingCart size={48} className="mx-auto mb-2 opacity-50" />
                <p>No hay ingredientes especificados para esta receta</p>
              </div>
            )}
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex gap-3 mt-4">
          <button
            onClick={handleCopyIngredients}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <Copy size={18} />
            Copiar Lista
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-slate-500 hover:bg-slate-600 text-white rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md"
          >
            Cerrar
          </button>
        </div>

        {/* Nota informativa */}
        <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg">
          <p className="text-amber-700 dark:text-amber-300 text-sm">
            💡 <strong>Tip:</strong> Puedes copiar esta lista y pegarla en tu
            aplicación de notas o enviarla por mensaje para tenerla a mano
            mientras compras.
          </p>
        </div>
      </div>
    </Modal>
  );
});

IngredientsListModal.displayName = "IngredientsListModal";

export default IngredientsListModal;
