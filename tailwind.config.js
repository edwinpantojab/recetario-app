/**
 * @fileoverview Configuración optimizada de Tailwind CSS para Recetario Mágico
 * Optimiza el bundle final, mejora el rendimiento y define el sistema de diseño
 * @author Sistema de gestión de recetas
 * @version 2.0.0
 * @type {import('tailwindcss').Config}
 */

// =============================================================================
// CONFIGURACIÓN PRINCIPAL OPTIMIZADA
// =============================================================================

module.exports = {
  // =============================================================================
  // CONTENT SCANNING - Configuración de archivos para purging CSS
  // =============================================================================
  /**
   * Configuración de archivos a escanear para purgar CSS no utilizado
   * Optimizado para mejor rendimiento de build y menor tamaño final
   */ content: [
    "./src/**/*.{js,jsx,ts,tsx,html}", // Todos los archivos de componentes
    "./public/index.html", // HTML base de la aplicación
    "./src/**/*.css", // Archivos CSS personalizados
    "!./src/**/*.test.{js,jsx}", // Excluir archivos de prueba
    "!./src/**/*.stories.{js,jsx}", // Excluir archivos de Storybook
  ],
  // =============================================================================
  // SAFELIST - Clases que siempre deben mantenerse (compatible con Tailwind v3.0)
  // =============================================================================
  safelist: [
    // Clases que deben mantenerse siempre
    "dark",
    "light",
    // Para Tailwind v3.0, usar objetos para patrones complejos
    {
      pattern: /^animate-/,
      variants: ["hover", "focus"],
    },
    {
      pattern: /^transition-/,
      variants: ["hover", "focus"],
    },
  ],

  // =============================================================================
  // DARK MODE - Optimizado para mejor rendimiento
  // =============================================================================

  /**
   * Modo oscuro basado en clase CSS
   * Mejor rendimiento que media queries y control más granular
   */
  darkMode: "class",

  // =============================================================================
  // THEME CONFIGURATION - Sistema de diseño optimizado
  // =============================================================================

  theme: {
    extend: {
      // =====================================================================
      // TYPOGRAPHY - Tipografía optimizada
      // =====================================================================

      /**
       * Stack de fuentes optimizado para rendimiento y legibilidad
       * Incluye fallbacks seguros y fuentes del sistema
       */
      fontFamily: {
        sans: [
          "Inter Variable", // Fuente principal con soporte variable
          "Inter", // Fallback estático
          "-apple-system", // Sistema Apple
          "BlinkMacSystemFont", // macOS/iOS moderno
          '"Segoe UI"', // Windows
          "Roboto", // Android
          '"Helvetica Neue"', // Fallback universal
          "Arial", // Fallback básico
          "sans-serif", // Fallback final
        ],
        mono: [
          '"Fira Code"', // Código con ligaduras
          '"Roboto Mono"', // Fallback mono
          '"Courier New"', // Fallback universal
          "monospace", // Fallback final
        ],
      },

      /**
       * Configuración de tamaños de fuente optimizada
       * Escalas fluidas para mejor responsividad
       */
      fontSize: {
        xs: ["0.75rem", { lineHeight: "1rem" }],
        sm: ["0.875rem", { lineHeight: "1.25rem" }],
        base: ["1rem", { lineHeight: "1.5rem" }],
        lg: ["1.125rem", { lineHeight: "1.75rem" }],
        xl: ["1.25rem", { lineHeight: "1.75rem" }],
        "2xl": ["1.5rem", { lineHeight: "2rem" }],
        "3xl": ["1.875rem", { lineHeight: "2.25rem" }],
        "4xl": ["2.25rem", { lineHeight: "2.5rem" }],
      },

      // =====================================================================
      // COLOR SYSTEM - Paleta de colores optimizada
      // =====================================================================

      /**
       * Sistema de colores optimizado para la aplicación
       * Paletas calculadas científicamente para mejor contraste y accesibilidad
       */
      colors: {
        // Colores de marca - emerald personalizados
        primary: {
          50: "#ecfdf5", // Fondos muy claros
          100: "#d1fae5", // Fondos claros
          200: "#a7f3d0", // Elementos suaves
          300: "#6ee7b7", // Elementos medios
          400: "#34d399", // Acento principal
          500: "#10b981", // Color primario base
          600: "#059669", // Hover states
          700: "#047857", // Headers y elementos importantes
          800: "#065f46", // Elementos oscuros
          900: "#064e3b", // Texto en modo oscuro
          950: "#022c22", // Elementos muy oscuros
        },

        // Colores neutros mejorados
        neutral: {
          50: "#f8fafc", // Fondos claros
          100: "#f1f5f9", // Fondos secundarios
          200: "#e2e8f0", // Bordes suaves
          300: "#cbd5e1", // Bordes normales
          400: "#94a3b8", // Texto secundario
          500: "#64748b", // Texto normal
          600: "#475569", // Texto enfatizado
          700: "#334155", // Texto importante
          800: "#1e293b", // Fondos oscuros
          900: "#0f172a", // Fondos muy oscuros
          950: "#020617", // Elementos más oscuros
        },

        // Colores semánticos para feedback
        success: {
          50: "#f0fdf4",
          500: "#22c55e",
          600: "#16a34a",
          700: "#15803d",
        },
        warning: {
          50: "#fffbeb",
          500: "#f59e0b",
          600: "#d97706",
          700: "#b45309",
        },
        error: {
          50: "#fef2f2",
          500: "#ef4444",
          600: "#dc2626",
          700: "#b91c1c",
        },
        info: {
          50: "#eff6ff",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
        },
      },

      // =====================================================================
      // SPACING - Sistema de espaciado optimizado
      // =====================================================================

      /**
       * Espaciados personalizados para layouts específicos
       * Basados en la escala 8pt para consistencia visual
       */
      spacing: {
        18: "4.5rem", // 72px - Elementos medianos
        22: "5.5rem", // 88px - Elementos grandes
        88: "22rem", // 352px - Contenedores grandes
        96: "24rem", // 384px - Contenedores muy grandes
        104: "26rem", // 416px - Contenedores extra grandes
        112: "28rem", // 448px - Contenedores máximos
        "150px": "150px", // Tamaño específico legacy
        "safe-top": "env(safe-area-inset-top)",
        "safe-bottom": "env(safe-area-inset-bottom)",
      },

      // =====================================================================
      // ANIMATIONS - Animaciones optimizadas para rendimiento
      // =====================================================================

      /**
       * Animaciones optimizadas para UX fluida
       * Diseñadas para reducir motion sickness y mejorar rendimiento
       */
      animation: {
        // Animaciones de entrada
        "fade-in": "fadeIn 300ms cubic-bezier(0.16, 1, 0.3, 1)",
        "fade-out": "fadeOut 200ms cubic-bezier(0.16, 1, 0.3, 1)",
        "slide-up": "slideUp 200ms cubic-bezier(0.16, 1, 0.3, 1)",
        "slide-down": "slideDown 200ms cubic-bezier(0.16, 1, 0.3, 1)",
        "slide-left": "slideLeft 200ms cubic-bezier(0.16, 1, 0.3, 1)",
        "slide-right": "slideRight 200ms cubic-bezier(0.16, 1, 0.3, 1)",

        // Animaciones de interacción
        "bounce-gentle":
          "bounceGentle 600ms cubic-bezier(0.68, -0.55, 0.265, 1.55)",
        "pulse-soft": "pulseSoft 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        wiggle: "wiggle 200ms ease-in-out",

        // Animaciones de loading
        skeleton: "skeleton 1.5s ease-in-out infinite",
        spinner: "spin 1s linear infinite",

        // Animaciones específicas de la app
        "toast-enter": "toastEnter 300ms cubic-bezier(0.16, 1, 0.3, 1)",
        "toast-exit": "toastExit 200ms cubic-bezier(0.16, 1, 0.3, 1)",
      },

      /**
       * Keyframes optimizados para las animaciones
       * Utilizan transform y opacity para mejor rendimiento GPU
       */
      keyframes: {
        // Animaciones básicas
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeOut: {
          "0%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
        slideUp: {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideDown: {
          "0%": { transform: "translateY(-10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideLeft: {
          "0%": { transform: "translateX(10px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        slideRight: {
          "0%": { transform: "translateX(-10px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },

        // Animaciones de feedback
        bounceGentle: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-5px)" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.8" },
        },
        wiggle: {
          "0%, 100%": { transform: "rotate(0deg)" },
          "25%": { transform: "rotate(-3deg)" },
          "75%": { transform: "rotate(3deg)" },
        },

        // Animaciones de loading
        skeleton: {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },

        // Animaciones específicas
        toastEnter: {
          "0%": { transform: "translateX(100%)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        toastExit: {
          "0%": { transform: "translateX(0)", opacity: "1" },
          "100%": { transform: "translateX(100%)", opacity: "0" },
        },
      },

      // =====================================================================
      // SHADOWS - Sistema de sombras mejorado
      // =====================================================================

      /**
       * Sombras optimizadas para mejor depth perception
       * Calculadas para diferentes niveles de elevación
       */
      boxShadow: {
        // Sombras sutiles
        xs: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        soft: "0 2px 8px 0 rgba(0, 0, 0, 0.06)",

        // Sombras medias
        medium: "0 4px 16px 0 rgba(0, 0, 0, 0.08)",
        strong: "0 8px 24px 0 rgba(0, 0, 0, 0.12)",

        // Sombras especiales
        "inner-soft": "inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)",
        glow: "0 0 20px rgba(16, 185, 129, 0.3)",
        "glow-strong": "0 0 30px rgba(16, 185, 129, 0.4)",

        // Sombras para elementos flotantes
        modal: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        dropdown:
          "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      },

      // =====================================================================
      // BORDER RADIUS - Sistema de bordes redondeados
      // =====================================================================

      /**
       * Bordes redondeados optimizados para consistencia visual
       */
      borderRadius: {
        xs: "0.125rem", // 2px
        sm: "0.25rem", // 4px
        DEFAULT: "0.375rem", // 6px
        md: "0.5rem", // 8px
        lg: "0.75rem", // 12px
        xl: "1rem", // 16px
        "2xl": "1.5rem", // 24px
        "3xl": "2rem", // 32px
      },

      // =====================================================================
      // TRANSITIONS - Transiciones optimizadas
      // =====================================================================

      /**
       * Duraciones de transición optimizadas para mejor UX
       */
      transitionDuration: {
        fast: "150ms",
        normal: "300ms",
        slow: "500ms",
      },

      /**
       * Timing functions optimizadas para transiciones naturales
       */
      transitionTimingFunction: {
        "in-expo": "cubic-bezier(0.95, 0.05, 0.795, 0.035)",
        "out-expo": "cubic-bezier(0.19, 1, 0.22, 1)",
        "in-out-expo": "cubic-bezier(0.87, 0, 0.13, 1)",
        bounce: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
      },

      // =====================================================================
      // BREAKPOINTS - Puntos de quiebre optimizados
      // =====================================================================

      /**
       * Breakpoints adicionales para mejor responsive design
       */
      screens: {
        xs: "475px", // Móviles grandes
        "3xl": "1600px", // Pantallas muy grandes
        "4xl": "1920px", // Pantallas ultra anchas
      },

      // =====================================================================
      // Z-INDEX - Capas organizadas
      // =====================================================================

      /**
       * Z-index organizados para mejor gestión de capas
       */
      zIndex: {
        1: "1",
        10: "10",
        20: "20",
        30: "30",
        40: "40",
        50: "50",
        dropdown: "1000",
        sticky: "1020",
        fixed: "1030",
        modal: "1040",
        popover: "1050",
        tooltip: "1060",
        toast: "1070",
      },
    },
  },

  // =============================================================================
  // PLUGINS - Funcionalidades adicionales
  // =============================================================================

  /**
   * Plugins para funcionalidades adicionales
   * Comentados para reducir bundle size - descomentar según necesidad
   */
  plugins: [
    // Plugin para formularios con mejor styling por defecto
    // require('@tailwindcss/forms')({
    //   strategy: 'class', // Usar solo cuando se aplique la clase
    // }),

    // Plugin para aspect ratios responsive
    // require('@tailwindcss/aspect-ratio'),

    // Plugin para tipografía mejorada
    // require('@tailwindcss/typography')({
    //   className: 'prose', // Clase personalizada
    // }),

    // Plugin para container queries (experimental)
    // require('@tailwindcss/container-queries'),

    // Plugin personalizado para utilidades específicas de la app
    function ({ addUtilities, addComponents, theme }) {
      // Utilidades personalizadas
      addUtilities({
        // Scroll suave optimizado
        ".scroll-smooth": {
          "scroll-behavior": "smooth",
        },

        // Hide scrollbar pero mantener funcionalidad
        ".scrollbar-hide": {
          "-ms-overflow-style": "none",
          "scrollbar-width": "none",
          "&::-webkit-scrollbar": {
            display: "none",
          },
        },

        // Backdrop blur para mejor soporte
        ".backdrop-blur-safari": {
          "-webkit-backdrop-filter": "blur(10px)",
          "backdrop-filter": "blur(10px)",
        },

        // Focus visible solo para teclado
        ".focus-visible": {
          "&:focus-visible": {
            outline: `2px solid ${theme("colors.primary.500")}`,
            "outline-offset": "2px",
          },
        },
      });

      // Componentes personalizados
      addComponents({
        // Botón base optimizado
        ".btn": {
          padding: `${theme("spacing.2")} ${theme("spacing.4")}`,
          borderRadius: theme("borderRadius.md"),
          fontWeight: theme("fontWeight.medium"),
          transition: `all ${theme("transitionDuration.fast")} ${theme(
            "transitionTimingFunction.out"
          )}`,
          "&:focus": {
            outline: "2px solid transparent",
            outlineOffset: "2px",
            boxShadow: `0 0 0 2px ${theme("colors.primary.500")}`,
          },
        },

        // Card base optimizado
        ".card": {
          backgroundColor: theme("colors.white"),
          borderRadius: theme("borderRadius.lg"),
          boxShadow: theme("boxShadow.soft"),
          padding: theme("spacing.6"),
          "@media (prefers-color-scheme: dark)": {
            backgroundColor: theme("colors.neutral.800"),
          },
        },
      });
    },
  ],

  // =============================================================================
  // OPTIMIZACIONES AVANZADAS
  // =============================================================================
  /**
   * Configuraciones futuras para optimización
   * Habilita características estables para mejor rendimiento
   */
  future: {
    hoverOnlyWhenSupported: true, // Hover solo en dispositivos compatibles
    respectDefaultRingColorOpacity: true, // Mejor manejo de ring opacity
    disableColorOpacityUtilitiesByDefault: true, // Reduce bundle size
  },

  /**
   * Configuración del compilador Just-In-Time
   * Mejora significativamente los tiempos de build
   */
  mode: "jit", // Activar JIT mode para mejor rendimiento

  /**
   * Configuración de variantes para control granular
   * Solo incluye las variantes necesarias para reducir bundle size
   */
  variants: {
    extend: {
      // Variantes de opacidad para estados disabled
      opacity: ["disabled", "group-disabled"],
      cursor: ["disabled", "group-disabled"],

      // Variantes de color para estados
      backgroundColor: ["active", "group-active"],
      textColor: ["active", "group-active"],

      // Variantes de transformación para animaciones
      transform: ["hover", "focus", "group-hover"],
      scale: ["hover", "focus", "group-hover"],

      // Variantes específicas para mobile
      display: ["group-hover"],
    },
  },
};
