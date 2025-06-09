import { useState, useEffect, useCallback } from "react";

/**
 * Hook para gestionar la instalación de PWA con comportamiento de banner persistente
 *
 * Comportamiento del banner:
 * - Aparece SIEMPRE cuando el usuario usa la aplicación en el navegador
 * - NO aparece cuando la aplicación está instalada como PWA
 * - NO guarda estado cuando el usuario presiona "Ahora no" o cierra el banner
 * - Solo guarda estado permanente cuando la aplicación es instalada exitosamente
 *
 * @returns {object} Estado y funciones para el manejo de instalación PWA
 */
const usePWAInstall = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showBanner, setShowBanner] = useState(false);

  const STORAGE_KEYS = {
    PWA_INSTALL_STATUS: "recetario_pwa_install_status", // Cambio: solo guardamos si fue instalada
    FIRST_VISIT: "recetario_first_visit",
  };
  // Verificar si mostrar el banner
  useEffect(() => {
    // Limpiar claves antigas del localStorage para evitar conflictos
    const oldKeys = [
      "recetario_pwa_banner_dismissed",
      "recetario_pwa_install_prompted",
    ];
    oldKeys.forEach(key => {
      if (localStorage.getItem(key)) {
        localStorage.removeItem(key);
      }
    });

    const installStatus = localStorage.getItem(STORAGE_KEYS.PWA_INSTALL_STATUS);
    const firstVisit = localStorage.getItem(STORAGE_KEYS.FIRST_VISIT);

    if (!firstVisit) {
      localStorage.setItem(STORAGE_KEYS.FIRST_VISIT, "true");
    }

    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone === true;

    // Solo mostrar nuestro banner personalizado si:
    // 1. La app NO está instalada (no en modo standalone)
    // 2. NO se ha instalado previamente (installStatus !== "installed")
    // 3. NO hay un deferredPrompt disponible (para evitar duplicados)
    // 4. Esperamos un poco para asegurar que beforeinstallprompt se ejecute primero
    if (!isStandalone && installStatus !== "installed" && !deferredPrompt) {
      // Aumentamos el tiempo de espera para dar chance al beforeinstallprompt
      const timer = setTimeout(() => {
        // Verificamos nuevamente que no haya deferredPrompt antes de mostrar
        if (!deferredPrompt) {
          setShowBanner(true);
        }
      }, 5000); // 5 segundos de espera
      return () => clearTimeout(timer);
    } else if (deferredPrompt) {
      // Si hay deferredPrompt, ocultar nuestro banner para evitar duplicación
      setShowBanner(false);
    }
  }, [
    STORAGE_KEYS.PWA_INSTALL_STATUS,
    STORAGE_KEYS.FIRST_VISIT,
    deferredPrompt,
  ]); // Escuchar eventos PWA
  useEffect(() => {
    const handleBeforeInstallPrompt = e => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Inmediatamente ocultar nuestro banner personalizado
      setShowBanner(false);
    };

    const handleAppInstalled = () => {
      setDeferredPrompt(null);
      setShowBanner(false);
      // Solo aquí guardamos que la app fue instalada
      localStorage.setItem(STORAGE_KEYS.PWA_INSTALL_STATUS, "installed");
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, [STORAGE_KEYS.PWA_INSTALL_STATUS]);
  const handleInstall = useCallback(async () => {
    if (!deferredPrompt) {
      // Si no hay deferredPrompt, simplemente cerrar nuestro banner
      // NO guardamos nada en localStorage para que aparezca en la próxima visita
      setShowBanner(false);
      return false;
    }

    try {
      await deferredPrompt.prompt();
      const result = await deferredPrompt.userChoice;

      setDeferredPrompt(null);
      setShowBanner(false);

      // Solo guardamos en localStorage si el usuario aceptó instalar
      if (result.outcome === "accepted") {
        localStorage.setItem(STORAGE_KEYS.PWA_INSTALL_STATUS, "installed");
      }
      // Si declinó, NO guardamos nada para que aparezca en futuras visitas

      return result.outcome === "accepted";
    } catch (error) {
      setShowBanner(false);
      // En caso de error, NO guardamos nada para permitir intentar de nuevo
      return false;
    }
  }, [deferredPrompt, STORAGE_KEYS.PWA_INSTALL_STATUS]);
  const handleCloseBanner = useCallback(() => {
    setShowBanner(false);
    // NO guardamos nada en localStorage para que aparezca en futuras visitas
    // Solo ocultamos el banner por esta sesión
  }, []);

  const isAppInstalled = () => {
    return (
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone === true
    );
  };

  return {
    showBanner,
    handleInstall,
    handleCloseBanner,
    isAppInstalled: isAppInstalled(),
  };
};

export default usePWAInstall;
