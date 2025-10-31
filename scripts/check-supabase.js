#!/usr/bin/env node

/**
 * Script de verificación de configuración de Supabase
 * Ejecutar con: node scripts/check-supabase.js
 */

const fs = require('fs');
const path = require('path');

console.log('\n🔍 Verificando configuración de Supabase...\n');

let hasErrors = false;

// 1. Verificar que existe .env
const envPath = path.join(__dirname, '..', '.env');
if (!fs.existsSync(envPath)) {
  console.log('❌ No se encontró el archivo .env');
  console.log('   Crea uno a partir de .env.example:');
  console.log('   cp .env.example .env\n');
  hasErrors = true;
} else {
  console.log('✅ Archivo .env encontrado');
  
  // Leer y verificar contenido
  const envContent = fs.readFileSync(envPath, 'utf8');
  
  // Verificar SUPABASE_URL
  if (!envContent.includes('EXPO_PUBLIC_SUPABASE_URL=')) {
    console.log('❌ Falta EXPO_PUBLIC_SUPABASE_URL en .env');
    hasErrors = true;
  } else if (envContent.includes('EXPO_PUBLIC_SUPABASE_URL=tu-proyecto.supabase.co')) {
    console.log('⚠️  EXPO_PUBLIC_SUPABASE_URL aún tiene el valor de ejemplo');
    console.log('   Actualízalo con tu URL de Supabase\n');
    hasErrors = true;
  } else {
    console.log('✅ EXPO_PUBLIC_SUPABASE_URL configurado');
  }
  
  // Verificar SUPABASE_ANON_KEY
  if (!envContent.includes('EXPO_PUBLIC_SUPABASE_ANON_KEY=')) {
    console.log('❌ Falta EXPO_PUBLIC_SUPABASE_ANON_KEY en .env');
    hasErrors = true;
  } else if (envContent.includes('EXPO_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key-aqui')) {
    console.log('⚠️  EXPO_PUBLIC_SUPABASE_ANON_KEY aún tiene el valor de ejemplo');
    console.log('   Actualízalo con tu Anon Key de Supabase\n');
    hasErrors = true;
  } else {
    console.log('✅ EXPO_PUBLIC_SUPABASE_ANON_KEY configurado');
  }
}

// 2. Verificar que existen los archivos de lib
console.log('\n📚 Verificando servicios...');
const libFiles = [
  'lib/supabase.ts',
  'lib/auth.ts',
  'lib/meals.ts',
  'lib/transport.ts',
  'lib/dashboard.ts'
];

let allLibsExist = true;
libFiles.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  if (!fs.existsSync(filePath)) {
    console.log(`❌ Falta ${file}`);
    allLibsExist = false;
    hasErrors = true;
  }
});

if (allLibsExist) {
  console.log('✅ Todos los servicios encontrados');
}

// 3. Verificar que existe el schema SQL
console.log('\n📊 Verificando schema de base de datos...');
const schemaPath = path.join(__dirname, '..', 'database', 'supabase-schema.sql');
if (!fs.existsSync(schemaPath)) {
  console.log('❌ Falta database/supabase-schema.sql');
  hasErrors = true;
} else {
  console.log('✅ Schema SQL encontrado');
  console.log('   Recuerda ejecutarlo en el SQL Editor de Supabase');
}

// 4. Verificar dependencias
console.log('\n📦 Verificando dependencias...');
const packageJsonPath = path.join(__dirname, '..', 'package.json');
if (fs.existsSync(packageJsonPath)) {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  const deps = packageJson.dependencies || {};
  
  if (!deps['@supabase/supabase-js']) {
    console.log('❌ Falta @supabase/supabase-js');
    console.log('   Instala con: npm install @supabase/supabase-js');
    hasErrors = true;
  } else {
    console.log('✅ @supabase/supabase-js instalado');
  }
  
  if (!deps['react-native-url-polyfill']) {
    console.log('❌ Falta react-native-url-polyfill');
    console.log('   Instala con: npm install react-native-url-polyfill');
    hasErrors = true;
  } else {
    console.log('✅ react-native-url-polyfill instalado');
  }
}

// Resumen final
console.log('\n' + '='.repeat(50));
if (hasErrors) {
  console.log('❌ Se encontraron problemas en la configuración');
  console.log('\n📖 Consulta SUPABASE_SETUP.md para instrucciones completas');
} else {
  console.log('✅ ¡Todo configurado correctamente!');
  console.log('\n🚀 Siguiente paso:');
  console.log('   1. Crea un proyecto en supabase.com');
  console.log('   2. Ejecuta el schema SQL en el SQL Editor');
  console.log('   3. npm start');
}
console.log('='.repeat(50) + '\n');

process.exit(hasErrors ? 1 : 0);
