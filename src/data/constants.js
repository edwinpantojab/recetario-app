/**
 * @fileoverview Constantes centralizadas para la aplicación Recetario Mágico
 * Define categorías, traducciones, configuraciones y datos por defecto
 * Optimizado para rendimiento y mantenibilidad
 * @author Sistema de gestión de recetas
 * @version 2.0.0
 */

/**
 * Categorías de recetas disponibles en la aplicación
 * Incluyen emojis para mejor representación visual y UX
 * Frozen para prevenir mutaciones accidentales y mejorar rendimiento
 */
export const RECIPE_CATEGORIES = Object.freeze([
  "Desayuno 🥐",
  "Almuerzo 🥗",
  "Cena 🍝",
  "Postre 🍰",
  "Snack 🍿",
  "Bebida 🍹",
  "Otro ✨",
]);

/**
 * Configuración de días de la semana
 * Utilizados para el planificador semanal
 * Frozen para prevenir mutaciones y mejorar rendimiento
 */
export const DAYS_OF_WEEK = Object.freeze([
  "lunes",
  "martes",
  "miercoles",
  "jueves",
  "viernes",
  "sabado",
  "domingo",
]);

/**
 * Traducciones de días de la semana con acentuación correcta
 * Mapea claves internas a nombres mostrados al usuario
 * Frozen para prevenir mutaciones y optimizar acceso
 */
export const DAY_TRANSLATIONS = Object.freeze({
  lunes: "Lunes",
  martes: "Martes",
  miercoles: "Miércoles",
  jueves: "Jueves",
  viernes: "Viernes",
  sabado: "Sábado",
  domingo: "Domingo",
});

/**
 * Categorías por defecto para la lista de compras
 * Organizadas por tipo de producto/sección del supermercado
 * Frozen para prevenir mutaciones accidentales
 */
export const DEFAULT_SHOPPING_CATEGORIES = Object.freeze([
  "Supermercado",
  "Lácteos",
  "Carnes",
  "Verduras y Frutas",
  "Aseo",
  "Otros",
]);

/**
 * Enlaces optimizados a sitios web de recetas online
 * Incluye sitios populares en español con iconos representativos
 * Frozen para prevenir mutaciones y mejorar rendimiento de rendering
 */
export const ONLINE_RECIPE_LINKS = Object.freeze([
  Object.freeze({
    id: "directo-paladar",
    name: "Directo al Paladar",
    url: "https://www.directoalpaladar.com/recetas",
    icon: "🍲",
    description: "Blog gastronómico con recetas tradicionales y modernas",
  }),
  Object.freeze({
    id: "elpais-recetas",
    name: "Recetas de Cocina (El País)",
    url: "https://elpais.com/elpais/recetas/",
    icon: "📰",
    description: "Sección de recetas del diario El País",
  }),
  Object.freeze({
    id: "gastronomia-cia",
    name: "Gastronomía & Cía",
    url: "https://www.gastronomiaycia.com/recetas/",
    icon: "🧑‍🍳",
    description: "Portal especializado en gastronomía y técnicas culinarias",
  }),
  Object.freeze({
    id: "bon-viveur",
    name: "Bon Viveur",
    url: "https://www.bonviveur.es/recetas",
    icon: "🍷",
    description: "Recetas gourmet y maridajes",
  }),
  Object.freeze({
    id: "divina-cocina",
    name: "Divina Cocina",
    url: "https://www.divinacocina.es/recetas/",
    icon: "🌟",
    description: "Recetas caseras y tradicionales",
  }),
  Object.freeze({
    id: "recetas-gratis",
    name: "Recetas Gratis",
    url: "https://www.recetasgratis.net/",
    icon: "🆓",
    description: "Amplio catálogo de recetas gratuitas",
  }),
]);

/**
 * Configuración centralizada de la aplicación
 * Valores por defecto y configuraciones globales optimizadas
 * Frozen para prevenir mutaciones accidentales
 */
