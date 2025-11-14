"""
Script para ejecutar el SQL de friend_code en Supabase
Ejecutar con: python setup_friend_code.py
"""

import os
from supabase import create_client, Client

# Leer credenciales del archivo .env
def load_env():
    env_vars = {}
    try:
        with open('.env', 'r') as f:
            for line in f:
                if '=' in line and not line.startswith('#'):
                    key, value = line.strip().split('=', 1)
                    env_vars[key] = value
    except FileNotFoundError:
        print("❌ Archivo .env no encontrado")
        return None, None
    
    url = env_vars.get('EXPO_PUBLIC_SUPABASE_URL', '').strip()
    key = env_vars.get('EXPO_PUBLIC_SUPABASE_ANON_KEY', '').strip()
    
    return url, key

# SQL a ejecutar
SQL_SCRIPT = """
-- 1. Agregar columna friend_code
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS friend_code TEXT UNIQUE;

-- 2. Crear índice
CREATE INDEX IF NOT EXISTS idx_profiles_friend_code 
ON public.profiles(friend_code);

-- 3. Función para generar código
CREATE OR REPLACE FUNCTION generate_friend_code()
RETURNS TEXT AS $$
DECLARE
  chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  result TEXT := '';
  i INTEGER;
BEGIN
  FOR i IN 1..6 LOOP
    result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
  END LOOP;
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- 4. Asignar códigos a usuarios existentes sin código
UPDATE public.profiles 
SET friend_code = generate_friend_code()
WHERE friend_code IS NULL;
"""

def main():
    print("🚀 Configurando sistema de códigos de amigo...")
    print()
    
    # Cargar credenciales
    url, key = load_env()
    
    if not url or not key:
        print("❌ No se pudieron cargar las credenciales de Supabase")
        print("   Verifica que el archivo .env tenga:")
        print("   - EXPO_PUBLIC_SUPABASE_URL")
        print("   - EXPO_PUBLIC_SUPABASE_ANON_KEY")
        return
    
    print("✅ Credenciales cargadas")
    print(f"   URL: {url[:30]}...")
    print()
    
    try:
        # Conectar a Supabase
        supabase: Client = create_client(url, key)
        print("✅ Conectado a Supabase")
        print()
        
        # Ejecutar SQL (esto no funcionará con la anon key por seguridad)
        print("⚠️  IMPORTANTE:")
        print("   No se puede ejecutar DDL (ALTER TABLE, CREATE FUNCTION)")
        print("   desde el cliente por razones de seguridad.")
        print()
        print("📋 DEBES EJECUTAR MANUALMENTE EN SUPABASE DASHBOARD:")
        print()
        print("   1. Ve a: https://supabase.com/dashboard")
        print("   2. Selecciona tu proyecto")
        print("   3. Ve a 'SQL Editor'")
        print("   4. Copia y pega este SQL:")
        print()
        print("-" * 60)
        print(SQL_SCRIPT)
        print("-" * 60)
        print()
        print("   5. Presiona 'Run' o Ctrl+Enter")
        print()
        print("💡 Alternativamente, puedes copiar el archivo:")
        print("   database/ADD_FRIEND_CODE.sql")
        print()
        
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    main()
