-- ==========================================
-- SCHEMA DE BASE DE DATOS PARA SUPABASE
-- EcoTracker - Carbon Footprint Tracker
-- ==========================================

-- Habilitar extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- TABLA: users (extendida de auth.users)
-- ==========================================
-- Nota: Supabase ya proporciona auth.users
-- Creamos una tabla de perfil adicional si necesitamos más campos
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- ==========================================
-- TABLA: meals
-- ==========================================
CREATE TABLE IF NOT EXISTS public.meals (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('vegetariano', 'vegano', 'carne_roja', 'carne_blanca', 'pescado')),
  grams DECIMAL(10, 2) NOT NULL CHECK (grams > 0),
  co2 DECIMAL(10, 2) NOT NULL CHECK (co2 >= 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Índices para mejor rendimiento
CREATE INDEX IF NOT EXISTS idx_meals_user_id ON public.meals(user_id);
CREATE INDEX IF NOT EXISTS idx_meals_created_at ON public.meals(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_meals_user_date ON public.meals(user_id, created_at DESC);

-- ==========================================
-- TABLA: transport
-- ==========================================
CREATE TABLE IF NOT EXISTS public.transport (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('coche', 'moto', 'autobus', 'metro', 'bicicleta', 'caminando')),
  distance DECIMAL(10, 2) NOT NULL CHECK (distance > 0),
  co2 DECIMAL(10, 2) NOT NULL CHECK (co2 >= 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Índices para mejor rendimiento
CREATE INDEX IF NOT EXISTS idx_transport_user_id ON public.transport(user_id);
CREATE INDEX IF NOT EXISTS idx_transport_created_at ON public.transport(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_transport_user_date ON public.transport(user_id, created_at DESC);

-- ==========================================
-- ROW LEVEL SECURITY (RLS)
-- ==========================================

-- Habilitar RLS en todas las tablas
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transport ENABLE ROW LEVEL SECURITY;

-- Políticas para profiles
CREATE POLICY "Users can view their own profile" 
  ON public.profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
  ON public.profiles FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- Políticas para meals
CREATE POLICY "Users can view their own meals" 
  ON public.meals FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own meals" 
  ON public.meals FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own meals" 
  ON public.meals FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own meals" 
  ON public.meals FOR DELETE 
  USING (auth.uid() = user_id);

-- Políticas para transport
CREATE POLICY "Users can view their own transport" 
  ON public.transport FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own transport" 
  ON public.transport FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own transport" 
  ON public.transport FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own transport" 
  ON public.transport FOR DELETE 
  USING (auth.uid() = user_id);

-- ==========================================
-- FUNCIONES Y TRIGGERS
-- ==========================================

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para profiles
CREATE TRIGGER on_profiles_updated
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Función para crear perfil automáticamente al registrarse
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para crear perfil automáticamente
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ==========================================
-- VISTAS ÚTILES
-- ==========================================

-- Vista para estadísticas diarias del usuario
CREATE OR REPLACE VIEW public.daily_stats AS
SELECT 
  user_id,
  DATE(created_at) as date,
  SUM(CASE WHEN source = 'meals' THEN co2 ELSE 0 END) as meals_co2,
  SUM(CASE WHEN source = 'transport' THEN co2 ELSE 0 END) as transport_co2,
  SUM(co2) as total_co2,
  COUNT(CASE WHEN source = 'meals' THEN 1 END) as meals_count,
  COUNT(CASE WHEN source = 'transport' THEN 1 END) as transport_count
FROM (
  SELECT user_id, created_at, co2, 'meals' as source FROM public.meals
  UNION ALL
  SELECT user_id, created_at, co2, 'transport' as source FROM public.transport
) combined
GROUP BY user_id, DATE(created_at);

-- Vista para estadísticas semanales del usuario
CREATE OR REPLACE VIEW public.weekly_stats AS
SELECT 
  user_id,
  DATE_TRUNC('week', created_at) as week_start,
  SUM(CASE WHEN source = 'meals' THEN co2 ELSE 0 END) as meals_co2,
  SUM(CASE WHEN source = 'transport' THEN co2 ELSE 0 END) as transport_co2,
  SUM(co2) as total_co2,
  COUNT(CASE WHEN source = 'meals' THEN 1 END) as meals_count,
  COUNT(CASE WHEN source = 'transport' THEN 1 END) as transport_count
FROM (
  SELECT user_id, created_at, co2, 'meals' as source FROM public.meals
  UNION ALL
  SELECT user_id, created_at, co2, 'transport' as source FROM public.transport
) combined
GROUP BY user_id, DATE_TRUNC('week', created_at);

-- ==========================================
-- DATOS DE EJEMPLO (OPCIONAL)
-- ==========================================
-- Descomentar para insertar datos de prueba después de crear un usuario

-- INSERT INTO public.meals (user_id, name, type, grams, co2) VALUES
-- ('tu-user-id-aqui', 'Ensalada mixta', 'vegetariano', 250, 0.33),
-- ('tu-user-id-aqui', 'Pollo a la plancha', 'carne_blanca', 200, 1.2),
-- ('tu-user-id-aqui', 'Hamburguesa', 'carne_roja', 300, 4.5);

-- INSERT INTO public.transport (user_id, type, distance, co2) VALUES
-- ('tu-user-id-aqui', 'metro', 10, 0.5),
-- ('tu-user-id-aqui', 'coche', 25, 4.75),
-- ('tu-user-id-aqui', 'bicicleta', 5, 0);

-- ==========================================
-- COMENTARIOS EN TABLAS Y COLUMNAS
-- ==========================================

COMMENT ON TABLE public.profiles IS 'Perfil extendido de usuario';
COMMENT ON TABLE public.meals IS 'Registro de comidas del usuario';
COMMENT ON TABLE public.transport IS 'Registro de transporte del usuario';

COMMENT ON COLUMN public.meals.type IS 'Tipo de comida: vegetariano, vegano, carne_roja, carne_blanca, pescado';
COMMENT ON COLUMN public.meals.grams IS 'Peso de la comida en gramos';
COMMENT ON COLUMN public.meals.co2 IS 'Emisiones de CO2 en kg';

COMMENT ON COLUMN public.transport.type IS 'Tipo de transporte: coche, moto, autobus, metro, bicicleta, caminando';
COMMENT ON COLUMN public.transport.distance IS 'Distancia recorrida en kilómetros';
COMMENT ON COLUMN public.transport.co2 IS 'Emisiones de CO2 en kg';
