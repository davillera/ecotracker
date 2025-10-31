# 🔗 Enlaces Rápidos - Integración Supabase

## 📖 Guías por Orden de Lectura

1. **[RESUMEN_INTEGRACION.md](./RESUMEN_INTEGRACION.md)** ⭐
   - Resumen completo de lo que se hizo
   - Lista de archivos creados
   - Comparación antes/después

2. **[CHECKLIST_SUPABASE.md](./CHECKLIST_SUPABASE.md)** ⭐ **EMPIEZA AQUÍ**
   - Checklist paso a paso
   - Marca tareas conforme avances
   - Comandos útiles

3. **[SUPABASE_SETUP.md](./SUPABASE_SETUP.md)**
   - Guía completa de configuración
   - Instrucciones detalladas
   - Troubleshooting

4. **[MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md)**
   - Cómo migrar código existente
   - Mapeo de endpoints a funciones
   - Ejemplos de migración

5. **[lib/examples.tsx](./lib/examples.tsx)**
   - Ejemplos completos de código
   - Hooks personalizados
   - Pantallas de ejemplo

6. **[lib/README.md](./lib/README.md)**
   - API de todos los servicios
   - Documentación de funciones
   - Patrones de uso

## 🎯 Enlaces por Necesidad

### Necesito configurar Supabase
→ [CHECKLIST_SUPABASE.md](./CHECKLIST_SUPABASE.md) (paso a paso)
→ [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) (detallado)

### Necesito ver ejemplos de código
→ [lib/examples.tsx](./lib/examples.tsx) (componentes completos)
→ [lib/README.md](./lib/README.md) (API reference)

### Necesito migrar mi código
→ [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md) (guía rápida)
→ [INTEGRACION_SUPABASE.md](./INTEGRACION_SUPABASE.md) (equivalencias)

### Necesito el schema SQL
→ [database/supabase-schema.sql](./database/supabase-schema.sql)

### Necesito entender qué se instaló
→ [RESUMEN_INTEGRACION.md](./RESUMEN_INTEGRACION.md)

## 🛠️ Archivos por Tipo

### 📚 Servicios (lib/)
- [lib/supabase.ts](./lib/supabase.ts) - Cliente y tipos
- [lib/auth.ts](./lib/auth.ts) - Autenticación
- [lib/meals.ts](./lib/meals.ts) - Comidas
- [lib/transport.ts](./lib/transport.ts) - Transporte
- [lib/dashboard.ts](./lib/dashboard.ts) - Dashboard
- [lib/examples.tsx](./lib/examples.tsx) - Ejemplos
- [lib/README.md](./lib/README.md) - Docs

### 🗄️ Base de Datos
- [database/supabase-schema.sql](./database/supabase-schema.sql)

### ⚙️ Configuración
- [.env.example](./.env.example) - Plantilla
- [scripts/check-supabase.js](./scripts/check-supabase.js) - Verificador

### 📖 Documentación
- [CHECKLIST_SUPABASE.md](./CHECKLIST_SUPABASE.md) - Checklist
- [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) - Setup completo
- [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md) - Migración
- [INTEGRACION_SUPABASE.md](./INTEGRACION_SUPABASE.md) - Resumen técnico
- [RESUMEN_INTEGRACION.md](./RESUMEN_INTEGRACION.md) - Resumen general
- [README.md](./README.md) - Docs principales

## ⚡ Comandos Rápidos

```bash
# Verificar configuración
npm run check-supabase

# Iniciar aplicación
npm start

# Limpiar caché
npx expo start -c
```

## 🌐 Enlaces Externos

- [Supabase Website](https://supabase.com)
- [Supabase Docs](https://supabase.com/docs)
- [Supabase + React Native](https://supabase.com/docs/guides/getting-started/tutorials/with-react-native)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Dashboard de Supabase](https://app.supabase.com)

## 🚀 Flujo Recomendado

```
1. RESUMEN_INTEGRACION.md        (Ver qué se hizo)
         ↓
2. CHECKLIST_SUPABASE.md         (Seguir paso a paso)
         ↓
3. Crear proyecto en Supabase    (5 min)
         ↓
4. Configurar .env               (1 min)
         ↓
5. Ejecutar schema SQL           (2 min)
         ↓
6. Ver lib/examples.tsx          (Aprender cómo usar)
         ↓
7. MIGRATION_GUIDE.md            (Migrar código)
         ↓
8. npm start                     (Probar)
         ↓
9. ¡Éxito! 🎉
```

## 💡 Tips

- **Ctrl+F** en cualquier documento para buscar
- **Usa el checklist** para no perderte
- **Lee los ejemplos** antes de empezar a codear
- **Ejecuta check-supabase** para verificar todo

## 🆘 Ayuda

Si algo no funciona:
1. Lee la sección de Troubleshooting en [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)
2. Ejecuta `npm run check-supabase`
3. Verifica que el schema SQL esté ejecutado
4. Revisa que `.env` esté configurado correctamente

---

**¡Comienza por CHECKLIST_SUPABASE.md y sigue el flujo! 🚀**
