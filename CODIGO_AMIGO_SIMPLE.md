# 🎯 Sistema de Códigos de Amigo - Solución Simple

## 🎉 Nueva Solución: Código de 6 Caracteres

En lugar de compartir UUIDs largos, ahora cada usuario tiene un **código único de 6 caracteres** fácil de compartir y recordar.

---

## ✨ Características

### Código de Amigo:
- **6 caracteres** alfanuméricos
- **Únicos** para cada usuario
- **Fáciles de compartir** (verbal, escrito, mensaje)
- **Sin confusión**: Sin O/0, I/1
- **Automático**: Se genera al crear cuenta

### Ejemplos de códigos:
```
ABC123
XYZ789
QWE456
RTY234
```

---

## 🗄️ Cambios en Base de Datos

### SQL a Ejecutar:

**Archivo:** `database/ADD_FRIEND_CODE.sql`

```sql
-- 1. Agregar columna friend_code
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS friend_code TEXT UNIQUE;

-- 2. Función para generar código único
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

-- 3. Asignar código automáticamente a nuevos usuarios
CREATE OR REPLACE FUNCTION assign_friend_code()
RETURNS TRIGGER AS $$
DECLARE
  new_code TEXT;
  code_exists BOOLEAN;
BEGIN
  LOOP
    new_code := generate_friend_code();
    SELECT EXISTS(SELECT 1 FROM public.profiles WHERE friend_code = new_code) INTO code_exists;
    EXIT WHEN NOT code_exists;
  END LOOP;
  NEW.friend_code := new_code;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 4. Trigger
CREATE TRIGGER on_profile_friend_code
  BEFORE INSERT ON public.profiles
  FOR EACH ROW
  WHEN (NEW.friend_code IS NULL)
  EXECUTE FUNCTION assign_friend_code();

-- 5. Asignar códigos a usuarios existentes
UPDATE public.profiles 
SET friend_code = generate_friend_code()
WHERE friend_code IS NULL;

-- 6. Permitir búsqueda por código
CREATE POLICY "Users can search by friend code"
  ON public.profiles FOR SELECT
  USING (true);
```

### ⚠️ **IMPORTANTE - Debes ejecutar este SQL en Supabase:**

1. Ve a tu dashboard de Supabase
2. Abre el SQL Editor
3. Copia y pega el contenido de `database/ADD_FRIEND_CODE.sql`
4. Ejecuta el script
5. ¡Listo!

---

## 💻 Implementación Frontend

### 1. **Pantalla de Perfil** 📱

```typescript
// Muestra tu código de amigo
<View style={styles.friendCodeCard}>
  <Text style={styles.friendCodeTitle}>🎯 Tu Código de Amigo</Text>
  <View style={styles.codeContainer}>
    <Text style={styles.friendCodeText}>ABC123</Text>
  </View>
  <Text style={styles.friendCodeHint}>
    Comparte este código de 6 caracteres con tus amigos
  </Text>
</View>
```

### 2. **Pantalla de Amigos** 👥

```typescript
// Tu código
<View style={styles.friendCodeCard}>
  <Text style={styles.friendCodeTitle}>🎯 Tu Código de Amigo</Text>
  <Text style={styles.friendCodeText}>ABC123</Text>
</View>

// Agregar amigo
<TextInput
  style={styles.codeInput}
  value={friendCode}
  onChangeText={(text) => setFriendCode(text.toUpperCase())}
  placeholder="ABC123"
  maxLength={6}
/>
```

### 3. **Lógica de Validación** ✅

```typescript
const handleAddFriend = async () => {
  const code = friendCode.trim().toUpperCase();

  // Buscar por friend_code
  const { data: friendProfile } = await supabase
    .from('profiles')
    .select('id')
    .eq('friend_code', code)
    .single();

  if (!friendProfile) {
    Alert.alert('Código Inválido', 'El código no existe');
    return;
  }

  // Agregar amigo...
};
```

---

## 🎯 Flujo de Usuario

### Paso a Paso:

1. **Usuario A abre su Perfil**
   ```
   Ve su código: ABC123
   ```

2. **Usuario A comparte su código**
   ```
   "Oye, mi código es ABC123"
   Por WhatsApp, mensaje, o verbalmente
   ```

3. **Usuario B abre Amigos**
   ```
   Ve su propio código (para compartir también)
   En "Agregar Amigo", escribe: ABC123
   ```

4. **Usuario B presiona "Enviar Solicitud"**
   ```
   ✅ ¡Listo! Ahora son amigos
   ```

5. **Ambos se ven en sus listas**
   ```
   Ranking actualizado automáticamente
   ```

---

## 🎨 Diseño Visual

### Tarjeta de Código (Grande y Destacada):

