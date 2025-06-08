/**
 * Utilidades para corregir problemas de scroll
 * Funciones JavaScript que se ejecutan para asegurar que el scroll funcione correctamente
 */

/**
 * Fuerza la restauración del scroll cuando se cierra un modal
 */
export const forceRestoreScroll = () => {
  try {
    // Restaura el scroll del body
    document.body.style.overflow = "auto";
    document.body.style.overflowY = "auto";
    document.body.style.overflowX = "hidden";

    // Restaura el scroll del html
    document.documentElement.style.overflow = "auto";
    document.documentElement.style.overflowY = "auto";
    document.documentElement.style.overflowX = "hidden";

    // Asegura que el root también tenga scroll habilitado
    const root = document.getElementById("root");
    if (root) {
      root.style.overflow = "auto";
      root.style.overflowY = "auto";
      root.style.overflowX = "hidden";
    }
  } catch (error) {
    // Error silencioso para producción
  }
};

/**
 * Detecta y corrige problemas comunes de scroll
 */
export const detectAndFixScrollIssues = () => {
  try {
    const elementsToCheck = [
      document.body,
      document.documentElement,
      document.getElementById("root"),
      document.querySelector(".App"),
    ];

    elementsToCheck.forEach(element => {
      if (element) {
        const computedStyle = window.getComputedStyle(element);
        const hasScrollIssue =
          computedStyle.overflow === "hidden" && element !== document.body; // El body puede estar oculto temporalmente por modales

        if (hasScrollIssue) {
          element.style.overflow = "auto";
          element.style.overflowY = "auto";
          element.style.overflowX = "hidden";
        }
      }
    });
  } catch (error) {
    // Error silencioso para producción
  }
};

/**
 * Inicializa las correcciones de scroll cuando se carga la aplicación
 */
export const initializeScrollFixes = () => {
  try {
    // Aplica correcciones inmediatas
    forceRestoreScroll();

    // Detecta problemas cada 5 segundos (solo en desarrollo)
    if (process.env.NODE_ENV === "development") {
      setInterval(detectAndFixScrollIssues, 5000);
    }

    // Agrega listener para cuando se carga la página
    window.addEventListener("load", () => {
      setTimeout(forceRestoreScroll, 100);
    });

    // Agrega listener para cambios de visibilidad
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) {
        setTimeout(forceRestoreScroll, 100);
      }
    });
  } catch (error) {
    // Error silencioso para producción
  }
};
