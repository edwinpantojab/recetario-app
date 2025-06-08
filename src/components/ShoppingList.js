/**
 * @fileoverview Componente ShoppingList optimizado para el Recetario Mágico
 * Gestiona listas de compras con categorías, presupuesto y persistencia local
 * Optimizado para rendimiento y manejo de errores
 * @author Sistema de gestión de recetas
 * @version 2.0.0
 */

import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import {
  ShoppingCart,
  PlusCircle,
  RotateCcw,
  X,
  Tag,
  Plus,
  Minus,
  Trash2,
} from "lucide-react";
import CustomConfirmModal from "./ui/CustomConfirmModal"; // Corregido: Se movió a la subcarpeta ui
import { saveData, loadData } from "../data/localStorageHelpers";
import { DEFAULT_SHOPPING_ITEMS } from "../data/defaultShoppingItems";
import { DEFAULT_SHOPPING_CATEGORIES } from "../data/constants";
import { trackRecipeEvent } from "../utils/analytics";

// =============================================================================
// CONFIGURACIÓN Y OPTIMIZACIONES DEL COMPONENTE
// =============================================================================

/**
 * Configuración optimizada para localStorage con debounce
 * Mejora el rendimiento evitando escrituras excesivas
 */
const STORAGE_CONFIG = Object.freeze({
  ITEMS_KEY: "shoppingItems",
  SETTINGS_KEY: "shoppingListSettings",
  DEBOUNCE_DELAY: 500, // ms
});

/**
 * Configuración de formateo de precios
 * Centralizada para consistencia en toda la aplicación
 */
const PRICE_CONFIG = Object.freeze({
  MIN_VALUE_FOR_FORMATTING: 1000,
  THOUSANDS_SEPARATOR: ".",
  DECIMAL_SEPARATOR: ",",
  DECIMAL_PLACES: 0,
});

/**
 * Sistema de logging condicional para desarrollo
 * Permite desactivar logs fácilmente en producción
 */
const DEBUG_MODE = process.env.NODE_ENV === "development";
const log = {
  error: DEBUG_MODE ? (...args) => console.error(...args) : () => {}, // eslint-disable-line no-console
  warn: DEBUG_MODE ? (...args) => console.warn(...args) : () => {}, // eslint-disable-line no-console
  info: DEBUG_MODE ? (...args) => console.info(...args) : () => {}, // eslint-disable-line no-console
};

// =============================================================================
// HOOKS PERSONALIZADOS Y HELPERS
// =============================================================================

/**
 * Hook personalizado para formateo y parsing de precios
 * Optimizado para rendimiento con memoización
 */
const usePriceFormatting = () => {
  // Formatea un número como string con separadores de miles
  const formatPrice = useCallback(value => {
    if (value === null || value === undefined || isNaN(value) || value === 0) {
      return "";
    }

    const numValue = Number(value);
    if (numValue >= PRICE_CONFIG.MIN_VALUE_FOR_FORMATTING) {
      return numValue
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, PRICE_CONFIG.THOUSANDS_SEPARATOR);
    }

    return numValue.toString();
  }, []);

  // Parsea string formateado a número
  const parsePrice = useCallback(value => {
    if (!value || typeof value !== "string") return 0;

    const cleanValue = value.replace(/[^\d]/g, "");
    const numValue = parseInt(cleanValue, 10);
    return isNaN(numValue) ? 0 : numValue;
  }, []);

  // Formatea mientras se escribe (input en tiempo real)
  const formatWhileTyping = useCallback(value => {
    const numbersOnly = value.replace(/[^\d]/g, "");
    if (numbersOnly === "") return "";

    const numValue = parseInt(numbersOnly, 10);
    if (numValue >= PRICE_CONFIG.MIN_VALUE_FOR_FORMATTING) {
      return numValue
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, PRICE_CONFIG.THOUSANDS_SEPARATOR);
    }

    return numbersOnly;
  }, []);

  return { formatPrice, parsePrice, formatWhileTyping };
};

/**
 * Hook personalizado para gestión de localStorage con validación
 * Incluye validación de tipos y manejo de errores
 */
const useShoppingStorage = () => {
  // Carga items con validación de array
  const getLocalShoppingItems = useCallback(async () => {
    try {
      const items = await loadData(STORAGE_CONFIG.ITEMS_KEY, [
        ...DEFAULT_SHOPPING_ITEMS,
      ]);
      return Array.isArray(items) ? items : [...DEFAULT_SHOPPING_ITEMS];
    } catch (error) {
      log.error("Error cargando items de localStorage:", error);
      return [...DEFAULT_SHOPPING_ITEMS];
    }
  }, []);

  // Guarda items con validación
  const setLocalShoppingItems = useCallback(async items => {
    try {
      if (!Array.isArray(items)) {
        throw new Error("Items debe ser un array");
      }
      await saveData(STORAGE_CONFIG.ITEMS_KEY, items);
    } catch (error) {
      log.error("Error guardando items en localStorage:", error);
      throw error;
    }
  }, []);

  // Carga configuraciones con valores por defecto
  const getLocalShoppingSettings = useCallback(async () => {
    try {
      const settings = await loadData(STORAGE_CONFIG.SETTINGS_KEY, {
        customCategories: [],
        budget: "",
      });
      return {
        customCategories: Array.isArray(settings.customCategories)
          ? settings.customCategories
          : [],
        budget: settings.budget || "",
      };
    } catch (error) {
      log.error("Error cargando configuraciones de localStorage:", error);
      return { customCategories: [], budget: "" };
    }
  }, []);

  // Guarda configuraciones
  const setLocalShoppingSettings = useCallback(async settings => {
    try {
      await saveData(STORAGE_CONFIG.SETTINGS_KEY, settings);
    } catch (error) {
      log.error("Error guardando configuraciones en localStorage:", error);
      throw error;
    }
  }, []);

  return {
    getLocalShoppingItems,
    setLocalShoppingItems,
    getLocalShoppingSettings,
    setLocalShoppingSettings,
  };
};

