@echo off
echo 🚀 Desplegando Recetario Mágico a GitHub Pages...
echo 📦 Construyendo aplicación...
call npm run build

echo 🌐 Desplegando a GitHub Pages...
call npm run deploy

echo ✅ ¡Despliegue completado!
echo 🔗 Tu aplicación está disponible en: https://edwinpantojab.github.io/recetario-app
echo.
echo ⏰ Los cambios pueden tardar unos minutos en reflejarse.
pause
