// Script de depuración de variables de entorno
// Ejecutar: node scripts/debug-env.js

console.log('\n🔍 Verificando variables de entorno de Expo...\n');

// Cargar dotenv para leer el archivo .env
require('dotenv').config();

console.log('📁 Variables en .env:');
console.log('  EXPO_PUBLIC_SUPABASE_URL:', process.env.EXPO_PUBLIC_SUPABASE_URL || '❌ NO ENCONTRADA');
console.log('  EXPO_PUBLIC_SUPABASE_ANON_KEY:', process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ? '✅ Configurada (' + process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY.substring(0, 20) + '...)' : '❌ NO ENCONTRADA');

console.log('\n⚠️  IMPORTANTE:');
console.log('  En Expo, las variables de entorno solo se cargan al INICIAR el servidor.');
console.log('  Si modificaste .env, DEBES reiniciar Expo completamente.\n');

console.log('📋 Pasos para solucionar:');
console.log('  1. Detén Expo si está corriendo (Ctrl+C)');
console.log('  2. Limpia caché: npx expo start -c');
console.log('  3. O simplemente: npm start\n');

if (!process.env.EXPO_PUBLIC_SUPABASE_URL || !process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY) {
  console.log('❌ ERROR: Variables no configuradas correctamente');
  console.log('   Verifica que el archivo .env exista en la raíz del proyecto\n');
  process.exit(1);
} else {
  console.log('✅ Variables encontradas correctamente\n');
}
