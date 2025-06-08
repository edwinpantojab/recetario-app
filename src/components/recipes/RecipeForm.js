import React, { useState, useEffect, useCallback, useMemo } from "react";
import { PlusCircle, Trash2, Camera, Upload, X } from "lucide-react";
import Modal from "../layout/Modal";

/**
 * Categorías de recetas disponibles
 * Constante inmutable para evitar recreación en cada render
 */
const CATEGORIES = [
  "Desayuno 🥐",
  "Almuerzo 🥗",
  "Cena 🍝",
  "Postre 🍰",
  "Snack 🍿",
  "Bebida 🍹",
  "Otro ✨",
];

/**
 * Estado inicial del formulario
 * Constante para evitar recreación y mejorar rendimiento
 */
const INITIAL_FORM_STATE = {
  name: "",
  ingredients: [{ text: "" }],
  instructions: [{ text: "" }],
  prepTime: "",
  category: CATEGORIES[0],
  imageUrl: "",
  imageFile: null,
  imagePreview: "",
  imageSource: "url", // "url" o "file"
  servings: "",
};

/**
 * Componente RecipeForm
 * Formulario optimizado para crear o editar recetas.
 * Se muestra dentro de un componente Modal con características avanzadas.
 *
 * Características:
 * - Gestión optimizada de estado con useCallback
 * - Campos dinámicos para ingredientes e instrucciones
 * - Validación en tiempo real
 * - Memoización para evitar re-renders innecesarios
 * - Responsive design con grid adaptativo
 *
 * @param {Object} props - Propiedades del componente
 * @param {boolean} props.isOpen - Si el formulario está abierto
 * @param {Function} props.onClose - Función para cerrar el formulario
 * @param {Function} props.onSave - Función para guardar la receta
 * @param {Object} [props.initialRecipe] - Receta inicial para modo edición
 * @returns {JSX.Element} Componente de formulario de receta
 */
