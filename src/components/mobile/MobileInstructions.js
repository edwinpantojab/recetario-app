import React from "react";
import { X, Smartphone, Hand } from "lucide-react";

/**
 * Componente que muestra instrucciones para usuarios móviles
 * sobre cómo usar la funcionalidad táctil para añadir recetas
 */
const MobileInstructions = ({
  isVisible,
  onClose,
  selectedRecipe,
  onCancel,
}) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 max-w-sm w-full shadow-2xl border dark:border-slate-700">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2">
            <Smartphone className="text-emerald-500" size={24} />
            <h3 className="text-lg font-bold text-emerald-700 dark:text-emerald-300">
              Modo Táctil
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
          >
            <X size={20} />
          </button>
        </div>

        {selectedRecipe && (
          <div className="mb-4 p-3 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg">
            <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
              Receta seleccionada:
            </p>
            <p className="text-emerald-800 dark:text-emerald-200 font-bold">
              {selectedRecipe.name}
            </p>
          </div>
        )}

        <div className="space-y-3 mb-6">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-6 h-6 bg-emerald-100 dark:bg-emerald-800 rounded-full flex items-center justify-center">
              <span className="text-emerald-600 dark:text-emerald-300 text-sm font-bold">
                1
              </span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Toca una receta para seleccionarla
            </p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-6 h-6 bg-emerald-100 dark:bg-emerald-800 rounded-full flex items-center justify-center">
              <span className="text-emerald-600 dark:text-emerald-300 text-sm font-bold">
                2
              </span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Toca el día donde quieres añadirla
            </p>
          </div>{" "}
          <div className="flex items-start space-x-3">
            <Hand className="text-emerald-500 mt-0.5" size={16} />
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Los días disponibles se resaltarán en verde
            </p>
          </div>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileInstructions;
