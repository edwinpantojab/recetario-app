/**
 * @fileoverview Utilidades centralizadas para gestión de localStorage
 * Proporciona funciones optimizadas y con manejo de errores para persistencia local
 * Optimizado para rendimiento y mantenibilidad
 * @author Sistema de gestión de recetas
 * @version 2.0.0
 */

/* eslint-disable no-console */

/**
 * Configuración de claves del localStorage
 * Centralizadas para fácil mantenimiento y evitar conflictos
 */
export const STORAGE_KEYS = Object.freeze({
  RECIPES: "recetario_recipes",
  SHOPPING_ITEMS: "recetario_shoppingItems",
  SHOPPING_SETTINGS: "recetario_shoppingListSettings",
  WEEKLY_PLAN: "recetario_weeklyPlan",
  ONLINE_LINKS: "recetario_onlineRecipeLinks",
  THEME_PREFERENCE: "recetario_theme-preference",
  USER_PREFERENCES: "recetario_userPreferences",
});

/**
 * Configuración del storage para optimización
 */
const STORAGE_CONFIG = Object.freeze({
  // Test key para verificación de disponibilidad
  TEST_KEY: "__recetario_test__",

  // Límites de tamaño (en bytes)
  WARNING_SIZE: 4 * 1024 * 1024, // 4MB - advertencia
  MAX_SIZE: 5 * 1024 * 1024, // 5MB - límite aproximado

  // Configuración de retry para operaciones
  MAX_RETRIES: 3,
  RETRY_DELAY: 100, // ms
});

/**
 * Cache para verificación de disponibilidad de localStorage
 * Evita verificaciones repetidas innecesarias
 */
let storageAvailabilityCache = null;

/**
 * Verifica si localStorage está disponible en el navegador
 * Utiliza cache para evitar verificaciones repetidas y mejorar rendimiento
 *
 * @returns {boolean} true si localStorage está disponible
 */
const isLocalStorageAvailable = (() => {
  return function () {
    // Retornar valor cacheado si ya fue verificado
    if (storageAvailabilityCache !== null) {
      return storageAvailabilityCache;
    }

    try {
      const storage = window.localStorage;
      const testKey = STORAGE_CONFIG.TEST_KEY;

      storage.setItem(testKey, testKey);
      storage.removeItem(testKey);

      storageAvailabilityCache = true;
      return true;
    } catch (error) {
      storageAvailabilityCache = false;
      console.warn("localStorage no está disponible:", error.message); // eslint-disable-line no-console
      return false;
    }
  };
})();

/**
 * Función auxiliar para manejar errores de localStorage
 * Centraliza el manejo de errores específicos
 *
 * @param {Error} error - Error capturado
 * @param {string} operation - Operación que falló
 * @param {string} key - Clave involucrada
 */
const handleStorageError = (error, operation, key) => {
  console.error(`Error en ${operation} para clave "${key}":`, error); // eslint-disable-line no-console

  // Manejo específico de errores comunes
  switch (error.name) {
    case "QuotaExceededError":
    case "NS_ERROR_DOM_QUOTA_REACHED":
      console.warn(`Cuota de localStorage excedida en ${operation}`); // eslint-disable-line no-console
      // Dispara evento personalizado para que la app pueda reaccionar
      window.dispatchEvent(
        new CustomEvent("storageQuotaExceeded", {
          detail: { key, operation, error },
        })
      );
      break;

    case "SecurityError":
      console.warn(`Error de seguridad en localStorage: ${error.message}`); // eslint-disable-line no-console
      break;

    default:
      console.warn(`Error desconocido en localStorage: ${error.message}`); // eslint-disable-line no-console
  }
};

/**
 * Función auxiliar para serializar datos con validación
 * Optimizada para manejar diferentes tipos de datos
 *
 * @param {*} data - Datos a serializar
 * @returns {string|null} Datos serializados o null si hay error
 */
const serializeData = data => {
  try {
    // Optimización: evitar serialización innecesaria para strings simples
    if (typeof data === "string") {
      return data;
    }

    return JSON.stringify(data);
  } catch (error) {
    console.error("Error al serializar datos:", error); // eslint-disable-line no-console
    return null;
  }
};

/**
 * Función auxiliar para deserializar datos con validación
 * Optimizada para manejar diferentes tipos de datos
 *
 * @param {string} serializedData - Datos serializados
 * @returns {*} Datos deserializados o null si hay error
 */
