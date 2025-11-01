# ✅ VERIFICAR TIEMPO REAL - Checklist Completo

## 🔍 PASO 1: Verificar que las tablas existen en Supabase

1. Ve a: https://vrusokequxdingvujzvc.supabase.co
2. Haz clic en **Table Editor** en el menú lateral
3. Deberías ver estas 3 tablas:
   - ✅ `profiles`
   - ✅ `meals`
   - ✅ `transport`

❌ **Si NO ves las tablas:**
- Ejecuta el SQL de `database/EJECUTAR_ESTE_SQL.sql`
- O lee `ARREGLAR_AHORA.md`

---

## 🔍 PASO 2: Verificar que Realtime está habilitado

1. Ve a **SQL Editor**
2. Ejecuta esta query:

```sql
SELECT schemaname, tablename 
FROM pg_publication_tables 
WHERE pubname = 'supabase_realtime';
```

**Resultado esperado:**
```
schemaname | tablename
-----------+-----------
public     | meals
public     | transport
```

❌ **Si NO aparecen las tablas:**
- Ejecuta estos comandos en SQL Editor:
```sql
ALTER PUBLICATION supabase_realtime ADD TABLE public.meals;
ALTER PUBLICATION supabase_realtime ADD TABLE public.transport;
```

---

## 🔍 PASO 3: Verificar que hay datos de prueba

1. Ve a **Table Editor**
2. Haz clic en la tabla `meals`
3. Deberías ver al menos 1 registro

❌ **Si NO hay datos:**
- Abre la app
- Ve a la pestaña "Comidas"
- Agrega una comida de prueba

---

## 🔍 PASO 4: Verificar configuración de la app

1. Abre la terminal en tu proyecto
2. Ejecuta:
```bash
npm run check-supabase
```

**Deberías ver:**
```
✅ URL configurada
✅ Key configurada
```

❌ **Si hay error:**
- Verifica el archivo `.env`
- Asegúrate que las variables empiecen con `EXPO_PUBLIC_`

---

## 🔍 PASO 5: Probar el tiempo real

### Método 1: Desde la app

1. **Reinicia expo con caché limpia:**
   ```bash
   npx expo start -c
   ```

2. **Abre la app**

3. **Ve al Dashboard (pestaña Inicio)**
   - Deberías ver tus estadísticas actuales

4. **Cambia a la pestaña Comidas**
   - Agrega una nueva comida (ej: "Ensalada", 200g, Vegetariano)

5. **Vuelve al Dashboard**
   - **¿Se actualizó automáticamente?**
     - ✅ SÍ → ¡Funciona perfecto!
     - ❌ NO → Continúa con el Paso 6

6. **Prueba con Pull-to-Refresh**
   - En el Dashboard, arrastra hacia abajo
   - Suelta para refrescar
   - **¿Se actualizaron los números?**
     - ✅ SÍ → El refresh manual funciona
     - ❌ NO → Revisa la consola (Paso 7)

### Método 2: Desde dos dispositivos/ventanas

Si tienes dos dispositivos o puedes abrir la app en web + móvil:

1. **Dispositivo A:** Abre el Dashboard
2. **Dispositivo B:** Agrega una comida
3. **Dispositivo A:** ¿Se actualizó el Dashboard?
   - ✅ SÍ → ¡Tiempo real funciona!
   - ❌ NO → Problema con Realtime

---

## 🔍 PASO 6: Revisar la consola de Expo

Cuando agregues una comida, deberías ver en la terminal:

```
🍽️ Meals changed in dashboard: INSERT
📊 Stats loaded: { total_co2: X, meals_co2: Y, ... }
```

### Mensajes importantes:

**Al iniciar el dashboard:**
```
📡 Meals subscription status: SUBSCRIBED
📡 Transport subscription status: SUBSCRIBED
🔄 Dashboard focused, loading stats...
📊 Stats loaded: {...}
```

**Al agregar comida:**
```
🍽️ Meals changed in dashboard: INSERT
📊 Stats loaded: {...}
```

❌ **Si NO ves estos mensajes:**
- El tiempo real NO está funcionando
- Continúa con el Paso 7

