import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Globe, PlusCircle, Trash2, LinkIcon } from "lucide-react";
import CustomConfirmModal from "./ui/CustomConfirmModal"; // Corregido: Se movió a la subcarpeta ui
import { saveData, loadData } from "../data/localStorageHelpers";

/**
 * Enlaces de recetas online por defecto
 * Constante inmutable para evitar recreación en cada render
 */
const DEFAULT_ONLINE_RECIPE_LINKS = [
  {
    id: "link-1",
    name: "Directo al Paladar",
    url: "https://www.directoalpaladar.com/recetas",
    icon: "🍲",
  },
  {
    id: "link-2",
    name: "Recetas de Cocina (El País)",
    url: "https://elpais.com/elpais/recetas/",
    icon: "📰",
  },
  {
    id: "link-3",
    name: "Gastronomía & Cía",
    url: "https://www.gastronomiaycia.com/recetas/",
    icon: "🧑‍🍳",
  },
  {
    id: "link-4",
    name: "Bon Viveur",
    url: "https://www.bonviveur.es/recetas",
    icon: "🍷",
  },
  {
    id: "link-5",
    name: "Divina Cocina",
    url: "https://www.divinacocina.es/recetas/",
    icon: "🌟",
  },
  {
    id: "link-6",
    name: "Recetas Gratis",
    url: "https://www.recetasgratis.net/",
    icon: "🆓",
  },
];

// Clave para localStorage
const LOCAL_STORAGE_ONLINE_LINKS_KEY = "onlineRecipeLinks";

/**
 * OnlineRecipesViewer
 * Componente optimizado para gestionar enlaces a sitios web de recetas online.
 * Permite ver, añadir y eliminar enlaces con persistencia en localStorage.
 *
 * Características:
 * - Carga inicial optimizada desde localStorage
 * - Formulario para añadir nuevos enlaces
 * - Eliminación con confirmación modal
 * - Diseño responsive con grid adaptativo
 * - Memoización para evitar re-renders innecesarios
 *
 * @param {Object} props - Propiedades del componente
 * @param {Function} [props.showToast] - Función para mostrar notificaciones
 * @returns {JSX.Element} Componente de visor de recetas online
 */