const deserializeData = serializedData => {
  try {
    // Verificar si es un string simple (no JSON)
    if (
      serializedData.charAt(0) !== "{" &&
      serializedData.charAt(0) !== "[" &&
      serializedData.charAt(0) !== '"'
    ) {
      return serializedData;
    }

    return JSON.parse(serializedData);
  } catch (error) {
    console.error("Error al deserializar datos:", error); // eslint-disable-line no-console
    return null;
  }
};

/**
 * Función auxiliar para retry de operaciones
 * Mejora la confiabilidad en operaciones que pueden fallar temporalmente
 *
 * @param {Function} operation - Función a ejecutar con retry
 * @param {number} maxRetries - Número máximo de reintentos
 * @param {number} delay - Delay entre reintentos en ms
 * @returns {Promise} Resultado de la operación
 */
const withRetry = async (
  operation,
  maxRetries = STORAGE_CONFIG.MAX_RETRIES,
  delay = STORAGE_CONFIG.RETRY_DELAY
) => {
  let lastError;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;

      // No reintentar en ciertos tipos de errores
      if (error.name === "SecurityError") {
        throw error;
      }

      // Si no es el último intento, esperar antes del siguiente
      if (attempt < maxRetries) {
        await new Promise(resolve =>
          setTimeout(resolve, delay * (attempt + 1))
        );
      }
    }
  }

  throw lastError;
};

/**
 * Guarda datos en localStorage de forma segura y optimizada
 * Incluye validación de tamaño, manejo de errores y retry automático
 *
 * @param {string} key - Clave para almacenar los datos
 * @param {*} data - Datos a almacenar (serán convertidos a JSON)
 * @param {Object} options - Opciones adicionales
 * @param {boolean} options.skipSizeCheck - Omitir verificación de tamaño
 * @returns {Promise<boolean>} true si se guardó exitosamente
 */
export const saveData = async (key, data, options = {}) => {
  if (!isLocalStorageAvailable()) {
    console.warn(`No se puede guardar ${key}: localStorage no disponible`); // eslint-disable-line no-console
    return false;
  }

  try {
    return await withRetry(async () => {
      const serializedData = serializeData(data);

      if (serializedData === null) {
        throw new Error("Error al serializar datos");
      }

      // Verificación de tamaño opcional
      if (!options.skipSizeCheck) {
        const dataSize = new Blob([serializedData]).size;

        if (dataSize > STORAGE_CONFIG.WARNING_SIZE) {
          console.warn(
            // eslint-disable-line no-console
            `Datos grandes para clave "${key}": ${(
              dataSize /
              1024 /
              1024
            ).toFixed(2)}MB`
          );
        }

        if (dataSize > STORAGE_CONFIG.MAX_SIZE) {
          throw new Error(
            `Datos demasiado grandes: ${(dataSize / 1024 / 1024).toFixed(2)}MB`
          );
        }
      }

      localStorage.setItem(key, serializedData);
      return true;
    });
  } catch (error) {
    handleStorageError(error, "saveData", key);
    return false;
  }
};

/**
 * Carga datos desde localStorage de forma segura y optimizada
 * Incluye validación, deserialización segura y cache opcional
 *
 * @param {string} key - Clave de los datos a cargar
 * @param {*} defaultValue - Valor por defecto si no se encuentran datos
 * @param {Object} options - Opciones adicionales
 * @param {boolean} options.useCache - Usar cache en memoria (para datos frecuentes)
 * @returns {Promise<*>} Los datos deserializados o el valor por defecto
 */
export const loadData = async (key, defaultValue = null, options = {}) => {
  if (!isLocalStorageAvailable()) {
    console.warn(`No se puede cargar ${key}: localStorage no disponible`); // eslint-disable-line no-console
    return defaultValue;
  }

  try {
    return await withRetry(async () => {
      const serializedData = localStorage.getItem(key);

      // Si no hay datos, retornar valor por defecto
      if (serializedData === null || serializedData === undefined) {
        return defaultValue;
      }

      // Deserializar datos
      const parsedData = deserializeData(serializedData);

      if (parsedData === null) {
        console.warn(
          // eslint-disable-line no-console
          `Datos corruptos para clave "${key}", usando valor por defecto`
        );
        return defaultValue;
      }

      return parsedData;
    });
  } catch (error) {
    handleStorageError(error, "loadData", key);
    return defaultValue;
  }
};

/**
 * Elimina datos de localStorage de forma segura
 * Incluye validación y manejo de errores
 *
 * @param {string} key - Clave de los datos a eliminar
 * @returns {Promise<boolean>} true si se eliminó exitosamente
 */
