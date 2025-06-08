const fs = require("fs");

// Función para crear favicon ICO simple usando datos básicos
function createFaviconICO() {
  // Este es un favicon ICO básico de 16x16 en formato base64
  // Contiene un ícono simple de chef hat en verde
  const icoBase64 = `AAABAAEAEBAAAAEAIABoBAAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADYAAABYAAAAeAAAAKQAAACsAAAArAAAAKwAAACsAAAArAAAAKwAAACsAAAApAAAAHgAAABYAAAANgAAAAAAAAAAAAAAfHh4eH9/f3+Li4uLlZWVlZeXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eVi4uLi39/f38fHh4eHwAAAAB8eHh4f4+Pj4+cnJyclpaWlpubm5uYmJiYmJiYmJubm5ubm5ublpaWlpycnJyPj4+PeHh4eHwAAAAAYGBgYGlpaWl5eXl5g4ODg4qKioqPj4+Pj4+Pj4+Pj4+KioqKg4ODg3l5eXlpaWlpYGBgYGAAAAAAAAAAAAAAAABISEhIUlJSUltbW1tcXFxcXFxcXFxcXFxcW1tbW1JSUlJISEhIAAAAAAAAAAAAAAAAAAAAAAAAAAA8PDw8RkZGRk5OTk5QUFBQUFBQUFFRUVFOTk5ORkZGRjw8PDwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAwMDAyODg4Ozg4ODs4ODg7ODg4Ozg4ODs4ODg7MDAyMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAsLCwsNDQ0NDY2NjY2NjY2NjY2NjY2NjY0NDQ0LCwsLAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACgoKCgyMjIyNDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDIyMjIoKCgoAAAAAAAAAAAAAAAAAAAAAAAAAAAAACQkJCQoKCgoKioqKioqKioqKioqKioqKioqKigoKCgkJCQkAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAgICAgICAgIiIiIiIiIiIiIiIiIiIiIiIiIiIgICAgICAgIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA`;

  return Buffer.from(icoBase64, "base64");
}

// Crear favicon.ico mejorado
try {
  const icoData = createFaviconICO();
  fs.writeFileSync("public/favicon.ico", icoData);
  fs.writeFileSync("build/favicon.ico", icoData);
  console.log("✅ favicon.ico actualizado en public/ y build/");
} catch (error) {
  console.log("⚠️ Error creando favicon.ico:", error.message);
}

console.log("🎨 Íconos base creados. Para generar todos los tamaños PNG:");
console.log("1. Abre generate-icons.html en tu navegador");
console.log("2. Selecciona el diseño que más te guste");
console.log('3. Haz clic en "Descargar Todos los Tamaños"');
console.log(
  "4. Mueve los archivos descargados a las carpetas public/ y build/"
);
