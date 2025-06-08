// utils/analytics.js - Configuración y utilidades de Google Analytics

// ID de medición de Google Analytics
export const GA_TRACKING_ID = "G-7BTBNVMV7M";

// Función para verificar si Analytics está cargado
export const isAnalyticsLoaded = () => {
  return typeof window !== "undefined" && window.gtag && window.dataLayer;
};

// Función para enviar eventos de página vista
export const pageview = url => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("config", GA_TRACKING_ID, {
      page_location: url,
    });
  }
};

// Función para enviar eventos personalizados
export const event = (action, category, label, value) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Eventos específicos para la aplicación de recetas
export const trackRecipeEvent = {
  // Cuando se crea una nueva receta
  create: recipeName => {
    event("create_recipe", "recipe_management", recipeName);
  },

  // Cuando se edita una receta
  edit: recipeName => {
    event("edit_recipe", "recipe_management", recipeName);
  },

  // Cuando se elimina una receta
  delete: recipeName => {
    event("delete_recipe", "recipe_management", recipeName);
  },

  // Cuando se comparte una receta
  share: (recipeName, shareMethod) => {
    event("share_recipe", "social_interaction", `${recipeName}_${shareMethod}`);
  },

  // Cuando se agrega una receta al planificador
  addToPlanner: (recipeName, day) => {
    event("add_to_planner", "meal_planning", `${recipeName}_${day}`);
  },

  // Cuando se agrega ingredientes a la lista de compras
  addToShoppingList: recipeName => {
    event("add_to_shopping_list", "shopping", recipeName);
  },
};

// Eventos para navegación
export const trackNavigation = {
  // Cambio de vista principal
  changeView: viewName => {
    event("change_view", "navigation", viewName);
  },

  // Cambio de tema (claro/oscuro)
  toggleTheme: theme => {
    event("toggle_theme", "user_preference", theme);
  },
};

// Eventos para interacción móvil
export const trackMobileInteraction = {
  // Uso de drag & drop en desktop
  dragDrop: action => {
    event("drag_drop", "desktop_interaction", action);
  },

  // Interacción táctil en móvil
  touch: action => {
    event("touch_interaction", "mobile_interaction", action);
  },
};
