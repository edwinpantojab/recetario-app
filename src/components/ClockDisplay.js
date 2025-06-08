import React, { useState, useEffect, useMemo, useCallback } from "react";
import { CalendarDays, ClockIcon } from "lucide-react";

/**
 * ClockDisplay
 * Componente optimizado que muestra la fecha y hora actual en tiempo real.
 * - Se actualiza automáticamente cada segundo
 * - Utiliza formato localizado colombiano
 * - Implementa optimizaciones de rendimiento para evitar renders innecesarios
 * - Maneja la limpieza de recursos automáticamente
 *
 * @returns {JSX.Element} Widget de reloj con fecha y hora formateada
 */
const ClockDisplay = () => {
  // Estado para almacenar la fecha y hora actual
  const [currentTime, setCurrentTime] = useState(() => new Date());

  // Configuraciones de formato memoizadas para evitar recreación en cada render
  const formatters = useMemo(
    () => ({
      date: new Intl.DateTimeFormat("es-CO", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        timeZone: "America/Bogota",
      }),
      time: new Intl.DateTimeFormat("es-CO", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
        timeZone: "America/Bogota",
      }),
    }),
    []
  );

  // Función callback optimizada para actualizar el tiempo
  const updateTime = useCallback(() => {
    setCurrentTime(new Date());
  }, []);

  // Hook de efecto para manejar el intervalo de actualización
  useEffect(() => {
    // Configura intervalo para actualizar cada segundo
    const timerId = setInterval(updateTime, 1000);

    // Función de limpieza que se ejecuta al desmontar el componente
    return () => {
      clearInterval(timerId);
    };
  }, [updateTime]);

  // Formateo memoizado de fecha y hora para evitar cálculos innecesarios
  const { formattedDate, formattedTime } = useMemo(
    () => ({
      formattedDate: formatters.date.format(currentTime),
      formattedTime: formatters.time.format(currentTime),
    }),
    [currentTime, formatters]
  );

  return (
    <div className="text-xs sm:text-sm text-slate-100 bg-emerald-700 dark:bg-emerald-800 px-2.5 py-1 rounded-lg shadow flex items-center whitespace-nowrap">
      {/* Sección de fecha con ícono de calendario */}
      <CalendarDays
        size={16}
        className="mr-1.5 opacity-80"
        aria-hidden="true"
      />
      <span aria-label={`Fecha: ${formattedDate}`}>{formattedDate}</span>

      {/* Separador visual entre fecha y hora */}
      <span className="mx-1 opacity-70" aria-hidden="true">
        |
      </span>

      {/* Sección de hora con ícono de reloj */}
      <ClockIcon size={16} className="mr-1 opacity-80" aria-hidden="true" />
      <span aria-label={`Hora: ${formattedTime}`}>{formattedTime}</span>
    </div>
  );
};

// Exporta el componente con React.memo para prevenir re-renders innecesarios
// cuando las props del componente padre no han cambiado
export default React.memo(ClockDisplay);
