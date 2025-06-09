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
  const [isInitialized, setIsInitialized] = useState(false);

  // Constantes para localStorage (definidas fuera de useEffect para evitar dependencias)
  const PWA_INSTALL_STATUS = "recetario_pwa_install_status";
  const FIRST_VISIT = "recetario_first_visit";
  // Inicialización una sola vez
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log("🚀 PWA Hook inicializando...");

    // Limpiar claves antigas del localStorage para evitar conflictos
    const oldKeys = [
      "recetario_pwa_banner_dismissed",
      "recetario_pwa_install_prompted",
    ];
    oldKeys.forEach(key => {
      if (localStorage.getItem(key)) {
        // eslint-disable-next-line no-console
        console.log(`🧹 Limpiando clave antigua: ${key}`);
        localStorage.removeItem(key);
      }
    });

    const firstVisit = localStorage.getItem(FIRST_VISIT);
    if (!firstVisit) {
      // eslint-disable-next-line no-console
      console.log("👋 Primera visita detectada");
      localStorage.setItem(FIRST_VISIT, "true");
    }

    setIsInitialized(true);
    // eslint-disable-next-line no-console
    console.log("✅ PWA Hook inicializado");
  }, []); // Solo una vez al montar

  // Verificar si mostrar el banner
  useEffect(() => {
    if (!isInitialized) return;
    const checkAndShowBanner = () => {
      const installStatus = localStorage.getItem(PWA_INSTALL_STATUS);
      const isStandalone =
        window.matchMedia("(display-mode: standalone)").matches ||
        window.navigator.standalone === true;

      // eslint-disable-next-line no-console
      console.log("🔍 PWA Banner Debug:", {
        isInitialized,
        installStatus,
        isStandalone,
        deferredPrompt: !!deferredPrompt,
      }); // LÓGICA CORREGIDA:
      // Mostrar nuestro banner personalizado si:
      // 1. No está en modo standalone (no es PWA instalada)
      // 2. No se ha instalado previamente
      const shouldShow = !isStandalone && installStatus !== "installed";

      // En desarrollo, siempre mostrar nuestro banner (ignoring deferredPrompt)
      // En producción, dar prioridad al prompt nativo si está disponible
      const isDevelopment = process.env.NODE_ENV === "development";
      const shouldHideForNativePrompt =
        !isDevelopment && deferredPrompt !== null;

      // eslint-disable-next-line no-console
      console.log("🎯 PWA Banner Logic:", {
        shouldShow,
        isDevelopment,
        shouldHideForNativePrompt,
        finalDecision: shouldShow && !shouldHideForNativePrompt,
      });

      if (shouldShow && !shouldHideForNativePrompt) {
        // eslint-disable-next-line no-console
        console.log("✅ Mostrando PWA banner personalizado");
        setShowBanner(true);
      } else {
        // eslint-disable-next-line no-console
        console.log("❌ Ocultando PWA banner:", {
          reason: !shouldShow
            ? "no debería mostrar"
            : "prompt nativo disponible",
        });
        setShowBanner(false);
      }
    }; // Verificar inmediatamente
    checkAndShowBanner();

    // Timer para re-verificar después de un pequeño delay solo si no se ha mostrado aún
    const timer = setTimeout(() => {
      // eslint-disable-next-line no-console
      console.log("⏰ Timer re-verificando estado del banner...");
      checkAndShowBanner();
    }, 1500);

    return () => clearTimeout(timer);
  }, [isInitialized, deferredPrompt]); // Removed constant dependency  // Escuchar eventos PWA
  useEffect(() => {
    const handleBeforeInstallPrompt = e => {
      // eslint-disable-next-line no-console
      console.log("🔔 beforeinstallprompt event detected");

      // IMPORTANTE: Interceptamos el evento para controlar cuándo mostrar el banner
      // Esto genera un warning en Chrome: "Banner not shown: beforeinstallprompt..."
      // El warning es ESPERADO y NO es un error - significa que tenemos control total
      e.preventDefault();
      setDeferredPrompt(e);

      // En desarrollo, mantenemos nuestro banner personalizado visible para testing
      // En producción, podemos dar prioridad al prompt nativo del navegador
      const isDevelopment = process.env.NODE_ENV === "development";
      if (!isDevelopment) {
        // eslint-disable-next-line no-console
        console.log(
          "🔄 Production mode - hiding custom banner for native prompt"
        );
        setShowBanner(false);
      } else {
        // eslint-disable-next-line no-console
        console.log("🔧 Development mode - keeping custom banner visible");
        // El warning del navegador es normal - tenemos el control del timing
      }
    };

    const handleAppInstalled = () => {
      // eslint-disable-next-line no-console
      console.log("📱 App installed - updating status");
      setDeferredPrompt(null);
      setShowBanner(false);
      // Solo aquí guardamos que la app fue instalada
      localStorage.setItem(PWA_INSTALL_STATUS, "installed");
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
  }, []); // Dependencies removed as they are constants

  const handleInstall = useCallback(async () => {
    // eslint-disable-next-line no-console
    console.log("🚀 Iniciando proceso de instalación PWA...", {
      hasDeferredPrompt: !!deferredPrompt,
    });

    if (!deferredPrompt) {
      // eslint-disable-next-line no-console
      console.log(
        "ℹ️ No hay prompt nativo disponible - solo cerrando banner personalizado"
      );
      setShowBanner(false);
      return false;
    }

    try {
      // eslint-disable-next-line no-console
      console.log("📱 Mostrando prompt nativo de instalación...");

      // Aquí es donde finalmente llamamos .prompt() - esto resuelve el warning del navegador
      await deferredPrompt.prompt();
      const result = await deferredPrompt.userChoice;

      // eslint-disable-next-line no-console
      console.log("✅ Resultado de instalación:", result.outcome);

      setDeferredPrompt(null);
      setShowBanner(false);

      // Solo guardamos en localStorage si el usuario aceptó instalar
      if (result.outcome === "accepted") {
        localStorage.setItem(PWA_INSTALL_STATUS, "installed");
        // eslint-disable-next-line no-console
        console.log("🎉 PWA instalada exitosamente!");
      } else {
        // eslint-disable-next-line no-console
        console.log("❌ Usuario declinó la instalación");
      }

      return result.outcome === "accepted";
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("💥 Error durante instalación PWA:", error);
      setShowBanner(false);
      return false;
    }
  }, [deferredPrompt]); // Removed unnecessary dependency
  const handleCloseBanner = useCallback(() => {
    setShowBanner(false);
    // NO guardamos nada en localStorage para que aparezca en futuras visitas
    // Solo ocultamos el banner por esta sesión
  }, []);
  const isAppInstalled = useCallback(() => {
    return (
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone === true
    );
  }, []);

  return {
    showBanner,
    handleInstall,
    handleCloseBanner,
    isAppInstalled: isAppInstalled(),
  };
};

export default usePWAInstall;
