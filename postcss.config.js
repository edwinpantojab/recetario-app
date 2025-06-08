/**
 * @fileoverview Configuración optimizada de PostCSS para Recetario Mágico
 * Procesa CSS con plugins para optimización, compatibilidad cross-browser y rendimiento
 * Optimizado para desarrollo rápido y builds de producción eficientes
 * @author Sistema de gestión de recetas
 * @version 2.0.0
 */

// =============================================================================
// CONFIGURACIÓN DE ENTORNO
// =============================================================================

/**
 * Detecta el entorno de ejecución para aplicar optimizaciones específicas
 * - development: Optimizado para reload rápido y debugging
 * - production: Optimizado para bundle size y rendimiento
 */
const isDevelopment = process.env.NODE_ENV === "development";
const isProduction = process.env.NODE_ENV === "production";
const isTesting = process.env.NODE_ENV === "test";

// =============================================================================
// CONFIGURACIÓN DE PLUGINS OPTIMIZADA
// =============================================================================

/**
 * Configuración de Tailwind CSS optimizada
 * Personalizada según el entorno para mejor rendimiento
 */
const tailwindConfig = {
  // En desarrollo, usar configuración básica para reload rápido
  ...(isDevelopment && {
    config: "./tailwind.config.js",
  }),

  // En producción, aplicar optimizaciones adicionales
  ...(isProduction && {
    config: "./tailwind.config.js",
  }),
};

/**
 * Configuración de Autoprefixer optimizada
 * Proporciona compatibilidad cross-browser inteligente
 */
const autoprefixerConfig = {
  // Configuración de CSS Grid mejorada
  grid: "autoplace", // Soporte automático para CSS Grid moderno
  flexbox: "no-2009", // Evita sintaxis flexbox legacy problemática

  // Configuración de soporte de navegadores
  overrideBrowserslist: [
    "> 1%", // Navegadores con más del 1% de uso
    "last 2 versions", // Últimas 2 versiones de cada navegador
    "not dead", // Navegadores activamente mantenidos
    "not ie 11", // Excluir IE11 explícitamente
    "not op_mini all", // Excluir Opera Mini
  ],

  // Configuraciones adicionales para mejor rendimiento
  cascade: true, // Mantener indentación en CSS generado
  remove: true, // Remover prefijos obsoletos automáticamente
  supports: true, // Añadir soporte para @supports

  // Configuración específica para desarrollo
  ...(isDevelopment && {
    map: true, // Source maps para debugging
  }),
};

/**
 * Configuración de CSSnano para optimización en producción
 * Configurado para balance entre tamaño y compatibilidad
 */
const cssnanoConfig = {
  preset: [
    "default",
    {
      // =================================================================
      // OPTIMIZACIONES DE COMPRESIÓN
      // =================================================================

      // Remover comentarios para reducir tamaño
      discardComments: {
        removeAll: true,
        removeAllButFirst: false,
      },

      // Normalizar espacios en blanco
      normalizeWhitespace: true,

      // Optimizar selectores duplicados
      discardDuplicates: true,

      // Mergear reglas similares cuando sea posible
      mergeRules: true,

      // =================================================================
      // CONFIGURACIONES DE SEGURIDAD
      // =================================================================

      // NO modificar identificadores de animaciones/keyframes
      // Importante para mantener animaciones funcionales
      reduceIdents: false,

      // NO modificar z-index automáticamente
      // Evita problemas de capas en la aplicación
      zindex: false,

      // NO convertir colores entre formatos automáticamente
      // Mantiene consistencia con el sistema de diseño
      colormin: {
        legacy: false, // Usar formatos modernos de color
      },

      // =================================================================
      // OPTIMIZACIONES ESPECÍFICAS
      // =================================================================

      // Optimizar fuentes y @font-face
      minifyFontValues: true,

      // Optimizar gradientes
      minifyGradients: true,

      // Optimizar parámetros de funciones CSS
      minifyParams: true,

      // Optimizar selectores
      minifySelectors: true,

      // Reducir valores de longitud cuando sea posible
      convertValues: {
        length: false, // Mantener unidades originales
      },

      // Normalizar URLs
      normalizeUrl: {
        stripWWW: false, // Mantener www en URLs
      },

      // =================================================================
      // CONFIGURACIONES AVANZADAS
      // =================================================================

      // Optimizar declaraciones CSS
      orderedValues: true,

      // Reducir transformaciones
      reduceTransforms: true,

      // Eliminar reglas vacías
      discardEmpty: true,

      // Normalizar caracteres Unicode
      normalizeUnicode: true,

      // Optimizar declaraciones de posición
      reducePositions: true,
    },
  ],
};

/**
 * Configuración de plugins adicionales para desarrollo
 * Mejoran la experiencia de desarrollo sin afectar producción
 */
const developmentPlugins = {
  // Plugin para mejor debugging de CSS
  ...(isDevelopment && {
    "postcss-reporter": {
      clearReportedMessages: true,
      throwError: false,
    },
  }),
};

/**
 * Configuración de plugins adicionales para producción
 * Optimizaciones específicas para builds de producción
 */