```
┌──────────────────────────────────────┐
│  🎯 Tu Código de Amigo               │
│                                      │
│  ┌────────────────────────────────┐  │
│  │                                │  │
│  │         A B C 1 2 3           │  │
│  │                                │  │
│  └────────────────────────────────┘  │
│                                      │
│  Comparte este código de 6          │
│  caracteres con tus amigos          │
└──────────────────────────────────────┘
```

### Input de Código:

```
Ingresa el código de 6 caracteres:

┌────────────────────────────────────┐
│                                    │
│        A B C 1 2 3                │
│                                    │
└────────────────────────────────────┘

        [ Enviar Solicitud ]
```

---

## ✅ Ventajas de esta Solución

### 1. **Súper Fácil de Compartir** 🎯
- Solo 6 caracteres
- Se puede decir verbalmente
- Fácil de escribir en mensaje
- Fácil de recordar

### 2. **Sin Confusión** 📝
- No usa O/0, I/1
- Todo en mayúsculas
- Claro y legible

### 3. **Diseño Atractivo** 🎨
- Código grande y destacado
- Colores llamativos (verde)
- Instrucciones claras

### 4. **Seguro** 🔒
- Códigos únicos
- Validación automática
- Sin exponer información privada

### 5. **Experiencia Real** 💬
```
Usuario A: "Oye, agrégame, mi código es ABC123"
Usuario B: "Listo, te agregué"
```

---

## 📊 Comparación

### ❌ ANTES (UUID):
```
"Mi ID es: a1b2c3d4-e5f6-7890-abcd-ef1234567890"
```
- 😫 Muy largo
- 😫 Imposible de decir verbalmente
- 😫 Difícil de escribir
- 😫 Fácil de equivocarse

### ✅ AHORA (Código):
```
"Mi código es: ABC123"
```
- 😊 Corto y simple
- 😊 Fácil de decir
- 😊 Fácil de escribir
- 😊 Difícil equivocarse

---

## 🧪 Casos de Uso

### Escenario 1: En persona
```
Usuario A: "Agrégame, mi código es ABC123"
Usuario B: [Escribe ABC123] ✅
```

### Escenario 2: Por mensaje
```
Usuario A: "Mi código: ABC123"
Usuario B: [Copia y pega] ✅
```

### Escenario 3: Verbalmente por teléfono
```
Usuario A: "A-B-C-uno-dos-tres"
Usuario B: [Escribe mientras escucha] ✅
```

### Escenario 4: En grupo
```
Usuario A: "Mi código está en mi perfil: ABC123"
Todos: [Agregan fácilmente] ✅
```

---

## 📝 Pasos para Implementar

### 1. **Ejecutar SQL en Supabase**
   - Abrir SQL Editor
   - Copiar `ADD_FRIEND_CODE.sql`
   - Ejecutar

### 2. **Verificar que funciona**
   ```sql
   SELECT id, friend_code FROM profiles LIMIT 5;
   ```
   Deberías ver códigos como: ABC123, XYZ789, etc.

### 3. **Reiniciar la app**
   - Los cambios frontend ya están listos
   - Solo ejecuta la app

### 4. **Probar**
   - Ve a Perfil → Verás tu código
   - Ve a Amigos → Ingresa un código de prueba
   - ¡Funciona!

---

## 🔮 Mejoras Futuras (Opcional)

### 1. **Botón de Copiar**
```typescript
<Pressable onPress={() => Clipboard.setString(friendCode)}>
  <Text>📋 Copiar Código</Text>
</Pressable>
```

### 2. **Compartir Directo**
```typescript
<Pressable onPress={shareCode}>
  <Text>📤 Compartir</Text>
</Pressable>
```

### 3. **Código QR**
```typescript
<QRCode value={friendCode} size={150} />
```

### 4. **Personalizar Código**
```
Permitir cambiar código una vez al mes
```

---

## ✨ Resultado Final

### ¿Qué ve el usuario?

**En Perfil:**
```
┌─────────────────────────────┐
│ 🎯 Tu Código de Amigo       │
│                             │
│     [  ABC123  ]            │
│                             │
│ Comparte con tus amigos     │
└─────────────────────────────┘
```

**En Amigos:**
```
Tu código: ABC123

➕ Agregar Amigo

Código del amigo:
┌─────────────────────┐
│    [ ABC123 ]       │
└─────────────────────┘

  [ Enviar Solicitud ]
```

---

## 🎉 ¡Mucho Más Simple!

- ✅ Fácil de compartir
- ✅ Fácil de ingresar
- ✅ Fácil de recordar
- ✅ Diseño atractivo
- ✅ Experiencia real

---

**🌍 EcoTracker - Agregar amigos nunca fue tan fácil** 💚