/**
 * Componente ShoppingList.
 * Permite a los usuarios gestionar una lista de compras, añadir/eliminar productos,
 * categorizarlos, y llevar un control de un presupuesto.
 *
 * @param {object} props - Las propiedades del componente.
 * @param {function} props.showToast - Función para mostrar notificaciones toast.
 */
const ShoppingList = ({ showToast }) => {
  // Estados del componente con validación de arrays
  const [shoppingItems, setShoppingItems] = useState([]);
  const [newItemName, setNewItemName] = useState("");
  const [newItemCategory, setNewItemCategory] = useState("Supermercado");
  // NUEVO: Estado para filtrar por categorías
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState(
    "Todas las categorías"
  );
  const [isLoadingShoppingList, setIsLoadingShoppingList] = useState(true);
  const [errorShoppingList, setErrorShoppingList] = useState(null);

  const [userShoppingCategories, setUserShoppingCategories] = useState([]);
  const [newCustomCategory, setNewCustomCategory] = useState("");
  const [budget, setBudget] = useState("");
  const [isConfirmDeleteItemModalOpen, setIsConfirmDeleteItemModalOpen] =
    useState(false);
  const [itemToDeleteId, setItemToDeleteId] = useState(null);

  const [isConfirmResetModalOpen, setIsConfirmResetModalOpen] = useState(false);
  const [resetAction, setResetAction] = useState(null);

  const saveTimeoutRef = useRef(null); // Ref para el temporizador de debounce

  // Usar los hooks personalizados optimizados
  const { formatPrice, parsePrice, formatWhileTyping } = usePriceFormatting();
  const {
    getLocalShoppingItems,
    setLocalShoppingItems,
    getLocalShoppingSettings,
    setLocalShoppingSettings,
  } = useShoppingStorage();

  // Cargar settings y items de localStorage al montar con validación de arrays
  useEffect(() => {
    const loadData = async () => {
      setIsLoadingShoppingList(true);
      try {
        const localItems = await getLocalShoppingItems();
        const localSettings = await getLocalShoppingSettings();

        // Validar que localItems sea un array
        const validItems = Array.isArray(localItems) ? localItems : [];
        setShoppingItems(validItems);

        setUserShoppingCategories(
          Array.isArray(localSettings.customCategories)
            ? localSettings.customCategories
            : []
        );

        setBudget(
          localSettings.budget
            ? formatPrice(parsePrice(localSettings.budget))
            : ""
        );
        setIsLoadingShoppingList(false);
      } catch (e) {
        log.error("Error cargando datos:", e);
        setErrorShoppingList(e);
        setIsLoadingShoppingList(false);
        // Inicializar con arrays vacíos en caso de error
        setShoppingItems([]);
        setUserShoppingCategories([]);
        setBudget("");
        showToast && showToast("Error al cargar datos de la lista.", "error");
      }
    };

    loadData();
  }, [
    getLocalShoppingItems,
    getLocalShoppingSettings,
    showToast,
    formatPrice,
    parsePrice,
  ]);

  // Actualiza settings en localStorage usando el hook optimizado
  const updateSettings = useCallback(
    async newSettings => {
      try {
        await setLocalShoppingSettings(newSettings);
        setUserShoppingCategories(
          Array.isArray(newSettings.customCategories)
            ? newSettings.customCategories
            : []
        );
        // Formatear el presupuesto al actualizar settings para mantener la UI consistente
        setBudget(
          newSettings.budget ? formatPrice(parsePrice(newSettings.budget)) : ""
        );
      } catch (error) {
        log.error("Error actualizando configuraciones:", error);
        showToast && showToast("Error al guardar configuraciones.", "error");
      }
    },
    [setLocalShoppingSettings, formatPrice, parsePrice, showToast]
  );

  // Actualiza items en localStorage con debounce usando el hook optimizado
  const updateItems = useCallback(
    newItems => {
      // Validar que newItems sea un array
      const validItems = Array.isArray(newItems) ? newItems : [];
      setShoppingItems([...validItems]); // Actualiza la UI inmediatamente

      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current); // Limpia el temporizador anterior
      }

      saveTimeoutRef.current = setTimeout(async () => {
        try {
          await setLocalShoppingItems(validItems); // Guarda en localStorage después de un retraso
        } catch (error) {
          log.error("Error guardando items:", error);
          showToast && showToast("Error al guardar la lista.", "error");
        }
      }, STORAGE_CONFIG.DEBOUNCE_DELAY);
    },
    [setLocalShoppingItems, showToast]
  );

  // Efecto para limpiar el temporizador al desmontar
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  // Combina las categorías por defecto con las categorías personalizadas del usuario
  const allShoppingCategories = useMemo(() => {
    const orderedCategories = [...DEFAULT_SHOPPING_CATEGORIES];
    const customCategoriesToAdd = userShoppingCategories
      .filter(cat => !DEFAULT_SHOPPING_CATEGORIES.includes(cat))
      .sort((a, b) => a.localeCompare(b));
    return [...orderedCategories, ...customCategoriesToAdd];
  }, [userShoppingCategories]);

  // Asegura que la categoría del nuevo ítem sea siempre una categoría válida
  useEffect(() => {
    if (
      allShoppingCategories.length > 0 &&
      !allShoppingCategories.includes(newItemCategory)
    ) {
      setNewItemCategory(allShoppingCategories[0]);
    }
  }, [allShoppingCategories, newItemCategory]);

  // Añadir una nueva categoría personalizada
  const handleAddCustomCategory = useCallback(async () => {
    if (!newCustomCategory.trim()) return; // Evitar añadir categorías vacías
    const categoryToAdd = newCustomCategory.trim();
    if (
      allShoppingCategories
        .map(c => c.toLowerCase())
        .includes(categoryToAdd.toLowerCase())
    ) {
      showToast && showToast("Esa categoría ya existe.", "warning");
      return;
    }
    try {
      const newSettings = await getLocalShoppingSettings();
      newSettings.customCategories = [
        ...(Array.isArray(newSettings.customCategories)
          ? newSettings.customCategories
          : []),
        categoryToAdd,
      ];
      await updateSettings(newSettings);
      setNewCustomCategory("");
      showToast && showToast("Categoría añadida.", "success");
    } catch (error) {
      log.error("Error añadiendo categoría:", error);
      showToast && showToast("Error al añadir categoría.", "error");
    }
  }, [
    newCustomCategory,
    allShoppingCategories,
    updateSettings,
    showToast,
    getLocalShoppingSettings,
  ]);

  // Eliminar una categoría personalizada
  const handleDeleteCustomCategory = useCallback(
    async categoryToDelete => {
      if (DEFAULT_SHOPPING_CATEGORIES.includes(categoryToDelete)) {
        showToast &&
          showToast("No puedes eliminar una categoría por defecto.", "error");
        return;
      }
      try {
        // Actualiza settings
        const newSettings = await getLocalShoppingSettings();
        newSettings.customCategories = (
          Array.isArray(newSettings.customCategories)
            ? newSettings.customCategories
            : []
        ).filter(cat => cat !== categoryToDelete);
        await updateSettings(newSettings);

        // Mueve los ítems de la categoría eliminada a "Otros"
        const currentItems = await getLocalShoppingItems();
        const validItems = Array.isArray(currentItems) ? currentItems : [];
        const newItems = validItems.map(item =>
          item.category === categoryToDelete
            ? { ...item, category: "Otros" }
            : item
        );
        updateItems(newItems);
        showToast &&
          showToast(
            `Categoría "${categoryToDelete}" eliminada. Items movidos a "Otros".`,
            "success"
          );
      } catch (error) {
        log.error("Error eliminando categoría:", error);
        showToast && showToast("Error al eliminar categoría.", "error");
      }
    },
    [
      updateSettings,
      updateItems,
      showToast,
      getLocalShoppingSettings,
      getLocalShoppingItems,
    ]
  );
  // Añadir un nuevo ítem a la lista de compras con validación
  const handleAddItem = useCallback(
    e => {
      e.preventDefault();
      if (newItemName.trim() === "") return;

      // Validar que shoppingItems sea un array
      const currentItems = Array.isArray(shoppingItems) ? shoppingItems : [];

      const newItem = {
        id: `item-${Date.now()}-${Math.random()}`,
        name: newItemName.trim(),
        checked: false,
        price: null, // Inicia sin precio
        quantity: 1, // La cantidad siempre inicia en 1
        custom: true,
        category: newItemCategory || "Supermercado",
        createdAt: new Date().toISOString(),
        toBuy: false,
      };
      const newItems = [...currentItems, newItem];
      updateItems(newItems);

      // Track item added to shopping list
      trackRecipeEvent.addToShoppingList(newItem.id, {
        itemName: newItem.name,
        category: newItem.category,
        listSize: newItems.length,
      });

      setNewItemName("");
      showToast && showToast("Producto añadido.", "success");
    },
    [newItemName, newItemCategory, shoppingItems, updateItems, showToast]
  );
  // Agrupa los ítems de la lista de compras por categoría y los ordena alfabéticamente por nombre
  // ACTUALIZADO: Incluye filtro por categorías
  const groupedItems = useMemo(() => {
    const grouped = {};
    // Validar que shoppingItems sea un array
    const validItems = Array.isArray(shoppingItems) ? shoppingItems : [];

    // Filtrar por categoría seleccionada
    const filteredByCategory =
      selectedCategoryFilter === "Todas las categorías"
        ? validItems
        : validItems.filter(item => item.category === selectedCategoryFilter);

    allShoppingCategories.forEach(category => {
      // Solo mostrar categorías que coincidan con el filtro
      if (
        selectedCategoryFilter !== "Todas las categorías" &&
        category !== selectedCategoryFilter
      ) {
        return;
      }

      const itemsInCategory = filteredByCategory
        .filter(item => item.category === category)
        .sort((a, b) => (a.name || "").localeCompare(b.name || ""));
      if (itemsInCategory.length > 0) {
        grouped[category] = itemsInCategory;
      }
    });
    return grouped;
  }, [allShoppingCategories, shoppingItems, selectedCategoryFilter]);

  // Calcula el presupuesto restante
  const numericBudget = parsePrice(budget) || 0;
  const totalCost = useMemo(
    () => {
      // Validar que shoppingItems sea un array
      const validItems = Array.isArray(shoppingItems) ? shoppingItems : [];

      return validItems.reduce((sum, item) => {
        const price = Number(item.price); // El precio ya es numérico aquí
        const quantity = Number(item.quantity) || 1;

        // Solo verificar que el precio sea válido y mayor que 0
        if (!isNaN(price) && price > 0) {
          const itemTotal = price * quantity;
          return sum + itemTotal;
        }
        return sum;
      }, 0);
    },
    [shoppingItems] // Asegurar que se recalcule cuando shoppingItems cambie
  );
  const remainingBudget = numericBudget - totalCost;

  // Actualizar un campo de un ítem existente (asegura que cantidad y precio sean números válidos)
  const handleUpdateItem = useCallback(
    (id, field, value) => {
      // Validar que shoppingItems sea un array
      const validItems = Array.isArray(shoppingItems) ? shoppingItems : [];

      const newItems = validItems.map(item => {
        if (item.id !== id) return item;

        const updates = { ...item };

        if (field === "price") {
          // Al actualizar el precio, parseamos el valor que viene del input (que puede estar formateado)
          const parsedValue = parsePrice(value);
          updates[field] = isNaN(parsedValue) ? null : parsedValue; // Guardar como número o null
        } else if (field === "quantity") {
          const numValue = parseInt(value, 10);
          updates[field] = isNaN(numValue) || numValue < 1 ? 1 : numValue;
        } else if (field === "checked" && value === true) {
          updates.checked = true;
          updates.toBuy = false; // Desmarcar toBuy si se marca checked
        } else if (field === "toBuy" && value === true) {
          updates.toBuy = true;
          updates.checked = false; // Desmarcar checked si se marca toBuy
        } else {
          updates[field] = value;
        }
        return updates;
      });

      updateItems(newItems);
    },
    [shoppingItems, updateItems, parsePrice] // Añadir parsePrice a las dependencias
  );

  // Abre el modal de confirmación para eliminar un ítem
  const confirmDeleteItem = useCallback(id => {
    setItemToDeleteId(id);
    setIsConfirmDeleteItemModalOpen(true);
  }, []);

  // Elimina un ítem de la lista de compras después de la confirmación
  const handleDeleteItem = useCallback(() => {
    if (!itemToDeleteId) return;
    setIsConfirmDeleteItemModalOpen(false);
    setItemToDeleteId(null);

    // Validar que shoppingItems sea un array
    const validItems = Array.isArray(shoppingItems) ? shoppingItems : [];
    const newItems = validItems.filter(item => item.id !== itemToDeleteId);
    updateItems(newItems);
    showToast && showToast("Producto eliminado.", "success");
  }, [itemToDeleteId, shoppingItems, updateItems, showToast]);
  // Elimina todos los ítems marcados como "comprados" y desmarca los seleccionados para comprar
  const handleClearCheckedItems = useCallback(() => {
    // Validar que shoppingItems sea un array
    const validItems = Array.isArray(shoppingItems) ? shoppingItems : [];

    // Opción 1: Eliminar los items chequeados y resetear campos de los restantes
    const itemsToKeep = validItems.filter(item => !item.checked);
    const newItemsAfterClearing = itemsToKeep.map(item => ({
      ...item,
      toBuy: false, // Si se limpian los comprados, los que quedan para comprar también se resetean
    }));

    updateItems(newItemsAfterClearing); // Usar la lista filtrada y reseteada
    showToast && showToast("Lista limpiada.", "success");
  }, [shoppingItems, updateItems, showToast]);
  // Nueva función para restablecer completamente cuando el presupuesto es excedido
  const handleResetWhenBudgetExceeded = useCallback(() => {
    // Resetear todos los ítems a estado inicial
    const validItems = Array.isArray(shoppingItems) ? shoppingItems : [];
    const resetItems = validItems.map(item => ({
      ...item,
      checked: false,
      toBuy: false,
      quantity: 1,
      price: null,
      priceDisplay: undefined, // Limpiar campo temporal
    }));

    updateItems(resetItems);

    // También resetear el presupuesto
    setBudget("");

    showToast && showToast("Todo ha sido restablecido.", "success");
  }, [shoppingItems, updateItems, showToast]);

  // Función para mostrar confirmación antes de restablecer
  const confirmReset = useCallback(() => {
    setResetAction(remainingBudget < 0 ? "full" : "partial");
    setIsConfirmResetModalOpen(true);
  }, [remainingBudget]);

  // Función para ejecutar el reset confirmado
  const executeReset = useCallback(() => {
    if (resetAction === "full") {
      handleResetWhenBudgetExceeded();
    } else {
      handleClearCheckedItems();
    }
    setIsConfirmResetModalOpen(false);
    setResetAction(null);
  }, [resetAction, handleResetWhenBudgetExceeded, handleClearCheckedItems]);

  // Maneja el cambio en el input del presupuesto con formateo en tiempo real
  const handleBudgetChange = useCallback(
    e => {
      const rawValue = e.target.value;
      const formattedValue = formatWhileTyping(rawValue);
      setBudget(formattedValue);
    },
    [formatWhileTyping]
  );

  // Formatea el presupuesto al perder el foco
  const handleBudgetBlur = useCallback(() => {
    const numBudget = parsePrice(budget);
    setBudget(isNaN(numBudget) ? "" : formatPrice(numBudget));
  }, [budget, formatPrice, parsePrice]);

  // ACTUALIZAR: Nuevo manejador para cambios en precios de productos
  const handlePriceInputChange = useCallback(
    (itemId, rawValue) => {
      const formattedValue = formatWhileTyping(rawValue);

      // Validar que shoppingItems sea un array
      const validItems = Array.isArray(shoppingItems) ? shoppingItems : [];

      // Actualizar inmediatamente en la UI con el valor formateado
      const newItems = validItems.map(item => {
        if (item.id !== itemId) return item;

        // Guardar tanto el valor formateado (para mostrar) como el numérico (para cálculos)
        const numericValue = parsePrice(formattedValue);
        return {
          ...item,
          price: isNaN(numericValue) ? null : numericValue,
          priceDisplay: formattedValue, // Nuevo campo temporal para mostrar
        };
      });

      updateItems(newItems);
    },
    [shoppingItems, updateItems, formatWhileTyping, parsePrice]
  );

  // ACTUALIZAR: Maneja cuando se pierde el foco en un input de precio
  const handlePriceInputBlur = useCallback(
    itemId => {
      // Validar que shoppingItems sea un array
      const validItems = Array.isArray(shoppingItems) ? shoppingItems : [];

      const newItems = validItems.map(item => {
        if (item.id !== itemId) return item;

        // Limpiar el campo temporal de display
        const { priceDisplay, ...cleanItem } = item;
        return cleanItem;
      });

      updateItems(newItems);
    },
    [shoppingItems, updateItems]
  );

  // Muestra un indicador de carga mientras se obtienen los datos
  if (isLoadingShoppingList) {
    return <div className="text-center p-4">Cargando lista de compras...</div>;
  }

  // Muestra un mensaje de error si falla la carga
  if (errorShoppingList) {
    return (
      <div className="text-center p-4 text-red-500">
        Error al cargar la lista: {errorShoppingList.message}
      </div>
    );
  }

  return (
    <div
      className="bg-white dark:bg-gradient-to-br dark:from-slate-900/80 dark:to-slate-800/60 p-3 sm:p-4 rounded-xl shadow-xl flex flex-col w-full backdrop-blur-sm border dark:border-slate-600/30"
      style={{ height: "calc(100vh - 150px)" }}
    >
      <h2 className="text-xl sm:text-2xl font-semibold text-emerald-700 dark:text-emerald-400 mb-3 flex items-center break-words">
        <ShoppingCart size={24} className="mr-2" /> Mi Lista de Compras
      </h2>
      <div className="flex-grow overflow-y-auto pr-0.5 custom-scrollbar">
        {" "}
        {/* Sección de Presupuesto */}
        <div className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-green-50 dark:from-slate-700/50 dark:to-slate-600/50 rounded-xl border border-blue-200 dark:border-slate-600 shadow-sm">
          <label
            htmlFor="budget"
            className="block text-sm font-medium text-blue-700 dark:text-blue-300 mb-2"
          >
            💰 Mi Presupuesto
          </label>
          <div className="flex items-center gap-3">
            <input
              type="text"
              id="budget"
              placeholder="Ej: 500.000"
              value={budget}
              onChange={handleBudgetChange}
              onBlur={handleBudgetBlur}
              className="flex-1 p-3 rounded-lg border-2 border-blue-200 dark:border-blue-400/30 bg-white dark:bg-gradient-to-br dark:from-slate-800/50 dark:to-slate-700/30 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 dark:focus:border-blue-400 dark:focus:ring-blue-400/50 transition-all duration-200 shadow-sm backdrop-blur-sm"
            />
            <button
              onClick={async () => {
                // Guarda el presupuesto en localStorage y actualiza settings
                try {
                  const newSettings = await getLocalShoppingSettings();
                  newSettings.budget = budget;
                  await updateSettings(newSettings);
                  showToast && showToast("Presupuesto guardado.", "success");
                } catch (error) {
                  log.error("Error guardando presupuesto:", error);
                  showToast &&
                    showToast("Error al guardar presupuesto.", "error");
                }
              }}
              className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 font-medium shadow-sm"
            >
              💾 Guardar
            </button>
          </div>
        </div>{" "}
        {/* Formulario para añadir nuevo producto */}
        <form
          onSubmit={handleAddItem}
          className="mb-4 p-4 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-slate-700/50 dark:to-slate-600/50 rounded-xl border border-emerald-200 dark:border-slate-600 shadow-sm"
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label
                htmlFor="newItemName"
                className="block text-sm font-medium text-emerald-700 dark:text-emerald-300 mb-1"
              >
                🛒 Producto
              </label>
              <input
                type="text"
                id="newItemName"
                placeholder="Ej: Leche descremada"
                value={newItemName}
                onChange={e => setNewItemName(e.target.value)}
                className="w-full p-3 rounded-lg border-2 border-emerald-200 dark:border-emerald-400/30 bg-white dark:bg-gradient-to-br dark:from-slate-800/50 dark:to-slate-700/30 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 dark:focus:border-emerald-400 dark:focus:ring-emerald-400/50 transition-all duration-200 shadow-sm backdrop-blur-sm"
              />
            </div>
            <div>
              <label
                htmlFor="newItemCategory"
                className="block text-sm font-medium text-emerald-700 dark:text-emerald-300 mb-1"
              >
                🏷️ Categoría
              </label>
              <select
                id="newItemCategory"
                value={newItemCategory}
                onChange={e => setNewItemCategory(e.target.value)}
                className="w-full p-3 rounded-lg border-2 border-emerald-200 dark:border-emerald-400/30 bg-white dark:bg-gradient-to-br dark:from-slate-800/50 dark:to-slate-700/30 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 dark:focus:border-emerald-400 dark:focus:ring-emerald-400/50 transition-all duration-200 shadow-sm backdrop-blur-sm"
              >
                {allShoppingCategories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex justify-end mt-3">
            <button
              type="submit"
              className="px-6 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-all duration-200 font-medium shadow-sm flex items-center"
            >
              <PlusCircle size={18} className="mr-2" /> ✅ Añadir Producto
            </button>
          </div>
        </form>{" "}
        {/* Sección para añadir/gestionar categorías personalizadas */}
        <div className="mb-4 p-4 bg-gradient-to-r from-sky-50 to-indigo-50 dark:from-slate-700/50 dark:to-slate-600/50 rounded-xl border border-sky-200 dark:border-slate-600 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex-1">
              <label className="block text-sm font-medium text-sky-700 dark:text-sky-300 mb-1">
                🏷️ Nueva Categoría
              </label>
              <input
                type="text"
                placeholder="Ej: Productos orgánicos"
                value={newCustomCategory}
                onChange={e => setNewCustomCategory(e.target.value)}
                className="w-full p-3 rounded-lg border-2 border-sky-200 dark:border-sky-400/30 bg-white dark:bg-gradient-to-br dark:from-slate-800/50 dark:to-slate-700/30 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-sky-400 focus:border-sky-400 dark:focus:border-sky-400 dark:focus:ring-sky-400/50 transition-all duration-200 shadow-sm backdrop-blur-sm"
              />
            </div>
            <button
              onClick={handleAddCustomCategory}
              className="px-4 py-2.5 bg-sky-600 text-white rounded-lg hover:bg-sky-700 focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 transition-all duration-200 font-medium shadow-sm flex items-center self-end"
            >
              <Tag size={16} className="mr-1" /> ➕ Añadir
            </button>
          </div>{" "}
          {userShoppingCategories.filter(
            cat => !DEFAULT_SHOPPING_CATEGORIES.includes(cat)
          ).length > 0 && (
            <div className="border-t border-sky-200 dark:border-slate-600 pt-3">
              <span className="text-sm font-medium text-sky-700 dark:text-sky-300 mb-2 block">
                🏷️ Mis Categorías Personalizadas:
              </span>
              <div className="flex flex-wrap gap-2">
                {userShoppingCategories
                  .filter(cat => !DEFAULT_SHOPPING_CATEGORIES.includes(cat))
                  .map(cat => (
                    <span
                      key={cat}
                      className="bg-sky-100 dark:bg-sky-800 border border-sky-200 dark:border-sky-600 px-3 py-1.5 rounded-full flex items-center text-sm text-sky-800 dark:text-sky-200 shadow-sm"
                    >
                      {cat}
                      <button
                        onClick={() => handleDeleteCustomCategory(cat)}
                        className="ml-2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 p-1 rounded-full hover:bg-red-100 dark:hover:bg-red-800 transition-colors"
                        title={`Eliminar categoría ${cat}`}
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
              </div>
            </div>
          )}
        </div>
        {/* Filtro por categoría */}
        <div className="mb-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-slate-700/50 dark:to-slate-600/50 rounded-xl border border-purple-200 dark:border-slate-600 shadow-sm">
          <label className="block text-sm font-medium text-purple-700 dark:text-purple-300 mb-2">
            🎯 Filtrar por Categoría
          </label>
          <div className="flex items-center gap-3">
            <select
              value={selectedCategoryFilter}
              onChange={e => setSelectedCategoryFilter(e.target.value)}
              className="flex-1 p-3 rounded-lg border-2 border-purple-200 dark:border-purple-400/30 bg-white dark:bg-gradient-to-br dark:from-slate-800/50 dark:to-slate-700/30 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-purple-400 focus:border-purple-400 dark:focus:border-purple-400 dark:focus:ring-purple-400/50 transition-all duration-200 shadow-sm backdrop-blur-sm"
            >
              <option value="Todas las categorías">Todas las categorías</option>
              {allShoppingCategories.map(cat => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>
        {/* Lista de productos agrupados por categoría */}
        <div className="space-y-2 pb-4">
          {Object.keys(groupedItems).length > 0 ? (
            Object.entries(groupedItems).map(
              ([category, items]) =>
                items.length > 0 && (
                  <div key={category}>
                    <h3 className="text-md font-semibold text-emerald-600 dark:text-emerald-400 mb-1.5 border-b pb-1 border-slate-200 dark:border-slate-700">
                      {category}
                    </h3>
                    <ul className="space-y-1.5">
                      {items.map(item => (
                        <li
                          key={item.id}
                          className={`flex items-center bg-gradient-to-r from-emerald-50 to-blue-50 dark:bg-gradient-to-br dark:from-slate-800/60 dark:to-slate-700/40 p-2 rounded-lg shadow-sm border-2 border-emerald-200 dark:border-emerald-400/30 transition-all duration-200 hover:shadow-md backdrop-blur-sm ${
                            item.checked ? "opacity-60" : ""
                          }`}
                        >
                          {/* Checkbox para "toBuy" (seleccionar para comprar) */}{" "}
                          <input
                            type="checkbox"
                            checked={item.toBuy || false}
                            onChange={e =>
                              handleUpdateItem(
                                item.id,
                                "toBuy",
                                e.target.checked
                              )
                            }
                            className="h-5 w-5 rounded-md appearance-none border-2 border-blue-300 dark:border-blue-400/50 bg-gradient-to-br from-blue-50 to-white dark:from-slate-800/80 dark:to-slate-700/60 checked:bg-gradient-to-br checked:from-blue-500 checked:to-blue-600 dark:checked:from-blue-400 dark:checked:to-blue-500 checked:border-blue-600 dark:checked:border-blue-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400/50 focus:ring-offset-1 mr-2 flex-shrink-0 transition-all duration-200 cursor-pointer relative checked:after:content-['✓'] checked:after:absolute checked:after:inset-0 checked:after:flex checked:after:items-center checked:after:justify-center checked:after:text-white checked:after:text-sm checked:after:font-bold checked:after:drop-shadow-sm"
                            title="Seleccionar para comprar"
                          />
                          {/* Nombre del producto */}
                          <span
                            className={`flex-grow text-sm transition-colors font-semibold ${
                              item.checked
                                ? "line-through text-red-600 dark:text-red-400"
                                : "text-slate-700 dark:text-slate-100"
                            }`}
                          >
                            {item.name}
                          </span>
                          {/* Controles de cantidad y precio */}
                          <div className="flex items-center space-x-1 ml-1.5 text-xs">
                            {/* Botón para disminuir cantidad */}
                            <button
                              onClick={() =>
                                handleUpdateItem(
                                  item.id,
                                  "quantity",
                                  Math.max(1, (Number(item.quantity) || 1) - 1)
                                )
                              }
                              className="p-0.5 text-slate-500 dark:text-white hover:text-red-500 dark:hover:text-red-400 rounded-full"
                              aria-label="Disminuir cantidad"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="w-4 text-center text-slate-700 dark:text-white">
                              {item.quantity || 1}
                            </span>
                            {/* Botón para aumentar cantidad */}
                            <button
                              onClick={() =>
                                handleUpdateItem(
                                  item.id,
                                  "quantity",
                                  (Number(item.quantity) || 1) + 1
                                )
                              }
                              className="p-0.5 text-slate-500 dark:text-white hover:text-green-500 dark:hover:text-green-400 rounded-full"
                              aria-label="Aumentar cantidad"
                            >
                              <Plus size={14} />
                            </button>{" "}
                            {/* ACTUALIZAR: Input para precio unitario con formateo en tiempo real */}
                            <input
                              type="text"
                              placeholder="Precio"
                              title="Precio Unitario"
                              value={
                                item.priceDisplay !== undefined
                                  ? item.priceDisplay
                                  : item.price !== null
                                    ? formatPrice(item.price)
                                    : ""
                              }
                              onChange={e =>
                                handlePriceInputChange(item.id, e.target.value)
                              }
                              onBlur={() => handlePriceInputBlur(item.id)}
                              className="w-16 p-1 rounded-md border-2 border-emerald-300 dark:border-emerald-400/30 bg-white dark:bg-gradient-to-br dark:from-slate-800/50 dark:to-slate-700/30 dark:text-slate-100 text-right text-xs focus:ring-2 focus:ring-emerald-400 dark:focus:ring-emerald-400/50 transition-all duration-200 backdrop-blur-sm"
                            />
                            {/* Input de solo lectura para el total del artículo con formato */}
                            <input
                              type="text"
                              readOnly
                              value={
                                item.price && item.price > 0
                                  ? formatPrice(
                                      (item.price || 0) * (item.quantity || 1)
                                    )
                                  : ""
                              }
                              className="w-20 p-1 rounded-md border-2 border-blue-300 dark:border-blue-400/30 bg-white dark:bg-gradient-to-br dark:from-slate-800/50 dark:to-slate-700/30 dark:text-slate-100 text-right text-xs focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-400/50 transition-all duration-200 backdrop-blur-sm"
                              title="Total Artículo"
                            />
                            {/* Checkbox para "checked" (marcar como comprado) */}{" "}
                            <input
                              type="checkbox"
                              checked={item.checked || false}
                              onChange={e =>
                                handleUpdateItem(
                                  item.id,
                                  "checked",
                                  e.target.checked
                                )
                              }
                              className="h-5 w-5 rounded-md appearance-none border-2 border-emerald-300 dark:border-emerald-400/50 bg-gradient-to-br from-emerald-50 to-white dark:from-slate-800/80 dark:to-slate-700/60 checked:bg-gradient-to-br checked:from-emerald-500 checked:to-emerald-600 dark:checked:from-emerald-400 dark:checked:to-emerald-500 checked:border-emerald-600 dark:checked:border-emerald-400 focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400/50 focus:ring-offset-1 ml-2 flex-shrink-0 transition-all duration-200 cursor-pointer relative checked:after:content-['✓'] checked:after:absolute checked:after:inset-0 checked:after:flex checked:after:items-center checked:after:justify-center checked:after:text-white checked:after:text-sm checked:after:font-bold checked:after:drop-shadow-sm"
                              title="Marcar como comprado"
                            />
                            {/* Botón para eliminar ítem */}
                            <button
                              onClick={() => confirmDeleteItem(item.id)}
                              className="p-1 text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 rounded-full"
                              aria-label="Eliminar producto"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )
            )
          ) : (
            <div className="text-center py-8 text-slate-500 dark:text-slate-400 text-sm">
              Tu lista está vacía.
            </div>
          )}
        </div>
      </div>
      {/* Pie de página con resumen de costos y botón de restablecer */}
      <div className="mt-auto pt-3 border-t border-slate-200 dark:border-slate-600/50 bg-white dark:bg-gradient-to-r dark:from-slate-900/70 dark:to-slate-800/50 pb-1 rounded-b-xl backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="text-center sm:text-left">
            <div className="text-md sm:text-lg font-semibold text-emerald-800 dark:text-emerald-300">
              Total Compra: ${totalCost > 0 ? formatPrice(totalCost) : "0"}
            </div>
            {/* CORRECCIÓN: Usar numericBudget > 0 en lugar de solo 'budget' para mostrar el restante solo si hay un presupuesto válido */}
            {numericBudget > 0 && (
              <div
                className={`text-xs font-medium ${
                  remainingBudget < 0
                    ? "text-red-500 dark:text-red-400"
                    : "text-green-600 dark:text-green-400"
                }`}
              >
                Presupuesto Restante: ${formatPrice(Math.abs(remainingBudget))}
                {remainingBudget < 0 && " (Excedido)"}
              </div>
            )}
          </div>{" "}
          {/* Botón para restablecer - comportamiento condicional */}
          <button
            onClick={confirmReset}
            disabled={
              remainingBudget < 0
                ? false // Siempre habilitado cuando el presupuesto está excedido
                : !Array.isArray(shoppingItems) ||
                  shoppingItems.every(item => !item.checked && !item.toBuy)
            }
            className="px-3 py-1.5 bg-orange-500 text-white rounded-lg shadow-md hover:bg-orange-600 disabled:opacity-50 flex items-center justify-center font-medium text-xs w-full sm:w-auto whitespace-nowrap"
            title={
              remainingBudget < 0
                ? "Restablecer todo debido a presupuesto excedido"
                : "Limpiar items marcados como comprados"
            }
          >
            <RotateCcw size={14} className="mr-1" />
            {remainingBudget < 0 ? "Restablecer Todo" : "Restablecer"}
          </button>
        </div>
      </div>{" "}
      {/* Modal de confirmación para eliminar un ítem */}
      <CustomConfirmModal
        isOpen={isConfirmDeleteItemModalOpen}
        onClose={() => setIsConfirmDeleteItemModalOpen(false)}
        onConfirm={handleDeleteItem}
        title="🗑️ Confirmar Eliminación"
        message="¿Seguro que quieres eliminar este producto de la lista de compras?"
      />
      {/* Modal de confirmación para restablecer */}
      <CustomConfirmModal
        isOpen={isConfirmResetModalOpen}
        onClose={() => {
          setIsConfirmResetModalOpen(false);
          setResetAction(null);
        }}
        onConfirm={executeReset}
        title={
          resetAction === "full"
            ? "🔄 Restablecer Todo"
            : "🔄 Restablecer Lista"
        }
        message={
          resetAction === "full"
            ? "⚠️ Presupuesto excedido detectado.\n\nEsta acción restablecerá COMPLETAMENTE la lista:\n• Eliminará todos los precios\n• Restablecerá cantidades a 1\n• Desmarcará todos los productos\n• Limpiará el presupuesto\n\n¿Deseas continuar?"
            : "Esta acción eliminará todos los productos marcados como comprados y desmarcará los productos seleccionados para comprar.\n\n¿Deseas continuar?"
        }
      />
    </div>
  );
};

// Memoización de ShoppingList para evitar renders innecesarios
export default React.memo(ShoppingList);
