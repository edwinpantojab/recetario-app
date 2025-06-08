/**
 * @fileoverview Items predeterminados para la lista de compras del Recetario Mágico
 * Contiene productos organizados por categorías para inicializar listas de compras
 * Optimizado para rendimiento y mantenibilidad
 * @author Sistema de gestión de recetas
 * @version 2.0.0
 */

import { DEFAULT_SHOPPING_CATEGORIES } from "./constants.js";

/**
 * Configuración optimizada para items de compras por defecto
 * Centralizadas para fácil mantenimiento y modificación
 */
const SHOPPING_CONFIG = Object.freeze({
  // Timestamp base para evitar recálculos repetidos de Date
  BASE_TIMESTAMP: new Date("2024-01-01T00:00:00.000Z").toISOString(),

  // Estados por defecto para todos los items
  DEFAULT_ITEM_STATE: Object.freeze({
    checked: false,
    price: null,
    quantity: 1,
    custom: false,
    toBuy: false,
  }),

  // Mapeo de categorías para mejor organización
  CATEGORIES: Object.freeze({
    SUPERMARKET: DEFAULT_SHOPPING_CATEGORIES[0], // "Supermercado"
    DAIRY: DEFAULT_SHOPPING_CATEGORIES[1], // "Lácteos"
    MEAT: DEFAULT_SHOPPING_CATEGORIES[2], // "Carnes"
    PRODUCE: DEFAULT_SHOPPING_CATEGORIES[3], // "Verduras y Frutas"
    HYGIENE: DEFAULT_SHOPPING_CATEGORIES[4], // "Aseo"
    OTHERS: DEFAULT_SHOPPING_CATEGORIES[5], // "Otros"
  }),
});

/**
 * Función auxiliar para crear un item de compras optimizado
 * Elimina duplicación de código y asegura consistencia
 *
 * @param {Object} itemData - Datos del item
 * @param {string} itemData.id - ID único del item
 * @param {string} itemData.name - Nombre del producto
 * @param {string} itemData.category - Categoría del producto
 * @returns {Object} Item formateado y optimizado
 */
const createShoppingItem = ({ id, name, category }) => {
  return Object.freeze({
    id,
    name,
    category,
    ...SHOPPING_CONFIG.DEFAULT_ITEM_STATE,
    createdAt: SHOPPING_CONFIG.BASE_TIMESTAMP,
  });
};

/**
 * Datos base para generar items por categoría
 * Organizados para fácil mantenimiento y modificación
 */