const OnlineRecipesViewer = ({ showToast }) => {
  // Estados principales del componente
  const [userLinks, setUserLinks] = useState([]);
  const [isLoadingLinks, setIsLoadingLinks] = useState(true);
  const [isAddingLink, setIsAddingLink] = useState(false);
  const [newLinkName, setNewLinkName] = useState("");
  const [newLinkUrl, setNewLinkUrl] = useState("");
  const [isConfirmDeleteLinkModalOpen, setIsConfirmDeleteLinkModalOpen] =
    useState(false);
  const [linkToDeleteId, setLinkToDeleteId] = useState(null); // Helpers optimizados para localStorage
  const getLocalOnlineLinks = useCallback(async () => {
    try {
      const savedLinks = await loadData(LOCAL_STORAGE_ONLINE_LINKS_KEY, []);

      // Validar que savedLinks sea un array
      if (!Array.isArray(savedLinks)) {
        return [...DEFAULT_ONLINE_RECIPE_LINKS];
      }

      // Asegurar que siempre incluya los enlaces predeterminados
      const defaultIds = DEFAULT_ONLINE_RECIPE_LINKS.map(link => link.id);

      // Combinar enlaces predeterminados con los enlaces personalizados del usuario
      return [
        ...DEFAULT_ONLINE_RECIPE_LINKS,
        ...savedLinks.filter(
          link => link && link.id && !defaultIds.includes(link.id)
        ),
      ];
    } catch (error) {
      // Si hay cualquier error, devolver solo los enlaces por defecto
      return [...DEFAULT_ONLINE_RECIPE_LINKS];
    }
  }, []);
  const setLocalOnlineLinks = useCallback(async links => {
    try {
      await saveData(LOCAL_STORAGE_ONLINE_LINKS_KEY, links);
    } catch (error) {
      // Manejar error silenciosamente
      // El toast se mostrará desde donde se llame esta función si es necesario
    }
  }, []);
  // Carga inicial de enlaces desde localStorage
  useEffect(() => {
    const loadLinks = async () => {
      setIsLoadingLinks(true);
      try {
        const links = await getLocalOnlineLinks();
        setUserLinks(links);
      } catch (error) {
        // En caso de error, usar solo enlaces por defecto sin mostrar toast
        setUserLinks([...DEFAULT_ONLINE_RECIPE_LINKS]);
      } finally {
        setIsLoadingLinks(false);
      }
    };

    loadLinks();
  }, [getLocalOnlineLinks]);
  // Manejador optimizado para añadir nuevo enlace
  const handleAddLink = useCallback(
    async e => {
      e.preventDefault();

      const trimmedName = newLinkName.trim();
      const trimmedUrl = newLinkUrl.trim();

      if (!trimmedName || !trimmedUrl) {
        showToast?.("Por favor completa todos los campos", "error");
        return;
      }

      // Validación de URL básica
      try {
        new URL(trimmedUrl);
      } catch {
        showToast?.("Por favor ingresa una URL válida", "error");
        return;
      }

      const newLink = {
        id: `link-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: trimmedName,
        url: trimmedUrl,
        icon: "🔗",
      };

      const updatedLinks = [...userLinks, newLink];

      try {
        await setLocalOnlineLinks(updatedLinks);
        setUserLinks(updatedLinks);

        // Resetear formulario
        setNewLinkName("");
        setNewLinkUrl("");
        setIsAddingLink(false);

        showToast?.("Enlace añadido exitosamente", "success");
      } catch (error) {
        showToast?.("Error al guardar el enlace", "error");
      }
    },
    [newLinkName, newLinkUrl, userLinks, setLocalOnlineLinks, showToast]
  );

  // Manejador para mostrar modal de confirmación de eliminación
  const confirmDeleteLink = useCallback(id => {
    setLinkToDeleteId(id);
    setIsConfirmDeleteLinkModalOpen(true);
  }, []);
  // Manejador optimizado para eliminar enlace
  const handleDeleteLink = useCallback(async () => {
    if (!linkToDeleteId) return;

    const updatedLinks = userLinks.filter(link => link.id !== linkToDeleteId);

    try {
      await setLocalOnlineLinks(updatedLinks);
      setUserLinks(updatedLinks);

      // Resetear estado del modal
      setIsConfirmDeleteLinkModalOpen(false);
      setLinkToDeleteId(null);

      showToast?.("Enlace eliminado exitosamente", "success");
    } catch (error) {
      showToast?.("Error al eliminar el enlace", "error");
    }
  }, [linkToDeleteId, userLinks, setLocalOnlineLinks, showToast]);

  // Manejador para cancelar eliminación
  const handleCancelDelete = useCallback(() => {
    setIsConfirmDeleteLinkModalOpen(false);
    setLinkToDeleteId(null);
  }, []);

  // Texto del botón de añadir memoizado
  const addButtonText = useMemo(
    () => (isAddingLink ? "Cancelar" : "Añadir Enlace"),
    [isAddingLink]
  );

  // Componente de carga optimizado
  const LoadingComponent = useMemo(
    () => (
      <div className="text-center p-10">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500 mx-auto mb-4"></div>
        <p className="text-slate-600 dark:text-slate-300">
          Cargando Enlaces...
        </p>
      </div>
    ),
    []
  );

  // Formulario de añadir enlace memoizado
  const AddLinkForm = useMemo(
    () =>
      isAddingLink && (
        <form
          onSubmit={handleAddLink}
          className="mb-6 p-6 bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-slate-700/50 dark:to-slate-600/50 rounded-xl border border-emerald-200 dark:border-slate-600 shadow-sm space-y-4"
        >
          <div className="space-y-1">
            <label className="block text-sm font-medium text-emerald-700 dark:text-emerald-300">
              Nombre del sitio
            </label>{" "}
            <input
              type="text"
              placeholder="Ej: Mi sitio de recetas favorito"
              value={newLinkName}
              onChange={e => setNewLinkName(e.target.value)}
              required
              className="w-full p-3 rounded-lg border-2 border-emerald-200 dark:border-emerald-400/30 bg-white dark:bg-gradient-to-br dark:from-slate-800/50 dark:to-slate-700/30 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-emerald-400 dark:focus:ring-emerald-400/50 focus:border-emerald-400 transition-all duration-200 shadow-sm backdrop-blur-sm"
              autoFocus
            />
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-emerald-700 dark:text-emerald-300">
              URL del sitio
            </label>{" "}
            <input
              type="url"
              placeholder="https://ejemplo.com"
              value={newLinkUrl}
              onChange={e => setNewLinkUrl(e.target.value)}
              required
              className="w-full p-3 rounded-lg border-2 border-emerald-200 dark:border-emerald-400/30 bg-white dark:bg-gradient-to-br dark:from-slate-800/50 dark:to-slate-700/30 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-emerald-400 dark:focus:ring-emerald-400/50 focus:border-emerald-400 transition-all duration-200 shadow-sm backdrop-blur-sm"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-all duration-200 font-medium shadow-sm"
            >
              ✅ Guardar Enlace
            </button>{" "}
            <button
              type="button"
              onClick={() => setIsAddingLink(false)}
              className="px-6 py-2.5 bg-white text-slate-700 border-2 border-emerald-200 rounded-lg hover:bg-emerald-50 hover:border-emerald-300 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-all duration-200 font-medium shadow-sm dark:bg-slate-600 dark:text-white dark:border-slate-500 dark:hover:bg-slate-500"
            >
              ❌ Cancelar
            </button>
          </div>
        </form>
      ),
    [isAddingLink, newLinkName, newLinkUrl, handleAddLink]
  );

  // Lista de enlaces memoizada
  const LinksList = useMemo(
    () =>
      userLinks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {userLinks.map(link => (
            <div
              key={link.id}
              className="flex items-center p-4 bg-gradient-to-r from-emerald-50 to-blue-50 dark:bg-gradient-to-br dark:from-slate-800/60 dark:to-slate-700/40 rounded-lg shadow-md border-2 border-emerald-200 dark:border-emerald-400/30 justify-between hover:shadow-lg hover:border-emerald-300 dark:hover:border-emerald-400/50 transition-all duration-200 backdrop-blur-sm"
            >
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center flex-grow hover:opacity-80 min-w-0 transition-opacity"
              >
                <LinkIcon
                  size={20}
                  className="mr-3 text-emerald-500 flex-shrink-0"
                  aria-hidden="true"
                />
                <div className="min-w-0">
                  <h3 className="text-md font-semibold truncate text-slate-900 dark:text-white">
                    {link.name}
                  </h3>
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 truncate">
                    {link.url}
                  </p>
                </div>
              </a>
              <button
                onClick={() => confirmDeleteLink(link.id)}
                className="p-1.5 text-red-500 rounded-full hover:bg-red-100 dark:hover:bg-red-800 ml-2 flex-shrink-0 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
                aria-label={`Eliminar enlace ${link.name}`}
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <Globe size={48} className="mx-auto text-slate-400 mb-4" />
          <p className="text-slate-500 dark:text-slate-400">
            No hay enlaces guardados. ¡Añade tu primer enlace de recetas!
          </p>
        </div>
      ),
    [userLinks, confirmDeleteLink]
  );

  // Renderizado condicional optimizado para carga
  if (isLoadingLinks) {
    return LoadingComponent;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-xl">
        {/* Encabezado optimizado */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
          <h2 className="text-3xl font-bold text-emerald-700 dark:text-emerald-400 flex items-center">
            <Globe size={32} className="mr-3" aria-hidden="true" />
            Recetas Online
          </h2>
          <button
            onClick={() => setIsAddingLink(!isAddingLink)}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 text-sm flex items-center justify-center transition-colors"
            aria-expanded={isAddingLink}
          >
            <PlusCircle size={18} className="mr-1.5" aria-hidden="true" />
            {addButtonText}
          </button>
        </div>

        {/* Formulario de añadir enlace */}
        {AddLinkForm}

        <p className="text-slate-600 dark:text-slate-300 mb-6 text-lg">
          Explora recetas de sitios populares:
        </p>

        {/* Lista de enlaces */}
        {LinksList}
      </div>

      {/* Modal de confirmación para eliminación */}
      <CustomConfirmModal
        isOpen={isConfirmDeleteLinkModalOpen}
        onClose={handleCancelDelete}
        onConfirm={handleDeleteLink}
        title="🗑️ Confirmar Eliminación"
        message="¿Estás seguro de que quieres eliminar este enlace? Esta acción no se puede deshacer."
        confirmButtonText="Eliminar"
        cancelButtonText="Cancelar"
        variant="danger"
      />
    </div>
  );
};

// Memoización con comparación personalizada para optimizar renders
export default React.memo(OnlineRecipesViewer, (prevProps, nextProps) => {
  return prevProps.showToast === nextProps.showToast;
});
