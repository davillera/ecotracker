# 🎯 Checklist de Integración Supabase

## ✅ Usa este checklist para verificar la integración

### Paso 1: Instalación y Archivos ✅ COMPLETADO

- [x] Dependencias instaladas
  - [x] `@supabase/supabase-js`
  - [x] `react-native-url-polyfill`
- [x] Servicios creados en `lib/`
  - [x] `supabase.ts` - Cliente
  - [x] `auth.ts` - Autenticación
  - [x] `meals.ts` - Comidas
  - [x] `transport.ts` - Transporte
  - [x] `dashboard.ts` - Dashboard
- [x] Schema SQL creado
  - [x] `database/supabase-schema.sql`
- [x] Documentación creada
  - [x] `SUPABASE_SETUP.md`
  - [x] `MIGRATION_GUIDE.md`
  - [x] `INTEGRACION_SUPABASE.md`
  - [x] `lib/examples.tsx`

### Paso 2: Configuración de Supabase ⏳ POR HACER

- [ ] Crear cuenta en [supabase.com](https://supabase.com)
- [ ] Crear nuevo proyecto
- [ ] Copiar credenciales (ver [CREDENCIALES_SUPABASE.md](./CREDENCIALES_SUPABASE.md)):
  - [ ] Project URL
  - [ ] Anon Key (anon/public)
- [ ] Editar archivo `.env` (ya está creado)
- [ ] Pegar credenciales en `.env`
- [ ] Verificar: `npm run check-supabase`

### Paso 3: Base de Datos ⏳ POR HACER

- [ ] Abrir SQL Editor en Supabase
- [ ] Copiar contenido de `database/supabase-schema.sql`
- [ ] Ejecutar el SQL
- [ ] Verificar tablas creadas:
  - [ ] `profiles`
  - [ ] `meals`
  - [ ] `transport`
- [ ] Verificar políticas RLS activas

### Paso 4: Migración de Código ⏳ POR HACER

#### AuthContext / Servicios de Auth
- [ ] Reemplazar con `lib/auth.ts`
- [ ] Importar: `import { signIn, signUp, signOut } from '@/lib/auth'`
- [ ] Actualizar Login Screen
- [ ] Actualizar Register Screen
- [ ] Actualizar protección de rutas

#### Pantalla de Comidas
- [ ] Reemplazar llamadas API con `lib/meals.ts`
- [ ] Importar: `import { createMeal, getMeals, deleteMeal } from '@/lib/meals'`
- [ ] Actualizar listado de comidas
- [ ] Actualizar creación de comidas
- [ ] Actualizar eliminación de comidas

#### Pantalla de Transporte
- [ ] Reemplazar llamadas API con `lib/transport.ts`
- [ ] Importar: `import { createTransport, getTransport } from '@/lib/transport'`
- [ ] Actualizar listado de viajes
- [ ] Actualizar creación de viajes
- [ ] Actualizar eliminación de viajes

#### Pantalla de Dashboard
- [ ] Reemplazar llamadas API con `lib/dashboard.ts`
- [ ] Importar: `import { getDashboardStats, getWeeklyData } from '@/lib/dashboard'`
- [ ] Actualizar estadísticas
- [ ] Actualizar gráficos semanales
- [ ] Actualizar desglose por categorías

### Paso 5: Pruebas ⏳ POR HACER

- [ ] Reiniciar servidor Expo (importante!)
- [ ] Probar registro de usuario
- [ ] Verificar usuario en Supabase > Authentication
- [ ] Probar login
- [ ] Probar crear comida
- [ ] Verificar comida en Supabase > Table Editor > meals
- [ ] Probar crear viaje
- [ ] Verificar viaje en Supabase > Table Editor > transport
- [ ] Probar dashboard
- [ ] Verificar estadísticas correctas

### Paso 6: Limpieza ⏳ POR HACER

- [ ] Eliminar carpeta `backend/` (ya no necesaria)
- [ ] Eliminar archivos de API anteriores
- [ ] Actualizar documentación interna si aplica
- [ ] Commit y push de cambios

## 🔍 Verificación Automática

Ejecuta este comando para verificar la configuración:

```bash
npm run check-supabase
```

## 📋 Comandos Útiles

```bash
# Verificar configuración
npm run check-supabase

# Iniciar app
npm start

# Limpiar caché si hay problemas
npx expo start -c

# Ver logs en tiempo real
npx expo start --no-dev --minify
```

## 🆘 Si algo falla...

1. **Error de API Key**
   ```bash
   # Verifica .env
   cat .env
   
   # Debe contener:
   EXPO_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJ...
   
   # Reinicia Expo
   npm start
   ```

2. **Tablas no encontradas**
   - Ve a Supabase > SQL Editor
   - Ejecuta `database/supabase-schema.sql`
   - Verifica en Table Editor que existen las tablas

3. **Permission Denied**
   - Verifica que estés autenticado
   - Verifica que las políticas RLS estén activas
   - Consulta el SQL Editor > Policies

4. **Usuario no se crea**
   - Ve a Authentication > Settings
   - Desactiva "Email confirmations" para desarrollo
   - Reactívalo para producción

## 📚 Recursos

| Necesitas | Consulta |
|-----------|----------|
| Configurar .env | `SUPABASE_SETUP.md` |
| Ejemplos de código | `lib/examples.tsx` |
| Migrar código | `MIGRATION_GUIDE.md` |
| Resumen general | `INTEGRACION_SUPABASE.md` |
| Schema SQL | `database/supabase-schema.sql` |

## 🎉 ¡Éxito!

Cuando todos los checkboxes estén marcados:
- ✅ Backend completamente funcional
- ✅ Base de datos en la nube
- ✅ Autenticación segura
- ✅ Datos sincronizados
- ✅ Sin servidor propio necesario

---

**Último paso**: Actualiza este archivo marcando los checkboxes conforme avances.

Cambia `- [ ]` por `- [x]` cuando completes cada tarea.