const ITEMS_DATA = Object.freeze({
  // =============================================================================
  // SUPERMERCADO 🛒
  // =============================================================================
  [SHOPPING_CONFIG.CATEGORIES.SUPERMARKET]: Object.freeze([
    { name: "Arroz", id: "item-super-1" },
    { name: "Pasta seco", id: "item-super-2" },
    { name: "Pasta fideos", id: "item-super-3" },
    { name: "Pasta sopa", id: "item-super-4" },
    { name: "Aceite vegetal", id: "item-super-5" },
    { name: "Aceite de oliva", id: "item-super-6" },
    { name: "Panela", id: "item-super-7" },
    { name: "Azúcar", id: "item-super-8" },
    { name: "Sal", id: "item-super-9" },
    { name: "Frijol", id: "item-super-10" },
    { name: "Lenteja", id: "item-super-11" },
    { name: "Arveja", id: "item-super-12" },
    { name: "Maíz peto", id: "item-super-13" },
    { name: "Garbanzo", id: "item-super-14" },
    { name: "Chocolate", id: "item-super-15" },
    { name: "Pan tajado", id: "item-super-16" },
    { name: "Tostadas", id: "item-super-17" },
    { name: "Galletas de sal", id: "item-super-18" },
    { name: "Galletas dulces", id: "item-super-19" },
    { name: "Harina de trigo", id: "item-super-20" },
    { name: "Harina de arepas", id: "item-super-21" },
    { name: "Maizena", id: "item-super-22" },
    { name: "Avena en hojuelas", id: "item-super-23" },
    { name: "Canela", id: "item-super-24" },
    { name: "Color", id: "item-super-25" },
    { name: "Bicarbonato", id: "item-super-26" },
    { name: "Vinagreta", id: "item-super-27" },
    { name: "Uvas pasas", id: "item-super-28" },
    { name: "Bocadillo", id: "item-super-29" },
    { name: "Café", id: "item-super-30" },
    { name: "Salsa de tomate", id: "item-super-31" },
    { name: "Durazno en lata", id: "item-super-32" },
    { name: "Salsa tártara", id: "item-super-33" },
    { name: "Mayonesa", id: "item-super-34" },
    { name: "Galletas de mesa", id: "item-super-35" },
    { name: "Café en grano", id: "item-super-36" },
    { name: "Comino", id: "item-super-37" },
    { name: "Clavo", id: "item-super-38" },
    { name: "Canela en astilla", id: "item-super-39" },
    { name: "Canela en polvo", id: "item-super-40" },
    { name: "Avena en harina", id: "item-super-41" },
    { name: "Mermelada", id: "item-super-42" },
    { name: "Papas fritas de paquete", id: "item-super-43" },
  ]),

  // =============================================================================
  // CARNES 🥩
  // =============================================================================
  [SHOPPING_CONFIG.CATEGORIES.MEAT]: Object.freeze([
    { name: "Pollo entero", id: "item-carnes-1" },
    { name: "Pollo molido", id: "item-carnes-2" },
    { name: "Pechuga de pollo", id: "item-carnes-3" },
    { name: "Pierna pernil", id: "item-carnes-4" },
    { name: "Carne molida", id: "item-carnes-5" },
    { name: "Carne de res", id: "item-carnes-6" },
    { name: "Carne de cerdo", id: "item-carnes-7" },
    { name: "Pescado", id: "item-carnes-8" },
    { name: "Salchichas", id: "item-carnes-9" },
  ]),

  // =============================================================================
  // LÁCTEOS 🥛
  // =============================================================================
  [SHOPPING_CONFIG.CATEGORIES.DAIRY]: Object.freeze([
    { name: "Queso tajado", id: "item-lacteos-1" },
    { name: "Queso entero", id: "item-lacteos-2" },
    { name: "Yogurt", id: "item-lacteos-3" },
    { name: "Yogurt en vaso", id: "item-lacteos-4" },
    { name: "Yogurt en bolsa", id: "item-lacteos-5" },
    { name: "Leche", id: "item-lacteos-6" },
    { name: "Leche en polvo", id: "item-lacteos-7" },
    { name: "Huevos", id: "item-lacteos-8" },
    { name: "Crema de leche", id: "item-lacteos-9" },
    { name: "Leche condensada", id: "item-lacteos-10" },
    { name: "Mantequilla de mesa", id: "item-lacteos-11" },
    { name: "Mantequilla para cocina", id: "item-lacteos-12" },
  ]),

  // =============================================================================
  // VERDURAS Y FRUTAS 🥕🍎
  // =============================================================================
  [SHOPPING_CONFIG.CATEGORIES.PRODUCE]: Object.freeze([
    { name: "Tomates", id: "item-verfrutas-1" },
    { name: "Cebollas cabezonas", id: "item-verfrutas-2" },
    { name: "Papas", id: "item-verfrutas-3" },
    { name: "Manzanas", id: "item-verfrutas-4" },
    { name: "Ajos", id: "item-verfrutas-5" },
    { name: "Papaya", id: "item-verfrutas-6" },
    { name: "Lulo", id: "item-verfrutas-7" },
    { name: "Tomate de árbol", id: "item-verfrutas-8" },
    { name: "Limones", id: "item-verfrutas-9" },
    { name: "Ahuyama", id: "item-verfrutas-10" },
    { name: "Calabacín", id: "item-verfrutas-11" },
    { name: "Naranjas", id: "item-verfrutas-12" },
    { name: "Mandarinas", id: "item-verfrutas-13" },
    { name: "Coliflor", id: "item-verfrutas-14" },
    { name: "Espinacas", id: "item-verfrutas-15" },
    { name: "Acelgas", id: "item-verfrutas-16" },
    { name: "Cebolla larga", id: "item-verfrutas-17" },
    { name: "Piña", id: "item-verfrutas-18" },
    { name: "Plátano verde", id: "item-verfrutas-19" },
    { name: "Plátano maduro", id: "item-verfrutas-20" },
    { name: "Bananos", id: "item-verfrutas-21" },
    { name: "Cerezas", id: "item-verfrutas-22" },
  ]),

  // =============================================================================
  // ASEO 🧼
  // =============================================================================
  [SHOPPING_CONFIG.CATEGORIES.HYGIENE]: Object.freeze([
    { name: "Jabón para manos", id: "item-aseo-1" },
    { name: "Jabón líquido para ropa", id: "item-aseo-2" },
    { name: "Jabón líquido para platos", id: "item-aseo-3" },
    { name: "Jabón lavavajillas", id: "item-aseo-4" },
    { name: "Jabón en pasta para ropa", id: "item-aseo-5" },
    { name: "Esponjas", id: "item-aseo-6" },
    { name: "Esponjillas", id: "item-aseo-7" },
    { name: "Tampones", id: "item-aseo-8" },
    { name: "Toallas higiénicas", id: "item-aseo-9" },
    { name: "Papel higiénico", id: "item-aseo-10" },
    { name: "Crema dental", id: "item-aseo-11" },
    { name: "Protectores", id: "item-aseo-12" },
    { name: "Cepillo de dientes", id: "item-aseo-13" },
    { name: "Guantes para ropa", id: "item-aseo-14" },
    { name: "Desodorante para dama", id: "item-aseo-15" },
    { name: "Desodorante para hombre", id: "item-aseo-16" },
    { name: "Shampoo para dama", id: "item-aseo-17" },
    { name: "Shampoo para hombre", id: "item-aseo-18" },
    { name: "Shampoo para niños", id: "item-aseo-19" },
    { name: "Crema corporal", id: "item-aseo-20" },
    { name: "Cepillo de dientes para adulto", id: "item-aseo-21" },
    { name: "Cepillo de dientes para niño", id: "item-aseo-22" },
    { name: "Crema corporal para hombre", id: "item-aseo-23" },
    { name: "Crema corporal para mujer", id: "item-aseo-24" },
    { name: "Crema dental para adulto", id: "item-aseo-25" },
    { name: "Crema dental para niños", id: "item-aseo-26" },
    { name: "Máquina de afeitar", id: "item-aseo-27" },
    { name: "Blanqueador", id: "item-aseo-28" },
    { name: "Suavizante para ropa", id: "item-aseo-29" },
    { name: "Bolsas de basura", id: "item-aseo-30" },
    { name: "Ambientador líquido", id: "item-aseo-31" },
  ]),
});

