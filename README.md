# 🍲 Recetario Mágico

¡Bienvenido al Recetario Mágico! Una aplicación web interactiva para gestionar tus recetas favoritas, planificar tus comidas semanales, y organizar tu lista de compras. Desarrollada con React y optimizada para una experiencia fluida y moderna.

## 🌐 [**Ver Aplicación en Vivo**](https://edwinpantojab.github.io/recetario-app)

[![Deploy Status](https://img.shields.io/badge/Status-Live-brightgreen)](https://edwinpantojab.github.io/recetario-app)
[![Build](https://img.shields.io/badge/Build-Passing-brightgreen)](https://github.com/edwinpantojab/recetario-app)

---

## ✨ Características

- **Gestión de Recetas:** Añade, edita, elimina y visualiza tus recetas con detalles como ingredientes, instrucciones, tiempo de preparación y porciones.
- **Planificador Semanal:** Organiza tus comidas arrastrando y soltando recetas en un calendario semanal.
- **Lista de Compras:** Genera y gestiona tu lista de compras, con categorías predefinidas y personalizables, precios y presupuesto.
- **Recetas Online:** Guarda y accede rápidamente a tus enlaces favoritos de sitios web de recetas online.
- **Compartir Recetas:** Genera enlaces para compartir tus recetas con otros usuarios.
- **Modo Oscuro/Claro:** Alterna entre temas para una mejor experiencia visual.
- **Persistencia Local:** Todas tus recetas, planes y listas se guardan automáticamente en tu navegador.
- **PWA Ready:** Instalable como aplicación nativa en dispositivos móviles y escritorio.

---

## 🚀 Tecnologías Utilizadas

### Frontend:

- **React 18** (Biblioteca JavaScript para construir interfaces de usuario)
- **Tailwind CSS** (Framework CSS para estilos rápidos y responsivos)
- **Lucide React** (Colección de íconos personalizables)

### Almacenamiento:

- **localStorage** (Persistencia local de datos en el navegador)
- **Optimización avanzada** con debounce, cache y validación de datos

---

## 🛠️ Configuración del Proyecto

Sigue estos pasos para tener el proyecto funcionando en tu máquina local.

### Prerrequisitos

Asegúrate de tener instalado lo siguiente:

- Node.js (versión 14 o superior recomendada)
- npm (viene con Node.js) o Yarn
- Git

### 1. Clonar el Repositorio

Si aún no has clonado el repositorio de GitHub, hazlo:

```sh
git clone https://github.com/edwinpantojab/recetario-app.git
cd recetario-app
```

### 2. Instalar Dependencias

Navega a la carpeta del proyecto e instala todas las dependencias:

```sh
npm install
# o si usas yarn:
# yarn install
```

### 3. Iniciar la Aplicación

Una vez que todas las dependencias estén instaladas, puedes iniciar la aplicación en modo de desarrollo:

```sh
npm start
# o si usas yarn:
# yarn start
```

Esto abrirá la aplicación en tu navegador en [http://localhost:3000](http://localhost:3000) (o un puerto diferente si el 3000 ya está en uso).

### 4. Build para Producción

Para crear una versión optimizada para producción:

```sh
npm run build
# o si usas yarn:
# yarn build
```

Los archivos optimizados se generarán en la carpeta `build/`.

### 5. Deploy a GitHub Pages

Para desplegar la aplicación en GitHub Pages:

```sh
npm run deploy
# o si usas yarn:
# yarn deploy
```

---

## 📱 Características Técnicas

### 🎯 Optimizaciones de Rendimiento

- **Lazy Loading:** Los componentes se cargan bajo demanda para mejorar el tiempo de carga inicial
- **Memoización:** Uso extensivo de `useMemo` y `useCallback` para evitar re-renderizados innecesarios
- **Debounce:** Las operaciones de guardado en localStorage utilizan debounce para optimizar el rendimiento
- **Code Splitting:** Separación automática del código para cargas más eficientes

### 💾 Gestión de Datos

- **Persistencia Local:** Todos los datos se almacenan en localStorage del navegador
- **Backup/Restore:** Funcionalidades de exportar e importar datos para backup
- **Validación:** Validación robusta de datos con manejo de errores
- **Cache Optimizado:** Sistema de cache inteligente para mejorar la respuesta

### 🎨 Interfaz de Usuario

- **Responsive Design:** Adaptable a dispositivos móviles, tablets y escritorio
- **Tema Dinámico:** Soporte para modo claro y oscuro
- **Transiciones Suaves:** Animaciones CSS optimizadas para una mejor experiencia
- **Iconografía Consistente:** Uso de Lucide React para iconos uniformes

### 🔧 Herramientas de Desarrollo

- **ESLint:** Linting de código para mantener estándares de calidad
- **Prettier:** Formateo automático de código
- **Husky:** Git hooks para verificaciones pre-commit
- **PostCSS:** Procesamiento avanzado de CSS con Tailwind

---

## 🤝 Contribuciones

¡Las contribuciones son bienvenidas! Si deseas mejorar el Recetario Mágico, por favor:

1. Haz un "fork" de este repositorio.
2. Crea una nueva rama (`git checkout -b feature/nueva-funcionalidad`).
3. Realiza tus cambios y haz "commit" (`git commit -m 'feat: añade nueva funcionalidad X'`).
4. Haz "push" a la rama (`git push origin feature/nueva-funcionalidad`).
5. Abre un "Pull Request".

---

## 📄 Licencia

Este proyecto está bajo la licencia MIT.

---

## 📞 Contacto

Si tienes preguntas o sugerencias, no dudes en contactar.