const RecipeForm = ({ isOpen, onClose, onSave, initialRecipe }) => {
  // Estados del formulario optimizados
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  // Destructuración del estado para facilitar acceso
  const {
    name,
    ingredients,
    instructions,
    prepTime,
    category,
    imageUrl,
    // imageFile, // Comentado porque no se usa actualmente
    imagePreview,
    imageSource,
    servings,
  } = formData;
  // Efecto para inicializar/resetear formulario optimizado
  useEffect(() => {
    if (isOpen) {
      if (initialRecipe) {
        // Modo edición: cargar datos existentes
        const hasImageUrl =
          initialRecipe.imageUrl && !initialRecipe.imageUrl.startsWith("data:");
        setFormData({
          name: initialRecipe.name || "",
          ingredients:
            initialRecipe.ingredients?.length > 0
              ? initialRecipe.ingredients.map(i => ({ text: i }))
              : [{ text: "" }],
          instructions:
            initialRecipe.instructions?.length > 0
              ? initialRecipe.instructions.map(i => ({ text: i }))
              : [{ text: "" }],
          prepTime: initialRecipe.prepTime || "",
          category: initialRecipe.category || CATEGORIES[0],
          imageUrl: hasImageUrl ? initialRecipe.imageUrl : "",
          imageFile: null,
          imagePreview:
            !hasImageUrl && initialRecipe.imageUrl
              ? initialRecipe.imageUrl
              : "",
          imageSource: hasImageUrl
            ? "url"
            : initialRecipe.imageUrl
              ? "file"
              : "url",
          servings: initialRecipe.servings?.toString() || "",
        });
      } else {
        // Modo creación: usar estado inicial
        setFormData(INITIAL_FORM_STATE);
      }
    }
  }, [initialRecipe, isOpen]);

  // Función genérica optimizada para actualizar campos simples
  const updateField = useCallback(
    (field, value) => {
      setFormData(prev => ({ ...prev, [field]: value }));
    },
    [setFormData]
  );

  // Función genérica optimizada para manejar arrays dinámicos
  const handleArrayField = useCallback(
    (field, action, index = null, value = null) => {
      setFormData(prev => {
        const currentArray = prev[field];
        let newArray;

        switch (action) {
          case "add":
            newArray = [...currentArray, { text: "" }];
            break;
          case "remove":
            newArray = currentArray.filter((_, i) => i !== index);
            // Mantener al menos un campo vacío
            if (newArray.length === 0) {
              newArray = [{ text: "" }];
            }
            break;
          case "update":
            newArray = currentArray.map((field, i) =>
              i === index ? { text: value } : field
            );
            break;
          default:
            return prev;
        }

        return { ...prev, [field]: newArray };
      });
    },
    [setFormData]
  );

  // Manejadores específicos memoizados
  const handleNameChange = useCallback(
    e => {
      updateField("name", e.target.value);
    },
    [updateField]
  );

  const handlePrepTimeChange = useCallback(
    e => {
      updateField("prepTime", e.target.value);
    },
    [updateField]
  );

  const handleServingsChange = useCallback(
    e => {
      updateField("servings", e.target.value);
    },
    [updateField]
  );

  const handleCategoryChange = useCallback(
    e => {
      updateField("category", e.target.value);
    },
    [updateField]
  );
  const handleImageUrlChange = useCallback(
    e => {
      updateField("imageUrl", e.target.value);
      // Limpiar preview si se está usando URL
      if (imageSource === "url") {
        updateField("imagePreview", "");
        updateField("imageFile", null);
      }
    },
    [updateField, imageSource]
  );

  // Manejador para cambio de fuente de imagen
  const handleImageSourceChange = useCallback(
    source => {
      updateField("imageSource", source);
      // Limpiar campos según la fuente
      if (source === "url") {
        updateField("imageFile", null);
        updateField("imagePreview", "");
      } else {
        updateField("imageUrl", "");
      }
    },
    [updateField]
  );

  // Manejador para selección de archivo de imagen
  const handleImageFileChange = useCallback(
    e => {
      const file = e.target.files[0];
      if (file) {
        // Validar tipo de archivo
        if (!file.type.startsWith("image/")) {
          alert("Por favor selecciona un archivo de imagen válido");
          return;
        }

        // Validar tamaño (máximo 5MB)
        if (file.size > 5 * 1024 * 1024) {
          alert(
            "La imagen es muy grande. Por favor selecciona una imagen menor a 5MB"
          );
          return;
        }

        // Crear preview de la imagen
        const reader = new FileReader();
        reader.onload = e => {
          const base64 = e.target.result;
          updateField("imageFile", file);
          updateField("imagePreview", base64);
          updateField("imageUrl", base64); // Usar base64 como URL para compatibilidad
        };
        reader.readAsDataURL(file);
      }
    },
    [updateField]
  );

  // Manejador para eliminar imagen
  const handleRemoveImage = useCallback(() => {
    updateField("imageFile", null);
    updateField("imagePreview", "");
    updateField("imageUrl", "");
  }, [updateField]);

  // Manejador optimizado para envío del formulario
  const handleSubmit = useCallback(
    e => {
      e.preventDefault();

      // Procesar y limpiar datos antes de enviar
      const cleanedData = {
        name: name.trim(),
        ingredients: ingredients
          .map(i => i.text.trim())
          .filter(i => i.length > 0),
        instructions: instructions
          .map(i => i.text.trim())
          .filter(i => i.length > 0),
        prepTime: prepTime.trim(),
        category,
        imageUrl: imageUrl.trim(),
        servings: servings ? parseInt(servings, 10) : null,
      };

      // Validación básica
      if (!cleanedData.name) {
        alert("El nombre de la receta es obligatorio");
        return;
      }

      if (cleanedData.ingredients.length === 0) {
        alert("Debe agregar al menos un ingrediente");
        return;
      }

      if (cleanedData.instructions.length === 0) {
        alert("Debe agregar al menos una instrucción");
        return;
      }

      onSave(cleanedData);
    },
    [
      name,
      ingredients,
      instructions,
      prepTime,
      category,
      imageUrl,
      servings,
      onSave,
    ]
  );

  // Componente memoizado para campos dinámicos
  const DynamicFieldArray = useMemo(
    () =>
      ({ label, fieldName, placeholder, fields }) => (
        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1.5">
            {label}
          </label>
          {fields.map((field, index) => (
            <div
              key={`${fieldName}-${index}`}
              className="flex items-center mb-2 gap-2"
            >
              {" "}
              <input
                type="text"
                placeholder={`${placeholder} ${index + 1}`}
                value={field.text}
                onChange={e =>
                  handleArrayField(fieldName, "update", index, e.target.value)
                }
                className="flex-1 p-2.5 rounded-lg border-2 border-slate-200 dark:border-slate-500/30 bg-white dark:bg-gradient-to-br dark:from-slate-800/50 dark:to-slate-700/30 dark:text-slate-100 shadow-sm placeholder-slate-400 dark:placeholder-slate-400 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 dark:focus:border-emerald-400 dark:focus:ring-emerald-400/50 transition-all duration-200 backdrop-blur-sm"
              />
              {fields.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleArrayField(fieldName, "remove", index)}
                  className="p-2 text-red-500 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-800 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  aria-label={`Eliminar ${placeholder.toLowerCase()}`}
                >
                  <Trash2 size={18} />
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => handleArrayField(fieldName, "add")}
            className="mt-1 text-sm text-emerald-600 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300 flex items-center font-medium transition-colors"
          >
            <PlusCircle size={16} className="mr-1" />
            Añadir {placeholder.toLowerCase()}
          </button>
        </div>
      ),
    [handleArrayField]
  );

  // Título del modal memoizado
  const modalTitle = useMemo(
    () => (initialRecipe ? "✏️ Editar Receta" : "✨ Crear Nueva Receta"),
    [initialRecipe]
  );
  // Texto del botón de submit memoizado
  const submitButtonText = useMemo(
    () => (initialRecipe ? "Guardar Cambios" : "Guardar Receta"),
    [initialRecipe]
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={modalTitle}>
      <form
        onSubmit={handleSubmit}
        className="space-y-4 text-slate-800 dark:text-slate-200 text-sm sm:text-base"
        noValidate
      >
        {/* Campo: Nombre de la Receta */}
        <div>
          <label
            htmlFor="recipe-name"
            className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1"
          >
            Nombre de la Receta *
          </label>{" "}
          <input
            type="text"
            id="recipe-name"
            value={name}
            onChange={handleNameChange}
            required
            className="w-full p-2.5 rounded-lg border-2 border-slate-200 dark:border-slate-500/30 bg-white dark:bg-gradient-to-br dark:from-slate-800/50 dark:to-slate-700/30 dark:text-slate-100 shadow-sm placeholder-slate-400 dark:placeholder-slate-400 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 dark:focus:border-emerald-400 dark:focus:ring-emerald-400/50 transition-all duration-200 backdrop-blur-sm"
            placeholder="Ej: Pasta a la carbonara"
          />
        </div>
        {/* Campos dinámicos: Ingredientes */}
        <DynamicFieldArray
          label="Ingredientes 🥕 *"
          fieldName="ingredients"
          placeholder="Ingrediente"
          fields={ingredients}
        />
        {/* Campos dinámicos: Instrucciones */}
        <DynamicFieldArray
          label="Instrucciones 📝 *"
          fieldName="instructions"
          placeholder="Paso"
          fields={instructions}
        />
        {/* Campos: Tiempo de Preparación y Porciones */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="prep-time"
              className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1"
            >
              ⏱️ Tiempo de Preparación
            </label>{" "}
            <input
              type="text"
              id="prep-time"
              value={prepTime}
              onChange={handlePrepTimeChange}
              placeholder="Ej: 30 minutos"
              className="w-full p-2.5 rounded-lg border-2 border-slate-200 dark:border-slate-500/30 bg-white dark:bg-gradient-to-br dark:from-slate-800/50 dark:to-slate-700/30 dark:text-slate-100 shadow-sm placeholder-slate-400 dark:placeholder-slate-400 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 dark:focus:border-blue-400 dark:focus:ring-blue-400/50 transition-all duration-200 backdrop-blur-sm"
            />
          </div>
          <div>
            <label
              htmlFor="servings"
              className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1"
            >
              🍽️ Porciones
            </label>{" "}
            <input
              type="number"
              id="servings"
              value={servings}
              min="1"
              max="50"
              onChange={handleServingsChange}
              placeholder="4"
              className="w-full p-2.5 rounded-lg border-2 border-slate-200 dark:border-slate-500/30 bg-white dark:bg-gradient-to-br dark:from-slate-800/50 dark:to-slate-700/30 dark:text-slate-100 shadow-sm placeholder-slate-400 dark:placeholder-slate-400 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 dark:focus:border-blue-400 dark:focus:ring-blue-400/50 transition-all duration-200 backdrop-blur-sm"
            />
          </div>
        </div>
        {/* Campo: Categoría */}
        <div>
          <label
            htmlFor="category"
            className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1"
          >
            🏷️ Categoría
          </label>{" "}
          <select
            id="category"
            value={category}
            onChange={handleCategoryChange}
            className="w-full p-2.5 rounded-lg border-2 border-slate-200 dark:border-slate-500/30 bg-white dark:bg-gradient-to-br dark:from-slate-800/50 dark:to-slate-700/30 dark:text-slate-100 shadow-sm focus:ring-2 focus:ring-purple-400 focus:border-purple-400 dark:focus:border-purple-400 dark:focus:ring-purple-400/50 transition-all duration-200 backdrop-blur-sm"
          >
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>{" "}
        {/* Campo: Imagen de la Receta */}
        <div className="space-y-4">
          <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-3">
            🖼️ Imagen de la Receta (Opcional)
          </label>

          {/* Selector de tipo de imagen */}
          <div className="flex gap-2 mb-4">
            <button
              type="button"
              onClick={() => handleImageSourceChange("url")}
              className={`flex-1 p-3 rounded-lg border-2 transition-all duration-200 ${
                imageSource === "url"
                  ? "border-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300"
                  : "border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:border-indigo-300"
              }`}
            >
              <div className="text-center">
                <div className="text-lg mb-1">🔗</div>
                <div className="text-sm font-medium">URL</div>
              </div>
            </button>
            <button
              type="button"
              onClick={() => handleImageSourceChange("file")}
              className={`flex-1 p-3 rounded-lg border-2 transition-all duration-200 ${
                imageSource === "file"
                  ? "border-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300"
                  : "border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:border-indigo-300"
              }`}
            >
              <div className="text-center">
                <Upload size={20} className="mx-auto mb-1" />
                <div className="text-sm font-medium">Subir</div>
              </div>
            </button>
          </div>

          {/* Campo URL */}
          {imageSource === "url" && (
            <input
              type="url"
              id="image-url"
              placeholder="https://ejemplo.com/imagen.jpg"
              value={imageUrl}
              onChange={handleImageUrlChange}
              className="w-full p-2.5 rounded-lg border-2 border-slate-200 dark:border-slate-500/30 bg-white dark:bg-gradient-to-br dark:from-slate-800/50 dark:to-slate-700/30 dark:text-slate-100 shadow-sm placeholder-slate-400 dark:placeholder-slate-400 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 dark:focus:border-indigo-400 dark:focus:ring-indigo-400/50 transition-all duration-200 backdrop-blur-sm"
            />
          )}

          {/* Campo de archivo */}
          {imageSource === "file" && (
            <div className="space-y-3">
              <div className="flex gap-2">
                <label className="flex-1 cursor-pointer">
                  <div className="flex items-center justify-center p-4 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg hover:border-indigo-400 transition-colors bg-slate-50 dark:bg-slate-700/50">
                    <div className="text-center">
                      <Upload
                        size={24}
                        className="mx-auto mb-2 text-slate-400"
                      />
                      <div className="text-sm font-medium text-slate-600 dark:text-slate-300">
                        Seleccionar imagen
                      </div>
                      <div className="text-xs text-slate-400 mt-1">
                        JPG, PNG, GIF hasta 5MB
                      </div>
                    </div>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileChange}
                    className="hidden"
                  />
                </label>
                <label className="cursor-pointer">
                  <div className="flex items-center justify-center p-4 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg hover:border-indigo-400 transition-colors bg-slate-50 dark:bg-slate-700/50 w-20">
                    <div className="text-center">
                      <Camera size={20} className="mx-auto text-slate-400" />
                      <div className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                        Cámara
                      </div>
                    </div>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleImageFileChange}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          )}

          {/* Preview de la imagen */}
          {(imagePreview || (imageSource === "url" && imageUrl)) && (
            <div className="relative">
              <div className="w-full h-32 bg-slate-100 dark:bg-slate-700 rounded-lg overflow-hidden flex items-center justify-center">
                <img
                  src={imagePreview || imageUrl}
                  alt="Preview"
                  className="max-w-full max-h-full object-contain"
                  onError={e => {
                    e.target.style.display = "none";
                  }}
                />
              </div>
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                title="Eliminar imagen"
              >
                <X size={14} />
              </button>
            </div>
          )}
        </div>
        {/* Botones de acción del formulario */}
        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-slate-200 dark:border-slate-600">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-medium rounded-lg shadow-sm bg-slate-200 hover:bg-slate-300 dark:bg-slate-600 dark:text-slate-200 dark:hover:bg-slate-500 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-5 py-2.5 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-md flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
          >
            <PlusCircle size={20} className="mr-2" />
            {submitButtonText}
          </button>
        </div>
      </form>
    </Modal>
  );
};

// Memoización con comparación personalizada para optimizar renders
export default React.memo(RecipeForm, (prevProps, nextProps) => {
  return (
    prevProps.isOpen === nextProps.isOpen &&
    prevProps.initialRecipe === nextProps.initialRecipe
  );
});
