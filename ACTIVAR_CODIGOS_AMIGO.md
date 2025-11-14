# ⚡ ACTIVAR CÓDIGOS DE AMIGO - 5 MINUTOS

## 🎯 Lo que vamos a hacer

Agregar códigos de 6 caracteres (como **ABC123**) para que los usuarios se agreguen fácilmente como amigos.

---

## 📋 PASOS

### 1️⃣ Abre Supabase Dashboard

🌐 **https://supabase.com/dashboard**

### 2️⃣ Selecciona tu proyecto

### 3️⃣ Ve a "SQL Editor"

(En el menú lateral izquierdo)

### 4️⃣ Nueva Query

Click en **"New query"** o el botón **"+"**

### 5️⃣ Pega el SQL

**✅ El SQL ya está copiado en tu portapapeles** 

Solo presiona: **Ctrl+V**

También está en: `database/ADD_FRIEND_CODE.sql`

### 6️⃣ Ejecuta

Presiona **"Run"** o **Ctrl+Enter**

### 7️⃣ Verifica

Ejecuta esta consulta para ver los códigos generados:

```sql
SELECT id, friend_code, created_at 
FROM profiles 
LIMIT 10;
```

Deberías ver códigos como: **ABC123**, **XYZ789**, etc. ✅

---

## 🎉 ¡Listo!

Reinicia tu app y:

1. **En Perfil** → Verás tu código de amigo en una tarjeta verde
2. **En Amigos** → Podrás agregar amigos ingresando su código de 6 caracteres

---

## 💡 Cómo funciona

### Usuario A:
```
1. Abre "Perfil"
2. Ve su código: ABC123
3. Lo comparte: "Oye, mi código es ABC123"
```

### Usuario B:
```
1. Abre "Amigos"
2. Ingresa: ABC123
3. Presiona "Enviar Solicitud"
4. ¡Listo! Son amigos
```

---

## 🐛 Si algo falla

### Error: "Column already exists"
✅ **Ignóralo** - Significa que ya está configurado

### Error: "Permission denied"  
⚠️ Verifica que estés usando tu cuenta correcta de Supabase

### No se muestran códigos en la app
```
1. Verifica que ejecutaste el SQL
2. Reinicia completamente la app
3. Cierra sesión y vuelve a entrar
```

### Los usuarios no tienen código
Ejecuta manualmente:
```sql
UPDATE public.profiles 
SET friend_code = generate_friend_code()
WHERE friend_code IS NULL;
```

---

**⏱️ Tiempo total: 5 minutos**

**🌍 EcoTracker - Agregar amigos nunca fue tan fácil** 💚