---

## 🔍 PASO 7: Troubleshooting avanzado

### Problema: Subscription status es "CLOSED" o "CHANNEL_ERROR"

**Solución:**
1. Ve a Supabase → **Settings** → **API**
2. Verifica que **Realtime** esté habilitado
3. Reinicia el servidor Supabase (si es local)

### Problema: No se ven mensajes de console.log

**Solución:**
1. Asegúrate de estar viendo la consola correcta
2. En la terminal de Expo, presiona `J` para abrir DevTools
3. Mira la pestaña "Console"

### Problema: Stats siempre están en 0

**Solución 1 - Verifica zona horaria:**

El problema puede ser la fecha. Ejecuta en SQL Editor:

```sql
-- Ver tus datos con la fecha
SELECT id, user_id, co2, created_at 
FROM meals 
ORDER BY created_at DESC 
LIMIT 5;
```

Si `created_at` tiene una fecha diferente a hoy, es un problema de zona horaria.

**Solución 2 - Agrega datos manualmente:**

```sql
-- Reemplaza 'tu-user-id' con tu ID real
INSERT INTO meals (user_id, name, type, grams, co2, created_at) 
VALUES (
  'tu-user-id',
  'Test',
  'vegetariano',
  100,
  0.13,
  NOW()
);
```

### Problema: Dashboard se actualiza pero tarda mucho (>5 segundos)

**Causas comunes:**
- Conexión lenta
- Plan gratuito de Supabase con límites
- Demasiadas suscripciones abiertas

**Solución:**
- Es normal en desarrollo
- En producción debería ser < 2 segundos

---

## 🎯 CHECKLIST FINAL

Antes de decir que funciona, verifica:

- [ ] Las 3 tablas existen en Supabase
- [ ] Realtime está habilitado para meals y transport
- [ ] Hay al menos 1 comida registrada
- [ ] Las credenciales en `.env` son correctas
- [ ] Al abrir el dashboard, ves tus estadísticas
- [ ] Al agregar comida, el dashboard se actualiza solo (o con pull-to-refresh)
- [ ] En la consola ves los logs "📊 Stats loaded"
- [ ] En la consola ves "📡 subscription status: SUBSCRIBED"

---

## 💡 TIPS

1. **Usa Pull-to-Refresh:** Si el tiempo real no funciona, siempre puedes arrastrar hacia abajo en el dashboard

2. **Botón de refresh:** En el dashboard ahora hay un botón ↻ en la esquina superior derecha

3. **useFocusEffect:** El dashboard se recarga automáticamente cada vez que cambias de pestaña y vuelves

4. **Logs útiles:** Los emojis en los logs te ayudan a identificar qué está pasando:
   - 🍽️ = Cambio en meals
   - 🚗 = Cambio en transport
   - 📊 = Stats cargadas
   - 📡 = Estado de subscripción
   - 🔄 = Pantalla enfocada

---

## 🆘 SI NADA FUNCIONA

1. **Cierra todo:**
   ```bash
   # Mata el proceso de expo
   # Windows: Ctrl + C
   ```

2. **Borra caché:**
   ```bash
   rm -rf node_modules/.cache
   npx expo start -c
   ```

3. **Verifica en Supabase Dashboard:**
   - Ve a **Logs** → **Realtime**
   - Deberías ver conexiones cuando abres la app

4. **Último recurso - Desactiva Realtime:**
   Si el tiempo real causa problemas, comenta las suscripciones en:
   - `app/(tabs)/index.tsx` (líneas 50-90)
   
   El dashboard seguirá funcionando con:
   - Pull-to-refresh
   - Botón manual de refresh
   - useFocusEffect (se actualiza al volver a la pestaña)

---

## ✅ TODO FUNCIONA

Si pasaste todas las verificaciones, ¡tu app está lista! 🎉

**Disfruta tu dashboard en tiempo real:**
- Agrega comidas → Dashboard se actualiza
- Agrega transporte → Dashboard se actualiza
- Cambia de pestaña y vuelve → Dashboard se recarga
- Pull-to-refresh → Recarga manual
- Botón ↻ → Recarga con un toque
