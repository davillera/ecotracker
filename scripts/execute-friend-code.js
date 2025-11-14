const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Leer credenciales
require('dotenv').config();

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

console.log('🚀 Ejecutando script de códigos de amigo...\n');

// Crear cliente
const supabase = createClient(supabaseUrl, supabaseKey);

async function executeSQL() {
  try {
    console.log('📝 Leyendo archivo SQL...');
    const sqlPath = path.join(__dirname, '..', 'database', 'ADD_FRIEND_CODE.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');
    
    console.log('✅ Archivo leído correctamente\n');
    
    // Nota: No podemos ejecutar DDL directamente con la anon key
    // Vamos a hacer las operaciones que SÍ podemos hacer desde el cliente
    
    console.log('⚠️  IMPORTANTE:');
    console.log('   El SQL contiene comandos DDL (ALTER TABLE, CREATE FUNCTION)');
    console.log('   que solo pueden ejecutarse desde el Dashboard de Supabase\n');
    
    console.log('📋 LO QUE SÍ PUEDO HACER:');
    console.log('   Generar códigos para usuarios existentes\n');
    
    // Función para generar código
    function generateFriendCode() {
      const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
      let code = '';
      for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return code;
    }
    
    console.log('1️⃣ Verificando si la columna friend_code existe...\n');
    
    // Intentar leer la columna
    const { data: testData, error: testError } = await supabase
      .from('profiles')
      .select('friend_code')
      .limit(1);
    
    if (testError && testError.message.includes('column')) {
      console.log('❌ La columna friend_code NO EXISTE aún\n');
      console.log('⚠️  DEBES EJECUTAR EL SQL MANUALMENTE EN SUPABASE:\n');
      console.log('=' .repeat(70));
      console.log(sqlContent);
      console.log('=' .repeat(70));
      console.log('\n📋 PASOS:');
      console.log('   1. Ve a: https://supabase.com/dashboard');
      console.log('   2. Selecciona tu proyecto');
      console.log('   3. Ve a "SQL Editor"');
      console.log('   4. Pega el SQL de arriba');
      console.log('   5. Presiona "Run"\n');
      return;
    }
    
    console.log('✅ La columna friend_code existe\n');
    
    console.log('2️⃣ Obteniendo usuarios sin código...\n');
    
    const { data: users, error: usersError } = await supabase
      .from('profiles')
      .select('id, friend_code')
      .is('friend_code', null);
    
    if (usersError) {
      console.error('❌ Error obteniendo usuarios:', usersError.message);
      return;
    }
    
    if (!users || users.length === 0) {
      console.log('✅ Todos los usuarios ya tienen código\n');
      
      // Mostrar algunos códigos
      const { data: allUsers } = await supabase
        .from('profiles')
        .select('id, friend_code')
        .limit(5);
      
      if (allUsers && allUsers.length > 0) {
        console.log('📋 Códigos existentes:');
        allUsers.forEach(u => {
          console.log(`   ${u.friend_code}`);
        });
      }
      return;
    }
    
    console.log(`📌 Encontrados ${users.length} usuarios sin código\n`);
    
    console.log('3️⃣ Generando códigos únicos...\n');
    
    let successful = 0;
    let failed = 0;
    
    for (const user of users) {
      let attempts = 0;
      let codeAssigned = false;
      
      while (!codeAssigned && attempts < 10) {
        const newCode = generateFriendCode();
        
        // Verificar que sea único
        const { data: existing } = await supabase
          .from('profiles')
          .select('id')
          .eq('friend_code', newCode)
          .maybeSingle();
        
        if (!existing) {
          // Asignar código
          const { error: updateError } = await supabase
            .from('profiles')
            .update({ friend_code: newCode })
            .eq('id', user.id);
          
          if (!updateError) {
            console.log(`   ✅ ${newCode} asignado`);
            successful++;
            codeAssigned = true;
          } else {
            attempts++;
          }
        } else {
          attempts++;
        }
      }
      
      if (!codeAssigned) {
        console.log(`   ❌ No se pudo asignar código a usuario ${user.id}`);
        failed++;
      }
    }
    
    console.log('\n✅ Proceso completado');
    console.log(`   Exitosos: ${successful}`);
    if (failed > 0) {
      console.log(`   Fallidos: ${failed}`);
    }
    console.log('');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

executeSQL();