export const removeData = async key => {
  if (!isLocalStorageAvailable()) {
    console.warn(`No se puede eliminar ${key}: localStorage no disponible`); // eslint-disable-line no-console
    return false;
  }

  try {
    return await withRetry(async () => {
      localStorage.removeItem(key);
      return true;
    });
  } catch (error) {
    handleStorageError(error, "removeData", key);
    return false;
  }
};

/**
 * Obtiene el tamaño aproximado en bytes de los datos almacenados
 * Optimizado para cálculos rápidos y precisos
 *
 * @param {string|null} key - Clave específica (opcional)
 * @returns {Promise<number>} Tamaño en bytes
 */
export const getStorageSize = async (key = null) => {
  if (!isLocalStorageAvailable()) {
    return 0;
  }

  try {
    if (key) {
      // Tamaño de una clave específica
      const data = localStorage.getItem(key);
      return data ? new Blob([data]).size : 0;
    } else {
      // Tamaño total de localStorage para la aplicación
      let totalSize = 0;
      const appKeys = Object.values(STORAGE_KEYS);

      for (const storageKey of appKeys) {
        const data = localStorage.getItem(storageKey);
        if (data) {
          totalSize += new Blob([data]).size;
        }
      }

      return totalSize;
    }
  } catch (error) {
    console.error("Error calculando tamaño de storage:", error); // eslint-disable-line no-console
    return 0;
  }
};

/**
 * Verifica si una clave existe en localStorage
 * Optimizado para verificación rápida sin deserialización
 *
 * @param {string} key - Clave a verificar
 * @returns {Promise<boolean>} true si la clave existe
 */
export const hasData = async key => {
  if (!isLocalStorageAvailable()) {
    return false;
  }

  try {
    return localStorage.getItem(key) !== null;
  } catch (error) {
    console.error(`Error verificando existencia de clave "${key}":`, error); // eslint-disable-line no-console
    return false;
  }
};

/**
 * Limpia todos los datos de la aplicación del localStorage
 * Útil para reset completo o troubleshooting
 * Optimizado para operación en lote
 *
 * @returns {Promise<boolean>} true si se limpió exitosamente
 */
export const clearAppData = async () => {
  if (!isLocalStorageAvailable()) {
    return false;
  }

  try {
    return await withRetry(async () => {
      const appKeys = Object.values(STORAGE_KEYS);

      // Usar Promise.all para operaciones paralelas cuando sea seguro
      await Promise.all(
        appKeys.map(key => {
          try {
            localStorage.removeItem(key);
            return Promise.resolve();
          } catch (error) {
            console.warn(`Error eliminando clave "${key}":`, error); // eslint-disable-line no-console
            return Promise.resolve(); // Continuar con otras claves
          }
        })
      );

      console.log("Datos de la aplicación limpiados del localStorage"); // eslint-disable-line no-console
      return true;
    });
  } catch (error) {
    console.error("Error limpiando datos de la aplicación:", error); // eslint-disable-line no-console
    return false;
  }
};

/**
 * Exporta todos los datos de la aplicación como objeto
 * Útil para backup o migración - optimizado para datos grandes
 *
 * @param {Object} options - Opciones de exportación
 * @param {string[]} options.excludeKeys - Claves a excluir del export
 * @param {boolean} options.compress - Comprimir datos (futuro)
 * @returns {Promise<Object>} Objeto con todos los datos de la aplicación
 */
export const exportAppData = async (options = {}) => {
  const { excludeKeys = [] } = options;
  const exportData = {};
  const appKeys = Object.values(STORAGE_KEYS).filter(
    key => !excludeKeys.includes(key)
  );

  try {
    // Cargar datos en paralelo para mejor rendimiento
    const dataPromises = appKeys.map(async key => {
      const data = await loadData(key);
      return { key, data };
    });

    const results = await Promise.all(dataPromises);

    // Construir objeto de exportación
    results.forEach(({ key, data }) => {
      if (data !== null) {
        exportData[key] = data;
      }
    });

    // Agregar metadatos
    exportData._metadata = {
      exportDate: new Date().toISOString(),
      version: "2.0.0",
      totalSize: await getStorageSize(),
    };

    return exportData;
  } catch (error) {
    console.error("Error exportando datos:", error); // eslint-disable-line no-console
    return {};
  }
};