/**
 * Genera el array de items de compras optimizado
 * Evita duplicación de código y mejora el rendimiento
 *
 * @returns {Array} Array de items de compras formateados
 */
const generateShoppingItems = () => {
  const items = [];

  // Iterar sobre cada categoría y sus items
  Object.entries(ITEMS_DATA).forEach(([category, categoryItems]) => {
    categoryItems.forEach(({ name, id }) => {
      items.push(createShoppingItem({ id, name, category }));
    });
  });

  return Object.freeze(items);
};

/**
 * Array principal de items predeterminados para la lista de compras
 * Cada item incluye:
 * - id: Identificador único para el producto
 * - name: Nombre del producto
 * - checked: Estado de comprado (false por defecto)
 * - price: Precio unitario (null por defecto)
 * - quantity: Cantidad del producto (1 por defecto)
 * - custom: Indica si es personalizado (false para predeterminados)
 * - category: Categoría a la que pertenece
 * - createdAt: Fecha de creación en formato ISO
 * - toBuy: Estado de marcado para comprar (false por defecto)
 */
export const DEFAULT_SHOPPING_ITEMS = generateShoppingItems();

// =============================================================================
// COMPUTED VALUES - Valores derivados para optimización
// =============================================================================

/**
 * Map optimizado de items por categoría para acceso O(1)
 * Evita filtros repetidos en tiempo de ejecución
 */
export const ITEMS_BY_CATEGORY = Object.freeze(
  DEFAULT_SHOPPING_ITEMS.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {})
);

/**
 * Set optimizado de IDs de items para validación O(1)
 * Útil para verificar si un item existe
 */
export const ITEM_IDS_SET = new Set(
  DEFAULT_SHOPPING_ITEMS.map((item) => item.id)
);

/**
 * Map optimizado de items por ID para acceso directo O(1)
 * Evita búsquedas lineales en el array
 */
export const ITEMS_BY_ID = new Map(
  DEFAULT_SHOPPING_ITEMS.map((item) => [item.id, item])
);

/**
 * Estadísticas computadas de los items para métricas
 * Valores pre-calculados para mejor rendimiento
 */
export const SHOPPING_STATS = Object.freeze({
  TOTAL_ITEMS: DEFAULT_SHOPPING_ITEMS.length,
  CATEGORIES_COUNT: Object.keys(ITEMS_BY_CATEGORY).length,
  ITEMS_PER_CATEGORY: Object.freeze(
    Object.fromEntries(
      Object.entries(ITEMS_BY_CATEGORY).map(([category, items]) => [
        category,
        items.length,
      ])
    )
  ),
});

// =============================================================================
// UTILITY FUNCTIONS - Funciones de utilidad
// =============================================================================

/**
 * Obtiene items por categoría específica
 * Optimizado para acceso directo sin filtros
 *
 * @param {string} category - Nombre de la categoría
 * @returns {Array} Items de la categoría especificada
 */
export const getItemsByCategory = (category) => {
  return ITEMS_BY_CATEGORY[category] || [];
};

/**
 * Verifica si un ID de item existe
 * Optimizado con Set para búsqueda O(1)
 *
 * @param {string} itemId - ID del item a verificar
 * @returns {boolean} True si el item existe
 */
export const itemExists = (itemId) => {
  return ITEM_IDS_SET.has(itemId);
};

/**
 * Obtiene un item por su ID
 * Optimizado con Map para acceso directo O(1)
 *
 * @param {string} itemId - ID del item a obtener
 * @returns {Object|undefined} Item encontrado o undefined
 */
export const getItemById = (itemId) => {
  return ITEMS_BY_ID.get(itemId);
};

// =============================================================================
// DEPRECATED - Mantenidos para compatibilidad hacia atrás
// =============================================================================

/**
 * @deprecated Usar DEFAULT_SHOPPING_ITEMS en su lugar
 * Mantenido para compatibilidad con código existente
 */
export const defaultShoppingItems = DEFAULT_SHOPPING_ITEMS;