export const APP_CONFIG = Object.freeze({
  // Configuración de notificaciones
  TOAST: Object.freeze({
    DURATION: 2500,
    POSITION: "top-right",
    MAX_VISIBLE: 3,
  }),

  // Configuración de localStorage optimizada
  STORAGE: Object.freeze({
    PREFIX: "recetario_",
    VERSION: "v2.0",
    KEYS: Object.freeze({
      RECIPES: "recipes",
      SHOPPING_LIST: "shoppingList",
      WEEKLY_PLAN: "weeklyPlan",
      THEME: "theme",
      USER_CATEGORIES: "userCategories",
      SHOPPING_CATEGORIES: "shoppingCategories",
    }),
  }),

  // Configuración de rendimiento
  PERFORMANCE: Object.freeze({
    AUTO_SAVE_DELAY: 500,
    DEBOUNCE_DELAY: 300,
    SEARCH_DELAY: 200,
    IMAGE_LAZY_THRESHOLD: "200px",
  }),

  // Límites de la aplicación para prevenir problemas de memoria
  LIMITS: Object.freeze({
    MAX_RECIPES: 1000,
    MAX_SHOPPING_ITEMS: 500,
    MAX_CUSTOM_CATEGORIES: 20,
    MAX_RECIPE_NAME_LENGTH: 100,
    MAX_INGREDIENT_LENGTH: 200,
    MAX_INSTRUCTION_LENGTH: 500,
  }),

  // Configuración de formato de fecha y tiempo optimizada
  LOCALE: Object.freeze({
    DATE_FORMAT: "es-ES",
    DATE_OPTIONS: Object.freeze({
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    TIME_FORMAT: "es-ES",
    TIME_OPTIONS: Object.freeze({
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }),
    CURRENCY_FORMAT: "es-ES",
    CURRENCY_OPTIONS: Object.freeze({
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }),
  }),
});

/**
 * Tipos de notificaciones disponibles
 * Enum-like object para type safety y autocompletado
 */
export const TOAST_TYPES = Object.freeze({
  SUCCESS: "success",
  ERROR: "error",
  WARNING: "warning",
  INFO: "info",
});

/**
 * Estados de carga de la aplicación
 * Enum-like object para consistencia en manejo de estados
 */
export const LOADING_STATES = Object.freeze({
  IDLE: "idle",
  LOADING: "loading",
  SUCCESS: "success",
  ERROR: "error",
});

/**
 * Temas disponibles para la aplicación
 * Enum-like object para consistencia en manejo de temas
 */
export const THEMES = Object.freeze({
  LIGHT: "light",
  DARK: "dark",
  SYSTEM: "system",
});

/**
 * Configuración de validaciones para formularios
 * Reglas centralizadas para validación de datos
 */
export const VALIDATION_RULES = Object.freeze({
  RECIPE: Object.freeze({
    NAME: Object.freeze({
      MIN_LENGTH: 2,
      MAX_LENGTH: 100,
      REQUIRED: true,
    }),
    PREP_TIME: Object.freeze({
      MIN: 1,
      MAX: 1440, // 24 horas en minutos
      PATTERN: /^\d+\s?(min|mins|minutos?|h|hr|hrs|horas?)?$/i,
    }),
    SERVINGS: Object.freeze({
      MIN: 1,
      MAX: 50,
    }),
  }),
  SHOPPING_ITEM: Object.freeze({
    NAME: Object.freeze({
      MIN_LENGTH: 1,
      MAX_LENGTH: 100,
      REQUIRED: true,
    }),
    QUANTITY: Object.freeze({
      MIN: 1,
      MAX: 999,
    }),
    PRICE: Object.freeze({
      MIN: 0,
      MAX: 999999999,
    }),
  }),
});

/**
 * Configuración de URLs y endpoints
 * Centralizadas para fácil mantenimiento
 */
export const URLS = Object.freeze({
  PLACEHOLDER_IMAGE: "https://placehold.co/600x300/E2E8F0/A0AEC0",
  GITHUB_REPO: "https://github.com/tu-usuario/recetario-app",
  DOCUMENTATION: "https://docs.recetario-app.com",
});

/**
 * Configuración de animaciones CSS
 * Duraciones estándar para consistencia visual
 */
export const ANIMATIONS = Object.freeze({
  FAST: "150ms",
  NORMAL: "200ms",
  SLOW: "300ms",
  EASING: Object.freeze({
    EASE_IN_OUT: "cubic-bezier(0.4, 0, 0.2, 1)",
    EASE_OUT: "cubic-bezier(0, 0, 0.2, 1)",
    EASE_IN: "cubic-bezier(0.4, 0, 1, 1)",
  }),
});

// =============================================================================
// COMPUTED CONSTANTS - Valores derivados para optimización
// =============================================================================

/**
 * Map optimizado de traducciones de días para acceso O(1)
 * Utiliza Map para mejor rendimiento en búsquedas frecuentes
 */
export const DAY_TRANSLATIONS_MAP = new Map(Object.entries(DAY_TRANSLATIONS));

/**
 * Set optimizado de categorías de recetas para validación O(1)
 * Útil para verificar si una categoría es válida
 */
export const RECIPE_CATEGORIES_SET = new Set(RECIPE_CATEGORIES);

/**
 * Map optimizado de enlaces de recetas por ID para acceso directo
 * Evita búsquedas lineales en el array
 */
export const RECIPE_LINKS_MAP = new Map(
  ONLINE_RECIPE_LINKS.map((link) => [link.id, link])
);

// =============================================================================
// DEPRECATED - Mantenidos para compatibilidad hacia atrás
// =============================================================================

/**
 * @deprecated Usar RECIPE_CATEGORIES en su lugar
 * Mantenido para compatibilidad con código existente
 */
export const CATEGORIES = RECIPE_CATEGORIES;

/**
 * @deprecated Usar DEFAULT_SHOPPING_CATEGORIES en su lugar
 * Mantenido para compatibilidad con código existente
 */
export const SHOPPING_CATEGORIES = DEFAULT_SHOPPING_CATEGORIES;
