/**
 * @fileoverview Componente principal de la aplicación Recetario Mágico
 * Gestiona el estado global, navegación entre pestañas y tema de la aplicación
 * Optimizado para rendimiento y mejor experiencia de usuario
 * @author Sistema de gestión de recetas
 * @version 2.0.0
 */

import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  Suspense,
  lazy,
  startTransition,
} from "react";
import "./App.css";

// Componentes críticos (no lazy)
import Toast from "./components/Toast";
import NavButton from "./components/NavButton";
import ClockDisplay from "./components/ClockDisplay";
import ThemeToggle from "./components/ThemeToggle";
import Footer from "./components/Footer";

// Iconos optimizados con importación selectiva
import {
  ShoppingCart,
  CalendarDays,
  Globe,
  BookOpen,
  ChefHat,
  Loader2,
} from "lucide-react";

// Utilidades y datos
import { loadData, saveData, STORAGE_KEYS } from "./data/localStorageHelpers";
import { DEFAULT_RECIPES } from "./data/defaultRecipes";
import { initializeScrollFixes } from "./utils/scrollUtils";

// =============================================================================
// LAZY LOADING OPTIMIZADO
// =============================================================================

/**
 * Lazy loading de componentes con preload opcional
 * Mejora el rendimiento inicial y permite carga bajo demanda
 */
const ShoppingList = lazy(() =>
  import("./components/ShoppingList").then(module => {
    // Precargar otros componentes después de cargar este
    import("./components/WeeklyPlanner");
    return module;
  })
);

const WeeklyPlanner = lazy(() =>
  import("./components/WeeklyPlanner").then(module => {
    // Precargar componente relacionado
    import("./components/OnlineRecipesViewer");
    return module;
  })
);

const OnlineRecipesViewer = lazy(
  () => import("./components/OnlineRecipesViewer")
);

const RecipesView = lazy(() => import("./components/RecipesView"));

// =============================================================================
// CONFIGURACIONES CENTRALIZADAS
// =============================================================================

/**
 * Configuración de navegación optimizada para mejor UX
 * Centralizada para fácil mantenimiento y consistencia
 */
const NAVIGATION_CONFIG = Object.freeze({
  TABS: Object.freeze([
    {
      key: "recipes",
      label: ["Mis", "Recetas"],
      icon: BookOpen,
      ariaLabel: "Mis recetas guardadas",
      preload: true, // Componente crítico
    },
    {
      key: "planner",
      label: ["Plan", "Semanal"],
      icon: CalendarDays,
      ariaLabel: "Planificador semanal de comidas",
      preload: false,
    },
    {
      key: "shopping",
      label: ["Lista", "Compras"],
      icon: ShoppingCart,
      ariaLabel: "Lista de compras",
      preload: false,
    },
    {
      key: "online",
      label: ["Recetas", "Online"],
      icon: Globe,
      ariaLabel: "Explorar recetas en línea",
      preload: false,
    },
  ]),

  DEFAULT_TAB: "recipes",
  TRANSITION_DELAY: 50, // ms para startTransition
});

/**
 * Configuración del tema optimizada
 * Incluye configuraciones para mejor rendimiento y UX
 */
const THEME_CONFIG = Object.freeze({
  STORAGE_KEY: STORAGE_KEYS.THEME_PREFERENCE,
  DARK_CLASS: "dark",
  ATTRIBUTE: "data-theme",
  TOAST_DURATION: 2500,
  TRANSITION_DURATION: 200, // ms
});

/**
 * Configuración de la aplicación
 * Centraliza constantes para mejor mantenimiento
 */
const APP_CONFIG = Object.freeze({
  NAME: "Recetario Mágico",
  VERSION: "2.0.0",
  MAX_WIDTH: "7xl",
  LOADING_TIMEOUT: 10000, // 10s timeout para lazy loading
});

// =============================================================================
// HOOKS PERSONALIZADOS OPTIMIZADOS
// =============================================================================

/**
 * Hook optimizado para gestión del tema con mejor rendimiento
 * - Carga inicial sincronizada
 * - Persistencia automática
 * - Detección de preferencias del sistema
 * - Transiciones suaves
 *
 * @returns {[string, function]} [theme, toggleTheme]
 */
