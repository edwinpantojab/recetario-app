import React from "react"; // Importa la librería React
import ReactDOM from "react-dom/client"; // Importa ReactDOM para renderizar la aplicación
import "./index.css"; // Importa los estilos globales (donde Tailwind se inicializaría)
import "./scroll-fixes.css"; // Importa las correcciones específicas para problemas de scroll
import App from "./App"; // Importa el componente principal de tu aplicación, App.js
import ErrorBoundary from "./components/ErrorBoundary"; // Importa el Error Boundary

// Crea un "root" de React para tu aplicación.
// Esto es el punto donde tu aplicación React se conectará al DOM del navegador.
const root = ReactDOM.createRoot(document.getElementById("root"));

// Renderiza tu componente principal (App) dentro del "root".
// <React.StrictMode> es un componente que ayuda a detectar problemas potenciales en la aplicación.
// <ErrorBoundary> captura errores y previene que la aplicación se rompa completamente.
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