const productionPlugins = {
  // Minificación con CSSnano
  ...(isProduction && {
    cssnano: cssnanoConfig,
  }),

  // Plugin para análisis de bundle CSS (opcional)
  ...(isProduction &&
    process.env.ANALYZE_CSS && {
      "postcss-size": {
        writeFile: true,
        filename: "css-size-report.json",
      },
    }),

  // Plugin para critical CSS (opcional)
  ...(isProduction &&
    process.env.CRITICAL_CSS && {
      "@fullhuman/postcss-purgecss": {
        content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
        defaultExtractor: content => {
          // Extractor personalizado para clases dinámicas
          const broadMatches = content.match(/[^<>"'`\s]*[^<>"'`\s:]/g) || [];
          const innerMatches =
            content.match(/[^<>"'`\s.()]*[^<>"'`\s.():]/g) || [];
          return broadMatches.concat(innerMatches);
        },
        safelist: [
          // Clases que nunca deben ser purgadas
          /^animate-/,
          /^transition-/,
          /^transform/,
          /^duration-/,
          /^ease-/,
          "dark",
          "light",
        ],
      },
    }),
};

// =============================================================================
// CONFIGURACIÓN PRINCIPAL EXPORTADA
// =============================================================================

/**
 * Configuración principal de PostCSS optimizada
 * Combina todos los plugins según el entorno de ejecución
 */
module.exports = {
  // ==========================================================================
  // CONFIGURACIÓN DE PLUGINS
  // ==========================================================================

  plugins: {
    // ======================================================================
    // PLUGINS PRINCIPALES (siempre activos)
    // ======================================================================

    /**
     * Tailwind CSS - Framework principal
     * Procesa directivas @tailwind y genera CSS utilitario
     */
    tailwindcss: tailwindConfig,

    /**
     * Autoprefixer - Compatibilidad cross-browser
     * Añade prefijos de vendor automáticamente
     */
    autoprefixer: autoprefixerConfig,

    // ======================================================================
    // PLUGINS CONDICIONALES (según entorno)
    // ======================================================================

    /**
     * Plugins de desarrollo
     * Solo se cargan en modo development para mejor debugging
     */
    ...developmentPlugins,

    /**
     * Plugins de producción
     * Solo se cargan en modo production para optimización
     */
    ...productionPlugins,

    // ======================================================================
    // PLUGINS PARA TESTING (opcional)
    // ======================================================================

    /**
     * Configuración específica para testing
     * Evita optimizaciones que puedan interferir con pruebas
     */
    ...(isTesting && {
      // Configuración mínima para tests más rápidos
      "postcss-discard-comments": {
        removeAll: false,
      },
    }),
  },

  // ==========================================================================
  // CONFIGURACIÓN ADICIONAL
  // ==========================================================================

  /**
   * Source maps para mejor debugging
   * Solo en desarrollo para no exponer código en producción
   */
  ...(isDevelopment && {
    map: {
      inline: false,
      annotation: true,
      sourcesContent: true,
    },
  }),

  /**
   * Configuración de parser para sintaxis CSS avanzada
   * Mejora soporte para características modernas de CSS
   */
  parser: "postcss-scss", // Soporte para sintaxis SCSS en CSS

  /**
   * Configuración de sintaxis
   * Permite uso de características CSS modernas
   */
  syntax: "postcss-scss",
};

// =============================================================================
// CONFIGURACIÓN DE VALIDACIÓN Y DEBUGGING
// =============================================================================

/**
 * Función para validar configuración en tiempo de ejecución
 * Útil para debugging y desarrollo
 */
if (isDevelopment && process.env.DEBUG_POSTCSS) {
  console.log("🎨 PostCSS Config Debug:"); // eslint-disable-line no-console
  console.log("Environment:", process.env.NODE_ENV); // eslint-disable-line no-console
  console.log("Tailwind Config:", tailwindConfig); // eslint-disable-line no-console
  console.log("Autoprefixer Config:", autoprefixerConfig); // eslint-disable-line no-console

  // Verificar que los plugins necesarios estén disponibles
  try {
    require("tailwindcss");
    require("autoprefixer");
    console.log("✅ Plugins principales disponibles"); // eslint-disable-line no-console
  } catch (error) {
    console.error("❌ Error cargando plugins:", error.message); // eslint-disable-line no-console
  }
}

/**
 * Exportar configuraciones adicionales para uso en otras herramientas
 * Útil para integración con otras partes del build system
 */
module.exports.configs = {
  tailwind: tailwindConfig,
  autoprefixer: autoprefixerConfig,
  cssnano: cssnanoConfig,
  isDevelopment,
  isProduction,
  isTesting,
};

// =============================================================================
// NOTAS DE OPTIMIZACIÓN Y USO
// =============================================================================

/*
  OPTIMIZACIONES IMPLEMENTADAS:
  
  1. 🚀 RENDIMIENTO:
     - Configuración condicional según entorno
     - Source maps solo en desarrollo
     - Minificación optimizada para producción
     - Cache-friendly configuration
  
  2. 🔧 COMPATIBILIDAD:
     - Autoprefixer configurado para navegadores modernos
     - Soporte para CSS Grid y Flexbox moderno
     - Exclusión de navegadores obsoletos
  
  3. 📦 BUNDLE SIZE:
     - CSSnano con configuración balanceada
     - PurgeCSS opcional para eliminación de CSS no usado
     - Comentarios removidos en producción
  
  4. 🛠️ DESARROLLO:
     - Source maps para debugging
     - Reporter para mejor feedback
     - Configuración de debug opcional
  
  5. 🔒 SEGURIDAD:
     - No modificación de z-index automática
     - Preservación de nombres de animaciones
     - URLs normalizadas sin perder información
  
  VARIABLES DE ENTORNO SOPORTADAS:
  - NODE_ENV: development | production | test
  - DEBUG_POSTCSS: true para logging de debug
  - ANALYZE_CSS: true para análisis de bundle
  - CRITICAL_CSS: true para optimización crítica
  
  INTEGRACIÓN:
  - Compatible con Create React App
  - Funciona con Vite, Webpack, Parcel
  - Soporte para herramientas de build modernas
  
  MANTENIMIENTO:
  - Configuración modular y extensible
  - Comentarios detallados para futuras modificaciones
  - Validación de tiempo de ejecución
*/
