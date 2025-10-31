# 🗄️ Configuración de Base de Datos - EcoTracker

## Paso 1: Crear el Proyecto en Supabase

1. Ve a [https://supabase.com](https://supabase.com)
2. Inicia sesión o crea una cuenta
3. Haz clic en "New Project"
4. Configura el proyecto:
   - **Name**: EcoTracker
   - **Database Password**: (Elige una contraseña segura)
   - **Region**: Elige la más cercana a ti
   - **Pricing Plan**: Free (suficiente para desarrollo)
5. Espera 2-3 minutos mientras se crea el proyecto

## Paso 2: Obtener las Credenciales

1. Una vez creado, ve a **Settings** > **API**
2. Copia estos valores:
   - **Project URL**: `https://xxxxxxxxxxxxx.supabase.co`
   - **anon/public key**: `eyJhbGciOiJIUzI1NiIsInR5cC...`
3. Pega estos valores en tu archivo `.env` (ya está configurado)

## Paso 3: Ejecutar el Schema SQL

1. En Supabase, ve a **SQL Editor**
2. Crea una nueva query
3. Copia y pega TODO el contenido del archivo `database/supabase-schema.sql`
4. Haz clic en **Run** (o presiona Ctrl+Enter)
5. Verifica que todo se ejecute sin errores

## Paso 4: Verificar las Tablas

Ve a **Table Editor** y verifica que se crearon:
- ✅ `profiles` - Perfiles de usuario
- ✅ `meals` - Registro de comidas
- ✅ `transport` - Registro de transporte

## Paso 5: Verificar RLS (Row Level Security)

1. Ve a **Authentication** > **Policies**
2. Verifica que cada tabla tenga políticas activas:
   - `profiles`: SELECT, INSERT, UPDATE
   - `meals`: SELECT, INSERT, UPDATE, DELETE
   - `transport`: SELECT, INSERT, UPDATE, DELETE

## Paso 6: Probar la Aplicación

1. Reinicia Expo: `npm start`
2. Registra un nuevo usuario
3. Intenta registrar una comida
4. Intenta registrar un viaje
5. Ve al Dashboard para ver tus estadísticas

## Estructura de la Base de Datos

### Tabla: profiles
```sql
id          UUID         - ID del usuario (referencia a auth.users)
name        TEXT         - Nombre del usuario
created_at  TIMESTAMP    - Fecha de creación
updated_at  TIMESTAMP    - Fecha de actualización
```

### Tabla: meals
```sql
id          UUID         - ID único de la comida
user_id     UUID         - ID del usuario
name        TEXT         - Nombre de la comida
type        TEXT         - Tipo: vegano, vegetariano, carne_roja, carne_blanca, pescado
grams       DECIMAL      - Cantidad en gramos
co2         DECIMAL      - Emisiones de CO2 en kg
created_at  TIMESTAMP    - Fecha de registro
```

### Tabla: transport
```sql
id          UUID         - ID único del viaje
user_id     UUID         - ID del usuario
type        TEXT         - Tipo: coche, moto, autobus, metro, bicicleta, caminando
distance    DECIMAL      - Distancia en km
co2         DECIMAL      - Emisiones de CO2 en kg
created_at  TIMESTAMP    - Fecha de registro
```

## Vistas Útiles

### daily_stats
Estadísticas agrupadas por día:
- total_co2
- meals_co2
- transport_co2
- meals_count
- transport_count

### weekly_stats
Estadísticas agrupadas por semana.

## Solución de Problemas

### Error: "No hay credenciales"
- Verifica que el archivo `.env` tenga las variables correctas
- Reinicia Expo con: `npm start`

### Error: "Row Level Security"
- Verifica que las políticas RLS estén activadas
- Verifica que ejecutaste todo el schema SQL

### Error: "Invalid JWT"
- Cierra sesión y vuelve a iniciar
- Verifica que las credenciales en `.env` sean correctas

### Los datos no se guardan
- Verifica que las tablas existan
- Ve a Supabase > Table Editor y verifica manualmente
- Revisa la consola de Expo para ver errores

## Comandos Útiles

```bash
# Reiniciar Expo limpiando cache
npx expo start -c

# Ver logs de Expo
npx expo start

# Verificar conexión con Supabase
npm run check-supabase
```

## Características de Seguridad

✅ **Row Level Security (RLS)**: Cada usuario solo ve sus propios datos
✅ **Autenticación JWT**: Tokens seguros para cada sesión
✅ **Políticas automáticas**: Las políticas se aplican automáticamente
✅ **Validaciones**: Los CHECK constraints validan los datos

## Próximos Pasos

1. ✅ Base de datos configurada
2. ✅ Autenticación funcionando
3. ✅ CRUD de comidas y transporte
4. ✅ Dashboard con estadísticas
5. 🔄 Añadir más funcionalidades (opcional)

¡Tu base de datos está lista! 🎉
