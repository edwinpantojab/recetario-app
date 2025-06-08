// Configuración de Supabase
export const SUPABASE_CONFIG = {
  url: process.env.REACT_APP_SUPABASE_URL,
  anonKey: process.env.REACT_APP_SUPABASE_ANON_KEY,
};

// Estructura de tabla para recetas en Supabase
/*
CREATE TABLE recipes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT,
  prep_time TEXT,
  servings INTEGER,
  ingredients TEXT[],
  instructions TEXT[],
  image_url TEXT,
  user_id TEXT DEFAULT 'anonymous',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS (Row Level Security)
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;

-- Política para permitir lectura a todos
CREATE POLICY "Recipes are viewable by everyone" ON recipes
  FOR SELECT USING (true);

-- Política para permitir inserción a todos (puedes restringir después)
CREATE POLICY "Anyone can insert recipes" ON recipes
  FOR INSERT WITH CHECK (true);

-- Política para permitir actualización a todos
CREATE POLICY "Anyone can update recipes" ON recipes
  FOR UPDATE USING (true);

-- Política para permitir eliminación a todos
CREATE POLICY "Anyone can delete recipes" ON recipes
  FOR DELETE USING (true);
*/