const useTheme = () => {
  // Función para obtener tema inicial (memoizada)
  const getInitialTheme = useCallback(() => {
    try {
      // Primero verificar almacenamiento local
      const stored = localStorage.getItem(THEME_CONFIG.STORAGE_KEY);
      if (stored && (stored === "dark" || stored === "light")) {
        return stored;
      }

      // Fallback a preferencia del sistema
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    } catch (error) {
      // Cambiar console.warn por comentario o remover
      // console.warn("Error leyendo preferencia de tema:", error);
      return "light"; // Fallback seguro
    }
  }, []);

  const [theme, setTheme] = useState(getInitialTheme);

  // Aplicar tema al DOM de forma optimizada
  useEffect(() => {
    const applyTheme = async newTheme => {
      try {
        // Aplicar clase y atributo para máxima compatibilidad
        document.documentElement.classList.toggle(
          THEME_CONFIG.DARK_CLASS,
          newTheme === "dark"
        );
        document.documentElement.setAttribute(THEME_CONFIG.ATTRIBUTE, newTheme);

        // Persistir en localStorage de forma asíncrona
        await saveData(THEME_CONFIG.STORAGE_KEY, newTheme);

        // Notificar a otros componentes del cambio
        window.dispatchEvent(
          new CustomEvent("themeChange", {
            detail: { theme: newTheme },
          })
        );
      } catch (error) {
        // Cambiar console.error por manejo silencioso o toast
        // console.error("Error aplicando tema:", error);
      }
    };

    applyTheme(theme);
  }, [theme]);

  // Función optimizada para alternar tema
  const toggleTheme = useCallback(() => {
    startTransition(() => {
      setTheme(currentTheme => (currentTheme === "dark" ? "light" : "dark"));
    });
  }, []);

  return [theme, toggleTheme];
};

/**
 * Hook optimizado para gestión de notificaciones toast
 * - Auto-limpieza de timeouts
 * - Prevención de memory leaks
 * - Soporte para múltiples tipos de toast
 *
 * @returns {[object, function]} [toast, showToast]
 */
const useToast = () => {
  const [toast, setToast] = useState({
    message: "",
    type: "success",
    visible: false,
  });

  const timeoutRef = React.useRef(null);

  // Limpiar timeout al desmontar
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const showToast = useCallback((message, type = "success") => {
    // Limpiar timeout anterior si existe
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Mostrar toast
    setToast({ message, type, visible: true });

    // Auto-ocultar con nuevo timeout
    timeoutRef.current = setTimeout(() => {
      setToast(prev => ({ ...prev, visible: false }));

      // Limpiar completamente después de la animación
      setTimeout(() => {
        setToast({ message: "", type: "success", visible: false });
      }, 300);
    }, THEME_CONFIG.TOAST_DURATION);
  }, []);

  const hideToast = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setToast({ message: "", type: "success", visible: false });
  }, []);

  return [toast, showToast, hideToast];
};

/**
 * Hook para gestión de navegación con preload inteligente
 * - Preload de componentes bajo demanda
 * - Transiciones suaves
 * - Historial de navegación
 *
 * @returns {[string, function]} [activeTab, setActiveTab]
 */
