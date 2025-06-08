import { useState, useEffect, useCallback } from "react";

const usePWAInstall = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showBanner, setShowBanner] = useState(false);

  const STORAGE_KEYS = {
    PWA_BANNER_DISMISSED: "recetario_pwa_banner_dismissed",
    PWA_INSTALL_PROMPTED: "recetario_pwa_install_prompted",
    FIRST_VISIT: "recetario_first_visit",
  };

  // Verificar si mostrar el banner
  useEffect(() => {
    const bannerDismissed = localStorage.getItem(
      STORAGE_KEYS.PWA_BANNER_DISMISSED
    );
    const installPrompted = localStorage.getItem(
      STORAGE_KEYS.PWA_INSTALL_PROMPTED
    );
    const firstVisit = localStorage.getItem(STORAGE_KEYS.FIRST_VISIT);

    if (!firstVisit) {
      localStorage.setItem(STORAGE_KEYS.FIRST_VISIT, "true");
    }

    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone === true;

    if (!bannerDismissed && !installPrompted && !isStandalone) {
      setTimeout(() => {
        setShowBanner(true);
      }, 2000);
    }
  }, [
    STORAGE_KEYS.PWA_BANNER_DISMISSED,
    STORAGE_KEYS.PWA_INSTALL_PROMPTED,
    STORAGE_KEYS.FIRST_VISIT,
  ]);

  // Escuchar eventos PWA
  useEffect(() => {
    const handleBeforeInstallPrompt = e => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    const handleAppInstalled = () => {
      setDeferredPrompt(null);
      setShowBanner(false);
      localStorage.setItem(STORAGE_KEYS.PWA_INSTALL_PROMPTED, "installed");
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
  }, [STORAGE_KEYS.PWA_INSTALL_PROMPTED]);

  const handleInstall = useCallback(async () => {
    if (!deferredPrompt) {
      setShowBanner(false);
      localStorage.setItem(STORAGE_KEYS.PWA_BANNER_DISMISSED, "true");
      return false;
    }

    try {
      await deferredPrompt.prompt();
      const result = await deferredPrompt.userChoice;

      setDeferredPrompt(null);
      setShowBanner(false);

      localStorage.setItem(STORAGE_KEYS.PWA_INSTALL_PROMPTED, result.outcome);
      localStorage.setItem(
        STORAGE_KEYS.PWA_BANNER_DISMISSED,
        result.outcome === "accepted" ? "installed" : "declined"
      );

      return result.outcome === "accepted";
    } catch (error) {
      setShowBanner(false);
      localStorage.setItem(STORAGE_KEYS.PWA_BANNER_DISMISSED, "error");
      return false;
    }
  }, [
    deferredPrompt,
    STORAGE_KEYS.PWA_BANNER_DISMISSED,
    STORAGE_KEYS.PWA_INSTALL_PROMPTED,
  ]);

  const handleCloseBanner = useCallback(() => {
    setShowBanner(false);
    localStorage.setItem(STORAGE_KEYS.PWA_BANNER_DISMISSED, "dismissed");
  }, [STORAGE_KEYS.PWA_BANNER_DISMISSED]);

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