/**
 * Importa datos de la aplicación desde un objeto
 * Útil para restaurar backup o migración - optimizado para datos grandes
 *
 * @param {Object} data - Objeto con los datos a importar
 * @param {Object} options - Opciones de importación
 * @param {boolean} options.overwrite - Sobrescribir datos existentes
 * @param {boolean} options.validate - Validar datos antes de importar
 * @returns {Promise<Object>} Resultado de la importación con estadísticas
 */
export const importAppData = async (data, options = {}) => {
  const { overwrite = true, validate = true } = options;

  if (!data || typeof data !== "object") {
    console.error("Datos de importación inválidos"); // eslint-disable-line no-console
    return { success: false, error: "Datos inválidos" };
  }

  const result = {
    success: false,
    imported: 0,
    skipped: 0,
    errors: [],
    warnings: [],
  };

  try {
    const validKeys = Object.values(STORAGE_KEYS);
    const entriesToImport = Object.entries(data).filter(
      ([key]) => validKeys.includes(key) && key !== "_metadata"
    );

    for (const [key, value] of entriesToImport) {
      try {
        // Verificar si la clave ya existe
        const exists = await hasData(key);

        if (exists && !overwrite) {
          result.skipped++;
          result.warnings.push(`Clave "${key}" omitida - ya existe`);
          continue;
        }

        // Validación opcional de datos
        if (validate && value === null) {
          result.warnings.push(`Clave "${key}" tiene valor null`);
        }

        // Importar dato
        const saved = await saveData(key, value);

        if (saved) {
          result.imported++;
        } else {
          result.errors.push(`Error guardando clave "${key}"`);
        }
      } catch (error) {
        result.errors.push(`Error procesando clave "${key}": ${error.message}`);
      }
    }

    result.success = result.errors.length === 0;

    if (result.success) {
      console.log(
        // eslint-disable-line no-console
        `Datos importados exitosamente: ${result.imported} elementos`
      );
    } else {
      console.warn(
        // eslint-disable-line no-console
        `Importación completada con errores: ${result.errors.length} errores`
      );
    }

    return result;
  } catch (error) {
    console.error("Error importando datos:", error); // eslint-disable-line no-console
    return {
      success: false,
      error: error.message,
      imported: 0,
      skipped: 0,
      errors: [error.message],
    };
  }
};

/**
 * Obtiene estadísticas del uso de localStorage
 * Útil para monitoreo y debugging
 *
 * @returns {Promise<Object>} Estadísticas de uso
 */
export const getStorageStats = async () => {
  if (!isLocalStorageAvailable()) {
    return { available: false };
  }

  try {
    const stats = {
      available: true,
      totalSize: await getStorageSize(),
      keyCount: 0,
      largestKey: null,
      largestSize: 0,
      keys: {},
    };

    const appKeys = Object.values(STORAGE_KEYS);

    for (const key of appKeys) {
      const size = await getStorageSize(key);
      const exists = await hasData(key);

      if (exists) {
        stats.keyCount++;
        stats.keys[key] = size;

        if (size > stats.largestSize) {
          stats.largestSize = size;
          stats.largestKey = key;
        }
      }
    }

    return stats;
  } catch (error) {
    console.error("Error obteniendo estadísticas:", error); // eslint-disable-line no-console
    return { available: false, error: error.message };
  }
};

// =============================================================================
// DEPRECATED - Mantenidos para compatibilidad hacia atrás
// =============================================================================

/**
 * @deprecated Usar saveData() en su lugar
 * Mantenido para compatibilidad con código existente
 */
export const saveDataSync = (key, data) => {
  console.warn("saveDataSync está deprecated, usar saveData() async"); // eslint-disable-line no-console

  if (!isLocalStorageAvailable()) return false;

  try {
    const serializedData = serializeData(data);
    if (serializedData === null) return false;

    localStorage.setItem(key, serializedData);
    return true;
  } catch (error) {
    handleStorageError(error, "saveDataSync", key);
    return false;
  }
};

/**
 * @deprecated Usar loadData() en su lugar
 * Mantenido para compatibilidad con código existente
 */
export const loadDataSync = (key, defaultValue = null) => {
  console.warn("loadDataSync está deprecated, usar loadData() async"); // eslint-disable-line no-console

  if (!isLocalStorageAvailable()) return defaultValue;

  try {
    const serializedData = localStorage.getItem(key);
    if (serializedData === null) return defaultValue;

    const parsedData = deserializeData(serializedData);
    return parsedData !== null ? parsedData : defaultValue;
  } catch (error) {
    handleStorageError(error, "loadDataSync", key);
    return defaultValue;
  }
};
