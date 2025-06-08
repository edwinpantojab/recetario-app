// Verificador de imágenes para PWA
// Este script verifica que todas las imágenes referenciadas en manifest.json existen

const fs = require("fs");
const path = require("path");

// Sistema de logging para verificación de imágenes
const logger = {
  header: msg => process.stdout.write(`\n${msg}\n${"-".repeat(50)}\n`),
  success: msg => process.stdout.write(`✅ ${msg}\n`),
  warn: msg => process.stdout.write(`⚠️ ${msg}\n`),
  error: msg => process.stdout.write(`❌ ${msg}\n`),
  info: msg => process.stdout.write(`🔍 ${msg}\n`),
  category: msg => process.stdout.write(`\n${msg}:\n`),
};

logger.info("Verificando imágenes del manifest...\n");

// Leer el manifest.json
const manifestPath = path.join(__dirname, "public", "manifest.json");

// Verificar que el manifest.json existe
if (!fs.existsSync(manifestPath)) {
  logger.error("No se encontró el archivo manifest.json en: " + manifestPath);
  process.exit(1);
}

let manifest;
try {
  manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
} catch (error) {
  logger.error("Error al leer o parsear manifest.json: " + error.message);
  process.exit(1);
}

let allImagesExist = true;
const publicDir = path.join(__dirname, "public");

// Verificar iconos principales
logger.category("📱 Iconos principales");
if (manifest.icons && Array.isArray(manifest.icons)) {
  manifest.icons.forEach(icon => {
    const imagePath = path.join(publicDir, icon.src);
    const exists = fs.existsSync(imagePath);
    const status = exists ? "✅" : "❌";
    logger.info(`${status} ${icon.src} (${icon.sizes})`);
    if (!exists) allImagesExist = false;
  });
} else {
  logger.warn("No se encontraron iconos en el manifest");
}

// Verificar iconos de shortcuts
logger.category("🔗 Iconos de shortcuts");
if (manifest.shortcuts && Array.isArray(manifest.shortcuts)) {
  manifest.shortcuts.forEach(shortcut => {
    if (shortcut.icons && Array.isArray(shortcut.icons)) {
      shortcut.icons.forEach(icon => {
        const imagePath = path.join(publicDir, icon.src);
        const exists = fs.existsSync(imagePath);
        const status = exists ? "✅" : "❌";
        logger.info(`${status} ${icon.src} para "${shortcut.name}"`);
        if (!exists) allImagesExist = false;
      });
    }
  });
} else {
  logger.warn("No se encontraron shortcuts en el manifest");
}

// Verificar screenshots
logger.category("📸 Screenshots");
if (manifest.screenshots && Array.isArray(manifest.screenshots)) {
  manifest.screenshots.forEach(screenshot => {
    const imagePath = path.join(publicDir, screenshot.src);
    const exists = fs.existsSync(imagePath);
    const status = exists ? "✅" : "❌";
    logger.info(`${status} ${screenshot.src} (${screenshot.form_factor})`);
    if (!exists) allImagesExist = false;
  });
} else {
  logger.warn("No se encontraron screenshots en el manifest");
}

// Resultado final
logger.header("\nRESULTADO FINAL");
if (allImagesExist) {
  logger.success("¡Todas las imágenes están disponibles!");
  logger.success("Tu PWA debería mostrar iconos correctamente");
} else {
  logger.warn("Algunas imágenes están faltando");
  logger.info("Revisa los errores anteriores y añade las imágenes faltantes");
}
