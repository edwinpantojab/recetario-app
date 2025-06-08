import { useState, useEffect } from "react";

/**
 * Hook personalizado para detectar dispositivos móviles y táctiles
 * @returns {Object} Objeto con información del dispositivo
 */
export const useMobileDetection = () => {
  const [deviceInfo, setDeviceInfo] = useState({
    isMobile: false,
    isTouchDevice: false,
    screenWidth: 0,
  });

  useEffect(() => {
    const checkDevice = () => {
      const isTouchDevice =
        "ontouchstart" in window || navigator.maxTouchPoints > 0;
      const screenWidth = window.innerWidth;
      const isMobile = screenWidth <= 768 || isTouchDevice;

      setDeviceInfo({
        isMobile,
        isTouchDevice,
        screenWidth,
      });
    };

    // Verificar al montar
    checkDevice();

    // Escuchar cambios de tamaño de ventana
    window.addEventListener("resize", checkDevice);

    return () => {
      window.removeEventListener("resize", checkDevice);
    };
  }, []);

  return deviceInfo;
};
