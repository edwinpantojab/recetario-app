// Script para generar íconos SVG optimizados para Recetario Mágico
// Este archivo puede ejecutarse en Node.js con dependencias apropiadas

// Sistema de logging
const logger = {
  success: msg => process.stdout.write(`✅ ${msg}\n`),
  info: msg => process.stdout.write(`ℹ️ ${msg}\n`),
  debug: (title, content) => process.stdout.write(`🔍 ${title}:\n${content}\n`),
};

// Función para crear SVG del ícono principal
function createMainIconSVG() {
  return `<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
    <defs>
        <linearGradient id="bgGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color:#f0fdf4;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#dcfce7;stop-opacity:1" />
        </linearGradient>
        <linearGradient id="hatGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color:#ffffff;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#f9fafb;stop-opacity:1" />
        </linearGradient>
    </defs>
    
    <!-- Fondo con esquinas redondeadas -->
    <rect width="512" height="512" rx="80" ry="80" fill="url(#bgGrad)"/>
    
    <!-- Gorro de chef -->
    <!-- Base del gorro -->
    <ellipse cx="256" cy="320" rx="120" ry="80" fill="url(#hatGrad)" stroke="#047857" stroke-width="6"/>
    
    <!-- Parte superior del gorro -->
    <ellipse cx="256" cy="220" rx="100" ry="100" fill="url(#hatGrad)" stroke="#047857" stroke-width="6"/>
    
    <!-- Detalles decorativos del gorro -->
    <circle cx="200" cy="200" r="8" fill="#047857"/>
    <circle cx="256" cy="180" r="8" fill="#047857"/>
    <circle cx="312" cy="200" r="8" fill="#047857"/>
    
    <!-- Vapor/humo decorativo -->
    <path d="M 180 300 Q 185 280 190 300 Q 195 320 200 300" stroke="#e5e7eb" stroke-width="4" fill="none" stroke-linecap="round"/>
    <path d="M 200 300 Q 205 280 210 300 Q 215 320 220 300" stroke="#e5e7eb" stroke-width="4" fill="none" stroke-linecap="round"/>
    <path d="M 220 300 Q 225 280 230 300 Q 235 320 240 300" stroke="#e5e7eb" stroke-width="4" fill="none" stroke-linecap="round"/>
</svg>`;
}

// Función para crear versión simplificada para tamaños pequeños
function createSimpleIconSVG() {
  return `<svg width="64" height="64" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
    <defs>
        <linearGradient id="bgGradSmall" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color:#f0fdf4;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#dcfce7;stop-opacity:1" />
        </linearGradient>
    </defs>
    
    <!-- Fondo -->
    <rect width="64" height="64" rx="12" ry="12" fill="url(#bgGradSmall)"/>
    
    <!-- Gorro de chef simplificado -->
    <ellipse cx="32" cy="42" rx="18" ry="12" fill="white" stroke="#047857" stroke-width="2"/>
    <ellipse cx="32" cy="30" rx="15" ry="15" fill="white" stroke="#047857" stroke-width="2"/>
    
    <!-- Puntos decorativos -->
    <circle cx="24" cy="28" r="2" fill="#047857"/>
    <circle cx="32" cy="25" r="2" fill="#047857"/>
    <circle cx="40" cy="28" r="2" fill="#047857"/>
</svg>`;
}

logger.success("SVG Icons generated for Recetario Mágico");
logger.debug("Main Icon", createMainIconSVG());
logger.debug("Simple Icon", createSimpleIconSVG());

module.exports = { createMainIconSVG, createSimpleIconSVG };
