import { useState, useEffect } from "react";
import { supabase } from "../config/supabase";

/**
 * Hook para manejar recetas en tiempo real con Supabase
 */
export const useRealtimeRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar recetas iniciales
  useEffect(() => {
    fetchRecipes();
  }, []);

  // Suscribirse a cambios en tiempo real
  useEffect(() => {
    const subscription = supabase
      .channel("recipes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "recipes" },
        payload => {
          // console.log('Cambio detectado:', payload);

          if (payload.eventType === "INSERT") {
            setRecipes(prev => [...prev, payload.new]);
          } else if (payload.eventType === "UPDATE") {
            setRecipes(prev =>
              prev.map(recipe =>
                recipe.id === payload.new.id ? payload.new : recipe
              )
            );
          } else if (payload.eventType === "DELETE") {
            setRecipes(prev =>
              prev.filter(recipe => recipe.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchRecipes = async () => {
    try {
      const { data, error } = await supabase
        .from("recipes")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setRecipes(data || []);
    } catch (error) {
      // console.error('Error fetching recipes:', error);
    } finally {
      setLoading(false);
    }
  };
  const addRecipe = async recipe => {
    const { data, error } = await supabase
      .from("recipes")
      .insert([
        {
          ...recipe,
          id: crypto.randomUUID(),
          created_at: new Date().toISOString(),
          user_id: "anonymous", // Puedes implementar autenticación después
        },
      ])
      .select();
    if (error) throw error;
    return data[0];
  };
  const updateRecipe = async (id, updates) => {
    const { data, error } = await supabase
      .from("recipes")
      .update(updates)
      .eq("id", id)
      .select();
    if (error) throw error;
    return data[0];
  };
  const deleteRecipe = async id => {
    const { error } = await supabase.from("recipes").delete().eq("id", id);
    if (error) throw error;
  };

  return {
    recipes,
    loading,
    addRecipe,
    updateRecipe,
    deleteRecipe,
    refreshRecipes: fetchRecipes,
  };
};
