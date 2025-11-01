-- ==========================================
-- HABILITAR REALTIME EN SUPABASE
-- ==========================================
-- Este SQL habilita las actualizaciones en tiempo real
-- para las tablas de meals y transport

-- Habilitar realtime para la tabla meals
ALTER PUBLICATION supabase_realtime ADD TABLE public.meals;

-- Habilitar realtime para la tabla transport
ALTER PUBLICATION supabase_realtime ADD TABLE public.transport;

-- Verificar que está habilitado
-- (Opcional: ejecuta esta query para confirmar)
SELECT schemaname, tablename 
FROM pg_publication_tables 
WHERE pubname = 'supabase_realtime';

-- Deberías ver:
-- public | meals
-- public | transport
