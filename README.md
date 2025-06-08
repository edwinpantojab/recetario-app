# 🍲 Recetario Mágico

¡Bienvenido al Recetario Mágico! Una aplicación web interactiva para gestionar tus recetas favoritas, planificar tus comidas semanales, y organizar tu lista de compras. Desarrollada con React y Firebase para una experiencia dinámica y persistente.

---

## ✨ Características

- **Gestión de Recetas:** Añade, edita, elimina y visualiza tus recetas con detalles como ingredientes, instrucciones, tiempo de preparación y porciones.
- **Planificador Semanal:** Organiza tus comidas arrastrando y soltando recetas en un calendario semanal.
- **Lista de Compras:** Genera y gestiona tu lista de compras, con categorías predefinidas y personalizables, precios y presupuesto.
- **Recetas Online:** Guarda y accede rápidamente a tus enlaces favoritos de sitios web de recetas online.
- **Compartir Recetas:** Comparte tus recetas con otros usuarios de la aplicación.
- **Modo Oscuro/Claro:** Alterna entre temas para una mejor experiencia visual.
- **Persistencia de Datos:** Todas tus recetas, planes y listas se guardan en la nube (Firestore de Firebase).

---

## 🚀 Tecnologías Utilizadas

### Frontend:

- **React** (Biblioteca JavaScript para construir interfaces de usuario)
- **Tailwind CSS** (Framework CSS para estilos rápidos y responsivos)
- **Lucide React** (Colección de íconos personalizables)

### Backend / Base de Datos:

- **Firebase Firestore** (Base de datos NoSQL en la nube)
- **Firebase Authentication** (Para la gestión de usuarios, incluyendo autenticación anónima)

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
git clone https://github.com/tu-usuario/recetario-magico.git
cd recetario-magico
```

(Reemplaza la URL con la de tu repositorio real.)

### 2. Instalar Dependencias

Navega a la carpeta del proyecto e instala todas las dependencias:

```sh
npm install
# o si usas yarn:
# yarn install
```

### 3. Configuración de Firebase

**Crea un proyecto de Firebase:**

- Ve a la [Consola de Firebase](https://console.firebase.google.com/).
- Haz clic en "Añadir proyecto" y sigue los pasos.

**Configura Firestore:**

- En tu proyecto de Firebase, ve a "Firestore Database" en el menú de la izquierda.
- Haz clic en "Crear base de datos" y selecciona el modo "Iniciar en modo de producción".

**Configura Authentication:**

- En tu proyecto de Firebase, ve a "Authentication" en el menú de la izquierda.
- Ve a la pestaña "Método de inicio de sesión" y habilita el proveedor "Anónimo".

**Obtén tus credenciales de Firebase:**

- En la Consola de Firebase, ve a "Configuración del proyecto" (icono de engranaje).
- En la sección "Tus apps", selecciona la aplicación web (o crea una si no tienes).
- Copia el objeto `firebaseConfig`.

**Crea el archivo firebaseConfig.js:**

Dentro de la carpeta `src/firebase/`, crea un archivo llamado `firebaseConfig.js`:

```js
// src/firebase/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Tu configuración de Firebase
const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_AUTH_DOMAIN",
  projectId: "TU_PROJECT_ID",
  storageBucket: "TU_STORAGE_BUCKET",
  messagingSenderId: "TU_MESSAGING_SENDER_ID",
  appId: "TU_APP_ID",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
```

> **NOTA:** Las variables `__app_id` y `__initial_auth_token` son inyectadas por el entorno de Canvas. Si estás ejecutando esto localmente, no las necesitarás directamente aquí. La autenticación anónima se gestiona en App.js.

---

### 4. Reglas de Seguridad de Firestore

Para que tu aplicación pueda leer y escribir datos, necesitas configurar las reglas de seguridad en tu base de datos Firestore. Ve a "Firestore Database" -> "Reglas" en la Consola de Firebase y actualiza tus reglas a lo siguiente:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Reglas para datos privados del usuario (recetas, planificador, lista de compras)
    match /artifacts/{appId}/users/{userId}/{collectionName} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Reglas para datos públicos compartidos (recetas compartidas)
    match /artifacts/{appId}/public/data/sharedRecipes/{recipeId} {
      allow read: if true; // Cualquiera puede leer recetas compartidas
      allow write: if request.auth != null; // Solo usuarios autenticados pueden compartirlas
    }
  }
}
```

> **Importante:** Estas reglas permiten a cualquier usuario autenticado (incluidos los anónimos) leer y escribir en sus propias colecciones de usuario, y leer/escribir en la colección `sharedRecipes`. Ajusta según tus necesidades de seguridad.

---

### 5. Iniciar la Aplicación

Una vez que todas las dependencias estén instaladas y Firebase configurado, puedes iniciar la aplicación en modo de desarrollo:

```sh
npm start
# o si usas yarn:
# yarn start
```

Esto abrirá la aplicación en tu navegador en [http://localhost:3000](http://localhost:3000) (o un puerto diferente si el 3000 ya está en uso).

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
