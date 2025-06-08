import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

/**
 * ErrorBoundary - Componente para capturar y manejar errores de React
 * Mejora la estabilidad de la aplicación y proporciona feedback útil
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    // Actualiza el estado para mostrar la UI de error
    return { hasError: true };
  }
  componentDidCatch(error, errorInfo) {
    // Captura información del error para debugging
    this.setState({
      error: error,
      errorInfo: errorInfo,
    });

    // Aquí podrías enviar el error a un servicio de logging
    // eslint-disable-next-line no-console
    console.error("ErrorBoundary capturó un error:", error, errorInfo);
  }

  handleRetry = () => {
    // Resetea el estado de error
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
            {/* Ícono de error */}
            <div className="flex items-center justify-center w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full mx-auto mb-4">
              <AlertTriangle
                size={32}
                className="text-red-600 dark:text-red-400"
                aria-hidden="true"
              />
            </div>

            {/* Título */}
            <h1 className="text-xl font-bold text-slate-900 dark:text-white text-center mb-2">
              Algo salió mal
            </h1>

            {/* Mensaje */}
            <p className="text-slate-600 dark:text-slate-300 text-center mb-6">
              La aplicación encontró un error inesperado. Puedes intentar
              recargar o contactar soporte.
            </p>

            {/* Detalles del error (solo en desarrollo) */}
            {process.env.NODE_ENV === "development" && this.state.error && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700/50 rounded-lg">
                <h3 className="text-sm font-medium text-red-800 dark:text-red-300 mb-1">
                  Error (desarrollo):
                </h3>
                <pre className="text-xs text-red-700 dark:text-red-400 overflow-auto">
                  {this.state.error.toString()}
                </pre>
              </div>
            )}

            {/* Botones de acción */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={this.handleRetry}
                className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-all duration-200 font-medium flex items-center justify-center"
              >
                <RefreshCw size={16} className="mr-2" />
                Reintentar
              </button>

              <button
                onClick={() => window.location.reload()}
                className="flex-1 px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 transition-all duration-200 font-medium"
              >
                Recargar página
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