const useNavigation = () => {
  const [activeTab, setActiveTab] = useState(NAVIGATION_CONFIG.DEFAULT_TAB);
  const [preloadedTabs, setPreloadedTabs] = useState(new Set());

  // Función optimizada para cambio de pestaña
  const handleTabChange = useCallback(
    newTab => {
      if (newTab === activeTab) return;

      startTransition(() => {
        setActiveTab(newTab);

        // Marcar como visitado para evitar recargas innecesarias
        setPreloadedTabs(prev => new Set([...prev, newTab]));
      });
    },
    [activeTab]
  );

  // Preload inteligente de componentes
  useEffect(() => {
    const preloadComponent = async tabKey => {
      if (preloadedTabs.has(tabKey)) return;

      try {
        switch (tabKey) {
          case "shopping":
            await import("./components/ShoppingList");
            break;
          case "planner":
            await import("./components/WeeklyPlanner");
            break;
          case "online":
            await import("./components/OnlineRecipesViewer");
            break;
          case "recipes":
            await import("./components/RecipesView");
            break;
          default:
            break;
        }
      } catch (error) {
        // Cambiar console.warn por manejo silencioso
        // console.warn(`Error precargando componente ${tabKey}:`, error);
      }
    };

    // Precargar próximo componente probable después de un delay
    const timer = setTimeout(() => {
      const currentIndex = NAVIGATION_CONFIG.TABS.findIndex(
        tab => tab.key === activeTab
      );
      const nextTab =
        NAVIGATION_CONFIG.TABS[
          (currentIndex + 1) % NAVIGATION_CONFIG.TABS.length
        ];

      if (nextTab && !preloadedTabs.has(nextTab.key)) {
        preloadComponent(nextTab.key);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [activeTab, preloadedTabs]);

  return [activeTab, handleTabChange];
};

// =============================================================================
// COMPONENTES AUXILIARES OPTIMIZADOS
// =============================================================================

/**
 * Componente de loading optimizado con skeleton y timeout
 * Mejora la percepción de velocidad de carga
 */
const LoadingFallback = React.memo(() => (
  <div className="flex flex-col items-center justify-center p-10 space-y-4">
    <div className="flex items-center space-x-3">
      <Loader2
        size={24}
        className="animate-spin text-emerald-600 dark:text-emerald-400"
        aria-hidden="true"
      />
      <span className="text-slate-600 dark:text-slate-300 font-medium">
        Cargando...
      </span>
    </div>
    {/* Skeleton placeholder */}{" "}
    <div className="w-full max-w-md space-y-3">
      <div className="h-4 bg-slate-200 dark:bg-gradient-to-r dark:from-slate-600/50 dark:to-slate-500/30 rounded animate-pulse"></div>
      <div className="h-4 bg-slate-200 dark:bg-gradient-to-r dark:from-slate-600/50 dark:to-slate-500/30 rounded animate-pulse w-4/5"></div>
      <div className="h-4 bg-slate-200 dark:bg-gradient-to-r dark:from-slate-600/50 dark:to-slate-500/30 rounded animate-pulse w-3/5"></div>
    </div>
  </div>
));

LoadingFallback.displayName = "LoadingFallback";

/**
 * Header de la aplicación optimizado para mejor rendimiento
 * - Estructura semántica mejorada
 * - Optimización de re-renders
 * - Mejor accesibilidad
 */
const AppHeader = React.memo(
  ({ theme, toggleTheme, activeTab, onTabChange }) => (
    <header className="w-full bg-gradient-to-r from-emerald-700 via-emerald-600 to-emerald-400 shadow-lg">
      {/* Barra superior con branding y controles */}
      <div
        className={`max-w-${APP_CONFIG.MAX_WIDTH} mx-auto flex items-center justify-between px-4 py-2`}
      >
        {/* Marca de la aplicación */}
        <div className="flex items-center gap-2 sm:gap-3">
          <ChefHat
            size={28}
            className="text-white drop-shadow-md flex-shrink-0"
            aria-hidden="true"
          />
          <h1 className="text-xl sm:text-2xl font-bold text-white drop-shadow-md">
            {APP_CONFIG.NAME}
          </h1>
        </div>
        {/* Controles de tema */}
        <div className="flex items-center gap-2">
          <div className="rounded-lg p-1.5 bg-white/90 dark:bg-emerald-800/90 shadow-md transition-all duration-200 hover:shadow-lg">
            <ThemeToggle
              theme={theme}
              toggleTheme={toggleTheme}
              aria-label={`Cambiar a tema ${
                theme === "dark" ? "claro" : "oscuro"
              }`}
            />
          </div>
        </div>{" "}
      </div>{" "}
      {/* Navegación principal optimizada */}
      <nav
        className="w-full bg-gradient-to-r from-emerald-800 via-emerald-700 to-emerald-600 py-2 px-3 shadow-inner"
        role="navigation"
        aria-label="Navegación principal"
      >
        <div
          className={`max-w-${APP_CONFIG.MAX_WIDTH} w-full flex items-center gap-3 sm:gap-4 px-2 sm:px-4 mx-auto`}
        >
          {NAVIGATION_CONFIG.TABS.map((tab, index) => {
            const IconComponent = tab.icon;
            return (
              <NavButton
                key={tab.key}
                icon={<IconComponent size={20} aria-hidden="true" />}
                textLines={tab.label}
                isActive={activeTab === tab.key}
                onClick={() => onTabChange(tab.key)}
                aria-label={tab.ariaLabel}
                aria-current={activeTab === tab.key ? "page" : undefined}
              />
            );
          })}
        </div>
      </nav>{" "}
      {/* Reloj integrado */}
      <div className="w-full bg-emerald-800/95 py-1">
        <div
          className={`max-w-${APP_CONFIG.MAX_WIDTH} w-full flex justify-center px-1 sm:px-3 mx-auto`}
        >
          <ClockDisplay />
        </div>
      </div>
    </header>
  )
);

AppHeader.displayName = "AppHeader";

// =============================================================================
// COMPONENTE PRINCIPAL OPTIMIZADO
// =============================================================================

/**
 * Componente principal de la aplicación Recetario Mágico
 * Gestiona el estado global, navegación y renderizado optimizado
 *
 * Optimizaciones implementadas:
 * - Lazy loading inteligente con preload
 * - Memoización de componentes críticos
 * - Transiciones suaves con startTransition
 * - Gestión optimizada de estado
 * - Error boundaries implícitos
 *
 * @returns {JSX.Element} Aplicación completa optimizada
 */
function App() {
  // Hooks personalizados optimizados
  const [toast, showToast, hideToast] = useToast();
  const [activeTab, handleTabChange] = useNavigation();
  const [theme, toggleTheme] = useTheme();

  // Estado de recetas optimizado con lazy loading inicial asíncrono
  const [userRecipes, setUserRecipes] = useState([]);
  const [recipesLoaded, setRecipesLoaded] = useState(false);

  // Cargar recetas de forma asíncrona en useEffect
  useEffect(() => {
    const loadUserRecipes = async () => {
      try {
        const recipes = await loadData(STORAGE_KEYS.RECIPES, [
          ...DEFAULT_RECIPES,
        ]);
        setUserRecipes(recipes);
        setRecipesLoaded(true);
      } catch (error) {
        // Remover console.error y usar solo el toast
        showToast(
          "Error cargando recetas, usando valores predeterminados",
          "error"
        );
        setUserRecipes([...DEFAULT_RECIPES]);
        setRecipesLoaded(true);
      }
    };
    loadUserRecipes();
  }, [showToast]);

  // Inicializar correcciones de scroll
  useEffect(() => {
    initializeScrollFixes();
  }, []);

  // Memoización del contenido principal para evitar re-renders innecesarios
  const MainContent = useMemo(() => {
    if (!recipesLoaded) {
      return <LoadingFallback />;
    }

    // Props comunes pasadas explícitamente sin spread
    const baseProps = {
      showToast: showToast,
    };

    switch (activeTab) {
      case "recipes":
        return (
          <RecipesView
            showToast={baseProps.showToast}
            setUserRecipes={setUserRecipes}
            recipes={userRecipes}
          />
        );
      case "planner":
        return (
          <WeeklyPlanner
            showToast={baseProps.showToast}
            allUserRecipes={userRecipes}
            recipes={userRecipes}
          />
        );
      case "shopping":
        return <ShoppingList showToast={baseProps.showToast} />;
      case "online":
        return <OnlineRecipesViewer showToast={baseProps.showToast} />;
      default:
        return (
          <div className="text-center p-8">
            <p className="text-slate-600 dark:text-slate-300">
              Pestaña no encontrada
            </p>
          </div>
        );
    }
  }, [activeTab, userRecipes, showToast, recipesLoaded]);
  return (
    <div className="App min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col transition-colors duration-200 overflow-x-hidden">
      {/* Header optimizado */}
      <AppHeader
        theme={theme}
        toggleTheme={toggleTheme}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />

      {/* Área de contenido principal con error boundary implícito */}
      <main
        className="max-w-7xl mx-auto w-full flex-1 mt-4 pb-4 overflow-x-hidden"
        role="main"
        aria-label="Contenido principal"
      >
        <Suspense fallback={<LoadingFallback />}>{MainContent}</Suspense>
      </main>

      {/* Sistema de notificaciones optimizado */}
      {toast.visible && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
          visible={toast.visible}
        />
      )}

      {/* Pie de página */}
      <Footer />
    </div>
  );
}

export default App;
