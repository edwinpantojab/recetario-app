// Verificador de imágenes para PWA
// Este script verifica que todas las imágenes referenciadas en manifest.json existen

/* eslint-disable no-console */

const fs = require("fs");
const path = require("path");

console.log("🔍 Verificando imágenes del manifest...\n");

// Leer el manifest.json
const manifestPath = path.join(__dirname, "public", "manifest.json");

// Verificar que el manifest.json existe
if (!fs.existsSync(manifestPath)) {
  console.error("❌ No se encontró el archivo manifest.json en:", manifestPath);
  process.exit(1);
}

let manifest;
try {
  manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
} catch (error) {
  console.error("❌ Error al leer o parsear manifest.json:", error.message);
  process.exit(1);
}

let allImagesExist = true;
const publicDir = path.join(__dirname, "public");

// Verificar iconos principales
console.log("📱 Iconos principales:");
if (manifest.icons && Array.isArray(manifest.icons)) {
  manifest.icons.forEach(icon => {
    const imagePath = path.join(publicDir, icon.src);
    const exists = fs.existsSync(imagePath);
    const status = exists ? "✅" : "❌";
    console.log(`  ${status} ${icon.src} (${icon.sizes})`);
    if (!exists) allImagesExist = false;
  });
} else {
  console.log("  ⚠️  No se encontraron iconos en el manifest");
}

// Verificar iconos de shortcuts
console.log("\n🔗 Iconos de shortcuts:");
if (manifest.shortcuts && Array.isArray(manifest.shortcuts)) {
  manifest.shortcuts.forEach(shortcut => {
    if (shortcut.icons && Array.isArray(shortcut.icons)) {
      shortcut.icons.forEach(icon => {
        const imagePath = path.join(publicDir, icon.src);
        const exists = fs.existsSync(imagePath);
        const status = exists ? "✅" : "❌";
        console.log(`  ${status} ${icon.src} para "${shortcut.name}"`);
        if (!exists) allImagesExist = false;
      });
    }
  });
} else {
  console.log("  ⚠️  No se encontraron shortcuts en el manifest");
}

// Verificar screenshots
console.log("\n📸 Screenshots:");
if (manifest.screenshots && Array.isArray(manifest.screenshots)) {
  manifest.screenshots.forEach(screenshot => {
    const imagePath = path.join(publicDir, screenshot.src);
    const exists = fs.existsSync(imagePath);
    const status = exists ? "✅" : "❌";
    console.log(`  ${status} ${screenshot.src} (${screenshot.form_factor})`);
    if (!exists) allImagesExist = false;
  });
} else {
  console.log("  ⚠️  No se encontraron screenshots en el manifest");
}

// Resultado final
console.log("\n" + "=".repeat(50));
if (allImagesExist) {
  console.log("🎉 ¡Todas las imágenes están disponibles!");
  console.log("✅ Tu PWA debería mostrar iconos correctamente");
} else {
  console.log("⚠️  Algunas imágenes están faltando");
  console.log("❌ Revisa las imágenes marcadas con ❌");
}
console.log("=".repeat(50));
